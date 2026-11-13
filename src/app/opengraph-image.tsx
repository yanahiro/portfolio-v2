import { ImageResponse } from "next/og";

export const alt = "Hiroki Yanagisawa — CTO / Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LOGO_PATH =
  "M484.61 4.16A4.34 4.34 0 0 0 478.44.48L305 81.09a4.34 4.34 0 0 0-.3 7.72l38.48 21.61L238.91 272.67a5.87 5.87 0 0 1-9.93-.06L127.88 112.74a4.33 4.33 0 0 0-3.67-2H2.08A2.47 2.47 0 0 0 0 114.45L169.36 396.84a5.85 5.85 0 0 1 .84 3v186a5.87 5.87 0 0 0 5.87 5.87H291.71a5.87 5.87 0 0 0 5.87-5.87V400a5.85 5.85 0 0 1 1-3.24L449.28 170l39.61 22.25a4.35 4.35 0 0 0 6.47-4Z";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 44,
          background: "#0e0e0e",
          color: "#e8e8e4",
        }}
      >
        <svg width="210" height="250" viewBox="0 0 496 592">
          <path d={LOGO_PATH} fill="#e8e8e4" />
        </svg>
        <div style={{ display: "flex", fontSize: 44, letterSpacing: 14 }}>HIROKI YANAGISAWA</div>
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 8, color: "#a8a8a2" }}>CTO / ENGINEER</div>
      </div>
    ),
    size,
  );
}
