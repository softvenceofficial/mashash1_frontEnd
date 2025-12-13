import { useState, useRef } from "react";
import Tools from "@/components/Dashboard/Tools/Tools";
import Toolbox from "@/components/Dashboard/Toolbox/Toolbox";
import AIImageBox from "@/components/Dashboard/AI-Image-box/AIImageBox";
import Book from "@/components/Dashboard/Book/Book";
import AIImageType from "@/components/Dashboard/AI-Image-TypeBox/AIImageType";
import { SiteHeader } from "@/components/Dashboard/DashboardHeader";

export default function Creator() {
  const [activeTool, setActiveTool] = useState("Book Size");
  const [selectedBookSize, setSelectedBookSize] = useState("6 x 4");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState("Roboto");
  const bookRef = useRef<any>(null);

  const handleAdvancedTextChange = (property: string, value: any) => {
    if ((window as any).__handleAdvancedTextChange) {
      (window as any).__handleAdvancedTextChange(property, value);
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
          />
          <Book
            ref={bookRef}
            activeTool={activeTool}
            selectedBookSize={selectedBookSize}
            strokeColor={strokeColor}
            strokeWidth={strokeWidth}
            fontSize={fontSize}
            fontFamily={fontFamily}
            onAdvancedTextChange={handleAdvancedTextChange}
          />
        </div>
        <div className="w-[10.2%] bg-white">
          <AIImageType />
        </div>
      </div>
    </div>
  );
}
