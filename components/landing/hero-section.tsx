"use client";

import { motion } from "framer-motion";
import { ExploreButton } from "./explore-button";
import { FeatureCards } from "./feature-cards";
import { fadeSlideUp, staggerContainer } from "./motion-presets";
import { SearchBar } from "./search-bar";

export function HeroSection() {
  return (
    <main
      id="main-content"
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-24 sm:px-8"
    >
      <motion.div
        className="mx-auto flex w-full max-w-3xl flex-col items-center text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeSlideUp}>
          <span className="status-badge inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-indigo-200/70">
            <span className="status-dot h-1.5 w-1.5 rounded-full bg-indigo-400" aria-hidden="true" />
            AI Knowledge Explorer
          </span>
        </motion.div>

        <motion.h1
          variants={fadeSlideUp}
          className="title-gradient mt-8 text-7xl font-bold tracking-[0.14em] sm:text-8xl md:text-9xl lg:text-[10rem] lg:leading-none"
        >
          CAUSA
        </motion.h1>

        <motion.p
          variants={fadeSlideUp}
          className="mt-7 text-xl font-medium tracking-tight text-white/80 sm:text-2xl md:text-3xl"
        >
          Everything has a cause.
        </motion.p>

        <motion.p
          variants={fadeSlideUp}
          className="mt-5 max-w-lg text-sm leading-relaxed text-white/45 sm:text-base sm:leading-7"
        >
          Explore knowledge as a living universe of connected ideas.
        </motion.p>

        <SearchBar />
        <ExploreButton />
        <FeatureCards />
      </motion.div>

      <motion.footer
        className="mt-auto pt-20 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <p className="text-[11px] tracking-widest text-white/20 uppercase">
          CAUSA &mdash; The architecture of understanding
        </p>
      </motion.footer>
    </main>
  );
}
