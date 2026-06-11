const WORDS_PER_MINUTE = 200;

/**
 * Estimate reading time (in whole minutes, min 1) from HTML content.
 * Strips tags and counts whitespace-delimited words.
 */
export function estimateReadingTime(html: string): number {
  const text = html
    .replace(/<[^>]*>/g, " ") // strip tags
    .replace(/&[a-z]+;/gi, " ") // strip entities
    .trim();

  if (!text) return 1;

  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
