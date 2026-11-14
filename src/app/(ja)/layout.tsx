import "../globals.css";
import Analytics from "@/components/Analytics";
import SmoothScroll from "@/components/SmoothScroll";
import { buildMetadata } from "@/lib/metadata";
import { fontClasses } from "../fonts";

export const metadata = buildMetadata("ja");

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={fontClasses}>
      <Analytics />
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
