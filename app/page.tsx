import { HeroSection } from "@/components/landing/hero-section";
import { ParallaxBackground } from "@/components/landing/parallax-background";
import { ScrollIndicator } from "@/components/landing/scroll-indicator";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#030014]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to main content
      </a>

      <ParallaxBackground />
      <HeroSection />
      <ScrollIndicator />

      <section
        id="features-anchor"
        className="pointer-events-none absolute bottom-0 h-px w-full opacity-0"
        aria-hidden="true"
      />
    </div>
  );
}
