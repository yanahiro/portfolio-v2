import { Space_Grotesk, Noto_Sans_JP, JetBrains_Mono } from "next/font/google";

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

/** Class names for <html>: the font variables shared by both language layouts. */
export const fontClasses = `${display.variable} ${jp.variable} ${mono.variable} antialiased`;
