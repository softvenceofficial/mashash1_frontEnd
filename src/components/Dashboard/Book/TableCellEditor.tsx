import React, { useEffect, useRef, useState } from 'react';
import type{ TableCell } from './types';

interface TableCellEditorProps {
  cell: TableCell;
  x: number;
  y: number;
  width: number;
  height: number;
  onSave: (content: string) => void;
  onClose: () => void;
}

const TableCellEditor: React.FC<TableCellEditorProps> = ({
  cell,
  x,
  y,
  width,
  height,
  onSave,
  onClose
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(cell.content);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }

    const updatePosition = () => {
      if (containerRef.current) {
        const bookContainer = document.querySelector('.stf__wrapper');
        if (bookContainer) {
          const bookRect = bookContainer.getBoundingClientRect();
          const scrollX = window.scrollX || window.pageXOffset;
          const scrollY = window.scrollY || window.pageYOffset;
          
          containerRef.current.style.left = `${bookRect.left + x + scrollX}px`;
          containerRef.current.style.top = `${bookRect.top + y + scrollY}px`;
        } else {
          // Fallback positioning
          const scrollX = window.scrollX || window.pageXOffset;
          const scrollY = window.scrollY || window.pageYOffset;
          containerRef.current.style.left = `${x + scrollX}px`;
          containerRef.current.style.top = `${y + scrollY}px`;
        }
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [x, y]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSave(value);
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      ref={containerRef}
      className="fixed z-[1000] bg-white border-2 border-blue-500 shadow-lg rounded-sm"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        minHeight: `${height}px`
      }}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => { onSave(value); onClose(); }}
        className="w-full h-full resize-none outline-none p-2"
        style={{
          minHeight: `${Math.max(height - 10, 20)}px`,
          fontSize: `${cell.fontSize}px`,
          fontFamily: cell.fontFamily,
          color: "#000000",
        }}
      />
    </div>
  );
};

export default TableCellEditor;
