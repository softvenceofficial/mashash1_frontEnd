/* eslint-disable @typescript-eslint/no-explicit-any */
import  { useState, useRef, useCallback, forwardRef } from 'react';
import { Stage, Layer, Line, Text as KonvaText, Rect, Circle } from 'react-konva';
import Konva from 'konva';
import HTMLFlipBook from 'react-pageflip';
import { Plus, Minus, Maximize, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import bookBG from "@/assets/images/Books/mainBookbg.png"
// --- Types ---
interface BookProps {
  activeTool?: string;
  strokeColor?: string;
  strokeWidth?: number;
  selectedBookSize?: string;
}

interface LineType {
  tool: string;
  points: number[];
  color: string;
  width: number;
}

interface TextType {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fill: string;
}

interface ShapeType {
  id: string;
  type: 'rect' | 'circle';
  x: number;
  y: number;
  fill: string;
}

interface PageData {
  lines: LineType[];
  texts: TextType[];
  shapes: ShapeType[];
  background?: string;
}

// --- Constants ---
const BOOK_SIZE_MAP: Record<string, { width: number; height: number }> = {
  '5 x 7': { width: 350, height: 490 },
  '6 x 4': { width: 400, height: 550 },
  '6 x 8': { width: 420, height: 560 },
  '6 x 9': { width: 420, height: 630 },
  '1 x 10': { width: 280, height: 700 },
  '8.5 x 11': { width: 476, height: 616 },
  '8 x 10': { width: 560, height: 700 },
  '12 x 9': { width: 672, height: 504 },
  'Square': { width: 500, height: 500 }
};

const INITIAL_PAGES: PageData[] = Array(10).fill(null).map(() => ({
  lines: [],
  texts: [],
  shapes: []
}));

// Setup Cover
INITIAL_PAGES[0].texts.push({
  id: 'title',
  x: 50,
  y: 200,
  text: 'My Book',
  fontSize: 32,
  fill: '#fff'
});
INITIAL_PAGES[0].background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

// --- Page Component (Required for react-pageflip) ---
interface BookPageProps {
  pageIndex: number;
  data: PageData;
  activeTool: string;
  width: number;
  height: number;
  onMouseDown: (e: Konva.KonvaEventObject<MouseEvent>, index: number) => void;
  onMouseMove: (e: Konva.KonvaEventObject<MouseEvent>, index: number) => void;
  onMouseUp: () => void;
  onTextDblClick: (e: Konva.KonvaEventObject<MouseEvent>, index: number, item: TextType) => void;
}

const BookPage = forwardRef<HTMLDivElement, BookPageProps>(({ 
  pageIndex, data, activeTool, width, height, onMouseDown, onMouseMove, onMouseUp, onTextDblClick 
}, ref) => {
  return (
    <div ref={ref} className="bg-white h-full w-full overflow-hidden shadow-sm relative border-r border-gray-200">
      
      {/* Page Content Container */}
      <div 
        className="w-full h-full relative"
        style={{ background: data.background || 'white' }}
      >
        {/* If it's the cover, center the text manually or use Konva */}
        {pageIndex === 0 && (
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-white opacity-20 text-6xl font-bold tracking-widest">COVER</div>
           </div>
        )}

        <Stage
          width={width}
          height={height}
          onMouseDown={(e) => onMouseDown(e, pageIndex)}
          onMouseMove={(e) => onMouseMove(e, pageIndex)}
          onMouseUp={onMouseUp}
          // Only allow Konva to capture pointer if we are in an editing tool
          className={activeTool !== 'Book Size' ? 'cursor-crosshair' : 'cursor-default'}
        >
          <Layer>
            {data.shapes.map((shape, i) => (
              shape.type === 'rect' ? 
              <Rect key={i} x={shape.x} y={shape.y} width={50} height={50} fill={shape.fill} draggable={activeTool === 'Tool'} /> :
              <Circle key={i} x={shape.x} y={shape.y} radius={30} fill={shape.fill} draggable={activeTool === 'Tool'} />
            ))}

            {data.lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.color}
                strokeWidth={line.width}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={line.tool === 'Eraser' ? 'destination-out' : 'source-over'}
              />
            ))}

            {data.texts.map((textItem) => (
              <KonvaText
                key={textItem.id}
                x={textItem.x}
                y={textItem.y}
                text={textItem.text}
                fontSize={textItem.fontSize}
                fill={textItem.fill}
                draggable={activeTool === 'Tool'}
                onDblClick={(e) => onTextDblClick(e, pageIndex, textItem)}
              />
            ))}
          </Layer>
        </Stage>

        {/* Page Number */}
        <span className="absolute bottom-4 right-4 text-gray-400 text-sm font-medium select-none">
          {pageIndex + 1}
        </span>
      </div>
    </div>
  );
});

