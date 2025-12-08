/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from "react";
import Konva from "konva";
import bookBG from "@/assets/images/Books/mainBookbg.png";
import { BOOK_SIZE_MAP } from "../shared/constants/bookSizes";
import { TEXT_TEMPLATES } from "../shared/constants/templates";
import { PageData, TextType, TextTemplate } from "../shared/types/book.types";
import { useCanvasInteractions } from "../shared/hooks/useCanvasInteractions";
import { useTextOperations } from "../shared/hooks/useTextOperations";
import { BookCanvas } from "./BookCanvas/BookCanvas";
import { ZoomControls } from "./BookControls/ZoomControls";
import { NavigationControls } from "./BookControls/NavigationControls";
import { PageControls } from "./BookControls/PageControls";
import { InlineTextEditor } from "./TextEditor/InlineTextEditor";
import { LayersPanel } from "./Panels/LayersPanel";
import { TemplatesPanel } from "./Panels/TemplatesPanel";
import { AddPageModal } from "./Panels/AddPageModal";

interface BookProps {
  activeTool?: string;
  strokeColor?: string;
  strokeWidth?: number;
  selectedBookSize?: string;
  selectedFontFamily?: string;
  selectedFontSize?: number;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  isStrike?: boolean;
  textAlign?: string;
  textCase?: "normal" | "uppercase";
  listType?: "none" | "bullet" | "ordered";
}

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

