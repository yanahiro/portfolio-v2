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
        description="大阪生まれのシステム職人。新卒で SI ベンダーに入り、.Net / Java / PHP / Cobol で20年近くシステムを書き続けてきました。28歳でフリーランスへ転身、30代でデザイン基礎を学び、現在はサービスの開発責任を担う立場で日々奔走しています。"
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
              人と人の出会いが、自分を作ってきた。
            </p>
            <p className="about-line">
              新卒からもうすぐ20年、システム開発という仕事に向き合ってきました。
              SI ベンダーで .Net・Java・PHP・Cobol を学び、官公庁系の業務システムから金融・流通まで、規模の異なる現場を渡り歩いてきました。
              28歳でフリーランスへ転身してからは、提案・見積もりから運用まで引き受けるなかで、「食わず嫌いせず、時代に合わせた技術と触れ合う」姿勢が染みつきました。
            </p>
            <p className="about-line">
              30代前半、C向けサービスに本気で向き合うにはコードや基盤の力だけでは足りないと感じ、デジハリでデザイン基礎を学習。
              オフショア事業に関わって英語にも少しずつ触れてきました。
            </p>
            <p className="about-line">
              いまは運営しているサービスの開発責任者として、日々奔走しています。
              プロジェクトを「動かす」だけでなく、「育てていける」状態にすること。
              それが私の関わり方のスタンスです。
            </p>
          </div>

          <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-line)]">
            {[
              { k: "Born", v: "1982 / 大阪" },
              { k: "Role", v: "System Developer" },
              { k: "Since", v: "System Dev · 2007 ~" },
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
