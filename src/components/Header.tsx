import { Fragment } from "react";
import BrandLogo from "./BrandLogo";
import { UI } from "@/data/ui";
import { siteConfig } from "@/lib/config";
import { LOCALE_PATH, LOCALES, type Locale } from "@/lib/i18n";

const NAV = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export default function Header({ locale }: { locale: Locale }) {
  const ui = UI[locale];
  return (
    <header className="site-header fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-12">
      <a href="#top" aria-label={siteConfig.brand} className="inline-flex items-center gap-2.5 font-display text-lg tracking-[0.08em]">
        <BrandLogo className="h-5 w-auto" />
        <span className="hidden min-[420px]:inline">{siteConfig.brand}</span>
      </a>
      <div className="flex items-center gap-4 md:gap-8">
        <nav aria-label={ui.navLabel} className="flex items-center gap-4 font-display text-[13px] uppercase tracking-[0.18em] md:gap-8">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="py-3 transition-colors hover:text-[var(--color-accent)]">
              {item.label}
            </a>
          ))}
        </nav>
        {/* Each language is its own page (/ and /en), so these are plain links. */}
        <nav aria-label={ui.languageLabel} className="flex items-center gap-1.5 font-mono text-xs tracking-[0.12em] text-[var(--color-fg-muted)]">
          {LOCALES.map((item, i) => (
            <Fragment key={item.key}>
              {i > 0 ? <span aria-hidden className="text-[var(--color-line)]">/</span> : null}
              <a
                href={LOCALE_PATH[item.key]}
                hrefLang={item.key}
                lang={item.key}
                aria-label={item.name}
                aria-current={item.key === locale ? "true" : undefined}
                className="py-3 transition-colors hover:text-[var(--color-fg)] aria-[current]:text-[var(--color-accent)]"
              >
                {item.short}
              </a>
            </Fragment>
          ))}
        </nav>
      </div>
    </header>
  );
}
