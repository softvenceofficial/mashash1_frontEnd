import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationControlsProps {
  onPrev: () => void;
  onNext: () => void;
}

export const NavigationControls = ({ onPrev, onNext }: NavigationControlsProps) => (
  <>
    <button
      onClick={onPrev}
      className="absolute left-4 z-50 p-3 bg-primary rounded-lg text-white shadow-lg hover:bg-primary/90 transition-all hover:scale-110 active:scale-95"
    >
      <ChevronLeft size={24} />
    </button>
    <button
      onClick={onNext}
      className="absolute right-4 z-50 p-3 bg-primary rounded-lg text-white shadow-lg hover:bg-primary/90 transition-all hover:scale-110 active:scale-95"
    >
      <ChevronRight size={24} />
    </button>
  </>
);
