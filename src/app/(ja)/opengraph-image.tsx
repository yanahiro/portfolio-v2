import { ogAlt, ogImage, ogSize } from "@/lib/ogImage";

export const alt = ogAlt;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage();
}
