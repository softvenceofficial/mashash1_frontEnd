/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect, useRef } from 'react';
import { 
  RotateCw, 
  Undo2, 
  Redo2, 
  ChevronDown, 
  ChevronLeft,
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
  Eraser,
  Square,
  Circle,
  Triangle,
  Star,
  Minus as LineIcon,
  MoveRight,
  RefreshCcw,
  PaintBucket,
  ZoomIn,
  ZoomOut,
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
import BrushIcon from '@/assets/icons/BrushIcon.svg';
import paint_bucket_icon from '@/assets/icons/paint-bucket-icon.svg';
import eraser_color_icon from '@/assets/icons/eraser-color-icon.svg';
// icons for the tools
import select from '@/assets/icons/select.svg';
import hand from '@/assets/icons/hand.svg';
import import_image from '@/assets/icons/import_image.svg';
import Pen_tool from '@/assets/icons/Pen_tool.svg';
import Sticky_note from '@/assets/icons/Sticky_note.svg';
import TableIcon from '@/assets/icons/table.svg';
// import zoom_lens from '@/assets/icons/zoom_lens.svg';
// icons for the tools
import { ReactSVG } from 'react-svg';

export const DrawingMode = {
  BRUSH: 'brush',
  FILL: 'fill',
  ERASER: 'eraser',
} as const;

export type DrawingMode = typeof DrawingMode[keyof typeof DrawingMode];

// This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
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

const DRAWING_MODE_CONFIG = {
  [DrawingMode.BRUSH]: {
    minSize: 1,
    maxSize: 300,
    defaultSize: 5
  },
  [DrawingMode.FILL]: {
    minSize: 3000,
    maxSize: 3000,
    defaultSize: 3000
  },
  [DrawingMode.ERASER]: {
    minSize: 0,
    maxSize: 300,
    defaultSize: 20
  }
} as const;

const ToolbarButton = ({ children, isActive, onClick, className = "", ...props }: { children: React.ReactNode; isActive?: boolean; onClick?: () => void; className?: string; [key: string]: any } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    onClick={onClick}
    className={cn(
      "h-9 min-w-[36px] px-2 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-white/10 active:scale-95",
      isActive ? 'bg-[#6366f1] text-white' : 'text-gray-400 hover:text-white',
      className
    )}
    {...props}
  >
    {children}
  </button>
);


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
  activeSubTool?: string;
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
  drawingMode?: DrawingMode;
  onDrawingModeChange?: (mode: DrawingMode) => void;
  onBrushOptionChange?: (option: string, value: any) => void;
  onFillAction?: (color: string) => void;
  onBackgroundChange?: (color: string) => void;
  onZoomChange?: (zoom: number) => void;
  currentZoom?: number;
  onImageUpload?: (file: File) => void;
  onTableChange?: (property: string, value: any) => void;
  onPenOptionChange?: (property: string, value: any) => void;
  onPenAction?: (action: string) => void;
}

