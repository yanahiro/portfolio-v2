"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import SectionHeading from "./SectionHeading";
import Streamlines from "./Streamlines";
import Bubbles from "./Bubbles";

const PHRASES = [
  "Build a community —",
  "in Osaka,",
  "where people grow",
  "by meeting each other.",
];

export default function Vision() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const lines = el.querySelectorAll<HTMLElement>(".vision-line");
      lines.forEach((line, i) => {
        gsap.from(line, {
          scrollTrigger: { trigger: line, start: "top 85%" },
          y: 80,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out",
          delay: i * 0.05,
        });
      });

      const ticker = el.querySelector<HTMLElement>(".vision-ticker");
      if (ticker) {
        const tween = gsap.to(ticker, {
          xPercent: -50,
          duration: 30,
          ease: "none",
          repeat: -1,
        });

        let lastY = window.scrollY;
        let velocity = 0;
        let dirSign = 1;
        let raf = 0;
        const tick = () => {
          const y = window.scrollY;
          const dy = y - lastY;
          lastY = y;
          velocity += (Math.abs(dy) - velocity) * 0.12;
          if (dy !== 0) {
            const target = dy > 0 ? 1 : -1;
            dirSign += (target - dirSign) * 0.08;
          }
          tween.timeScale(dirSign * (1 + Math.min(7, velocity * 0.5)));
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
      }
    }, el);
    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      id="vision"
      ref={ref}
      className="section-pad relative overflow-hidden bg-[var(--color-bg-elev)]"
    >
      <Streamlines color="rgba(255, 60, 184, 0.55)" particleCount={100} opacity={0.18} />
      <Bubbles count={15} colors={["magenta", "accent", "accent-2"]} sizeRange={[8, 72]} />
      <div className="relative z-10 mx-auto max-w-[88rem] px-6 lg:px-10">
        <SectionHeading
          index="05"
          eyebrow="Vision"
          title={<>Future <span className="text-[var(--color-accent)]">Design.</span></>}
          description="私の目標は、大阪にコミュニティを作ること。たくさんの人に支えられて成長してきた今、これからは支える側でありたい。"
        />

        <div className="grid gap-12 md:grid-cols-[1fr_1fr] md:gap-20">
          <div className="space-y-3">
            {PHRASES.map((p, i) => (
              <div key={i} className="overflow-hidden">
                <p className="vision-line font-display text-[clamp(2rem,5vw,4rem)] font-medium leading-[1.05] tracking-tight">
                  {p}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-6 font-jp text-[15px] leading-[1.95] text-[var(--color-fg-muted)]">
            <p className="vision-line">
              これまで私は、たくさんの人に支えられて成長してきました。
            </p>
            <p className="vision-line">
              そんな中で思ったのは「人の出会いが、成長につながる」ということ。
              そこに集まる方たちが楽しく過ごせる場所やイベントを提供・発信し、
              コミュニティの中から地域貢献できるサービスや活動に取り組む。
            </p>
            <p className="vision-line">
              大阪好きが大阪を盛り上げていくような、
              <span className="text-[var(--color-fg)]">Web にとらわれないコミュニティ</span>
              を作ることが目標です。
            </p>
          </div>
        </div>
      </div>

      <div className="mt-24 overflow-hidden border-y border-[var(--color-line)] py-4">
        <div className="vision-ticker flex w-max items-center gap-8 whitespace-nowrap font-display text-[clamp(1rem,1.6vw,1.5rem)] font-normal leading-none tracking-[0.15em] text-[var(--color-fg-muted)]">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="flex items-center gap-8">
              OSAKA · COMMUNITY · 2026
              <span className="text-[var(--color-accent)]">●</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
