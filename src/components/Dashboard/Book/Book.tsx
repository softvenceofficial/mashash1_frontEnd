/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useCallback, forwardRef, useEffect, useImperativeHandle } from 'react';
import { Stage, Layer, Line, Text as KonvaText, Rect, Circle, Transformer } from 'react-konva';
import Konva from 'konva';
import HTMLFlipBook from 'react-pageflip';
import { Plus, Minus, Maximize, X, ChevronLeft, ChevronRight, Undo, Redo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import bookBG from "@/assets/images/Books/mainBookbg.png"
import type { TextType, ShapeType, PageData } from './types';
import { FloatingTextToolbar } from './FloatingTextToolbar';
import { TextContextMenu } from './TextContextMenu';
import { InPlaceTextEditor } from './InPlaceTextEditor';
import { useTextHistory } from './useTextHistory';

// --- Types ---
interface BookProps {
  activeTool?: string;
  strokeColor?: string;
  strokeWidth?: number;
  selectedBookSize?: string;
  fontSize?: number;
  fontFamily?: string;
  onAdvancedTextChange?: (property: string, value: any) => void;
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
  fontFamily: 'Roboto',
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
  selectedTextId: string | null;
  onTextSelect: (id: string | null) => void;
}

const BookPage = forwardRef<HTMLDivElement, BookPageProps>(({ 
  pageIndex, data, activeTool, width, height, onMouseDown, onMouseMove, onMouseUp, onTextDblClick, selectedTextId, onTextSelect 
}, ref) => {
  const transformerRef = useRef<Konva.Transformer>(null);
  const textRefs = useRef<{ [key: string]: Konva.Text }>({});

  useEffect(() => {
    if (selectedTextId && transformerRef.current) {
      const node = textRefs.current[selectedTextId];
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedTextId]);
  
  const getKonvaFontStyle = (style?: string) => {
    if (!style || style === 'normal') return 'normal';
    if (style === 'bold italic') return 'bold italic';
    return style;
  };
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
                ref={(node) => {
                  if (node) textRefs.current[textItem.id] = node;
                }}
                x={textItem.x}
                y={textItem.y}
                text={textItem.text}
                fontSize={textItem.fontSize}
                fontFamily={textItem.fontFamily || 'Roboto'}
                fontStyle={getKonvaFontStyle(textItem.fontStyle)}
                textDecoration={textItem.textDecoration}
                align={textItem.textAlign}
                fill={textItem.fill}
                width={textItem.width}
                wrap="word"
                lineHeight={textItem.lineHeight || 1.2}
                letterSpacing={textItem.letterSpacing || 0}
                rotation={textItem.rotation || 0}
                opacity={textItem.opacity || 1}
                shadowColor={textItem.shadowColor}
                shadowBlur={textItem.shadowBlur || 0}
                shadowOffsetX={textItem.shadowOffsetX || 0}
                shadowOffsetY={textItem.shadowOffsetY || 0}
                shadowOpacity={textItem.shadowOpacity || 1}
                stroke={textItem.stroke}
                strokeWidth={textItem.strokeWidth || 0}
                draggable={activeTool === 'Tool'}
                onClick={() => onTextSelect(textItem.id)}
                onDblClick={(e) => onTextDblClick(e, pageIndex, textItem)}
                onTransform={(e) => {
                  const node = e.target as Konva.Text;
                  const scaleX = node.scaleX();
                  node.scaleX(1);
                  node.scaleY(1);
                  node.width(Math.max(30, node.width() * scaleX));
                }}
              />
            ))}
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 20 || newBox.height < 20) return oldBox;
                return newBox;
              }}
              enabledAnchors={['top-left', 'top-center', 'top-right', 'middle-right', 'middle-left', 'bottom-left', 'bottom-center', 'bottom-right']}
            />
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

