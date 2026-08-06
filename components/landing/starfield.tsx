"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type Star = {
  x: number;
  y: number;
  radius: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  hue: number;
};

const STAR_COUNT = 280;

function createStars(width: number, height: number): Star[] {
  return Array.from({ length: STAR_COUNT }, () => {
    const roll = Math.random();
    const radius = roll > 0.92 ? 2.2 : roll > 0.7 ? 1.4 : 0.7;

    return {
      x: Math.random() * width,
      y: Math.random() * height,
      radius,
      baseOpacity: 0.25 + Math.random() * 0.55,
      twinkleSpeed: 0.4 + Math.random() * 1.6,
      twinkleOffset: Math.random() * Math.PI * 2,
      hue: 210 + Math.random() * 40,
    };
  });
}

type StarfieldProps = {
  parallaxX?: number;
  parallaxY?: number;
};

export function Starfield({ parallaxX = 0, parallaxY = 0 }: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const frameRef = useRef<number>(0);
  const parallaxRef = useRef({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();

  parallaxRef.current = { x: parallaxX, y: parallaxY };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      starsRef.current = createStars(width, height);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = (time: number) => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      const { x, y } = parallaxRef.current;
      const offsetX = x * 18;
      const offsetY = y * 14;

      for (const star of starsRef.current) {
        const twinkle = prefersReducedMotion
          ? 1
          : 0.55 + 0.45 * Math.sin(time * 0.001 * star.twinkleSpeed + star.twinkleOffset);
        const opacity = star.baseOpacity * twinkle;

        ctx.beginPath();
        ctx.arc(star.x + offsetX, star.y + offsetY, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${star.hue}, 30%, 92%, ${opacity})`;
        ctx.fill();

        if (star.radius > 1.8) {
          ctx.beginPath();
          ctx.arc(star.x + offsetX, star.y + offsetY, star.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${star.hue}, 50%, 80%, ${opacity * 0.15})`;
          ctx.fill();
        }
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, [prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
