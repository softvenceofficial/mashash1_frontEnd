/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
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

const Divider = () => <div className="w-px h-6 bg-zinc-700 mx-2 self-center" />;

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
  currentPageIndex = 0
}: ToolboxProps) => {
  const [selectedBook, setSelectedBook] = useState(2);
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState('Roboto');
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedShape, setSelectedShape] = useState('square');
  const [selectedTool, setSelectedTool] = useState('pencil');
  const [brushSize, setBrushSize] = useState(strokeWidth);

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

  const handleColorChange = (color: any) => {
    onStrokeColorChange?.(color.hex);
  };

  const handleBookSelect = (bookId: number, label: string) => {
    setSelectedBook(bookId);
    onBookSizeChange?.(label);
  };

  const handleShapeSelect = (shape: string) => {
    setSelectedShape(shape);
    onShapeChange?.(shape);
  };

  const handleToolSelect = (tool: string) => {
    setSelectedTool(tool);
    onToolChange?.(tool);
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
      <div className="flex flex-col items-center justify-center px-2 mr-2 cursor-pointer group">
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
          style={{ backgroundColor: strokeColor }}
          title="Text Color"
        />
        {showColorPicker && (
          <div className="absolute top-12 left-0 z-50">
            <div className="fixed inset-0" onClick={() => setShowColorPicker(false)} />
            <SketchPicker color={strokeColor} onChange={handleColorChange} />
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
        <ToolbarButton isActive={false}><AlignLeft className="w-5 h-5" /></ToolbarButton>
        <ToolbarButton isActive={false}><AlignCenter className="w-5 h-5" /></ToolbarButton>
        <ToolbarButton isActive={false}><AlignRight className="w-5 h-5" /></ToolbarButton>
      </div>
      
      <Divider />
      
      <div className="flex items-center gap-1 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800">
        <ToolbarButton isActive={true} className="!h-8 !min-w-[32px] bg-indigo-500/20 text-indigo-300">
          <span className="font-bold text-sm">Tt</span>
        </ToolbarButton>
        <ToolbarButton isActive={false} className="!h-8 !min-w-[32px]">
          <span className="font-bold text-sm">TT</span>
        </ToolbarButton>
      </div>

      <Divider />

      <div className="flex items-center gap-1">
        <ToolbarButton isActive={false}><List className="w-5 h-5" /></ToolbarButton>
        <ToolbarButton isActive={false}><ListOrdered className="w-5 h-5" /></ToolbarButton>
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

  const renderColorPanel = () => (
    <>
      <div className="flex flex-col items-center justify-center px-2 mr-2 cursor-pointer group">
        <RotateCw className="w-5 h-5 text-zinc-400 group-hover:text-white group-hover:rotate-180 transition-all duration-500" />
        <span className="text-[10px] text-zinc-500 mt-1 font-medium tracking-wide group-hover:text-zinc-300">Refresh</span>
      </div>

      <Divider />

      <div className="relative">
        <div 
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="w-10 h-10 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg ring-2 ring-white/20"
          style={{ background: 'conic-gradient(at center, red, yellow, lime, cyan, blue, magenta, red)' }}
        />
        {showColorPicker && (
          <div className="absolute top-12 left-0 z-50">
            <div className="fixed inset-0" onClick={() => setShowColorPicker(false)} />
            <SketchPicker color={strokeColor} onChange={handleColorChange} />
          </div>
        )}
      </div>

      <Divider />

      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-400">Opacity</span>
        <input 
          type="range" 
          min="0" 
          max="100" 
          defaultValue="100"
          className="w-32 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
        />
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

  const renderBrushPanel = () => (
    <>
      <div className="flex flex-col items-center justify-center px-2 mr-2 cursor-pointer group">
        <RotateCw className="w-5 h-5 text-zinc-400 group-hover:text-white group-hover:rotate-180 transition-all duration-500" />
        <span className="text-[10px] text-zinc-500 mt-1 font-medium tracking-wide group-hover:text-zinc-300">Refresh</span>
      </div>

      <Divider />

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center gap-1 group cursor-pointer">
          <Brush className="text-white w-6 h-6" />
          <span className="text-[10px] text-white">Brush</span>
          <div className="h-0.5 w-4 bg-primary rounded-full"></div>
        </div>
        <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={() => handleToolSelect('eraser')}>
          <Eraser className="text-gray-400 w-6 h-6" />
          <span className="text-[10px] text-gray-400">Eraser</span>
        </div>
      </div>

      <Divider />

      <div className="flex items-center bg-white/5 rounded-lg border border-transparent hover:border-zinc-700 mx-2">
        <button onClick={() => handleBrushSizeChange(-1)} className="h-10 w-10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 rounded-l-lg">
          <Minus className="w-4 h-4" />
        </button>
        <div className="w-10 text-center text-sm font-medium text-zinc-200 font-mono">{brushSize}</div>
        <button onClick={() => handleBrushSizeChange(1)} className="h-10 w-10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 rounded-r-lg">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="relative">
        <div 
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="w-9 h-9 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg ring-2 ring-transparent hover:ring-white/20" 
          style={{ backgroundColor: strokeColor }}
        />
        {showColorPicker && (
          <div className="absolute top-12 left-0 z-50">
            <div className="fixed inset-0" onClick={() => setShowColorPicker(false)} />
            <SketchPicker color={strokeColor} onChange={handleColorChange} />
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

  const renderToolPanel = () => {
    const tools = [
      { id: 'select', icon: MousePointer2, label: 'Select' },
      { id: 'hand', icon: Hand, label: 'Pan' },
      { id: 'pipette', icon: Pipette, label: 'Picker' },
      { id: 'eraser', icon: Eraser, label: 'Eraser' },
    ];

    return (
      <>
        <div className="flex flex-col items-center justify-center px-2 mr-2 cursor-pointer group">
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
        <div className="flex flex-col items-center justify-center px-2 mr-2 cursor-pointer group">
          <RotateCw className="w-5 h-5 text-zinc-400 group-hover:text-white group-hover:rotate-180 transition-all duration-500" />
          <span className="text-[10px] text-zinc-500 mt-1 font-medium tracking-wide group-hover:text-zinc-300">Refresh</span>
        </div>

        <Divider />

        <div className="flex items-center gap-3">
          {shapes.map((s) => (
            <button
              key={s.id}
              className={cn(
                "h-10 w-10 p-2 rounded-md transition-all",
                selectedShape === s.id
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              )}
              onClick={() => handleShapeSelect(s.id)}
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
            style={{ backgroundColor: strokeColor }}
          />
          {showColorPicker && (
            <div className="absolute top-12 left-0 z-50">
              <div className="fixed inset-0" onClick={() => setShowColorPicker(false)} />
              <SketchPicker color={strokeColor} onChange={handleColorChange} />
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
