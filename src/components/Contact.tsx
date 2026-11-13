import Magnetic from "./Magnetic";
import { siteConfig } from "@/lib/config";

const LINKS = [
  { label: "X", href: siteConfig.social.xProfile },
  { label: "GitHub", href: siteConfig.social.github },
  { label: "Instagram", href: siteConfig.social.instagram },
  { label: "Facebook", href: siteConfig.social.facebook },
];

export default function Contact() {
  return (
    <section id="contact" className="relative flex min-h-[100svh] flex-col px-6 pb-8 pt-24 md:px-12">
      <div className="flex flex-1 flex-col items-center justify-center gap-10">
        <h2 className="font-display text-[clamp(3rem,15vw,9.25rem)] font-medium leading-none tracking-[-0.03em]">
          {/* The particle stage draws these words; the text itself stays for readers and fallbacks. */}
          <span data-slot="hello" className="stage-text whitespace-nowrap">
            Say hello.
            <span aria-hidden className="stage-cursor">
              _
            </span>
          </span>
        </h2>
        <ul className="contact-links flex flex-wrap justify-center gap-x-10 gap-y-2">
          {LINKS.map((link, i) => (
            <li key={link.label} style={{ "--i": i } as React.CSSProperties}>
              <Magnetic strength={0.3}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block py-3 font-display text-sm uppercase tracking-[0.18em] transition-colors hover:text-[var(--color-accent)]"
                >
                  {link.label}
                </a>
              </Magnetic>
            </li>
          ))}
        </ul>
      </div>

      <footer className="flex items-center justify-between gap-4 whitespace-nowrap font-mono text-[10px] tracking-[0.12em] text-[var(--color-fg-muted)] md:text-xs md:tracking-[0.2em]">
        <span>© {new Date().getFullYear()} HIROKI YANAGISAWA</span>
        <a href="#top" className="py-2 transition-colors hover:text-[var(--color-fg)]">
          BACK TO TOP ↑
        </a>
      </footer>
    </section>
  );
}
