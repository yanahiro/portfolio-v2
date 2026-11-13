import { SKILLS } from "@/data/skills";
import LogoPlayground from "./skills/LogoPlayground";

export default function Skills() {
  return (
    <section
      id="skills"
      data-slot="skills"
      className="relative flex min-h-[100svh] flex-col justify-center gap-8 px-6 py-28 md:px-12"
    >
      <LogoPlayground />
      <div className="flex items-center justify-between font-mono text-xs tracking-[0.2em] text-[var(--color-fg-muted)]">
        <span>{SKILLS.length} TECHNOLOGIES</span>
        <span aria-hidden className="motion-reduce:hidden">DRAG TO PLAY</span>
      </div>
    </section>
  );
}
