"use client";

import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export type ParallaxOffset = { x: number; y: number };

export function useParallax(intensity = 1): ParallaxOffset {
  const prefersReducedMotion = useReducedMotion();
  const [offset, setOffset] = useState<ParallaxOffset>({ x: 0, y: 0 });

  const handleMove = useCallback(
    (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2 * intensity;
      const y = (event.clientY / window.innerHeight - 0.5) * 2 * intensity;
      setOffset({ x, y });
    },
    [intensity],
  );

  useEffect(() => {
    if (prefersReducedMotion) return;

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [handleMove, prefersReducedMotion]);

  return prefersReducedMotion ? { x: 0, y: 0 } : offset;
}
