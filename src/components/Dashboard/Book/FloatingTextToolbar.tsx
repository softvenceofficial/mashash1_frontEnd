import { useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  List, 
  ListOrdered, 
  Type, 
  ChevronDown, 
  Minus, 
  Plus,
  MoveVertical,
  Scaling
} from 'lucide-react';
import { SketchPicker } from 'react-color';
import type { TextType } from './types';
import { cn } from '@/lib/utils';

interface FloatingTextToolbarProps {
  textItem: TextType;
  onUpdate: (text: TextType) => void;
  position: { x: number; y: number };
}

const FONTS = [
  'Roboto', 'Arial', 'Times New Roman', 'Georgia', 'Courier New', 
  'Verdana', 'Anton', 'Bebas Neue', 'Caveat', 'Comfortaa', 
  'Dancing Script', 'Fredoka', 'Heebo', 'Josefin Sans', 
  'Lobster', 'Lora', 'Merriweather', 'Montserrat', 'Oswald', 
  'Pacifico', 'Playfair Display', 'Quicksand', 'Raleway', 
  'Source Code Pro', 'Work Sans'
];

export const FloatingTextToolbar = ({ textItem, onUpdate, position }: FloatingTextToolbarProps) => {
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showSpacingMenu, setShowSpacingMenu] = useState(false);

  // Close menus when clicking outside (handled via simple overlay or careful toggling)
  
  // --- Formatting Logic ---

  const toggleBold = () => {
    const current = textItem.fontStyle || 'normal';
    const newStyle = current.includes('bold') 
      ? current.replace('bold', '').trim() || 'normal'
      : current === 'italic' ? 'bold italic' : 'bold';
    onUpdate({ ...textItem, fontStyle: newStyle as any });
  };

  const toggleItalic = () => {
    const current = textItem.fontStyle || 'normal';
    const newStyle = current.includes('italic')
      ? current.replace('italic', '').trim() || 'normal'
      : current === 'bold' ? 'bold italic' : 'italic';
    onUpdate({ ...textItem, fontStyle: newStyle as any });
  };

  const toggleDecoration = (type: 'underline' | 'line-through') => {
    // Note: This logic assumes mutually exclusive decorations based on the simple type definition.
    // If you need both, the type logic in your app needs to support string concatenation.
    const current = textItem.textDecoration;
    onUpdate({ 
      ...textItem, 
      textDecoration: current === type ? 'none' : type 
    });
  };

  // --- List Logic ---
  const toggleList = (type: 'bullet' | 'number') => {
    const lines = textItem.text.split('\n');
    const isTypeActive = textItem.listType === type;
    
    const newLines = lines.map((line, index) => {
      // Remove existing prefixes
      let cleanLine = line.replace(/^[•\-\*]\s+/, '').replace(/^\d+\.\s+/, '');
      
      if (!isTypeActive) {
        if (type === 'bullet') return `• ${cleanLine}`;
        if (type === 'number') return `${index + 1}. ${cleanLine}`;
      }
      return cleanLine;
    });

    onUpdate({
      ...textItem,
      text: newLines.join('\n'),
      listType: isTypeActive ? 'none' : type
    });
  };

  // --- Transform Logic ---
  const applyTransform = (type: 'uppercase' | 'lowercase' | 'capitalize') => {
    let newText = textItem.text;
    if (type === 'uppercase') newText = newText.toUpperCase();
    if (type === 'lowercase') newText = newText.toLowerCase();
    if (type === 'capitalize') {
      newText = newText.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
    }
    
    onUpdate({
      ...textItem,
      text: newText,
      textTransform: type
    });
  };

  const handleFontSize = (delta: number) => {
    const newSize = Math.max(8, Math.min(120, (textItem.fontSize || 16) + delta));
    onUpdate({ ...textItem, fontSize: newSize });
  };

  return (
    <div 
      className="absolute bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-2 flex items-center gap-2 z-99 animate-in fade-in zoom-in-95 duration-200"
      style={{ left: position.x, top: position.y - 20 }}
    >
      {/* 1. Font Family & Size */}
      <div className="flex items-center gap-1 border-r border-zinc-700 pr-2">
        <div className="relative">
          <button 
            onClick={() => { setShowFontMenu(!showFontMenu); setShowColorMenu(false); setShowSpacingMenu(false); }}
            className="flex items-center justify-between w-28 px-2 py-1.5 bg-zinc-800 rounded-md text-xs text-zinc-200 hover:bg-zinc-700 transition-colors"
          >
            <span className="truncate max-w-[80px]">{textItem.fontFamily}</span>
            <ChevronDown className="w-3 h-3 text-zinc-400" />
          </button>
          
          {showFontMenu && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50 custom-scrollbar">
              {FONTS.map(font => (
                <div
                  key={font}
                  onClick={() => {
                    onUpdate({ ...textItem, fontFamily: font });
                    setShowFontMenu(false);
                  }}
                  className={cn(
                    "px-3 py-2 text-sm text-zinc-300 hover:bg-indigo-600 hover:text-white cursor-pointer",
                    textItem.fontFamily === font && "bg-indigo-600/20 text-indigo-300"
                  )}
                  style={{ fontFamily: font }}
                >
                  {font}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center bg-zinc-800 rounded-md">
          <button 
            onClick={() => handleFontSize(-1)}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-l-md"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-8 text-center text-xs font-mono text-zinc-200">
            {textItem.fontSize}
          </span>
          <button 
            onClick={() => handleFontSize(1)}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-r-md"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 2. Basic Formatting */}
      <div className="flex items-center gap-0.5 border-r border-zinc-700 pr-2">
        <ToolbarBtn 
          isActive={textItem.fontStyle?.includes('bold')} 
          onClick={toggleBold} 
          icon={<Bold className="w-4 h-4" />} 
          tooltip="Bold"
        />
        <ToolbarBtn 
          isActive={textItem.fontStyle?.includes('italic')} 
          onClick={toggleItalic} 
          icon={<Italic className="w-4 h-4" />}
          tooltip="Italic"
        />
        <ToolbarBtn 
          isActive={textItem.textDecoration === 'underline'} 
          onClick={() => toggleDecoration('underline')} 
          icon={<Underline className="w-4 h-4" />}
          tooltip="Underline"
        />
        <ToolbarBtn 
          isActive={textItem.textDecoration === 'line-through'} 
          onClick={() => toggleDecoration('line-through')} 
          icon={<Strikethrough className="w-4 h-4" />}
          tooltip="Strikethrough"
        />
      </div>

      {/* 3. Text Color */}
      <div className="relative border-r border-zinc-700 pr-2 flex items-center">
        <button 
          onClick={() => { setShowColorMenu(!showColorMenu); setShowFontMenu(false); setShowSpacingMenu(false); }}
          className="w-6 h-6 rounded-full border border-zinc-600 hover:scale-110 transition-transform shadow-sm"
          style={{ backgroundColor: textItem.fill }}
        />
        {showColorMenu && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50">
             <div 
               className="fixed inset-0 z-40" 
               onClick={() => setShowColorMenu(false)} 
             />
             <div className="relative z-50">
               <SketchPicker 
                 color={textItem.fill} 
                 onChangeComplete={(color) => onUpdate({ ...textItem, fill: color.hex })}
                 styles={{
                   default: {
                     picker: { background: '#27272a', borderRadius: '8px', border: '1px solid #3f3f46' },
                     controls: { background: '#27272a' }
                   }
                 }}
               />
               {/* Opacity Slider inside Color Menu */}
               <div className="bg-[#27272a] p-3 border-t border-zinc-700 rounded-b-lg">
                 <div className="flex justify-between text-xs text-zinc-400 mb-1">
                   <span>Opacity</span>
                   <span>{Math.round((textItem.opacity || 1) * 100)}%</span>
                 </div>
                 <input 
                    type="range" min="0" max="100" 
                    value={(textItem.opacity || 1) * 100}
                    onChange={(e) => onUpdate({ ...textItem, opacity: parseInt(e.target.value) / 100 })}
                    className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                 />
               </div>
             </div>
          </div>
        )}
      </div>

      {/* 4. Alignment & Lists */}
      <div className="flex items-center gap-0.5 border-r border-zinc-700 pr-2">
        <ToolbarBtn 
          isActive={textItem.textAlign === 'left'} 
          onClick={() => onUpdate({ ...textItem, textAlign: 'left' })} 
          icon={<AlignLeft className="w-4 h-4" />}
        />
        <ToolbarBtn 
          isActive={textItem.textAlign === 'center'} 
          onClick={() => onUpdate({ ...textItem, textAlign: 'center' })} 
          icon={<AlignCenter className="w-4 h-4" />}
        />
        <ToolbarBtn 
          isActive={textItem.textAlign === 'right'} 
          onClick={() => onUpdate({ ...textItem, textAlign: 'right' })} 
          icon={<AlignRight className="w-4 h-4" />}
        />
        <div className="w-px h-4 bg-zinc-700 mx-1" />
        <ToolbarBtn 
          isActive={textItem.listType === 'bullet'} 
          onClick={() => toggleList('bullet')} 
          icon={<List className="w-4 h-4" />}
        />
        <ToolbarBtn 
          isActive={textItem.listType === 'number'} 
          onClick={() => toggleList('number')} 
          icon={<ListOrdered className="w-4 h-4" />}
        />
      </div>

      {/* 5. Advanced (Transforms & Spacing) */}
      <div className="flex items-center gap-0.5 relative">
        <div className="flex flex-col gap-[1px]">
            <button 
                onClick={() => applyTransform('uppercase')}
                className={cn("px-1 py-[1px] text-[10px] rounded hover:bg-zinc-700 text-zinc-400 hover:text-white", textItem.textTransform === 'uppercase' && "text-indigo-400")}
            >AA</button>
            <button 
                onClick={() => applyTransform('capitalize')}
                className={cn("px-1 py-[1px] text-[10px] rounded hover:bg-zinc-700 text-zinc-400 hover:text-white", textItem.textTransform === 'capitalize' && "text-indigo-400")}
            >Aa</button>
        </div>

        <div className="w-px h-6 bg-zinc-700 mx-1" />

        <button 
            onClick={() => { setShowSpacingMenu(!showSpacingMenu); setShowColorMenu(false); setShowFontMenu(false); }}
            className={cn(
                "p-1.5 rounded-md transition-colors",
                showSpacingMenu ? "bg-indigo-600 text-white" : "text-zinc-400 hover:bg-zinc-700 hover:text-white"
            )}
        >
            <Scaling className="w-4 h-4" />
        </button>

        {showSpacingMenu && (
             <div className="absolute top-full right-0 mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-3 z-50">
                 {/* Line Height */}
                 <div className="mb-3">
                     <div className="flex justify-between text-xs text-zinc-400 mb-1">
                         <span className="flex items-center gap-1"><MoveVertical className="w-3 h-3" /> Line Height</span>
                         <span>{textItem.lineHeight?.toFixed(1) || 1.2}</span>
                     </div>
                     <input 
                        type="range" min="0.5" max="3" step="0.1"
                        value={textItem.lineHeight || 1.2}
                        onChange={(e) => onUpdate({ ...textItem, lineHeight: parseFloat(e.target.value) })}
                        className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500"
                     />
                 </div>
                 
                 {/* Letter Spacing */}
                 <div>
                     <div className="flex justify-between text-xs text-zinc-400 mb-1">
                         <span className="flex items-center gap-1"><Type className="w-3 h-3" /> Letter Spacing</span>
                         <span>{textItem.letterSpacing || 0}</span>
                     </div>
                     <input 
                        type="range" min="-5" max="20" step="1"
                        value={textItem.letterSpacing || 0}
                        onChange={(e) => onUpdate({ ...textItem, letterSpacing: parseInt(e.target.value) })}
                        className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500"
                     />
                 </div>
             </div>
        )}
      </div>

    </div>
  );
};

// --- Sub-components ---

const ToolbarBtn = ({ isActive, onClick, icon, tooltip }: { isActive?: boolean, onClick: () => void, icon: React.ReactNode, tooltip?: string }) => (
  <button 
    onClick={onClick}
    title={tooltip}
    className={cn(
      "p-1.5 rounded-md transition-all duration-200",
      isActive 
        ? "bg-indigo-600 text-white shadow-sm" 
        : "text-zinc-400 hover:bg-zinc-700 hover:text-white"
    )}
  >
    {icon}
  </button>
);