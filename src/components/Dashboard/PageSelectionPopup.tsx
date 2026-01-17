import { useState, useEffect } from 'react';
import { X, Layout, BookOpen, FileImage } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DESIGN_SYSTEM } from '@/theme/designSystem';

interface PageSelectionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (page: 'left' | 'right' | 'current') => void;
  currentPageIndex: number;
  totalPages: number;
}

const PageSelectionPopup = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  currentPageIndex, 
  totalPages 
}: PageSelectionPopupProps) => {
  const [selectedOption, setSelectedOption] = useState<'left' | 'right' | 'current'>('current');

  useEffect(() => {
    if (isOpen) setSelectedOption('current');
  }, [isOpen]);

  if (!isOpen) return null;

  const isCover = currentPageIndex === 0;
  const isSpreadView = !isCover && currentPageIndex % 2 !== 0;
  
  const hasRightPage = isSpreadView && (currentPageIndex + 1 < totalPages);

  const handleConfirm = () => {
    onSelect(selectedOption);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-900 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative rounded-xl p-6 w-[480px] shadow-2xl border animate-in zoom-in-95 duration-200"
        style={{ 
          backgroundColor: DESIGN_SYSTEM.colors.background.secondary,
          borderColor: 'rgba(255,255,255,0.1)'
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <FileImage size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Import Image</h2>
              <p className="text-sm text-zinc-400">Choose placement for your image</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-3 mb-8">
          <div 
            onClick={() => setSelectedOption(isSpreadView ? 'left' : 'current')}
            className={cn(
              "relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group w-1/2",
              selectedOption === 'left' || selectedOption === 'current'
                ? "border-indigo-500 bg-indigo-500/10"
                : "border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-700/50"
            )}
          >
            <div className="flex flex-col justify-center items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                selectedOption === 'left' || selectedOption === 'current' ? "bg-indigo-500 text-white" : "bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700"
              )}>
                {isSpreadView ? <BookOpen size={20} /> : <Layout size={20} />}
              </div>
              <div className="flex flex-col justify-center items-center">
                <h3 className="text-white font-semibold">
                  {isCover ? 'Cover Page' : isSpreadView ? 'Left Page' : 'Current Page'}
                </h3>
              </div>
              <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                selectedOption === 'left' || selectedOption === 'current' ? "border-indigo-500" : "border-zinc-600"
              )}>
                {(selectedOption === 'left' || selectedOption === 'current') && (
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                )}
              </div>
            </div>
          </div>

          {hasRightPage && (
            <div 
              onClick={() => setSelectedOption('right')}
              className={cn(
                "relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group w-1/2",
                selectedOption === 'right'
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-700/50"
              )}
            >
              <div className="flex flex-col justify-center items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  selectedOption === 'right' ? "bg-indigo-500 text-white" : "bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700"
                )}>
                  <BookOpen size={20} className="scale-x-[-1]" />
                </div>
                <div className="flex  flex-col justify-center items-center">
                  <h3 className="text-white font-semibold">Right Page</h3>
                </div>
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  selectedOption === 'right' ? "border-indigo-500" : "border-zinc-600"
                )}>
                  {selectedOption === 'right' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl text-zinc-300 font-medium hover:bg-zinc-700/50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            style={{ backgroundColor: DESIGN_SYSTEM.colors.primary }}
            className="flex-1 px-4 py-3 text-white rounded-xl hover:opacity-90 transition-opacity font-bold shadow-lg shadow-indigo-500/20"
          >
            Import Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageSelectionPopup;
