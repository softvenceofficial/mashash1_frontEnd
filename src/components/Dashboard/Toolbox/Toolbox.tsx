/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import {
  RotateCw,
  Minus,
  Plus,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  PaintBucket,
  Brush,
  Eraser,
  Crop,
  MousePointer2,
  Pipette,
  Square,
  Circle,
  Triangle,
  Star,
  Minus as LineIcon,
  MoveRight,
  Hand,
  Pencil,
  ChevronDown,
  Undo2,
  Redo2,
} from "lucide-react";
import { ChromePicker } from "react-color";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import book1 from "@/assets/images/Books/5x7.png";
import book2 from "@/assets/images/Books/6x4.png";
import book3 from "@/assets/images/Books/6x8.png";
import book4 from "@/assets/images/Books/6x9.png";
import book5 from "@/assets/images/Books/7x10.png";
import book6 from "@/assets/images/Books/8.5x11.png";
import book7 from "@/assets/images/Books/8x10.png";
import book8 from "@/assets/images/Books/12x9.png";
import book9 from "@/assets/images/Books/Square.png";

// --- Mock Data ---
const BASIC_COLORS = [
  "#3B82F6",
  "#67E8F9",
  "#86EFAC",
  "#FDBA74",
  "#EF4444",
  "#DB2777",
  "#9333EA",
];

const CUSTOM_COLORS = [
  "#3B82F6",
  "#67E8F9",
  "#86EFAC",
  "#C2410C",
  "#EF4444",
  "#BE185D",
  "#7E22CE",
];

const BOOK_SIZES = [
  { id: 1, label: "5 x 7", type: "Book", image: book1 },
  { id: 2, label: "6 x 4", type: "Book", image: book2 },
  { id: 3, label: "6 x 8", type: "Book Mockup", image: book3 },
  { id: 4, label: "6 x 9", type: "Book Mockup", image: book4 },
  { id: 5, label: "7 x 10", type: "Book Mockup", image: book5 },
  { id: 6, label: "8.5 x 11", type: "Book Mockup", image: book6 },
  { id: 7, label: "8 x 10", type: "Book Mockup", image: book7 },
  { id: 8, label: "12 x 9", type: "Book Mockup", image: book8 },
  { id: 9, label: "Square", type: "Book Mockup", image: book9 },
];

// --- Shared Components ---

const RefreshButton = ({ onClick }: { onClick?: () => void }) => (
  <div
    className="flex flex-col items-center mr-4 cursor-pointer group"
    onClick={onClick}
  >
    <RotateCw className="w-5 h-5 text-zinc-400 group-hover:text-white group-hover:rotate-180 transition-all duration-500" />
    <span className="text-[10px] text-zinc-500 mt-1 font-medium tracking-wide group-hover:text-zinc-300">Refresh</span>
  </div>
);

const Divider = () => (
  <div className="w-px h-6 bg-zinc-700 mx-2 self-center" />
);

const ToolbarButton = ({ children, isActive, onClick, className = "" }: { children: React.ReactNode; isActive?: boolean; onClick?: () => void; className?: string }) => (
  <button
    onClick={onClick}
    className={`
      h-9 min-w-[36px] px-2 rounded-lg flex items-center justify-center transition-all duration-200
      hover:bg-white/10 active:scale-95
      ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}
      ${className}
    `}
  >
    {children}
  </button>
);

// --- Sub-Components (Tool Panels) ---

