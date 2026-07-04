# Coffee'n Me — brand assets

Calligraphic wordmark set. Lettering is outlined from **Great Vibes** (SIL Open Font
License, © The Great Vibes Project Authors) — converted to static vector paths, no
font files shipped. Palette: Rich Espresso `#3B241A`, Warm Cream `#F8F5F2`,
Caramel `#B67A45`.

| File | Use |
|------|-----|
| `wordmark.svg` / `wordmark-cream.svg` | Full "Coffee'n Me" lockup (light / dark surfaces). Coffee-bean apostrophe in caramel. |
| `wordmark-mono.svg` | Single-color version, inherits `currentColor` — inline it in JSX and tint via CSS. |
| `navbar-logo.svg` / `navbar-logo-cream.svg` | Wordmark with steam swirls rising from the ff ligature. Sized for 28–40 px navbar heights. |
| `monogram.svg` / `-cream` / `-mono` | Intertwined C + M for compact placements. |
| `favicon-circle.svg` | Circular browser-tab mark: espresso disc, cream CM monogram, caramel steam. Best ≥ 32 px. |
| `favicon-circle-c.svg` | Alternate tab mark: single cursive C + caramel bean. Stays legible at 16 px. |

The `-mono` files use `currentColor`, so they only tint when inlined (not via `<img>`).
