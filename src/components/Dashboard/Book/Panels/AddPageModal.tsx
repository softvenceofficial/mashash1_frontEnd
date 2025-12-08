import { useState } from "react";
import { X } from "lucide-react";

interface AddPageModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (count: number) => void;
}

export const AddPageModal = ({ visible, onClose, onAdd }: AddPageModalProps) => {
  const [pagesToAdd, setPagesToAdd] = useState("2");

  if (!visible) return null;

  const handleAdd = () => {
    const num = parseInt(pagesToAdd);
    if (num > 0) {
      onAdd(num);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-100 backdrop-blur-sm">
      <div className="bg-card rounded-xl p-6 w-80 shadow-2xl border border-white/10 animate-in zoom-in-95">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-foreground">Add Pages</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            How many pages?
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={pagesToAdd}
            onChange={(e) => setPagesToAdd(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-border rounded-md text-foreground hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
