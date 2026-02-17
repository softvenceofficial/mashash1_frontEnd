import { useState, useEffect, useRef } from 'react';
import type { TextType } from './types';

interface InPlaceTextEditorProps {
  textItem: TextType;
  onUpdate: (text: TextType) => void;
  onBlur: () => void;
}

export const InPlaceTextEditor = ({ textItem, onUpdate, onBlur }: InPlaceTextEditorProps) => {
  const [text, setText] = useState(textItem.text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isSaved = useRef(false);

  useEffect(() => {
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const length = textareaRef.current.value.length;
        textareaRef.current.setSelectionRange(length, length);
        
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
      }
    }, 50);
  }, [textItem.id]);

  const saveAndClose = () => {
    if (isSaved.current) return;
    isSaved.current = true;
    onUpdate({ ...textItem, text });
    onBlur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    
    if (e.key === 'Enter' && e.shiftKey) {
      return;
    } else if (e.key === 'Enter') {
      e.preventDefault();
      saveAndClose();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      saveAndClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  return (
    <textarea
      ref={textareaRef}
      value={text}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={saveAndClose}
      style={{
        position: 'absolute',
        left: `${textItem.x}px`,
        top: `${textItem.y}px`,
        fontSize: `${textItem.fontSize}px`,
        fontFamily: textItem.fontFamily,
        fontWeight: textItem.fontStyle?.includes('bold') ? 'bold' : 'normal',
        fontStyle: textItem.fontStyle?.includes('italic') ? 'italic' : 'normal',
        textDecoration: textItem.textDecoration,
        textAlign: textItem.textAlign || 'left',
        color: '#000',
        background: 'rgba(255, 255, 255, 0.95)',
        border: '2px solid #3B82F6',
        borderRadius: '4px',
        outline: 'none',
        resize: 'none',
        minWidth: '200px',
        maxWidth: '600px',
        zIndex: 1000,
        whiteSpace: 'pre-wrap',
        overflow: 'hidden',
        padding: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      }}
    />
  );
};
