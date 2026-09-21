"use client";

import { motion } from "framer-motion";
import { fadeSlideUp } from "./motion-presets";

export function ExploreButton() {
  return (
    <motion.div className="mt-8" variants={fadeSlideUp}>
      <motion.button
        type="button"
        className="btn-glow group relative overflow-hidden rounded-full px-10 py-4 text-sm font-semibold tracking-wide text-white sm:px-12 sm:text-base"
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.98, y: 0 }}
        aria-label="Start exploring knowledge"
      >
        <span
          className="btn-shimmer pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden="true"
        />
        <span className="relative flex items-center gap-2">
          Start Exploring
          <svg
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </span>
      </motion.button>
    </motion.div>
  );
}
