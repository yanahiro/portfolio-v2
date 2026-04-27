"use client";

import { useEffect, useRef } from "react";

const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*+-/=<>?";

type Props = {
  text: string;
  duration?: number;
  delay?: number;
  className?: string;
};

export default function ScrambleText({
  text,
  duration = 700,
  delay = 0,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.textContent = text;
      return;
    }

    let raf = 0;
    let start = 0;
    const total = text.length;
    const steps = total + Math.floor(duration / 30);

    const tick = (t: number) => {
      if (!start) start = t + delay;
      const elapsed = Math.max(0, t - start);
      const progress = Math.min(1, elapsed / duration);
      const reveal = Math.floor(progress * steps);
      let out = "";
      for (let i = 0; i < total; i++) {
        if (i < reveal) {
          out += text[i];
        } else if (text[i] === " ") {
          out += " ";
        } else {
          out += POOL[Math.floor(Math.random() * POOL.length)];
        }
      }
      el.textContent = out;
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    el.textContent = text.replace(/[^\s]/g, " ");
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, duration, delay]);

  return <span ref={ref} className={className} aria-label={text} />;
}
