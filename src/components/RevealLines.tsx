"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  children: React.ReactNode;
  className?: string;
};

/** Reveals every `[data-lines]` descendant line by line when it scrolls into view. */
export default function RevealLines({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      SplitText.create(el.querySelectorAll("[data-lines]"), {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        // Lines stay readable as plain text; no aria-label needed on the paragraph.
        aria: "none",
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 0.9,
            ease: "expo.out",
            stagger: 0.07,
            scrollTrigger: { trigger: el, start: "top 78%" },
          }),
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
