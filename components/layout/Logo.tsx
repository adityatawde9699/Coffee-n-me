interface LogoProps {
  className?: string;
}

/**
 * Coffee'n me cup mark. Draws in `currentColor`, so set the colour with a
 * text utility (e.g. `text-primary`). Pair with the wordmark in the header.
 */
export function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      role="img"
      aria-label="Coffee'n me"
    >
      {/* steam */}
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.55">
        <path d="M13 11 Q11.4 8.4 13 5.8" />
        <path d="M17 11 Q15.4 7.8 17 5.2" />
      </g>
      {/* cup body */}
      <path
        d="M7.6 13 L9.2 22 Q9.5 24 16 24 Q22.5 24 22.8 22 L24.4 13 Z"
        fill="currentColor"
      />
      {/* coffee surface (cut-out) */}
      <ellipse cx="16" cy="13" rx="8.4" ry="1.7" fill="currentColor" opacity="0.35" />
      {/* handle */}
      <path
        d="M23 15.2 Q27.4 15.2 27.4 18.6 Q27.4 22 23 22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* saucer */}
      <path
        d="M7 25.5 Q16 28 25 25.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );
}
