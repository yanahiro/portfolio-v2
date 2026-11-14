import "../../globals.css";
import Analytics from "@/components/Analytics";
import SmoothScroll from "@/components/SmoothScroll";
import { buildMetadata } from "@/lib/metadata";
import { fontClasses } from "../../fonts";

export const metadata = buildMetadata("en");

export default function RootLayout({ children }: LayoutProps<"/en">) {
  return (
    <html lang="en" className={fontClasses}>
      <Analytics />
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
