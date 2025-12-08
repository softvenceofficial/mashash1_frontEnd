import { createContext, useContext, useState, ReactNode } from "react";
import type { PageData } from "../types/book.types";

interface BookEditorState {
  pages: PageData[];
  activeTool: string;
  selectedTextId: string | null;
  selectedBookSize: string;
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
  zoom: number;
  currentPageIndex: number;
}

interface BookEditorActions {
  setPages: (pages: PageData[]) => void;
  setActiveTool: (tool: string) => void;
  setSelectedTextId: (id: string | null) => void;
  setSelectedBookSize: (size: string) => void;
  setStrokeColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  setFontSize: (size: number) => void;
  setFontFamily: (family: string) => void;
  setIsBold: (bold: boolean) => void;
  setIsItalic: (italic: boolean) => void;
  setIsUnderline: (underline: boolean) => void;
  setIsStrike: (strike: boolean) => void;
  setTextAlign: (align: string) => void;
  setTextCase: (textCase: "normal" | "uppercase") => void;
  setListType: (listType: "none" | "bullet" | "ordered") => void;
  setZoom: (zoom: number) => void;
  setCurrentPageIndex: (index: number) => void;
}

type BookEditorContextType = BookEditorState & BookEditorActions;

const BookEditorContext = createContext<BookEditorContextType | undefined>(undefined);

const INITIAL_PAGES: PageData[] = Array(10).fill(null).map(() => ({
  lines: [],
  texts: [],
  shapes: [],
}));

INITIAL_PAGES[0].texts.push({
  id: "title",
  x: 50,
  y: 200,
  text: "My Book",
  fontSize: 32,
  fill: "#fff",
  fontFamily: "Roboto",
  width: 200,
  height: 100,
  name: "Cover Title",
});
INITIAL_PAGES[0].background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

export const BookEditorProvider = ({ children }: { children: ReactNode }) => {
  const [pages, setPages] = useState<PageData[]>(INITIAL_PAGES);
  const [activeTool, setActiveTool] = useState("Tool");
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [selectedBookSize, setSelectedBookSize] = useState("6 x 4");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Roboto");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrike, setIsStrike] = useState(false);
  const [textAlign, setTextAlign] = useState("left");
  const [textCase, setTextCase] = useState<"normal" | "uppercase">("normal");
  const [listType, setListType] = useState<"none" | "bullet" | "ordered">("none");
  const [zoom, setZoom] = useState(1);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const value: BookEditorContextType = {
    pages,
    activeTool,
    selectedTextId,
    selectedBookSize,
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
    zoom,
    currentPageIndex,
    setPages,
    setActiveTool,
    setSelectedTextId,
    setSelectedBookSize,
    setStrokeColor,
    setStrokeWidth,
    setFontSize,
    setFontFamily,
    setIsBold,
    setIsItalic,
    setIsUnderline,
    setIsStrike,
    setTextAlign,
    setTextCase,
    setListType,
    setZoom,
    setCurrentPageIndex,
  };

  return <BookEditorContext.Provider value={value}>{children}</BookEditorContext.Provider>;
};

export const useBookEditor = () => {
  const context = useContext(BookEditorContext);
  if (!context) {
    throw new Error("useBookEditor must be used within BookEditorProvider");
  }
  return context;
};
