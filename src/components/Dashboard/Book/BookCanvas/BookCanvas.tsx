import { useRef, useEffect, memo } from "react";
import HTMLFlipBook from "react-pageflip";
import { BookPage } from "./BookPage";
import type { PageData, TextType } from "../../shared/types/book.types";
import Konva from "konva";

interface BookCanvasProps {
  pages: PageData[];
  width: number;
  height: number;
  zoom: number;
  activeTool: string;
  selectedTextId: string | null;
  onMouseDown: (e: Konva.KonvaEventObject<MouseEvent>, index: number) => void;
  onMouseMove: (e: Konva.KonvaEventObject<MouseEvent>, index: number) => void;
  onMouseUp: (e: Konva.KonvaEventObject<MouseEvent>, index: number) => void;
  onTextClick: (e: Konva.KonvaEventObject<MouseEvent>, index: number, item: TextType) => void;
  onTextContextMenu: (e: Konva.KonvaEventObject<MouseEvent>, item: TextType) => void;
  onTextSelect: (textId: string | null) => void;
  onTextTransform: (textId: string, attrs: any) => void;
  onFlipRef?: (ref: any) => void;
}

export const BookCanvas = memo(({
  pages,
  width,
  height,
  zoom,
  activeTool,
  selectedTextId,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onTextClick,
  onTextContextMenu,
  onTextSelect,
  onTextTransform,
  onFlipRef,
}: BookCanvasProps) => {
  const bookRef = useRef<any>(null);

  useEffect(() => {
    if (onFlipRef && bookRef.current) {
      onFlipRef(bookRef.current);
    }
  }, [onFlipRef]);

  return (
    <div
      style={{
        transform: `scale(${zoom})`,
        transition: "transform 0.2s",
        perspective: "1500px",
        filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.3))",
      }}
    >
      <HTMLFlipBook
        width={width}
        height={height}
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
        style={{}}
      >
        {pages.map((pageData, index) => (
          <BookPage
            key={index}
            pageIndex={index}
            data={pageData}
            activeTool={activeTool}
            width={width}
            height={height}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onTextClick={onTextClick}
            onTextContextMenu={onTextContextMenu}
            onTextSelect={onTextSelect}
            selectedTextId={selectedTextId}
            onTextTransform={onTextTransform}
          />
        ))}
      </HTMLFlipBook>
    </div>
  );
});

BookCanvas.displayName = "BookCanvas";
