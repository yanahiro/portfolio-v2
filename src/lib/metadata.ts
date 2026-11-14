import type { Metadata } from "next";
import { UI } from "@/data/ui";
import { siteConfig } from "./config";
import { LOCALE_PATH, type Locale } from "./i18n";

export function buildMetadata(locale: Locale): Metadata {
  return {
    ...(siteConfig.url ? { metadataBase: new URL(siteConfig.url) } : {}),
    title: "Hiroki Yanagisawa — CTO / Engineer",
    // The site-wide description from the environment is written in Japanese.
    description: locale === "ja" ? siteConfig.description : UI.en.description,
    alternates: {
      canonical: LOCALE_PATH[locale],
      languages: { ja: LOCALE_PATH.ja, en: LOCALE_PATH.en, "x-default": LOCALE_PATH.ja },
    },
    openGraph: { locale: locale === "ja" ? "ja_JP" : "en_US" },
  };
}
