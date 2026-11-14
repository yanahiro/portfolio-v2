const env = (key: string, fallback = "") =>
  (process.env[key] && process.env[key]!.length > 0 ? process.env[key]! : fallback);

const X_HANDLE = env("NEXT_PUBLIC_X_HANDLE", "yanatch1982");

export const siteConfig = {
  name: env("NEXT_PUBLIC_SITE_NAME", "Yanatch"),
  brand: env("NEXT_PUBLIC_BRAND", "Yanatch"),
  /** Public origin, used to build absolute URLs for share images. Empty in local dev. */
  url: env("NEXT_PUBLIC_SITE_URL"),
  /** GA4 measurement ID (G-XXXXXXXXXX). Empty turns analytics off. */
  gaId: env("NEXT_PUBLIC_GA_ID"),
  description: env(
    "NEXT_PUBLIC_SITE_DESCRIPTION",
    "Hiroki Yanagisawa のポートフォリオ。株式会社Wunderbar CTO / エンジニア。新卒からシステム開発に関わって、もうすぐ20年目。"
  ),
  social: {
    xHandle: X_HANDLE,
    xProfile: `https://x.com/${X_HANDLE}`,
    xDm: `https://x.com/messages/compose?recipient_id=${X_HANDLE}`,
    github: env("NEXT_PUBLIC_GITHUB_URL", "https://github.com/yanahiro/"),
    instagram: env("NEXT_PUBLIC_INSTAGRAM_URL", "https://www.instagram.com/yanatch1982/"),
    facebook: env("NEXT_PUBLIC_FACEBOOK_URL", "https://www.facebook.com/hiroki.yanagisawa.10"),
  },
} as const;
