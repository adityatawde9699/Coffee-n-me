import { describe, it, expect } from "vitest";
import { sanitizeArticleHtml } from "@/lib/sanitize";

describe("sanitizeArticleHtml", () => {
  it("strips <script> tags and their content", () => {
    const out = sanitizeArticleHtml('<p>Hi</p><script>alert(1)</script>');
    expect(out).toContain("<p>Hi</p>");
    expect(out).not.toContain("script");
    expect(out).not.toContain("alert");
  });

  it("removes inline event handlers", () => {
    const out = sanitizeArticleHtml('<p onclick="evil()">x</p>');
    expect(out).not.toContain("onclick");
  });

  it("removes <iframe> and other disallowed tags", () => {
    const out = sanitizeArticleHtml('<iframe src="https://evil.test"></iframe><p>ok</p>');
    expect(out).not.toContain("iframe");
    expect(out).toContain("<p>ok</p>");
  });

  it("keeps allowed formatting tags", () => {
    const out = sanitizeArticleHtml("<p><strong>bold</strong> <em>italic</em></p>");
    expect(out).toContain("<strong>bold</strong>");
    expect(out).toContain("<em>italic</em>");
  });

  it("forces safe rel/target on links", () => {
    const out = sanitizeArticleHtml('<a href="https://x.test">link</a>');
    expect(out).toContain('target="_blank"');
    expect(out).toContain("noopener");
    expect(out).toContain("nofollow");
  });

  it("drops data: URIs on images (SVG-XSS vector)", () => {
    const out = sanitizeArticleHtml(
      '<img src="data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=" alt="x" />'
    );
    expect(out).not.toContain("data:");
  });

  it("preserves https image sources", () => {
    const out = sanitizeArticleHtml(
      '<img src="https://res.cloudinary.com/x/image/upload/a.png" alt="pic" />'
    );
    expect(out).toContain("res.cloudinary.com");
  });

  it("strips javascript: hrefs", () => {
    const out = sanitizeArticleHtml('<a href="javascript:alert(1)">x</a>');
    expect(out).not.toContain("javascript:");
  });
});
