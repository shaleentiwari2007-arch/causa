export type Particle = {
  top: string;
  left: string;
  size: number;
  color: string;
  duration: number;
  delay: number;
};

export type FeatureCard = {
  title: string;
  description: string;
  icon: "graph" | "cause" | "knowledge";
};

export const PARTICLES: Particle[] = [
  { top: "12%", left: "8%", size: 3, color: "rgba(99,102,241,0.6)", duration: 14, delay: 0 },
  { top: "25%", left: "88%", size: 2, color: "rgba(139,92,246,0.5)", duration: 18, delay: 2 },
  { top: "70%", left: "15%", size: 4, color: "rgba(99,102,241,0.4)", duration: 16, delay: 1 },
  { top: "55%", left: "92%", size: 2, color: "rgba(167,139,250,0.55)", duration: 20, delay: 3 },
  { top: "85%", left: "45%", size: 3, color: "rgba(99,102,241,0.35)", duration: 15, delay: 0.5 },
  { top: "18%", left: "55%", size: 2, color: "rgba(139,92,246,0.45)", duration: 17, delay: 4 },
  { top: "42%", left: "5%", size: 2, color: "rgba(167,139,250,0.4)", duration: 19, delay: 1.5 },
  { top: "38%", left: "78%", size: 3, color: "rgba(99,102,241,0.5)", duration: 13, delay: 2.5 },
  { top: "62%", left: "62%", size: 2, color: "rgba(139,92,246,0.35)", duration: 21, delay: 0.8 },
  { top: "8%", left: "72%", size: 2, color: "rgba(99,102,241,0.55)", duration: 16, delay: 3.5 },
  { top: "78%", left: "82%", size: 3, color: "rgba(167,139,250,0.45)", duration: 14, delay: 1.2 },
  { top: "48%", left: "35%", size: 2, color: "rgba(99,102,241,0.3)", duration: 22, delay: 5 },
];

export const FEATURE_CARDS: FeatureCard[] = [
  {
    icon: "graph",
    title: "Connected Ideas",
    description: "Trace relationships across concepts like stars in a constellation.",
  },
  {
    icon: "cause",
    title: "Cause & Effect",
    description: "Every question opens a path — follow the chain of understanding.",
  },
  {
    icon: "knowledge",
    title: "Living Knowledge",
    description: "Explore a universe that grows and illuminates with every discovery.",
  },
];
