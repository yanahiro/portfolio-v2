"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import SectionHeading from "./SectionHeading";
import { DB_LOGOS, OS_LOGOS, PG_LOGOS, RATINGS, type Logo } from "@/data/skills";
import Streamlines from "./Streamlines";

function Marquee({ items, reverse = false }: { items: Logo[]; reverse?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const baseDir = reverse ? 1 : -1;
    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        xPercent: baseDir * 50,
        ease: "none",
        duration: 40,
        repeat: -1,
      });

      let lastY = window.scrollY;
      let velocity = 0;
      let raf = 0;
      let dirSign = baseDir;

      const tick = () => {
        const y = window.scrollY;
        const dy = y - lastY;
        lastY = y;
        velocity += (Math.abs(dy) - velocity) * 0.15;
        // direction follow (scroll up reverses)
        if (dy !== 0) {
          const targetDir = dy > 0 ? baseDir : -baseDir;
          dirSign += (targetDir - dirSign) * 0.08;
        }
        const boost = 1 + Math.min(8, velocity * 0.6);
        tween.timeScale(dirSign * boost);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      return () => cancelAnimationFrame(raf);
    }, track);
    return () => ctx.revert();
  }, [reverse]);

  return (
    <div className="relative overflow-hidden py-6">
      <div ref={trackRef} className="flex w-max gap-12 will-change-transform">
        {[...items, ...items].map((logo, i) => (
          <div
            key={`${logo.name}-${i}`}
            className="flex h-16 w-32 shrink-0 items-center justify-center gap-3 opacity-70 transition-opacity hover:opacity-100"
          >
            <div className="relative h-10 w-10">
              <Image src={logo.src} alt={logo.name} fill sizes="40px" className="object-contain" />
            </div>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-fg-muted)]">
              {logo.name}
            </span>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[var(--color-bg)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[var(--color-bg)] to-transparent" />
    </div>
  );
}

function Bar({ name, level }: { name: string; level: number }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleX: 0 },
        {
          scaleX: level / 5,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        }
      );
    }, el);
    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [level]);

  return (
    <div className="flex items-center justify-between gap-6 border-b border-[var(--color-line)] py-4">
      <span className="font-display text-base text-[var(--color-fg)]">{name}</span>
      <div className="flex items-center gap-4">
        <div className="relative h-[2px] w-32 overflow-hidden bg-[var(--color-line)] md:w-48">
          <div
            ref={barRef}
            className="absolute inset-0 origin-left bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)]"
          />
        </div>
        <span className="font-mono text-xs text-[var(--color-fg-muted)]">{level.toFixed(1)}</span>
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section
      id="skills"
      className="section-pad relative overflow-hidden bg-[var(--color-bg-elev)]"
    >
      <Streamlines color="rgba(182, 255, 60, 0.7)" particleCount={120} opacity={0.2} />
      <div className="relative z-10 mx-auto max-w-[88rem] px-6 lg:px-10">
        <SectionHeading
          index="03"
          eyebrow="Skills"
          title={<>Tech I write & <span className="text-[var(--color-accent)]">ship.</span></>}
          description="言語・データベース・OS／プラットフォーム。長年の現場で触れてきたスタックです。"
        />

        <div className="mb-16 space-y-2">
          <p className="px-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
            / Languages
          </p>
          <Marquee items={PG_LOGOS} />
          <p className="px-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
            / Databases
          </p>
          <Marquee items={DB_LOGOS} reverse />
          <p className="px-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
            / OS · Platforms
          </p>
          <Marquee items={OS_LOGOS} />
        </div>

        <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-20">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
              / Most fluent
            </p>
            <h3 className="font-display mt-4 text-3xl font-medium leading-tight">
              得意な言語と<br />フレームワーク
            </h3>
            <p className="mt-6 max-w-md font-jp text-sm leading-relaxed text-[var(--color-fg-muted)]">
              特に長く使ってきたものを 5 段階でレーティング。新しいスタックでも、業務理解と設計力でキャッチアップできます。
            </p>
          </div>
          <div>
            {RATINGS.map((r) => (
              <Bar key={r.name} {...r} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
