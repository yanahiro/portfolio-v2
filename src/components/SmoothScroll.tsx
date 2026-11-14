"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { CAREER_TRIGGER_ID, careerRestOffset } from "@/lib/particles/scenes";

/** How long scrolling has to be still before the page settles on a career shape (ms). */
const SETTLE_DELAY = 160;

export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    // Career: if scrolling stops halfway through a morph, ease on to the nearest finished shape.
    let direction = 1;
    let lastScroll = window.scrollY;
    let touching = false;
    let settleTimer = 0;
    const settle = () => {
      if (touching) return;
      const career = ScrollTrigger.getById(CAREER_TRIGGER_ID);
      if (!career) return;
      const rest = careerRestOffset(
        window.scrollY - career.start,
        career.end - career.start,
        window.innerHeight,
        direction,
      );
      if (rest !== null) lenis.scrollTo(career.start + rest, { duration: 0.9 });
    };
    const scheduleSettle = () => {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settle, SETTLE_DELAY);
    };
    lenis.on("scroll", () => {
      const y = window.scrollY;
      if (y !== lastScroll) direction = y > lastScroll ? 1 : -1;
      lastScroll = y;
      scheduleSettle();
    });
    const onTouchStart = () => {
      touching = true;
    };
    const onTouchEnd = () => {
      touching = false;
      scheduleSettle();
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      window.clearTimeout(settleTimer);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      lenis.destroy();
    };
  }, []);

  return null;
}
