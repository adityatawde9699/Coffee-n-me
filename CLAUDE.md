# CLAUDE.md — Coffee'n me

> **One-line pitch:** Coffee'n me is a warm, editorial-style blogging platform where writers craft long-form stories and readers savor them like a good cup of coffee.

---

## 1. Project Overview

**Coffee'n me** is a minimalist, coffee-themed literary blog / publishing platform built with Next.js 15 App Router. It blends the calm aesthetic of a coffee shop with the depth of a serious publishing tool.

### Core Theme & Aesthetic
- **Vibe:** cozy, warm, slow-paced — the antithesis of social-media noise
- **Tagline:** *"Stories brewed with care"*, *"Where words brew slowly and ideas are served warm"*
- **Color palette:** warm off-whites, espresso browns, cream tones (HSL-based CSS vars)
- **Typography:** dual-font system — geometric sans for UI (headings), serif for body reading
- **Animations:** subtle pulse, fade-in, float keyframes — never jarring

### Feature Surface
| Area | Description |
|------|-------------|
| Public reader | Landing page, article archive, author profiles, category pages |
| Auth | GitHub + Google OAuth via Auth.js v5 (beta) |
| Dashboard | Protected `/dashboard` for managing posts |
| Editor | Rich TipTap editor with image upload (Cloudinary) |
| Database | PostgreSQL (Neon) via Prisma ORM v7 |
| Analytics | PostHog |

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js App Router | ^15.3.6 |
| Auth | Auth.js (next-auth) | ^5.0.0-beta.31 |
| Database | PostgreSQL (Neon serverless) | — |
| ORM | Prisma | ^7.8.0 |
| Styling | Tailwind CSS + shadcn/ui primitives | v3 |
| Editor | TipTap v3 | — |
| Image CDN | Cloudinary | — |
| Analytics | PostHog | — |
| Deployment | Vercel | — |

---

## 3. Directory Structure

```
Coffe_n_me/
├── app/
│   ├── (public)/          # Unauthenticated routes (homepage, articles, auth)
│   │   ├── page.tsx       # Landing page
│   │   ├── auth/signin/   # Sign-in page
│   │   ├── article/       # Individual article view
│   │   ├── archive/       # Full article archive
│   │   ├── author/        # Author profile pages
│   │   └── category/      # Category pages
│   ├── (dashboard)/       # Protected routes — require session
│   │   ├── dashboard/     # User dashboard
│   │   ├── editor/        # TipTap post editor
│   │   └── posts/         # Post management
│   └── api/
│       ├── auth/          # Auth.js route handlers
│       └── upload/        # Cloudinary upload endpoint
├── components/
│   ├── layout/            # Header, Footer, Nav
│   ├── article/           # ArticleCard, ArticleBody
│   ├── editor/            # TipTap toolbar, extensions
│   ├── dashboard/         # Dashboard-specific UI
│   └── ui/                # Shared primitives (shadcn-style)
├── lib/
│   ├── auth/auth.ts       # Auth.js config (GitHub + Google providers)
│   └── db/
│       ├── prisma.ts      # Prisma client singleton
│       └── queries/       # Typed DB query helpers
├── prisma/
│   ├── schema.prisma      # DB schema (User, Post, Category, Tag, Session)
│   └── seed.ts            # Dev seed data
└── styles/                # Additional CSS (animations, utilities)
```

---

## 4. Database Schema (Prisma)

Key models:
- **User** — id, name, email, role (READER | WRITER | ADMIN), linked accounts/sessions
- **Post** — id, title, slug, content (Text), published, featured, authorId, categoryId, tags, mainImage, readingTime
- **Category / Tag** — slug-indexed lookup tables
- **Subscriber** — newsletter emails (unique, lowercase-normalized)
- **Account / Session / VerificationToken** — Auth.js adapter tables

---

## 5. Authentication Setup (Auth.js v5 Beta)

Auth is configured in `lib/auth/auth.ts` using:
- `GitHub` provider
- `Google` provider
- `PrismaAdapter` for session persistence

### ⚠️ Critical: Environment Variables for Auth

Auth.js v5 requires the `AUTH_` prefix (not `NEXTAUTH_`). All of the following **must** be set in Vercel environment variables:

```env
# Required
AUTH_SECRET=<random 32-byte base64 string>
AUTH_URL=https://coffee-n-me.vercel.app   # ← Production URL, NOT localhost

# GitHub OAuth App (github.com/settings/developers → OAuth Apps)
AUTH_GITHUB_ID=<your-github-client-id>
AUTH_GITHUB_SECRET=<your-github-client-secret>

# Google OAuth (console.cloud.google.com → APIs & Services → Credentials)
AUTH_GOOGLE_ID=<your-google-client-id>      # Full format: xxxxx.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=<your-google-client-secret>

# Database
DATABASE_URL=<neon-postgres-connection-string>
```

