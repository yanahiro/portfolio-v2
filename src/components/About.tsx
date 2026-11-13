import Image from "next/image";
import RevealLines from "./RevealLines";

export default function About() {
  return (
    <section id="about" className="relative flex min-h-[100svh] items-center px-6 py-28 md:px-12">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-12 md:gap-6">
        {/* Drawn in particles by the stage; the real photo shows on hover, focus, or without WebGL. */}
        <div
          data-slot="photo"
          role="figure"
          tabIndex={0}
          aria-label="柳澤 宏樹の写真"
          className="photo-slot relative mx-auto aspect-[3/4] w-full max-w-sm md:col-span-4 md:col-start-2"
        >
          <Image
            src="/images/profile/me.webp"
            alt="Hiroki Yanagisawa"
            fill
            sizes="(min-width: 768px) 32vw, 90vw"
            className="photo-slot-image object-cover"
          />
        </div>

        <RevealLines className="flex flex-col gap-7 md:col-span-5 md:col-start-7">
          <p className="font-mono text-xs tracking-[0.25em] text-[var(--color-fg-muted)]">ABOUT</p>
          <h2 data-lines className="font-jp text-[clamp(1.5rem,2.6vw,2.125rem)] font-bold leading-[1.6]">
            株式会社Wunderbar
            <br />
            CTO / エンジニア
          </h2>
          <p data-lines className="font-jp text-base leading-[2.2] text-[var(--color-fg-soft)]">
            新卒からシステム開発の業界に関わって、もうすぐ20年目。新規開発、保守開発、運用など、システム開発で起きる出来事はだいたい経験してきました。
          </p>
          <p data-lines className="font-jp text-base leading-[2.2] text-[var(--color-fg-soft)]">
            今は、自身の軸となる「システム開発構築」を強みに、運営しているサービスの開発責任者として日々奔走しています。
          </p>
        </RevealLines>
      </div>
    </section>
  );
}
