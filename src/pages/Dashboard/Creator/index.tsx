/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from "react";
import Tools from "@/components/Dashboard/Tools/Tools";
import Toolbox, { DrawingMode } from "@/components/Dashboard/Toolbox/Toolbox";
import AIImageBox from "@/components/Dashboard/AI-Image-box/AIImageBox";
import Book from "@/components/Dashboard/Book/Book";
import AIImageType from "@/components/Dashboard/AI-Image-TypeBox/AIImageType";
import { SiteHeader } from "@/components/Dashboard/DashboardHeader";

export default function Creator() {
  const [activeTool, setActiveTool] = useState("Book Size");
  const [activeSubTool, setActiveSubTool] = useState("select");
  const [selectedBookSize, setSelectedBookSize] = useState("6 x 4");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState("Roboto");
  const [drawingMode, setDrawingMode] = useState<DrawingMode>(DrawingMode.BRUSH);
  const [zoom, setZoom] = useState(1);
  const bookRef = useRef<any>(null);

  const handleAdvancedTextChange = (property: string, value: any) => {
    if ((window as any).__handleAdvancedTextChange) {
      (window as any).__handleAdvancedTextChange(property, value);
    }
  };

  const handleImageUpload = (file: File) => {
    if (bookRef.current?.handleImageUpload) {
      bookRef.current.handleImageUpload(file);
    }
  };

  const handlePenOptionChange = (property: string, value: any) => {
    if (bookRef.current?.handlePenOptionChange) {
      bookRef.current.handlePenOptionChange(property, value);
    }
  };

  const handlePenAction = (action: string) => {
    if (bookRef.current?.handlePenAction) {
      bookRef.current.handlePenAction(action);
    }
  };

  const handleTableChange = (property: string, value: any) => {
    if (bookRef.current?.handleTableChange) {
      bookRef.current.handleTableChange(property, value);
    }
  };

  return (
    <div>
      <SiteHeader />
      <div className="flex min-h-screen gap-4 mt-3">
        <div className="w-[23.3%]">
          <Tools activeTool={activeTool} setActiveTool={setActiveTool} />
          <AIImageBox />
        </div>
        <div className="w-[63.8%]">
          <Toolbox 
            activeTool={activeTool} 
            activeSubTool={activeSubTool}
            onToolChange={setActiveSubTool}
            onBookSizeChange={setSelectedBookSize}
            onStrokeColorChange={setStrokeColor}
            onStrokeWidthChange={setStrokeWidth}
            onFontSizeChange={setFontSize}
            onFontFamilyChange={setFontFamily}
            strokeColor={strokeColor}
            strokeWidth={strokeWidth}
            undo={bookRef.current?.undo}
            redo={bookRef.current?.redo}
            canUndo={bookRef.current?.canUndo}
            canRedo={bookRef.current?.canRedo}
            updatePageData={bookRef.current?.updatePageData}
            currentPageIndex={bookRef.current?.currentPageIndex}
            onAdvancedTextChange={handleAdvancedTextChange}
            drawingMode={drawingMode}
            onDrawingModeChange={setDrawingMode}
            onZoomChange={setZoom}
            currentZoom={zoom}
            onImageUpload={handleImageUpload}
            onPenOptionChange={handlePenOptionChange}
            onPenAction={handlePenAction}
            onTableChange={handleTableChange}
          />
          <Book
            ref={bookRef}
            activeTool={activeTool}
            activeSubTool={activeSubTool}
            selectedBookSize={selectedBookSize}
            strokeColor={strokeColor}
            strokeWidth={strokeWidth}
            fontSize={fontSize}
            fontFamily={fontFamily}
            onAdvancedTextChange={handleAdvancedTextChange}
            drawingMode={drawingMode}
            zoom={zoom}
          />
        </div>
        <div className="w-[10.2%] bg-white">
          <AIImageType />
        </div>
      </div>
    </div>
  );
}
