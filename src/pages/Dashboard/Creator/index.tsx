import Tools from "@/components/Dashboard/Tools/Tools";
import Toolbox from "@/components/Dashboard/Toolbox/Toolbox";
import AIImageBox from "@/components/Dashboard/AI-Image-box/AIImageBox";
import Book from "@/components/Dashboard/Book/Book";
import AIImageType from "@/components/Dashboard/AI-Image-TypeBox/AIImageType";
import { SiteHeader } from "@/components/Dashboard/DashboardHeader";

export default function Creator() {
  return (
    <div>
      <SiteHeader />
      <div className="flex min-h-screen gap-4 mt-3">
        <div className="w-[23.3%]">
          <Tools />
          <AIImageBox />
        </div>
        <div className="w-[63.8%] bg-amber-900">
          <Toolbox />
          <Book />
        </div>
        <div className="w-[10.2%] bg-white">
          <AIImageType />
        </div>
      </div>
    </div>
  );
}
