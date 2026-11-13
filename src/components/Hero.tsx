import BrandLogo from "./BrandLogo";

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col px-6 pb-8 pt-24 md:px-12">
      <div className="flex flex-1 flex-col items-center justify-center gap-8">
        {/* The particle stage draws the logo here; the SVG is the fallback until it is ready. */}
        <div data-slot="hero" className="hero-rise flex aspect-square w-[min(46vmin,440px)] min-w-[220px] items-center justify-center">
          <BrandLogo className="stage-fallback h-full w-auto text-[var(--color-fg)]" />
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="font-display text-lg font-medium tracking-[0.3em] md:text-[22px]">
            HIROKI YANAGISAWA
          </h1>
          <p className="hero-rise font-mono text-xs tracking-[0.25em] text-[var(--color-fg-muted)] [animation-delay:240ms]">
            CTO / ENGINEER
          </p>
        </div>
      </div>

      <div className="hero-rise flex items-center justify-between font-mono text-xs tracking-[0.2em] text-[var(--color-fg-muted)] [animation-delay:360ms]">
        <span>OSAKA → TOKYO</span>
        <span aria-hidden>SCROLL ↓</span>
      </div>
    </section>
  );
}
