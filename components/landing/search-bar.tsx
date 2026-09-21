"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeSlideUp } from "./motion-presets";

export function SearchBar() {
  const [focused, setFocused] = useState(false);

  return (
    <motion.div className="mt-14 w-full max-w-xl" variants={fadeSlideUp}>
      <label htmlFor="causa-search" className="sr-only">
        Search for a topic to explore
      </label>
      <div
        className={`glass-card search-glow flex items-center gap-3 rounded-2xl px-5 py-4 transition-all duration-500 sm:px-6 sm:py-5 ${
          focused ? "search-glow-active" : ""
        }`}
      >
        <svg
          className={`h-5 w-5 shrink-0 transition-colors duration-300 ${
            focused ? "text-indigo-300" : "text-indigo-400/60"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          id="causa-search"
          type="search"
          placeholder="What are you curious about?"
          className="w-full bg-transparent text-base text-white/90 placeholder:text-white/30 outline-none focus-visible:outline-none sm:text-lg"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete="off"
          enterKeyHint="search"
        />
        <kbd className="hidden shrink-0 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-medium tracking-wider text-white/30 sm:inline-block">
          ↵
        </kbd>
      </div>
    </motion.div>
  );
}