### Common Auth Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `client_id=undefined` in GitHub OAuth URL | `AUTH_GITHUB_ID` not set in Vercel | Add env var in Vercel project settings |
| Google 401 `invalid_client` | `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` are placeholders | Set real Google Cloud credentials |
| Redirect mismatch | Callback URL not registered | Add `https://coffee-n-me.vercel.app/api/auth/callback/github` and `.../callback/google` to OAuth app settings |

### GitHub OAuth App Setup
1. Go to https://github.com/settings/developers → OAuth Apps
2. Homepage URL: `https://coffee-n-me.vercel.app`
3. Authorization callback URL: `https://coffee-n-me.vercel.app/api/auth/callback/github`
4. Copy Client ID → `AUTH_GITHUB_ID`, generate secret → `AUTH_GITHUB_SECRET`

### Google OAuth Setup
1. Go to https://console.cloud.google.com → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID (Web application type)
3. Authorized redirect URIs: `https://coffee-n-me.vercel.app/api/auth/callback/google`
4. Copy Client ID → `AUTH_GOOGLE_ID`, Client Secret → `AUTH_GOOGLE_SECRET`

---

## 6. Development Commands

```bash
npm run dev          # Start dev server on :3000
npm run build        # Production build
npm run lint         # ESLint check

# Prisma
npx prisma studio    # Database GUI
npx prisma migrate dev --name <name>  # Create + run migration
npx prisma generate  # Regenerate client (runs automatically via postinstall)
npx prisma db seed   # Seed development data (tsx prisma/seed.ts)
```

---

## 7. Deployment (Vercel)

1. **Environment Variables** — Set all vars from Section 5 in Vercel → Project Settings → Environment Variables
2. **Database** — Neon connection string must use `?sslmode=require&channel_binding=require`
3. **Prisma** — `postinstall` script runs `prisma generate` automatically on Vercel build
4. **Auth URL** — `AUTH_URL` must be the exact production URL (no trailing slash)

### Vercel Env Checklist
- [ ] `AUTH_SECRET` — generated, not a placeholder
- [ ] `AUTH_URL` — `https://coffee-n-me.vercel.app`
- [ ] `AUTH_GITHUB_ID` — real GitHub Client ID (not `undefined`)
- [ ] `AUTH_GITHUB_SECRET` — real GitHub Client Secret
- [ ] `AUTH_GOOGLE_ID` — real Google Client ID (ends in `.apps.googleusercontent.com`)
- [ ] `AUTH_GOOGLE_SECRET` — real Google Client Secret
- [ ] `DATABASE_URL` — Neon connection string with `?sslmode=require`
- [ ] `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

---

## 8. Design System

### CSS Custom Properties (globals.css)
The app uses shadcn-style HSL CSS variables. Light/dark mode is toggled via the `.dark` class.

Key utility classes defined in `styles/`:
- `.glass-card` — frosted-glass card effect
- `.gradient-text` — animated warm gradient text
- `.warm-divider` — gradient top border
- `.animate-pulse-soft`, `.animate-float`, `.animate-fade-in`, `.animate-fade-in-up`

### Font System
- `var(--font-heading)` — Geist Sans (geometric, UI)
- `var(--font-body)` — Geist Serif or system serif (reading content)

---

## 9. Code Conventions

- **Server Components by default** — add `"use client"` only when needed (event handlers, hooks)
- **`export const dynamic = "force-dynamic"`** on pages that query the DB directly
- **Slug-based routing** for articles, categories, authors
- **Role guard** — check `session.user.role` for WRITER/ADMIN access to dashboard
- **CallbackUrl sanitization** — `signin/page.tsx` strips external origins from `callbackUrl`
- **No `NEXTAUTH_` prefix** — Auth.js v5 uses `AUTH_` prefix exclusively

---

## 10. Known Issues & Todos

- [ ] **Google OAuth** — credentials are placeholders, need real Google Cloud project
- [ ] **GitHub OAuth** — verify `AUTH_GITHUB_ID` is set correctly in Vercel (was `undefined` in production)
- [x] **Newsletter** — wired to `Subscriber` model via `lib/actions/newsletter.ts` server action (form: `components/home/NewsletterForm.tsx`)
- [x] **Social links** — footer links to GitHub profile + mailto
- [x] **Terms / Privacy / Contact pages** — created under `app/(public)/`
- [x] **Design system** — warm coffee palette + `glass-card` / `gradient-text` / `warm-divider` / animation utilities now defined in `app/globals.css` (were previously referenced but undefined)
- [x] **Theme toggle** — `components/layout/ThemeToggle.tsx`, persists to localStorage, dark by default
- [x] **Brew Guide** — `/brews` editorial page (brewing methods + coffee shop vision), linked in nav + footer
- [ ] `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` — currently set to wrong value (should be `dsxwngzq3`, not the API key)
