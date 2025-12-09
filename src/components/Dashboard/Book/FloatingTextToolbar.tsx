import { useState } from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { SketchPicker } from 'react-color';
import type { TextType } from './types';

interface FloatingTextToolbarProps {
  textItem: TextType;
  onUpdate: (text: TextType) => void;
  position: { x: number; y: number };
}

type FontStyle = 'bold' | 'italic' | 'bold italic' | 'normal';
type TextDecoration = 'underline' | 'line-through' | 'none';
type TextAlign = 'left' | 'center' | 'right' | 'justify';

const FONTS = ['Arial', 'Roboto', 'Times New Roman', 'Georgia', 'Courier New', 'Verdana'];
const SIZES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];

export const FloatingTextToolbar = ({ textItem, onUpdate, position }: FloatingTextToolbarProps) => {
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showSizeMenu, setShowSizeMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);

  const toggleBold = () => {
    const current = textItem.fontStyle || 'normal';
    const newStyle = current.includes('bold') 
      ? current.replace('bold', '').trim() || 'normal'
      : current === 'italic' ? 'bold italic' : 'bold';
    onUpdate({ ...textItem, fontStyle: newStyle as 'bold' | 'italic' | 'bold italic' | 'normal' });
  };

  const toggleItalic = () => {
    const current = textItem.fontStyle || 'normal';
    const newStyle = current.includes('italic')
      ? current.replace('italic', '').trim() || 'normal'
      : current === 'bold' ? 'bold italic' : 'italic';
    onUpdate({ ...textItem, fontStyle: newStyle as 'bold' | 'italic' | 'bold italic' | 'normal' });
  };

  const toggleUnderline = () => {
    onUpdate({ 
      ...textItem, 
      textDecoration: textItem.textDecoration === 'underline' ? 'none' : 'underline' 
    });
  };

  return (
    <div 
      className="absolute bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-2 flex items-center gap-1 z-50"
      style={{ left: position.x, top: position.y - 60 }}
    >
      {/* Font Family */}
      <div className="relative">
        <button 
          onClick={() => setShowFontMenu(!showFontMenu)}
          className="px-3 py-1.5 bg-gray-700 rounded-md text-sm text-gray-300 hover:bg-gray-600 min-w-[120px] text-left"
        >
          {textItem.fontFamily}
        </button>
        {showFontMenu && (
          <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {FONTS.map(font => (
              <div
                key={font}
                onClick={() => {
                  onUpdate({ ...textItem, fontFamily: font });
                  setShowFontMenu(false);
                }}
                className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-sm text-gray-300"
                style={{ fontFamily: font }}
              >
                {font}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Font Size */}
      <div className="relative">
        <button 
          onClick={() => setShowSizeMenu(!showSizeMenu)}
          className="px-3 py-1.5 bg-gray-700 rounded-md text-sm text-gray-300 hover:bg-gray-600 min-w-[60px]"
        >
          {textItem.fontSize}px
        </button>
        {showSizeMenu && (
          <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {SIZES.map(size => (
              <div
                key={size}
                onClick={() => {
                  onUpdate({ ...textItem, fontSize: size });
                  setShowSizeMenu(false);
                }}
                className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-sm text-gray-300"
              >
                {size}px
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Formatting Buttons */}
      <div className="flex items-center gap-1 ml-2 border-l border-gray-700 pl-2">
        <button 
          onClick={toggleBold}
          className={`p-2 rounded text-gray-300 ${textItem.fontStyle?.includes('bold') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button 
          onClick={toggleItalic}
          className={`p-2 rounded text-gray-300 ${textItem.fontStyle?.includes('italic') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <button 
          onClick={toggleUnderline}
          className={`p-2 rounded text-gray-300 ${textItem.textDecoration === 'underline' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
        >
          <Underline className="w-4 h-4" />
        </button>
      </div>

      {/* Color Picker */}
      <div className="relative ml-2">
        <button 
          onClick={() => setShowColorMenu(!showColorMenu)}
          className="w-8 h-8 rounded-full border-2 border-gray-600"
          style={{ backgroundColor: textItem.fill }}
        />
        {showColorMenu && (
          <div className="absolute top-full left-0 mt-1 z-50">
            <SketchPicker 
              color={textItem.fill} 
              onChangeComplete={(color) => {
                onUpdate({ ...textItem, fill: color.hex });
                setShowColorMenu(false);
              }}
            />
          </div>
        )}
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-1 ml-2 border-l border-gray-700 pl-2">
        {(['left', 'center', 'right'] as const).map(align => (
          <button
            key={align}
            onClick={() => onUpdate({ ...textItem, textAlign: align })}
            className={`p-2 rounded text-gray-300 ${textItem.textAlign === align ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
          >
            {align === 'left' && <AlignLeft className="w-4 h-4" />}
            {align === 'center' && <AlignCenter className="w-4 h-4" />}
            {align === 'right' && <AlignRight className="w-4 h-4" />}
          </button>
        ))}
      </div>
    </div>
  );
};
