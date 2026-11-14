import type { Locale } from "@/lib/i18n";

/** A run of text; `mark` runs get an accent underline once everything is typed. */
export type Run = string | { mark: string };

type About = {
  command: string;
  status: string;
  title: string[];
  body: Run[][];
};

export const ABOUT: Record<Locale, About> = {
  ja: {
    command: "whoami",
    status: "NOW",
    title: ["株式会社Wunderbar", "取締役CTO / エンジニア"],
    body: [
      [
        "大阪生まれ。SIベンダーでの受託開発を起点に、システム開発に関わって、",
        { mark: "もうすぐ20年目" },
        "。生保・銀行・官公庁・製造・小売の現場で、見積もりや要件定義から運用まで、システム開発で起きる出来事はだいたい経験してきました。",
      ],
      [
        "28歳でフリーランスに。その後はフィリピン拠点とのオフショア開発で、テクニカルディレクター、事業部マネージャーとして、",
        { mark: "日本とフィリピンにまたがるチーム" },
        "を率いました。",
      ],
      [
        "現在は株式会社Wunderbarの取締役CTO。タレントの肖像素材を使えるサブスクリプションサービス「Skettt」の開発を、少人数の体制から立ち上げ、開発組織を育ててきました。自身の軸である「",
        { mark: "システム開発構築" },
        "」を強みに、開発責任者として日々奔走しています。",
      ],
    ],
  },
  en: {
    command: "whoami",
    status: "NOW",
    title: ["Wunderbar Inc.", "Director & CTO / Engineer"],
    body: [
      [
        "Born in Osaka. I started out in contract development at a systems integrator and have now spent ",
        { mark: "almost 20 years" },
        " building software. Across life insurance, banking, government, manufacturing and retail, from estimates and requirements to operations, I have seen most of what can happen on a software project.",
      ],
      [
        "I went freelance at 28. After that I worked in offshore development with a team in the Philippines, as a technical director and then a division manager, leading ",
        { mark: "a team spread across Japan and the Philippines" },
        ".",
      ],
      [
        "Today I am Director and CTO at Wunderbar Inc. I started the development of Skettt, a subscription service for using talent likeness assets, with a small team and have grown the engineering organisation since. With ",
        { mark: "system design and development" },
        " as my core strength, I lead development day to day.",
      ],
    ],
  },
};
