"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type Props = {
  to: number;
  from?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  format?: (n: number) => string;
};

export default function CountUp({
  to,
  from = 0,
  suffix = "",
  prefix = "",
  duration = 1.6,
  className,
  format,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fmt = format ?? ((n: number) => Math.round(n).toString());
    if (reduced) {
      el.textContent = `${prefix}${fmt(to)}${suffix}`;
      return;
    }

    const obj = { v: from };
    el.textContent = `${prefix}${fmt(from)}${suffix}`;

    const tween = gsap.to(obj, {
      v: to,
      duration,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
      onUpdate: () => {
        el.textContent = `${prefix}${fmt(obj.v)}${suffix}`;
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      ScrollTrigger.refresh();
    };
  }, [to, from, suffix, prefix, duration, format]);

  return <span ref={ref} className={className}>{prefix}{format ? format(from) : from}{suffix}</span>;
}
