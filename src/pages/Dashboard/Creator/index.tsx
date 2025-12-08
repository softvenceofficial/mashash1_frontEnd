import { useState } from "react";
import Tools from "@/components/Dashboard/Tools/Tools";
import Toolbox from "@/components/Dashboard/Toolbox/Toolbox";
import AIImageBox from "@/components/Dashboard/AI-Image-box/AIImageBox";
import Book from "@/components/Dashboard/Book/Book";
import AIImageType from "@/components/Dashboard/AI-Image-TypeBox/AIImageType";
import { SiteHeader } from "@/components/Dashboard/DashboardHeader";

export default function Creator() {
  const [activeTool, setActiveTool] = useState("Book Size");
  const [selectedBookSize, setSelectedBookSize] = useState("6 x 4");
  const [selectedFontFamily, setSelectedFontFamily] = useState("Roboto");
  const [selectedFontSize, setSelectedFontSize] = useState(16);
  const [selectedTextColor, setSelectedTextColor] = useState("#ffffff");

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrike, setIsStrike] = useState(false);
  const [textAlign, setTextAlign] = useState("left");
  const [textCase, setTextCase] = useState<'normal' | 'uppercase'>('normal');
  const [listType, setListType] = useState<'none' | 'bullet' | 'ordered'>('none');

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
            onFontFamilyChange={setSelectedFontFamily} 
            onFontSizeChange={setSelectedFontSize}
            onTextColorChange={setSelectedTextColor}
            onBoldChange={setIsBold}
            onItalicChange={setIsItalic}
            onUnderlineChange={setIsUnderline}
            onStrikeChange={setIsStrike}
            onAlignChange={setTextAlign}
            onCaseChange={setTextCase}
            onListChange={setListType}
          />
          <Book
            activeTool={activeTool}
            selectedBookSize={selectedBookSize}
            selectedFontFamily={selectedFontFamily}
            selectedFontSize={selectedFontSize}
            strokeColor={selectedTextColor}
            strokeWidth={5}
            isBold={isBold}
            isItalic={isItalic}
            isUnderline={isUnderline}
            isStrike={isStrike}
            textAlign={textAlign}
            textCase={textCase}
            listType={listType}
          />
        </div>
        <div className="w-[10.2%] bg-white">
          <AIImageType />
        </div>
      </div>
    </div>
  );
}
