"use client";

import dynamic from "next/dynamic";

// Lazy-load the three.js scene so its chunk stays off the critical path and
// only runs in the browser (ssr: false can't live in a server component).
const HeroSmoke = dynamic(
  () => import("./HeroSmoke").then((m) => m.HeroSmoke),
  { ssr: false, loading: () => null }
);

export function HeroBackground() {
  return <HeroSmoke />;
}
