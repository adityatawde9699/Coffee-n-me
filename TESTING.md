# Testing — Coffee'n me

## Automated tests (Vitest)

```bash
npm test          # run once
npm run test:watch
```

**Coverage (unit + component):**

| File | What it verifies |
|------|------------------|
| `test/reading-time.test.ts` | `estimateReadingTime` — empty/min, tag stripping, ~200 wpm scaling |
| `test/slug.test.ts` | `slugify` — casing, punctuation, collapsing, non-ascii, empty |
| `test/sanitize.test.ts` | `sanitizeArticleHtml` — strips `<script>`/`<iframe>`/event handlers, `javascript:`/`data:` URIs; keeps formatting; forces link rel/target |
| `test/site.test.ts` | `absoluteUrl` — base, path joining, no double slashes |
| `test/ArticleCard.test.tsx` | renders title/excerpt/author/reading-time, article + category links, Draft state, featured variant |

Tests focus on **pure logic and security-critical sanitization** (high signal) rather than chasing a coverage number. Server actions and queries are exercised via the manual E2E flows below (they require a live DB/session).

---

## Manual E2E checklist

> Run against `npm run dev` with a seeded DB. Check each flow before a release.

### 1. Navigation & rendering
- [ ] Home loads; hero, featured story, latest grid, newsletter render
- [ ] Header nav (Essays/Tech/Culture/Brew Guide), footer links all resolve (no 404)
- [ ] Mobile: hamburger opens menu, search box present, links close menu on nav
- [ ] Theme toggle switches light/dark and persists across reload (no flash)
- [ ] Skip-to-content link appears on Tab and jumps to `<main>`

### 2. Blog reading
- [ ] Archive lists posts, paginates (Prev/Next), category filter pills work
- [ ] Article page: title, excerpt, author, reading time, sanitized body render
- [ ] Related stories show (same category) and link correctly
- [ ] Tag links resolve to `/tag/[slug]`; category links to `/category/[slug]`
- [ ] Author page lists that author's posts; avatar loads (no image-host error)
- [ ] Unknown slug → themed 404 ("This cup is empty")

### 3. Search
- [ ] Nav search submits to `/search?q=…`; results match query
- [ ] Empty query shows prompt; no-results shows empty state
- [ ] Works with JS disabled (plain GET form)

### 4. Subscription
- [ ] Valid email → success message; appears in `Subscriber` table
- [ ] Duplicate email → "already on the list" (no error)
- [ ] Invalid / >254 char email → validation message, nothing stored

### 5. Auth
- [ ] Sign in with GitHub and Google → redirected back, session active
- [ ] Nav shows "Dashboard" when signed in, "Sign In" when out
- [ ] `callbackUrl` sanitization: external origin is ignored (stays on-site)

### 6. Writer flow (role: WRITER/ADMIN)
- [ ] Dashboard stats show real counts; recent drafts/published lists populate
- [ ] New Story → editor; toolbar (bold/italic/headings/lists/quote/code/link) works
- [ ] Image button uploads to Cloudinary and inserts an `https` image
- [ ] Save persists; reading time updates; Publish redirects to the live article
- [ ] Editing another author's post is blocked (redirect/Unauthorized)

### 7. Admin flow (role: ADMIN)
- [ ] `/dashboard/categories` create + delete; counts reflect posts
- [ ] `/dashboard/users` change a role; cannot demote self from ADMIN
- [ ] `/dashboard/settings` shows account + site info
- [ ] Non-admin visiting admin routes is redirected to `/dashboard`

### 8. SEO & ops
- [ ] `/sitemap.xml` and `/robots.txt` use the production domain
- [ ] Article `<head>` has canonical, OG/Twitter tags, Article + Breadcrumb JSON-LD
- [ ] `/article/[slug]/opengraph-image` renders a branded card
- [ ] `GET /api/health` → `200 {"status":"ok"}`
- [ ] Response headers include `X-Content-Type-Options`, `X-Frame-Options`, HSTS

---

## Future automation

A Playwright suite covering flows 1–4 (anonymous, no auth/DB writes) is the natural
next step; flows 5–7 need a seeded test DB and mocked OAuth. Wire into CI after the
Vercel preview deploy.
