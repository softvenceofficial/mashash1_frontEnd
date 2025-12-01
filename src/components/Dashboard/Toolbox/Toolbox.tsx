/* eslint-disable @typescript-eslint/no-unused-vars */
import  { useState } from "react";
import {
  RotateCcw,
  RotateCw,
  RefreshCcw,
  Minus,
  Plus,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  List,
  ListOrdered,
  Type,
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
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// --- Mock Data ---
const BASIC_COLORS = [
  "#3B82F6", "#67E8F9", "#86EFAC", "#FDBA74", "#EF4444", "#DB2777", "#9333EA"
];

const CUSTOM_COLORS = [
  "#3B82F6", "#67E8F9", "#86EFAC", "#C2410C", "#EF4444", "#BE185D", "#7E22CE"
];

const BOOK_SIZES = [
  { id: 1, label: "5 x 7", type: "Book" },
  { id: 2, label: "6 x 4", type: "Book" },
  { id: 3, label: "6 x 8", type: "Book Mockup" },
  { id: 4, label: "6 x 9", type: "Book Mockup" },
  { id: 5, label: "1 x 10", type: "Book Mockup" },
  { id: 6, label: "8.5 x 11", type: "Book Mockup" },
  { id: 7, label: "8 x 10", type: "Book Mockup" },
  { id: 8, label: "12 x 9", type: "Book Mockup" },
  { id: 9, label: "Square", type: "Book Mockup" },
];

// --- Shared Components ---

const UndoRedoGroup = () => (
  <div className="flex items-center gap-4 ml-auto border-l border-gray-600 pl-4 h-10">
    <Button variant="ghost" className="flex flex-col items-center h-auto p-1 hover:bg-white/10">
      <RotateCcw className="w-5 h-5 text-gray-400 group-hover:text-white" />
      <span className="text-[10px] text-gray-400 mt-1">Undo</span>
    </Button>
    <Button variant="ghost" className="flex flex-col items-center h-auto p-1 hover:bg-white/10">
      <RotateCw className="w-5 h-5 text-gray-400 group-hover:text-white" />
      <span className="text-[10px] text-gray-400 mt-1">Redo</span>
    </Button>
  </div>
);

const RefreshButton = ({ onClick }: { onClick?: () => void }) => (
  <div className="flex flex-col items-center mr-4 cursor-pointer" onClick={onClick}>
    <RefreshCcw className="w-5 h-5 text-white" />
    <span className="text-[10px] text-gray-400">Refresh</span>
  </div>
);

// --- Sub-Components (Tool Panels) ---

const BookSizePanel = ({ onChange }: { onChange?: (size: string) => void }) => {
  const [selectedBook, setSelectedBook] = useState(2);

  const handleBookSelect = (bookId: number, label: string) => {
    setSelectedBook(bookId);
    onChange?.(label);
  };

  return (
    <div className="flex items-center w-full overflow-x-auto gap-4 px-2 no-scrollbar">
      {BOOK_SIZES.map((book) => (
        <div
          key={book.id}
          onClick={() => handleBookSelect(book.id, book.label)}
          className={cn(
            "shrink-0 cursor-pointer transition-all duration-200 relative group",
            selectedBook === book.id ? "scale-105" : "opacity-70 hover:opacity-100"
          )}
        >
          {selectedBook === book.id && (
            <div className="absolute -inset-2 rounded-lg border border-gray-500 bg-white/5 z-0" />
          )}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-16 bg-linear-to-br from-gray-200 to-gray-400 rounded-sm shadow-md flex items-center justify-center mb-2 overflow-hidden border-l-4 border-gray-500">
              <div className="w-full h-full bg-white/30 rotate-12 transform translate-y-4"></div>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-xs">{book.label}</p>
              <p className="text-gray-400 text-[9px] leading-tight">{book.type}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const TextPanel = () => {
  const [fontSize, setFontSize] = useState(24);

  return (
    <>
      <RefreshButton />
      <div className="flex items-center gap-3">
        <Select defaultValue="open-sans">
          <SelectTrigger className="w-[130px] h-9 bg-[#444] border-none text-white focus:ring-0 rounded-md">
            <SelectValue placeholder="Font" />
          </SelectTrigger>
          <SelectContent className="bg-[#333] text-white border-gray-600">
            <SelectItem value="open-sans">Open Sans</SelectItem>
            <SelectItem value="roboto">Roboto</SelectItem>
            <SelectItem value="inter">Inter</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center bg-[#444] rounded-md h-9 px-2">
          <button 
            className="text-white hover:text-primary px-1"
            onClick={() => setFontSize(Math.max(8, fontSize - 1))}
          >
            <Minus size={16} />
          </button>
          <span className="text-white w-8 text-center text-sm font-medium">{fontSize}</span>
          <button 
            className="text-white hover:text-primary px-1"
            onClick={() => setFontSize(Math.min(72, fontSize + 1))}
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="w-7 h-7 rounded-full bg-linear-to-r from-green-400 via-yellow-400 to-red-500 cursor-pointer border border-white/20"></div>

        <Separator orientation="vertical" className="h-8 bg-gray-600 mx-1" />

        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10 rounded"><Bold size={18} /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:bg-white/10 rounded"><Italic size={18} /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:bg-white/10 rounded"><Underline size={18} /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:bg-white/10 rounded"><Strikethrough size={18} /></Button>
        </div>

        <Separator orientation="vertical" className="h-8 bg-gray-600 mx-1" />

        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10 rounded"><AlignLeft size={18} /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:bg-white/10 rounded"><Type size={18} /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:bg-white/10 rounded"><span className="text-xs font-bold">TT</span></Button>
        </div>

        <Separator orientation="vertical" className="h-8 bg-gray-600 mx-1" />

        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:bg-white/10 rounded"><List size={18} /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:bg-white/10 rounded"><ListOrdered size={18} /></Button>
        </div>
      </div>
      <UndoRedoGroup />
    </>
  );
};

const ColorPanel = () => (
  <>
    <RefreshButton />
    <div className="w-10 h-10 rounded-full bg-[conic-gradient(at_center,red,yellow,lime,cyan,blue,magenta,red)] border-2 border-white/20 mr-6 shadow-md cursor-pointer hover:scale-105 transition-transform" />

    <div className="flex flex-col gap-1 mr-6">
      <span className="text-xs text-white font-medium">Basic colors</span>
      <div className="flex gap-1.5">
        {BASIC_COLORS.map((color, i) => (
          <div key={i} className="w-6 h-6 rounded-md cursor-pointer border border-white/10 hover:scale-110 transition-transform" style={{ backgroundColor: color }} />
        ))}
      </div>
    </div>

    <div className="flex flex-col gap-1 mr-6">
      <span className="text-xs text-white font-medium">Custom Colors</span>
      <div className="flex gap-1.5">
        {CUSTOM_COLORS.map((color, i) => (
          <div key={i} className="w-6 h-6 rounded-md cursor-pointer border border-white/10 hover:scale-110 transition-transform" style={{ backgroundColor: color }} />
        ))}
        <div className="w-6 h-6 rounded-md bg-[#444] flex items-center justify-center cursor-pointer hover:bg-[#555] text-white">
          <Plus size={14} />
        </div>
      </div>
    </div>

    <div className="flex flex-col justify-center w-32 gap-1 ml-2">
      <div className="relative w-full h-4 bg-gray-600 rounded-full overflow-hidden">
        <div className="absolute inset-0 bg-gray-300 opacity-30"></div>
        <Slider defaultValue={[70]} max={100} step={1} className="absolute inset-0 z-10" />
      </div>
    </div>
    <UndoRedoGroup />
  </>
);

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
              i === 2 ? "bg-white ring-2 ring-primary ring-offset-2 ring-offset-[#2B2B2B]" : ""
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
    <UndoRedoGroup />
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
                activeTool === t.id ? "bg-white/10" : "hover:bg-white/5"
             )}
             onClick={() => setActiveTool(t.id)}
           >
              <t.icon className={cn("w-5 h-5", activeTool === t.id ? "text-primary" : "text-gray-300")} />
              <span className={cn("text-[9px]", activeTool === t.id ? "text-white" : "text-gray-400")}>{t.label}</span>
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

      <UndoRedoGroup />
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
                   selectedShape === s.id ? "bg-primary text-white hover:bg-primary/90" : "text-gray-400 hover:text-white hover:bg-white/10"
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

      <UndoRedoGroup />
    </>
  );
};

// --- Main Component ---

interface ToolboxProps {
  activeTool: string;
  onBookSizeChange?: (size: string) => void;
  // Add other handlers as needed for functionalization
}

const Toolbox = ({ activeTool, onBookSizeChange }: ToolboxProps) => {
  const renderContent = () => {
    switch (activeTool) {
      case "Book Size":
        return <BookSizePanel onChange={onBookSizeChange} />;
      case "Text":
        return <TextPanel />;
      case "Color":
        return <ColorPanel />;
      case "Brush":
        return <BrushPanel />;
      case "Tool":
        return <GeneralToolPanel />;
      case "Shapes":
        return <ShapesPanel />;
      default:
        return <div className="text-gray-400 text-sm pl-4">Select a tool to see options</div>;
    }
  };

  return (
    <div className="w-full h-[107px] opacity-100 rounded-lg bg-secondary flex justify-start items-center gap-1.5 py-4 px-[11px] overflow-x-auto no-scrollbar">
      {renderContent()}
    </div>
  );
};

export default Toolbox;