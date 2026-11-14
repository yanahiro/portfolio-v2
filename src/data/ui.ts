import type { Locale } from "@/lib/i18n";

type Ui = {
  /** Page description for search engines and share cards. */
  description: string;
  navLabel: string;
  languageLabel: string;
  careerLabel: string;
  photoLabel: string;
  filterLabel: string;
};

// Labels that are not part of a section's own copy (see about.ts and career.ts for those).
export const UI: Record<Locale, Ui> = {
  ja: {
    description:
      "Hiroki Yanagisawa のポートフォリオ。株式会社Wunderbar CTO / エンジニア。新卒からシステム開発に関わって、もうすぐ20年目。",
    navLabel: "セクション",
    languageLabel: "言語",
    careerLabel: "経歴",
    photoLabel: "柳澤 宏樹の写真",
    filterLabel: "カテゴリで絞り込み",
  },
  en: {
    description:
      "Portfolio of Hiroki Yanagisawa, CTO at Wunderbar Inc. and engineer, with almost 20 years in software development.",
    navLabel: "Sections",
    languageLabel: "Language",
    careerLabel: "Career",
    photoLabel: "Photo of Hiroki Yanagisawa",
    filterLabel: "Filter by category",
  },
};
