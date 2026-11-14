import { GoogleAnalytics } from "@next/third-parties/google";
import { siteConfig } from "@/lib/config";

/** Google Analytics (GA4). Renders nothing unless NEXT_PUBLIC_GA_ID is set. */
export default function Analytics() {
  return siteConfig.gaId ? <GoogleAnalytics gaId={siteConfig.gaId} /> : null;
}
