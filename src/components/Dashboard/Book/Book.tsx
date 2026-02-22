/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useState,
  useRef,
  useCallback,
  forwardRef,
  useEffect,
  useImperativeHandle,
  memo,
} from "react";
import {
  Stage,
  Layer,
  Line,
  Text as KonvaText,
  Rect,
  Circle,
  Transformer,
  Image as KonvaImage,
  Group,
  RegularPolygon,
  Star as KonvaStar,
  Arrow,
} from "react-konva";
import Konva from "konva";
import HTMLFlipBook from "react-pageflip";
import * as htmlToImage from "html-to-image";
import {
  Plus,
  X,
  ArrowLeft,
  ArrowRight,
  Expand,
  SquarePlus,
  SquareMinus,
  RotateCcw,
  Minimize,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import bookBG from "@/assets/images/Books/mainBookbg.png";
import type {
  TextType,
  ShapeType,
  PageData as BasePageData,
  StickyNoteType,
} from "./types";
import { FloatingTextToolbar } from "./FloatingTextToolbar";
import { TextContextMenu } from "./TextContextMenu";
import { InPlaceTextEditor } from "./InPlaceTextEditor";
import { useBookHistory } from "./useBookHistory";
import { useFullscreen } from "@/hooks/useFullscreen";
import StickyNote from "./StickyNote";
import InlineStickyNoteEditor from "./InlineStickyNoteEditor";
import TableCellEditor from "./TableCellEditor";
import TableContextMenu from "./TableContextMenu";
import {
  getLineGuideStops,
  getObjectSnappingEdges,
  getGuides,
  drawGuides,
} from "@/utils/snappingLogic";
import { getMaxZIndex, getMinZIndex } from "@/utils/ZIndexManager";

// --- Types ---
export interface ImageType {
  id: string;
  type: "image";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  src: string;
  zIndex?: number;
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
  alignment: "left" | "center" | "right";
  verticalAlign: "top" | "middle" | "bottom";
  backgroundColor: string;
  rowSpan?: number;
  colSpan?: number;
}

export interface TableType {
  id: string;
  type: "table";
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
  zIndex?: number;
}

interface PageData extends BasePageData {
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
  onZoomChange?: (zoom: number) => void;
  selectedShape?: string;
  shapeFillColor?: string;
  shapeStrokeColor?: string;
  shapeStrokeWidth?: number;
  isFillTransparent?: boolean;
  onToolChange?: (tool: string, subTool: string) => void;
  initialData?: PageData[] | null;
  targetColorPage?: "left" | "right"; 
}

// --- Constants ---
const BOOK_SIZE_MAP: Record<string, { width: number; height: number }> = {
  "5 X 7": { width: 350, height: 490 },
  "6 X 4": { width: 400, height: 550 },
  "6 X 8": { width: 420, height: 560 },
  "6 X 9": { width: 420, height: 630 },
  "7 X 10": { width: 280, height: 700 },
  "8.5 X 11": { width: 476, height: 616 },
  "8 X 10": { width: 560, height: 700 },
  "12 X 9": { width: 672, height: 504 },
  Square: { width: 500, height: 500 },
};

const INITIAL_PAGES: PageData[] = Array(10)
  .fill(null)
  .map(() => ({
    lines: [],
    texts: [],
    shapes: [],
    images: [],
    stickyNotes: [],
    tables: [],
  }));

INITIAL_PAGES[0].texts.push({
  id: "title",
  x: 50,
  y: 200,
  text: "My Book",
  fontSize: 32,
  fontFamily: "Roboto",
  fill: "#fff",
});
INITIAL_PAGES[0].background =
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

// --- Custom Hook for Images ---
const useImage = (url: string) => {
  const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);
  
  useEffect(() => {
    if (!url) return;
    
    let isMounted = true;
    const img = new window.Image();
    
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      if (isMounted) setImage(img);
    };
    
    img.onerror = () => {
      console.warn(`CORS failed for ${url}. Loading without CORS (this taints the canvas).`);
      const fallbackImg = new window.Image();
      fallbackImg.onload = () => {
        if (isMounted) setImage(fallbackImg);
      };
      fallbackImg.src = url;
    };
    
    img.src = url.startsWith('data:') ? url : `${url}?t=${new Date().getTime()}`;
    
    return () => { isMounted = false; };
  }, [url]);
  
  return [image];
};

// --- Helper Components ---
const renderShape = (
  shape: ShapeType,
  isSelected: boolean,
  onSelect: () => void,
  onDragEnd: (x: number, y: number) => void,
  onTransformEnd: (node: any) => void,
  shapeRef: (node: any) => void,
) => {
  const commonProps = {
    name: "object",
    x: shape.x,
    y: shape.y,
    fill: shape.fill,
    stroke: shape.stroke,
    strokeWidth: shape.strokeWidth,
    opacity: shape.opacity,
    rotation: shape.rotation,
    scaleX: shape.scaleX,
    scaleY: shape.scaleY,
    draggable: isSelected,
    onClick: onSelect,
    onDragEnd: (e: any) => onDragEnd(e.target.x(), e.target.y()),
    onTransformEnd: (e: any) => onTransformEnd(e.target),
    ref: shapeRef,
  };

  switch (shape.type) {
    case "rectangle":
      return (
        <Rect
          {...commonProps}
          width={shape.width}
          height={shape.height}
          cornerRadius={(shape as any).cornerRadius || 0}
        />
      );
    case "circle":
      return <Circle {...commonProps} radius={(shape as any).radius} />;
    case "triangle":
      return (
        <RegularPolygon
          {...commonProps}
          sides={3}
          radius={Math.min(shape.width, shape.height) / 2}
        />
      );
    case "line":
      return <Line {...commonProps} points={(shape as any).points} />;
    case "arrow":
      return (
        <Arrow
          {...commonProps}
          points={(shape as any).points}
          pointerLength={(shape as any).pointerLength || 15}
          pointerWidth={(shape as any).pointerWidth || 10}
        />
      );
    case "star":
      return (
        <KonvaStar
          {...commonProps}
          numPoints={(shape as any).numPoints}
          innerRadius={(shape as any).innerRadius}
          outerRadius={(shape as any).outerRadius}
        />
      );
    default:
      return null;
  }
};

const TableCellComponent = memo(
  ({
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
    onCellContextMenu,
  }: any) => {
    const isSelected =
      table.selectedCell?.row === rowIndex &&
      table.selectedCell?.col === colIndex;

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
            onCellDoubleClick(
              table.id,
              rowIndex,
              colIndex,
              xPos,
              yPos,
              cellWidth,
              cellHeight,
            );
          }}
          onContextMenu={(e) => {
            e.evt.preventDefault();
            e.evt.stopPropagation();
            e.cancelBubble = true;
            onCellContextMenu(e.evt, table.id, rowIndex, colIndex);
          }}
          shadowColor={isSelected ? "#3b82f6" : "transparent"}
          shadowBlur={isSelected ? 8 : 0}
          shadowOpacity={isSelected ? 0.3 : 0}
        />
        <KonvaText
          x={xPos + 5}
          y={yPos + 5}
          text={cell.content || " "}
          fontSize={cell.fontSize}
          fontFamily={cell.fontFamily}
          fill={cell.fill}
          fontStyle={`${cell.bold ? "bold" : ""} ${cell.italic ? "italic" : ""}`}
          textDecoration={cell.underline ? "underline" : ""}
          width={cellWidth - 10}
          height={cellHeight - 10}
          align={cell.alignment}
          verticalAlign={cell.verticalAlign}
          wrap="word"
          listening={false}
        />
      </Group>
    );
  },
);

TableCellComponent.displayName = "TableCellComponent";

const URLImage = ({
  image,
  isSelected,
  onSelect,
  isSelectMode,
  onContextMenu,
  onChange,
}: any) => {
  const [img] = useImage(image.src);
  const imageRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && trRef.current && imageRef.current && isSelectMode) {
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, isSelectMode]);

  return (
    <>
      <KonvaImage
        name="object"
        ref={imageRef}
        image={img}
        x={image.x}
        y={image.y}
        width={image.width}
        height={image.height}
        rotation={image.rotation}
        draggable={isSelectMode}
        onClick={onSelect}
        onContextMenu={onContextMenu}
        onDragEnd={(e) => {
          onChange({
            ...image,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = imageRef.current;
          if (!node) return;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);

          onChange({
            ...image,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
};

// --- Page Component ---
interface BookPageProps {
  pageIndex: number;
  data: PageData;
  activeTool: string;
  isSelectMode: boolean;
  isPenMode: boolean;
  width: number;
  height: number;
  stageRef?: (node: Konva.Stage | null) => void;
  onMouseDown: (e: Konva.KonvaEventObject<MouseEvent>, index: number) => void;
  onMouseMove: (e: Konva.KonvaEventObject<MouseEvent>, index: number) => void;
  onMouseUp: () => void;
  onStageDoubleClick: (
    e: Konva.KonvaEventObject<MouseEvent>,
    index: number,
  ) => void;
  onTextDblClick: (
    e: Konva.KonvaEventObject<MouseEvent>,
    index: number,
    item: TextType,
  ) => void;
  onTextClick?: (index: number, item: TextType) => void;
  selectedTextId: string | null;
  onTextSelect: (id: string | null) => void;
  penState: {
    points: number[];
    isDrawing: boolean;
    mode: "polygon" | "freehand";
  };
  snapToStart: boolean;
  mousePos: { x: number; y: number } | null;
  strokeColor: string;
  strokeWidth: number;
  penFillColor: string;
  penFillOpacity: number;
  penMode: "polygon" | "freehand";
  handleStickyNoteDoubleClick: (
    pageIndex: number,
    note: StickyNoteType,
  ) => void;
  handleStickyNoteUpdate: (
    pageIndex: number,
    updatedNote: StickyNoteType,
  ) => void;
  handleStickyNoteDelete: (pageIndex: number, noteId: string) => void;
  handleTableCellClick: (
    tableId: string,
    row: number,
    col: number,
    pageIndex: number,
  ) => void;
  handleTableCellDoubleClick: (
    tableId: string,
    row: number,
    col: number,
    x: number,
    y: number,
    width: number,
    height: number,
    pageIndex: number,
  ) => void;
  handleTableContextMenu: (
    evt: MouseEvent,
    tableId: string,
    row: number,
    col: number,
    pageIndex: number,
  ) => void;
  pages: PageData[];
  shapeTransformerRef: React.RefObject<Konva.Transformer | null>;
  setContextMenu: (menu: { x: number; y: number } | null) => void;
  onImageUpdate: (pageIndex: number, img: ImageType) => void;
  onShapeUpdate: (pageIndex: number, shape: ShapeType) => void;
  onTableUpdate: (pageIndex: number, table: TableType) => void;
  onTextUpdate: (pageIndex: number, text: TextType) => void;
}

const BookPage = forwardRef<HTMLDivElement, BookPageProps>(
  (
    {
      pageIndex,
      data,
      activeTool,
      width,
      height,
      stageRef,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onStageDoubleClick,
      onTextDblClick,
      selectedTextId,
      onTextSelect,
      penState,
      snapToStart,
      mousePos,
      strokeColor,
      strokeWidth,
      penFillColor,
      penFillOpacity,
      penMode,
      handleStickyNoteDoubleClick,
      handleStickyNoteUpdate,
      handleStickyNoteDelete,
      isSelectMode,
      isPenMode,
      handleTableCellClick,
      handleTableCellDoubleClick,
      handleTableContextMenu,
      shapeTransformerRef,
      setContextMenu,
      onImageUpdate,
      onShapeUpdate,
      onTableUpdate,
      onTextUpdate,
    },
    ref,
  ) => {
    const transformerRef = useRef<Konva.Transformer>(null);
    const textRefs = useRef<{ [key: string]: Konva.Text }>({});

    const handleDragMove = useCallback(
      (e: Konva.KonvaEventObject<DragEvent>) => {
        const layer = e.target.getLayer();
        if (!layer) return;

        layer.find(".guid-line").forEach((l) => l.destroy());

        const lineGuideStops = getLineGuideStops(e.target, layer);
        const itemBounds = getObjectSnappingEdges(e.target);
        const guides = getGuides(lineGuideStops, itemBounds);

        if (!guides.length) {
          layer.batchDraw();
          return;
        }

        drawGuides(guides, layer);

        const absPos = e.target.absolutePosition();
        guides.forEach((lg) => {
          switch (lg.orientation) {
            case "V": {
              absPos.x = lg.lineGuide + lg.offset;
              break;
            }
            case "H": {
              absPos.y = lg.lineGuide + lg.offset;
              break;
            }
          }
        });
        e.target.absolutePosition(absPos);
        layer.batchDraw();
      },
      [],
    );

    const handleDragEnd = useCallback(
      (e: Konva.KonvaEventObject<DragEvent>) => {
        const layer = e.target.getLayer();
        if (layer) {
          layer.find(".guid-line").forEach((l) => l.destroy());
          layer.batchDraw();
        }
      },
      [],
    );

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
      if (!style || style === "normal") return "normal";
      if (style === "bold italic") return "bold italic";
      return style;
    };
    return (
      <div
        ref={ref}
        id={`book-page-${pageIndex}`}
        data-page-index={pageIndex}
        className="bg-white h-full w-full relative group"
        style={{
          borderRight: pageIndex % 2 === 0 ? "4px solid #e5e7eb" : "none",
          borderLeft: pageIndex % 2 !== 0 ? "4px solid #e5e7eb" : "none",
          borderBottom: "4px solid #d1d5db",
          borderTop: "1px solid #f3f4f6",
          borderBottomRightRadius: pageIndex % 2 === 0 ? "4px" : "0",
          borderBottomLeftRadius: pageIndex % 2 !== 0 ? "4px" : "0",
        }}
      >
        <div
          className="w-full h-full relative overflow-hidden"
          style={{ background: data.background || "white" }}
        >
          {/* {pageIndex === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none"></div>
          )} */}

          <Stage
            ref={stageRef}
            width={width}
            height={height}
            onMouseDown={(e) => onMouseDown(e, pageIndex)}
            onMouseMove={(e) => onMouseMove(e, pageIndex)}
            onMouseUp={onMouseUp}
            onDblClick={(e) => onStageDoubleClick(e, pageIndex)}
            className={
              activeTool !== "Book Size" ? "cursor-crosshair" : "cursor-default"
            }
          >
            <Layer onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
              {data.lines.map((line, i) => {
                if (line.type === "custom-shape" && (line as any).draggable) {
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
                      onClick={() =>
                        isSelectMode && onTextSelect((line as any).id)
                      }
                      globalCompositeOperation={
                        line.tool === "Eraser"
                          ? "destination-out"
                          : "source-over"
                      }
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
                    globalCompositeOperation={
                      line.tool === "Eraser" ? "destination-out" : "source-over"
                    }
                  />
                );
              })}

              {(() => {
                const allElements: any[] = [
                  ...data.images.map((item) => ({
                    ...item,
                    _renderType: "image",
                  })),
                  ...data.texts.map((item) => ({
                    ...item,
                    _renderType: "text",
                  })),
                  ...data.shapes.map((item) => ({
                    ...item,
                    _renderType: "shape",
                  })),
                  ...data.tables.map((item) => ({
                    ...item,
                    _renderType: "table",
                  })),
                  ...data.stickyNotes.map((item) => ({
                    ...item,
                    _renderType: "stickyNote",
                  })),
                ];

                allElements.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

                return allElements.map((element) => {
                  if (element._renderType === "image") {
                    return (
                      <URLImage
                        key={element.id}
                        image={element}
                        isSelectMode={isSelectMode}
                        isSelected={selectedTextId === element.id}
                        onSelect={() => onTextSelect(element.id)}
                        onContextMenu={(e: any) => {
                          e.evt.preventDefault();
                          onTextSelect(element.id);
                          setContextMenu({
                            x: e.evt.clientX,
                            y: e.evt.clientY,
                          });
                        }}
                        onChange={(newAttrs: ImageType) => {
                          onImageUpdate(pageIndex, newAttrs);
                        }}
                      />
                    );
                  }

                  if (element._renderType === "shape") {
                    return (
                      <Group
                        key={element.id}
                        onContextMenu={(e: any) => {
                          e.evt.preventDefault();
                          onTextSelect(element.id);
                          setContextMenu({
                            x: e.evt.clientX,
                            y: e.evt.clientY,
                          });
                        }}
                      >
                        {renderShape(
                          element,
                          selectedTextId === element.id,
                          () => isSelectMode && onTextSelect(element.id),
                          (x, y) => {
                            onShapeUpdate(pageIndex, { ...element, x, y });
                          },
                          (node) => {
                            onShapeUpdate(pageIndex, {
                              ...element,
                              x: node.x(),
                              y: node.y(),
                              width: Math.max(5, node.width() * node.scaleX()),
                              height: Math.max(
                                5,
                                node.height() * node.scaleY(),
                              ),
                              rotation: node.rotation(),
                              scaleX: 1,
                              scaleY: 1,
                            });
                          },
                          (node) => {
                            if (node) textRefs.current[element.id] = node;
                          },
                        )}
                      </Group>
                    );
                  }

                  if (element._renderType === "stickyNote") {
                    return (
                      <StickyNote
                        key={element.id}
                        note={element}
                        isSelected={selectedTextId === element.id}
                        isSelectMode={isSelectMode}
                        onSelect={onTextSelect}
                        onDoubleClick={(note) =>
                          handleStickyNoteDoubleClick(pageIndex, note)
                        }
                        onUpdate={(updatedNote) =>
                          handleStickyNoteUpdate(pageIndex, updatedNote)
                        }
                        onDelete={(id) => handleStickyNoteDelete(pageIndex, id)}
                        onContextMenu={(e: any) => {
                          e.evt.preventDefault();
                          onTextSelect(element.id);
                          setContextMenu({
                            x: e.evt.clientX,
                            y: e.evt.clientY,
                          });
                        }}
                      />
                    );
                  }

                  if (element._renderType === "table") {
                    return (
                      <Group
                        key={element.id}
                        x={element.x}
                        y={element.y}
                        draggable={isSelectMode}
                        onClick={() => onTextSelect(element.id)}
                        onContextMenu={(e: any) => {
                          e.evt.preventDefault();
                          onTextSelect(element.id);
                          setContextMenu({
                            x: e.evt.clientX,
                            y: e.evt.clientY,
                          });
                        }}
                        onDragEnd={(e) => {
                          onTableUpdate(pageIndex, {
                            ...element,
                            x: e.target.x(),
                            y: e.target.y(),
                          });
                        }}
                      >
                        {element.data.map((row: any, rowIndex: number) =>
                          row.map((cell: any, colIndex: number) => {
                            const xPos = colIndex * element.cellWidth;
                            const yPos = rowIndex * element.cellHeight;
                            const cellWidth =
                              element.cellWidth * (cell.colSpan || 1);
                            const cellHeight =
                              element.cellHeight * (cell.rowSpan || 1);

                            return (
                              <TableCellComponent
                                key={`${rowIndex}-${colIndex}`}
                                table={element}
                                cell={cell}
                                rowIndex={rowIndex}
                                colIndex={colIndex}
                                xPos={xPos}
                                yPos={yPos}
                                cellWidth={cellWidth}
                                cellHeight={cellHeight}
                                onCellClick={(
                                  tId: string,
                                  r: number,
                                  c: number,
                                ) => handleTableCellClick(tId, r, c, pageIndex)}
                                onCellDoubleClick={(
                                  tId: string,
                                  r: number,
                                  c: number,
                                  x: number,
                                  y: number,
                                  w: number,
                                  h: number,
                                ) =>
                                  handleTableCellDoubleClick(
                                    tId,
                                    r,
                                    c,
                                    x,
                                    y,
                                    w,
                                    h,
                                    pageIndex,
                                  )
                                }
                                onCellContextMenu={(
                                  evt: MouseEvent,
                                  tId: string,
                                  r: number,
                                  c: number,
                                ) =>
                                  handleTableContextMenu(
                                    evt,
                                    tId,
                                    r,
                                    c,
                                    pageIndex,
                                  )
                                }
                              />
                            );
                          }),
                        )}
                        {Array.from({ length: element.rows + 1 }).map(
                          (_, i) => (
                            <Line
                              key={`h${i}`}
                              points={[
                                0,
                                i * element.cellHeight,
                                element.cols * element.cellWidth,
                                i * element.cellHeight,
                              ]}
                              stroke={element.borderColor}
                              strokeWidth={element.borderWidth}
                            />
                          ),
                        )}
                        {Array.from({ length: element.cols + 1 }).map(
                          (_, i) => (
                            <Line
                              key={`v${i}`}
                              points={[
                                i * element.cellWidth,
                                0,
                                i * element.cellWidth,
                                element.rows * element.cellHeight,
                              ]}
                              stroke={element.borderColor}
                              strokeWidth={element.borderWidth}
                            />
                          ),
                        )}
                      </Group>
                    );
                  }

                  if (element._renderType === "text") {
                    return (
                      <KonvaText
                        name="object"
                        key={element.id}
                        ref={(node) => {
                          if (node) textRefs.current[element.id] = node;
                        }}
                        x={element.x}
                        y={element.y}
                        text={element.text || " "}
                        fontSize={element.fontSize}
                        fontFamily={element.fontFamily || "Roboto"}
                        fontStyle={getKonvaFontStyle(element.fontStyle)}
                        textDecoration={element.textDecoration}
                        align={element.textAlign}
                        fill={element.fill}
                        width={element.width}
                        wrap="word"
                        lineHeight={element.lineHeight || 1.2}
                        letterSpacing={element.letterSpacing || 0}
                        rotation={element.rotation || 0}
                        opacity={element.opacity || 1}
                        shadowColor={element.shadowColor}
                        shadowBlur={element.shadowBlur || 0}
                        shadowOffsetX={element.shadowOffsetX || 0}
                        shadowOffsetY={element.shadowOffsetY || 0}
                        shadowOpacity={element.shadowOpacity || 1}
                        stroke={element.stroke}
                        strokeWidth={element.strokeWidth || 0}
                        draggable={isSelectMode}
                        onClick={(e) => {
                          e.cancelBubble = true;
                          onTextSelect(element.id);
                        }}
                        onDblClick={(e) =>
                          onTextDblClick(e, pageIndex, element)
                        }
                        onContextMenu={(e) => {
                          e.evt.preventDefault();
                          onTextSelect(element.id);
                          setContextMenu({
                            x: e.evt.clientX,
                            y: e.evt.clientY,
                          });
                        }}
                        onDragEnd={(e) => {
                          onTextUpdate(pageIndex, {
                            ...element,
                            x: e.target.x(),
                            y: e.target.y(),
                          });
                        }}
                        onTransformEnd={(e) => {
                          const node = e.target as Konva.Text;
                          const scaleX = node.scaleX();

                          node.scaleX(1);
                          node.scaleY(1);

                          onTextUpdate(pageIndex, {
                            ...element,
                            x: node.x(),
                            y: node.y(),
                            rotation: node.rotation(),
                            width: Math.max(30, node.width() * scaleX),
                          });
                        }}
                      />
                    );
                  }

                  return null;
                });
              })()}

              {isPenMode && penState.points.length > 0 && (
                <>
                  <Line
                    points={penState.points}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    fill={penFillOpacity > 0 ? penFillColor : undefined}
                    closed={penMode === "polygon" && snapToStart}
                    dash={[5, 5]}
                    lineCap="round"
                    lineJoin="round"
                    tension={penMode === "freehand" ? 0.5 : 0}
                    opacity={0.7}
                  />

                  {penMode === "polygon" &&
                    penState.points
                      .filter((_, i) => i % 2 === 0)
                      .map((x, i) => {
                        const y = penState.points[i * 2 + 1];
                        const isFirst = i === 0;

                        return (
                          <Group key={i}>
                            <Circle
                              x={x}
                              y={y}
                              radius={isFirst ? 8 : 6}
                              fill={isFirst ? strokeColor : "#ffffff"}
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

                  {penMode === "polygon" &&
                    penState.points.length >= 2 &&
                    mousePos && (
                      <Line
                        points={[
                          penState.points[penState.points.length - 2],
                          penState.points[penState.points.length - 1],
                          mousePos.x,
                          mousePos.y,
                        ]}
                        stroke={strokeColor}
                        strokeWidth={1}
                        dash={[5, 5]}
                        opacity={0.5}
                      />
                    )}
                </>
              )}

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
              <Transformer
                ref={transformerRef}
                boundBoxFunc={(oldBox, newBox) => {
                  if (newBox.width < 20 || newBox.height < 20) return oldBox;
                  return newBox;
                }}
                enabledAnchors={[
                  "top-left",
                  "top-center",
                  "top-right",
                  "middle-right",
                  "middle-left",
                  "bottom-left",
                  "bottom-center",
                  "bottom-right",
                ]}
              />
              {selectedTextId &&
                data.shapes.some((s) => s.id === selectedTextId) && (
                  <Transformer
                    ref={shapeTransformerRef}
                    boundBoxFunc={(oldBox, newBox) => {
                      if (newBox.width < 5 || newBox.height < 5) return oldBox;
                      return newBox;
                    }}
                    enabledAnchors={[
                      "top-left",
                      "top-right",
                      "bottom-left",
                      "bottom-right",
                    ]}
                  />
                )}
            </Layer>
          </Stage>

          {/* 3D Page Lighting Overlays */}
          <div 
            className={`pointer-events-none absolute inset-y-0 w-16 z-[100] mix-blend-multiply ${
              pageIndex % 2 === 0 
                ? 'left-0 bg-gradient-to-r from-black/25 via-black/5 to-transparent' 
                : 'right-0 bg-gradient-to-l from-black/25 via-black/5 to-transparent'
            }`} 
          />
          <div className="pointer-events-none absolute inset-0 z-[100] shadow-[inset_0_0_40px_rgba(0,0,0,0.04)]" />
          <div 
            className={`pointer-events-none absolute inset-y-0 w-[2px] z-[100] ${
              pageIndex % 2 === 0 
                ? 'right-0 bg-gradient-to-r from-transparent to-black/10' 
                : 'left-0 bg-gradient-to-l from-transparent to-black/10'
            }`} 
          />

          <span className="absolute bottom-4 right-4 text-gray-400 text-sm font-medium select-none z-[100]">
            {pageIndex + 1}
          </span>
        </div>
      </div>
    );
  },
);

BookPage.displayName = "BookPage";

// --- Main Book Component ---

const BookComponent = (
  {
    activeTool = "Tool",
    activeSubTool = "select",
    strokeColor = "#000000",
    strokeWidth = 5,
    selectedBookSize = "6 X 4",
    fontSize = 16,
    fontFamily = "Roboto",
    onAdvancedTextChange,
    drawingMode,
    zoom: externalZoom,
    onZoomChange,
    selectedShape = "rectangle",
    shapeFillColor = "#1e3a8a",
    shapeStrokeColor = "#60a5fa",
    shapeStrokeWidth = 2,
    isFillTransparent = false,
    onToolChange,
    initialData,
  }: BookProps,
  ref: any,
) => {
  const [pages, setPages] = useState<PageData[]>(initialData || INITIAL_PAGES);
  const [currentZoom, setCurrentZoom] = useState(externalZoom ?? 1);
  const bookContainerRef = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<(Konva.Stage | null)[]>([]);
  const coverSnapshotRef = useRef<string | null>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen(bookContainerRef);

  useEffect(() => {
    if (initialData) {
      setPages(initialData);
    }
  }, [initialData]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [pagesToAdd, setPagesToAdd] = useState("2");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isSpacePanning, setIsSpacePanning] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [selectedTablePageIndex, setSelectedTablePageIndex] =
    useState<number>(-1);
  const shapeTransformerRef = useRef<Konva.Transformer>(null);
  const shapeRefs = useRef<{ [key: string]: any }>({});
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

  const bookDimensions =
    BOOK_SIZE_MAP[selectedBookSize] || BOOK_SIZE_MAP["6 X 4"];
  const WIDTH = bookDimensions.width;
  const HEIGHT = bookDimensions.height;

  const isToolCategoryActive = activeTool === "Tool";
  const isSelectMode = isToolCategoryActive && activeSubTool === "select";
  const isHandMode = isToolCategoryActive && activeSubTool === "hand";
  const isPenMode = isToolCategoryActive && activeSubTool === "pen";
  const isStickyNoteMode =
    isToolCategoryActive && activeSubTool === "sticky_note";
  const isTableMode = isToolCategoryActive && activeSubTool === "table";
  const isShapesMode = activeTool === "Shapes";

  const zoom = currentZoom;

  useEffect(() => {
    if (externalZoom !== undefined) {
      setCurrentZoom(externalZoom);
    }
  }, [externalZoom]);

  // Rest of state hooks and handlers...
  const handleZoomIn = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    const newZoom = Math.min(currentZoom + 0.1, 3);
    setCurrentZoom(newZoom);
    onZoomChange?.(newZoom);
  };

  const handleZoomOut = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    const newZoom = Math.max(currentZoom - 0.1, 0.1);
    setCurrentZoom(newZoom);
    onZoomChange?.(newZoom);
  };

  const handleZoomReset = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    const newZoom = 1;
    setCurrentZoom(newZoom);
    onZoomChange?.(newZoom);
    setPanPosition({ x: 0, y: 0 });
    setBookRotation({ x: 0, y: 0 });
  };

  const [editingTextItem, setEditingTextItem] = useState<TextType | null>(null);
  const [editingStickyNote, setEditingStickyNote] =
    useState<StickyNoteType | null>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPos, setToolbarPos] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [clipboard, setClipboard] = useState<any[]>([]);

  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [bookRotation, setBookRotation] = useState({ x: 0, y: 0 });
  const [is3DDragging, setIs3DDragging] = useState(false);
  const [drag3DStart, setDrag3DStart] = useState({ x: 0, y: 0, rotX: 0, rotY: 0 });
  const [penDrawingState, setPenDrawingState] = useState<{
    [pageIndex: number]: {
      points: number[];
      isDrawing: boolean;
      mode: "polygon" | "freehand";
    };
  }>({});
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [snapToStart, setSnapToStart] = useState(false);
  const [penMode, setPenMode] = useState<"polygon" | "freehand">("polygon");
  const [penFillColor, setPenFillColor] = useState("rgba(255, 255, 255, 0)");
  const [penFillOpacity, setPenFillOpacity] = useState(0);
  const [penSnapDistance, setPenSnapDistance] = useState(20);
  const activeDrawingPage = useRef<number | null>(null);

  const bookRef = useRef<any>(null);
  const isDrawing = useRef(false);
  const { addToHistory, undo, redo, canUndo, canRedo } = useBookHistory();

  const saveCurrentPageState = useCallback(() => {
    addToHistory(pages);
  }, [addToHistory, pages]);

  const handleUndo = useCallback(() => {
    const previousPages = undo(pages);
    if (previousPages) {
      setPages(previousPages);
      setSelectedIds([]);
    }
  }, [undo, pages]);

  const handleRedo = useCallback(() => {
    const nextPages = redo(pages);
    if (nextPages) {
      setPages(nextPages);
      setSelectedIds([]);
    }
  }, [redo, pages]);

  const selectedTextId = selectedIds.length === 1 ? selectedIds[0] : null;
  const selectedShapeId = selectedIds.length === 1 ? selectedIds[0] : null;

  const handleObjectSelect = useCallback(
    (id: string, e?: any) => {
      if (!isSelectMode && activeTool !== "Text") return;

      const isCtrlPressed = e?.evt?.ctrlKey || e?.evt?.metaKey;

      setSelectedIds((prev) => {
        if (isCtrlPressed) {
          return prev.includes(id)
            ? prev.filter((item) => item !== id)
            : [...prev, id];
        }
        return prev.includes(id) ? prev : [id];
      });

      const isText = pages[currentPageIndex].texts.some((t) => t.id === id);
      if (!isCtrlPressed && isText) {
        const textItem = pages[currentPageIndex].texts.find((t) => t.id === id);
        if (textItem) {
          setToolbarPos({ x: textItem.x, y: textItem.y });
          setShowToolbar(true);
        }
      } else {
        setShowToolbar(false);
      }
    },
    [isSelectMode, activeTool, pages, currentPageIndex],
  );

  const handleDeleteSelected = useCallback(() => {
    if (selectedIds.length === 0) return;

    saveCurrentPageState();

    const page = pages[currentPageIndex];

    const newTexts = page.texts.filter((t) => !selectedIds.includes(t.id));
    const newShapes = page.shapes.filter((s) => !selectedIds.includes(s.id));
    const newImages = page.images.filter((i) => !selectedIds.includes(i.id));
    const newStickyNotes = page.stickyNotes.filter(
      (n) => !selectedIds.includes(n.id),
    );
    const newTables = page.tables.filter((t) => !selectedIds.includes(t.id));

    const newPageData = {
      ...page,
      texts: newTexts,
      shapes: newShapes,
      images: newImages,
      stickyNotes: newStickyNotes,
      tables: newTables,
    };

    setPages((prev) =>
      prev.map((p, i) => (i === currentPageIndex ? newPageData : p)),
    );
    setSelectedIds([]);
    setShowToolbar(false);
  }, [selectedIds, currentPageIndex, pages, saveCurrentPageState]);

  const handleCopy = useCallback(() => {
    if (selectedIds.length === 0) return;
    const page = pages[currentPageIndex];

    const selectedItems = [
      ...page.texts
        .filter((t) => selectedIds.includes(t.id))
        .map((i) => ({ ...i, _type: "text" })),
      ...page.shapes
        .filter((s) => selectedIds.includes(s.id))
        .map((i) => ({ ...i, _type: "shape" })),
      ...page.images
        .filter((i) => selectedIds.includes(i.id))
        .map((i) => ({ ...i, _type: "image" })),
      ...page.tables
        .filter((t) => selectedIds.includes(t.id))
        .map((i) => ({ ...i, _type: "table" })),
    ];

    if (selectedItems.length > 0) {
      setClipboard(selectedItems);
    }
    setContextMenu(null);
  }, [selectedIds, currentPageIndex, pages]);

  const handleCut = useCallback(() => {
    handleCopy();
    handleDeleteSelected();
  }, [handleCopy, handleDeleteSelected]);

  const handlePaste = useCallback(() => {
    if (!clipboard || clipboard.length === 0) return;

    saveCurrentPageState();

    const newItems = clipboard.map((item) => ({
      ...item,
      id: Date.now().toString() + Math.random(),
      x: item.x + 20,
      y: item.y + 20,
    }));

    const page = pages[currentPageIndex];
    const updatedPage = { ...page };

    newItems.forEach((item: any) => {
      if (item._type === "text")
        updatedPage.texts = [...updatedPage.texts, item];
      if (item._type === "shape")
        updatedPage.shapes = [...updatedPage.shapes, item];
      if (item._type === "image")
        updatedPage.images = [...updatedPage.images, item];
      if (item._type === "table")
        updatedPage.tables = [...updatedPage.tables, item];
    });

    setPages((prev) =>
      prev.map((p, i) => (i === currentPageIndex ? updatedPage : p)),
    );
    setSelectedIds(newItems.map((i) => i.id));
    setContextMenu(null);
  }, [clipboard, currentPageIndex, pages, saveCurrentPageState]);

  const handleImageUpdate = useCallback(
    (pageIndex: number, newImageAttrs: ImageType) => {
      setPages((prev) => {
        const newPages = [...prev];
        const page = newPages[pageIndex];
        const index = page.images.findIndex(
          (img) => img.id === newImageAttrs.id,
        );
        if (index !== -1) {
          const newImages = [...page.images];
          newImages[index] = newImageAttrs;
          newPages[pageIndex] = { ...page, images: newImages };
        }
        return newPages;
      });
    },
    [],
  );

  const handleShapeUpdate = useCallback(
    (pageIndex: number, newShapeAttrs: ShapeType) => {
      setPages((prev) => {
        const newPages = [...prev];
        const page = newPages[pageIndex];
        const index = page.shapes.findIndex((s) => s.id === newShapeAttrs.id);
        if (index !== -1) {
          const newShapes = [...page.shapes];
          newShapes[index] = newShapeAttrs;
          newPages[pageIndex] = { ...page, shapes: newShapes };
        }
        return newPages;
      });
    },
    [],
  );

  const handleTableUpdate = useCallback(
    (pageIndex: number, newTableAttrs: TableType) => {
      setPages((prev) => {
        const newPages = [...prev];
        const page = newPages[pageIndex];
        const index = page.tables.findIndex((t) => t.id === newTableAttrs.id);
        if (index !== -1) {
          const newTables = [...page.tables];
          newTables[index] = newTableAttrs;
          newPages[pageIndex] = { ...page, tables: newTables };
        }
        return newPages;
      });
    },
    [],
  );

  const handleDirectTextUpdate = useCallback(
    (pageIndex: number, newTextAttrs: TextType) => {
      setPages((prev) => {
        const newPages = [...prev];
        const page = newPages[pageIndex];
        const index = page.texts.findIndex((t) => t.id === newTextAttrs.id);
        if (index !== -1) {
          const newTexts = [...page.texts];
          newTexts[index] = newTextAttrs;
          newPages[pageIndex] = { ...page, texts: newTexts };
        }
        return newPages;
      });
    },
    [],
  );

  const handleLayerAction = useCallback(
    (action: "front" | "back" | "forward" | "backward") => {
      if (selectedIds.length === 0) return;
      const idToMove = selectedIds[0];

      setPages((prevPages) => {
        const newPages = [...prevPages];

        let targetPageIndex = -1;
        const pagesToCheck = [currentPageIndex];
        if (currentPageIndex + 1 < newPages.length) {
          pagesToCheck.push(currentPageIndex + 1);
        }

        for (const idx of pagesToCheck) {
          const p = newPages[idx];
          const exists = [
            ...(p.texts || []),
            ...(p.images || []),
            ...(p.shapes || []),
            ...(p.tables || []),
            ...(p.stickyNotes || []),
          ].some((item: any) => item.id === idToMove);

          if (exists) {
            targetPageIndex = idx;
            break;
          }
        }

        if (targetPageIndex === -1) return prevPages;

        const page = { ...newPages[targetPageIndex] };

        const updateItemZIndex = (list: any[], listName: string) => {
          const idx = list.findIndex((item) => item.id === idToMove);
          if (idx === -1) return false;

          const item = { ...list[idx] };
          const currentZ = item.zIndex || 0;

          let newZ = currentZ;
          const maxZ = getMaxZIndex(page);
          const minZ = getMinZIndex(page);

          if (action === "front") newZ = maxZ + 1;
          if (action === "back") newZ = minZ - 1;
          if (action === "forward") newZ = currentZ + 1;
          if (action === "backward") newZ = currentZ - 1;

          item.zIndex = newZ;
          const newList = [...list];
          newList[idx] = item;

          (page as any)[listName] = newList;
          return true;
        };

        if (!updateItemZIndex(page.texts || [], "texts")) {
          if (!updateItemZIndex(page.images || [], "images")) {
            if (!updateItemZIndex(page.shapes || [], "shapes")) {
              if (!updateItemZIndex(page.tables || [], "tables")) {
                updateItemZIndex(page.stickyNotes || [], "stickyNotes");
              }
            }
          }
        }

        newPages[targetPageIndex] = page;
        return newPages;
      });

      saveCurrentPageState();
    },
    [selectedIds, currentPageIndex, saveCurrentPageState],
  );

  const handlePageChange = useCallback(
    (pageNumber: number) => {
      if (!bookRef.current) return;
      const pageFlip = bookRef.current.pageFlip();
      if (!pageFlip) return;

      const targetIndex = Math.max(
        0,
        Math.min(pageNumber - 1, pages.length - 1),
      );
      pageFlip.flip(targetIndex);
    },
    [pages.length],
  );

  useImperativeHandle(ref, () => ({
    undo: handleUndo,
    redo: handleRedo,
    canUndo,
    canRedo,
    updatePageData,
    handleImageUpload: (
      file: File,
      targetPage?: "left" | "right" | "current",
    ) => handleImageUpload(file, targetPage),
    currentPageIndex,
    getPageData: () => pages,
    getCoverImage: async () => {
      const coverElement = document.querySelector('[data-page-index="0"]') as HTMLElement;
      
      if (coverElement) {
        try {
          const url = await htmlToImage.toPng(coverElement, { 
            pixelRatio: 2,
            skipFonts: true,
            cacheBust: true
          });
          coverSnapshotRef.current = url;
          return url;
        } catch (error) {
          console.warn("Live html-to-image snapshot failed, falling back to cache.", error);
        }
      }
      
      return coverSnapshotRef.current;
    },
    
    getSelectedTableProperties: () => {
      const targetPageIndex =
        selectedTablePageIndex !== -1
          ? selectedTablePageIndex
          : currentPageIndex;
      if (!selectedTableId || !pages[targetPageIndex]) return null;
      const table = pages[targetPageIndex].tables.find(
        (t) => t.id === selectedTableId,
      );
      if (!table) return null;
      return {
        rows: table.rows,
        cols: table.cols,
        borderColor: table.borderColor,
        fillColor: table.fillColor,
        borderWidth: table.borderWidth,
      };
    },
    getSelectedTableId: () => selectedTableId,
    handlePenOptionChange: (property: string, value: any) => {
      if (property === "mode") setPenMode(value);
      if (property === "fillColor") setPenFillColor(value);
      if (property === "fillOpacity") setPenFillOpacity(value);
      if (property === "snapDistance") setPenSnapDistance(value);
    },
    handleTableChange: (property: string, value: any) => {
      const targetPageIndex =
        selectedTablePageIndex !== -1
          ? selectedTablePageIndex
          : currentPageIndex;
      if (!selectedTableId || !pages[targetPageIndex]) return;

      const updatedPages = [...pages];
      const page = updatedPages[targetPageIndex];
      const tableIndex = page.tables.findIndex((t) => t.id === selectedTableId);

      if (tableIndex === -1) return;

      const table = page.tables[tableIndex];
      let updatedTable = { ...table };

      switch (property) {
        case "rows":
          updatedTable = handleTableRows(updatedTable, value);
          break;
        case "cols":
          updatedTable = handleTableCols(updatedTable, value);
          break;
        case "borderColor":
          updatedTable.borderColor = value;
          break;
        case "borderWidth":
          updatedTable.borderWidth = value;
          break;
        case "fill":
          updatedTable.fillColor = value;
          break;
        case "insertRow":
          handleTableInsertRow(selectedTableId, value);
          return;
        case "insertColumn":
          handleTableInsertColumn(selectedTableId, value);
          return;
        case "deleteRow":
          handleTableDeleteRow(selectedTableId);
          return;
        case "deleteColumn":
          handleTableDeleteColumn(selectedTableId);
          return;
        case "mergeCells":
          handleTableMergeCells(selectedTableId);
          return;
        case "reset":
          updatedTable = createDefaultTable(table.x, table.y);
          break;
      }

      page.tables[tableIndex] = updatedTable;
      setPages(updatedPages);
    },
  }));

  const createEmptyCell = (): TableCell => ({
    id: Date.now().toString() + Math.random(),
    content: "",
    fontSize: 12,
    fontFamily: "Roboto",
    fill: "#000000",
    bold: false,
    italic: false,
    underline: false,
    alignment: "left",
    verticalAlign: "middle",
    backgroundColor: "#ffffff",
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
      type: "table",
      x,
      y,
      rows,
      cols,
      cellWidth: 80,
      cellHeight: 40,
      borderWidth: 1,
      borderColor: "#000000",
      fillColor: "#ffffff",
      data,
      selectedCell: null,
    };
  };

  const handleTableRows = (
    table: TableType,
    newRowCount: number,
  ): TableType => {
    const currentRows = table.rows;
    const diff = newRowCount - currentRows;

    if (diff > 0) {
      const newRows = Array(diff)
        .fill(null)
        .map(() =>
          Array(table.cols)
            .fill(null)
            .map(() => createEmptyCell()),
        );
      return {
        ...table,
        rows: newRowCount,
        data: [...table.data, ...newRows],
      };
    } else if (diff < 0) {
      return {
        ...table,
        rows: newRowCount,
        data: table.data.slice(0, newRowCount),
      };
    }
    return table;
  };

  const handleTableCols = (
    table: TableType,
    newColCount: number,
  ): TableType => {
    const currentCols = table.cols;
    const diff = newColCount - currentCols;

    if (diff > 0) {
      const newData = table.data.map((row) => [
        ...row,
        ...Array(diff)
          .fill(null)
          .map(() => createEmptyCell()),
      ]);
      return {
        ...table,
        cols: newColCount,
        data: newData,
      };
    } else if (diff < 0) {
      const newData = table.data.map((row) => row.slice(0, newColCount));
      return {
        ...table,
        cols: newColCount,
        data: newData,
      };
    }
    return table;
  };

  const handleTableCellClick = useCallback(
    (tableId: string, row: number, col: number, pageIndex: number) => {
      setSelectedTableId(tableId);
      setSelectedTablePageIndex(pageIndex);
      setSelectedIds([]);

      setPages((prevPages) => {
        const updatedPages = [...prevPages];
        const page = updatedPages[pageIndex];
        const tableIndex = page.tables.findIndex((t) => t.id === tableId);

        if (tableIndex !== -1) {
          page.tables.forEach((t, idx) => {
            if (idx === tableIndex) {
              page.tables[idx] = {
                ...t,
                selectedCell: { row, col },
              };
            } else {
              page.tables[idx] = {
                ...t,
                selectedCell: null,
              };
            }
          });
          return updatedPages;
        }
        return prevPages;
      });
    },
    [],
  );

  const handleTableCellDoubleClick = (
    tableId: string,
    row: number,
    col: number,
    x: number,
    y: number,
    width: number,
    height: number,
    pageIndex: number,
  ) => {
    const page = pages[pageIndex];
    const table = page.tables.find((t) => t.id === tableId);

    if (!table) return;

    const cell = table.data[row]?.[col];
    if (!cell || cell.content === null) return;

    setTimeout(() => {
      const adjustedX = table.x + x + 5; 
      const adjustedY = table.y + y + 5; 
      const adjustedWidth = width - 10; 
      const adjustedHeight = height - 10; 

      setEditingTableCell({
        tableId,
        row,
        col,
        x: adjustedX,
        y: adjustedY,
        width: adjustedWidth,
        height: adjustedHeight,
      });
    }, 50);
  };

  const handleTableContextMenu = (
    evt: MouseEvent,
    tableId: string,
    row: number,
    col: number,
    pageIndex: number,
  ) => {
    evt.preventDefault();
    setSelectedTableId(tableId);
    setSelectedTablePageIndex(pageIndex);

    setPages((prevPages) => {
      const updatedPages = [...prevPages];
      const page = updatedPages[pageIndex];
      const tableIndex = page.tables.findIndex((t) => t.id === tableId);

      if (tableIndex !== -1) {
        page.tables[tableIndex] = {
          ...page.tables[tableIndex],
          selectedCell: { row, col },
        };
      }
      return updatedPages;
    });

    setTableContextMenu({
      x: evt.clientX,
      y: evt.clientY,
      tableId,
      row,
      col,
    });
  };

  const handleTableCellSave = (content: string) => {
    if (!editingTableCell) return;

    const { tableId, row, col } = editingTableCell;
    const targetPageIndex =
      selectedTablePageIndex !== -1 ? selectedTablePageIndex : currentPageIndex;
    const updatedPages = [...pages];
    const page = updatedPages[targetPageIndex];
    const tableIndex = page.tables.findIndex((t) => t.id === tableId);

    if (tableIndex !== -1) {
      const table = page.tables[tableIndex];
      const newData = [...table.data];

      if (newData[row] && newData[row][col]) {
        newData[row][col] = {
          ...newData[row][col],
          content: content,
        };

        page.tables[tableIndex] = {
          ...table,
          data: newData,
        };

        setPages(updatedPages);
      }
    }

    setEditingTableCell(null);
  };

  const handleTableInsertRow = useCallback(
    (tableId: string, position: "above" | "below") => {
      const targetPageIndex =
        selectedTablePageIndex !== -1
          ? selectedTablePageIndex
          : currentPageIndex;
      setPages((prevPages) => {
        const updatedPages = [...prevPages];
        const page = updatedPages[targetPageIndex];
        const tableIndex = page.tables.findIndex((t) => t.id === tableId);

        if (tableIndex === -1) return prevPages;

        const table = page.tables[tableIndex];
        const selectedRow = table.selectedCell?.row || 0;
        const insertIndex =
          position === "above" ? selectedRow : selectedRow + 1;

        const newRow = Array(table.cols)
          .fill(null)
          .map((_, colIndex) => ({
            ...createEmptyCell(),
            id: `${Date.now()}-${insertIndex}-${colIndex}`,
          }));

        const newData = [
          ...table.data.slice(0, insertIndex),
          newRow,
          ...table.data.slice(insertIndex),
        ];

        let newSelectedCell = table.selectedCell;
        if (position === "below" && newSelectedCell) {
          newSelectedCell = {
            ...newSelectedCell,
            row: newSelectedCell.row + 1,
          };
        }

        page.tables[tableIndex] = {
          ...table,
          rows: table.rows + 1,
          data: newData,
          selectedCell: newSelectedCell,
        };

        return updatedPages;
      });
    },
    [selectedTablePageIndex, currentPageIndex],
  );

  const handleTableInsertColumn = useCallback(
    (tableId: string, position: "left" | "right") => {
      const targetPageIndex =
        selectedTablePageIndex !== -1
          ? selectedTablePageIndex
          : currentPageIndex;
      setPages((prevPages) => {
        const updatedPages = [...prevPages];
        const page = updatedPages[targetPageIndex];
        const tableIndex = page.tables.findIndex((t) => t.id === tableId);

        if (tableIndex === -1) return prevPages;

        const table = page.tables[tableIndex];
        const selectedCol = table.selectedCell?.col || 0;
        const insertIndex = position === "left" ? selectedCol : selectedCol + 1;

        const newData = table.data.map((row) => {
          const newRow = [...row];
          newRow.splice(insertIndex, 0, createEmptyCell());
          return newRow;
        });

        page.tables[tableIndex] = {
          ...table,
          cols: table.cols + 1,
          data: newData,
        };

        return updatedPages;
      });
    },
    [selectedTablePageIndex, currentPageIndex],
  );

  const handleTableDeleteRow = useCallback(
    (tableId: string) => {
      const targetPageIndex =
        selectedTablePageIndex !== -1
          ? selectedTablePageIndex
          : currentPageIndex;
      setPages((prevPages) => {
        const updatedPages = [...prevPages];
        const page = updatedPages[targetPageIndex];
        const tableIndex = page.tables.findIndex((t) => t.id === tableId);

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
          selectedCell: null,
        };

        return updatedPages;
      });
    },
    [selectedTablePageIndex, currentPageIndex],
  );

  const handleTableDeleteColumn = useCallback(
    (tableId: string) => {
      const targetPageIndex =
        selectedTablePageIndex !== -1
          ? selectedTablePageIndex
          : currentPageIndex;
      setPages((prevPages) => {
        const updatedPages = [...prevPages];
        const page = updatedPages[targetPageIndex];
        const tableIndex = page.tables.findIndex((t) => t.id === tableId);

        if (tableIndex === -1) return prevPages;

        const table = page.tables[tableIndex];
        if (table.cols <= 1) return prevPages;

        const selectedCol = table.selectedCell?.col || 0;
        const newData = table.data.map((row) => {
          const newRow = [...row];
          newRow.splice(selectedCol, 1);
          return newRow;
        });

        page.tables[tableIndex] = {
          ...table,
          cols: table.cols - 1,
          data: newData,
          selectedCell: null,
        };

        return updatedPages;
      });
    },
    [selectedTablePageIndex, currentPageIndex],
  );

  const handleTableMergeCells = (tableId: string) => {
    const targetPageIndex =
      selectedTablePageIndex !== -1 ? selectedTablePageIndex : currentPageIndex;
    const updatedPages = [...pages];
    const page = updatedPages[targetPageIndex];
    const tableIndex = page.tables.findIndex((t) => t.id === tableId);

    if (tableIndex === -1) return;

    const table = page.tables[tableIndex];
    const selectedCell = table.selectedCell;

    if (!selectedCell) return;

    const { row, col } = selectedCell;
    const newData = table.data.map((r) => r.map((c) => ({ ...c })));
    const mainCell = { ...newData[row][col] };

    mainCell.rowSpan = (mainCell.rowSpan || 1) + 1;
    mainCell.colSpan = (mainCell.colSpan || 1) + 1;

    for (let i = row; i < Math.min(row + 2, table.rows); i++) {
      for (let j = col; j < Math.min(col + 2, table.cols); j++) {
        if (i === row && j === col) continue;
        newData[i][j] = { ...createEmptyCell(), content: "" };
      }
    }

    newData[row][col] = mainCell;

    page.tables[tableIndex] = {
      ...table,
      data: newData,
    };

    setPages(updatedPages);
  };

  const getCurrentPenState = (pageIndex: number) => {
    return (
      penDrawingState[pageIndex] || {
        points: [],
        isDrawing: false,
        mode: penMode,
      }
    );
  };

  useEffect(() => {
    if (
      activeDrawingPage.current !== null &&
      activeDrawingPage.current !== currentPageIndex
    ) {
      setMousePos(null);
      setSnapToStart(false);
    }
    activeDrawingPage.current = currentPageIndex;
  }, [currentPageIndex]);

  const updatePageData = useCallback(
    (pageIndex: number, key: keyof PageData, data: any) => {
      setPages((prev) => {
        const newPages = [...prev];
        newPages[pageIndex] = { ...newPages[pageIndex], [key]: data };
        return newPages;
      });
    },
    [],
  );

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (strokeColor && activeTool === "Color") {
      timeoutId = setTimeout(() => {
        updatePageData(currentPageIndex, "background", strokeColor);
      }, 50);
    }
    return () => clearTimeout(timeoutId);
  }, [strokeColor, currentPageIndex, updatePageData, activeTool]);

  useEffect(() => {
    if (onAdvancedTextChange && selectedTextId) {
      const handleAdvancedChange = (property: string, value: any) => {
        if (property === "importText") {
          const newText: TextType = {
            id: Date.now().toString(),
            x: 50,
            y: 50,
            text: value,
            fontSize: fontSize,
            fontFamily: fontFamily,
            fill: strokeColor,
            fontStyle: "normal",
            textDecoration: "none",
            textAlign: "left",
            width: WIDTH - 100,
            opacity: 1,
          };

          saveCurrentPageState();
          const newTexts = [...pages[currentPageIndex].texts, newText];
          updatePageData(currentPageIndex, "texts", newTexts);
          setSelectedIds([newText.id]);
          return;
        }

        const textItem = pages[currentPageIndex]?.texts.find(
          (t) => t.id === selectedTextId,
        );
        if (!textItem) return;

        let updatedText = { ...textItem };

        if (property === "textTransform") {
          let newText = textItem.text;
          if (value === "uppercase") newText = newText.toUpperCase();
          else if (value === "lowercase") newText = newText.toLowerCase();
          else if (value === "capitalize")
            newText = newText
              .toLowerCase()
              .replace(/\b\w/g, (l) => l.toUpperCase());
          updatedText = { ...updatedText, text: newText, textTransform: value };
        } else if (property === "listType") {
          const lines = textItem.text.split("\n");
          const newLines = lines.map((line, index) => {
            let cleanLine = line
              .replace(/^[•\-*]\s+/, "")
              .replace(/^\d+\.\s+/, "");
            if (value === "bullet") return `• ${cleanLine}`;
            if (value === "number") return `${index + 1}. ${cleanLine}`;
            return cleanLine;
          });
          updatedText = {
            ...updatedText,
            text: newLines.join("\n"),
            listType: value,
          };
        } else {
          (updatedText as any)[property] = value;
        }

        handleTextUpdate(updatedText);
      };

      (window as any).__handleAdvancedTextChange = handleAdvancedChange;
    }
  }, [
    selectedTextId,
    currentPageIndex,
    pages,
    onAdvancedTextChange,
    fontSize,
    fontFamily,
    strokeColor,
    WIDTH,
    saveCurrentPageState,
    updatePageData,
  ]);

  const handleContainerMouseDown = (e: React.MouseEvent) => {
    if (e.button === 2) {
      setIs3DDragging(true);
      setDrag3DStart({
        x: e.clientX,
        y: e.clientY,
        rotX: bookRotation.x,
        rotY: bookRotation.y,
      });
      return;
    }

    if (isHandMode && e.button === 0) {
      setIsPanning(true);
      setDragStart({
        x: e.clientX - panPosition.x,
        y: e.clientY - panPosition.y,
      });
    }
  };

  const handleContainerMouseMove = (e: React.MouseEvent) => {
    if (is3DDragging) {
      const deltaX = e.clientX - drag3DStart.x;
      const deltaY = e.clientY - drag3DStart.y;
      
      setBookRotation({
        x: Math.max(-60, Math.min(60, drag3DStart.rotX - deltaY * 0.5)),
        y: Math.max(-60, Math.min(60, drag3DStart.rotY + deltaX * 0.5)),
      });
      return;
    }

    if (isPanning && isHandMode) {
      setPanPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleContainerMouseUp = (e?: React.MouseEvent) => {
    if (e && e.button === 2) {
      setIs3DDragging(false);
    } else {
      setIsPanning(false);
    }
  };

  const handlePageDrop = (
    e: React.DragEvent<HTMLDivElement>,
    pageIndex: number,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const imageUrl = e.dataTransfer.getData("image");

    if (!imageUrl) return;

    saveCurrentPageState();

    const minZ = getMinZIndex(pages[pageIndex]);

    const newImage: ImageType = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type: "image",
      x: 0,
      y: 0,
      width: WIDTH,
      height: HEIGHT,
      rotation: 0,
      src: imageUrl,
      zIndex: minZ - 1,
    };

    const currentImages = pages[pageIndex].images || [];
    updatePageData(pageIndex, "images", [...currentImages, newImage]);
  };

  const handleImageUpload = (
    file: File,
    targetPage?: "left" | "right" | "current",
  ) => {
    const reader = new FileReader();
    reader.onload = () => {
      let targetPageIndex = currentPageIndex;

      const isSpread = currentPageIndex !== 0 && currentPageIndex % 2 !== 0;

      if (isSpread) {
        if (targetPage === "right") {
          targetPageIndex = currentPageIndex + 1;
        } else if (targetPage === "left") {
          targetPageIndex = currentPageIndex;
        }
      }

      if (targetPageIndex >= pages.length) targetPageIndex = pages.length - 1;
      if (targetPageIndex < 0) targetPageIndex = currentPageIndex;

      saveCurrentPageState();

      const minZ = getMinZIndex(pages[targetPageIndex]);

      const newImage: ImageType = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type: "image",
        x: WIDTH * 0.1,
        y: HEIGHT * 0.1,
        width: WIDTH * 0.3,
        height: HEIGHT * 0.3,
        rotation: 0,
        src: reader.result as string,
        zIndex: minZ - 1,
      };

      const currentImages = pages[targetPageIndex].images || [];
      updatePageData(targetPageIndex, "images", [...currentImages, newImage]);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!isPenMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeDrawingPage.current === null) return;
      const penState = getCurrentPenState(activeDrawingPage.current);

      switch (e.key) {
        case "Escape":
          setPenDrawingState((prev) => ({
            ...prev,
            [activeDrawingPage.current!]: {
              points: [],
              isDrawing: false,
              mode: penMode,
            },
          }));
          activeDrawingPage.current = null;
          break;
        case "Enter":
          if (penMode === "polygon" && penState.points.length >= 6) {
            completePenShape(activeDrawingPage.current, penState.points, true);
          }
          break;
        case "Backspace":
        case "Delete":
          e.preventDefault();
          if (penMode === "polygon" && penState.points.length >= 2) {
            const newPoints = penState.points.slice(0, -2);
            setPenDrawingState((prev) => ({
              ...prev,
              [activeDrawingPage.current!]: {
                ...prev[activeDrawingPage.current!],
                points: newPoints,
              },
            }));
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPenMode, penMode, penDrawingState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat && e.target === document.body) {
        e.preventDefault();
        setIsSpacePanning(true);
      }

      if (e.key === "Escape") {
        if (selectedIds.length > 0) {
          setSelectedIds([]);
          setShowToolbar(false);
        } else if (
          (activeTool !== "Tool" || activeSubTool !== "select") &&
          onToolChange
        ) {
          onToolChange("Tool", "select");
        }
      }

      if (editingTextItem || editingStickyNote || editingTableCell) return;

      if (e.ctrlKey || e.metaKey) {
        if (e.key.toLowerCase() === "z") {
          e.preventDefault();
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
        } else if (e.key.toLowerCase() === "y") {
          e.preventDefault();
          handleRedo();
        } else if (e.key.toLowerCase() === "c") {
          e.preventDefault();
          handleCopy();
        } else if (e.key.toLowerCase() === "x") {
          e.preventDefault();
          handleCut();
        } else if (e.key.toLowerCase() === "v") {
          e.preventDefault();
          handlePaste();
        }
      }

      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedIds.length > 0
      ) {
        if (!editingTextItem && !editingStickyNote && !editingTableCell) {
          e.preventDefault();
          handleDeleteSelected();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpacePanning(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    selectedIds,
    currentPageIndex,
    pages,
    activeTool,
    activeSubTool,
    onToolChange,
    editingTextItem,
    editingStickyNote,
    editingTableCell,
    handleCopy,
    handleCut,
    handlePaste,
    handleDeleteSelected,
    handleUndo,
    handleRedo,
    updatePageData,
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F11" || (e.ctrlKey && e.key === "f")) {
        e.preventDefault();
        toggleFullscreen();
      }

      if (e.ctrlKey && (e.key === "+" || e.key === "=")) {
        e.preventDefault();
        handleZoomIn();
      }
      if (e.ctrlKey && e.key === "-") {
        e.preventDefault();
        handleZoomOut();
      }
      if (e.ctrlKey && e.key === "0") {
        e.preventDefault();
        handleZoomReset();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    zoom,
    onZoomChange,
    toggleFullscreen,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
  ]);

  const handleStickyNoteUpdate = (
    pageIndex: number,
    updatedNote: StickyNoteType,
  ) => {
    setPages((prev) => {
      const newPages = [...prev];
      const page = newPages[pageIndex];
      page.stickyNotes = page.stickyNotes.map((note) =>
        note.id === updatedNote.id ? updatedNote : note,
      );
      return newPages;
    });
  };

  const handleStickyNoteDelete = (pageIndex: number, noteId: string) => {
    setPages((prev) => {
      const newPages = [...prev];
      newPages[pageIndex].stickyNotes = newPages[pageIndex].stickyNotes.filter(
        (note) => note.id !== noteId,
      );
      return newPages;
    });
    setSelectedIds([]);
  };

  const handleStickyNoteDoubleClick = (
    pageIndex: number,
    note: StickyNoteType,
  ) => {
    setCurrentPageIndex(pageIndex);
    setSelectedIds([note.id]);
    setEditingStickyNote(note);
  };

  useEffect(() => {
    if (selectedShapeId && shapeTransformerRef.current && isSelectMode) {
      const node = shapeRefs.current[selectedShapeId];
      if (node) {
        shapeTransformerRef.current.nodes([node]);
        shapeTransformerRef.current.getLayer()?.batchDraw();
      }
    } else if (shapeTransformerRef.current) {
      shapeTransformerRef.current.nodes([]);
      shapeTransformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedShapeId, isSelectMode]);

  const isDrawingMode = ["Brush", "Eraser"].includes(activeTool);

  const createShapeAtPosition = (
    shapeType: string,
    pos: { x: number; y: number },
  ): ShapeType => {
    const baseShape = {
      id: Date.now().toString(),
      x: pos.x,
      y: pos.y,
      width: 100,
      height: 100,
      rotation: 0,
      fill: isFillTransparent ? "transparent" : shapeFillColor,
      stroke: shapeStrokeColor,
      strokeWidth: shapeStrokeWidth,
      opacity: 1,
      draggable: true,
      scaleX: 1,
      scaleY: 1,
    };

    switch (shapeType) {
      case "rectangle":
      case "square":
        return {
          ...baseShape,
          type: "rectangle",
          cornerRadius: 0,
        } as ShapeType;
      case "ellipse":
      case "circle":
        return { ...baseShape, type: "circle", radius: 50 } as ShapeType;
      case "triangle":
        return { ...baseShape, type: "triangle" } as ShapeType;
      case "line":
        return {
          ...baseShape,
          type: "line",
          points: [0, 0, 100, 0],
          width: 100,
          height: 2,
        } as ShapeType;
      case "arrow":
        return {
          ...baseShape,
          type: "arrow",
          points: [0, 0, 100, 0],
          pointerLength: 15,
          pointerWidth: 10,
          width: 100,
          height: 20,
        } as ShapeType;
      case "star":
        return {
          ...baseShape,
          type: "star",
          numPoints: 5,
          innerRadius: 30,
          outerRadius: 50,
          width: 100,
          height: 100,
        } as ShapeType;
      default:
        return { ...baseShape, type: "rectangle" } as ShapeType;
    }
  };

  const completePenShape = (
    pageIndex: number,
    points: number[],
    closed: boolean,
  ) => {
    const fillMatch = penFillColor.match(
      /rgba\((\d+),\s*(\d+),\s*(\d+),\s*([0-9.]+)\)/,
    );
    const fillOpacity = fillMatch ? parseFloat(fillMatch[4]) : 0;

    const newShape = {
      id: Date.now().toString(),
      type: "custom-shape",
      points: points,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      fill: fillOpacity > 0 ? penFillColor : undefined,
      closed: closed,
      tool: "pen",
      color: strokeColor,
      width: strokeWidth,
      draggable: true,
      tension: penMode === "freehand" ? 0.5 : 0,
    };

    updatePageData(pageIndex, "lines", [...pages[pageIndex].lines, newShape]);
    setPenDrawingState((prev) => ({
      ...prev,
      [pageIndex]: { points: [], isDrawing: false, mode: penMode },
    }));
    setMousePos(null);
    setSnapToStart(false);
    activeDrawingPage.current = null;
  };

  const handleStageDoubleClick = (
    e: Konva.KonvaEventObject<MouseEvent>,
    pageIndex: number,
  ) => {
    if (!isPenMode) return;
    const penState = getCurrentPenState(pageIndex);
    if (penState.points.length >= 6) {
      e.cancelBubble = true;
      completePenShape(pageIndex, penState.points, penMode === "polygon");
    }
  };

  const handleMouseDown = (
    e: Konva.KonvaEventObject<MouseEvent>,
    pageIndex: number,
  ) => {
    const clickedOnEmpty = e.target === e.target.getStage();

    if (clickedOnEmpty && activeTool === "Text") {
      if (editingTextItem) return;

      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) return;

      saveCurrentPageState();

      const newText: TextType = {
        id: Date.now().toString(),
        x: pos.x,
        y: pos.y,
        text: "",
        fontSize: fontSize,
        fontFamily: fontFamily,
        fill: strokeColor,
        fontStyle: "normal",
        textDecoration: "none",
        textAlign: "left",
        width: 200,
        opacity: 1,
      };

      setPages((prev) => {
        const newPages = [...prev];
        newPages[pageIndex] = {
          ...newPages[pageIndex],
          texts: [...newPages[pageIndex].texts, newText],
        };
        return newPages;
      });

      setCurrentPageIndex(pageIndex);
      setEditingTextItem(newText);
      return;
    }

    if (clickedOnEmpty) {
      setSelectedIds([]);
      setShowToolbar(false);
      setContextMenu(null);
    }

    if (isShapesMode && clickedOnEmpty) {
      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) return;

      saveCurrentPageState();

      const newShape = createShapeAtPosition(selectedShape, pos);
      const currentShapes = pages[pageIndex].shapes || [];
      updatePageData(pageIndex, "shapes", [...currentShapes, newShape]);
      setSelectedIds([newShape.id]);
      return;
    }

    if (isPenMode) {
      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) return;

      const penState = getCurrentPenState(pageIndex);
      const points = penState.points;

      if (penMode === "polygon") {
        if (points.length === 0) {
          saveCurrentPageState();
          setPenDrawingState((prev) => ({
            ...prev,
            [pageIndex]: {
              points: [pos.x, pos.y],
              isDrawing: true,
              mode: "polygon",
            },
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

        setPenDrawingState((prev) => ({
          ...prev,
          [pageIndex]: {
            ...prev[pageIndex],
            points: [...points, pos.x, pos.y],
            mode: "polygon",
          },
        }));
        return;
      }

      if (penMode === "freehand") {
        saveCurrentPageState();
        isDrawing.current = true;
        activeDrawingPage.current = pageIndex;
        setPenDrawingState((prev) => ({
          ...prev,
          [pageIndex]: {
            points: [pos.x, pos.y],
            isDrawing: true,
            mode: "freehand",
          },
        }));
        return;
      }
    }

    if (isStickyNoteMode) {
      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) return;

      saveCurrentPageState();

      const newNote: StickyNoteType = {
        id: Date.now().toString(),
        type: "sticky-note",
        x: pos.x,
        y: pos.y,
        width: 200,
        height: 150,
        collapsedWidth: 30,
        collapsedHeight: 30,
        isExpanded: false,
        text: "",
        color: "#fef3c7",
        textColor: "#000000",
        fontSize: 14,
        fontFamily: "Roboto",
      };
      const currentNotes = pages[pageIndex].stickyNotes || [];
      updatePageData(pageIndex, "stickyNotes", [...currentNotes, newNote]);
      setSelectedIds([newNote.id]);
      return;
    }

    if (isTableMode) {
      const stage = e.target.getStage();
      if (!stage) return;

      const pos = stage.getPointerPosition();
      if (!pos) return;

      saveCurrentPageState();

      const adjustedX = (pos.x - panPosition.x) / zoom;
      const adjustedY = (pos.y - panPosition.y) / zoom;

      const newTable = createDefaultTable(adjustedX, adjustedY);
      const currentTables = pages[pageIndex].tables || [];
      updatePageData(pageIndex, "tables", [...currentTables, newTable]);
      setSelectedTableId(newTable.id);
      return;
    }

    if (isDrawingMode) {
      saveCurrentPageState();
      isDrawing.current = true;
      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) return;

      let currentTool = activeTool;
      if (activeTool === "Brush" && drawingMode === "eraser") {
        currentTool = "Eraser";
      }

      const newLines = [
        ...pages[pageIndex].lines,
        {
          tool: currentTool,
          points: [pos.x, pos.y],
          color: currentTool === "Eraser" ? "#ffffff" : strokeColor,
          width: strokeWidth,
        },
      ];

      updatePageData(pageIndex, "lines", newLines);
    }
  };

  const handleMouseMove = (
    e: Konva.KonvaEventObject<MouseEvent>,
    pageIndex: number,
  ) => {
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    if (isPenMode) {
      setMousePos(pos);
      const penState = getCurrentPenState(pageIndex);
      const points = penState.points;

      if (penMode === "polygon" && points.length > 4) {
        const dx = points[0] - pos.x;
        const dy = points[1] - pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        setSnapToStart(distance < penSnapDistance);
      } else {
        setSnapToStart(false);
      }

      if (
        penMode === "freehand" &&
        isDrawing.current &&
        pageIndex === activeDrawingPage.current
      ) {
        const newPoints = [...points, pos.x, pos.y];
        setPenDrawingState((prev) => ({
          ...prev,
          [pageIndex]: { ...prev[pageIndex], points: newPoints },
        }));
      }
      return;
    }

    if (!isDrawing.current || !isDrawingMode) return;

    const currentLines = [...pages[pageIndex].lines];
    const lastLine = currentLines[currentLines.length - 1];

    if (lastLine) {
      lastLine.points = lastLine.points.concat([pos.x, pos.y]);
      currentLines.splice(currentLines.length - 1, 1, lastLine);
      updatePageData(pageIndex, "lines", currentLines);
    }
  };

  const handleMouseUp = () => {
    if (
      isPenMode &&
      penMode === "freehand" &&
      isDrawing.current &&
      activeDrawingPage.current !== null
    ) {
      const penState = getCurrentPenState(activeDrawingPage.current);
      if (penState.points.length >= 6) {
        completePenShape(activeDrawingPage.current, penState.points, false);
      } else {
        setPenDrawingState((prev) => ({
          ...prev,
          [activeDrawingPage.current!]: {
            points: [],
            isDrawing: false,
            mode: penMode,
          },
        }));
      }
    }
    isDrawing.current = false;
    activeDrawingPage.current = null;
  };

  const handleTextDblClick = (
    _e: Konva.KonvaEventObject<MouseEvent>,
    pageIndex: number,
    textItem: TextType,
  ) => {
    setCurrentPageIndex(pageIndex);
    setEditingTextItem(textItem);
    setShowToolbar(false);
  };

  const handleTextClick = (_pageIndex: number, _textItem: TextType) => {
  };

  const handleTextUpdate = useCallback(
    (updatedText: TextType) => {
      saveCurrentPageState();

      setPages((prevPages) => {
        return prevPages.map((page, idx) => {
          if (idx === currentPageIndex) {
            const textIndex = page.texts.findIndex(
              (t) => t.id === updatedText.id,
            );
            if (textIndex !== -1) {
              const newTexts = [...page.texts];
              newTexts[textIndex] = updatedText;
              return { ...page, texts: newTexts };
            } else {
              return { ...page, texts: [...page.texts, updatedText] };
            }
          }
          return page;
        });
      });
    },
    [currentPageIndex, saveCurrentPageState],
  );

  const handleTextSelect = (id: string | null) => {
    if (!id) {
      setSelectedIds([]);
      setShowToolbar(false);
      return;
    }
    handleObjectSelect(id);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (selectedIds.length > 0) {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY });
    }
  };

  const handleDeleteText = () => {
    handleDeleteSelected();
    setContextMenu(null);
  };

  const handleFormat = (format: "bold" | "italic" | "underline") => {
    if (selectedIds.length !== 1) return;
    const textItem = pages[currentPageIndex]?.texts.find(
      (t) => t.id === selectedIds[0],
    );
    if (textItem) {
      const updatedText = { ...textItem };
      if (format === "bold") {
        const current = textItem.fontStyle || "normal";
        updatedText.fontStyle = current.includes("bold")
          ? ((current.replace("bold", "").trim() ||
              "normal") as TextType["fontStyle"])
          : current === "italic"
            ? "bold italic"
            : "bold";
      } else if (format === "italic") {
        const current = textItem.fontStyle || "normal";
        updatedText.fontStyle = current.includes("italic")
          ? ((current.replace("italic", "").trim() ||
              "normal") as TextType["fontStyle"])
          : current === "bold"
            ? "bold italic"
            : "italic";
      } else if (format === "underline") {
        updatedText.textDecoration =
          textItem.textDecoration === "underline" ? "none" : "underline";
      }
      handleTextUpdate(updatedText);
    }
    setContextMenu(null);
  };

  const handleAddPages = () => {
    const num = parseInt(pagesToAdd);
    if (num > 0) {
      const newPages = Array(num)
        .fill(null)
        .map(() => ({
          lines: [],
          texts: [],
          shapes: [],
          images: [],
          stickyNotes: [],
          tables: [],
        }));
      setPages((prev) => [...prev, ...newPages]);
      setShowAddModal(false);
    }
  };

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
      ref={bookContainerRef}
      style={{
        ...(isFullscreen
          ? {}
          : {
              backgroundImage: `url(${bookBG})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }),
        backgroundColor: isFullscreen ? "#000" : "transparent",
        cursor: isSpacePanning
          ? "grab"
          : isHandMode
            ? isPanning
              ? "grabbing"
              : "grab"
            : is3DDragging
              ? "move"
              : "default",
        perspective: "2000px",
      }}
      className={`relative flex flex-col items-center justify-center transition-all duration-300 ${
        isFullscreen
          ? "flex items-center justify-center w-full h-full"
          : "h-[calc(100vh-210px)] w-full bg-transparent overflow-hidden"
      }`}
      onMouseDown={handleContainerMouseDown}
      onMouseMove={handleContainerMouseMove}
      onMouseUp={handleContainerMouseUp}
      onMouseLeave={() => { setIs3DDragging(false); setIsPanning(false); }}
      onContextMenu={(e) => e.preventDefault()}
    >

      {!isFullscreen && (
        <div
          className="absolute right-4 bottom-32 flex flex-col items-center gap-2 z-[100] pointer-events-auto"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-[#2B2B2B] w-max rounded-lg p-1 flex flex-col gap-1 shadow-xl">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={handleZoomIn}
              title="Zoom In (Ctrl++)"
            >
              <SquarePlus size={16} />
            </Button>
            <div className="text-xs text-white text-center px-1 select-none">
              {Math.round(zoom * 100)}%
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={handleZoomOut}
              title="Zoom Out (Ctrl+-)"
            >
              <SquareMinus size={16} />
            </Button>
          </div>
          <Button
            size="icon"
            variant="secondary"
            className="h-10 w-10 rounded-lg bg-[#2B2B2B] text-primary hover:bg-[#333] border-none shadow-xl"
            onClick={handleZoomReset}
            title="Reset Zoom (Ctrl+0)"
          >
            <RotateCcw size={18} />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-10 w-10 rounded-lg bg-[#2B2B2B] text-primary hover:bg-[#333] border-none shadow-xl"
            onClick={toggleFullscreen}
            title={
              isFullscreen ? "Exit Fullscreen (F11)" : "Enter Fullscreen (F11)"
            }
          >
            {isFullscreen ? <Minimize size={18} /> : <Expand size={18} />}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-7 bg-white/10 text-white hover:bg-white/20 border-none shadow-xl"
            onClick={() => setShowAddModal(true)}
            title="Add New Page"
          >
            <Plus size={14} />
            Add Page
          </Button>
        </div>
      )}

      {!isFullscreen && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-[#2B2B2B] px-4 py-2 rounded-xl border border-white/10 shadow-lg animate-in slide-in-from-bottom-5">
          {currentPageIndex > 0 && (
            <div
              onClick={flipPrev}
              className="justify-start text-zinc-400 text-base font-medium font-sans leading-7 cursor-pointer hover:text-white transition-colors select-none"
            >
              {currentPageIndex}
            </div>
          )}
          <div className="size-9 p-4 bg-white/10 rounded-lg flex justify-center items-center gap-3 border border-white/5">
            <input
              type="text"
              value={currentPageIndex + 1}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val)) {
                  handlePageChange(val);
                }
              }}
              className="w-8 bg-transparent text-white text-base font-medium font-sans leading-7 text-center focus:outline-none"
            />
          </div>
          <div className="justify-start text-zinc-400 text-base font-medium font-sans leading-7 select-none">
            of {pages.length} pages
          </div>
        </div>
      )}

      <button
        onClick={flipPrev}
        className="absolute left-4 z-50 p-3 bg-primary rounded-lg text-white shadow-lg hover:bg-primary/90 transition-all hover:scale-110 active:scale-95"
      >
        <ArrowLeft size={24} />
      </button>

      <button
        onClick={flipNext}
        className="absolute right-4 z-50 p-3 bg-primary rounded-lg text-white shadow-lg hover:bg-primary/90 transition-all hover:scale-110 active:scale-95"
      >
        <ArrowRight size={24} />
      </button>

      <div
        style={{
          transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoom}) rotateX(${bookRotation.x}deg) rotateY(${bookRotation.y}deg)`,
          transition: isPanning || is3DDragging ? "none" : "transform 0.2s",
          transformStyle: "preserve-3d",
        }}
        className="relative flex justify-center items-center"
      >
        {/* 3D Hardcover Backing */}
        <div
          className="absolute bg-[#2d2a26] shadow-[15px_20px_30px_rgba(0,0,0,0.6)] transition-all delay-50 duration-300 pointer-events-none"
          style={{
            width: currentPageIndex === 0 ? WIDTH + 16 : (WIDTH * 2) + 32,
            height: HEIGHT + 24,
            borderRadius: currentPageIndex === 0 ? "4px 12px 12px 4px" : "12px",
            top: "50%",
            left: currentPageIndex === 0 ? "75%" : "50%",
            transform: "translate(-50%, -50%) translateZ(-10px)",
            zIndex: -1,
            border: "1px solid #1f1d1a",
            backgroundImage: "linear-gradient(to right, #2d2a26, #3a3632, #2d2a26)",
          }}
        >
          {currentPageIndex > 0 && (
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-12 bg-gradient-to-r from-black/60 via-transparent to-black/60 border-x border-black/30 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]" />
          )}
        </div>

        <HTMLFlipBook
          key={`${WIDTH}-${HEIGHT}`}
          width={WIDTH}
          height={HEIGHT}
          size="fixed"
          minWidth={315}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1533}
          maxShadowOpacity={0.8}
          showCover={true}
          mobileScrollSupport={true}
          className=""
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
          style={{}}
        >
          {pages.map((pageData, index) => (
            <div
              key={index}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handlePageDrop(e, index)}
            >
              <BookPage
                stageRef={(node) => {
                  if (stageRefs.current) {
                    stageRefs.current[index] = node;
                  }
                }}
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
                onTextClick={handleTextClick}
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
                pages={pages}
                shapeTransformerRef={shapeTransformerRef}
                setContextMenu={setContextMenu}
                onImageUpdate={handleImageUpdate}
                onShapeUpdate={handleShapeUpdate}
                onTableUpdate={handleTableUpdate}
                onTextUpdate={handleDirectTextUpdate}
              />
            </div>
          ))}
        </HTMLFlipBook>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-100 backdrop-blur-sm">
          <div className="bg-card rounded-xl p-6 w-80 shadow-2xl border border-white/10 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-foreground">Add Pages</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                How many pages?
              </label>
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

      {editingTextItem && (
        <InPlaceTextEditor
          key={editingTextItem.id}
          textItem={editingTextItem}
          onUpdate={handleTextUpdate}
          onBlur={() => setEditingTextItem(null)}
        />
      )}

      {showToolbar &&
        selectedTextId &&
        !editingTextItem &&
        (() => {
          const textItem = pages[currentPageIndex]?.texts.find(
            (t) => t.id === selectedTextId,
          );
          return textItem ? (
            <FloatingTextToolbar
              textItem={textItem}
              onUpdate={handleTextUpdate}
              position={toolbarPos}
            />
          ) : null;
        })()}

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
          onLayerAction={handleLayerAction}
        />
      )}

      <div
        onContextMenu={handleContextMenu}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />

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
                case "insertRow":
                  handleTableInsertRow(tableId, value);
                  break;
                case "insertColumn":
                  handleTableInsertColumn(tableId, value);
                  break;
                case "deleteRow":
                  handleTableDeleteRow(tableId);
                  break;
                case "deleteColumn":
                  handleTableDeleteColumn(tableId);
                  break;
                case "mergeCells":
                  handleTableMergeCells(tableId);
                  break;
              }
              setTableContextMenu(null);
            }}
            onClose={() => setTableContextMenu(null)}
          />
        </>
      )}

      {editingTableCell && (
        <TableCellEditor
          cell={(() => {
            const page = pages[currentPageIndex];
            const table = page.tables.find(
              (t) => t.id === editingTableCell.tableId,
            );
            if (!table) return createEmptyCell();
            return (
              table.data[editingTableCell.row]?.[editingTableCell.col] ||
              createEmptyCell()
            );
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
Book.displayName = "Book";

export default Book;