const BookSizePanel = ({ onChange }: { onChange?: (size: string) => void }) => {
  const [selectedBook, setSelectedBook] = useState(2);

  const handleBookSelect = (bookId: number, label: string) => {
    setSelectedBook(bookId);
    onChange?.(label);
  };

  return (
    <div className="flex items-center justify-around w-full gap-4 px-2">
      {BOOK_SIZES.map((book) => (
        <div
          key={book.id}
          onClick={() => handleBookSelect(book.id, book.label)}
          className={cn(
            "cursor-pointer transition-all duration-300 relative group",
            selectedBook === book.id
              ? "scale-105"
              : "opacity-70 hover:opacity-100 hover:scale-102",
          )}
        >
          <div className={cn(
            "absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-lg border border-gray-500 bg-white/5 z-0 transition-opacity duration-300 w-full h-[100px] px-1.5 box-content",
            selectedBook === book.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )} />
          <div className="relative z-10 flex flex-col items-center justify-between w-full h-full">
            <div className="w-full h-full">
              <img className="w-full h-full object-cover" src={book.image} alt="" />
            </div>
            <div className={cn(
              "text-center absolute top-[50%] left-[50%] w-max translate-x-[-50%] translate-y-[-50%] transition-all duration-300",
              selectedBook === book.id
                ? "opacity-100 scale-100"
                : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
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
};

const FONT_FAMILIES = [
  'Anton',
  'Bebas Neue',
  'Caveat',
  'Comfortaa',
  'Dancing Script',
  'Fredoka',
  'Heebo',
  'Josefin Sans',
  'Lobster',
  'Lora',
  'Merriweather',
  'Montserrat',
  'Oswald',
  'Pacifico',
  'Playfair Display',
  'Quicksand',
  'Raleway',
  'Roboto',
  'Roboto Slab',
  'Source Code Pro',
  'Work Sans',
];


interface TextPanelProps {
  onFontChange?: (font: string) => void;
  onFontSizeChange?: (size: number) => void;
  onTextColorChange?: (color: string) => void;
  onBoldChange?: (active: boolean) => void;
  onItalicChange?: (active: boolean) => void;
  onUnderlineChange?: (active: boolean) => void;
  onStrikeChange?: (active: boolean) => void;
  onAlignChange?: (align: string) => void;
  onCaseChange?: (caseType: 'normal' | 'uppercase') => void;
  onListChange?: (listType: 'none' | 'bullet' | 'ordered') => void;
}

const TextPanel = ({ onFontChange, onFontSizeChange, onTextColorChange, onBoldChange, onItalicChange, onUnderlineChange, onStrikeChange, onAlignChange, onCaseChange, onListChange }: TextPanelProps) => {
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState('Roboto');
  const [activeFormats, setActiveFormats] = useState<string[]>(['bold']);
  const [textColor, setTextColor] = useState('#ffffff');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [textAlign, setTextAlign] = useState('left');
  const [caseType, setCaseType] = useState<'normal' | 'uppercase'>('normal');
  const [listType, setListType] = useState<'none' | 'bullet' | 'ordered'>('none');

  const handleFontChange = (font: string) => {
    setFontFamily(font);
    onFontChange?.(font);
  };

  const handleFontSizeChange = (size: number) => {
    const validSize = Math.max(8, Math.min(72, size));
    setFontSize(validSize);
    onFontSizeChange?.(validSize);
  };

  const handleColorChange = (color: string) => {
    setTextColor(color);
    onTextColorChange?.(color);
  };

  const toggleFormat = (format: string) => {
    const isActive = activeFormats.includes(format);
    const newFormats = isActive 
      ? activeFormats.filter(f => f !== format) 
      : [...activeFormats, format];
    setActiveFormats(newFormats);
    
    if (format === 'bold') onBoldChange?.(!isActive);
    if (format === 'italic') onItalicChange?.(!isActive);
    if (format === 'underline') onUnderlineChange?.(!isActive);
    if (format === 'strike') onStrikeChange?.(!isActive);
  };

  const handleAlignChange = (align: string) => {
    setTextAlign(align);
    onAlignChange?.(align);
  };

  return (
    <>
      <RefreshButton />
      <Divider />

      {/* Font Family Selector */}
      <div className="relative group">
        <button className="h-10 px-4 bg-white/5 rounded-lg flex items-center gap-3 text-zinc-200 hover:bg-white/10 transition-colors border border-transparent hover:border-zinc-700">
          <span className="text-sm font-medium">{fontFamily}</span>
          <ChevronDown className="w-4 h-4 text-zinc-500" />
        </button>
        <div className="absolute top-full left-0 mt-2 w-48 max-h-64 overflow-y-auto bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-left z-50">
          {FONT_FAMILIES.map((font) => (
            <div 
              key={font}
              onClick={() => handleFontChange(font)}
              className="px-4 py-2 text-sm text-zinc-300 hover:bg-indigo-600 hover:text-white cursor-pointer first:rounded-t-lg last:rounded-b-lg"
              style={{ fontFamily: font }}
            >
              {font}
            </div>
          ))}
        </div>
      </div>

      {/* Font Size Control */}
      <div className="flex items-center bg-white/5 rounded-lg border border-transparent hover:border-zinc-700 mx-2">
        <button 
          onClick={() => handleFontSizeChange(fontSize - 1)}
          className="h-10 w-10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 rounded-l-lg"
        >
          <Minus className="w-4 h-4" />
        </button>
        <input
          type="number"
          min="8"
          max="72"
          value={fontSize}
          onChange={(e) => handleFontSizeChange(parseInt(e.target.value) || 24)}
          className="w-12 text-center text-sm font-medium text-zinc-200 font-mono bg-transparent border-none outline-none"
        />
        <button 
          onClick={() => handleFontSizeChange(fontSize + 1)}
          className="h-10 w-10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 rounded-r-lg"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Color Picker */}
      <div className="relative">
        <div 
          className="w-9 h-9 rounded-full mx-2 cursor-pointer hover:scale-110 transition-transform shadow-lg ring-2 ring-transparent hover:ring-white/20" 
          style={{ backgroundColor: textColor }}
          title="Text Color"
          onClick={() => setShowColorPicker(!showColorPicker)}
        />
        {showColorPicker && (
          <div className="absolute top-12 left-0 z-50 shadow-2xl rounded-lg bg-white">
            <ChromePicker 
              color={textColor} 
              onChange={(color) => handleColorChange(color.hex)}
              disableAlpha
            />
            <button
              onClick={() => setShowColorPicker(false)}
              className="w-full px-3 py-2 bg-indigo-600 text-white text-sm rounded-b-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Done
            </button>
          </div>
        )}
      </div>

      <Divider />

      {/* Basic Formatting */}
      <div className="flex items-center gap-1">
        <ToolbarButton 
          isActive={activeFormats.includes('bold')} 
          onClick={() => toggleFormat('bold')}
        >
          <Bold className="w-5 h-5" strokeWidth={2.5} />
        </ToolbarButton>
        
        <ToolbarButton 
          isActive={activeFormats.includes('italic')} 
          onClick={() => toggleFormat('italic')}
        >
          <Italic className="w-5 h-5" />
        </ToolbarButton>
        
        <ToolbarButton 
          isActive={activeFormats.includes('underline')} 
          onClick={() => toggleFormat('underline')}
        >
          <Underline className="w-5 h-5" />
        </ToolbarButton>
        
        <ToolbarButton 
          isActive={activeFormats.includes('strike')} 
          onClick={() => toggleFormat('strike')}
        >
          <Strikethrough className="w-5 h-5" />
        </ToolbarButton>
      </div>

      <Divider />

      {/* Alignment */}
      <div className="flex items-center gap-1">
        <ToolbarButton 
          isActive={textAlign === 'left'} 
          onClick={() => handleAlignChange('left')}
        >
          <AlignLeft className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton 
          isActive={textAlign === 'center'} 
          onClick={() => handleAlignChange('center')}
        >
          <AlignCenter className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton 
          isActive={textAlign === 'right'} 
          onClick={() => handleAlignChange('right')}
        >
          <AlignRight className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton 
          isActive={textAlign === 'justify'} 
          onClick={() => handleAlignChange('justify')}
        >
          <AlignJustify className="w-5 h-5" />
        </ToolbarButton>
      </div>
      
      <Divider />
      
      {/* Case Switching */}
      <div className="flex items-center gap-1 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800">
        <ToolbarButton 
          isActive={caseType === 'normal'} 
          className="!h-8 !min-w-[32px]"
          onClick={() => {
            setCaseType('normal');
            onCaseChange?.('normal');
          }}
        >
          <span className="font-bold text-sm">Tt</span>
        </ToolbarButton>
        <ToolbarButton 
          isActive={caseType === 'uppercase'} 
          className="!h-8 !min-w-[32px]"
          onClick={() => {
            setCaseType('uppercase');
            onCaseChange?.('uppercase');
          }}
        >
          <span className="font-bold text-sm">TT</span>
        </ToolbarButton>
      </div>

      <Divider />

      {/* Lists */}
      <div className="flex items-center gap-1">
        <ToolbarButton 
          isActive={listType === 'bullet'}
          onClick={() => {
            const newListType = listType === 'bullet' ? 'none' : 'bullet';
            setListType(newListType);
            onListChange?.(newListType);
          }}
        >
          <List className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton 
          isActive={listType === 'ordered'}
          onClick={() => {
            const newListType = listType === 'ordered' ? 'none' : 'ordered';
            setListType(newListType);
            onListChange?.(newListType);
          }}
        >
          <ListOrdered className="w-5 h-5" />
        </ToolbarButton>
      </div>

      <div className="flex-grow" />

      {/* Undo / Redo */}
      <div className="flex items-center gap-4 ml-4 px-4 border-l border-zinc-700">
        <div className="flex flex-col items-center group cursor-pointer">
          <Undo2 className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
          <span className="text-[10px] text-zinc-500 mt-1 font-medium group-hover:text-zinc-300">Undo</span>
        </div>
        <div className="flex flex-col items-center group cursor-pointer">
          <Redo2 className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
          <span className="text-[10px] text-zinc-500 mt-1 font-medium group-hover:text-zinc-300">Redo</span>
        </div>
      </div>
    </>
  );
};

interface ColorPanelProps {
  onColorChange?: (color: string) => void;
}

const ColorPanel = ({ onColorChange }: ColorPanelProps) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#3B82F6');

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    onColorChange?.(color);
  };

  return (
    <>
      <RefreshButton />
      
      {/* Main Color Picker Button */}
      <div className="relative">
        <div 
          className="w-10 h-10 rounded-full border-2 border-white/20 mr-6 shadow-md cursor-pointer hover:scale-105 transition-transform" 
          style={{ backgroundColor: selectedColor }}
          onClick={() => setShowColorPicker(!showColorPicker)}
          title="Open Color Picker"
        />
        {showColorPicker && (
          <div className="absolute top-12 left-0 z-50 shadow-2xl rounded-lg bg-white">
            <ChromePicker 
              color={selectedColor} 
              onChange={(color) => handleColorSelect(color.hex)}
              disableAlpha
            />
            <button
              onClick={() => setShowColorPicker(false)}
              className="w-full px-3 py-2 bg-indigo-600 text-white text-sm rounded-b-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Done
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 mr-6">
        <span className="text-xs text-white font-medium">Basic colors</span>
        <div className="flex gap-1.5">
          {BASIC_COLORS.map((color, i) => (
            <div
              key={i}
              onClick={() => handleColorSelect(color)}
              className={cn(
                "w-6 h-6 rounded-md cursor-pointer border-2 hover:scale-110 transition-transform",
                selectedColor === color ? "border-white" : "border-white/10"
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1 mr-6">
        <span className="text-xs text-white font-medium">Custom Colors</span>
        <div className="flex gap-1.5">
          {CUSTOM_COLORS.map((color, i) => (
            <div
              key={i}
              onClick={() => handleColorSelect(color)}
              className={cn(
                "w-6 h-6 rounded-md cursor-pointer border-2 hover:scale-110 transition-transform",
                selectedColor === color ? "border-white" : "border-white/10"
              )}
              style={{ backgroundColor: color }}
            />
          ))}
          <div 
            className="w-6 h-6 rounded-md bg-[#444] flex items-center justify-center cursor-pointer hover:bg-[#555] text-white"
            onClick={() => setShowColorPicker(true)}
            title="Add custom color"
          >
            <Plus size={14} />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center w-32 gap-1 ml-2">
        <div className="relative w-full h-4 bg-gray-600 rounded-full overflow-hidden">
          <div className="absolute inset-0 bg-gray-300 opacity-30"></div>
          <Slider
            defaultValue={[70]}
            max={100}
            step={1}
            className="absolute inset-0 z-10"
          />
        </div>
      </div>
    </>
  );
};

const BrushPanel = () => (
  <>
    <RefreshButton />
    <div className="flex items-center gap-6">
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-1 group cursor-pointer">
          <Brush className="text-white w-6 h-6" />
          <span className="text-[10px] text-white">Brush</span>
          <div className="h-0.5 w-4 bg-primary rounded-full"></div>
        </div>
        <div className="flex flex-col items-center gap-1 group cursor-pointer">
          <Brush className="text-gray-400 w-6 h-6 rotate-180" />
          <span className="text-[10px] text-gray-400">Brush</span>
        </div>
        <div className="flex flex-col items-center gap-1 group cursor-pointer">
          <PaintBucket className="text-gray-400 w-6 h-6" />
          <span className="text-[10px] text-gray-400">Fill</span>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-transparent px-2">
        {[6, 10, 14, 20].map((size, i) => (
          <div
            key={i}
            className={cn(
              "rounded-full bg-gray-400 hover:bg-white cursor-pointer transition-all",
              i === 2
                ? "bg-white ring-2 ring-primary ring-offset-2 ring-offset-[#2B2B2B]"
                : "",
            )}
            style={{ width: size, height: size }}
          />
        ))}
      </div>

      <div className="w-10 h-10 rounded-full bg-[#E0E7FF] border-2 border-primary cursor-pointer"></div>

      <div className="w-48 relative flex items-center">
        <div className="w-full h-3 bg-linear-to-r from-transparent to-white/20 rounded-full mr-2">
          <Slider defaultValue={[60]} max={100} step={1} />
        </div>
      </div>
    </div>
  </>
);

const GeneralToolPanel = () => {
  const [activeTool, setActiveTool] = useState("pencil");

  const tools = [
    { id: "pencil", icon: Pencil, label: "Pencil" },
    { id: "eraser", icon: Eraser, label: "Eraser" },
    { id: "select", icon: MousePointer2, label: "Select" },
    { id: "hand", icon: Hand, label: "Pan" },
    { id: "pipette", icon: Pipette, label: "Picker" },
    { id: "crop", icon: Crop, label: "Crop" },
  ];

  return (
    <>
      <RefreshButton />
      <div className="flex items-center gap-4">
        {tools.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex flex-col items-center gap-1 cursor-pointer group p-2 rounded-md transition-all",
              activeTool === t.id ? "bg-white/10" : "hover:bg-white/5",
            )}
            onClick={() => setActiveTool(t.id)}
          >
            <t.icon
              className={cn(
                "w-5 h-5",
                activeTool === t.id ? "text-primary" : "text-gray-300",
              )}
            />
            <span
              className={cn(
                "text-[9px]",
                activeTool === t.id ? "text-white" : "text-gray-400",
              )}
            >
              {t.label}
            </span>
          </div>
        ))}
      </div>

      <Separator orientation="vertical" className="h-8 bg-gray-600 mx-4" />

      <div className="flex flex-col gap-1 w-32">
        <div className="flex justify-between text-[10px] text-gray-400">
          <span>Size</span>
          <span>5px</span>
        </div>
        <Slider defaultValue={[5]} max={50} step={1} className="h-4" />
      </div>
    </>
  );
};

const ShapesPanel = () => {
  const [selectedShape, setSelectedShape] = useState("square");

  const shapes = [
    { id: "square", icon: Square, label: "Square" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "triangle", icon: Triangle, label: "Triangle" },
    { id: "star", icon: Star, label: "Star" },
    { id: "line", icon: LineIcon, label: "Line" },
    { id: "arrow", icon: MoveRight, label: "Arrow" },
  ];

  return (
    <>
      <RefreshButton />
      <div className="flex items-center gap-3">
        {shapes.map((s) => (
          <Button
            key={s.id}
            variant="ghost"
            className={cn(
              "h-10 w-10 p-2 rounded-md",
              selectedShape === s.id
                ? "bg-primary text-white hover:bg-primary/90"
                : "text-gray-400 hover:text-white hover:bg-white/10",
            )}
            onClick={() => setSelectedShape(s.id)}
          >
            <s.icon className="w-full h-full" />
          </Button>
        ))}
      </div>

      <Separator orientation="vertical" className="h-8 bg-gray-600 mx-4" />

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-white rounded bg-transparent"></div>
          <span className="text-[10px] text-gray-400">Stroke</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border border-gray-500 rounded bg-primary"></div>
          <span className="text-[10px] text-gray-400">Fill</span>
        </div>
      </div>
    </>
  );
};

// --- Main Component ---

interface ToolboxProps {
  activeTool: string;
  onBookSizeChange?: (size: string) => void;
  onFontFamilyChange?: (font: string) => void;
  onFontSizeChange?: (size: number) => void;
  onTextColorChange?: (color: string) => void;
  onBoldChange?: (active: boolean) => void;
  onItalicChange?: (active: boolean) => void;
  onUnderlineChange?: (active: boolean) => void;
  onStrikeChange?: (active: boolean) => void;
  onAlignChange?: (align: string) => void;
  onCaseChange?: (caseType: 'normal' | 'uppercase') => void;
  onListChange?: (listType: 'none' | 'bullet' | 'ordered') => void;
}

const Toolbox = ({ activeTool, onBookSizeChange, onFontFamilyChange, onFontSizeChange, onTextColorChange, onBoldChange, onItalicChange, onUnderlineChange, onStrikeChange, onAlignChange, onCaseChange, onListChange }: ToolboxProps) => {
  const renderContent = () => {
    switch (activeTool) {
      case "Book Size":
        return <BookSizePanel onChange={onBookSizeChange} />;
      case "Text":
        return <TextPanel onFontChange={onFontFamilyChange} onFontSizeChange={onFontSizeChange} onTextColorChange={onTextColorChange} onBoldChange={onBoldChange} onItalicChange={onItalicChange} onUnderlineChange={onUnderlineChange} onStrikeChange={onStrikeChange} onAlignChange={onAlignChange} onCaseChange={onCaseChange} onListChange={onListChange} />;
      case "Color":
        return <ColorPanel onColorChange={onTextColorChange} />;
      case "Brush":
        return <BrushPanel />;
      case "Tool":
        return <GeneralToolPanel />;
      case "Shapes":
        return <ShapesPanel />;
      default:
        return (
          <div className="text-gray-400 text-sm pl-4">
            Select a tool to see options
          </div>
        );
    }
  };

  return (
    <div className="w-full h-[107px] opacity-100 rounded-lg bg-secondary flex justify-start items-center gap-1.5 py-2 px-[11px]">
      {renderContent()}
    </div>
  );
};

export default Toolbox;
