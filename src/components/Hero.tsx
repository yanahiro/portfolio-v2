"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import NeuralNetwork from "./NeuralNetwork";
import ScrambleText from "./ScrambleText";
import Magnetic from "./Magnetic";
import CountUp from "./CountUp";

const NAME_LINES = ["Hiroki", "Yanagisawa"];
const TOOLBELT = [
  { name: "GPT-5", desc: "OpenAI flagship reasoning model" },
  { name: "Claude 4.7", desc: "Anthropic — coding & long context" },
  { name: "Gemini", desc: "Google multimodal models" },
  { name: "Embeddings", desc: "Semantic search & memory" },
  { name: "RAG", desc: "Retrieval augmented generation" },
  { name: "Agents", desc: "Tool-using autonomous workers" },
  { name: "MCP", desc: "Model Context Protocol" },
  { name: "Vector DB", desc: "Pinecone / pgvector / Qdrant" },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const startDelay = sessionStorage.getItem("yanahiro:loader-shown") ? 0.1 : 1.6;

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(".hero-name-line", { yPercent: 110 });
      gsap.set(".hero-net", { opacity: 0, scale: 0.85 });
      gsap.set([".hero-eyebrow", ".hero-tag", ".hero-cta", ".hero-status", ".hero-toolbelt"], {
        opacity: 0,
        y: 16,
      });
      gsap.set(".hero-catch span", { opacity: 0, y: 16 });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: startDelay });

      tl.to(".hero-eyebrow", { opacity: 1, y: 0, duration: 0.6 }, 0)
        .to(".hero-name-line", { yPercent: 0, duration: 1.1, stagger: 0.1 }, 0.05)
        .to(".hero-tag", { opacity: 1, y: 0, duration: 0.7 }, 0.55)
        .to(".hero-catch span", { opacity: 1, y: 0, duration: 0.8, stagger: 0.05 }, 0.7)
        .to(".hero-net", { opacity: 1, scale: 1, duration: 1.4, ease: "expo.out" }, 0.4)
        .to(".hero-cta", { opacity: 1, y: 0, duration: 0.7 }, 1.0)
        .to([".hero-status", ".hero-toolbelt"], { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 1.1);

      // Toolbelt continuous belt
      gsap.to(".hero-toolbelt-track", {
        xPercent: -50,
        duration: 30,
        ease: "none",
        repeat: -1,
      });

      // Caret blink
      gsap.to(".hero-caret", {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "steps(1)",
        delay: startDelay + 1.4,
      });

      if (reduced) {
        tl.timeScale(3);
      }
    }, el);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      id="top"
      ref={root}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* HUD top */}
      <div className="hero-eyebrow relative z-10 flex items-center justify-between px-6 pt-28 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--color-fg-muted)] lg:px-10 lg:pt-32">
        <span className="text-[var(--color-accent)]">/ portfolio · 2026</span>
        <span className="hidden md:inline">
          <ScrambleText text="SYS · v2.6.0 · BUILD 0426" duration={900} delay={1700} />
        </span>
      </div>

      {/* Main grid */}
      <div className="relative z-10 mx-auto grid w-full max-w-[88rem] flex-1 grid-cols-1 items-center gap-12 px-6 py-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-10 lg:py-20">
        {/* Left — text */}
        <div className="flex flex-col gap-10">
          <div>
            <h1 className="font-display text-balance text-[clamp(2.75rem,7.5vw,6.5rem)] font-medium leading-[0.92] tracking-tight">
              {NAME_LINES.map((line, i) => (
                <span key={i} className="block overflow-hidden">
                  <span className="hero-name-line inline-block will-change-transform">
                    {line}
                    {i === NAME_LINES.length - 1 && (
                      <span className="hero-caret ml-2 inline-block h-[0.85em] w-[0.05em] translate-y-[0.08em] bg-[var(--color-accent)] align-middle" />
                    )}
                  </span>
                </span>
              ))}
            </h1>

            <p className="hero-tag mt-5 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] md:text-[13px]">
              <span className="text-[var(--color-fg)]">System Developer</span>
              <span className="mx-3 text-[var(--color-accent)]">×</span>
              <span className="text-[var(--color-fg)]">AI Engineer</span>
            </p>
          </div>

          <p className="hero-catch font-display max-w-xl text-pretty text-[clamp(1.25rem,2.2vw,1.75rem)] font-medium leading-tight tracking-tight text-[var(--color-fg)]">
            {"Twenty years of building systems — now compounded by AI.".split(" ").map((w, i) => (
              <span
                key={i}
                className="inline-block translate-y-4 opacity-0 will-change-transform"
                style={{ paddingRight: "0.35em" }}
              >
                {w}
              </span>
            ))}
          </p>

          <div className="hero-cta flex flex-wrap items-center gap-5">
            <Magnetic strength={0.4}>
              <a href="#works" className="btn-magnetic">
                View Selected Works
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </a>
            </Magnetic>
            <Magnetic strength={0.25}>
              <a
                href="#about"
                className="font-display text-sm uppercase tracking-[0.25em] text-[var(--color-fg-muted)] underline-offset-8 hover:text-[var(--color-fg)] hover:underline"
              >
                About me
              </a>
            </Magnetic>
          </div>
        </div>

        {/* Right — neural network visualization */}
        <div className="hero-net relative aspect-square w-full will-change-transform">
          <div className="absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle_at_center,rgba(182,255,60,0.15),transparent_60%)]" />
          <NeuralNetwork />
          {/* HUD frame */}
          <div className="pointer-events-none absolute inset-0">
            <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-[var(--color-line)]" />
            <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-[var(--color-line)]" />
            <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-[var(--color-line)]" />
            <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-[var(--color-line)]" />
            <span className="absolute left-1/2 top-3 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.4em] text-[var(--color-fg-muted)]">
              neural · interface · v2
            </span>
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.4em] text-[var(--color-fg-muted)]">
              {NODE_LABEL_NODES} nodes · {NODE_LABEL_EDGES}+ edges
            </span>
          </div>
        </div>
      </div>

      {/* HUD bottom — status + toolbelt */}
      <div className="relative z-10 mx-auto grid w-full max-w-[88rem] grid-cols-1 items-center gap-3 border-t border-[var(--color-line)] px-6 py-5 text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)] md:grid-cols-[auto_1fr_auto] lg:px-10">
        <span className="hero-status flex items-center gap-3 font-mono">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
          </span>
          <span className="text-[var(--color-fg)]">Building products</span>
          <span>—</span>
          <span>Osaka × Tokyo</span>
        </span>

        <div className="hero-toolbelt relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[var(--color-bg)] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[var(--color-bg)] to-transparent" />
          <div className="hero-toolbelt-track flex w-max items-center gap-7 font-mono whitespace-nowrap will-change-transform">
            {[...TOOLBELT, ...TOOLBELT].map((tool, i) => (
              <span
                key={`${tool.name}-${i}`}
                className="group relative flex items-center gap-2 text-[var(--color-fg)]"
              >
                <span className="h-1 w-1 rounded-full bg-[var(--color-accent)]" />
                <span className="cursor-default">{tool.name}</span>
                <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-[var(--color-line)] bg-[var(--color-bg-card)] px-3 py-1.5 font-mono text-[10px] normal-case tracking-normal text-[var(--color-fg-muted)] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {tool.desc}
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className="hero-status flex items-center justify-end gap-3 font-mono">
          <span>Scroll</span>
          <span className="block h-6 w-[1px] animate-[scrollLine_1.6s_ease-in-out_infinite] bg-gradient-to-b from-[var(--color-accent)] to-transparent" />
        </div>
      </div>

      <style>{`
        @keyframes scrollLine {
          0% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
          51% { transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
      `}</style>
    </section>
  );
}

const NODE_LABEL_NODES = 90;
const NODE_LABEL_EDGES = 220;
