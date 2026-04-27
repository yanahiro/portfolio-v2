"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function SectionSplitter() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set(el, { scaleX: 1 });
      return;
    }
    const tween = gsap.fromTo(
      el,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.4,
        ease: "expo.inOut",
        scrollTrigger: { trigger: el, start: "top 90%" },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <div className="relative h-px w-full overflow-hidden bg-transparent">
      <span
        ref={ref}
        className="block h-px w-full origin-left scale-x-0 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent"
      />
    </div>
  );
}
