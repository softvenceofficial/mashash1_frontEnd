import { ArrowUp, ArrowDown } from 'lucide-react';

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
  return (
    <>
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <div 
        className="absolute bg-gray-800 border border-gray-700 rounded-lg shadow-2xl py-2 min-w-[180px] z-50"
        style={{ left: `calc(${x}px - 150px)`, top: `calc(${y}px - 300px)` }}
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
