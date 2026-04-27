"use client";

import { useEffect, useRef, useState } from "react";
import BrandLogo from "./BrandLogo";
import { siteConfig } from "@/lib/config";

const NAV = [
  { href: "#about", label: "About" },
  { href: "#strengths", label: "Strengths" },
  { href: "#skills", label: "Skills" },
  { href: "#works", label: "Works" },
  { href: "#vision", label: "Vision" },
  { href: "#contact", label: "Contact" },
];

const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*+-/";

function NavLink({ href, label }: { href: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef(0);

  const start = () => {
    cancelAnimationFrame(rafRef.current);
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const total = label.length;
    const duration = 350;
    const startT = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - startT) / duration);
      const reveal = Math.floor(p * total);
      let out = "";
      for (let i = 0; i < total; i++) {
        if (i < reveal) out += label[i];
        else if (label[i] === " ") out += " ";
        else out += POOL[Math.floor(Math.random() * POOL.length)];
      }
      el.textContent = out;
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const reset = () => {
    cancelAnimationFrame(rafRef.current);
    if (ref.current) ref.current.textContent = label;
  };

  return (
    <a
      href={href}
      onMouseEnter={start}
      onMouseLeave={reset}
      className="transition-colors hover:text-[var(--color-fg)]"
    >
      <span ref={ref}>{label}</span>
    </a>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3 backdrop-blur-md bg-[var(--color-bg)]/55" : "py-6"
      }`}
    >
      <div className="mx-auto flex max-w-[88rem] items-center justify-between px-6 lg:px-10">
        <a
          href="#top"
          className="group inline-flex items-center gap-2.5 font-display text-lg tracking-tight"
          aria-label={siteConfig.brand}
        >
          <BrandLogo className="h-6 w-auto text-[var(--color-accent)] transition-transform duration-300 group-hover:scale-110" />
          <span className="text-[var(--color-fg)]">{siteConfig.brand}</span>
        </a>
        <nav className="hidden items-center gap-7 font-display text-sm text-[var(--color-fg-muted)] md:flex">
          {NAV.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>
        <a
          href="#contact"
          className="hidden rounded-full border border-[var(--color-line)] px-4 py-2 font-display text-xs uppercase tracking-[0.2em] text-[var(--color-fg)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] md:inline-flex"
        >
          Get in touch
        </a>
      </div>
    </header>
  );
}
