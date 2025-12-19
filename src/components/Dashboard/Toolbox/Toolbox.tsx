/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect } from 'react';
import { 
  RotateCw, 
  Undo2, 
  Redo2, 
  ChevronDown, 
  Minus, 
  Plus, 
  Bold, 
  Italic, 
  Underline, 
  Check,
  Strikethrough, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  List,
  ListOrdered,
  Brush,
  Eraser,
  MousePointer2,
  Hand,
  Pipette,
  Square,
  Circle,
  Triangle,
  Star,
  Minus as LineIcon,
  MoveRight,
  RefreshCcw,
  PenTool,
  PaintBucket,
} from 'lucide-react';
import { SketchPicker } from 'react-color';
import { cn } from '@/lib/utils';
import book1 from "@/assets/images/Books/5x7.png";
import book2 from "@/assets/images/Books/6x4.png";
import book3 from "@/assets/images/Books/6x8.png";
import book4 from "@/assets/images/Books/6x9.png";
import book5 from "@/assets/images/Books/7x10.png";
import book6 from "@/assets/images/Books/8.5x11.png";
import book7 from "@/assets/images/Books/8x10.png";
import book8 from "@/assets/images/Books/12x9.png";
import book9 from "@/assets/images/Books/Square.png";
import { Button } from '@/components/ui/button';

const BOOK_SIZES = [
  { id: 1, label: "5 x 7", image: book1 },
  { id: 2, label: "6 x 4", image: book2 },
  { id: 3, label: "6 x 8", image: book3 },
  { id: 4, label: "6 x 9", image: book4 },
  { id: 5, label: "7 x 10", image: book5 },
  { id: 6, label: "8.5 x 11", image: book6 },
  { id: 7, label: "8 x 10", image: book7 },
  { id: 8, label: "12 x 9", image: book8 },
  { id: 9, label: "Square", image: book9 },
];

const ToolbarButton = ({ children, isActive, onClick, className = "" }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "h-9 min-w-[36px] px-2 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-white/10 active:scale-95",
      isActive ? 'bg-[#6366f1] text-white' : 'text-gray-400 hover:text-white',
      className
    )}
  >
    {children}
  </button>
);

