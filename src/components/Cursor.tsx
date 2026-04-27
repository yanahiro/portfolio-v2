"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const TRAIL_COUNT = 6;

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const trail = trailRef.current!;

    const dotPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...dotPos };
    const target = { x: dotPos.x, y: dotPos.y };

    const trailParts = Array.from(trail.children) as HTMLElement[];
    const trailPos = trailParts.map(() => ({ x: target.x, y: target.y }));

    let hovering = false;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    const tickCb = gsap.ticker.add(() => {
      dotPos.x += (target.x - dotPos.x) * 0.6;
      dotPos.y += (target.y - dotPos.y) * 0.6;
      ringPos.x += (target.x - ringPos.x) * 0.18;
      ringPos.y += (target.y - ringPos.y) * 0.18;
      gsap.set(dot, { x: dotPos.x, y: dotPos.y });
      gsap.set(ring, { x: ringPos.x, y: ringPos.y });

      // Trail follow chain
      let prev = { x: target.x, y: target.y };
      trailPos.forEach((p, i) => {
        p.x += (prev.x - p.x) * (0.32 - i * 0.035);
        p.y += (prev.y - p.y) * (0.32 - i * 0.035);
        prev = p;
        gsap.set(trailParts[i], { x: p.x, y: p.y });
      });
    });

    const enter = () => {
      ring.classList.add("is-hover");
      hovering = true;
      gsap.to(trail, { opacity: 1, duration: 0.25 });
    };
    const leave = () => {
      ring.classList.remove("is-hover");
      hovering = false;
      gsap.to(trail, { opacity: 0, duration: 0.4 });
    };
    void hovering;

    const targets = document.querySelectorAll<HTMLElement>(
      'a, button, [data-cursor="hover"]'
    );
    targets.forEach((t) => {
      t.addEventListener("mouseenter", enter);
      t.addEventListener("mouseleave", leave);
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      gsap.ticker.remove(tickCb);
      targets.forEach((t) => {
        t.removeEventListener("mouseenter", enter);
        t.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  return (
    <>
      <div ref={trailRef} className="cursor-trail" aria-hidden>
        {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
          <span
            key={i}
            className="cursor-trail-dot"
            style={{
              opacity: 1 - i / TRAIL_COUNT,
              transform: `scale(${1 - i / (TRAIL_COUNT * 1.4)})`,
            }}
          />
        ))}
      </div>
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </>
  );
}
