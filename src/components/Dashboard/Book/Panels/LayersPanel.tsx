import { X, Eye, EyeOff, Lock, Unlock, ChevronUp, ChevronDown } from "lucide-react";
import type { TextType } from "../../shared/types/book.types";

interface LayersPanelProps {
  visible: boolean;
  texts: TextType[];
  selectedTextId: string | null;
  onClose: () => void;
  onSelectText: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onMoveLayer: (id: string, direction: "up" | "down") => void;
}

export const LayersPanel = ({
  visible,
  texts,
  selectedTextId,
  onClose,
  onSelectText,
  onToggleVisibility,
  onToggleLock,
  onMoveLayer,
}: LayersPanelProps) => {
  if (!visible) return null;

  return (
    <div className="absolute top-4 right-4 z-50 bg-zinc-800 rounded-lg p-3 shadow-xl border border-zinc-700 w-64 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white text-sm font-medium">Layers</h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-white">
          <X size={16} />
        </button>
      </div>
      <div className="flex flex-col gap-1">
        {texts.map((textItem, idx) => (
          <div
            key={textItem.id}
            className={`flex items-center gap-2 p-2 rounded ${selectedTextId === textItem.id ? "bg-indigo-600" : "bg-white/5 hover:bg-white/10"} transition-colors`}
          >
            <button
              onClick={() => onToggleVisibility(textItem.id)}
              className="text-zinc-400 hover:text-white"
            >
              {textItem.visible === false ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            <button
              onClick={() => onToggleLock(textItem.id)}
              className="text-zinc-400 hover:text-white"
            >
              {textItem.locked ? <Lock size={14} /> : <Unlock size={14} />}
            </button>
            <span
              className="text-white text-xs flex-1 truncate cursor-pointer"
              onClick={() => onSelectText(textItem.id)}
            >
              {textItem.name || textItem.text.substring(0, 20)}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => onMoveLayer(textItem.id, "up")}
                className="text-zinc-400 hover:text-white"
                disabled={idx === texts.length - 1}
              >
                <ChevronUp size={14} />
              </button>
              <button
                onClick={() => onMoveLayer(textItem.id, "down")}
                className="text-zinc-400 hover:text-white"
                disabled={idx === 0}
              >
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
