import About from "@/components/About";
import Contact from "@/components/Contact";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SectionSplitter from "@/components/SectionSplitter";
import SideProgress from "@/components/SideProgress";
import Skills from "@/components/Skills";
import Strengths from "@/components/Strengths";
import Vision from "@/components/Vision";
import Works from "@/components/Works";

export default function Home() {
  return (
    <>
      <Header />
      <SideProgress />
      <main>
        <Hero />
        <SectionSplitter />
        <About />
        <SectionSplitter />
        <Strengths />
        <SectionSplitter />
        <Skills />
        <SectionSplitter />
        <Works />
        <SectionSplitter />
        <Vision />
        <SectionSplitter />
        <Contact />
      </main>
    </>
  );
}
