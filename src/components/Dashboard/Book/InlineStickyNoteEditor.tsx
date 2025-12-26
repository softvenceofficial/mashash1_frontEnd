import { useState, useEffect, useRef } from 'react';
import type{ StickyNoteType } from './types';

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
    onUpdate({ ...note, text, color, textColor, isExpanded: true });
    onBlur();
  };

  const colors = ['#fef3c7', '#dbeafe', '#dcfce7', '#fce7f3', '#e0e7ff', '#fef9c3', '#000000'];
  const textColors = ['#000000', '#ffffff', '#dc2626', '#2563eb', '#059669'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/50 pointer-events-auto" onClick={onBlur} />
      <div 
        className="relative w-96 h-96 rounded-lg shadow-2xl p-4 pointer-events-auto"
        style={{ backgroundColor: color }}
        onClick={(e) => e.stopPropagation()}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-64 bg-transparent resize-none outline-none p-2"
          style={{ color: textColor, fontSize: '16px', fontFamily: 'Roboto', lineHeight: '1.5' }}
          placeholder="Type your note here..."
        />
        
        <div className="absolute bottom-4 left-4 right-4 space-y-4">
          <div>
            <label className="block text-sm mb-1 font-medium" style={{ color: textColor }}>Note Color</label>
            <div className="flex gap-2 flex-wrap">
              {colors.map((c) => (
                <button
                  key={c}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${c === color ? 'border-white scale-110' : 'border-gray-300'}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  title={c}
                  type="button"
                />
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm mb-1 font-medium" style={{ color: textColor }}>Text Color</label>
            <div className="flex gap-2 flex-wrap">
              {textColors.map((c) => (
                <button
                  key={c}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${c === textColor ? 'border-white scale-110' : 'border-gray-300'}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setTextColor(c)}
                  title={c}
                  type="button"
                />
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={onBlur}
              className="px-4 py-2 text-sm rounded bg-white/20 hover:bg-white/30 transition-colors"
              style={{ color: textColor }}
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm rounded bg-white hover:bg-gray-100 transition-colors font-medium"
              style={{ color: '#000' }}
              type="button"
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