const Toolbox = ({ 
  activeTool, 
  activeSubTool,
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
  onAdvancedTextChange,
  onDrawingModeChange,
  onFillAction,
  onBackgroundChange,
  drawingMode,
  onZoomChange,
  currentZoom = 1,
  onImageUpload,
  onTableChange,
  onPenOptionChange,
  onPenAction,
}: ToolboxProps) => {
  const [selectedBook, setSelectedBook] = useState(2);
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState('Roboto');
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColors, setCustomColors] = useState(['rgba(96, 165, 250, 1)']);
  const [selectedShape, setSelectedShape] = useState('square');
  const [brushSize, setBrushSize] = useState(strokeWidth);
  const [textColor, setTextColor] = useState('rgba(0, 0, 0, 1)');
  const [brushColor, setBrushColor] = useState(strokeColor);
  const currentSubTool = activeSubTool || 'select';
  const [shapeColor, setShapeColor] = useState(strokeColor);
  const [backgroundColor, setBackgroundColor] = useState('#CCCCCC');
  const [opacity, setOpacity] = useState(100);
  const [textAlignment, setTextAlignment] = useState<'left' | 'center' | 'right'>('left');
  const [, setIsBrushMode] = useState(true);
  const [textTransform, setTextTransform] = useState<'none' | 'uppercase' | 'lowercase' | 'capitalize'>('none');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pen Tool specific states
  const [penMode, setPenMode] = useState<'polygon' | 'freehand'>('polygon');
  const [penFillColor, setPenFillColor] = useState('rgba(255, 255, 255, 0)');
  const [penFillOpacity, setPenFillOpacity] = useState(0);
  const [penSnapDistance, setPenSnapDistance] = useState(20);
  const [showFillPicker, setShowFillPicker] = useState(false);

  // Table specific states
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [tableBorderColor, setTableBorderColor] = useState('#000000');
  const [tableFillColor, setTableFillColor] = useState('#ffffff');
  const [tableColorTarget, setTableColorTarget] = useState<'border' | 'fill'>('border');

  // Brush specific states
  const [internalDrawingMode, setInternalDrawingMode] = useState<DrawingMode>(DrawingMode.BRUSH);
  const currentDrawingMode = drawingMode ?? internalDrawingMode;
  const [brushOpacity, setBrushOpacity] = useState(100);

  // Helper to extract opacity for the slider when switching
  const parseOpacity = (rgbaString: string) => {
    const match = rgbaString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);
    if (match && match[4]) {
      return Math.round(parseFloat(match[4]) * 100);
    }
    return 100;
  };

  const validateBrushSize = (mode: DrawingMode, currentSize: number): number => {
    const config = DRAWING_MODE_CONFIG[mode];
    
    if (mode === DrawingMode.FILL) {
      return config.defaultSize; // Always 3000px for fill
    }
    
    // For brush and eraser, clamp to min/max
    return Math.max(
      config.minSize,
      Math.min(config.maxSize, currentSize)
    );
  };

  // FIX: Restore the saved local color when switching tools
  useEffect(() => {
    if (activeTool === 'Text') {
      onStrokeColorChange?.(textColor);
      setOpacity(parseOpacity(textColor)); 
    } else if (activeTool === 'Brush') {
      const validatedSize = validateBrushSize(currentDrawingMode, brushSize);
      if (validatedSize !== brushSize) {
        setBrushSize(validatedSize);
        onStrokeWidthChange?.(validatedSize);
      }
      onStrokeColorChange?.(brushColor);
      setOpacity(parseOpacity(brushColor));
      setBrushOpacity(parseOpacity(brushColor));
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
      setBrushOpacity(Math.round(alpha * 100));
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
      const config = DRAWING_MODE_CONFIG[DrawingMode.BRUSH];
      setBrushSize(config.defaultSize);
      setBrushColor('#000000');
      setIsBrushMode(true);
      if (drawingMode === undefined) setInternalDrawingMode(DrawingMode.BRUSH);
      setBrushOpacity(100);
      onStrokeWidthChange?.(config.defaultSize);
      onDrawingModeChange?.(DrawingMode.BRUSH);
    } else if (activeTool === 'Color') {
      setOpacity(100);
      onStrokeColorChange?.('rgba(0, 0, 0, 1)');
    } else if (activeTool === 'Table') {
      setTableRows(3);
      setTableCols(3);
      setTableBorderColor('#000000');
      setTableFillColor('#ffffff');
      onTableChange?.('reset', null);
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
    onToolChange?.(tool);
  };

  const handleTextTransform = (type: 'uppercase' | 'lowercase' | 'capitalize') => {
    setTextTransform(type);
    onAdvancedTextChange?.('textTransform', type);
  };

  const handleListToggle = (type: 'bullet' | 'number') => {
    onAdvancedTextChange?.('listType', type);
  };

  const handleTablePropertyChange = (prop: 'rows' | 'cols', value: number) => {
    if (prop === 'rows') setTableRows(value);
    if (prop === 'cols') setTableCols(value);
    onTableChange?.(prop, value);
  };

  const handleTableColorChange = (color: any, target: 'border' | 'fill') => {
    const hex = color.hex;
    if (target === 'border') {
      setTableBorderColor(hex);
      onTableChange?.('borderColor', hex);
    } else {
      setTableFillColor(hex);
      onTableChange?.('fill', hex);
    }
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
    const drawingModes = [
      { id: DrawingMode.BRUSH, label: 'Brush', icon: BrushIcon, isSvg: true,  },
      { id: DrawingMode.FILL, label: 'Fill', icon: paint_bucket_icon, isSvg: true,  },
      { id: DrawingMode.ERASER, label: 'Eraser', icon: eraser_color_icon, isSvg: true,  },
    ];
 
    // ENHANCED: Better mode change handler
    const handleModeChange = (mode: DrawingMode) => {
      if (drawingMode === undefined) setInternalDrawingMode(mode);
      onDrawingModeChange?.(mode);
      
      // Get size configuration for the new mode
      const config = DRAWING_MODE_CONFIG[mode];
      const newSize = config.defaultSize;
      
      // Update brush size based on mode
      setBrushSize(newSize);
      onStrokeWidthChange?.(newSize);
      
      // Show color picker immediately for Fill mode
      if (mode === DrawingMode.FILL) {
        setShowColorPicker(true);
      } else {
        setShowColorPicker(false);
      }
      
      // Additional actions based on mode
      switch(mode) {
        case DrawingMode.ERASER:
          // Set color to canvas background color (or white for eraser)
          onStrokeColorChange?.('#ffffff'); // Or use current canvas bg
          break;
        case DrawingMode.FILL:
          // Show color picker for fill
          setShowColorPicker(true);
          break;
        case DrawingMode.BRUSH:
          // Restore previous brush color
          onStrokeColorChange?.(brushColor);
          break;
      }
    };

    // ENHANCED: Better fill handler
    const handleFill = () => {
      if (currentDrawingMode === DrawingMode.FILL) {
        onFillAction?.(brushColor);
        onBackgroundChange?.(brushColor);
      }
    };

    // ENHANCED: Color change handler specifically for fill
    const handleFillColorChange = (color: any) => {
      const rgbaColor = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${brushOpacity / 100})`;
      setBrushColor(rgbaColor);
      
      // If we're in fill mode, update immediately
      if (currentDrawingMode === DrawingMode.FILL) {
        onStrokeColorChange?.(rgbaColor);
        // Optional: Auto-apply fill could go here
      }
    };
  
    return (
      <div className="w-full h-full flex flex-row items-center gap-6 px-4">
        
        {/* Section 1: Drawing Modes */}
        <div className="flex items-center gap-2 border-r border-zinc-700 pr-6">

          <div className="flex gap-1">
            {drawingModes.map((mode) => (
              <ToolbarButton
                key={mode.id}
                isActive={currentDrawingMode === mode.id}
                onClick={() => handleModeChange(mode.id)}
                className={cn(
                  "flex-col h-14 px-3 min-w-[50px] relative",
                  currentDrawingMode === mode.id && mode.id === DrawingMode.FILL
                    ? "ring-2 ring-indigo-400 ring-offset-1 ring-offset-zinc-800"
                    : ""
                )}
                title={mode.label}
              >
                {mode.isSvg && typeof mode.icon === 'string' ? (
                  <ReactSVG src={mode.icon} className={cn("w-10 h-10")} />
                ) : (
                  <span>icons</span>
                )}
                <span className="text-[10px] mt-1 font-medium">{mode.label}</span>
                
                {/* Visual indicator for active mode */}
                {currentDrawingMode === mode.id && (
                  <div className={cn(
                    "absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full",
                    mode.id === DrawingMode.FILL
                      ? "bg-indigo-400 animate-pulse"
                      : "bg-indigo-400"
                  )} />
                )}
              </ToolbarButton>
            ))}
          </div>
        </div>
  
        {/* Section 2: Properties */}
        <div className="flex items-center gap-6 flex-1">
          
          {/* Color & Opacity Group */}
          <div className="flex items-center gap-4">
            {/* Color Picker */}
            <div className="relative group">
              <div
                onClick={() => {
                  if (currentDrawingMode === DrawingMode.FILL) {
                    handleFill();
                  } else if (currentDrawingMode !== DrawingMode.ERASER) {
                    setShowColorPicker(!showColorPicker);
                  }
                }}
                className={cn(
                  "w-10 h-10 rounded-full cursor-pointer border-2 shadow-lg hover:scale-105 transition-transform duration-200 relative overflow-hidden",
                  currentDrawingMode === DrawingMode.FILL 
                    ? "border-indigo-400 border-4 animate-pulse" 
                    : currentDrawingMode === DrawingMode.ERASER
                    ? "border-gray-400"
                    : "border-white/20"
                )}
                style={{ 
                  backgroundColor: currentDrawingMode === DrawingMode.ERASER 
                    ? '#f0f0f0' // Gray for eraser
                    : brushColor 
                }}
                title={
                  currentDrawingMode === DrawingMode.FILL 
                    ? "Click to fill page" 
                    : currentDrawingMode === DrawingMode.ERASER
                    ? "Eraser Active"
                    : "Brush Color"
                }
              >
                  {/* Fill icon overlay for Fill mode */}
                  {currentDrawingMode === DrawingMode.FILL && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PaintBucket className="w-4 h-4 text-white/90 drop-shadow-lg" />
                    </div>
                  )}
              </div>
              
              {/* Different badge for different modes */}
              <div className="absolute -bottom-1 -right-1 bg-zinc-800 rounded-full p-1 pointer-events-none border border-zinc-700">
                {currentDrawingMode === DrawingMode.ERASER ? (
                  <Eraser className="w-2 h-2 text-white" />
                ) : currentDrawingMode === DrawingMode.FILL ? (
                  <div className="w-2 h-2 bg-indigo-400 rounded-full" />
                ) : (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>

              {showColorPicker && currentDrawingMode !== DrawingMode.ERASER && (
                <div className="absolute top-12 left-0 z-50">
                  <div className="fixed inset-0" onClick={() => setShowColorPicker(false)} />
                  <div className="relative bg-zinc-800 rounded-lg shadow-2xl p-2 border border-zinc-700">
                    <SketchPicker
                      color={rgbaToHex(brushColor)}
                      onChangeComplete={(color) => {
                        if (currentDrawingMode === DrawingMode.FILL) {
                          handleFillColorChange(color);
                        } else {
                          const rgbaColor = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${brushOpacity / 100})`;
                          setBrushColor(rgbaColor);
                          onStrokeColorChange?.(rgbaColor);
                        }
                      }}
                      disableAlpha={true}
                    />
                    {currentDrawingMode === DrawingMode.FILL && (
                      <div className="mt-2 px-2 py-1 bg-indigo-500/20 rounded text-xs text-indigo-200 border border-indigo-500/30">
                        <div className="flex items-center gap-1">
                          <PaintBucket className="w-3 h-3" />
                          <span>Selected color will fill the entire page</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Opacity Slider - Hide for Eraser mode */}
            {currentDrawingMode !== DrawingMode.ERASER && (
              <div className="flex flex-col gap-1 w-28">
                <div className="flex justify-between items-center px-1">
                  <span className={cn(
                    "text-[10px] font-medium",
                    currentDrawingMode === DrawingMode.FILL ? "text-indigo-300" : "text-zinc-400"
                  )}>
                    {currentDrawingMode === DrawingMode.FILL ? "Fill Opacity" : "Opacity"}
                  </span>
                  <span className="text-[10px] text-white font-mono">{brushOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={brushOpacity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setBrushOpacity(value);
                    const match = brushColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+)/);
                    if (match) {
                      const newColor = `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${value / 100})`;
                      setBrushColor(newColor);
                      onStrokeColorChange?.(newColor);
                    }
                  }}
                  className={cn(
                    "w-full h-1.5 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-110 transition-all",
                    currentDrawingMode === DrawingMode.FILL
                      ? "bg-indigo-900/30 [&::-webkit-slider-thumb]:bg-indigo-400"
                      : "bg-zinc-600 [&::-webkit-slider-thumb]:bg-white"
                  )}
                />
              </div>
            )}
          </div>
  
          <Divider />

          {/* Size Controls */}
          <div className="flex flex-col gap-1 flex-1 max-w-[200px]">
            <div className="flex justify-between items-center px-1">
              <span className={cn(
                "text-[10px] font-medium",
                currentDrawingMode === DrawingMode.FILL ? "text-indigo-300" : "text-zinc-400"
              )}>
                {currentDrawingMode === DrawingMode.ERASER 
                  ? "Eraser Size" 
                  : currentDrawingMode === DrawingMode.FILL 
                    ? "Fill Area (3000px)" 
                    : "Brush Size"
                }
              </span>
              <span className="text-[10px] text-white font-mono">
                {currentDrawingMode === DrawingMode.FILL 
                  ? "Full Page" 
                  : `${brushSize}px`
                }
              </span>
            </div>
            
            {currentDrawingMode !== DrawingMode.FILL ? (
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={DRAWING_MODE_CONFIG[currentDrawingMode].minSize}
                  max={DRAWING_MODE_CONFIG[currentDrawingMode].maxSize}
                  value={brushSize}
                  onChange={(e) => {
                    const size = parseInt(e.target.value);
                    setBrushSize(size);
                    onStrokeWidthChange?.(size);
                  }}
                  className={cn(
                    "w-full h-1.5 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-110 transition-all",
                    currentDrawingMode === DrawingMode.ERASER
                      ? "bg-gray-700 [&::-webkit-slider-thumb]:bg-gray-300"
                      : "bg-zinc-600 [&::-webkit-slider-thumb]:bg-white"
                  )}
                />
                
                {/* Visual Preview */}
                <div className="shrink-0 flex items-center justify-center">
                  {currentDrawingMode === DrawingMode.ERASER ? (
                    <div className="relative">
                      <div 
                        className="rounded-full bg-gray-300 border-2 border-white shadow-md"
                        style={{ 
                          width: Math.min(24, Math.max(4, brushSize / 8)), 
                          height: Math.min(24, Math.max(4, brushSize / 8)),
                        }}
                      />
                      <Eraser className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 text-gray-700" />
                    </div>
                  ) : (
                    <div 
                      className="rounded-full bg-white transition-all"
                      style={{ 
                        width: Math.min(24, Math.max(4, brushSize / 8)), 
                        height: Math.min(24, Math.max(4, brushSize / 8)),
                        backgroundColor: brushColor 
                      }}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-full h-1.5 bg-indigo-900/30 rounded-lg flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent rounded-lg" />
                  <div className="relative text-[8px] text-indigo-300 font-medium px-2 py-0.5 bg-indigo-900/50 rounded">
                    Full Page Fill (3000px)
                  </div>
                </div>
                
                <div className="shrink-0">
                  <div 
                    className="w-6 h-6 rounded-lg border-2 border-indigo-400 shadow-lg"
                    style={{ backgroundColor: brushColor }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Actions */}
        <div className="flex items-center gap-3 border-l border-zinc-700 pl-6">
           {/* Fill Action Button - Only show in Fill mode */}
           {currentDrawingMode === DrawingMode.FILL && (
             <div 
               className="flex flex-col items-center group cursor-pointer"
               onClick={handleFill}
               title="Fill entire page with current color"
             >
               <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center hover:scale-110 transition-transform duration-200 shadow-lg shadow-indigo-500/30">
                 <PaintBucket className="w-4.5 h-4.5 text-white" />
               </div>
               <span className="text-[9px] text-indigo-300 mt-1 font-medium">Fill Page</span>
             </div>
           )}
           
           <div className="flex flex-col items-center group cursor-pointer" onClick={handleRefresh}>
             <RefreshCcw className={cn(
                "w-4 h-4 transition-colors",
                currentDrawingMode === DrawingMode.FILL ? "text-indigo-400 group-hover:text-indigo-300" : "text-zinc-400 group-hover:text-white"
             )} />
             <span className={cn("text-[9px] mt-1", currentDrawingMode === DrawingMode.FILL ? "text-indigo-400" : "text-zinc-500")}>Reset</span>
           </div>
          
           <div className="flex gap-1">
              <ToolbarButton 
                  onClick={() => {
                      const undoTexts = undo?.();
                      if (undoTexts) updatePageData?.(currentPageIndex, 'texts', undoTexts);
                  }}
                  disabled={!canUndo}
                  className={`h-8 w-8 p-0 ${!canUndo ? 'opacity-50' : ''}`}
              >
                  <Undo2 className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton 
                  onClick={() => {
                      const redoTexts = redo?.();
                      if (redoTexts) updatePageData?.(currentPageIndex, 'texts', redoTexts);
                  }}
                  disabled={!canRedo}
                  className={`h-8 w-8 p-0 ${!canRedo ? 'opacity-50' : ''}`}
              >
                  <Redo2 className="w-4 h-4" />
              </ToolbarButton>
           </div>
        </div>
      </div>
    );
  };

  const renderToolPanel = () => {
    const tools: { id: string; icon: any; label: string }[] = [
      { id: 'select', icon: select, label: 'Select' },
      { id: 'hand', icon: hand, label: 'Hand' },
      { id: 'pen', icon: Pen_tool, label: 'Pen' },
      { id: 'sticky_note', icon: Sticky_note, label: 'Sticky Note' },
      { id: 'table', icon: TableIcon, label: 'Table' },
      { id: 'eraser', icon: eraser_color_icon, label: 'Eraser' },
    ];

    const handleImageClick = () => {
      fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && onImageUpload) {
        onImageUpload(file);
      }
      if (e.target.value) e.target.value = '';
    };

    return (
      <>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
        />

        <div 
          onClick={handleRefresh}
          className="flex flex-col items-center justify-center px-2 mr-2 cursor-pointer group"
        >
          <RotateCw className="w-5 h-5 text-zinc-400 group-hover:text-white group-hover:rotate-180 transition-all duration-500" />
          <span className="text-[10px] text-zinc-500 mt-1 font-medium tracking-wide group-hover:text-zinc-300">Refresh</span>
        </div>

        <Divider />

        <div className="flex items-center gap-2 overflow-x-auto w-full max-w-[750px]">
          {tools.map((t) => (
            <div
              key={t.id}
              className={cn(
                "flex flex-col items-center gap-1 cursor-pointer group p-2 rounded-md transition-all min-w-[100px]",
                currentSubTool === t.id ? "bg-white/10" : "hover:bg-white/5"
              )}
              onClick={() => handleToolSelect(t.id)}
            >
              {typeof t.icon === 'string' ? (
                 <img src={t.icon} alt={t.label} className="w-10 h-10" />
              ) : (
                 <t.icon size={40} className={cn(currentSubTool === t.id ? "text-primary" : "text-gray-300")} />
              )}
              <span className={cn("text-[9px]", currentSubTool === t.id ? "text-white" : "text-gray-400")}>{t.label}</span>
              {currentSubTool === t.id && <div className="h-0.5 w-10 bg-primary rounded-full mt-0.5"></div>}
            </div>
          ))}
          
          <div
              className="flex flex-col items-center gap-1 cursor-pointer group p-2 rounded-md hover:bg-white/5 min-w-[100px]"
              onClick={handleImageClick}
            >
              <img src={import_image} alt="Import" className="w-10 h-10" />
              <span className="text-[9px] text-gray-400 group-hover:text-white">Image</span>
            </div>
        </div>
        
        <Divider />

        <div className="flex items-center gap-2">
           <button 
             onClick={() => onZoomChange?.(Math.max(0.5, (currentZoom || 1) - 0.1))}
             className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white"
             title="Zoom Out"
           >
             <ZoomOut className="w-5 h-5" />
           </button>
           <span className="text-xs text-zinc-400 w-8 text-center">{Math.round((currentZoom || 1) * 100)}%</span>
           <button 
             onClick={() => onZoomChange?.(Math.min(3, (currentZoom || 1) + 0.1))}
             className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white"
             title="Zoom In"
           >
             <ZoomIn className="w-5 h-5" />
           </button>
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

  const renderTablePanel = () => {
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
        
        {/* Rows & Cols */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-zinc-400 mb-1">Rows</span>
            <div className="flex items-center bg-white/5 rounded-lg border border-transparent hover:border-zinc-700">
              <button onClick={() => handleTablePropertyChange('rows', Math.max(1, tableRows - 1))} className="h-8 w-6 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 rounded-l-lg">
                <Minus className="w-3 h-3" />
              </button>
              <div className="w-8 text-center text-xs font-medium text-zinc-200 font-mono">{tableRows}</div>
              <button onClick={() => handleTablePropertyChange('rows', tableRows + 1)} className="h-8 w-6 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 rounded-r-lg">
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-zinc-400 mb-1">Cols</span>
            <div className="flex items-center bg-white/5 rounded-lg border border-transparent hover:border-zinc-700">
              <button onClick={() => handleTablePropertyChange('cols', Math.max(1, tableCols - 1))} className="h-8 w-6 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 rounded-l-lg">
                <Minus className="w-3 h-3" />
              </button>
              <div className="w-8 text-center text-xs font-medium text-zinc-200 font-mono">{tableCols}</div>
              <button onClick={() => handleTablePropertyChange('cols', tableCols + 1)} className="h-8 w-6 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 rounded-r-lg">
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        <Divider />

        {/* Border Color */}
        <div className="relative flex flex-col items-center gap-1">
           <span className="text-[9px] text-zinc-400">Border</span>
           <div 
            onClick={() => {
              setTableColorTarget('border');
              setShowColorPicker(!showColorPicker || tableColorTarget !== 'border');
            }}
            className="w-8 h-8 rounded-md cursor-pointer hover:scale-110 transition-transform shadow-lg ring-1 ring-white/10" 
            style={{ backgroundColor: tableBorderColor }}
            title="Border Color"
          />
        </div>

        {/* Fill Color */}
        <div className="relative flex flex-col items-center gap-1 ml-2">
           <span className="text-[9px] text-zinc-400">Fill</span>
           <div 
            onClick={() => {
              setTableColorTarget('fill');
              setShowColorPicker(!showColorPicker || tableColorTarget !== 'fill');
            }}
            className="w-8 h-8 rounded-md cursor-pointer hover:scale-110 transition-transform shadow-lg ring-1 ring-white/10" 
            style={{ backgroundColor: tableFillColor }}
            title="Fill Color"
          />
        </div>

        {showColorPicker && (tableColorTarget === 'border' || tableColorTarget === 'fill') && (
          <div className="absolute top-16 left-20 z-50">
            <div className="fixed inset-0" onClick={() => setShowColorPicker(false)} />
            <SketchPicker 
              color={tableColorTarget === 'border' ? tableBorderColor : tableFillColor} 
              onChange={(color) => handleTableColorChange(color, tableColorTarget)} 
            />
          </div>
        )}

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

  const renderPenPanel = () => {
    return (
      <div className="w-full flex items-center gap-4 px-2">
        <div 
            onClick={() => onToolChange?.('select')}
            className="flex flex-col items-center justify-center px-2 mr-2 cursor-pointer group border-r border-zinc-700 pr-4"
        >
            <ChevronLeft className="w-5 h-5 text-zinc-400 group-hover:text-white transition-all" />
            <span className="text-[10px] text-zinc-500 mt-1 font-medium tracking-wide group-hover:text-zinc-300">Back</span>
        </div>

        {/* Mode Selection */}
        <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-400">Mode:</span>
            <div className="flex gap-1">
            <ToolbarButton 
                isActive={penMode === 'polygon'}
                onClick={() => {
                    setPenMode('polygon');
                    onPenOptionChange?.('mode', 'polygon');
                }}
                className="text-[10px] px-2 h-7"
            >
                Polygon
            </ToolbarButton>
            <ToolbarButton 
                isActive={penMode === 'freehand'}
                onClick={() => {
                    setPenMode('freehand');
                    onPenOptionChange?.('mode', 'freehand');
                }}
                className="text-[10px] px-2 h-7"
            >
                Freehand
            </ToolbarButton>
            </div>
        </div>

        <Divider />

        {/* Stroke Settings */}
        <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1 w-24">
                <div className="flex justify-between">
                    <span className="text-[9px] text-zinc-400">Stroke</span>
                    <span className="text-[9px] text-zinc-300">{strokeWidth}px</span>
                </div>
                <input
                    type="range"
                    min="1"
                    max="20"
                    value={strokeWidth}
                    onChange={(e) => onStrokeWidthChange?.(parseInt(e.target.value))}
                    className="w-full h-1 bg-zinc-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                />
            </div>
            
            <div className="relative">
                <div 
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="w-7 h-7 rounded-full cursor-pointer border border-white/20 hover:scale-110 transition-transform"
                    style={{ backgroundColor: strokeColor }}
                    title="Stroke Color"
                />
                {showColorPicker && !showFillPicker && (
                    <div className="absolute top-10 left-0 z-50">
                        <div className="fixed inset-0" onClick={() => setShowColorPicker(false)} />
                        <SketchPicker 
                            color={strokeColor} 
                            onChange={(color) => {
                                const rgba = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a ?? 1})`;
                                onStrokeColorChange?.(rgba);
                            }} 
                        />
                    </div>
                )}
            </div>
        </div>

        <Divider />

        {/* Fill Settings */}
        <div className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1">
                <span className="text-[9px] text-zinc-400">Fill</span>
                <div 
                    className="w-7 h-7 rounded border border-white/20 cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: penFillColor }}
                    onClick={() => {
                        setShowFillPicker(!showFillPicker);
                        setShowColorPicker(false);
                    }}
                    title="Fill Color"
                />
                {showFillPicker && (
                    <div className="absolute top-full mt-2 z-50">
                        <div className="fixed inset-0" onClick={() => setShowFillPicker(false)} />
                        <SketchPicker 
                            color={penFillColor} 
                            onChange={(color) => {
                                const rgba = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a ?? 1})`;
                                setPenFillColor(rgba);
                                onPenOptionChange?.('fillColor', rgba);
                            }} 
                        />
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-1 w-20">
                 <div className="flex justify-between">
                    <span className="text-[9px] text-zinc-400">Opacity</span>
                    <span className="text-[9px] text-zinc-300">{penFillOpacity}%</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={penFillOpacity}
                    onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setPenFillOpacity(val);
                        onPenOptionChange?.('fillOpacity', val);
                    }}
                    className="w-full h-1 bg-zinc-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                />
            </div>
        </div>

        <Divider />

        {/* Snap Settings */}
        <div className="flex flex-col gap-1 w-20">
            <div className="flex justify-between">
                <span className="text-[9px] text-zinc-400">Snap</span>
                <span className="text-[9px] text-zinc-300">{penSnapDistance}px</span>
            </div>
            <input
                type="range"
                min="5"
                max="50"
                value={penSnapDistance}
                onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setPenSnapDistance(val);
                    onPenOptionChange?.('snapDistance', val);
                }}
                className="w-full h-1 bg-zinc-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
        </div>

        <div className="flex-grow" />

        {/* Actions */}
        <div className="flex items-center gap-2">
            <ToolbarButton 
                onClick={() => onPenAction?.('reset')} 
                className="text-[10px] px-2 h-8 bg-red-500/20 text-red-200 hover:bg-red-500/30 hover:text-red-100"
            >
                Reset
            </ToolbarButton>
            <ToolbarButton 
                onClick={() => onPenAction?.('complete')} 
                className="text-[10px] px-2 h-8 bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30 hover:text-indigo-100"
            >
                Complete
            </ToolbarButton>
        </div>
      </div>
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
        if (activeSubTool === 'pen') return renderPenPanel();
        return renderToolPanel();
      case 'Shapes':
        return renderShapesPanel();
      case 'Table':
        return renderTablePanel();
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
