"use client";

import { useEffect, useRef } from "react";
import type { Run } from "@/data/about";
import { prefersReducedMotion } from "@/lib/gsap";

/** Pause between two typed pieces of text (ms). */
const PAUSE = 260;

/** Text that `TypedBlock` types out, one character every `speed` ms. */
export function Typed({ runs, speed }: { runs: Run[]; speed: number }) {
  return (
    <span data-type={speed}>
      {runs.map((run, i) => {
        const text = typeof run === "string" ? run : run.mark;
        // Plain inline spans, so the browser still breaks Japanese lines properly.
        const chars = Array.from(text).map((ch, j) => (
          <span key={j} data-tc="">
            {ch}
          </span>
        ));
        return typeof run === "string" ? (
          <span key={i}>{chars}</span>
        ) : (
          <span key={i} className="type-mark">
            {chars}
          </span>
        );
      })}
    </span>
  );
}

type Props = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Types out every `Typed` descendant in order, once, when the block scrolls into
 * view. The text is in the HTML from the start; without JS or with reduced
 * motion it is simply there.
 */
export default function TypedBlock({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;

    const chars = Array.from(root.querySelectorAll<HTMLElement>("[data-tc]"));
    const times: number[] = [];
    let at = 0;
    let piece: Element | null = null;
    for (const ch of chars) {
      const owner = ch.closest("[data-type]");
      if (owner !== piece) {
        if (piece) at += PAUSE;
        piece = owner;
      }
      times.push(at);
      at += Number(owner?.getAttribute("data-type")) || 12;
    }

    root.dataset.typed = "idle";
    let shown = 0;
    let start = -1;
    let frame = 0;
    const tick = (now: number) => {
      if (start < 0) start = now;
      const before = shown;
      while (shown < chars.length && times[shown] <= now - start) {
        chars[shown].dataset.tc = "on";
        shown++;
      }
      if (shown !== before) {
        if (before > 0) delete chars[before - 1].dataset.cur;
        chars[shown - 1].dataset.cur = "";
      }
      if (shown < chars.length) frame = requestAnimationFrame(tick);
      else root.dataset.typed = "done";
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        root.dataset.typed = "typing";
        frame = requestAnimationFrame(tick);
      },
      // Start once the block is a quarter of the way up the screen.
      { rootMargin: "0px 0px -25% 0px" },
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      delete root.dataset.typed;
      for (const ch of chars) {
        ch.dataset.tc = "";
        delete ch.dataset.cur;
      }
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
