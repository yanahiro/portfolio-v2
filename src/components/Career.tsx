"use client";

import { useRef, useState } from "react";
import { CAREER } from "@/data/career";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { CAREER_TRIGGER_ID, careerScene } from "@/lib/particles/scenes";

/** Scroll distance of the pinned section, in viewport heights. */
const PIN_LENGTH = 4.5;

export default function Career() {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [scene, setScene] = useState(0);

  useGSAP(
    () => {
      ScrollTrigger.create({
        id: CAREER_TRIGGER_ID,
        trigger: pinRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * PIN_LENGTH}`,
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
          setScene(careerScene(self.progress));
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <section id="career" ref={rootRef} aria-label="経歴">
      <div ref={pinRef} className="relative flex h-[100svh] flex-col justify-end px-6 pb-8 md:px-12">
        {/* The particle stage morphs through the career shapes inside this box. */}
        <div
          data-slot="career"
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[44%] aspect-square w-[min(58vmin,520px)] -translate-x-1/2 -translate-y-1/2"
        />

        <ol className="relative h-40 md:h-44">
          {CAREER.map((item, i) => (
            <li key={item.when} className="career-caption" data-active={i === scene}>
              <p className="font-mono text-xs tracking-[0.2em] text-[var(--color-fg-muted)] data-[last=true]:text-[var(--color-accent)]" data-last={i === CAREER.length - 1}>
                {item.when}
              </p>
              <p className="font-display mt-3 text-[clamp(1.75rem,4.4vw,3.25rem)] font-bold leading-tight">
                {item.line}
              </p>
              {item.note ? (
                <p className="mt-3 font-mono text-xs tracking-[0.15em] text-[var(--color-fg-muted)]">{item.note}</p>
              ) : null}
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-col gap-3" aria-hidden>
          <div className="flex justify-between font-mono text-xs text-[var(--color-fg-muted)]">
            {CAREER.map((item, i) => (
              <span key={item.when} className="career-mark" data-active={i === scene} data-last={i === CAREER.length - 1}>
                {String(i + 1).padStart(2, "0")}
              </span>
            ))}
          </div>
          <div className="h-px bg-[var(--color-line)]">
            <span ref={barRef} className="block h-px origin-left scale-x-0 bg-[var(--color-fg)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
