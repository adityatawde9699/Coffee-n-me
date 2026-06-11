# ☕ Coffee'n me

> _Stories brewed with care._ A warm, editorial blogging platform where writers craft long-form stories and readers savor them like a good cup of coffee.

Built with **Next.js 15 (App Router)**, **Auth.js v5**, **Prisma 7 + Neon Postgres**, **TipTap**, **Cloudinary**, and **Tailwind CSS**.

---

## Features

- **Public reader** — landing page, paginated archive, article view, category/tag/author pages, full-text search
- **Auth** — GitHub + Google OAuth (Auth.js v5, database sessions)
- **Writer dashboard** — draft management, rich TipTap editor with Cloudinary image upload, reading-time estimation
- **Admin** — category management, user role management, settings
- **SEO** — per-article dynamic OG images, canonical URLs, Article/Breadcrumb/Person JSON-LD, sitemap + robots
- **Performance** — static/SSG/ISR public pages, tag-based data cache, lazy-loaded editor
- **Security** — server-side HTML sanitization, security headers, validated inputs

---

## Architecture

```
Browser ──▶ Next.js App Router (Vercel)
              │
              ├─ Public pages ── Static / SSG / ISR (revalidate 300s, tag: "posts")
              │     └─ data cache (unstable_cache) ─▶ Prisma ─▶ Neon Postgres
              │
              ├─ Dashboard ───── Dynamic (per-user, auth() gated)
              │     └─ Server Actions (lib/actions) ─▶ Prisma ─▶ Neon
              │
              ├─ Auth.js v5 ──── /api/auth/* + PrismaAdapter (DB sessions)
              ├─ Upload ──────── /api/upload (signed Cloudinary)
              └─ Health ──────── /api/health (DB ping)
```

**Rendering model:** the public layout is fully static — the auth-dependent nav button resolves client-side (`SessionProvider`) so content pages stay cacheable. Mutations call `revalidateTag()` to refresh caches immediately.

### Directory structure

```
app/
  (public)/        # Static/ISR reader routes + error/loading/not-found
  (dashboard)/     # Auth-gated dashboard, editor, admin (dynamic)
  api/             # auth, upload, health
  opengraph-image  # default OG; per-article OG under article/[slug]/
components/         # layout, article, editor, dashboard, seo, ui
lib/
  actions/         # server actions (post, newsletter, admin)
  db/queries/      # cached read queries (tag-invalidated)
  auth/ media/ utils/ validation/ + site.ts, env.ts, sanitize.ts, monitoring.ts
prisma/            # schema + seed
```

---

## Local development

```bash
cp .env.example .env        # fill in DATABASE_URL, AUTH_SECRET, NEXT_PUBLIC_APP_URL at minimum
npm install                 # runs `prisma generate` via postinstall
npx prisma migrate dev      # apply schema to your DB
npx prisma db seed          # optional dev data
npm run dev                 # http://localhost:3000
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server on :3000 |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npx prisma studio` | DB GUI |
| `npx prisma migrate dev --name <n>` | Create + apply a migration |

---

## Deployment (Vercel)

1. **Import the repo** into Vercel (framework auto-detected as Next.js).
2. **Set environment variables** (Project Settings → Environment Variables) — see `.env.example`. At minimum: `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_APP_URL`, `AUTH_URL`.
3. **Register OAuth callback URLs** with GitHub/Google:
   - `https://<your-domain>/api/auth/callback/github`
   - `https://<your-domain>/api/auth/callback/google`
4. **Deploy.** `postinstall` runs `prisma generate`; run `prisma migrate deploy` against the production DB (CI step or one-off).

### Production checklist

- [ ] `DATABASE_URL` — Neon pooled string with `?sslmode=require&channel_binding=require`
- [ ] `AUTH_SECRET` — real 32-byte base64 (not a placeholder)
- [ ] `AUTH_URL` — exact production URL, **no trailing slash**
- [ ] `NEXT_PUBLIC_APP_URL` — production URL (drives canonical/sitemap/OG)
- [ ] `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` — real values, callback registered
- [ ] `AUTH_GOOGLE_ID` (`.apps.googleusercontent.com`) / `AUTH_GOOGLE_SECRET` — real, callback registered
- [ ] `CLOUDINARY_*` + `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` set and matching
- [ ] `prisma migrate deploy` run against production DB
- [ ] First admin promoted: set a user's `role` to `ADMIN` (`npx prisma studio`)
- [ ] `GET /api/health` returns `200 {"status":"ok"}`
- [ ] `/sitemap.xml` and `/robots.txt` resolve with the production domain

---

## Security & monitoring

- Rich-text HTML is sanitized server-side (`lib/sanitize.ts`) on write and render.
- Security headers are set in `next.config.ts`. A nonce-based CSP is a recommended follow-up.
- Errors funnel through `lib/monitoring.ts` (console + PostHog) — swap in Sentry there.
- Env config is validated at startup via `instrumentation.ts` → `lib/env.ts`.

---

## License

Private project. © Coffee'n me.
