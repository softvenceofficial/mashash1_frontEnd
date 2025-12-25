import { useState, useEffect, useRef } from 'react';
import { StickyNoteType } from './types';

interface InlineStickyNoteEditorProps {
  note: StickyNoteType;
  onUpdate: (updatedNote: StickyNoteType) => void;
  onBlur: () => void;
}

const InlineStickyNoteEditor = ({ note, onUpdate, onBlur }: InlineStickyNoteEditorProps) => {
  const [text, setText] = useState(note.text);
  const [color, setColor] = useState(note.color);
  const [textColor, setTextColor] = useState(note.textColor || '#000000');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
    textareaRef.current?.select();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      onBlur();
    }
  };

  const handleSave = () => {
    onUpdate({ ...note, text, color, textColor });
    onBlur();
  };

  const colors = ['#fef3c7', '#dbeafe', '#dcfce7', '#fce7f3', '#e0e7ff', '#fef9c3'];
  const textColors = ['#000000', '#ffffff', '#dc2626', '#2563eb', '#059669'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onBlur} />
      <div 
        className="relative w-96 h-96 rounded-lg shadow-2xl p-4"
        style={{ backgroundColor: color }}
        onClick={(e) => e.stopPropagation()}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-64 bg-transparent resize-none outline-none p-2"
          style={{ color: textColor, fontSize: '16px', fontFamily: 'Roboto' }}
          placeholder="Type your note here..."
        />
        
        <div className="absolute bottom-4 left-4 right-4 space-y-4">
          <div>
            <label className="block text-sm mb-1" style={{ color: textColor }}>Note Color</label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  className={`w-6 h-6 rounded-full border-2 ${c === color ? 'border-white' : 'border-gray-300'}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm mb-1" style={{ color: textColor }}>Text Color</label>
            <div className="flex gap-2">
              {textColors.map((c) => (
                <button
                  key={c}
                  className={`w-6 h-6 rounded-full border-2 ${c === textColor ? 'border-white' : 'border-gray-300'}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setTextColor(c)}
                />
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={onBlur}
              className="px-4 py-2 text-sm rounded bg-white/20 hover:bg-white/30"
              style={{ color: textColor }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm rounded bg-white hover:bg-gray-100 text-black"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InlineStickyNoteEditor;
