"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type Direction = "up" | "down" | "left" | "right";

type Props = {
  children: React.ReactNode;
  direction?: Direction;
  duration?: number;
  delay?: number;
  className?: string;
};

const FROM: Record<Direction, string> = {
  up: "inset(100% 0 0 0)",
  down: "inset(0 0 100% 0)",
  left: "inset(0 100% 0 0)",
  right: "inset(0 0 0 100%)",
};

export default function Reveal({
  children,
  direction = "up",
  duration = 1.1,
  delay = 0,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.style.clipPath = "inset(0)";
      return;
    }

    el.style.clipPath = FROM[direction];

    const tween = gsap.to(el, {
      clipPath: "inset(0)",
      duration,
      delay,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      ScrollTrigger.refresh();
    };
  }, [direction, duration, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
