"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import Streamlines from "./Streamlines";
import Bubbles from "./Bubbles";

export default function About() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const img = el.querySelector<HTMLElement>(".about-img");
      if (img) {
        gsap.to(img, {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      gsap.from(el.querySelectorAll(".about-line"), {
        scrollTrigger: { trigger: el, start: "top 70%" },
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: "expo.out",
      });
    }, el);
    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      id="about"
      ref={ref}
      className="section-pad relative overflow-hidden"
    >
      <Streamlines color="rgba(93, 255, 230, 0.55)" particleCount={90} opacity={0.18} />
      <Bubbles count={7} colors={["accent-2", "accent"]} sizeRange={[12, 56]} />
      <div className="relative z-10 mx-auto max-w-[88rem] px-6 lg:px-10">
      <SectionHeading
        index="01"
        eyebrow="About"
        title={<>Hello, <span className="text-[var(--color-accent)]">こんにちは。</span></>}
        description="1982年 大阪生まれ。大学卒業後、システム開発会社を経て 2012 年に独立。フリーランスのエンジニアとして、見積もり・PM・要件定義・設計・開発・テストまで、規模と予算に応じてあらゆるポジションを担っています。"
      />

      <div className="grid gap-12 md:grid-cols-[5fr_7fr] md:gap-20">
        <Reveal direction="up" duration={1.4} className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-[var(--color-line)]">
          <div className="about-img absolute inset-0">
            <Image
              src="/images/profile/me.webp"
              alt="Hiroki Yanagisawa"
              fill
              priority
              sizes="(min-width: 768px) 35vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--color-bg)]/70 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg)]">
            <span>柳澤 宏樹</span>
            <span>OSAKA / JP</span>
          </div>
        </Reveal>

        <div className="flex flex-col justify-between gap-12">
          <div className="space-y-6 font-jp text-[15px] leading-[1.9] text-[var(--color-fg-muted)] md:text-base">
            <p className="about-line text-[var(--color-fg)]">
              人と人の出会いが、成長につながる。
            </p>
            <p className="about-line">
              フリーランスとして主にシステム開発会社のプロジェクトに参画し、見積もりからプロジェクト管理、要件定義、設計、開発、テストまで、案件の規模と予算に応じて様々なポジションを担当してきました。
            </p>
            <p className="about-line">
              立場や役割を超えて、ビジネスの構想と現場の実装を翻訳すること。
              プロジェクトを「動かす」だけでなく、「育てていける」状態にすること。
              それが私の関わり方のスタンスです。
            </p>
          </div>

          <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-line)]">
            {[
              { k: "Born", v: "1982 / 大阪" },
              { k: "Role", v: "System Developer" },
              { k: "Since", v: "Freelance · 2012" },
            ].map((item) => (
              <div
                key={item.k}
                className="about-line bg-[var(--color-bg)] p-5 md:p-6"
              >
                <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
                  {item.k}
                </dt>
                <dd className="mt-2 font-display text-base text-[var(--color-fg)]">
                  {item.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      </div>
    </section>
  );
}