const Book = ({
  activeTool = "Tool",
  strokeColor = "#000000",
  strokeWidth = 5,
  selectedBookSize = "6 x 4",
  selectedFontFamily = "Roboto",
  selectedFontSize = 16,
  isBold = false,
  isItalic = false,
  isUnderline = false,
  isStrike = false,
  textAlign = "left",
  textCase = "normal",
  listType = "none",
}: BookProps) => {
  const [pages, setPages] = useState<PageData[]>(INITIAL_PAGES);
  const [zoom, setZoom] = useState(1);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showLayersPanel, setShowLayersPanel] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [textEditVisible, setTextEditVisible] = useState(false);
  const [textEditValue, setTextEditValue] = useState("");
  const [textEditPos, setTextEditPos] = useState({ x: 0, y: 0 });
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editingTextSize, setEditingTextSize] = useState(16);
  const [editingFontFamily, setEditingFontFamily] = useState("Roboto");
  const [editingBold, setEditingBold] = useState(false);
  const [editingItalic, setEditingItalic] = useState(false);
  const [editingUnderline, setEditingUnderline] = useState(false);
  const [editingStrike, setEditingStrike] = useState(false);
  const [bookFlipRef, setBookFlipRef] = useState<any>(null);

  const bookDimensions = BOOK_SIZE_MAP[selectedBookSize] || BOOK_SIZE_MAP["6 x 4"];
  const WIDTH = bookDimensions.width;
  const HEIGHT = bookDimensions.height;

  const textOps = useTextOperations(pages, setPages);

  const updatePageData = (pageIndex: number, key: keyof PageData, data: any) => {
    setPages((prev) => {
      const newPages = [...prev];
      newPages[pageIndex] = { ...newPages[pageIndex], [key]: data };
      return newPages;
    });
  };

  const handleTextCreated = (textId: string, pageIndex: number) => {
    setSelectedTextId(textId);
    setEditingTextId(textId);
    setCurrentPageIndex(pageIndex);
    const text = pages[pageIndex].texts.find((t) => t.id === textId);
    if (text) {
      setTextEditValue(text.text);
      setEditingTextSize(text.fontSize);
      setEditingBold(text.bold || false);
      setEditingItalic(text.italic || false);
      setEditingUnderline(text.underline || false);
      setTextEditPos({ x: text.x, y: text.y });
      setTextEditVisible(true);
    }
  };

  const canvasInteractions = useCanvasInteractions({
    pages,
    activeTool,
    strokeColor,
    strokeWidth,
    fontSize: selectedFontSize,
    fontFamily: selectedFontFamily,
    isBold,
    isItalic,
    isUnderline,
    isStrike,
    textAlign,
    textCase,
    listType,
    onUpdatePage: updatePageData,
    onTextCreated: handleTextCreated,
  });

  useEffect(() => {
    if (selectedTextId) {
      textOps.updateText(selectedTextId, {
        fontSize: selectedFontSize,
        fontFamily: selectedFontFamily,
        bold: isBold,
        italic: isItalic,
        underline: isUnderline,
        strike: isStrike,
        align: textAlign,
        fill: strokeColor,
        textCase,
        listType,
      });
    }
  }, [selectedTextId, selectedFontSize, selectedFontFamily, isBold, isItalic, isUnderline, isStrike, textAlign, strokeColor, textCase, listType]);

  const handleTextClick = (e: Konva.KonvaEventObject<MouseEvent>, _pageIndex: number, textItem: TextType) => {
    const textNode = e.target as Konva.Text;
    const stageBox = textNode.getStage()?.container().getBoundingClientRect();

    if (stageBox) {
      const absPos = textNode.getAbsolutePosition();
      setEditingTextId(textItem.id);
      setTextEditValue(textItem.text);
      setEditingTextSize(textItem.fontSize);
      setEditingFontFamily(textItem.fontFamily || "Roboto");
      setEditingBold(textItem.bold || false);
      setEditingItalic(textItem.italic || false);
      setEditingUnderline(textItem.underline || false);
      setEditingStrike(textItem.strike || false);
      setTextEditPos({ x: stageBox.left + absPos.x, y: stageBox.top + absPos.y });
      setTextEditVisible(true);
    }
  };

  const handleTextEditComplete = useCallback(() => {
    if (editingTextId) {
      let finalText = textEditValue;
      if (textCase === "uppercase") finalText = finalText.toUpperCase();
      textOps.updateText(editingTextId, {
        text: finalText,
        fontSize: editingTextSize,
        bold: editingBold,
        italic: editingItalic,
        underline: editingUnderline,
        strike: editingStrike,
        textCase,
        listType,
      });
    }
    setTextEditVisible(false);
    setEditingTextId(null);
    setEditingStrike(false);
  }, [editingTextId, textEditValue, textCase, editingTextSize, editingBold, editingItalic, editingUnderline, editingStrike, listType]);

  const addTextFromTemplate = (template: TextTemplate) => {
    const newText: TextType = {
      id: Date.now().toString(),
      x: 100,
      y: 100,
      text: template.label,
      fontSize: template.fontSize,
      fill: strokeColor,
      fontFamily: selectedFontFamily,
      bold: template.bold,
      italic: template.italic,
      width: template.width,
      height: template.height,
      name: template.label,
    };
    updatePageData(currentPageIndex, "texts", [...pages[currentPageIndex].texts, newText]);
    setShowTemplates(false);
    setSelectedTextId(newText.id);
  };

  const handleAddPages = (count: number) => {
    const newPages = Array(count).fill(null).map(() => ({
      lines: [],
      texts: [],
      shapes: [],
    }));
    setPages((prev) => [...prev, ...newPages]);
  };

  const flipNext = useCallback(() => {
    if (bookFlipRef) {
      bookFlipRef.pageFlip().flipNext();
    }
  }, [bookFlipRef]);

  const flipPrev = useCallback(() => {
    if (bookFlipRef) {
      bookFlipRef.pageFlip().flipPrev();
    }
  }, [bookFlipRef]);

  return (
    <div
      style={{
        backgroundImage: `url(${bookBG})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="relative flex flex-col items-center justify-center h-[calc(100vh-140px)] w-full bg-transparent overflow-hidden"
    >
      <TemplatesPanel
        visible={showTemplates}
        onClose={() => setShowTemplates(false)}
        onSelectTemplate={addTextFromTemplate}
      />

      <LayersPanel
        visible={showLayersPanel}
        texts={pages[currentPageIndex]?.texts || []}
        selectedTextId={selectedTextId}
        onClose={() => setShowLayersPanel(false)}
        onSelectText={setSelectedTextId}
        onToggleVisibility={textOps.toggleVisibility}
        onToggleLock={textOps.toggleLock}
        onMoveLayer={textOps.moveLayer}
      />

      <div className="absolute right-4 bottom-4 flex flex-col gap-2 z-50">
        <ZoomControls zoom={zoom} onZoomChange={setZoom} />
        <PageControls
          pageCount={pages.length}
          onAddPage={() => setShowAddModal(true)}
          onToggleLayers={() => setShowLayersPanel(!showLayersPanel)}
          onToggleTemplates={() => setShowTemplates(!showTemplates)}
        />
      </div>

      <NavigationControls onPrev={flipPrev} onNext={flipNext} />

      <BookCanvas
        pages={pages}
        width={WIDTH}
        height={HEIGHT}
        zoom={zoom}
        activeTool={activeTool}
        selectedTextId={selectedTextId}
        onMouseDown={canvasInteractions.handleMouseDown}
        onMouseMove={canvasInteractions.handleMouseMove}
        onMouseUp={canvasInteractions.handleMouseUp}
        onTextClick={handleTextClick}
        onTextContextMenu={() => {}}
        onTextSelect={setSelectedTextId}
        onTextTransform={textOps.updateText}
        onFlipRef={setBookFlipRef}
      />

      <InlineTextEditor
        visible={textEditVisible}
        value={textEditValue}
        position={textEditPos}
        fontSize={editingTextSize}
        fontFamily={editingFontFamily}
        isBold={editingBold}
        isItalic={editingItalic}
        isUnderline={editingUnderline}
        isStrike={editingStrike}
        onChange={setTextEditValue}
        onComplete={handleTextEditComplete}
        onFontSizeChange={(size) => {
          setEditingTextSize(size);
          if (editingTextId) textOps.updateText(editingTextId, { fontSize: size });
        }}
        onFontFamilyChange={(family) => {
          setEditingFontFamily(family);
          if (editingTextId) textOps.updateText(editingTextId, { fontFamily: family });
        }}
        onToggleBold={() => {
          setEditingBold(!editingBold);
          if (editingTextId) textOps.updateText(editingTextId, { bold: !editingBold });
        }}
        onToggleItalic={() => {
          setEditingItalic(!editingItalic);
          if (editingTextId) textOps.updateText(editingTextId, { italic: !editingItalic });
        }}
        onToggleUnderline={() => {
          setEditingUnderline(!editingUnderline);
          if (editingTextId) textOps.updateText(editingTextId, { underline: !editingUnderline });
        }}
        onToggleStrike={() => {
          setEditingStrike(!editingStrike);
          if (editingTextId) textOps.updateText(editingTextId, { strike: !editingStrike });
        }}
      />

      <AddPageModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddPages}
      />
    </div>
  );
};

export default Book;
