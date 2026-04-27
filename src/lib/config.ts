const env = (key: string, fallback = "") =>
  (process.env[key] && process.env[key]!.length > 0 ? process.env[key]! : fallback);

const X_HANDLE = env("NEXT_PUBLIC_X_HANDLE", "yanatch1982");

export const siteConfig = {
  name: env("NEXT_PUBLIC_SITE_NAME", "Yanatch"),
  brand: env("NEXT_PUBLIC_BRAND", "Yanatch"),
  description: env(
    "NEXT_PUBLIC_SITE_DESCRIPTION",
    "Hiroki Yanagisawa のポートフォリオ。マネジメント・システム設計・プログラミングを軸に、フリーランスエンジニアとして活動しています。"
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
