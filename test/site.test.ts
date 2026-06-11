import { describe, it, expect } from "vitest";
import { absoluteUrl, siteConfig } from "@/lib/site";

describe("absoluteUrl", () => {
  it("returns the base URL when given no path", () => {
    expect(absoluteUrl()).toBe(siteConfig.url.replace(/\/$/, ""));
  });

  it("joins an absolute path", () => {
    expect(absoluteUrl("/article/hello")).toBe(`${siteConfig.url}/article/hello`);
  });

  it("adds a leading slash when missing", () => {
    expect(absoluteUrl("tag/coffee")).toBe(`${siteConfig.url}/tag/coffee`);
  });

  it("never produces a double slash between host and path", () => {
    expect(absoluteUrl("/x")).not.toMatch(/[^:]\/\//);
  });
});
