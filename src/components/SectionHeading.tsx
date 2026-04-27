"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type Props = {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
};

export default function SectionHeading({ index, eyebrow, title, description }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll(".reveal"), {
        scrollTrigger: { trigger: el, start: "top 80%" },
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "expo.out",
      });
    }, el);
    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <div ref={ref} className="mb-16 grid gap-8 md:mb-24 md:grid-cols-[auto_1fr] md:items-end md:gap-16">
      <div className="reveal flex items-center gap-4 font-mono text-xs uppercase tracking-[0.35em] text-[var(--color-fg-muted)]">
        <span className="text-[var(--color-accent)]">{index}</span>
        <span className="h-px w-10 bg-[var(--color-line)]" />
        <span>{eyebrow}</span>
      </div>
      <div className="space-y-5">
        <h2 className="reveal font-display text-balance text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[0.95] tracking-tight">
          {title}
        </h2>
        {description ? (
          <p className="reveal max-w-2xl text-pretty font-jp text-base leading-relaxed text-[var(--color-fg-muted)]">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
