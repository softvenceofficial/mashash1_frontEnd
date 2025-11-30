/* eslint-disable react-hooks/rules-of-hooks */
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
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock Data for Colors
const BASIC_COLORS = [
  "#3B82F6", "#67E8F9", "#86EFAC", "#FDBA74", "#EF4444", "#DB2777", "#9333EA"
];

const CUSTOM_COLORS = [
  "#3B82F6", "#67E8F9", "#86EFAC", "#C2410C", "#EF4444", "#BE185D", "#7E22CE"
];

// Mock Data for Books
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

interface ToolboxProps {
  activeTool: string;
  onBookSizeChange?: (size: string) => void;
}

const Toolbox = ({ activeTool, onBookSizeChange }: ToolboxProps) => {
  
  // Common Undo/Redo Component
  const UndoRedoGroup = () => (
    <div className="flex items-center gap-4 ml-auto border-l border-gray-600 pl-4 h-10">
      <div className="flex flex-col items-center cursor-pointer group">
        <RotateCcw className="w-5 h-5 text-gray-400 group-hover:text-white" />
        <span className="text-[10px] text-gray-400 mt-1">Undo</span>
      </div>
      <div className="flex flex-col items-center cursor-pointer group">
        <RotateCw className="w-5 h-5 text-gray-400 group-hover:text-white" />
        <span className="text-[10px] text-gray-400 mt-1">Redo</span>
      </div>
    </div>
  );

  // --- Sub-Components for specific tools ---

  const renderBookSizeTool = () => {
    const [selectedBook, setSelectedBook] = useState(2); // Default to 6x4

    const handleBookSelect = (bookId: number, label: string) => {
      setSelectedBook(bookId);
      onBookSizeChange?.(label);
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
            {/* Selection Glow */}
            {selectedBook === book.id && (
              <div className="absolute -inset-2 rounded-lg border border-gray-500 bg-white/5 z-0" />
            )}
            
            {/* Book Mockup Visual */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-16 bg-linear-to-br from-gray-200 to-gray-400 rounded-sm shadow-md flex items-center justify-center mb-2 overflow-hidden border-l-4 border-gray-500">
                 {/* Decorative pattern */}
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

  const renderTextTool = () => (
    <>
      <div className="flex flex-col items-center mr-4 cursor-pointer">
        <RefreshCcw className="w-5 h-5 text-white" />
        <span className="text-[10px] text-gray-400">Refresh</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Font Family */}
        <Select defaultValue="open-sans">
          <SelectTrigger className="w-[130px] h-9 bg-[#444] border-none text-white focus:ring-0 rounded-md">
            <SelectValue placeholder="Font" />
          </SelectTrigger>
          <SelectContent className="bg-[#333] text-white border-gray-600">
            <SelectItem value="open-sans">open sans</SelectItem>
            <SelectItem value="roboto">Roboto</SelectItem>
            <SelectItem value="inter">Inter</SelectItem>
          </SelectContent>
        </Select>

        {/* Font Size */}
        <div className="flex items-center bg-[#444] rounded-md h-9 px-2">
          <button className="text-white hover:text-primary"><Minus size={16} /></button>
          <span className="text-white w-8 text-center text-sm font-medium">24</span>
          <button className="text-white hover:text-primary"><Plus size={16} /></button>
        </div>

        {/* Color Gradient Circle */}
        <div className="w-7 h-7 rounded-full bg-linear-to-r from-green-400 via-yellow-400 to-red-500 cursor-pointer border border-white/20"></div>

        <Separator orientation="vertical" className="h-8 bg-gray-600 mx-1" />

        {/* Formatting Icons */}
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10 hover:text-white rounded"><Bold size={18} /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:bg-white/10 hover:text-white rounded"><Italic size={18} /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:bg-white/10 hover:text-white rounded"><Underline size={18} /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:bg-white/10 hover:text-white rounded"><Strikethrough size={18} /></Button>
        </div>

        <Separator orientation="vertical" className="h-8 bg-gray-600 mx-1" />

        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10 hover:text-white rounded"><AlignLeft size={18} /></Button>
          {/* Using Type icon as placeholder for Text Transform */}
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:bg-white/10 hover:text-white rounded"><Type size={18} /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:bg-white/10 hover:text-white rounded"><span className="text-xs font-bold">TT</span></Button>
        </div>

        <Separator orientation="vertical" className="h-8 bg-gray-600 mx-1" />

        <div className="flex gap-1">
           <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:bg-white/10 hover:text-white rounded"><List size={18} /></Button>
           <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:bg-white/10 hover:text-white rounded"><ListOrdered size={18} /></Button>
        </div>
      </div>
      <UndoRedoGroup />
    </>
  );

  const renderColorTool = () => (
    <>
      <div className="flex flex-col items-center mr-6 cursor-pointer">
        <RefreshCcw className="w-5 h-5 text-white" />
        <span className="text-[10px] text-gray-400">Refresh</span>
      </div>

      {/* Color Wheel Icon */}
      <div className="w-10 h-10 rounded-full bg-[conic-gradient(at_center,red,yellow,lime,cyan,blue,magenta,red)] border-2 border-white/20 mr-6 shadow-md cursor-pointer hover:scale-105 transition-transform" />

      {/* Basic Colors */}
      <div className="flex flex-col gap-1 mr-6">
        <span className="text-xs text-white font-medium">Basic colors</span>
        <div className="flex gap-1.5">
          {BASIC_COLORS.map((color, i) => (
            <div key={i} className="w-6 h-6 rounded-md cursor-pointer border border-white/10 hover:scale-110 transition-transform" style={{ backgroundColor: color }} />
          ))}
        </div>
      </div>

      {/* Custom Colors */}
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

      {/* Opacity Slider */}
      <div className="flex flex-col justify-center w-32 gap-1 ml-2">
         {/* Using a visual representation of transparency/opacity slider */}
         <div className="relative w-full h-4 bg-gray-600 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzjwqUAXYwYJAdmjC0DNBAAf8Q2009AAgQAAAABJRU5ErkJggg==')] opacity-30"></div>
            <Slider defaultValue={[70]} max={100} step={1} className="absolute inset-0 z-10" />
         </div>
      </div>

      <UndoRedoGroup />
    </>
  );

  const renderBrushTool = () => (
    <>
      <div className="flex flex-col items-center mr-6 cursor-pointer">
        <RefreshCcw className="w-5 h-5 text-white" />
        <span className="text-[10px] text-gray-400">Refresh</span>
      </div>

      <div className="flex items-center gap-6">
        {/* Brush Types */}
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

        {/* Size Dots */}
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

        {/* Selected Color Preview */}
        <div className="w-10 h-10 rounded-full bg-[#E0E7FF] border-2 border-primary cursor-pointer"></div>

        {/* Opacity Slider - Similar visual to image */}
        <div className="w-48 relative flex items-center">
             <div className="w-full h-3 bg-linear-to-r from-transparent to-white/20 rounded-full mr-2">
                <Slider defaultValue={[60]} max={100} step={1} />
             </div>
        </div>
      </div>

      <UndoRedoGroup />
    </>
  );

  // Default content for tools not fully implemented yet
  const renderDefault = () => (
    <div className="text-gray-400 text-sm">Select a tool options</div>
  );

  const getToolContent = () => {
    switch (activeTool) {
      case "Book Size": return renderBookSizeTool();
      case "Text": return renderTextTool();
      case "Color": return renderColorTool();
      case "Brush": return renderBrushTool();
      case "Tool": return renderDefault(); 
      case "Shapes": return renderDefault();
      default: return renderDefault();
    }
  };

  return (
    <div className="w-full h-[107px] opacity-100 rounded-lg bg-secondary flex justify-start items-center gap-1.5 py-4 px-[11px]">
      {getToolContent()}
    </div>
  );
};

export default Toolbox;