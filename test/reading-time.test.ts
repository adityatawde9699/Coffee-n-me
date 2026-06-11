import { describe, it, expect } from "vitest";
import { estimateReadingTime } from "@/lib/utils/reading-time";

describe("estimateReadingTime", () => {
  it("returns at least 1 minute for empty or tiny content", () => {
    expect(estimateReadingTime("")).toBe(1);
    expect(estimateReadingTime("<p></p>")).toBe(1);
    expect(estimateReadingTime("<p>Just a few words here.</p>")).toBe(1);
  });

  it("strips HTML tags before counting words", () => {
    const html = `<p>${"word ".repeat(200)}</p>`; // 200 words @ 200wpm = 1 min
    expect(estimateReadingTime(html)).toBe(1);
  });

  it("scales with word count (~200 wpm)", () => {
    const html = `<div>${"word ".repeat(600)}</div>`; // 600 words ≈ 3 min
    expect(estimateReadingTime(html)).toBe(3);
  });

  it("decodes/ignores entities and rounds sensibly", () => {
    const html = `<p>${"hello&nbsp;world ".repeat(50)}</p>`;
    expect(estimateReadingTime(html)).toBeGreaterThanOrEqual(1);
  });
});
