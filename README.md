# Window Tint Company® — windowtintcompany.co.uk

A complete marketing site + headless CMS for **Window Tint Company®**, Scotland's specialist
window-film studio (Dunfermline · Edinburgh · Glasgow · Fife · all of Scotland).

Built with **Next.js 16** (App Router, Turbopack), **Prisma + SQLite** (designed for an easy
move to **Neon Postgres**), and a custom WordPress-class admin CMS — plus an integrated
**DeepSeek AI** assistant ("Clara") and a one-tap **AI Quick Estimate** with live availability.

## What's in the box

### Public site (under `app/(site)`)
| Route | Description |
| --- | --- |
| `/` | Cinematic home — hero, spectrum strip, USP grid, services, showcase, process, testimonial, journal, CTA. |
| `/about` | Studio story, values, team, Dunfermline workshop. |
| `/services` | All six film families (Solar, Privacy, Decorative, Safety, Anti-glare, Manifestation). |
| `/services/[slug]` | Detail page with spec strip + feature bullets. |
| `/showcase` | Real installations filtered by category. |
| `/showcase/[slug]` | Project case study with gallery. |
| `/blog` | Journal index with category filter + featured post. |
| `/blog/[slug]` | Long-form article with author bio + related posts. |
| `/estimate` | One-tap **AI Quick Estimate** — film + size → AI ballpark + slot picker. |
| `/contact` | Three-step quote wizard mirroring the original brief. |

### Cross-site features
- **Header**: mobile-first prominent **Call** button (because customers call from mobile);
  desktop cluster of WhatsApp + email + phone icons + a **Get a quote** CTA.
- **Footer**: huge wordmark, sitemap, real Dunfermline address linked to Google Business.
- **WhatsApp floater** (bottom-right).
- **"Ask Clara" chat widget**: streaming responses from DeepSeek, trained on the studio's
  service catalogue and Scotland service area.
- **LocalBusiness JSON-LD** structured data for Scotland SEO (geo, postal code, opening hours, areaServed).
- **Scotland-tuned metadata**: titles, keywords and OG tags target Edinburgh, Glasgow, Fife, Dunfermline.

### Admin CMS (under `app/admin`)
| Route | Description |
| --- | --- |
| `/admin/login` | Email + password sign-in (JWT cookie, 7-day session). |
| `/admin` | Dashboard with KPIs, recent enquiries, recent edits. |
| `/admin/leads` | Lead inbox with status filter, detail view, notes, status change. |
| `/admin/availability` | Month calendar — block dates; see incoming slot requests. |
| `/admin/posts` | Blog post CRUD with Tiptap rich editor, featured/published flags, slug auto-gen. |
| `/admin/services` | Service CRUD with feature list editor, spec strip, lucide icon picker. |
| `/admin/showcase` | Showcase project CRUD with gallery + featured flag. |
| `/admin/media` | Media library — drag-drop upload (jpg/png/webp/avif/svg), copy URL, delete. |
| `/admin/settings` | Site-wide settings: phone, email, address, hero copy. |

### AI integration
- `POST /api/chat` — streams DeepSeek responses for the "Ask Clara" widget. The system
  prompt is rebuilt from the live DB on every call (services + showcase).
- `POST /api/estimate` — calculates total m² from window dimensions, applies
  Scotland-standard fully-installed £/m² rates, then asks DeepSeek to write the
  customer-facing estimate (with a deterministic fallback when no key is configured).

## Quick start

```bash
# Install deps
pnpm install

# Set up the database
pnpm run db:migrate
pnpm run db:seed

# Run dev
pnpm run dev
# → http://localhost:3000

# Sign into the studio
# → http://localhost:3000/admin/login
# email:    admin@windowtintcompany.co.uk
# password: changeme123    (configured in .env)
```

## Environment variables

See `.env.example`. The seed picks up `ADMIN_EMAIL` + `ADMIN_PASSWORD`. Change both before
the first deploy.

| Var | Purpose |
| --- | --- |
| `DATABASE_URL` | SQLite path for now; Neon Postgres URL later. |
| `AUTH_SECRET` | 32+ char random string for JWT signing. **Required**. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeded admin user — change immediately after first install. |
| `DEEPSEEK_API_KEY` | Your DeepSeek key — enables Ask Clara + AI Estimate. Without it both gracefully fall back. |
| `DEEPSEEK_MODEL` | Default `deepseek-chat`. |
| `NEXT_PUBLIC_PHONE` / `NEXT_PUBLIC_WHATSAPP` | Front-end fallbacks if DB is unreachable. |

