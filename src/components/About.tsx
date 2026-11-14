import Image from "next/image";
import { ABOUT } from "@/data/about";
import { UI } from "@/data/ui";
import type { Locale } from "@/lib/i18n";
import TypedBlock, { Typed } from "./Typed";

export default function About({ locale }: { locale: Locale }) {
  const about = ABOUT[locale];
  // English runs to about twice the characters, so it types faster and sits tighter.
  const en = locale === "en";
  return (
    <section id="about" className="relative flex min-h-[100svh] items-center px-6 py-28 md:px-12">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-12 md:gap-6">
        {/* Drawn in particles by the stage; the real photo shows on hover, focus, or without WebGL. */}
        <div
          data-slot="photo"
          role="figure"
          tabIndex={0}
          aria-label={UI[locale].photoLabel}
          className="photo-slot relative mx-auto aspect-[3/4] w-full max-w-sm md:col-span-4 md:col-start-2"
        >
          <Image
            src="/images/profile/portrait.webp"
            alt="Hiroki Yanagisawa"
            fill
            sizes="(min-width: 768px) 32vw, 90vw"
            className="photo-slot-image object-cover"
          />
        </div>

        <TypedBlock className="flex flex-col gap-7 md:col-span-5 md:col-start-7">
          <p className="font-mono text-xs tracking-[0.25em] text-[var(--color-fg-muted)]">
            <span aria-hidden>&gt; </span>
            <Typed runs={[about.command]} speed={70} />
          </p>
          <div className="flex flex-col gap-3">
            {/* What I do now comes first, marked as current. */}
            <p className="flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-[var(--color-accent)]">
              <span aria-hidden className="now-dot" />
              <Typed runs={[about.status]} speed={70} />
            </p>
            <h2 className="font-jp text-[clamp(1.5rem,2.6vw,2.125rem)] font-bold leading-[1.6]">
              {about.title.map((line) => (
                <span key={line} className="block">
                  <Typed runs={[line]} speed={42} />
                </span>
              ))}
            </h2>
          </div>
          {about.body.map((runs, i) => (
            <p key={i} className={`font-jp text-base text-[var(--color-fg-soft)] ${en ? "leading-[1.9]" : "leading-[2.2]"}`}>
              <Typed runs={runs} speed={en ? 6 : 11} />
            </p>
          ))}
        </TypedBlock>
      </div>
    </section>
  );
}
