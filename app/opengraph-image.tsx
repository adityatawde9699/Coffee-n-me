import { ImageResponse } from "next/og";
import { LogoWordmark } from "@/components/layout/LogoWordmark";

export const alt = "Coffee'n me — stories brewed with care";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
          gap: 40,
          background: "#241610",
          fontFamily: "sans-serif",
        }}
      >
        <LogoWordmark color="#F8F5F2" style={{ width: 780, height: 282 }} />
        <span style={{ fontSize: 30, color: "#C3A78E", letterSpacing: 0.5 }}>
          Where words brew slowly and ideas are served warm.
        </span>
      </div>
    ),
    { ...size }
  );
}