BookPage.displayName = 'BookPage';

// --- Main Book Component ---

const Book = ({ activeTool = 'Tool', strokeColor = '#000000', strokeWidth = 5, selectedBookSize = '6 x 4' }: BookProps) => {
  const [pages, setPages] = useState<PageData[]>(INITIAL_PAGES);
  const [zoom, setZoom] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [pagesToAdd, setPagesToAdd] = useState('2');
  
  const bookDimensions = BOOK_SIZE_MAP[selectedBookSize] || BOOK_SIZE_MAP['6 x 4'];
  const WIDTH = bookDimensions.width;
  const HEIGHT = bookDimensions.height;
  
  // Text Editing State
  const [textEditVisible, setTextEditVisible] = useState(false);
  const [textEditValue, setTextEditValue] = useState('');
  const [textEditPos, setTextEditPos] = useState({ x: 0, y: 0 });
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  
  const bookRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isDrawing = useRef(false);

  // Disable all mouse-based page flipping - only arrow buttons allowed
  const isDrawingMode = ['Brush', 'Eraser'].includes(activeTool);

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>, pageIndex: number) => {
    if (isDrawingMode) {
      isDrawing.current = true;
      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) return;

      const newLines = [...pages[pageIndex].lines, {
        tool: activeTool,
        points: [pos.x, pos.y],
        color: activeTool === 'Eraser' ? '#ffffff' : strokeColor,
        width: activeTool === 'Eraser' ? 20 : strokeWidth,
      }];

      updatePageData(pageIndex, 'lines', newLines);
    } 
    if (activeTool === 'Text') {
      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) return;
      
      const newText: TextType = {
        id: Date.now().toString(),
        x: pos.x,
        y: pos.y,
        text: 'Double click to edit',
        fontSize: 16,
        fill: strokeColor
      };
      
      updatePageData(pageIndex, 'texts', [...pages[pageIndex].texts, newText]);
    }
    else if (activeTool === 'Shapes') {
      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) return;
      
      const newShape: ShapeType = {
        id: Date.now().toString(),
        type: Math.random() > 0.5 ? 'rect' : 'circle',
        x: pos.x,
        y: pos.y,
        fill: strokeColor
      };
      updatePageData(pageIndex, 'shapes', [...pages[pageIndex].shapes, newShape]);
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>, pageIndex: number) => {
    if (!isDrawing.current || !isDrawingMode) return;

    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();
    if (!point) return;

    const currentLines = [...pages[pageIndex].lines];
    const lastLine = currentLines[currentLines.length - 1];
    
    // Check if line exists before adding points (safety check)
    if (lastLine) {
        lastLine.points = lastLine.points.concat([point.x, point.y]);
        currentLines.splice(currentLines.length - 1, 1, lastLine);
        updatePageData(pageIndex, 'lines', currentLines);
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const updatePageData = (pageIndex: number, key: keyof PageData, data: any) => {
    setPages(prev => {
      const newPages = [...prev];
      newPages[pageIndex] = { ...newPages[pageIndex], [key]: data };
      return newPages;
    });
  };

  // --- Text Editing ---
  const handleTextDblClick = (e: Konva.KonvaEventObject<MouseEvent>, _pageIndex: number, textItem: TextType) => {
    const textNode = e.target as Konva.Text;
    const stageBox = textNode.getStage()?.container().getBoundingClientRect();
    
    if(stageBox) {
      const absPos = textNode.getAbsolutePosition();
      setEditingTextId(textItem.id);
      setTextEditValue(textItem.text);
      // Determine position relative to the viewport
      setTextEditPos({
        x: stageBox.left + absPos.x,
        y: stageBox.top + absPos.y
      });
      setTextEditVisible(true);
    }
  };

  const handleTextEditComplete = () => {
    if (editingTextId) {
      const newPages = pages.map((page) => {
        const textIndex = page.texts.findIndex(t => t.id === editingTextId);
        if (textIndex !== -1) {
          const newTexts = [...page.texts];
          newTexts[textIndex].text = textEditValue;
          return { ...page, texts: newTexts };
        }
        return page;
      });
      setPages(newPages);
    }
    setTextEditVisible(false);
    setEditingTextId(null);
  };

  const handleAddPages = () => {
    const num = parseInt(pagesToAdd);
    if(num > 0) {
        const newPages = Array(num).fill(null).map(() => ({
            lines: [],
            texts: [],
            shapes: []
        }));
        setPages(prev => [...prev, ...newPages]);
        setShowAddModal(false);
    }
  };

  // --- Flip Controls ---
  const flipNext = useCallback(() => {
    if (bookRef.current) {
        bookRef.current.pageFlip().flipNext();
    }
  }, []);

  const flipPrev = useCallback(() => {
    if (bookRef.current) {
        bookRef.current.pageFlip().flipPrev();
    }
  }, []);
  return (
    <div style={{ backgroundImage: `url(${bookBG})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}} className="relative flex flex-col items-center justify-center h-[calc(100vh-140px)] w-full bg-transparent overflow-hidden">
      
      {/* Zoom / View Controls */}
      <div className="absolute right-4 bottom-4 flex flex-col gap-2 z-50">
        <div className="bg-[#2B2B2B] rounded-lg p-1 flex flex-col gap-1">
          <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/20" onClick={() => setZoom(z => Math.min(z + 0.1, 2))}><Plus size={16} /></Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/20" onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))}><Minus size={16} /></Button>
        </div>
        <Button size="icon" variant="secondary" className="h-10 w-10 rounded-lg bg-[#2B2B2B] text-primary hover:bg-[#333] border-none"><Maximize size={18} /></Button>
        <div className="bg-primary text-white text-xs px-2 py-1 rounded text-center">{pages.length} Pages</div>
        <Button 
            size="sm" 
            variant="outline" 
            className="text-xs h-7 bg-white/10 text-white hover:bg-white/20 border-none"
            onClick={() => setShowAddModal(true)}
        >
            + Add Page
        </Button>
      </div>

      {/* Navigation Buttons */}
      <button 
        onClick={flipPrev} 
        className="absolute left-4 z-50 p-3 bg-primary rounded-lg text-white shadow-lg hover:bg-primary/90 transition-all hover:scale-110 active:scale-95"
      >
        <ChevronLeft size={24} />
      </button>

      <button 
        onClick={flipNext} 
        className="absolute right-4 z-50 p-3 bg-primary rounded-lg text-white shadow-lg hover:bg-primary/90 transition-all hover:scale-110 active:scale-95"
      >
        <ChevronRight size={24} />
      </button>

      {/* Main FlipBook Component 
          - useMouseEvents: Disabled when drawing to prevent accidental page turns
          - showCover: Makes the first page single
      */}
      <div style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s' }}>
        <HTMLFlipBook
            key={`${WIDTH}-${HEIGHT}`}
            width={WIDTH}
            height={HEIGHT}
            size="fixed"
            minWidth={315}
            maxWidth={1000}
            minHeight={400}
            maxHeight={1533}
            maxShadowOpacity={0.5}
            showCover={true}
            mobileScrollSupport={true}
            className="shadow-2xl"
            ref={bookRef}
            useMouseEvents={false}
            startPage={0} 
            drawShadow={true} 
            flippingTime={1000} 
            usePortrait={false} 
            startZIndex={0} 
            autoSize={true} 
            clickEventForward={true} 
            swipeDistance={30} 
            showPageCorners={true} 
            disableFlipByClick={true} 
            style={{}}        >
            {pages.map((pageData, index) => (
                <BookPage 
                    key={index}
                    pageIndex={index}
                    data={pageData}
                    activeTool={activeTool}
                    width={WIDTH}
                    height={HEIGHT}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onTextDblClick={handleTextDblClick}
                />
            ))}
        </HTMLFlipBook>
      </div>

      {/* Add Pages Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-100 backdrop-blur-sm">
          <div className="bg-card rounded-xl p-6 w-80 shadow-2xl border border-white/10 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-foreground">Add Pages</h2>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-muted-foreground mb-2">How many pages?</label>
              <input
                type="number"
                min="1"
                max="10"
                value={pagesToAdd}
                onChange={(e) => setPagesToAdd(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-border rounded-md text-foreground hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPages}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Text Editor */}
      {textEditVisible && (
        <textarea
          ref={textareaRef}
          value={textEditValue}
          onChange={(e) => setTextEditValue(e.target.value)}
          onBlur={handleTextEditComplete}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleTextEditComplete() }}
          style={{
            position: 'fixed',
            top: textEditPos.y,
            left: textEditPos.x,
            zIndex: 1000,
            background: 'rgba(255,255,255,0.9)',
            border: '2px solid #3B82F6',
            borderRadius: '4px',
            outline: 'none',
            resize: 'none',
            fontSize: '16px',
            fontFamily: 'Arial',
            color: strokeColor,
            minWidth: '150px',
            minHeight: '3em',
            padding: '4px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
          autoFocus
        />
      )}
    </div>
  );
};

export default Book;