import { Button } from "@/components/ui/button";
import imagin from "@/assets/images/imagin.png";
import { LuxuryReveal } from "@/components/common/LuxuryReveal";

export default function ImaginationLab() {
  return (
    <section className="relative ">
      <div className="container mx-auto py-20 px-5">
        <div className="flex flex-col lg:flex-row items-center gap-13 ma:gap-10 w-full">
          <div className="lg:w-1/2">
            <LuxuryReveal direction="right">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-8 md:mb-4 text-white text-center md:text-left" >
                A playful studio where kids turn imagination into real books and
                cards.
              </h1>
            </LuxuryReveal>
            
            <LuxuryReveal delay={0.2} direction="right">
              <p className="text-lg font-medium text-[#C4CDD5] text-center md:text-left">     
                Our platform was created to redefine the way digital books are
                made and shared. We combine powerful creation tools with a simple
                interface that inspires creativity in every user.
              </p>
            </LuxuryReveal>

            <LuxuryReveal delay={0.3} direction="right">
              <p className="text-lg font-medium text-[#C4CDD5] my-10 text-center md:text-left">
                We're passionate about storytelling, design, and education — and
                we're constantly improving to make book creation faster, smarter,
                and more enjoyable for everyone.
              </p>
            </LuxuryReveal>

            <LuxuryReveal delay={0.4} direction="up">
              <Button className="bg-linear-to-r from-[#6366F1] via-[#E294AC] to-[#E0AD8C] text-base font-semibold px-6 h-12 rounded-[12px] cursor-pointer justify-center w-full md:w-auto md:justify-start">
                Explore Instantly
              </Button>
            </LuxuryReveal>
          </div>
          
          <div className="relative lg:w-1/2">
            <LuxuryReveal direction="left" delay={0.3}>
              <div className="relative">
                <div className="h-full w-10 bg-black blur-[10px] absolute -left-4 top-0" />
                <div className="h-full w-10 bg-black blur-[10px] absolute -right-4 top-0" />
                <div className="h-10 w-full bg-black blur-[10px] absolute left-0 -top-4" />
                <div className="h-10 w-full bg-black blur-[10px] absolute left-0 -bottom-4" />
                <img src={imagin} alt="Imagination Lab" className="w-full h-full" />
              </div>
            </LuxuryReveal>
          </div>
        </div>
      </div>
      <div className="absolute h-10 w-full bg-black -bottom-4 left-0 blur-[10px]" />
    </section>
  );
}
