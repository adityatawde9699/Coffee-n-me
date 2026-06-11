import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/db/queries/post";
import { siteConfig } from "@/lib/site";

export const alt = "Coffee'n me article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  const title = post?.title ?? siteConfig.name;
  const category = post?.category?.name;
  const author = post?.author?.name;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #1a1209 0%, #2a1d10 100%)",
          color: "#f0e6d8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 9999,
              background: "#c8915a",
              display: "flex",
            }}
          />
          <span style={{ fontWeight: 700 }}>{siteConfig.name}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {category && (
            <span
              style={{
                fontSize: 26,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "#c8915a",
              }}
            >
              {category}
            </span>
          )}
          <div
            style={{
              fontSize: title.length > 60 ? 60 : 76,
              fontWeight: 800,
              lineHeight: 1.1,
              display: "flex",
            }}
          >
            {title.length > 110 ? `${title.slice(0, 107)}…` : title}
          </div>
        </div>

        <div style={{ fontSize: 28, color: "#c9b8a3", display: "flex" }}>
          {author ? `By ${author}` : "Stories brewed with care"}
        </div>
      </div>
    ),
    { ...size }
  );
}
