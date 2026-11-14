import { CAREER } from "@/data/career";
import { UI } from "@/data/ui";
import type { Locale } from "@/lib/i18n";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Header from "./Header";
import Hero from "./Hero";
import Skills from "./Skills";
import ParticleStageLazy from "./particles/ParticleStageLazy";

/** The whole page, in one language. */
export default function Home({ locale }: { locale: Locale }) {
  const ui = UI[locale];
  return (
    <>
      <ParticleStageLazy />
      <Header locale={locale} />
      <main className="relative z-10">
        <Hero />
        <Career items={CAREER[locale]} label={ui.careerLabel} />
        <About locale={locale} />
        <Skills filterLabel={ui.filterLabel} />
        {/* A quiet stretch of backdrop before the last screen. */}
        <div aria-hidden className="h-[35svh]" />
        <Contact />
      </main>
    </>
  );
}
