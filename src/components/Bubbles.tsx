"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

type ColorKey = "accent" | "accent-2" | "magenta";

const COLOR_MAP: Record<ColorKey, string> = {
  accent: "182, 255, 60",
  "accent-2": "93, 255, 230",
  magenta: "255, 60, 184",
};

const PACKET_GLYPHS = ["●", "01", "0x4F", "→", "✓", "//", "{ }", "λ", "ai", "▲"];

type Props = {
  count?: number;
  colors?: ColorKey[];
  sizeRange?: [number, number];
  withDataPackets?: boolean;
  className?: string;
};

type Bubble = {
  left: number;
  size: number;
  color: ColorKey;
  delay: number;
  duration: number;
  drift: number;
  isPacket: boolean;
  glyph: string;
};

export default function Bubbles({
  count = 8,
  colors = ["accent", "accent-2"],
  sizeRange = [10, 64],
  withDataPackets = true,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const out: Bubble[] = [];
    for (let i = 0; i < count; i++) {
      const isPacket = withDataPackets && Math.random() < 0.12;
      out.push({
        left: rand(2, 98),
        size: rand(sizeRange[0], sizeRange[1]),
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: rand(-25, 0),
        duration: rand(20, 36),
        drift: rand(-90, 90),
        isPacket,
        glyph: PACKET_GLYPHS[Math.floor(Math.random() * PACKET_GLYPHS.length)],
      });
    }
    setBubbles(out);
  }, [count, colors, sizeRange, withDataPackets]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (bubbles.length === 0) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const items = Array.from(el.querySelectorAll<HTMLElement>(".bubble-item"));
    let visible = true;

    const ctx = gsap.context(() => {
      const tweens: gsap.core.Tween[] = [];
      const tls: gsap.core.Timeline[] = [];

      const buildTweens = () => {
        tweens.forEach((t) => t.kill());
        tls.forEach((t) => t.kill());
        tweens.length = 0;
        tls.length = 0;

        const parentH = el.clientHeight;
        const travel = parentH + 200;

        items.forEach((item, i) => {
          const b = bubbles[i];
          gsap.set(item, { x: 0, y: 0, scale: 1, opacity: 0 });

          // Vertical float across full section height
          tweens.push(
            gsap.fromTo(
              item,
              { y: 0 },
              {
                y: -travel,
                duration: b.duration,
                delay: b.delay,
                ease: "none",
                repeat: -1,
              }
            )
          );

          // Opacity life
          const peakOpacity = gsap.utils.random(0.06, 0.14);
          const opacityTl = gsap.timeline({ repeat: -1, delay: b.delay });
          opacityTl
            .fromTo(item, { opacity: 0 }, { opacity: peakOpacity, duration: b.duration * 0.18, ease: "power1.out" })
            .to(item, { opacity: peakOpacity, duration: b.duration * 0.6 })
            .to(item, { opacity: 0, duration: b.duration * 0.22, ease: "power1.in" });
          tls.push(opacityTl);

          // Horizontal sway
          tweens.push(
            gsap.to(item, {
              x: b.drift,
              duration: gsap.utils.random(8, 14),
              delay: b.delay,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            })
          );

          // Scale breathing
          tweens.push(
            gsap.to(item, {
              scale: gsap.utils.random(0.85, 1.15),
              duration: gsap.utils.random(6, 10),
              delay: b.delay,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            })
          );
        });
      };

      buildTweens();
      const ro = new ResizeObserver(buildTweens);
      ro.observe(el);
      // Cleanup ResizeObserver via gsap context
      return () => ro.disconnect();
    }, el);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visible = e.isIntersecting;
          if (visible) gsap.globalTimeline.resume();
        }
      },
      { threshold: 0.05 }
    );
    io.observe(el);
    void visible;

    return () => {
      ctx.revert();
      io.disconnect();
    };
  }, [bubbles]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
      style={{ zIndex: 0 }}
    >
      {bubbles.map((b, i) => {
        const rgb = COLOR_MAP[b.color];
        return (
          <div
            key={i}
            className="bubble-item absolute -bottom-[5%] flex items-center justify-center rounded-full will-change-transform"
            style={{
              left: `${b.left}%`,
              width: b.size,
              height: b.size,
              background: `radial-gradient(circle at 32% 28%, rgba(${rgb}, 0.45) 0%, rgba(${rgb}, 0.2) 45%, rgba(${rgb}, 0.05) 80%, rgba(${rgb}, 0) 100%)`,
              boxShadow: `0 0 ${b.size * 0.5}px rgba(${rgb}, 0.12)`,
              border: `1px solid rgba(${rgb}, 0.12)`,
            }}
          >
            {b.isPacket && (
              <span
                className="font-mono uppercase text-[var(--color-bg)]"
                style={{
                  fontSize: Math.max(8, b.size * 0.28),
                  color: `rgba(${rgb}, 0.95)`,
                  textShadow: `0 0 6px rgba(${rgb}, 0.6)`,
                }}
              >
                {b.glyph}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
