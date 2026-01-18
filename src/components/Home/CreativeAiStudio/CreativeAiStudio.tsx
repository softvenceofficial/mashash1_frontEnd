import { Button } from "@/components/ui/button";
import aiCreator from "@/assets/images/ai-creator.png";
import { LuxuryReveal } from "@/components/common/LuxuryReveal";

export default function CreativeAiStudio() {
  return (
    <section className="container mx-auto py-20 px-5">
      <div className="flex flex-col-reverse lg:flex-row items-center gap-10 w-full">
        <div className="lg:w-1/2">
          <LuxuryReveal direction="left" delay={0.2}>
            <img src={aiCreator} alt="Creative AI Studio" className="w-full h-full" />
          </LuxuryReveal>
        </div>
        <div className="lg:w-1/2">
          <LuxuryReveal direction="right">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 text-center lg:text-left text-white">
              Creative.ai lets kids turn their wild ideas into real books and cards fast, fun, and all theirs
            </h1>
          </LuxuryReveal>

          <LuxuryReveal direction="right" delay={0.2}>
            <p className="text-base md:text-lg font-medium text-[#C4CDD5] mb-10 text-center lg:text-left">
              Whether you're writing your very first story, shaping a colorful picture book, or creating a heartfelt card for someone special, eBook-AI gives you a simple path from idea to finished creation. No stress, no confusion—just a smooth, playful way to bring your imagination to life."
            </p>
          </LuxuryReveal>
          
          <LuxuryReveal direction="up" delay={0.4}>
            <Button className="bg-linear-to-r from-[#6366F1] via-[#E294AC] to-[#E0AD8C] text-base font-semibold px-6 h-12 rounded-[12px] cursor-pointer justify-center w-full md:w-auto">
              Explore Instantly
            </Button>
          </LuxuryReveal>
        </div>
      </div>
    </section>
  );
}
