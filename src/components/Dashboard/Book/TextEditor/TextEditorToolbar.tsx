import { Bold, Italic, Underline, Strikethrough } from "lucide-react";
import { FONT_FAMILIES } from "../../shared/constants/fonts";

interface TextEditorToolbarProps {
  fontSize: number;
  fontFamily: string;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrike: boolean;
  textColor?: string;
  onFontSizeChange: (size: number) => void;
  onFontFamilyChange: (family: string) => void;
  onToggleBold: () => void;
  onToggleItalic: () => void;
  onToggleUnderline: () => void;
  onToggleStrike: () => void;
  onColorChange?: (color: string) => void;
}

export const TextEditorToolbar = ({
  fontSize,
  fontFamily,
  isBold,
  isItalic,
  isUnderline,
  isStrike,
  textColor = "#000000",
  onFontSizeChange,
  onFontFamilyChange,
  onToggleBold,
  onToggleItalic,
  onToggleUnderline,
  onToggleStrike,
  onColorChange,
}: TextEditorToolbarProps) => (
  <div className="bg-zinc-800 p-2 flex gap-2 border-b border-zinc-700 flex-wrap">
    <button
      onClick={onToggleBold}
      className={`p-1.5 rounded transition-colors ${isBold ? "bg-indigo-600 text-white" : "hover:bg-zinc-700 text-white"}`}
      title="Bold (Ctrl+B)"
    >
      <Bold className="w-4 h-4" />
    </button>
    <button
      onClick={onToggleItalic}
      className={`p-1.5 rounded transition-colors ${isItalic ? "bg-indigo-600 text-white" : "hover:bg-zinc-700 text-white"}`}
      title="Italic (Ctrl+I)"
    >
      <Italic className="w-4 h-4" />
    </button>
    <button
      onClick={onToggleUnderline}
      className={`p-1.5 rounded transition-colors ${isUnderline ? "bg-indigo-600 text-white" : "hover:bg-zinc-700 text-white"}`}
      title="Underline (Ctrl+U)"
    >
      <Underline className="w-4 h-4" />
    </button>
    <button
      onClick={onToggleStrike}
      className={`p-1.5 rounded transition-colors ${isStrike ? "bg-indigo-600 text-white" : "hover:bg-zinc-700 text-white"}`}
      title="Strikethrough"
    >
      <Strikethrough className="w-4 h-4" />
    </button>
    <div className="border-l border-zinc-700 mx-1"></div>
    <select
      value={fontSize}
      onChange={(e) => onFontSizeChange(Number(e.target.value))}
      onClick={(e) => e.stopPropagation()}
      className="bg-zinc-700 text-white text-xs rounded px-2 py-1"
    >
      {[8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72].map((size) => (
        <option key={size} value={size}>
          {size}px
        </option>
      ))}
    </select>
    <select
      value={fontFamily}
      onChange={(e) => onFontFamilyChange(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      className="bg-zinc-700 text-white text-xs rounded px-2 py-1 max-w-[120px]"
    >
      {FONT_FAMILIES.map((font) => (
        <option key={font} value={font}>
          {font}
        </option>
      ))}
    </select>
    {onColorChange && (
      <>
        <div className="border-l border-zinc-700 mx-1"></div>
        <input
          type="color"
          value={textColor}
          onChange={(e) => onColorChange(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="w-8 h-8 rounded cursor-pointer bg-zinc-700 border border-zinc-600"
          title="Text Color"
        />
      </>
    )}
  </div>
);
