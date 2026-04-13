import { ArrowUp, ArrowDown } from 'lucide-react';
import { useRef, useState, useLayoutEffect } from 'react';

interface TextContextMenuProps {
  x: number;
  y: number;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onFormat: (format: 'bold' | 'italic' | 'underline') => void;
  onClose: () => void;
  onLayerAction?: (action: 'front' | 'back' | 'forward' | 'backward') => void;
}

export const TextContextMenu = ({ 
  x, y, onCopy, onCut, onPaste, onDelete, onFormat, onClose, onLayerAction 
}: TextContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  
  const [position, setPosition] = useState({ left: x, top: y });
  // Opacity prevents layout jumping while still allowing getBoundingClientRect to read dimensions
  const [opacity, setOpacity] = useState(0);

  useLayoutEffect(() => {
    if (menuRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const { innerWidth, innerHeight } = window;
      const padding = 12; // Keeps the menu slightly away from the exact screen edge

      let safeLeft = x;
      let safeTop = y;

      // 1. Right Edge Collision
      if (safeLeft + menuRect.width > innerWidth - padding) {
        safeLeft = innerWidth - menuRect.width - padding;
      }
      
      // 2. Bottom Edge Collision
      if (safeTop + menuRect.height > innerHeight - padding) {
        safeTop = innerHeight - menuRect.height - padding;
      }

      // 3. Left/Top Edge Fallbacks (Prevents pushing off the top/left on small screens)
      if (safeLeft < padding) safeLeft = padding;
      if (safeTop < padding) safeTop = padding;

      setPosition({ left: safeLeft, top: safeTop });
      setOpacity(1);
    }
  }, [x, y]);

  return (
    <>
      <div 
        className="fixed inset-0 z-40"
        onContextMenu={(e) => {
          e.preventDefault(); // Prevent native right-click on the backdrop
          onClose();
        }}
        onClick={onClose}
      />
      
      <div 
        ref={menuRef}
        // CRUCIAL CHANGE: absolute -> fixed. 
        // This forces coordinates to anchor to the viewport, making the boundary math 100% accurate.
        className="fixed bg-gray-800 border border-gray-700 rounded-lg shadow-2xl py-2 min-w-[180px] z-50 transition-opacity duration-75"
        style={{ 
          left: `${position.left}px`, 
          top: `${position.top}px`,
          opacity: opacity,
          pointerEvents: opacity === 0 ? 'none' : 'auto' // Prevent accidental clicks before math is done
        }}
      >
        <button onClick={onCopy} className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700">
          Copy (Ctrl+C)
        </button>
        <button onClick={onCut} className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700">
          Cut (Ctrl+X)
        </button>
        <button onClick={onPaste} className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700">
          Paste (Ctrl+V)
        </button>
        <div className="h-px bg-gray-700 my-1" />
        <button onClick={() => onFormat('bold')} className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700">
          Bold (Ctrl+B)
        </button>
        <button onClick={() => onFormat('italic')} className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700">
          Italic (Ctrl+I)
        </button>
        <button onClick={() => onFormat('underline')} className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700">
          Underline (Ctrl+U)
        </button>
        
        {onLayerAction && (
          <>
            <div className="h-px bg-gray-700 my-1" />
            <button onClick={() => onLayerAction('front')} className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center gap-2">
              <ArrowUp size={14} /> Bring to Front
            </button>
            <button onClick={() => onLayerAction('forward')} className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center gap-2">
              <ArrowUp size={14} /> Bring Forward
            </button>
            <button onClick={() => onLayerAction('backward')} className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center gap-2">
              <ArrowDown size={14} /> Send Backward
            </button>
            <button onClick={() => onLayerAction('back')} className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center gap-2">
              <ArrowDown size={14} /> Send to Back
            </button>
          </>
        )}
        
        <div className="h-px bg-gray-700 my-1" />
        <button onClick={onDelete} className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700">
          Delete (Del)
        </button>
      </div>
    </>
  );
};