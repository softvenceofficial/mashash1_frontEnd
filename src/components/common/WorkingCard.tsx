import ThreeDotButton from "./ThreeDotButton";
import TrashThreeDotButton from "./TrashThreeDotButton";
import { ArrowRight } from "lucide-react";

export default function WorkingCard({
  work,
}: {
  work: { id: number; title: string; date: string; imageUrl: string };
}) {
  const pathName = window.location.pathname;
  const fallbackImage = "https://images.unsplash.com/photo-1622308643382-706dbb20e0bf?q=80&w=1000&auto=format&fit=crop";
  
  return (
    <div className="group relative w-full rounded-3xl bg-card/95 border border-border p-6 shadow-xl transition-all duration-500 hover:bg-card hover:-translate-y-2 [perspective:1500px]">
      <div className="absolute z-50 top-4 right-4">
        {pathName.includes("trash") ? <TrashThreeDotButton bookId={work.id} /> : <ThreeDotButton bookId={work.id} />}
      </div>

      <div className="relative w-[180px] sm:w-[200px] h-[280px] mx-auto mb-8 [perspective:1200px]">
        <div className="w-full h-full relative [transform-style:preserve-3d] transition-transform duration-700 ease-out group-hover:[transform:rotateY(-30deg)_translate(-15px,-20px)]">
          <div className="absolute inset-0 z-20 shadow-xl group-hover:shadow-2xl transition-shadow duration-700 rounded-r-md overflow-hidden bg-muted border-l-[3px] border-border">
            <img
              src={work.imageUrl || fallbackImage}
              alt={work.title || "Artbook Cover"}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-background/40 via-transparent to-foreground/20 opacity-60" />
          </div>
          <div className="absolute inset-0 bg-muted rounded-r-md [transform:translateZ(-40px)] shadow-none group-hover:shadow-[25px_25px_40px_rgba(0,0,0,0.6)] transition-all duration-700 border-l-[3px] border-border" />
        </div>
      </div>

      <div className="text-left mt-2">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-card-foreground leading-tight mb-1 truncate" title={work.title || "Untitled Book"}>
              {work.title || "Untitled Artbook"}
            </h2>
            <p className="text-primary text-sm font-medium mb-5">
              Created: {work.date}
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-primary/20 text-primary rounded-md">Artbook</span>
        </div>
        <button className="w-full py-3 bg-accent hover:bg-accent/80 border border-border rounded-xl text-accent-foreground text-sm font-semibold transition-all flex items-center justify-center gap-2 group/btn">
          Open Artbook
          <ArrowRight size={16} className="group-hover/btn:translate-x-1.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
