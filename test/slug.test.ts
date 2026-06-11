import { describe, it, expect } from "vitest";
import { slugify } from "@/lib/utils/slug";

describe("slugify", () => {
  it("lowercases and hyphenates spaces", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("strips punctuation and symbols", () => {
    expect(slugify("Tech & Culture!")).toBe("tech-culture");
  });

  it("collapses repeated separators and trims edges", () => {
    expect(slugify("  --Coffee   Brews-- ")).toBe("coffee-brews");
  });

  it("drops accented/non-ascii characters", () => {
    expect(slugify("Café Latté")).toBe("caf-latt");
  });

  it("returns empty string for symbol-only input", () => {
    expect(slugify("!!! @@@")).toBe("");
  });
});
