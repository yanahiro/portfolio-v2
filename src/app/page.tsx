import About from "@/components/About";
import Career from "@/components/Career";
import Contact from "@/components/Contact";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import ParticleStageLazy from "@/components/particles/ParticleStageLazy";

export default function Home() {
  return (
    <>
      <ParticleStageLazy />
      <Header />
      <main className="relative z-10">
        <Hero />
        <Career />
        <About />
        <Skills />
        {/* A quiet stretch of backdrop before the last screen. */}
        <div aria-hidden className="h-[35svh]" />
        <Contact />
      </main>
    </>
  );
}
