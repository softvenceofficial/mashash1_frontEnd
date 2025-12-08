import { useRef } from "react";
import Konva from "konva";
import type { TextType, ShapeType, PageData } from "../types/book.types";

interface UseCanvasInteractionsProps {
  pages: PageData[];
  activeTool: string;
  strokeColor: string;
  strokeWidth: number;
  fontSize: number;
  fontFamily: string;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrike: boolean;
  textAlign: string;
  textCase: "normal" | "uppercase";
  listType: "none" | "bullet" | "ordered";
  onUpdatePage: (pageIndex: number, key: keyof PageData, data: any) => void;
  onTextCreated: (textId: string, pageIndex: number) => void;
}

export const useCanvasInteractions = ({
  pages,
  activeTool,
  strokeColor,
  strokeWidth,
  fontSize,
  fontFamily,
  isBold,
  isItalic,
  isUnderline,
  isStrike,
  textAlign,
  textCase,
  listType,
  onUpdatePage,
  onTextCreated,
}: UseCanvasInteractionsProps) => {
  const isDrawing = useRef(false);

  const isDrawingMode = ["Brush", "Eraser"].includes(activeTool);

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>, pageIndex: number) => {
    const stage = e.target.getStage();
    const pos = stage?.getPointerPosition();
    if (!pos || !stage) return;

    const clickedOnText = e.target instanceof Konva.Text;

    if (clickedOnText && activeTool === "Text") {
      return;
    }

    if (isDrawingMode) {
      isDrawing.current = true;
      const newLines = [
        ...pages[pageIndex].lines,
        {
          tool: activeTool,
          points: [pos.x, pos.y],
          color: activeTool === "Eraser" ? "#ffffff" : strokeColor,
          width: activeTool === "Eraser" ? 20 : strokeWidth,
        },
      ];
      onUpdatePage(pageIndex, "lines", newLines);
    } else if (activeTool === "Text") {
      const clickedOnEmpty = e.target === stage;
      if (clickedOnEmpty) {
        const newText: TextType = {
          id: Date.now().toString(),
          x: pos.x,
          y: pos.y,
          text: "Type here...",
          fontSize,
          fill: strokeColor,
          fontFamily,
          bold: isBold,
          italic: isItalic,
          underline: isUnderline,
          strike: isStrike,
          align: textAlign,
          width: 200,
          height: 100,
          textCase,
          listType,
        };
        onUpdatePage(pageIndex, "texts", [...pages[pageIndex].texts, newText]);
        onTextCreated(newText.id, pageIndex);
      }
    } else if (activeTool === "Shapes") {
      const clickedOnEmpty = e.target === stage;
      if (clickedOnEmpty) {
        const newShape: ShapeType = {
          id: Date.now().toString(),
          type: Math.random() > 0.5 ? "rect" : "circle",
          x: pos.x,
          y: pos.y,
          fill: strokeColor,
        };
        onUpdatePage(pageIndex, "shapes", [...pages[pageIndex].shapes, newShape]);
      }
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>, pageIndex: number) => {
    if (!isDrawing.current || !isDrawingMode) return;

    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();
    if (!point) return;

    const currentLines = [...pages[pageIndex].lines];
    const lastLine = currentLines[currentLines.length - 1];

    if (lastLine) {
      lastLine.points = lastLine.points.concat([point.x, point.y]);
      currentLines.splice(currentLines.length - 1, 1, lastLine);
      onUpdatePage(pageIndex, "lines", currentLines);
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return { handleMouseDown, handleMouseMove, handleMouseUp };
};