const ToolItem = ({ isActive, label, icon, onClick }: any) => {
  return (
    <div 
      onClick={onClick}
      className={`group flex flex-col items-center gap-2 cursor-pointer relative transition-all duration-300 ${isActive ? '-translate-y-1' : ''}`}
    >
      {/* Icon Container with Glow effect if active */}
      <div className={`relative p-2 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
        {isActive && (
          <div className="absolute inset-0 bg-indigo-500/20 blur-lg rounded-full" />
        )}
        <div className="relative z-10">
          {icon}
        </div>
      </div>

      {/* Label */}
      <span className={`text-[10px] font-medium tracking-wide transition-colors ${isActive ? 'text-indigo-100' : 'text-slate-400 group-hover:text-slate-200'}`}>
        {label}
      </span>

      {/* Active Indicator Underline */}
      <div 
        className={`h-0.5 w-6 rounded-full transition-all duration-300 mx-auto mt-1
          ${isActive ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 'bg-transparent w-0'}
        `}
      />
    </div>
  );
};

// Helper function to convert rgba to hex
const rgbaToHex = (rgba: string): string => {
  if (!rgba || !rgba.startsWith('rgba')) return rgba; // Return if not rgba, could be hex already
  
  const match = rgba.match(/rgba\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return '#000000';
  
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  
  const toHex = (c: number) => ('0' + c.toString(16)).slice(-2);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, opacity: number = 1): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(0, 0, 0, ${opacity})`;
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const Divider = () => <div className="w-px h-6 bg-zinc-700 mx-2 self-center" />;

const ColorSwatch = ({ color, isSelected, onClick }: { color: string, isSelected: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(`w-8 h-8 rounded-md transition-all duration-200 relative group`,
      isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-800 scale-110 z-10' : 'hover:scale-105 border border-white/10'
    )}
    style={{ backgroundColor: color }}
    aria-label={`Select color ${color}`}
  >
    {isSelected && (
      <span className="absolute inset-0 flex items-center justify-center">
        <Check className="w-4 h-4 text-white drop-shadow-md" strokeWidth={3} />
      </span>
    )}
  </button>
);




interface ToolboxProps {
  activeTool: string;
  onBookSizeChange?: (size: string) => void;
  onStrokeColorChange?: (color: string) => void;
  onStrokeWidthChange?: (width: number) => void;
  onFontSizeChange?: (size: number) => void;
  onFontFamilyChange?: (font: string) => void;
  onTextFormatChange?: (format: string) => void;
  onShapeChange?: (shape: string) => void;
  onToolChange?: (tool: string) => void;
  strokeColor?: string;
  strokeWidth?: number;
  undo?: () => any;
  redo?: () => any;
  canUndo?: boolean;
  canRedo?: boolean;
  updatePageData?: (pageIndex: number, key: string, data: any) => void;
  currentPageIndex?: number;
  onAdvancedTextChange?: (property: string, value: any) => void;
}

const Toolbox = ({ 
  activeTool, 
  onBookSizeChange,
  onStrokeColorChange,
  onStrokeWidthChange,
  onFontSizeChange,
  onFontFamilyChange,
  onTextFormatChange,
  onShapeChange,
  onToolChange,
  strokeColor = '#000000',
  strokeWidth = 5,
  undo,
  redo,
  canUndo = false,
  canRedo = false,
  updatePageData,
  currentPageIndex = 0,
  onAdvancedTextChange
}: ToolboxProps) => {
  const [selectedBook, setSelectedBook] = useState(2);
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState('Roboto');
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColors, setCustomColors] = useState(['rgba(96, 165, 250, 1)']);
  const [selectedShape, setSelectedShape] = useState('square');
  const [selectedTool, setSelectedTool] = useState('select');
  const [brushSize, setBrushSize] = useState(strokeWidth);
  const [textColor, setTextColor] = useState('rgba(0, 0, 0, 1)');
  const [brushColor, setBrushColor] = useState(strokeColor);
  const [shapeColor, setShapeColor] = useState(strokeColor);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [opacity, setOpacity] = useState(100);
  const [textAlignment, setTextAlignment] = useState<'left' | 'center' | 'right'>('left');
  const [isBrushMode, setIsBrushMode] = useState(true);
  const [textTransform, setTextTransform] = useState<'none' | 'uppercase' | 'lowercase' | 'capitalize'>('none');

  // Helper to extract opacity for the slider when switching
  const parseOpacity = (rgbaString: string) => {
    const match = rgbaString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);
    if (match && match[4]) {
      return Math.round(parseFloat(match[4]) * 100);
    }
    return 100;
  };

  // FIX: Restore the saved local color when switching tools
  useEffect(() => {
    if (activeTool === 'Text') {
      onStrokeColorChange?.(textColor);
      setOpacity(parseOpacity(textColor)); 
    } else if (activeTool === 'Brush') {
      onStrokeColorChange?.(brushColor);
      setOpacity(parseOpacity(brushColor));
    } else if (activeTool === 'Shapes') {
      onStrokeColorChange?.(shapeColor);
      setOpacity(parseOpacity(shapeColor));
    } else if (activeTool === 'Color') {
      onStrokeColorChange?.(backgroundColor);
      setOpacity(parseOpacity(backgroundColor));
    }
  }, [activeTool]);

  const pickerColor = useMemo(() => {
    return rgbaToHex(strokeColor);
  }, [strokeColor]);

  const toggleFormat = (format: string) => {
    setActiveFormats(prev => 
      prev.includes(format) ? prev.filter(f => f !== format) : [...prev, format]
    );
    onTextFormatChange?.(format);
  };

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.max(8, Math.min(72, fontSize + delta));
    setFontSize(newSize);
    onFontSizeChange?.(newSize);
  };

  const handleBrushSizeChange = (delta: number) => {
    const newSize = Math.max(1, Math.min(50, brushSize + delta));
    setBrushSize(newSize);
    onStrokeWidthChange?.(newSize);
  };

  const handleColorChange = (color: any) => { // color is from react-color
    const alpha = color.rgb.a !== undefined ? color.rgb.a : 1;
    const newRgba = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${alpha})`;

    // Sync opacity slider
    setOpacity(Math.round(alpha * 100));

    // FIX: Only update the local state for the currently active tool
    if (activeTool === 'Text') {
      setTextColor(newRgba);
    } else if (activeTool === 'Brush') {
      setBrushColor(newRgba);
    } else if (activeTool === 'Shapes') {
      setShapeColor(newRgba);
    } else if (activeTool === 'Color') {
      setBackgroundColor(newRgba);
    }

    onStrokeColorChange?.(newRgba);
  };

  const handleBookSelect = (bookId: number, label: string) => {
    setSelectedBook(bookId);
    onBookSizeChange?.(label);
  };

  const handleShapeSelect = (shape: string) => {
    setSelectedShape(shape);
    onShapeChange?.(shape);
  };

  const handleAddColor = () => {
    if (customColors.length < 14 && !customColors.includes(strokeColor)) {
      setCustomColors([...customColors, strokeColor]); // strokeColor is now rgba
    }
  };

  const handleRefresh = () => {
    if (activeTool === 'Text') {
      setFontSize(24);
      setFontFamily('Roboto');
      setActiveFormats([]);
      setTextColor('rgba(0, 0, 0, 1)');
      setTextAlignment('left');
      onFontSizeChange?.(24);
      onFontFamilyChange?.('Roboto');
    } else if (activeTool === 'Brush') {
      setBrushSize(5);
      setBrushColor('#000000');
      setIsBrushMode(true);
      onStrokeWidthChange?.(5);
    } else if (activeTool === 'Color') {
      setOpacity(100);
      onStrokeColorChange?.('rgba(0, 0, 0, 1)');
    }
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setOpacity(value);

    const rgbaMatch = strokeColor.match(/rgba\((\d+,\s*\d+,\s*\d+)/);
    if (rgbaMatch) {
      onStrokeColorChange?.(`rgba(${rgbaMatch[1]}, ${value / 100})`);
    } else { // Assume hex
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(strokeColor);
      if (result) {
        const r = parseInt(result[1], 16);
        const g = parseInt(result[2], 16);
        const b = parseInt(result[3], 16);
        onStrokeColorChange?.(`rgba(${r}, ${g}, ${b}, ${value / 100})`);
      }
    }
  };

  const handleAlignmentChange = (align: 'left' | 'center' | 'right') => {
    setTextAlignment(align);
  };

  const handleToolSelect = (tool: string) => {
    setSelectedTool(tool);
    onToolChange?.(tool);
  };

  const handleTextTransform = (type: 'uppercase' | 'lowercase' | 'capitalize') => {
    setTextTransform(type);
    onAdvancedTextChange?.('textTransform', type);
  };

  const handleListToggle = (type: 'bullet' | 'number') => {
    onAdvancedTextChange?.('listType', type);
  };





  const renderBookSizePanel = () => (
    <div className="flex items-center justify-around w-full gap-4 px-2">
      {BOOK_SIZES.map((book) => (
        <div
          key={book.id}
          onClick={() => handleBookSelect(book.id, book.label)}
          className={cn(
            "cursor-pointer transition-all duration-300 relative group",
            selectedBook === book.id ? "scale-105" : "opacity-70 hover:opacity-100 hover:scale-102"
          )}
        >
          <div className={cn(
            "absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-lg border border-gray-500 bg-white/5 z-0 transition-opacity duration-300 w-full h-[90px] px-1.5 box-content",
            selectedBook === book.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )} />
          <div className="relative z-10 flex flex-col items-center justify-between w-full h-full">
            <div className="w-full h-full">
              <img className="w-auto h-[80px] object-cover" src={book.image} alt="" />
            </div>
            <div className={cn(
              "text-center absolute top-[50%] left-[50%] w-max translate-x-[-50%] translate-y-[-50%] transition-all duration-300",
              selectedBook === book.id ? "opacity-100 scale-100" : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
            )}>
              <p className="text-center text-indigo-50 text-2xl font-medium font-Inter [text-shadow:_0px_4px_4px_rgb(177_177_177_/_0.34)]">
                {book.label}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTextPanel = () => (
    <>
      <div 
        onClick={handleRefresh}
        className="flex flex-col items-center justify-center px-2 mr-2 cursor-pointer group"
      >
        <RotateCw className="w-5 h-5 text-zinc-400 group-hover:text-white group-hover:rotate-180 transition-all duration-500" />
        <span className="text-[10px] text-zinc-500 mt-1 font-medium tracking-wide group-hover:text-zinc-300">Refresh</span>
      </div>

      <Divider />

      <div className="relative group">
        <button className="h-10 px-4 bg-white/5 rounded-lg flex items-center gap-3 text-zinc-200 hover:bg-white/10 transition-colors border border-transparent hover:border-zinc-700">
          <span className="text-sm font-medium">{fontFamily}</span>
          <ChevronDown className="w-4 h-4 text-zinc-500" />
        </button>
        <div className="absolute top-full left-0 mt-2 w-48 max-h-64 overflow-y-auto bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-left z-50">
          {['Anton', 'Bebas Neue', 'Caveat', 'Comfortaa', 'Dancing Script', 'Fredoka', 'Heebo', 'Josefin Sans', 'Lobster', 'Lora', 'Merriweather', 'Montserrat', 'Oswald', 'Pacifico', 'Playfair Display', 'Quicksand', 'Raleway', 'Roboto', 'Roboto Slab', 'Source Code Pro', 'Work Sans'].map(font => (
            <div 
              key={font}
              onClick={() => { setFontFamily(font); onFontFamilyChange?.(font); }}
              className="px-4 py-2 text-sm text-zinc-300 hover:bg-indigo-600 hover:text-white cursor-pointer first:rounded-t-lg last:rounded-b-lg"
              style={{ fontFamily: font }}
            >
              {font}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center bg-white/5 rounded-lg border border-transparent hover:border-zinc-700 mx-2">
        <button onClick={() => handleFontSizeChange(-1)} className="h-10 w-10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 rounded-l-lg">
          <Minus className="w-4 h-4" />
        </button>
        <div className="w-10 text-center text-sm font-medium text-zinc-200 font-mono">{fontSize}</div>
        <button onClick={() => handleFontSizeChange(1)} className="h-10 w-10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 rounded-r-lg">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="relative">
        <div 
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="w-9 h-9 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg ring-2 ring-transparent hover:ring-white/20" 
          style={{ backgroundColor: textColor }}
          title="Text Color"
        />
        {showColorPicker && (
          <div className="absolute top-12 left-0 z-50">
            <div className="fixed inset-0" onClick={() => setShowColorPicker(false)} />
            <SketchPicker color={textColor} onChange={handleColorChange} />
          </div>
        )}
      </div>

      <Divider />

      <div className="flex items-center gap-1">
        <ToolbarButton isActive={activeFormats.includes('bold')} onClick={() => toggleFormat('bold')}>
          <Bold className="w-5 h-5" strokeWidth={2.5} />
        </ToolbarButton>
        <ToolbarButton isActive={activeFormats.includes('italic')} onClick={() => toggleFormat('italic')}>
          <Italic className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton isActive={activeFormats.includes('underline')} onClick={() => toggleFormat('underline')}>
          <Underline className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton isActive={activeFormats.includes('strike')} onClick={() => toggleFormat('strike')}>
          <Strikethrough className="w-5 h-5" />
        </ToolbarButton>
      </div>

      <Divider />

      <div className="flex items-center gap-1">
        <ToolbarButton isActive={textAlignment === 'left'} onClick={() => handleAlignmentChange('left')}>
          <AlignLeft className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton isActive={textAlignment === 'center'} onClick={() => handleAlignmentChange('center')}>
          <AlignCenter className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton isActive={textAlignment === 'right'} onClick={() => handleAlignmentChange('right')}>
          <AlignRight className="w-5 h-5" />
        </ToolbarButton>
      </div>
      
      <Divider />

      {/* Text Transform */}
      <div className="flex items-center gap-1">
        <ToolbarButton isActive={textTransform === 'uppercase'} onClick={() => handleTextTransform('uppercase')}>
          <span className="text-xs font-bold">AA</span>
        </ToolbarButton>
        <ToolbarButton isActive={textTransform === 'capitalize'} onClick={() => handleTextTransform('capitalize')}>
          <span className="text-xs font-bold">Aa</span>
        </ToolbarButton>
      </div>

      <Divider />

      {/* Lists */}
      <div className="flex items-center gap-1">
        <ToolbarButton onClick={() => handleListToggle('bullet')}><List className="w-5 h-5" /></ToolbarButton>
        <ToolbarButton onClick={() => handleListToggle('number')}><ListOrdered className="w-5 h-5" /></ToolbarButton>
      </div>

      <div className="flex-grow" />

      <div className="flex items-center gap-4 ml-4 px-4 border-l border-zinc-700">
        <div className="flex flex-col items-center group cursor-pointer">
          <Button 
            size="icon" 
            variant="secondary" 
            className="h-10 w-10 rounded-lg bg-[#2B2B2B] text-white hover:bg-[#333] border-none"
            onClick={() => {
              const undoTexts = undo?.();
              if (undoTexts) updatePageData?.(currentPageIndex, 'texts', undoTexts);
            }}
            disabled={!canUndo}
          >
            <Undo2 className="w-5 h-5" />
          </Button>
          <span className="text-[10px] text-zinc-500 mt-1 font-medium group-hover:text-zinc-300">Undo</span>
        </div>
        <div className="flex flex-col items-center group cursor-pointer">
          <Button 
            size="icon" 
            variant="secondary" 
            className="h-10 w-10 rounded-lg bg-[#2B2B2B] text-white hover:bg-[#333] border-none"
            onClick={() => {
              const redoTexts = redo?.();
              if (redoTexts) updatePageData?.(currentPageIndex, 'texts', redoTexts);
            }}
            disabled={!canRedo}
          >
            <Redo2 className="w-5 h-5" />
          </Button>
          <span className="text-[10px] text-zinc-500 mt-1 font-medium group-hover:text-zinc-300">Redo</span>
        </div>
      </div>
    </>
  );

  const renderColorPanel = () => {
    const basicColors = [
      '#60a5fa', // Blue-400
      '#67e8f9', // Cyan-300
      '#86efac', // Green-300
      '#ef4444', // Red-500
      '#be185d', // Pink-700
      '#9333ea', // Purple-600
    ];

    return (
      <>
      <div className='w-full flex justify-around'>
        <div onClick={handleRefresh} className="flex flex-col items-center justify-center px-2 mr-2 cursor-pointer group">
          <RotateCw className="w-5 h-5 text-zinc-400 group-hover:text-white group-hover:rotate-180 transition-all duration-500" />
          <span className="text-[10px] text-zinc-500 mt-1 font-medium tracking-wide group-hover:text-zinc-300">Refresh</span>
        </div>
        <Divider />
        <div className="relative group cursor-pointer" onClick={() => setShowColorPicker(!showColorPicker)}>
          <div className="w-16 h-16 rounded-full shadow-lg border-2 border-white/10 relative overflow-hidden hover:scale-105 transition-transform duration-300">
            <div className="absolute inset-0 bg-[conic-gradient(from_90deg,red,yellow,lime,aqua,blue,magenta,red)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-black/20 mix-blend-overlay" />
            <div className="absolute inset-0 bg-radial-gradient(circle_at_30%_30%,white_0%,transparent_40%) opacity-50" />
          </div>
          {showColorPicker && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50">
              <div className="fixed inset-0" onClick={() => setShowColorPicker(false)} />
              <SketchPicker color={pickerColor} onChange={handleColorChange} />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 ml-4">
          <h3 className="text-white text-xs font-medium tracking-wide">Basic colors</h3>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto max-w-[250px]">
            {basicColors.map((color, index) => (
              <ColorSwatch 
                key={`basic-${index}`} 
                color={color} 
                isSelected={rgbaToHex(strokeColor) === color}
                onClick={() => {
                  const rgbaColor = hexToRgba(color, opacity / 100);
                  setBackgroundColor(rgbaColor);
                  onStrokeColorChange?.(rgbaColor);
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 ml-4">
          <h3 className="text-white text-xs font-medium tracking-wide">Custom Colors</h3>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto max-w-[250px]">
            {customColors.map((color) => (
              <ColorSwatch 
                key={color}
                color={color}
                isSelected={strokeColor === color}
                onClick={() => {
                  setBackgroundColor(color);
                  onStrokeColorChange?.(color);
                }}
              />
            ))}
            <button 
              onClick={handleAddColor}
              className="w-8 h-8 rounded-md bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all group"
              title="Add current color"
              disabled={customColors.length >= 14 || customColors.includes(strokeColor)}
            >
              <Plus className="w-4 h-4 text-slate-400 group-hover:text-white" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 items-center ml-4">
          <span className="text-xs text-zinc-400">Opacity</span>
          <div className="relative w-32 h-4 rounded-full overflow-hidden border border-white/20 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAB5JREFUKFNjZGRiYGD4/58BCQYwmoHBAABjIwH8qceD4wAAAABJRU5ErkJggg==')] bg-repeat">
              <div 
                className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent to-white pointer-events-none"
                style={{ background: `linear-gradient(to right, transparent, ${strokeColor})` }}
              />
          </div>
          <div className="relative w-32 h-6 flex items-center">
               <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={opacity}
                  onChange={handleOpacityChange}
                  className="w-full h-1 bg-transparent rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-indigo-500 [&::-webkit-slider-thumb]:shadow-lg hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-indigo-500 pointer-events-none" style={{ width: `${opacity}%` }} />
          </div>
          <span className="text-xs text-zinc-300 w-8 text-center">{opacity}%</span>
        </div>

        <Divider />

        <div className="flex items-center gap-4 ml-4 px-4">
          <div className="flex flex-col items-center group cursor-pointer">
            <Button 
              size="icon" 
              variant="secondary" 
              className="h-10 w-10 rounded-lg bg-[#2B2B2B] text-white hover:bg-[#333] border-none"
              onClick={() => undo?.()}
              disabled={!canUndo}
            >
              <Undo2 className="w-5 h-5" />
            </Button>
            <span className="text-[10px] text-zinc-500 mt-1 font-medium group-hover:text-zinc-300">Undo</span>
          </div>
          <div className="flex flex-col items-center group cursor-pointer">
            <Button 
            size="icon" 
            variant="secondary" 
            className="h-10 w-10 rounded-lg bg-[#2B2B2B] text-white hover:bg-[#333] border-none"
            onClick={() => {
              const redoTexts = redo?.();
              if (redoTexts) updatePageData?.(currentPageIndex, 'texts', redoTexts);
            }}
            disabled={!canRedo}
          >
            <Redo2 className="w-5 h-5" />
          </Button>
          <span className="text-[10px] text-zinc-500 mt-1 font-medium group-hover:text-zinc-300">Redo</span>
          </div>
        </div>
        </div>
      </>
    );
  }

  const renderBrushPanel = () => {
    // Predefined sizes for the circles
    const brushSizes = [8, 16, 24, 32, 48];

    // Handle hue change from slider
    const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const hue = e.target.value;
      const color = `hsla(${hue}, 100%, 50%, 1)`;
      // Note: You might want a conversion to RGBA here if your app strictly requires RGBA
      // For now, passing the HSLA string to your color handler
      setBrushColor(color);
      onStrokeColorChange?.(color); 
    };

    return (
      <div className="flex w-full h-full items-center justify-between px-2 gap-4 overflow-x-auto">
        
        {/* Left Section: Refresh */}
        <div 
          onClick={handleRefresh}
          className="flex flex-col items-center gap-1.5 cursor-pointer hover:text-white transition-colors group px-2"
        >
          <div className="p-2 rounded-lg bg-zinc-700/50 group-hover:bg-zinc-700 transition-colors">
            <RefreshCcw size={18} className="text-slate-300 group-hover:text-white" />
          </div>
          <span className="text-[10px] font-medium tracking-wide opacity-80">Refresh</span>
        </div>

        {/* Divider */}
        <div className="h-10 w-px bg-zinc-700 hidden sm:block"></div>

        {/* Middle Section: Tools & Settings */}
        <div className="flex flex-1 items-center justify-center gap-6 lg:gap-10">
          
          {/* Tool Selector */}
          <div className="flex items-end gap-4">
            <ToolItem 
              isActive={isBrushMode} 
              label="Brush" 
              onClick={() => { setIsBrushMode(true); }}
              icon={<Brush size={20} className={isBrushMode ? "text-indigo-200" : "text-gray-400"} />}
            />
            {/* Using the 'Pen' slot for Eraser functionality based on your existing logic */}
            <ToolItem 
              isActive={!isBrushMode} 
              label="Eraser" 
              onClick={() => { setIsBrushMode(false); handleToolSelect('eraser'); }}
              icon={<Eraser size={20} className={!isBrushMode ? "text-indigo-200" : "text-gray-400"} />}
            />
            {/* Visual placeholder for Fill if you don't have logic for it yet */}
            <ToolItem 
              isActive={false} 
              label="Fill" 
              onClick={() => { /* Add Fill Logic Later */ }}
              icon={<PaintBucket size={20} className="text-gray-400" />}
            />
          </div>

          {/* Size & Slider Group */}
          <div className="flex items-center gap-6">
            
            {/* Brush Size Circles */}
            <div className="flex items-center gap-3">
              {brushSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setBrushSize(size);
                    onStrokeWidthChange?.(size);
                  }}
                  className={`rounded-full transition-all duration-300 flex items-center justify-center
                    ${brushSize === size 
                      ? 'bg-slate-200 border-2 border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' 
                      : 'bg-zinc-600 hover:bg-zinc-500 opacity-40 hover:opacity-70'
                    }`}
                  style={{ width: Math.max(12, size / 1.5), height: Math.max(12, size / 1.5) }} // Scaled down slightly for UI fit
                  title={`Size: ${size}px`}
                />
              ))}
            </div>

            {/* Color/Gradient Slider */}
            <div className="flex flex-col gap-2 w-48">
              {/* Gradient Bar Background */}
              <div className="relative h-4 w-full">
                 <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 via-green-500 via-blue-500 to-purple-500 shadow-inner ring-1 ring-white/10" />
                 
                 {/* Slider Input */}
                 <input 
                  type="range" 
                  min="0" 
                  max="360" 
                  defaultValue="0"
                  onChange={handleHueChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                {/* Custom Thumb Indicator (Visual only - controlled by input) */}
                <div 
                   className="pointer-events-none absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-zinc-800 shadow-md transition-all"
                   // Note: A real implementation would need state to track the thumb position accurately based on hue
                   style={{ left: `calc(${parseInt(brushColor.match(/\d+/)?.[0] || '0') / 360 * 100}% - 8px)` }} 
                />
              </div>
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="h-10 w-px bg-zinc-700 hidden sm:block"></div>

        {/* Right Section: Undo/Redo */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => {
              const undoTexts = undo?.();
              if (undoTexts) updatePageData?.(currentPageIndex, 'texts', undoTexts);
            }}
            className={`flex flex-col items-center gap-1.5 cursor-pointer transition-colors group ${!canUndo ? 'opacity-30 pointer-events-none' : 'hover:text-white'}`}
          >
            <div className="p-2 rounded-lg bg-zinc-700/50 group-hover:bg-zinc-700 transition-colors">
              <Undo2 size={18} className="text-slate-300 group-hover:text-white" />
            </div>
            <span className="text-[10px] font-medium tracking-wide opacity-80">Undo</span>
          </div>
          
          <div 
             onClick={() => {
              const redoTexts = redo?.();
              if (redoTexts) updatePageData?.(currentPageIndex, 'texts', redoTexts);
            }}
            className={`flex flex-col items-center gap-1.5 cursor-pointer transition-colors group ${!canRedo ? 'opacity-30 pointer-events-none' : 'hover:text-white'}`}
          >
             <div className="p-2 rounded-lg bg-zinc-700/50 group-hover:bg-zinc-700 transition-colors">
              <Redo2 size={18} className="text-slate-300 group-hover:text-white" />
            </div>
            <span className="text-[10px] font-medium tracking-wide opacity-80">Redo</span>
          </div>
        </div>

      </div>
    );
  };

  const renderToolPanel = () => {
    const tools = [
      { id: 'select', icon: MousePointer2, label: 'Select' },
      { id: 'hand', icon: Hand, label: 'Pan' },
      { id: 'pipette', icon: Pipette, label: 'Picker' },
      { id: 'eraser', icon: Eraser, label: 'Eraser' },
    ];

    return (
      <>
        <div 
          onClick={handleRefresh}
          className="flex flex-col items-center justify-center px-2 mr-2 cursor-pointer group"
        >
          <RotateCw className="w-5 h-5 text-zinc-400 group-hover:text-white group-hover:rotate-180 transition-all duration-500" />
          <span className="text-[10px] text-zinc-500 mt-1 font-medium tracking-wide group-hover:text-zinc-300">Refresh</span>
        </div>

        <Divider />

        <div className="flex items-center gap-4">
          {tools.map((t) => (
            <div
              key={t.id}
              className={cn(
                "flex flex-col items-center gap-1 cursor-pointer group p-2 rounded-md transition-all",
                selectedTool === t.id ? "bg-white/10" : "hover:bg-white/5"
              )}
              onClick={() => handleToolSelect(t.id)}
            >
              <t.icon className={cn("w-5 h-5", selectedTool === t.id ? "text-primary" : "text-gray-300")} />
              <span className={cn("text-[9px]", selectedTool === t.id ? "text-white" : "text-gray-400")}>{t.label}</span>
              {selectedTool === t.id && <div className="h-0.5 w-4 bg-primary rounded-full mt-0.5"></div>}
            </div>
          ))}
        </div>

        <div className="flex-grow" />

        <div className="flex items-center gap-4 ml-4 px-4 border-l border-zinc-700">
          <div className="flex flex-col items-center group cursor-pointer">
            <Button 
              size="icon" 
              variant="secondary" 
              className="h-10 w-10 rounded-lg bg-[#2B2B2B] text-white hover:bg-[#333] border-none"
              onClick={() => {
                const undoTexts = undo?.();
                if (undoTexts) updatePageData?.(currentPageIndex, 'texts', undoTexts);
              }}
              disabled={!canUndo}
            >
              <Undo2 className="w-5 h-5" />
            </Button>
            <span className="text-[10px] text-zinc-500 mt-1 font-medium group-hover:text-zinc-300">Undo</span>
          </div>
          <div className="flex flex-col items-center group cursor-pointer">
            <Button 
              size="icon" 
              variant="secondary" 
              className="h-10 w-10 rounded-lg bg-[#2B2B2B] text-white hover:bg-[#333] border-none"
              onClick={() => {
                const redoTexts = redo?.();
                if (redoTexts) updatePageData?.(currentPageIndex, 'texts', redoTexts);
              }}
              disabled={!canRedo}
            >
              <Redo2 className="w-5 h-5" />
            </Button>
            <span className="text-[10px] text-zinc-500 mt-1 font-medium group-hover:text-zinc-300">Redo</span>
          </div>
        </div>
      </>
    );
  };

  const renderShapesPanel = () => {
    const shapes = [
      { id: 'square', icon: Square, label: 'Square' },
      { id: 'circle', icon: Circle, label: 'Circle' },
      { id: 'triangle', icon: Triangle, label: 'Triangle' },
      { id: 'star', icon: Star, label: 'Star' },
      { id: 'line', icon: LineIcon, label: 'Line' },
      { id: 'arrow', icon: MoveRight, label: 'Arrow' },
    ];

    return (
      <>
        <div 
          onClick={handleRefresh}
          className="flex flex-col items-center justify-center px-2 mr-2 cursor-pointer group"
        >
          <RotateCw className="w-5 h-5 text-zinc-400 group-hover:text-white group-hover:rotate-180 transition-all duration-500" />
          <span className="text-[10px] text-zinc-500 mt-1 font-medium tracking-wide group-hover:text-zinc-300">Refresh</span>
        </div>

        <Divider />

        <div className="flex items-center gap-3">
          {shapes.map((s) => (
            <button
              key={s.id}
              className={cn(
                "h-10 w-10 p-2 rounded-md transition-all active:scale-95",
                selectedShape === s.id
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              )}
              onClick={() => handleShapeSelect(s.id)}
              title={s.label}
            >
              <s.icon className="w-full h-full" />
            </button>
          ))}
        </div>

        <Divider />

        <div className="relative">
          <div 
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="w-9 h-9 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg ring-2 ring-transparent hover:ring-white/20" 
            style={{ backgroundColor: shapeColor }}
            title="Shape Color"
          />
          {showColorPicker && (
            <div className="absolute top-12 left-0 z-50">
              <div className="fixed inset-0" onClick={() => setShowColorPicker(false)} />
              <SketchPicker color={shapeColor} onChange={handleColorChange} />
            </div>
          )}
        </div>

        <div className="flex-grow" />

        <div className="flex items-center gap-4 ml-4 px-4 border-l border-zinc-700">
          <div className="flex flex-col items-center group cursor-pointer">
            <Button 
              size="icon" 
              variant="secondary" 
              className="h-10 w-10 rounded-lg bg-[#2B2B2B] text-white hover:bg-[#333] border-none"
              onClick={() => {
                const undoTexts = undo?.();
                if (undoTexts) updatePageData?.(currentPageIndex, 'texts', undoTexts);
              }}
              disabled={!canUndo}
            >
              <Undo2 className="w-5 h-5" />
            </Button>
            <span className="text-[10px] text-zinc-500 mt-1 font-medium group-hover:text-zinc-300">Undo</span>
          </div>
          <div className="flex flex-col items-center group cursor-pointer">
            <Button 
              size="icon" 
              variant="secondary" 
              className="h-10 w-10 rounded-lg bg-[#2B2B2B] text-white hover:bg-[#333] border-none"
              onClick={() => {
                const redoTexts = redo?.();
                if (redoTexts) updatePageData?.(currentPageIndex, 'texts', redoTexts);
              }}
              disabled={!canRedo}
            >
              <Redo2 className="w-5 h-5" />
            </Button>
            <span className="text-[10px] text-zinc-500 mt-1 font-medium group-hover:text-zinc-300">Redo</span>
          </div>
        </div>
      </>
    );
  };

  const renderContent = () => {
    switch (activeTool) {
      case 'Book Size':
        return renderBookSizePanel();
      case 'Text':
        return renderTextPanel();
      case 'Color':
        return renderColorPanel();
      case 'Brush':
        return renderBrushPanel();
      case 'Tool':
        return renderToolPanel();
      case 'Shapes':
        return renderShapesPanel();
      default:
        return (
          <div className="text-gray-400 text-sm pl-4">
            Select a tool to see options
          </div>
        );
    }
  };

  return (
    <div className="w-full h-[107px] bg-[#27272a] rounded-xl shadow-2xl border border-zinc-800 p-3 flex flex-wrap items-center gap-2 select-none relative z-10">
      {renderContent()}
    </div>
  );
};

export default Toolbox;
