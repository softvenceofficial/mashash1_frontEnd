import StoryCarousel from "./StoryCarousel";
import { LuxuryReveal } from "@/components/common/LuxuryReveal";

export default function StorybookShowcase() {

  return (
    <section className="pt-20 md:pb-20 md:min-h-screen  relative">
        <div className="absolute h-20 bg-black blur-2xl top-4 right-0 w-full"/>
      <div className="mx-auto w-fit mb-20 text-center relative flex flex-col items-center">
        <LuxuryReveal direction="up">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold max-w-4xl px-4 md:px-0 text-white">Pick a moment, a feeling, or a line that keeps knocking on your mind.</h1>
        </LuxuryReveal>

        <LuxuryReveal direction="up" delay={0.2}>
          <p className="text-lg font-normal text-[#C4CDD5] mt-4 px-4 md:px-0">Turn any sentence into a custom image you can tweak, restyle, and make your own.</p>
        </LuxuryReveal>
      </div>
      <div className="h-full">
        <LuxuryReveal delay={0.4} width="100%">
          <StoryCarousel />
        </LuxuryReveal>
      </div>
    </section>
  );
}
