"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const SECTIONS = [
  { id: "top", label: "Index", num: "00" },
  { id: "about", label: "About", num: "01" },
  { id: "strengths", label: "Strengths", num: "02" },
  { id: "skills", label: "Skills", num: "03" },
  { id: "works", label: "Works", num: "04" },
  { id: "vision", label: "Vision", num: "05" },
  { id: "contact", label: "Contact", num: "06" },
];

export default function SideProgress() {
  const fillRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    triggers.push(
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          if (fillRef.current) {
            gsap.set(fillRef.current, { scaleY: self.progress });
          }
        },
      })
    );

    SECTIONS.forEach((s, i) => {
      const el = document.getElementById(s.id);
      if (!el) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => self.isActive && setActive(i),
        })
      );
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <aside className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 mix-blend-difference lg:flex lg:flex-col lg:items-end lg:gap-4">
      <div className="relative h-40 w-[2px] overflow-hidden bg-[var(--color-line)]">
        <span
          ref={fillRef}
          className="absolute inset-0 origin-top scale-y-0 bg-gradient-to-b from-[var(--color-accent)] to-[var(--color-accent-2)]"
        />
      </div>
      <ul className="pointer-events-auto flex flex-col items-end gap-3 font-mono text-[10px] uppercase tracking-[0.3em]">
        {SECTIONS.map((s, i) => {
          const isActive = active === i;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`group flex items-center gap-3 transition-colors ${
                  isActive ? "text-[var(--color-fg)]" : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                }`}
              >
                <span
                  className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-[max-width,opacity] duration-300 group-hover:max-w-[120px] group-hover:opacity-100"
                >
                  {s.label}
                </span>
                <span className="font-mono text-[10px]">{s.num}</span>
                <span
                  className={`block h-[6px] w-[6px] rounded-full transition-all duration-300 ${
                    isActive
                      ? "scale-150 bg-[var(--color-accent)] shadow-[0_0_12px_var(--color-accent)]"
                      : "bg-[var(--color-line)] group-hover:bg-[var(--color-fg-muted)]"
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
