import { Outlet } from "react-router";
import Header from "@/components/Home/Header";
import Modals from "@/components/Modal";
import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

export default function HomeLayout() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <section className="min-h-screen flex flex-col bg-black selection:bg-white/30">
      <Header />
      <main className="relative z-10">
        <Outlet />
      </main>
      <div className="mt-auto">
        {/* <Footer /> */}
      </div>
      <Modals />
    </section>
  );
}
