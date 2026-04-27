"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap, ScrollTrigger, Flip } from "@/lib/gsap";
import SectionHeading from "./SectionHeading";
import { WORKS, ROLE_LABEL } from "@/data/works";
import CountUp from "./CountUp";
import AuroraBlobs from "./AuroraBlobs";
import Bubbles from "./Bubbles";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "ai", label: "AI" },
  { key: "service", label: "Service" },
  { key: "finance", label: "Finance" },
  { key: "retail", label: "Retail / EC" },
] as const;
type FilterKey = (typeof FILTERS)[number]["key"];

function matchFilter(industry: string, key: FilterKey) {
  if (key === "all") return true;
  return industry.toLowerCase().includes(key);
}

export default function Works() {
  const ref = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<FilterKey>("all");

  const items = useMemo(() => WORKS.filter((w) => matchFilter(w.industry, filter)), [filter]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>(".work-row");
      rows.forEach((row, i) => {
        gsap.fromTo(
          row,
          { clipPath: "inset(0 100% 0 0)", opacity: 0 },
          {
            clipPath: "inset(0 0% 0 0)",
            opacity: 1,
            duration: 1.1,
            ease: "expo.out",
            delay: i * 0.05,
            scrollTrigger: { trigger: row, start: "top 88%" },
          }
        );
      });
    }, el);
    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  // Flip on filter change
  const lastFilter = useRef(filter);
  useEffect(() => {
    if (filter === lastFilter.current) return;
    if (!listRef.current) {
      lastFilter.current = filter;
      return;
    }
    const state = Flip.getState(listRef.current.querySelectorAll(".work-row"), {
      props: "opacity",
    });
    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.6,
        ease: "power3.inOut",
        absolute: true,
        scale: false,
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.04 }
          ),
        onLeave: (els) => gsap.to(els, { opacity: 0, y: -10, duration: 0.3 }),
      });
    });
    lastFilter.current = filter;
  }, [filter, items]);

  return (
    <section
      id="works"
      ref={ref}
      className="section-pad relative overflow-hidden"
    >
      <AuroraBlobs
        colors={[
          "rgba(93, 255, 230, 0.4)",
          "rgba(182, 255, 60, 0.35)",
          "rgba(255, 60, 184, 0.3)",
        ]}
        opacity={0.14}
      />
      <Bubbles count={7} colors={["accent-2", "accent", "magenta"]} sizeRange={[10, 48]} />
      <div className="relative z-10 mx-auto max-w-[88rem] px-6 lg:px-10">
      <SectionHeading
        index="04"
        eyebrow="Selected Works"
        title={<>Projects, <span className="text-[var(--color-accent)]">shipped.</span></>}
        description="代表的な開発プロジェクト。プロジェクト管理から実装まで、参画フェーズと役割は規模に応じて変動します。"
      />

      {/* Filters */}
      <div className="mb-10 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors ${
                active
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-bg)]"
                  : "border-[var(--color-line)] text-[var(--color-fg-muted)] hover:border-[var(--color-fg)] hover:text-[var(--color-fg)]"
              }`}
            >
              {f.label}
            </button>
          );
        })}
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
          {String(items.length).padStart(2, "0")} / {String(WORKS.length).padStart(2, "0")}
        </span>
      </div>

      <div ref={listRef} className="space-y-2">
        <div className="hidden grid-cols-[60px_120px_1fr_140px_120px_140px_100px] gap-6 border-b border-[var(--color-line)] pb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)] md:grid">
          <span>No.</span>
          <span>Industry</span>
          <span>Project</span>
          <span>Role</span>
          <span>Stack</span>
          <span>Period</span>
          <span className="text-right">Scale</span>
        </div>

        {items.map((w) => (
          <div
            key={w.id}
            data-flip-id={w.id}
            className="work-row group relative overflow-hidden rounded-2xl border border-transparent transition-colors hover:border-[var(--color-line)] hover:bg-[var(--color-bg-card)]"
          >
            <div className="absolute inset-x-0 bottom-0 h-px bg-[var(--color-line)] md:hidden" />
            <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-[60px_120px_1fr_140px_120px_140px_100px] md:items-center md:gap-6 md:p-5">
              <span className="font-mono text-xs text-[var(--color-fg-muted)]">
                {String(w.no).padStart(2, "0")}
              </span>
              <span className="font-jp text-sm text-[var(--color-fg-muted)]">{w.industry}</span>

              <div>
                <h3 className="font-display text-xl font-medium leading-tight text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-accent)] md:text-2xl">
                  {w.title}
                </h3>
                <p className="mt-2 max-w-2xl font-jp text-sm leading-relaxed text-[var(--color-fg-muted)]">
                  {w.summary}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {w.roles.map((r) => (
                  <span
                    key={r}
                    title={ROLE_LABEL[r]}
                    className="rounded-full border border-[var(--color-line)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]"
                  >
                    {r}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {w.stack.map((s) => (
                  <span key={s} className="font-mono text-[11px] text-[var(--color-fg-muted)]">
                    {s}
                  </span>
                ))}
              </div>

              <div className="font-mono text-xs text-[var(--color-fg-muted)]">
                {w.start} → {w.end}
              </div>

              <div className="text-left md:text-right">
                <CountUp to={w.scaleMonths} className="font-display text-lg text-[var(--color-fg)]" />
                <span className="ml-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
                  人月
                </span>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <p className="py-12 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
            No matching projects
          </p>
        )}
      </div>

      <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-muted)]">
        <span className="text-[var(--color-fg)]">/ Phase</span>
        <span>RD = 要件定義</span>
        <span>ED = 外部設計</span>
        <span>ID = 内部設計</span>
        <span>PT = 実装</span>
        <span>IT = 結合テスト</span>
        <span>ST = システムテスト</span>
        <span>OP = 運用</span>
      </div>
      </div>
    </section>
  );
}