## Migrating to Neon Postgres

This stack is designed for a one-line provider swap:

```diff
-  provider = "sqlite"
+  provider = "postgresql"
```

```diff
-  DATABASE_URL="file:./dev.db"
+  DATABASE_URL="postgres://…neon.tech/…?sslmode=require"
```

Then `pnpm prisma migrate dev --create-only`, edit the generated SQL if your schema needs any
Postgres-specific touches (the current schema is Postgres-clean — no SQLite-only types are
used). Then `pnpm prisma migrate deploy` + `pnpm run db:seed`.

If you also want JSON columns (`features`, `gallery`, `tags`) rather than strings, that's a
follow-up migration — the app already serialises/deserialises them client-side, so it'll
"just work" on either side until you decide to formalise the column types.

## Design system

- **Typography**: Fraunces (display, variable serif), Hanken Grotesk (body sans),
  JetBrains Mono (technical labels). All via `next/font/google`.
- **Palette**: Cinematic dark — near-black `#0a0e14` canvas, vibrant teal `#5eead4`
  surgical accent, soft amber `#e5c77b` reserved for one-off luxury moments.
- **Layouts**: Generous negative space, dramatic display type, hairline borders, grain
  overlays, gradient atmosphere via `radial-gradient` in inline styles.
- **CSS variables** live in `app/globals.css` and are exposed to Tailwind via `@theme inline`.

## What's intentionally NOT here yet

- Email delivery (form submissions are stored only — wire SendGrid/Resend in
  `app/(site)/contact/actions.ts` and `app/(site)/estimate/actions.ts`).
- Multi-image gallery upload via the showcase form (paste URLs from `/admin/media` for
  now — it works, just one URL at a time).
- Bank-holiday calendar after 2026 (extend `lib/availability.ts`).

## Project layout

```
app/
  (site)/               — public marketing routes
    layout.tsx          — header, footer, WhatsApp, chat
    page.tsx            — home
    about/, services/, showcase/, blog/, contact/, estimate/
  admin/
    layout.tsx          — minimal admin shell
    login/              — public auth page
    (authed)/           — route group; auth-gated
      layout.tsx        — sidebar shell
      page.tsx          — dashboard
      posts/, services/, showcase/, leads/, media/, availability/, settings/
  api/
    chat/route.ts       — DeepSeek SSE relay (Ask Clara)
    estimate/route.ts   — AI-written quote estimate
    admin/media/upload/ — image upload
components/
  site/                 — Header, Footer, WhatsAppFloater, ChatWidget, Logo, cards
  seo/local-business-jsonld.tsx
  ui/                   — Button, Container, Eyebrow
lib/
  db.ts, settings.ts, availability.ts, auth.ts, cn.ts
prisma/
  schema.prisma, seed.ts, migrations/
proxy.ts                — Next 16 renamed middleware; gates /admin/*
```

## Stack reference

| | |
| --- | --- |
| Framework | Next.js 16.2 (App Router, Turbopack) |
| Runtime | React 19.2 |
| ORM | Prisma 6 |
| DB | SQLite (dev) → Postgres (prod via Neon) |
| Auth | JWT via `jose` (HS256), bcrypt password hash |
| Editor | Tiptap 3 with link / image / underline / text-align |
| Forms | Server Actions + Zod validation |
| Styling | Tailwind CSS v4 + CSS variables |
| Icons | lucide-react |
| AI | DeepSeek (OpenAI-compatible API), streaming via Fetch + ReadableStream |
| Images | next/image + sharp |
| Toasts | sonner |

## Operational notes

- `next dev` runs on port 3000; if another dev server is already there it falls back to 3001.
- Admin proxy uses **Node.js runtime** (Next 16 requirement for `proxy.ts`). The auth cookie
  is HttpOnly + SameSite=lax.
- Production: the cookie's `secure` flag toggles on automatically when `NODE_ENV=production`.
- `/admin/availability` writes blocked dates to the `SiteSetting.blockedDates` key as a
  comma-separated ISO date list — keeps the schema lean.
