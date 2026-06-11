import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArticleCard } from "@/components/article/ArticleCard";

const basePost = {
  title: "The Art of Slow Brewing",
  slug: "art-of-slow-brewing",
  excerpt: "Why patience makes a better cup.",
  publishedAt: new Date("2026-01-15T00:00:00Z"),
  readingTime: 7,
  author: { name: "Jane Roaster" },
  category: { name: "Culture", slug: "culture" },
};

describe("ArticleCard", () => {
  it("renders title, excerpt, author and reading time", () => {
    render(<ArticleCard post={basePost} />);
    expect(screen.getByText("The Art of Slow Brewing")).toBeInTheDocument();
    expect(screen.getByText("Why patience makes a better cup.")).toBeInTheDocument();
    expect(screen.getByText("Jane Roaster")).toBeInTheDocument();
    expect(screen.getByText(/7 min/)).toBeInTheDocument();
  });

  it("links to the article and its category", () => {
    render(<ArticleCard post={basePost} />);
    const articleLinks = screen
      .getAllByRole("link")
      .map((a) => a.getAttribute("href"));
    expect(articleLinks).toContain("/article/art-of-slow-brewing");
    expect(articleLinks).toContain("/category/culture");
  });

  it("shows 'Draft' when there is no published date", () => {
    render(<ArticleCard post={{ ...basePost, publishedAt: null }} />);
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("renders a larger featured variant without crashing", () => {
    render(<ArticleCard post={basePost} featured />);
    expect(screen.getByText("The Art of Slow Brewing")).toBeInTheDocument();
  });
});