const BookComponent = ({ activeTool = 'Tool', strokeColor = '#000000', strokeWidth = 5, selectedBookSize = '6 x 4', fontSize = 16, fontFamily = 'Roboto', onAdvancedTextChange }: BookProps, ref: any) => {
  const [pages, setPages] = useState<PageData[]>(INITIAL_PAGES);
  const [zoom, setZoom] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [pagesToAdd, setPagesToAdd] = useState('2');
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  
  const bookDimensions = BOOK_SIZE_MAP[selectedBookSize] || BOOK_SIZE_MAP['6 x 4'];
  const WIDTH = bookDimensions.width;
  const HEIGHT = bookDimensions.height;
  
  // Text Editing State
  const [editingTextItem, setEditingTextItem] = useState<TextType | null>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPos, setToolbarPos] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [clipboard, setClipboard] = useState<TextType | null>(null);
  
  const bookRef = useRef<any>(null);
  const isDrawing = useRef(false);
  const { saveState, undo, redo, canUndo, canRedo } = useTextHistory();

  useImperativeHandle(ref, () => ({
    undo,
    redo,
    canUndo,
    canRedo,
    updatePageData,
    currentPageIndex
  }));

  const updatePageData = useCallback((pageIndex: number, key: keyof PageData, data: any) => {
    setPages(prev => {
      const newPages = [...prev];
      newPages[pageIndex] = { ...newPages[pageIndex], [key]: data };
      return newPages;
    });
  }, []);

  // Update page background when color tool is active
  useEffect(() => {
    if (strokeColor) {
      // This ensures color changes from the toolbox apply to the page background.
      // Apply to the current page (which is the left page in a spread).
      updatePageData(currentPageIndex, 'background', strokeColor);

      // If we are in a spread view (currentPageIndex will be odd), and the right page exists,
      // apply the color to the right page as well.
      if (currentPageIndex % 2 !== 0 && (currentPageIndex + 1) < pages.length) {
        updatePageData(currentPageIndex + 1, 'background', strokeColor);
      }
    }
  }, [strokeColor, currentPageIndex, updatePageData, pages.length]);


  // Handle advanced text changes from Toolbox
  useEffect(() => {
    if (onAdvancedTextChange && selectedTextId) {
      const handleAdvancedChange = (property: string, value: any) => {
        const textItem = pages[currentPageIndex]?.texts.find(t => t.id === selectedTextId);
        if (!textItem) return;

        let updatedText = { ...textItem };

        if (property === 'textTransform') {
          let newText = textItem.text;
          if (value === 'uppercase') newText = newText.toUpperCase();
          else if (value === 'lowercase') newText = newText.toLowerCase();
          else if (value === 'capitalize') newText = newText.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
          updatedText = { ...updatedText, text: newText, textTransform: value };
        } else if (property === 'listType') {
          const lines = textItem.text.split('\n');
          const newLines = lines.map((line, index) => {
            let cleanLine = line.replace(/^[•\-\*]\s+/, '').replace(/^\d+\.\s+/, '');
            if (value === 'bullet') return `• ${cleanLine}`;
            if (value === 'number') return `${index + 1}. ${cleanLine}`;
            return cleanLine;
          });
          updatedText = { ...updatedText, text: newLines.join('\n'), listType: value };
        } else {
          updatedText[property as keyof TextType] = value;
        }

        handleTextUpdate(updatedText);
      };

      // Store the handler so Toolbox can call it
      (window as any).__handleAdvancedTextChange = handleAdvancedChange;
    }
  }, [selectedTextId, currentPageIndex, pages, onAdvancedTextChange]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedTextId) return;

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault();
            handleFormat('bold');
            break;
          case 'i':
            e.preventDefault();
            handleFormat('italic');
            break;
          case 'u':
            e.preventDefault();
            handleFormat('underline');
            break;
          case 'c':
            e.preventDefault();
            handleCopy();
            break;
          case 'x':
            e.preventDefault();
            handleCut();
            break;
          case 'v':
            e.preventDefault();
            handlePaste();
            break;
          case 'z': {
            e.preventDefault();
            const undoTexts = undo();
            if (undoTexts) updatePageData(currentPageIndex, 'texts', undoTexts);
            break;
          }
          case 'y': {
            e.preventDefault();
            const redoTexts = redo();
            if (redoTexts) updatePageData(currentPageIndex, 'texts', redoTexts);
            break;
          }
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        handleDeleteText();
      } else if (e.key === 'Escape') {
        setSelectedTextId(null);
        setShowToolbar(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTextId, currentPageIndex]);

  // Disable all mouse-based page flipping - only arrow buttons allowed
  const isDrawingMode = ['Brush', 'Eraser'].includes(activeTool);

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>, pageIndex: number) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedTextId(null);
      setShowToolbar(false);
      setContextMenu(null);
    }
    
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
        fontSize: fontSize,
        fontFamily: fontFamily,
        fill: strokeColor,
        fontStyle: 'normal',
        textDecoration: 'none',
        textAlign: 'left',
        width: 200,
        opacity: 1
      };
      
      const newTexts = [...pages[pageIndex].texts, newText];
      updatePageData(pageIndex, 'texts', newTexts);
      saveState(newTexts);
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

  // --- Text Editing ---
  const handleTextDblClick = (_e: Konva.KonvaEventObject<MouseEvent>, pageIndex: number, textItem: TextType) => {
    setCurrentPageIndex(pageIndex);
    setEditingTextItem(textItem);
    setShowToolbar(false);
  };

  const handleTextUpdate = (updatedText: TextType) => {
    const newPages = pages.map((page, idx) => {
      if (idx === currentPageIndex) {
        const textIndex = page.texts.findIndex(t => t.id === updatedText.id);
        if (textIndex !== -1) {
          const newTexts = [...page.texts];
          newTexts[textIndex] = updatedText;
          saveState(newTexts);
          return { ...page, texts: newTexts };
        }
      }
      return page;
    });
    setPages(newPages);
  };

  const handleTextSelect = (id: string | null) => {
    setSelectedTextId(id);
    if (id) {
      const textItem = pages[currentPageIndex]?.texts.find(t => t.id === id);
      if (textItem) {
        setToolbarPos({ x: textItem.x, y: textItem.y });
        setShowToolbar(true);
      }
    } else {
      setShowToolbar(false);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (selectedTextId) {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY });
    }
  };

  const handleCopy = () => {
    const textItem = pages[currentPageIndex]?.texts.find(t => t.id === selectedTextId);
    if (textItem) setClipboard(textItem);
    setContextMenu(null);
  };

  const handleCut = () => {
    handleCopy();
    handleDeleteText();
  };

  const handlePaste = () => {
    if (clipboard) {
      const newText = { ...clipboard, id: Date.now().toString(), x: clipboard.x + 20, y: clipboard.y + 20 };
      const newTexts = [...pages[currentPageIndex].texts, newText];
      updatePageData(currentPageIndex, 'texts', newTexts);
      saveState(newTexts);
    }
    setContextMenu(null);
  };

  const handleDeleteText = () => {
    if (selectedTextId) {
      const newTexts = pages[currentPageIndex].texts.filter(t => t.id !== selectedTextId);
      updatePageData(currentPageIndex, 'texts', newTexts);
      saveState(newTexts);
      setSelectedTextId(null);
      setShowToolbar(false);
    }
    setContextMenu(null);
  };

  const handleFormat = (format: 'bold' | 'italic' | 'underline') => {
    if (selectedTextId) {
      const textItem = pages[currentPageIndex]?.texts.find(t => t.id === selectedTextId);
      if (textItem) {
        let updatedText = { ...textItem };
        if (format === 'bold') {
          const current = textItem.fontStyle || 'normal';
          updatedText.fontStyle = current.includes('bold') 
            ? (current.replace('bold', '').trim() || 'normal') as TextType['fontStyle']
            : (current === 'italic' ? 'bold italic' : 'bold');
        } else if (format === 'italic') {
          const current = textItem.fontStyle || 'normal';
          updatedText.fontStyle = current.includes('italic')
            ? (current.replace('italic', '').trim() || 'normal') as TextType['fontStyle']
            : (current === 'bold' ? 'bold italic' : 'italic');
        } else if (format === 'underline') {
          updatedText.textDecoration = textItem.textDecoration === 'underline' ? 'none' : 'underline';
        }
        handleTextUpdate(updatedText);
      }
    }
    setContextMenu(null);
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

  const onFlip = useCallback((e: { data: number }) => {
    setCurrentPageIndex(e.data);
  }, []);
  return (
    <div style={{ backgroundImage: `url(${bookBG})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}} className="relative flex flex-col items-center justify-center h-[calc(100vh-140px)] w-full bg-transparent overflow-hidden">
      
      {/* Undo/Redo Controls */}
      

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
            onFlip={onFlip}
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
                    selectedTextId={selectedTextId}
                    onTextSelect={handleTextSelect}
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

      {/* In-Place Text Editor */}
      {editingTextItem && (
        <InPlaceTextEditor
          textItem={editingTextItem}
          onUpdate={handleTextUpdate}
          onBlur={() => setEditingTextItem(null)}
        />
      )}

      {/* Floating Text Toolbar */}
      {showToolbar && selectedTextId && !editingTextItem && (() => {
        const textItem = pages[currentPageIndex]?.texts.find(t => t.id === selectedTextId);
        return textItem ? (
          <FloatingTextToolbar
            textItem={textItem}
            onUpdate={handleTextUpdate}
            position={toolbarPos}
          />
        ) : null;
      })()}

      {/* Context Menu */}
      {contextMenu && (
        <TextContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onCopy={handleCopy}
          onCut={handleCut}
          onPaste={handlePaste}
          onDelete={handleDeleteText}
          onFormat={handleFormat}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Right-click handler */}
      <div 
        onContextMenu={handleContextMenu}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />
    </div>
  );
};

const Book = forwardRef(BookComponent);
Book.displayName = 'Book';

export default Book;
