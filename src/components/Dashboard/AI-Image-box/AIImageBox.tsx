/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, X, Check, Image as ImageIcon, Loader2 } from 'lucide-react';

// --- API Helper ---
const generateImage = async (prompt: string, apiKey: string) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instances: [{ prompt: prompt }],
          parameters: { sampleCount: 1 },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const result = await response.json();
    const base64Image = result.predictions?.[0]?.bytesBase64Encoded;
    if (base64Image) {
      return `data:image/png;base64,${base64Image}`;
    }
    return null;
  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }
};

// Voice Waveform Visualization
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

const AIImageBox = () => {
  const [prompt, setPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<Array<{ url: string; prompt: string } | null>>(Array(50).fill(null));

  const recognitionRef = useRef<any>(null);

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
    if (!prompt.trim()) return;

    setIsLoading(true);
    const apiKey = ""; // Add your API key here
    
    try {
      const newImageBase64 = await generateImage(prompt, apiKey);
      
      if (newImageBase64) {
        setImages(prevImages => {
          const newImages = [...prevImages];
          newImages.pop();
          newImages.unshift({ url: newImageBase64, prompt: prompt });
          return newImages;
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="bg-background text-foreground p-4 font-sans selection:bg-primary selection:text-primary-foreground">
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
                placeholder="Command what type of image you want..."
                className="w-full bg-transparent border-none outline-none resize-none text-foreground placeholder-muted-foreground h-12 py-2"
              />
              <div className="flex justify-end items-center gap-3">
                <button 
                  onClick={toggleListening}
                  className="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                  title="Voice Command"
                >
                  <Mic size={20} />
                </button>
                <button 
                  onClick={handleGenerate}
                  disabled={isLoading || !prompt.trim()}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    isLoading || !prompt.trim() 
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
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
                    <p className="text-xs text-foreground line-clamp-2">{img.prompt}</p>
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

      </div>
    </div>
  );
};

export default AIImageBox;