"use client";

import { motion } from "framer-motion";
import { FEATURE_CARDS, type FeatureCard } from "./constants";
import { fadeSlideUp } from "./motion-presets";

function FeatureIcon({ icon }: Pick<FeatureCard, "icon">) {
  switch (icon) {
    case "graph":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <circle cx="4" cy="6" r="2" />
          <circle cx="20" cy="6" r="2" />
          <circle cx="4" cy="18" r="2" />
          <circle cx="20" cy="18" r="2" />
          <path d="M6 7l4.5 3.5M18 7l-4.5 3.5M6 17l4.5-3.5M18 17l-4.5-3.5" />
        </svg>
      );
    case "cause":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      );
    case "knowledge":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M12 3c-1.5 3-4.5 5.5-4.5 9a4.5 4.5 0 009 0c0-3.5-3-6-4.5-9z" />
          <path d="M12 17v4M9 21h6" />
        </svg>
      );
  }
}

export function FeatureCards() {
  return (
    <motion.div
      className="mt-20 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5"
      variants={fadeSlideUp}
    >
      {FEATURE_CARDS.map((card) => (
        <motion.article
          key={card.title}
          className="glass-card group rounded-2xl p-5 text-left transition-all duration-500 hover:border-indigo-500/25 hover:bg-white/[0.06] sm:p-6"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-3 inline-flex rounded-xl border border-white/10 bg-indigo-500/10 p-2.5 text-indigo-300/80 transition-colors duration-300 group-hover:text-indigo-300">
            <FeatureIcon icon={card.icon} />
          </div>
          <h3 className="text-sm font-semibold tracking-wide text-white/85">
            {card.title}
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-white/40">
            {card.description}
          </p>
        </motion.article>
      ))}
    </motion.div>
  );
}
