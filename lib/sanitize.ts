import "server-only";
import sanitizeHtml from "sanitize-html";

/**
 * Sanitize rich-text HTML produced by the TipTap editor before it is rendered
 * with dangerouslySetInnerHTML. Defense-in-depth against stored XSS even though
 * authors are trusted (WRITER/ADMIN).
 *
 * Note: `data:` URIs are intentionally disallowed — `data:image/svg+xml` can
 * carry scripts. Images must be http(s) (e.g. Cloudinary uploads).
 */
export function sanitizeArticleHtml(dirty: string): string {
  return sanitizeHtml(dirty, {
    allowedTags: [
      "p", "br", "hr",
      "strong", "b", "em", "i", "u", "s", "del", "mark",
      "h1", "h2", "h3", "h4",
      "blockquote", "ul", "ol", "li",
      "a", "code", "pre",
      "img", "figure", "figcaption", "span",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      code: ["class"],
      pre: ["class"],
      span: ["class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["http", "https"] },
    // Force safe rel/target on every link.
    transformTags: {
      a: sanitizeHtml.simpleTransform(
        "a",
        { rel: "noopener noreferrer nofollow", target: "_blank" },
        true
      ),
    },
    disallowedTagsMode: "discard",
  });
}
