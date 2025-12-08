import { RotateCw } from "lucide-react";

export const RefreshButton = ({ onClick }: { onClick?: () => void }) => (
  <div
    className="flex flex-col items-center mr-4 cursor-pointer group"
    onClick={onClick}
  >
    <RotateCw className="w-5 h-5 text-zinc-400 group-hover:text-white group-hover:rotate-180 transition-all duration-500" />
    <span className="text-[10px] text-zinc-500 mt-1 font-medium tracking-wide group-hover:text-zinc-300">Refresh</span>
  </div>
);
