import Tools from "@/components/Dashboard/Tools/Tools";
import Toolbox from "@/components/Dashboard/Toolbox/Toolbox";
import AIImageBox from "@/components/Dashboard/AI-Image-box/AIImageBox";
import Book from "@/components/Dashboard/Book/Book";
import AIImageType from "@/components/Dashboard/AI-Image-TypeBox/AIImageType";


export default function HomePage() {


  return (
    <div className="flex min-h-screen gap-4 mt-3">
      <div className="w-[27.3%] bg-amber-100">
        <Tools/>
        <AIImageBox/>
      </div>
      <div className="w-[62.8%] bg-amber-900">
        <Toolbox/>
        <Book/>
      </div>
      <div className="w-[7.2%] bg-white">
        <AIImageType/>
      </div>
    </div>
  );
}
