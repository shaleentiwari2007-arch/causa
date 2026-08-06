"use client";

import { motion } from "framer-motion";
import { PARTICLES } from "./constants";
import { KnowledgeGraph } from "./knowledge-graph";
import { Starfield } from "./starfield";
import { useParallax } from "./use-parallax";

export function ParallaxBackground() {
  const { x, y } = useParallax(1);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <Starfield parallaxX={x} parallaxY={y} />

      <motion.div
        className="absolute inset-0 nebula-glow"
        style={{ x: x * 24, y: y * 20 }}
      />

      <motion.div
        className="absolute left-1/2 top-[38%] h-[min(600px,80vw)] w-[min(600px,80vw)] -translate-x-1/2 -translate-y-1/2 rounded-full nebula-orb blur-[100px]"
        style={{ x: x * 40, y: y * 32 }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div style={{ x: x * 12, y: y * 10 }}>
        <KnowledgeGraph />
      </motion.div>

      {PARTICLES.map((particle, index) => (
        <span
          key={index}
          className="particle particle-glow"
          style={{
            top: particle.top,
            left: particle.left,
            width: particle.size,
            height: particle.size,
            color: particle.color,
            backgroundColor: particle.color,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            transform: `translate(${x * 6}px, ${y * 5}px)`,
          }}
        />
      ))}
    </div>
  );
}
