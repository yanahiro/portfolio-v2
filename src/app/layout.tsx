import type { Metadata } from "next";
import { Space_Grotesk, Noto_Sans_JP, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { siteConfig } from "@/lib/config";

const display = Space_Grotesk({
  variable: "--ff-display",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const jp = Noto_Sans_JP({
  variable: "--ff-jp",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const mono = JetBrains_Mono({
  variable: "--ff-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  ...(siteConfig.url ? { metadataBase: new URL(siteConfig.url) } : {}),
  title: "Hiroki Yanagisawa — CTO / Engineer",
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${display.variable} ${jp.variable} ${mono.variable} antialiased`}>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
