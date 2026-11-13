import BrandLogo from "./BrandLogo";
import { siteConfig } from "@/lib/config";

const NAV = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="site-header fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-12">
      <a href="#top" aria-label={siteConfig.brand} className="inline-flex items-center gap-2.5 font-display text-lg tracking-[0.08em]">
        <BrandLogo className="h-5 w-auto" />
        <span className="hidden min-[420px]:inline">{siteConfig.brand}</span>
      </a>
      <nav aria-label="セクション" className="flex items-center gap-5 font-display text-[13px] uppercase tracking-[0.18em] md:gap-8">
        {NAV.map((item) => (
          <a key={item.href} href={item.href} className="py-3 transition-colors hover:text-[var(--color-accent)]">
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
