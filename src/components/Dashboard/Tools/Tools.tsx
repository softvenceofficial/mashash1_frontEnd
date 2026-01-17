import { HiOutlineBookOpen } from "react-icons/hi";
import { RxText } from "react-icons/rx";
import { IoBrushOutline, IoColorPaletteOutline } from "react-icons/io5";
import { GiPencilBrush } from "react-icons/gi";
import { LiaShapesSolid } from "react-icons/lia";
import { cn } from "@/lib/utils";

interface ToolsProps {
  activeTool: string;
  setActiveTool: (tool: string) => void;
}

const Tools = ({ activeTool, setActiveTool }: ToolsProps) => {
  const tools = [
    { icon: HiOutlineBookOpen, label: "Book Size" },
    { icon: RxText, label: "Text" },
    { icon: IoColorPaletteOutline, label: "Color" },
    { icon: IoBrushOutline, label: "Brush" },
    { icon: GiPencilBrush, label: "Tool" },
    { icon: LiaShapesSolid, label: "Shapes" }
  ];

  return (
    <div className="w-full h-[107px] opacity-100 rounded-tr-lg rounded-br-lg bg-secondary flex justify-start items-center gap-1.5 py-4 px-[11px]">
      {tools.map((tool, index) => {
        const Icon = tool.icon;
        const isActive = activeTool === tool.label;
        
        return (
          <div 
            key={index}
            className="w-[16.6%] flex justify-center items-center flex-col cursor-pointer group transition-all duration-300 ease-in-out"
            onClick={() => setActiveTool(tool.label)}
          >
            <div className={cn(
              "w-11 h-11 rounded-full flex justify-center items-center transition-all duration-300 ease-in-out transform",
              isActive 
                ? 'bg-primary scale-110 shadow-lg' 
                : 'bg-transparent group-hover:bg-primary/20'
            )}>
              <Icon className={cn(
                "w-6 h-6 transition-all duration-300 ease-in-out",
                isActive ? 'text-white' : 'text-gray-600 dark:text-gray-300'
              )} />
            </div>
            <p className={cn(
              "font-normal text-sm leading-[100%] tracking-[0px] text-center font-Roboto transition-all duration-300 ease-in-out",
              isActive 
                ? 'text-primary font-medium dark:text-white mt-3.5' 
                : 'text-gray-600 dark:text-white mt-2'
            )}>
              {tool.label}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Tools;