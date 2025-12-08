import { useRef, useEffect } from "react";
import { TextEditorToolbar } from "./TextEditorToolbar";

interface InlineTextEditorProps {
  visible: boolean;
  value: string;
  position: { x: number; y: number };
  fontSize: number;
  fontFamily: string;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrike: boolean;
  textColor?: string;
  onChange: (value: string) => void;
  onComplete: () => void;
  onFontSizeChange: (size: number) => void;
  onFontFamilyChange: (family: string) => void;
  onToggleBold: () => void;
  onToggleItalic: () => void;
  onToggleUnderline: () => void;
  onToggleStrike: () => void;
  onColorChange?: (color: string) => void;
}

export const InlineTextEditor = ({
  visible,
  value,
  position,
  fontSize,
  fontFamily,
  isBold,
  isItalic,
  isUnderline,
  isStrike,
  textColor = "#000000",
  onChange,
  onComplete,
  onFontSizeChange,
  onFontFamilyChange,
  onToggleBold,
  onToggleItalic,
  onToggleUnderline,
  onToggleStrike,
  onColorChange,
}: InlineTextEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (visible && textareaRef.current) {
        const editorElement = textareaRef.current.parentElement;
        if (editorElement && !editorElement.contains(e.target as Node)) {
          onComplete();
        }
      }
    };

    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [visible, onComplete]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: position.y,
        left: position.x,
        zIndex: 1000,
        minWidth: "350px",
        background: "white",
        borderRadius: "8px",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
        overflow: "hidden",
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <TextEditorToolbar
        fontSize={fontSize}
        fontFamily={fontFamily}
        isBold={isBold}
        isItalic={isItalic}
        isUnderline={isUnderline}
        isStrike={isStrike}
        textColor={textColor}
        onFontSizeChange={onFontSizeChange}
        onFontFamilyChange={onFontFamilyChange}
        onToggleBold={onToggleBold}
        onToggleItalic={onToggleItalic}
        onToggleUnderline={onToggleUnderline}
        onToggleStrike={onToggleStrike}
        onColorChange={onColorChange}
      />
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            onComplete();
          }
          if ((e.ctrlKey || e.metaKey) && e.key === "b") {
            e.preventDefault();
            onToggleBold();
          }
          if ((e.ctrlKey || e.metaKey) && e.key === "i") {
            e.preventDefault();
            onToggleItalic();
          }
          if ((e.ctrlKey || e.metaKey) && e.key === "u") {
            e.preventDefault();
            onToggleUnderline();
          }
        }}
        className="w-full min-h-[100px] p-3 text-sm border-none outline-none resize-none"
        style={{
          fontFamily,
          fontSize: `${fontSize}px`,
          fontWeight: isBold ? "bold" : "normal",
          fontStyle: isItalic ? "italic" : "normal",
          textDecoration: `${isUnderline ? "underline" : ""} ${isStrike ? "line-through" : ""}`.trim(),
          color: textColor,
        }}
        autoFocus
      />
      <div className="bg-zinc-800 p-2 flex justify-end border-t border-zinc-700">
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onComplete();
          }}
          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded transition-colors"
        >
          Done (Esc)
        </button>
      </div>
    </div>
  );
};
