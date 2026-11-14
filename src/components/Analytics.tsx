import { GoogleTagManager } from "@next/third-parties/google";
import { siteConfig } from "@/lib/config";

/**
 * Google Tag Manager. Renders nothing unless NEXT_PUBLIC_GTM_ID is set.
 * Google Analytics is added as a tag inside the GTM container, not here.
 */
export default function Analytics() {
  return siteConfig.gtmId ? <GoogleTagManager gtmId={siteConfig.gtmId} /> : null;
}
