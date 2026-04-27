"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const SESSION_KEY = "yanahiro:loader-shown";

type Phase = "init" | "running" | "done";

export default function Loader() {
  const [phase, setPhase] = useState<Phase>("init");
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const slitTopRef = useRef<HTMLDivElement>(null);
  const slitBottomRef = useRef<HTMLDivElement>(null);

  // Decide whether to show
  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem(SESSION_KEY);
    if (seen) {
      setPhase("done");
      document.documentElement.classList.add("loader-done");
    } else {
      setPhase("running");
      document.documentElement.classList.add("loader-active");
    }
  }, []);

  // Run animation after running-phase render commits
  useEffect(() => {
    if (phase !== "running") return;
    if (!rootRef.current) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const finish = () => {
      sessionStorage.setItem(SESSION_KEY, "1");
      document.documentElement.classList.remove("loader-active");
      document.documentElement.classList.add("loader-done");
      setPhase("done");
    };

    if (reduced) {
      const t = gsap.to(rootRef.current, {
        opacity: 0,
        duration: 0.3,
        delay: 0.15,
        onComplete: finish,
      });
      return () => {
        t.kill();
      };
    }

    const obj = { v: 0 };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.to(obj, {
        v: 100,
        duration: 1.4,
        ease: "power2.inOut",
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent = Math.floor(obj.v).toString().padStart(2, "0");
          }
        },
      })
        .to(
          ".loader-pulse-cell",
          {
            opacity: 1,
            stagger: { each: 0.04, from: "start", repeat: -1, yoyo: true },
          },
          0
        )
        .to(labelRef.current, { opacity: 1, duration: 0.5 }, 0.1)
        .to(
          [slitTopRef.current, slitBottomRef.current],
          {
            scaleY: 0,
            duration: 0.9,
            ease: "expo.inOut",
            stagger: 0.05,
          },
          "+=0.1"
        )
        .to(
          rootRef.current,
          {
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
            onComplete: finish,
          },
          "-=0.2"
        );
    }, rootRef);

    return () => ctx.revert();
  }, [phase]);

  if (phase !== "running") return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-fg)]"
    >
      <div ref={slitTopRef} className="absolute inset-x-0 top-0 h-1/2 origin-top bg-[var(--color-bg)]" />
      <div ref={slitBottomRef} className="absolute inset-x-0 bottom-0 h-1/2 origin-bottom bg-[var(--color-bg)]" />

      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--color-fg-muted)]">
          / Yanatch · 2026
        </div>

        <div className="flex items-end gap-5">
          <span
            ref={counterRef}
            className="font-display text-7xl font-medium leading-none tracking-tight tabular-nums md:text-8xl"
          >
            00
          </span>
          <span className="mb-2 font-mono text-xs text-[var(--color-fg-muted)]">/ 100</span>
        </div>

        <div className="flex items-center gap-3">
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="loader-pulse-cell h-[6px] w-[6px] rounded-full bg-[var(--color-accent)] opacity-15"
            />
          ))}
        </div>

        <span
          ref={labelRef}
          className="font-mono text-[10px] uppercase tracking-[0.45em] text-[var(--color-fg-muted)] opacity-0"
        >
          INITIALIZING NEURAL INTERFACE
        </span>
      </div>
    </div>
  );
}
