"use client";

import { useEffect, useState } from "react";

// Coffee-surface y-range inside the cup outline below, used to drive the fill.
const CUP_TOP = 10;
const CUP_BOTTOM = 21;

/**
 * Signature reading-progress indicator: a thin gradient line across the top
 * (functional, expected UX) plus a small floating coffee cup that fills as
 * you read and reveals steam once you've reached the end — doubling as a
 * back-to-top button. Ties the "brewing" theme directly to the act of
 * reading, rather than a generic progress bar.
 */
export function ReadingProgressCup() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function update() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const pct = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      setProgress(pct);
      setVisible(window.scrollY > window.innerHeight * 0.6);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const fillY = CUP_BOTTOM - progress * (CUP_BOTTOM - CUP_TOP);
  const done = progress > 0.97;

  return (
    <>
      <div
        className="fixed top-0 left-0 w-full h-1 z-[60] bg-transparent pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full transition-[width] duration-150 ease-out"
          style={{
            width: `${progress * 100}%`,
            background:
              "linear-gradient(90deg, hsl(var(--primary)), hsl(33 80% 58%))",
          }}
        />
      </div>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label={`Back to top — ${Math.round(progress * 100)}% read`}
        className={`fixed bottom-6 right-6 z-50 grid place-items-center w-12 h-12 rounded-full glass-card shadow-lg shadow-black/[0.06] dark:shadow-black/30 transition-all duration-500 hover:border-primary/30 ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <svg viewBox="0 0 32 32" className="w-6 h-6" role="img" aria-hidden="true">
          <defs>
            <clipPath id="cup-interior-clip">
              <path d="M8.6 12 L9.9 21 Q10.2 23 16 23 Q21.8 23 22.1 21 L23.4 12 Z" />
            </clipPath>
          </defs>

          {/* Coffee fill, clipped to the cup's interior */}
          <rect
            x="8"
            y={fillY}
            width="16"
            height={Math.max(0, CUP_BOTTOM - fillY + 2)}
            fill="hsl(var(--primary))"
            clipPath="url(#cup-interior-clip)"
            className="transition-all duration-150 ease-out"
          />

          {/* Cup + handle outline */}
          <path
            d="M7.6 13 L9.2 22 Q9.5 24 16 24 Q22.5 24 22.8 22 L24.4 13 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-foreground/70"
          />
          <path
            d="M23 15.2 Q27.4 15.2 27.4 18.6 Q27.4 22 23 22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-foreground/70"
          />

          {/* Steam, revealed once the cup is full */}
          <g
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            className={`text-primary transition-opacity duration-700 ${
              done ? "opacity-70 animate-float" : "opacity-0"
            }`}
          >
            <path d="M13 11 Q11.4 8.4 13 5.8" />
            <path d="M17 11 Q15.4 7.8 17 5.2" />
          </g>
        </svg>
      </button>
    </>
  );
}
