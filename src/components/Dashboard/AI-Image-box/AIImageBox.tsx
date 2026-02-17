/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, X, Check, Image as ImageIcon, Loader2, Eye } from 'lucide-react';
import { useGenerateImageMutation } from '@/redux/endpoints/bookApi';
import { toast } from 'sonner';
import { getImageUrl } from '@/lib/utils';

const VoiceVisualizer = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className="flex items-center gap-1 h-8">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className={`border bg-foreground rounded-full transition-all duration-150 ${
            isActive ? 'animate-pulse' : ''
          }`}
          style={{
            height: isActive ? `${Math.max(20, Math.random() * 100)}%` : '20%',
            opacity: isActive ? 1 : 0.5
          }}
        />
      ))}
    </div>
  );
};

interface ApiImage {
  id: number;
  image: string;
  generated_at: string;
  book: number;
}

interface AIImageBoxProps {
  bookId: number | null;
  selectedStyleId: number;
  selectedSizeId: number;
  existingImages?: ApiImage[];
}

const AIImageBox = ({ bookId, selectedStyleId, selectedSizeId, existingImages = [] }: AIImageBoxProps) => {
  const [prompt, setPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [images, setImages] = useState<Array<{ url: string; prompt: string } | null>>(Array(50).fill(null));
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [generateImage, { isLoading }] = useGenerateImageMutation();
  const recognitionRef = useRef<any>(null);
  
  useEffect(() => {
    if (existingImages && existingImages.length > 0) {
      setImages(() => {
        const newImages = Array(50).fill(null);
        existingImages.forEach((img, index) => {
          if (index < 50) {
            newImages[index] = {
              url: getImageUrl(img.image),
              prompt: `Generated on ${new Date(img.generated_at).toLocaleDateString()}`
            };
          }
        });
        return newImages;
      });
    }
  }, [existingImages]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        setPrompt(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      setPrompt('');
    }
  };

  const handleVoiceConfirm = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);
    if (prompt.trim()) {
      handleGenerate();
    }
  };

  const handleVoiceCancel = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);
    setPrompt('');
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    if (!bookId) {
      toast.error('Please save your artbook before generating images.');
      return;
    }

    if (!selectedStyleId) {
      toast.error('Please select a style from the right panel');
      return;
    }

    if (!selectedSizeId) {
      toast.error('Please select a book size from the toolbox');
      return;
    }

    try {
      const result = await generateImage({
        book_id: bookId,
        style_id: selectedStyleId,
        size_id: selectedSizeId,
        prompt: prompt
      }).unwrap();
      
      if (result.image) {
        const imageUrl = getImageUrl(result.image);
        setImages(prevImages => {
          const newImages = [...prevImages];
          newImages.pop();
          newImages.unshift({ url: imageUrl, prompt: prompt });
          return newImages;
        });
        toast.success('Image generated successfully!');
        setPrompt('');
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      const errorMessage = err?.data?.message || err?.message || 'Failed to generate image';
      toast.error(errorMessage);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };
  
  

  const handleDragStart = (e: React.DragEvent<HTMLImageElement>, url: string) => {
    e.dataTransfer.setData('image', url);
    e.dataTransfer.effectAllowed = 'copy';
  };

  
  return (
    <div className="bg-background text-foreground p-4 pb-0 pt-2 font-sans selection:bg-primary selection:text-primary-foreground">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className={`relative rounded-xl transition-all duration-300 ${isListening ? 'bg-card' : 'bg-card'}`} style={{
          background: isListening ? '' : 'linear-gradient(160deg, rgba(255, 201, 9, 1) 0%, rgba(255, 93, 24, 1) 50%, rgba(255, 131, 39, 1) 100%)',
          padding: '1px'
        }}>
          <div className="bg-card rounded-xl">
          
          {!isListening && (
            <div className="p-4 flex flex-col gap-2">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={bookId ? "Command what type of image you want..." : "Save book to generate images..."}
                disabled={!bookId}
                className="w-full bg-transparent border-none outline-none resize-none text-foreground placeholder-muted-foreground h-10 py-2 disabled:opacity-50"
              />
              <div className="flex justify-end items-center gap-3">
                <button 
                  onClick={toggleListening}
                  disabled={!bookId}
                  className="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  title="Voice Command"
                >
                  <Mic size={20} />
                </button>
                <button 
                  onClick={handleGenerate}
                  disabled={isLoading || !prompt.trim() || !bookId}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    isLoading || !prompt.trim() || !bookId
                      ? 'text-muted-foreground bg-muted' 
                      : 'text-primary-foreground bg-primary hover:bg-primary/90 shadow-lg'
                  }`}
                  title="Generate"
                >
                   {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>
            </div>
          )}

          {isListening && (
            <div className="h-[106px] flex items-center justify-between px-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex-1 mr-4 overflow-hidden">
                {prompt ? (
                  <p className="text-lg text-foreground font-medium truncate">{prompt}</p>
                ) : (
                  <p className="text-muted-foreground italic">Listening...</p>
                )}
                <div className="w-full border-b border-dashed border-border mt-2"></div>
              </div>
              <div className="mx-4">
                <VoiceVisualizer isActive={isListening} />
              </div>
              <div className="flex items-center gap-4 pl-4 border-l border-border">
                <button 
                  onClick={handleVoiceCancel}
                  className="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X size={20} />
                </button>
                <button 
                  onClick={handleVoiceConfirm}
                  className="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-success transition-colors"
                >
                  <Check size={20} />
                </button>
              </div>
            </div>
          )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[650px] overflow-scroll">
          {images.map((img, index) => (
            <div 
              key={index} 
              className="aspect-4/3 relative group rounded-lg overflow-hidden bg-secondary"
            >
              {img ? (
                <>
                  <img 
                    src={img.url} 
                    alt={img.prompt} 
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, img.url)}
                    onClick={() => setPreviewImage(img.url)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                  />
                  <div 
                    onClick={() => setPreviewImage(img.url)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
                  >
                    <div className="bg-background/90 text-foreground px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-sm">
                      <Eye size={16} />
                      <span className="text-sm font-medium">Preview</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                  <div className="p-4 rounded-xl bg-muted mb-2">
                    <ImageIcon size={24} />
                  </div>
                </div>
              )}
              
              {isLoading && index === 0 && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
                  <Loader2 className="text-primary animate-spin" size={32} />
                </div>
              )}
            </div>
          ))}
        </div>

        {previewImage && (
          <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={() => setPreviewImage(null)}
          >
            <div 
              className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={previewImage} 
                alt="Full Preview" 
                className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl border border-white/10"
              />
              <button 
                onClick={() => setPreviewImage(null)}
                className="absolute -top-4 -right-4 md:-top-6 md:-right-6 p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors shadow-lg"
                title="Close preview"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIImageBox;