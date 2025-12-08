import { forwardRef, useEffect, useRef } from "react";
import { Stage, Layer, Line, Text as KonvaText, Rect, Circle, Transformer } from "react-konva";
import Konva from "konva";
import type { PageData, TextType } from "../../shared/types/book.types";

interface BookPageProps {
  pageIndex: number;
  data: PageData;
  activeTool: string;
  width: number;
  height: number;
  onMouseDown: (e: Konva.KonvaEventObject<MouseEvent>, index: number) => void;
  onMouseMove: (e: Konva.KonvaEventObject<MouseEvent>, index: number) => void;
  onMouseUp: (e: Konva.KonvaEventObject<MouseEvent>, index: number) => void;
  onTextClick: (e: Konva.KonvaEventObject<MouseEvent>, index: number, item: TextType) => void;
  onTextContextMenu: (e: Konva.KonvaEventObject<MouseEvent>, item: TextType) => void;
  onTextSelect: (textId: string | null) => void;
  selectedTextId: string | null;
  onTextTransform: (textId: string, attrs: any) => void;
}

export const BookPage = forwardRef<HTMLDivElement, BookPageProps>(
  (
    {
      pageIndex,
      data,
      activeTool,
      width,
      height,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onTextClick,
      onTextContextMenu,
      onTextSelect,
      selectedTextId,
      onTextTransform,
    },
    ref,
  ) => {
    const trRef = useRef<Konva.Transformer>(null);
    const layerRef = useRef<Konva.Layer>(null);
    const isLeftPage = pageIndex % 2 === 0;

    useEffect(() => {
      if (selectedTextId && trRef.current && layerRef.current) {
        const selectedNode = layerRef.current.findOne(`#${selectedTextId}`);
        if (selectedNode) {
          trRef.current.nodes([selectedNode]);
          trRef.current.getLayer()?.batchDraw();
        }
      }
    }, [selectedTextId]);

    const pageScale = isLeftPage ? 0.98 : 1;
    const pageScaleOrigin = isLeftPage ? "right" : "left";

    return (
      <div
        ref={ref}
        className="bg-white h-full w-full overflow-hidden shadow-sm relative"
        style={{
          transform: `scaleX(${pageScale})`,
          transformOrigin: pageScaleOrigin,
          perspective: "1200px",
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-black/15 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-t from-black/10 to-transparent"></div>
          <div className="absolute top-0 right-0 w-1 bg-gradient-to-l from-black/10 to-transparent h-full"></div>
        </div>

        <div
          className="absolute top-0 bottom-0 w-1 bg-gradient-to-r from-black/20 via-black/30 to-black/20"
          style={{
            left: isLeftPage ? "100%" : "-2px",
            transform: isLeftPage ? "translateX(-50%)" : "translateX(0)",
          }}
        ></div>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to ${isLeftPage ? "right" : "left"}, rgba(0,0,0,0.08) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.04) 100%)`,
            borderRadius: isLeftPage ? "0 8px 8px 0" : "8px 0 0 8px",
          }}
        ></div>

        <div
          className="absolute top-0 left-0 right-0 h-12 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, transparent 100%)",
          }}
        ></div>

        <div className="w-full h-full relative" style={{ background: data.background || "white" }}>
          {pageIndex === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-white opacity-20 text-6xl font-bold tracking-widest">
                COVER
              </div>
            </div>
          )}

          <Stage
            width={width}
            height={height}
            onMouseDown={(e) => {
              const clickedOnText = e.target instanceof Konva.Text;
              if (!clickedOnText) {
                const clickedOnEmpty = e.target === e.target.getStage();
                if (clickedOnEmpty) onTextSelect(null);
                onMouseDown(e, pageIndex);
              }
            }}
            onMouseMove={(e) => onMouseMove(e, pageIndex)}
            onMouseUp={(e) => onMouseUp(e, pageIndex)}
            className={activeTool !== "Book Size" ? "cursor-crosshair" : "cursor-default"}
          >
            <Layer ref={layerRef}>
              {data.shapes.map((shape, i) =>
                shape.type === "rect" ? (
                  <Rect
                    key={i}
                    x={shape.x}
                    y={shape.y}
                    width={50}
                    height={50}
                    fill={shape.fill}
                    draggable={activeTool === "Tool"}
                  />
                ) : (
                  <Circle
                    key={i}
                    x={shape.x}
                    y={shape.y}
                    radius={30}
                    fill={shape.fill}
                    draggable={activeTool === "Tool"}
                  />
                ),
              )}

              {data.lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.color}
                  strokeWidth={line.width}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation={
                    line.tool === "Eraser" ? "destination-out" : "source-over"
                  }
                />
              ))}

              {data.texts.map((textItem) => {
                if (textItem.visible === false) return null;

                let textDecoration = "";
                if (textItem.underline) textDecoration += "underline ";
                if (textItem.strike) textDecoration += "line-through";

                let displayText = textItem.text;
                if (textItem.textCase === "uppercase") displayText = displayText.toUpperCase();

                if (textItem.listType && textItem.listType !== "none") {
                  const lines = displayText.split("\n");
                  displayText = lines
                    .map((line, idx) => {
                      if (textItem.listType === "bullet") return `• ${line}`;
                      if (textItem.listType === "ordered") return `${idx + 1}. ${line}`;
                      return line;
                    })
                    .join("\n");
                }

                return (
                  <KonvaText
                    key={textItem.id}
                    id={textItem.id}
                    name="text"
                    x={textItem.x}
                    y={textItem.y}
                    text={displayText}
                    fontSize={textItem.fontSize}
                    fill={textItem.fill}
                    fontFamily={textItem.fontFamily || "Roboto"}
                    fontStyle={textItem.italic ? "italic" : "normal"}
                    fontVariant={textItem.bold ? "bold" : "normal"}
                    textDecoration={textDecoration.trim()}
                    align={textItem.align || "left"}
                    width={textItem.width}
                    height={textItem.height}
                    wrap="word"
                    draggable={!textItem.locked && activeTool === "Tool"}
                    onClick={(e) => {
                      e.cancelBubble = true;
                      if (!textItem.locked) {
                        onTextSelect(textItem.id);
                      }
                    }}
                    onDblClick={(e) => {
                      e.cancelBubble = true;
                      if (!textItem.locked) {
                        onTextClick(e, pageIndex, textItem);
                      }
                    }}
                    onContextMenu={(e) => onTextContextMenu(e, textItem)}
                    onDragEnd={(e) => {
                      onTextTransform(textItem.id, {
                        x: e.target.x(),
                        y: e.target.y(),
                      });
                    }}
                    onTransformEnd={(e) => {
                      const node = e.target;
                      onTextTransform(textItem.id, {
                        x: node.x(),
                        y: node.y(),
                        width: node.width() * node.scaleX(),
                        height: node.height() * node.scaleY(),
                      });
                      node.scaleX(1);
                      node.scaleY(1);
                    }}
                  />
                );
              })}

              {selectedTextId && (
                <Transformer
                  ref={trRef}
                  boundBoxFunc={(oldBox, newBox) => {
                    if (newBox.width < 20 || newBox.height < 10) {
                      return oldBox;
                    }
                    return newBox;
                  }}
                  enabledAnchors={[
                    "top-left",
                    "top-right",
                    "bottom-left",
                    "bottom-right",
                    "middle-left",
                    "middle-right",
                  ]}
                  rotateEnabled={false}
                />
              )}
            </Layer>
          </Stage>

          <span className="absolute bottom-4 right-4 text-gray-400 text-sm font-medium select-none">
            {pageIndex + 1}
          </span>
        </div>
      </div>
    );
  },
);

BookPage.displayName = "BookPage";
