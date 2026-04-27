"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import SectionHeading from "./SectionHeading";
import Magnetic from "./Magnetic";
import AuroraBlobs from "./AuroraBlobs";
import Bubbles from "./Bubbles";
import { siteConfig } from "@/lib/config";

const SNS = [
  { label: "GitHub", href: siteConfig.social.github },
  { label: "Instagram", href: siteConfig.social.instagram },
  { label: "Facebook", href: siteConfig.social.facebook },
];

export default function Contact() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll(".reveal"), {
        scrollTrigger: { trigger: el, start: "top 80%" },
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.06,
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
      id="contact"
      ref={ref}
      className="section-pad relative overflow-hidden"
    >
      <AuroraBlobs
        colors={[
          "rgba(182, 255, 60, 0.35)",
          "rgba(93, 255, 230, 0.3)",
          "rgba(255, 60, 184, 0.25)",
        ]}
        opacity={0.12}
      />
      <Bubbles count={7} colors={["accent", "accent-2"]} sizeRange={[12, 56]} />
      <div className="relative z-10 mx-auto max-w-[88rem] px-6 lg:px-10">
      <SectionHeading
        index="06"
        eyebrow="Contact"
        title={<>Get in <span className="text-[var(--color-accent)]">touch.</span></>}
        description="お仕事のご相談・コラボレーション・コミュニティ活動など、お気軽にどうぞ。"
      />

      <div className="reveal grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-16">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
            / Direct Message
          </p>
          <Magnetic strength={0.15} as="div" className="mt-4">
            <a
              href={siteConfig.social.xDm}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-3 font-display text-2xl text-[var(--color-fg)] transition-colors hover:text-[var(--color-accent)] md:text-3xl"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 md:h-7 md:w-7">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>Message me on X</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                <path d="M5 19 19 5M9 5h10v10" />
              </svg>
            </a>
          </Magnetic>
          <p className="mt-3 font-jp text-sm text-[var(--color-fg-muted)]">
            Xアカウント
            <a
              href={siteConfig.social.xProfile}
              target="_blank"
              rel="noreferrer"
              className="ml-2 font-mono text-[var(--color-fg)] hover:text-[var(--color-accent)]"
            >
              @{siteConfig.social.xHandle}
            </a>
            <span className="mx-2 opacity-50">·</span>
            DMはオープンです。お気軽にどうぞ。
          </p>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
            / Social
          </p>
          <ul className="mt-4 flex flex-col">
            {SNS.map((s) => (
              <li key={s.label} className="border-b border-[var(--color-line)] last:border-b-0">
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between py-4"
                >
                  <span className="font-display text-base text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-accent)]">
                    {s.label}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-4 w-4 text-[var(--color-fg-muted)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]"
                  >
                    <path d="M5 19 19 5M9 5h10v10" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="reveal mt-24 flex flex-col items-start justify-between gap-4 border-t border-[var(--color-line)] pt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)] md:flex-row md:items-center">
        <span>© {new Date().getFullYear()} Hiroki Yanagisawa</span>
        <span>Crafted in Osaka — Next.js · GSAP · Lenis</span>
      </footer>
      </div>
    </section>
  );
}
