import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ZoomControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export const ZoomControls = ({ zoom, onZoomChange }: ZoomControlsProps) => (
  <div className="bg-[#2B2B2B] rounded-lg p-1 flex flex-col gap-1">
    <Button
      size="icon"
      variant="ghost"
      className="h-8 w-8 text-white hover:bg-white/20"
      onClick={() => onZoomChange(Math.min(zoom + 0.1, 2))}
    >
      <Plus size={16} />
    </Button>
    <Button
      size="icon"
      variant="ghost"
      className="h-8 w-8 text-white hover:bg-white/20"
      onClick={() => onZoomChange(Math.max(zoom - 0.1, 0.5))}
    >
      <Minus size={16} />
    </Button>
  </div>
);
