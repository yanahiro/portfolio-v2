"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

type Props = {
  colors?: [string, string, string];
  opacity?: number;
};

const DEFAULT_COLORS: [string, string, string] = [
  "rgba(182, 255, 60, 0.55)",
  "rgba(93, 255, 230, 0.45)",
  "rgba(255, 60, 184, 0.35)",
];

export default function AuroraBlobs({ colors = DEFAULT_COLORS, opacity = 0.18 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const blobs = Array.from(el.querySelectorAll<HTMLElement>(".aurora-blob"));
    const ctx = gsap.context(() => {
      blobs.forEach((b, i) => {
        gsap.to(b, {
          x: () => gsap.utils.random(-180, 180),
          y: () => gsap.utils.random(-160, 160),
          scale: () => gsap.utils.random(0.85, 1.25),
          duration: () => gsap.utils.random(14, 22),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 1.4,
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      style={{ opacity }}
    >
      <div
        className="aurora-blob absolute left-[10%] top-[15%] h-[55vh] w-[55vh] rounded-full blur-[120px] will-change-transform"
        style={{ background: colors[0] }}
      />
      <div
        className="aurora-blob absolute right-[8%] top-[40%] h-[50vh] w-[50vh] rounded-full blur-[120px] will-change-transform"
        style={{ background: colors[1] }}
      />
      <div
        className="aurora-blob absolute left-[40%] bottom-[10%] h-[45vh] w-[45vh] rounded-full blur-[120px] will-change-transform"
        style={{ background: colors[2] }}
      />
    </div>
  );
}
