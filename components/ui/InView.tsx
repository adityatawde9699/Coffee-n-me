"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Adds `.in-view` to its wrapper the first time it scrolls into the viewport,
 * which globals.css uses to trigger `.stagger-children` / `.reveal-group`
 * animations. Content stays visible by default (see the noscript fallback in
 * app/layout.tsx and the prefers-reduced-motion block in globals.css) — this
 * only defers *when* the entrance animation plays, never whether it's seen.
 */
export function InView({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal-group ${inView ? "in-view" : ""} ${className}`}>
      {children}
    </div>
  );
}
