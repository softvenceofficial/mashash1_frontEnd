import { Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageControlsProps {
  pageCount: number;
  onAddPage: () => void;
  onToggleLayers: () => void;
  onToggleTemplates: () => void;
}

export const PageControls = ({ pageCount, onAddPage, onToggleLayers, onToggleTemplates }: PageControlsProps) => (
  <>
    <Button
      size="icon"
      variant="secondary"
      className="h-10 w-10 rounded-lg bg-[#2B2B2B] text-primary hover:bg-[#333] border-none"
    >
      <Maximize size={18} />
    </Button>
    <Button
      size="icon"
      variant="secondary"
      className="h-10 w-10 rounded-lg bg-[#2B2B2B] text-white hover:bg-[#333] border-none"
      onClick={onToggleLayers}
      title="Layers"
    >
      L
    </Button>
    <Button
      size="icon"
      variant="secondary"
      className="h-10 w-10 rounded-lg bg-[#2B2B2B] text-white hover:bg-[#333] border-none"
      onClick={onToggleTemplates}
      title="Templates"
    >
      T
    </Button>
    <div className="bg-primary text-white text-xs px-2 py-1 rounded text-center">
      {pageCount} Pages
    </div>
    <Button
      size="sm"
      variant="outline"
      className="text-xs h-7 bg-white/10 text-white hover:bg-white/20 border-none"
      onClick={onAddPage}
    >
      + Add Page
    </Button>
  </>
);
