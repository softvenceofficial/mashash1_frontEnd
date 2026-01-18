import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface LuxuryRevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export const LuxuryReveal = ({ children, width = "fit-content", delay = 0, direction = "up" }: LuxuryRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const getDirectionOffset = () => {
    switch (direction) {
      case "up": return { y: 75, x: 0 };
      case "down": return { y: -75, x: 0 };
      case "left": return { x: 75, y: 0 };
      case "right": return { x: -75, y: 0 };
      default: return { y: 75, x: 0 };
    }
  };

  return (
    <div ref={ref} style={{ position: "relative", width, overflow: "hidden" }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, ...getDirectionOffset() },
          visible: { opacity: 1, x: 0, y: 0 },
        }}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration: 0.8, delay: delay, ease: [0.25, 0.25, 0.25, 0.75] }}
      >
        {children}
      </motion.div>
    </div>
  );
};
