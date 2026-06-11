import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

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
          gap: 28,
          background: "linear-gradient(135deg, #1a1209 0%, #2a1d10 100%)",
          color: "#f0e6d8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: 9999, background: "#c8915a", display: "flex" }} />
          <span style={{ fontSize: 64, fontWeight: 800 }}>{siteConfig.name}</span>
        </div>
        <span style={{ fontSize: 32, color: "#c9b8a3" }}>
          Where words brew slowly and ideas are served warm.
        </span>
      </div>
    ),
    { ...size }
  );
}
