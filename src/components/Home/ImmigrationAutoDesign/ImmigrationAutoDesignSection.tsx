import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ParallaxImage } from "@/components/common/ParallaxImage";
import imagination1 from "@/assets/images/imagination1.png";
import imagination2 from "@/assets/images/imagination2.png";
import imagination3 from "@/assets/images/imagination3.png";
import imagination4 from "@/assets/images/imagination4.png";
import imagination5 from "@/assets/images/imagination5.png";
import imagination6 from "@/assets/images/imagination6.png";
import imagination7 from "@/assets/images/imagination7.png";
import imagination8 from "@/assets/images/imagination8.png";
import imagination9 from "@/assets/images/imagination9.png";
import imagination10 from "@/assets/images/imagination10.png";
import imagination11 from "@/assets/images/imagination11.png";
import imagination12 from "@/assets/images/imagination12.png";

gsap.registerPlugin(ScrollTrigger);

export default function ImmigrationAutoDesignSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });

      const images = containerRef.current?.querySelectorAll(".grid > div");
      if (images) {
        gsap.fromTo(images, 
          { y: 100, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            stagger: {
              amount: 1,
              grid: [2, 6],
              from: "center"
            },
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 70%",
            }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-20 container mx-auto mt-10" ref={containerRef}>
      <h1 ref={titleRef} className="text-3xl md:text-4xl lg:text-5xl font-semibold max-w-3xl text-center mx-auto px-4 mx:px-0 text-white mb-20">
        Let your immigration info shape the Entire Design Automatically.
      </h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 lg:grid-rows-5 gap-4 lg:h-[600px] mt-13 px-2 lg:px-0">
        <div className="h-full lg:row-span-2 rounded-2xl overflow-hidden shadow-[0_0_25px_5px_rgba(54,54,54,0.3)]">
          <ParallaxImage src={imagination1} alt="Imagination 1" className="h-60 lg:h-full w-full" />
        </div>
        <div className="h-full lg:row-span-3 rounded-2xl overflow-hidden shadow-[0_0_25px_5px_rgba(54,54,54,0.3)]">
          <ParallaxImage src={imagination2} alt="Imagination 2" className="h-60 lg:h-full w-full" />
        </div>
        <div className="h-full lg:row-span-2 rounded-2xl overflow-hidden shadow-[0_0_25px_5px_rgba(54,54,54,0.3)]">
          <ParallaxImage src={imagination3} alt="Imagination 3" className="h-60 lg:h-full w-full" />
        </div>
        <div className="h-full lg:row-span-3 rounded-2xl overflow-hidden shadow-[0_0_25px_5px_rgba(54,54,54,0.3)]">
          <ParallaxImage src={imagination4} alt="Imagination 4" className="h-60 lg:h-full w-full" />
        </div>
        <div className="h-full lg:row-span-2 rounded-2xl overflow-hidden shadow-[0_0_25px_5px_rgba(54,54,54,0.3)]">
          <ParallaxImage src={imagination5} alt="Imagination 5" className="h-60 lg:h-full w-full" />
        </div>
        <div className="h-full lg:row-span-3 rounded-2xl overflow-hidden shadow-[0_0_25px_5px_rgba(54,54,54,0.3)]">
          <ParallaxImage src={imagination6} alt="Imagination 6" className="h-60 lg:h-full w-full" />
        </div>
        <div className="h-full lg:row-span-3 rounded-2xl overflow-hidden shadow-[0_0_25px_5px_rgba(54,54,54,0.3)]">
          <ParallaxImage src={imagination7} alt="Imagination 7" className="h-60 lg:h-full w-full" />
        </div>
        <div className="h-full lg:row-span-3 rounded-2xl overflow-hidden shadow-[0_0_25px_5px_rgba(54,54,54,0.3)]">
          <ParallaxImage src={imagination8} alt="Imagination 8" className="h-60 lg:h-full w-full" />
        </div>
        <div className="h-full lg:row-span-3 rounded-2xl overflow-hidden shadow-[0_0_25px_5px_rgba(54,54,54,0.3)]">
          <ParallaxImage src={imagination9} alt="Imagination 9" className="h-60 lg:h-full w-full" />
        </div>
        <div className="h-full lg:row-span-2 rounded-2xl overflow-hidden shadow-[0_0_25px_5px_rgba(54,54,54,0.3)]">
          <ParallaxImage src={imagination10} alt="Imagination 10" className="h-60 lg:h-full w-full" />
        </div>
        <div className="h-full lg:row-span-2 rounded-2xl overflow-hidden shadow-[0_0_25px_5px_rgba(54,54,54,0.3)]">
          <ParallaxImage src={imagination11} alt="Imagination 11" className="h-60 lg:h-full w-full" />
        </div>
        <div className="h-full lg:row-span-2 rounded-2xl overflow-hidden shadow-[0_0_25px_5px_rgba(54,54,54,0.3)]">
          <ParallaxImage src={imagination12} alt="Imagination 12" className="h-60 lg:h-full w-full" />
        </div>
      </div>
    </section>
  );
}
