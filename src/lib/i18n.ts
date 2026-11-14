export type Locale = "ja" | "en";

/** Japanese lives at the root, English under /en. */
export const LOCALE_PATH: Record<Locale, string> = { ja: "/", en: "/en" };

export const LOCALES: { key: Locale; short: string; name: string }[] = [
  { key: "ja", short: "JA", name: "日本語" },
  { key: "en", short: "EN", name: "English" },
];
