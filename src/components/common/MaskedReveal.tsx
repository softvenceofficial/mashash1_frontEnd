import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface MaskedRevealProps {
  children: string;
  className?: string;
  delay?: number;
}

export const MaskedReveal = ({ children, className = "", delay = 0 }: MaskedRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const variants = {
    hidden: { y: "100%", opacity: 0 },
    visible: (i: number) => ({
      y: "0%",
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
        delay: delay + i * 0.03,
      },
    }),
  };

  const words = children.split(" ");

  return (
    <div ref={ref} className={`overflow-hidden flex flex-wrap gap-x-2 ${className}`}>
      {words.map((word, i) => (
        <div key={i} className="overflow-hidden relative inline-block">
          <motion.span
            custom={i}
            variants={variants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="inline-block"
          >
            {word}
          </motion.span>
        </div>
      ))}
    </div>
  );
};
