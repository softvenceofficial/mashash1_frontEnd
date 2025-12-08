import { X } from "lucide-react";
import { TEXT_TEMPLATES } from "../../shared/constants/templates";
import type { TextTemplate } from "../../shared/types/book.types";

interface TemplatesPanelProps {
  visible: boolean;
  onClose: () => void;
  onSelectTemplate: (template: TextTemplate) => void;
}

export const TemplatesPanel = ({ visible, onClose, onSelectTemplate }: TemplatesPanelProps) => {
  if (!visible) return null;

  return (
    <div className="absolute top-4 left-4 z-50 bg-zinc-800 rounded-lg p-3 shadow-xl border border-zinc-700">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white text-sm font-medium">Text Templates</h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-white">
          <X size={16} />
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {TEXT_TEMPLATES.map((template, idx) => (
          <button
            key={idx}
            onClick={() => onSelectTemplate(template)}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-sm text-white transition-colors text-left border border-white/10"
          >
            <span
              style={{
                fontSize: template.fontSize / 2,
                fontWeight: template.bold ? "bold" : "normal",
                fontStyle: template.italic ? "italic" : "normal",
              }}
            >
              {template.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
