/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useCallback, forwardRef, useEffect, useImperativeHandle, memo } from 'react';
import { Stage, Layer, Line, Text as KonvaText, Rect, Circle, Transformer, Image as KonvaImage, Group } from 'react-konva';
import Konva from 'konva';
import HTMLFlipBook from 'react-pageflip';
import { Plus, Minus, Maximize, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import bookBG from "@/assets/images/Books/mainBookbg.png"
import type { TextType, ShapeType, PageData as BasePageData, StickyNoteType } from './types';
import { FloatingTextToolbar } from './FloatingTextToolbar';
import { TextContextMenu } from './TextContextMenu';
import { InPlaceTextEditor } from './InPlaceTextEditor';
import { useTextHistory } from './useTextHistory';
import StickyNote from './StickyNote';
import InlineStickyNoteEditor from './InlineStickyNoteEditor';
import TableCellEditor from './TableCellEditor';
import TableContextMenu from './TableContextMenu';

// --- Types ---
export interface ImageType {
  id: string;
  type: 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  src: string;
}

export interface TableCell {
  id: string;
  content: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  alignment: 'left' | 'center' | 'right';
  verticalAlign: 'top' | 'middle' | 'bottom';
  backgroundColor: string;
  rowSpan?: number;
  colSpan?: number;
}

export interface TableType {
  id: string;
  type: 'table';
  x: number;
  y: number;
  rows: number;
  cols: number;
  cellWidth: number;
  cellHeight: number;
  borderWidth: number;
  borderColor: string;
  fillColor: string;
  data: TableCell[][];
  selectedCell: { row: number; col: number } | null;
}

export interface PageData extends BasePageData {
  images: ImageType[];
  stickyNotes: StickyNoteType[];
  tables: TableType[];
}

interface BookProps {
  activeTool?: string;
  activeSubTool?: string;
  strokeColor?: string;
  strokeWidth?: number;
  selectedBookSize?: string;
  fontSize?: number;
  fontFamily?: string;
  onAdvancedTextChange?: (property: string, value: any) => void;
  drawingMode?: string;
  zoom?: number;
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
  shapes: [],
  images: [],
  stickyNotes: [],
  tables: []
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

// --- Custom Hook for Images ---
const useImage = (url: string) => {
  const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);
  useEffect(() => {
    if (!url) return;
    const img = new window.Image();
    img.src = url;
    img.onload = () => setImage(img);
  }, [url]);
  return [image];
};

// --- Helper Components ---
const TableCellComponent = memo(({ 
  table, 
  cell, 
  rowIndex, 
  colIndex, 
  xPos, 
  yPos, 
  cellWidth, 
  cellHeight,
  onCellClick,
  onCellDoubleClick,
  onCellContextMenu
}: any) => {
  if (!cell.content && cell.content !== '') return null;

  return (
    <Group key={`${rowIndex}-${colIndex}`}>
      <Rect
        x={xPos}
        y={yPos}
        width={cellWidth}
        height={cellHeight}
        fill={cell.backgroundColor || table.fillColor}
        stroke={table.borderColor}
        strokeWidth={table.borderWidth}
        onClick={(e) => {
          e.cancelBubble = true;
          onCellClick(table.id, rowIndex, colIndex);
        }}
        onDblClick={(e) => {
          e.cancelBubble = true;
          onCellDoubleClick(table.id, rowIndex, colIndex, xPos, yPos, cellWidth, cellHeight);
        }}
        onContextMenu={(e) => {
          e.evt.preventDefault();
          e.evt.stopPropagation();
          e.cancelBubble = true;
          onCellContextMenu(e.evt, table.id, rowIndex, colIndex);
        }}
      />
      {table.selectedCell && 
        table.selectedCell.row === rowIndex && 
        table.selectedCell.col === colIndex && (
        <Rect
          x={xPos}
          y={yPos}
          width={cellWidth}
          height={cellHeight}
          stroke="#3b82f6"
          strokeWidth={2}
          dash={[4, 4]}
          fill="transparent"
          listening={false}
        />
      )}
      <KonvaText
        x={xPos + 5}
        y={yPos + 5}
        text={cell.content}
        fontSize={cell.fontSize}
        fontFamily={cell.fontFamily}
        fill={cell.fill}
        fontStyle={`${cell.bold ? 'bold' : ''} ${cell.italic ? 'italic' : ''}`}
        textDecoration={cell.underline ? 'underline' : ''}
        width={cellWidth - 10}
        height={cellHeight - 10}
        align={cell.alignment}
        verticalAlign={cell.verticalAlign}
        wrap="word"
        listening={false}
      />
    </Group>
  );
});

TableCellComponent.displayName = 'TableCellComponent';

const URLImage = ({ image, isSelected, onSelect, isSelectMode }: any) => {
  const [img] = useImage(image.src);
  const imageRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && trRef.current && imageRef.current && isSelectMode) {
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <KonvaImage
        ref={imageRef}
        image={img}
        x={image.x}
        y={image.y}
        width={image.width}
        height={image.height}
        rotation={image.rotation}
        draggable={isSelectMode}
        onClick={onSelect}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
};

// --- Page Component (Required for react-pageflip) ---
interface BookPageProps {
  pageIndex: number;
  data: PageData;
  activeTool: string;
  isSelectMode: boolean;
  isPenMode: boolean;
  width: number;
  height: number;
  onMouseDown: (e: Konva.KonvaEventObject<MouseEvent>, index: number) => void;
  onMouseMove: (e: Konva.KonvaEventObject<MouseEvent>, index: number) => void;
  onMouseUp: () => void;
  onStageDoubleClick: (e: Konva.KonvaEventObject<MouseEvent>, index: number) => void;
  onTextDblClick: (e: Konva.KonvaEventObject<MouseEvent>, index: number, item: TextType) => void;
  selectedTextId: string | null;
  onTextSelect: (id: string | null) => void;
  penState: { points: number[]; isDrawing: boolean; mode: 'polygon' | 'freehand' };
  snapToStart: boolean;
  mousePos: { x: number; y: number } | null;
  strokeColor: string;
  strokeWidth: number;
  penFillColor: string;
  penFillOpacity: number;
  penMode: 'polygon' | 'freehand';
  handleStickyNoteDoubleClick: (pageIndex: number, note: StickyNoteType) => void;
  handleStickyNoteUpdate: (pageIndex: number, updatedNote: StickyNoteType) => void;
  handleStickyNoteDelete: (pageIndex: number, noteId: string) => void;
  handleTableCellClick: (tableId: string, row: number, col: number) => void;
  handleTableCellDoubleClick: (tableId: string, row: number, col: number, x: number, y: number, width: number, height: number) => void;
  handleTableContextMenu: (evt: MouseEvent, tableId: string, row: number, col: number) => void;
}

const BookPage = forwardRef<HTMLDivElement, BookPageProps>(({ 
  pageIndex, data, activeTool, width, height, onMouseDown, onMouseMove, onMouseUp, onStageDoubleClick, onTextDblClick, selectedTextId, onTextSelect, penState, snapToStart, mousePos, strokeColor, strokeWidth, penFillColor, penFillOpacity, penMode, handleStickyNoteDoubleClick, handleStickyNoteUpdate, handleStickyNoteDelete, isSelectMode, isPenMode, handleTableCellClick, handleTableCellDoubleClick, handleTableContextMenu
}, ref) => {
  const transformerRef = useRef<Konva.Transformer>(null);
  const textRefs = useRef<{ [key: string]: Konva.Text }>({});

  useEffect(() => {
    if (selectedTextId && transformerRef.current && isSelectMode) {
      const node = textRefs.current[selectedTextId];
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedTextId, isSelectMode]);
  
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
          onDblClick={(e) => onStageDoubleClick(e, pageIndex)}
          className={activeTool !== 'Book Size' ? 'cursor-crosshair' : 'cursor-default'}
        >
          <Layer>
            {data.shapes.map((shape, i) => (
              shape.type === 'rect' ? 
              <Rect key={i} x={shape.x} y={shape.y} width={50} height={50} fill={shape.fill} draggable={isSelectMode} /> :
              <Circle key={i} x={shape.x} y={shape.y} radius={30} fill={shape.fill} draggable={isSelectMode} />
            ))}

            {/* Lines and Custom Shapes */}
            {data.lines.map((line, i) => {
              if (line.type === 'custom-shape' && (line as any).draggable) {
                return (
                  <Line
                    key={i}
                    points={line.points}
                    stroke={line.color || (line as any).stroke}
                    strokeWidth={line.width || (line as any).strokeWidth}
                    fill={(line as any).fill}
                    tension={(line as any).tension || 0}
                    lineCap="round"
                    lineJoin="round"
                    closed={(line as any).closed}
                    draggable={isSelectMode}
                    onClick={() => isSelectMode && onTextSelect((line as any).id)}
                    globalCompositeOperation={line.tool === 'Eraser' ? 'destination-out' : 'source-over'}
                  />
                );
              }
              return (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.color || (line as any).stroke}
                  strokeWidth={line.width || (line as any).strokeWidth}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  closed={(line as any).closed}
                  globalCompositeOperation={line.tool === 'Eraser' ? 'destination-out' : 'source-over'}
                />
              );
            })}

            {/* Drawing Preview for Pen Tool */}
            {isPenMode && penState.points.length > 0 && (
              <>
                <Line
                  points={penState.points}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  fill={penFillOpacity > 0 ? penFillColor : undefined}
                  closed={penMode === 'polygon' && snapToStart}
                  dash={[5, 5]}
                  lineCap="round"
                  lineJoin="round"
                  tension={penMode === 'freehand' ? 0.5 : 0}
                  opacity={0.7}
                />

                {penMode === 'polygon' && penState.points.filter((_, i) => i % 2 === 0).map((x, i) => {
                  const y = penState.points[i * 2 + 1];
                  const isFirst = i === 0;

                  return (
                    <Group key={i}>
                      <Circle
                        x={x}
                        y={y}
                        radius={isFirst ? 8 : 6}
                        fill={isFirst ? strokeColor : '#ffffff'}
                        stroke={strokeColor}
                        strokeWidth={2}
                      />
                      {isFirst && penState.points.length > 4 && (
                        <Circle
                          x={x}
                          y={y}
                          radius={12}
                          stroke={strokeColor}
                          strokeWidth={1}
                          dash={[3, 3]}
                          opacity={0.5}
                        />
                      )}
                    </Group>
                  );
                })}

                {penMode === 'polygon' && penState.points.length >= 2 && mousePos && (
                  <Line
                    points={[
                      penState.points[penState.points.length - 2],
                      penState.points[penState.points.length - 1],
                      mousePos.x,
                      mousePos.y
                    ]}
                    stroke={strokeColor}
                    strokeWidth={1}
                    dash={[5, 5]}
                    opacity={0.5}
                  />
                )}
              </>
            )}

            {/* Pen tool cursor indicator */}
            {isPenMode && mousePos && (
              <Group>
                <Circle
                  x={mousePos.x}
                  y={mousePos.y}
                  radius={strokeWidth / 2}
                  stroke={strokeColor}
                  strokeWidth={1}
                  dash={[2, 2]}
                />
                {snapToStart && (
                  <Circle
                    x={mousePos.x}
                    y={mousePos.y}
                    radius={15}
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                )}
              </Group>
            )}

            {/* Images */}
            {data.images?.map((img) => (
               <URLImage 
                  key={img.id} 
                  image={img} 
                  isSelectMode={isSelectMode}
                  isSelected={selectedTextId === img.id}
                  onSelect={() => onTextSelect(img.id)}
               />
            ))}

            {/* Sticky Notes */}
            {data.stickyNotes?.map((note) => (
               <StickyNote
                  key={note.id}
                  note={note}
                  isSelected={selectedTextId === note.id}
                  isSelectMode={isSelectMode}
                  onSelect={onTextSelect}
                  onDoubleClick={(note) => handleStickyNoteDoubleClick(pageIndex, note)}
                  onUpdate={(updatedNote) => handleStickyNoteUpdate(pageIndex, updatedNote)}
                  onDelete={(id) => handleStickyNoteDelete(pageIndex, id)}
               />
            ))}

            {/* Tables */}
            {data.tables?.map((table) => (
               <Group 
                  key={table.id} 
                  x={table.x} 
                  y={table.y} 
                  draggable={isSelectMode}
                  onClick={() => onTextSelect(table.id)}
                  onDragEnd={(e) => {
                    const newX = e.target.x();
                    const newY = e.target.y();
                    handleStickyNoteUpdate(pageIndex, {
                      ...table,
                      x: newX,
                      y: newY
                    } as any);
                  }}
               >
                  {table.data.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                      const xPos = colIndex * table.cellWidth;
                      const yPos = rowIndex * table.cellHeight;
                      const cellWidth = table.cellWidth * (cell.colSpan || 1);
                      const cellHeight = table.cellHeight * (cell.rowSpan || 1);
                      
                      return (
                        <TableCellComponent
                          key={`${rowIndex}-${colIndex}`}
                          table={table}
                          cell={cell}
                          rowIndex={rowIndex}
                          colIndex={colIndex}
                          xPos={xPos}
                          yPos={yPos}
                          cellWidth={cellWidth}
                          cellHeight={cellHeight}
                          onCellClick={handleTableCellClick}
                          onCellDoubleClick={handleTableCellDoubleClick}
                          onCellContextMenu={handleTableContextMenu}
                        />
                      );
                    })
                  )}
                  {Array.from({ length: table.rows + 1 }).map((_, i) => (
                    <Line 
                      key={`h${i}`} 
                      points={[0, i * table.cellHeight, table.cols * table.cellWidth, i * table.cellHeight]} 
                      stroke={table.borderColor} 
                      strokeWidth={table.borderWidth} 
                    />
                  ))}
                  {Array.from({ length: table.cols + 1 }).map((_, i) => (
                    <Line 
                      key={`v${i}`} 
                      points={[i * table.cellWidth, 0, i * table.cellWidth, table.rows * table.cellHeight]} 
                      stroke={table.borderColor} 
                      strokeWidth={table.borderWidth} 
                    />
                  ))}
               </Group>
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
                draggable={isSelectMode}
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

const BookComponent = ({ activeTool = 'Tool', activeSubTool = 'select', strokeColor = '#000000', strokeWidth = 5, selectedBookSize = '6 x 4', fontSize = 16, fontFamily = 'Roboto', onAdvancedTextChange, drawingMode, zoom: externalZoom }: BookProps, ref: any) => {
  const [pages, setPages] = useState<PageData[]>(INITIAL_PAGES);
  const [internalZoom, setInternalZoom] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [pagesToAdd, setPagesToAdd] = useState('2');
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [editingTableCell, setEditingTableCell] = useState<{
    tableId: string;
    row: number;
    col: number;
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [tableContextMenu, setTableContextMenu] = useState<{
    x: number;
    y: number;
    tableId: string;
    row: number;
    col: number;
  } | null>(null);
  
  const bookDimensions = BOOK_SIZE_MAP[selectedBookSize] || BOOK_SIZE_MAP['6 x 4'];
  const WIDTH = bookDimensions.width;
  const HEIGHT = bookDimensions.height;

  const isToolCategoryActive = activeTool === 'Tool';
  const isSelectMode = isToolCategoryActive && activeSubTool === 'select';
  const isHandMode = isToolCategoryActive && activeSubTool === 'hand';
  const isPenMode = isToolCategoryActive && activeSubTool === 'pen';
  const isStickyNoteMode = isToolCategoryActive && activeSubTool === 'sticky_note';
  const isTableMode = isToolCategoryActive && activeSubTool === 'table';

  const zoom = externalZoom ?? internalZoom;
  
  // Text Editing State
  const [editingTextItem, setEditingTextItem] = useState<TextType | null>(null);
  const [editingStickyNote, setEditingStickyNote] = useState<StickyNoteType | null>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPos, setToolbarPos] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [clipboard, setClipboard] = useState<TextType | null>(null);

  // Hand Tool & Pen Tool State
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [penDrawingState, setPenDrawingState] = useState<{
    [pageIndex: number]: { points: number[]; isDrawing: boolean; mode: 'polygon' | 'freehand' };
  }>({});
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [snapToStart, setSnapToStart] = useState(false);
  const [penMode, setPenMode] = useState<'polygon' | 'freehand'>('polygon');
  const [penFillColor, setPenFillColor] = useState('rgba(255, 255, 255, 0)');
  const [penFillOpacity, setPenFillOpacity] = useState(0);
  const [penSnapDistance, setPenSnapDistance] = useState(20);
  const activeDrawingPage = useRef<number | null>(null);
  
  const bookRef = useRef<any>(null);
  const isDrawing = useRef(false);
  const { saveState, undo, redo, canUndo, canRedo } = useTextHistory();

  useImperativeHandle(ref, () => ({
    undo,
    redo,
    canUndo,
    canRedo,
    updatePageData,
    handleImageUpload,
    currentPageIndex,
    getSelectedTableProperties: () => {
      if (!selectedTableId || !pages[currentPageIndex]) return null;
      const table = pages[currentPageIndex].tables.find(t => t.id === selectedTableId);
      if (!table) return null;
      return {
        rows: table.rows,
        cols: table.cols,
        borderColor: table.borderColor,
        fillColor: table.fillColor,
        borderWidth: table.borderWidth
      };
    },
    getSelectedTableId: () => selectedTableId,
    handlePenOptionChange: (property: string, value: any) => {
      if (property === 'mode') setPenMode(value);
      if (property === 'fillColor') setPenFillColor(value);
      if (property === 'fillOpacity') setPenFillOpacity(value);
      if (property === 'snapDistance') setPenSnapDistance(value);
    },
    handleTableChange: (property: string, value: any) => {
      if (!selectedTableId || !pages[currentPageIndex]) return;
      
      const updatedPages = [...pages];
      const page = updatedPages[currentPageIndex];
      const tableIndex = page.tables.findIndex(t => t.id === selectedTableId);
      
      if (tableIndex === -1) return;
      
      const table = page.tables[tableIndex];
      let updatedTable = { ...table };

      switch (property) {
        case 'rows':
          updatedTable = handleTableRows(updatedTable, value);
          break;
        case 'cols':
          updatedTable = handleTableCols(updatedTable, value);
          break;
        case 'borderColor':
          updatedTable.borderColor = value;
          break;
        case 'borderWidth':
          updatedTable.borderWidth = value;
          break;
        case 'fill':
          updatedTable.fillColor = value;
          break;
        case 'insertRow':
          handleTableInsertRow(selectedTableId, value);
          return;
        case 'insertColumn':
          handleTableInsertColumn(selectedTableId, value);
          return;
        case 'deleteRow':
          handleTableDeleteRow(selectedTableId);
          return;
        case 'deleteColumn':
          handleTableDeleteColumn(selectedTableId);
          return;
        case 'mergeCells':
          handleTableMergeCells(selectedTableId);
          return;
        case 'reset':
          updatedTable = createDefaultTable(table.x, table.y);
          break;
      }

      page.tables[tableIndex] = updatedTable;
      setPages(updatedPages);
    },
  }));

  const createEmptyCell = (): TableCell => ({
    id: Date.now().toString() + Math.random(),
    content: '',
    fontSize: 12,
    fontFamily: 'Roboto',
    fill: '#000000',
    bold: false,
    italic: false,
    underline: false,
    alignment: 'left',
    verticalAlign: 'middle',
    backgroundColor: '#ffffff'
  });

  const createDefaultTable = (x: number, y: number): TableType => {
    const rows = 3;
    const cols = 3;
    const data: TableCell[][] = [];
    
    for (let i = 0; i < rows; i++) {
      const row: TableCell[] = [];
      for (let j = 0; j < cols; j++) {
        row.push(createEmptyCell());
      }
      data.push(row);
    }
    
    return {
      id: Date.now().toString(),
      type: 'table',
      x,
      y,
      rows,
      cols,
      cellWidth: 80,
      cellHeight: 40,
      borderWidth: 1,
      borderColor: '#000000',
      fillColor: '#ffffff',
      data,
      selectedCell: null
    };
  };

  const handleTableRows = (table: TableType, newRowCount: number): TableType => {
    const currentRows = table.rows;
    const diff = newRowCount - currentRows;
    
    if (diff > 0) {
      const newRows = Array(diff).fill(null).map(() => 
        Array(table.cols).fill(null).map(() => createEmptyCell())
      );
      return {
        ...table,
        rows: newRowCount,
        data: [...table.data, ...newRows]
      };
    } else if (diff < 0) {
      return {
        ...table,
        rows: newRowCount,
        data: table.data.slice(0, newRowCount)
      };
    }
    return table;
  };

  const handleTableCols = (table: TableType, newColCount: number): TableType => {
    const currentCols = table.cols;
    const diff = newColCount - currentCols;
    
    if (diff > 0) {
      const newData = table.data.map(row => [
        ...row,
        ...Array(diff).fill(null).map(() => createEmptyCell())
      ]);
      return {
        ...table,
        cols: newColCount,
        data: newData
      };
    } else if (diff < 0) {
      const newData = table.data.map(row => row.slice(0, newColCount));
      return {
        ...table,
        cols: newColCount,
        data: newData
      };
    }
    return table;
  };

  const handleTableCellClick = useCallback((tableId: string, row: number, col: number) => {
    setSelectedTableId(tableId);
    setSelectedTextId(null);
    
    setPages(prevPages => {
      const updatedPages = [...prevPages];
      const page = updatedPages[currentPageIndex];
      const tableIndex = page.tables.findIndex(t => t.id === tableId);
      
      if (tableIndex !== -1) {
        page.tables.forEach((t, idx) => {
          if (idx === tableIndex) {
            page.tables[idx] = {
              ...t,
              selectedCell: { row, col }
            };
          } else {
            page.tables[idx] = {
              ...t,
              selectedCell: null
            };
          }
        });
        return updatedPages;
      }
      return prevPages;
    });
  }, [currentPageIndex]);

  const handleTableCellDoubleClick = (
    tableId: string, 
    row: number, 
    col: number, 
    x: number, 
    y: number, 
    width: number, 
    height: number
  ) => {
    const page = pages[currentPageIndex];
    const table = page.tables.find(t => t.id === tableId);
    
    if (!table) return;
    
    const cell = table.data[row]?.[col];
    if (!cell || cell.content === null) return;
    
    const screenX = table.x + x;
    const screenY = table.y + y;
    
    setEditingTableCell({
      tableId,
      row,
      col,
      x: screenX,
      y: screenY,
      width: width - 10,
      height: height - 10
    });
  };

  const handleTableContextMenu = (
    evt: MouseEvent,
    tableId: string,
    row: number,
    col: number
  ) => {
    evt.preventDefault();
    setSelectedTableId(tableId);
    
    // Update selected cell for the table
    setPages(prevPages => {
      const updatedPages = [...prevPages];
      const page = updatedPages[currentPageIndex];
      const tableIndex = page.tables.findIndex(t => t.id === tableId);
      
      if (tableIndex !== -1) {
        page.tables[tableIndex] = {
          ...page.tables[tableIndex],
          selectedCell: { row, col }
        };
      }
      return updatedPages;
    });
    
    setTableContextMenu({
      x: evt.clientX,
      y: evt.clientY,
      tableId,
      row,
      col
    });
  };

  const handleTableCellSave = (content: string) => {
    if (!editingTableCell) return;
    
    const { tableId, row, col } = editingTableCell;
    const updatedPages = [...pages];
    const page = updatedPages[currentPageIndex];
    const tableIndex = page.tables.findIndex(t => t.id === tableId);
    
    if (tableIndex !== -1) {
      const table = page.tables[tableIndex];
      const newData = [...table.data];
      
      if (newData[row] && newData[row][col]) {
        newData[row][col] = {
          ...newData[row][col],
          content: content
        };
        
        page.tables[tableIndex] = {
          ...table,
          data: newData
        };
        
        setPages(updatedPages);
      }
    }
    
    setEditingTableCell(null);
  };

  const handleTableInsertRow = useCallback((tableId: string, position: 'above' | 'below') => {
    setPages(prevPages => {
      const updatedPages = [...prevPages];
      const page = updatedPages[currentPageIndex];
      const tableIndex = page.tables.findIndex(t => t.id === tableId);
      
      if (tableIndex === -1) return prevPages;
      
      const table = page.tables[tableIndex];
      const selectedRow = table.selectedCell?.row || 0;
      const insertIndex = position === 'above' ? selectedRow : selectedRow + 1;
      
      const newRow = Array(table.cols).fill(null).map(() => createEmptyCell());
      const newData = [
        ...table.data.slice(0, insertIndex),
        newRow,
        ...table.data.slice(insertIndex)
      ];
      
      page.tables[tableIndex] = {
        ...table,
        rows: table.rows + 1,
        data: newData
      };
      
      return updatedPages;
    });
  }, [currentPageIndex]);

  const handleTableInsertColumn = useCallback((tableId: string, position: 'left' | 'right') => {
    setPages(prevPages => {
      const updatedPages = [...prevPages];
      const page = updatedPages[currentPageIndex];
      const tableIndex = page.tables.findIndex(t => t.id === tableId);
      
      if (tableIndex === -1) return prevPages;
      
      const table = page.tables[tableIndex];
      const selectedCol = table.selectedCell?.col || 0;
      const insertIndex = position === 'left' ? selectedCol : selectedCol + 1;
      
      const newData = table.data.map(row => {
        const newRow = [...row];
        newRow.splice(insertIndex, 0, createEmptyCell());
        return newRow;
      });
      
      page.tables[tableIndex] = {
        ...table,
        cols: table.cols + 1,
        data: newData
      };
      
      return updatedPages;
    });
  }, [currentPageIndex]);

  const handleTableDeleteRow = useCallback((tableId: string) => {
    setPages(prevPages => {
      const updatedPages = [...prevPages];
      const page = updatedPages[currentPageIndex];
      const tableIndex = page.tables.findIndex(t => t.id === tableId);
      
      if (tableIndex === -1) return prevPages;
      
      const table = page.tables[tableIndex];
      if (table.rows <= 1) return prevPages;
      
      const selectedRow = table.selectedCell?.row || 0;
      const newData = [...table.data];
      newData.splice(selectedRow, 1);
      
      page.tables[tableIndex] = {
        ...table,
        rows: table.rows - 1,
        data: newData,
        selectedCell: null
      };
      
      return updatedPages;
    });
  }, [currentPageIndex]);

  const handleTableDeleteColumn = useCallback((tableId: string) => {
    setPages(prevPages => {
      const updatedPages = [...prevPages];
      const page = updatedPages[currentPageIndex];
      const tableIndex = page.tables.findIndex(t => t.id === tableId);
      
      if (tableIndex === -1) return prevPages;
      
      const table = page.tables[tableIndex];
      if (table.cols <= 1) return prevPages;
      
      const selectedCol = table.selectedCell?.col || 0;
      const newData = table.data.map(row => {
        const newRow = [...row];
        newRow.splice(selectedCol, 1);
        return newRow;
      });
      
      page.tables[tableIndex] = {
        ...table,
        cols: table.cols - 1,
        data: newData,
        selectedCell: null
      };
      
      return updatedPages;
    });
  }, [currentPageIndex]);

  const handleTableMergeCells = (tableId: string) => {
    const updatedPages = [...pages];
    const page = updatedPages[currentPageIndex];
    const tableIndex = page.tables.findIndex(t => t.id === tableId);
    
    if (tableIndex === -1) return;
    
    const table = page.tables[tableIndex];
    const selectedCell = table.selectedCell;
    
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    const newData = table.data.map(r => r.map(c => ({ ...c })));
    const mainCell = { ...newData[row][col] };
    
    mainCell.rowSpan = (mainCell.rowSpan || 1) + 1;
    mainCell.colSpan = (mainCell.colSpan || 1) + 1;
    
    for (let i = row; i < Math.min(row + 2, table.rows); i++) {
      for (let j = col; j < Math.min(col + 2, table.cols); j++) {
        if (i === row && j === col) continue;
        newData[i][j] = { ...createEmptyCell(), content: '' };
      }
    }
    
    newData[row][col] = mainCell;
    
    page.tables[tableIndex] = {
      ...table,
      data: newData
    };
    
    setPages(updatedPages);
  };

  const getCurrentPenState = (pageIndex: number) => {
    return penDrawingState[pageIndex] || { points: [], isDrawing: false, mode: penMode };
  };

  useEffect(() => {
    if (activeDrawingPage.current !== null && activeDrawingPage.current !== currentPageIndex) {
      setMousePos(null);
      setSnapToStart(false);
    }
    activeDrawingPage.current = currentPageIndex;
  }, [currentPageIndex]);

  const updatePageData = useCallback((pageIndex: number, key: keyof PageData, data: any) => {
    setPages(prev => {
      const newPages = [...prev];
      newPages[pageIndex] = { ...newPages[pageIndex], [key]: data };
      return newPages;
    });
  }, []);

  // Update page background when color tool is active
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (strokeColor && activeTool === 'Color') {
      // Wait 50ms before applying the color to prevent flashing when switching tools
      timeoutId = setTimeout(() => {
        // This ensures color changes from the toolbox apply to the page background.
        // Apply to the current page (which is the left page in a spread).
        updatePageData(currentPageIndex, 'background', strokeColor);

        // If we are in a spread view (currentPageIndex will be odd), and the right page exists,
        // apply the color to the right page as well.
        if (currentPageIndex % 2 !== 0 && (currentPageIndex + 1) < pages.length) {
          updatePageData(currentPageIndex + 1, 'background', strokeColor);
        }
      }, 50);
    }
    return () => clearTimeout(timeoutId);
  }, [strokeColor, currentPageIndex, updatePageData, pages.length, activeTool]);


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
            // eslint-disable-next-line prefer-const
            let cleanLine = line.replace(/^[•\-*]\s+/, '').replace(/^\d+\.\s+/, '');
            if (value === 'bullet') return `• ${cleanLine}`;
            if (value === 'number') return `${index + 1}. ${cleanLine}`;
            return cleanLine;
          });
          updatedText = { ...updatedText, text: newLines.join('\n'), listType: value };
        } else {
          (updatedText as any)[property] = value;
        }

        handleTextUpdate(updatedText);
      };

      // Store the handler so Toolbox can call it
      (window as any).__handleAdvancedTextChange = handleAdvancedChange;
    }
  }, [selectedTextId, currentPageIndex, pages, onAdvancedTextChange]);

  // --- Hand Tool Logic ---
  const handleContainerMouseDown = (e: React.MouseEvent) => {
    if (isHandMode) {
      setIsPanning(true);
      setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
    }
  };

  const handleContainerMouseMove = (e: React.MouseEvent) => {
    if (isPanning && isHandMode) {
      setPanPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleContainerMouseUp = () => {
    setIsPanning(false);
  };

  // --- Image Upload Logic ---
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const newImage: ImageType = {
        id: Date.now().toString(),
        type: 'image',
        x: 100, y: 100, width: 200, height: 200,
        rotation: 0,
        src: reader.result as string
      };
      // Add to current page
      const currentImages = pages[currentPageIndex].images || [];
      updatePageData(currentPageIndex, 'images', [...currentImages, newImage]);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!isPenMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeDrawingPage.current === null) return;
      const penState = getCurrentPenState(activeDrawingPage.current);

      switch (e.key) {
        case 'Escape':
          setPenDrawingState(prev => ({
            ...prev,
            [activeDrawingPage.current!]: { points: [], isDrawing: false, mode: penMode }
          }));
          activeDrawingPage.current = null;
          break;
        case 'Enter':
          if (penMode === 'polygon' && penState.points.length >= 6) {
            completePenShape(activeDrawingPage.current, penState.points, true);
          }
          break;
        case 'Backspace':
        case 'Delete':
          e.preventDefault();
          if (penMode === 'polygon' && penState.points.length >= 2) {
            const newPoints = penState.points.slice(0, -2);
            setPenDrawingState(prev => ({
              ...prev,
              [activeDrawingPage.current!]: { ...prev[activeDrawingPage.current!], points: newPoints }
            }));
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPenMode, penMode, penDrawingState]);

  // Text keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedTextId) return;

      const isStickyNoteSelected = pages[currentPageIndex]?.stickyNotes.some(n => n.id === selectedTextId);
      
      if (isStickyNoteSelected) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          e.preventDefault();
          handleStickyNoteDelete(currentPageIndex, selectedTextId);
        } else if (e.key === 'Escape' && editingStickyNote) {
          setEditingStickyNote(null);
        }
        return;
      }

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
  }, [selectedTextId, currentPageIndex, pages, editingStickyNote]);

  const handleStickyNoteUpdate = (pageIndex: number, updatedNote: StickyNoteType) => {
    setPages(prev => {
      const newPages = [...prev];
      const page = newPages[pageIndex];
      page.stickyNotes = page.stickyNotes.map(note => 
        note.id === updatedNote.id ? updatedNote : note
      );
      return newPages;
    });
  };

  const handleStickyNoteDelete = (pageIndex: number, noteId: string) => {
    setPages(prev => {
      const newPages = [...prev];
      newPages[pageIndex].stickyNotes = newPages[pageIndex].stickyNotes.filter(note => note.id !== noteId);
      return newPages;
    });
    setSelectedTextId(null);
  };

  const handleStickyNoteDoubleClick = (pageIndex: number, note: StickyNoteType) => {
    setCurrentPageIndex(pageIndex);
    setSelectedTextId(note.id);
    setEditingStickyNote(note);
  };

  // Disable all mouse-based page flipping - only arrow buttons allowed
  const isDrawingMode = ['Brush', 'Eraser'].includes(activeTool);

  const completePenShape = (pageIndex: number, points: number[], closed: boolean) => {
    const fillMatch = penFillColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([0-9.]+)\)/);
    const fillOpacity = fillMatch ? parseFloat(fillMatch[4]) : 0;

    const newShape = {
      id: Date.now().toString(),
      type: 'custom-shape',
      points: points,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      fill: fillOpacity > 0 ? penFillColor : undefined,
      closed: closed,
      tool: 'pen',
      color: strokeColor,
      width: strokeWidth,
      draggable: true,
      tension: penMode === 'freehand' ? 0.5 : 0,
    };

    updatePageData(pageIndex, 'lines', [...pages[pageIndex].lines, newShape]);
    setPenDrawingState(prev => ({
      ...prev,
      [pageIndex]: { points: [], isDrawing: false, mode: penMode }
    }));
    setMousePos(null);
    setSnapToStart(false);
    activeDrawingPage.current = null;
  };

  const handleStageDoubleClick = (e: Konva.KonvaEventObject<MouseEvent>, pageIndex: number) => {
    if (!isPenMode) return;
    const penState = getCurrentPenState(pageIndex);
    if (penState.points.length >= 6) {
      e.cancelBubble = true;
      completePenShape(pageIndex, penState.points, penMode === 'polygon');
    }
  };

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>, pageIndex: number) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedTextId(null);
      setShowToolbar(false);
      setContextMenu(null);
    }
    
    // 1. PEN TOOL
    if (isPenMode) {
      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) return;

      const penState = getCurrentPenState(pageIndex);
      const points = penState.points;

      if (penMode === 'polygon') {
        if (points.length === 0) {
          setPenDrawingState(prev => ({
            ...prev,
            [pageIndex]: { points: [pos.x, pos.y], isDrawing: true, mode: 'polygon' }
          }));
          activeDrawingPage.current = pageIndex;
          return;
        }

        if (points.length > 4) {
          const dx = points[0] - pos.x;
          const dy = points[1] - pos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < penSnapDistance) {
            completePenShape(pageIndex, points, true);
            return;
          }
        }

        setPenDrawingState(prev => ({
          ...prev,
          [pageIndex]: {
            ...prev[pageIndex],
            points: [...points, pos.x, pos.y],
            mode: 'polygon'
          }
        }));
        return;
      }

      if (penMode === 'freehand') {
        isDrawing.current = true;
        activeDrawingPage.current = pageIndex;
        setPenDrawingState(prev => ({
          ...prev,
          [pageIndex]: { points: [pos.x, pos.y], isDrawing: true, mode: 'freehand' }
        }));
        return;
      }
    }

    // 2. STICKY NOTE TOOL
    if (isStickyNoteMode) {
      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) return;
      const newNote: StickyNoteType = {
        id: Date.now().toString(),
        type: 'sticky-note',
        x: pos.x,
        y: pos.y,
        width: 200,
        height: 150,
        collapsedWidth: 30,
        collapsedHeight: 30,
        isExpanded: false,
        text: '',
        color: '#fef3c7',
        textColor: '#000000',
        fontSize: 14,
        fontFamily: 'Roboto'
      };
      const currentNotes = pages[pageIndex].stickyNotes || [];
      updatePageData(pageIndex, 'stickyNotes', [...currentNotes, newNote]);
      setSelectedTextId(newNote.id);
      return;
    }

    // 3. TABLE TOOL
    if (isTableMode) {
      const stage = e.target.getStage();
      if (!stage) return;
      
      const pos = stage.getPointerPosition();
      if (!pos) return;
      
      const adjustedX = (pos.x - panPosition.x) / zoom;
      const adjustedY = (pos.y - panPosition.y) / zoom;
      
      const newTable = createDefaultTable(adjustedX, adjustedY);
      const currentTables = pages[pageIndex].tables || [];
      updatePageData(pageIndex, 'tables', [...currentTables, newTable]);
      setSelectedTableId(newTable.id);
      return;
    }

    if (isDrawingMode) {
      isDrawing.current = true;
      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) return;

      let currentTool = activeTool;
      if (activeTool === 'Brush' && drawingMode === 'eraser') {
        currentTool = 'Eraser';
      }

      const newLines = [...pages[pageIndex].lines, {
        tool: currentTool,
        points: [pos.x, pos.y],
        color: currentTool === 'Eraser' ? '#ffffff' : strokeColor,
        width: strokeWidth,
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
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    if (isPenMode) {
      setMousePos(pos);
      const penState = getCurrentPenState(pageIndex);
      const points = penState.points;

      if (penMode === 'polygon' && points.length > 4) {
        const dx = points[0] - pos.x;
        const dy = points[1] - pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        setSnapToStart(distance < penSnapDistance);
      } else {
        setSnapToStart(false);
      }

      if (penMode === 'freehand' && isDrawing.current && pageIndex === activeDrawingPage.current) {
        const newPoints = [...points, pos.x, pos.y];
        setPenDrawingState(prev => ({
          ...prev,
          [pageIndex]: { ...prev[pageIndex], points: newPoints }
        }));
      }
      return;
    }

    if (!isDrawing.current || !isDrawingMode) return;

    const currentLines = [...pages[pageIndex].lines];
    const lastLine = currentLines[currentLines.length - 1];
    
    // Check if line exists before adding points (safety check)
    if (lastLine) {
        lastLine.points = lastLine.points.concat([pos.x, pos.y]);
        currentLines.splice(currentLines.length - 1, 1, lastLine);
        updatePageData(pageIndex, 'lines', currentLines);
    }
  };

  const handleMouseUp = () => {
    if (isPenMode && penMode === 'freehand' && isDrawing.current && activeDrawingPage.current !== null) {
      const penState = getCurrentPenState(activeDrawingPage.current);
      if (penState.points.length >= 6) {
        completePenShape(activeDrawingPage.current, penState.points, false);
      } else {
        setPenDrawingState(prev => ({
          ...prev,
          [activeDrawingPage.current!]: { points: [], isDrawing: false, mode: penMode }
        }));
      }
    }
    isDrawing.current = false;
    activeDrawingPage.current = null;
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
        const updatedText = { ...textItem };
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
            shapes: [],
            images: [],
            stickyNotes: [],
            tables: []
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
    <div 
      style={{ backgroundImage: `url(${bookBG})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', cursor: isHandMode ? (isPanning ? 'grabbing' : 'grab') : 'default'}} 
      className="relative flex flex-col items-center justify-center h-[calc(100vh-140px)] w-full bg-transparent overflow-hidden"
      onMouseDown={handleContainerMouseDown}
      onMouseMove={handleContainerMouseMove}
      onMouseUp={handleContainerMouseUp}
    >
      
      {/* Undo/Redo Controls */}
      

      {/* Zoom / View Controls */}
      <div className="absolute right-4 bottom-4 flex flex-col gap-2 z-50">
        <div className="bg-[#2B2B2B] rounded-lg p-1 flex flex-col gap-1">
          <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/20" onClick={() => setInternalZoom(z => Math.min(z + 0.1, 2))}><Plus size={16} /></Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/20" onClick={() => setInternalZoom(z => Math.max(z - 0.1, 0.5))}><Minus size={16} /></Button>
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
      <div style={{ 
          transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoom})`, 
          transition: isPanning ? 'none' : 'transform 0.2s' 
      }}>
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
                    isSelectMode={isSelectMode}
                    isPenMode={isPenMode}
                    width={WIDTH}
                    height={HEIGHT}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onTextDblClick={handleTextDblClick}
                    selectedTextId={selectedTextId}
                    onTextSelect={handleTextSelect}
                    penState={getCurrentPenState(index)}
                    snapToStart={snapToStart}
                    mousePos={mousePos}
                    strokeColor={strokeColor}
                    strokeWidth={strokeWidth}
                    penFillColor={penFillColor}
                    penFillOpacity={penFillOpacity}
                    penMode={penMode}
                    onStageDoubleClick={handleStageDoubleClick}
                    handleStickyNoteDoubleClick={handleStickyNoteDoubleClick}
                    handleStickyNoteUpdate={handleStickyNoteUpdate}
                    handleStickyNoteDelete={handleStickyNoteDelete}
                    handleTableCellClick={handleTableCellClick}
                    handleTableCellDoubleClick={handleTableCellDoubleClick}
                    handleTableContextMenu={handleTableContextMenu}
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

      {/* Inline Sticky Note Editor */}
      {editingStickyNote && (
        <InlineStickyNoteEditor
          note={editingStickyNote}
          onUpdate={(updatedNote) => {
            handleStickyNoteUpdate(currentPageIndex, updatedNote);
            setEditingStickyNote(null);
          }}
          onBlur={() => setEditingStickyNote(null)}
        />
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

      {/* Table Context Menu */}
      {tableContextMenu && (
        <>
          <div 
            className="fixed inset-0 z-[999]"
            onClick={() => setTableContextMenu(null)}
          />
          <TableContextMenu
            x={tableContextMenu.x}
            y={tableContextMenu.y}
            onAction={(action, value) => {
              const { tableId } = tableContextMenu;
              
              switch (action) {
                case 'insertRow':
                  handleTableInsertRow(tableId, value);
                  break;
                case 'insertColumn':
                  handleTableInsertColumn(tableId, value);
                  break;
                case 'deleteRow':
                  handleTableDeleteRow(tableId);
                  break;
                case 'deleteColumn':
                  handleTableDeleteColumn(tableId);
                  break;
                case 'mergeCells':
                  handleTableMergeCells(tableId);
                  break;
              }
              setTableContextMenu(null);
            }}
            onClose={() => setTableContextMenu(null)}
          />
        </>
      )}

      {/* Table Cell Editor */}
      {editingTableCell && (
        <TableCellEditor
          cell={(() => {
            const page = pages[currentPageIndex];
            const table = page.tables.find(t => t.id === editingTableCell.tableId);
            if (!table) return createEmptyCell();
            return table.data[editingTableCell.row]?.[editingTableCell.col] || createEmptyCell();
          })()}
          x={editingTableCell.x}
          y={editingTableCell.y}
          width={editingTableCell.width}
          height={editingTableCell.height}
          onSave={handleTableCellSave}
          onClose={() => setEditingTableCell(null)}
        />
      )}
    </div>
  );
};

const Book = forwardRef(BookComponent);
Book.displayName = 'Book';

export default Book;
