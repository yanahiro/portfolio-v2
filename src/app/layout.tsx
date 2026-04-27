import type { Metadata } from "next";
import { Space_Grotesk, Inter, Noto_Sans_JP, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Loader from "@/components/Loader";
import { siteConfig } from "@/lib/config";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jp = Noto_Sans_JP({
  variable: "--font-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hiroki Yanagisawa — System Developer",
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${display.variable} ${sans.variable} ${jp.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="grain min-h-full flex flex-col">
        <Loader />
        <SmoothScroll />
        <Cursor />
        {children}
      </body>
    </html>
  );
}
