"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import SectionHeading from "./SectionHeading";
import AuroraBlobs from "./AuroraBlobs";

const ITEMS = [
  {
    no: "01",
    en: "Management",
    jp: "マネジメント",
    body: "プロジェクト責任者として、計画立案・スケジュール作成・進捗管理・課題整理を行い、予算・納期・品質を達成するよう運営する。",
    metric: "200+",
    metricLabel: "Projects shipped",
    accent: "from-[#b6ff3c]/40 to-transparent",
    glyph: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="8" y="14" width="48" height="36" rx="4" />
        <path d="M8 22h48M16 30h20M16 38h28" />
        <circle cx="48" cy="38" r="3" />
      </svg>
    ),
  },
  {
    no: "02",
    en: "System Design",
    jp: "システム設計",
    body: "ユーザーの課題と潜在ニーズをヒアリングし、要件定義から基本設計・詳細設計・テスト仕様まで一貫して設計する。",
    metric: "RD → OP",
    metricLabel: "Full-cycle ownership",
    accent: "from-[#5dffe6]/40 to-transparent",
    glyph: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="32" cy="32" r="20" />
        <path d="M12 32h40M32 12v40M19 19l26 26M45 19 19 45" />
      </svg>
    ),
  },
  {
    no: "03",
    en: "Programming",
    jp: "プログラミング",
    body: "業務と運用を見据え、処理方式の設計、フレームワーク／基盤実装まで担い、機能開発と土台の両方を構築できる。",
    metric: "13+",
    metricLabel: "Languages in production",
    accent: "from-[#ff3cb8]/40 to-transparent",
    glyph: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="m22 20-12 12 12 12M42 20l12 12-12 12M36 14l-8 36" />
      </svg>
    ),
  },
];

export default function Strengths() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const track = trackRef.current;
    const pin = pinRef.current;
    if (!el || !track || !pin) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // 3D tilt on each card (works in both layouts)
      const cards = gsap.utils.toArray<HTMLElement>(".strength-card");
      cards.forEach((card) => {
        const onMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(card, {
            rotateX: y * -8,
            rotateY: x * 8,
            transformPerspective: 800,
            transformOrigin: "center",
            duration: 0.6,
            ease: "power3.out",
          });
        };
        const reset = () =>
          gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "power3.out" });
        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", reset);
      });

      // Horizontal pinned scroll (desktop only)
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const totalScroll = track.scrollWidth - window.innerWidth + 200;
        const tween = gsap.to(track, {
          x: () => -totalScroll,
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${totalScroll}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        return () => tween.kill();
      });

      if (reduced) return;
    }, el);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section id="strengths" ref={ref} className="relative overflow-hidden">
      <AuroraBlobs
        colors={[
          "rgba(182, 255, 60, 0.5)",
          "rgba(255, 60, 184, 0.4)",
          "rgba(93, 255, 230, 0.4)",
        ]}
        opacity={0.16}
      />
      <div className="mx-auto -mb-8 max-w-[88rem] px-6 pt-24 md:-mb-12 md:pt-28 lg:px-10">
        <SectionHeading
          index="02"
          eyebrow="Strengths"
          title={<>3 axes of <span className="text-[var(--color-accent)]">delivery.</span></>}
          description="マネジメント・システム設計・プログラミング — それぞれを単独でも、組み合わせても担当できることが私の強みです。"
        />
      </div>

      {/* Mobile: stacked grid */}
      <div className="mx-auto grid max-w-[88rem] gap-6 px-6 pb-24 lg:hidden">
        {ITEMS.map((it) => (
          <Card key={it.no} item={it} />
        ))}
      </div>

      {/* Desktop: pinned horizontal scroll */}
      <div ref={pinRef} className="relative hidden h-[78vh] overflow-hidden lg:block">
        <div
          ref={trackRef}
          className="absolute inset-y-0 left-0 flex h-full items-center gap-8 px-10 will-change-transform"
        >
          {ITEMS.map((it) => (
            <div key={it.no} className="h-[64vh] w-[42vw] shrink-0">
              <Card item={it} large />
            </div>
          ))}
          <div className="h-[64vh] w-[18vw] shrink-0" aria-hidden />
        </div>

        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--color-fg-muted)]">
          Scroll → to navigate
        </div>
      </div>
    </section>
  );
}

type Item = (typeof ITEMS)[number];

function Card({ item, large = false }: { item: Item; large?: boolean }) {
  return (
    <article
      className={`strength-card group relative h-full overflow-hidden rounded-3xl border border-[var(--color-line)] bg-[var(--color-bg-card)] will-change-transform ${
        large ? "p-12" : "p-8 md:p-10"
      }`}
    >
      <div
        className={`pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br ${item.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
      />
      <div className="relative z-10 flex h-full flex-col justify-between gap-10">
        <div className="flex items-start justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
            / {item.no}
          </span>
          <div className={`text-[var(--color-fg-muted)] transition-colors group-hover:text-[var(--color-accent)] ${large ? "h-14 w-14" : "h-10 w-10"}`}>
            {item.glyph}
          </div>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
            {item.jp}
          </p>
          <h3
            className={`font-display mt-2 font-medium leading-tight tracking-tight ${
              large ? "text-[clamp(2.5rem,5vw,4rem)]" : "text-[clamp(1.75rem,3.5vw,2.5rem)]"
            }`}
          >
            {item.en}
          </h3>
          <p className={`mt-5 text-pretty font-jp leading-relaxed text-[var(--color-fg-muted)] ${large ? "max-w-md text-base md:text-lg" : "text-sm md:text-[15px]"}`}>
            {item.body}
          </p>
        </div>

        <div className="flex items-end justify-between border-t border-[var(--color-line)] pt-6">
          <div>
            <p className={`font-display font-medium leading-none tracking-tight text-[var(--color-fg)] ${large ? "text-5xl" : "text-3xl"}`}>
              {item.metric}
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
              {item.metricLabel}
            </p>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
            #{item.en.toLowerCase().replace(/\s/g, "-")}
          </span>
        </div>
      </div>
    </article>
  );
}
