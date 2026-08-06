"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeIn } from "./motion-presets";

export function ScrollIndicator() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
      variants={fadeIn}
      custom={1.1}
      initial="hidden"
      animate="visible"
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-2">
        <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/25">
          Scroll
        </span>
        <motion.div
          className="flex h-9 w-5 items-start justify-center rounded-full border border-white/15 p-1.5"
          animate={prefersReducedMotion ? {} : { opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.span
            className="h-1.5 w-1 rounded-full bg-white/50"
            animate={prefersReducedMotion ? {} : { y: [0, 10, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
