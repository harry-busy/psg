# Ospyr OS

Two operating systems in one white-label app, built by [Ospyr](https://www.ospyr.com). **Your login decides
where you land:**

- **Jewellery OS** (e.g. `PSG Gold`) — studio photos, catalog, gold estimator, enquiry CRM, savings schemes,
  bridal pipeline, loyalty, festive campaigns, AI content studio, AI email concierge, reviews, image/video gen.
- **Founder OS** (e.g. `Harshdeep Group`) — a group command center for a founder running four brands
  (Aurra Hype, Designomics, Loop In Events, Arihant Digital): blended ROAS/CAC, contribution margin, cash &
  runway, an **AI Chief of Staff** that answers from live data, one-tap approvals, per-brand deep dives,
  weekly scorecard, and the Arihant services catalog.

Type the workspace name at `/login` (or pick the sector) — `PSG Gold` → jewellery, `Harshdeep Group` → founder.

- **Vendor:** Ospyr. **Tenants:** PSG Gold (jewellery) + Harshdeep Group (founder). Fully white-label, multi-sector.
- **Stack:** Next.js 15 (App Router) · TypeScript · Tailwind v4 · Recharts.
- **Backend:** Supabase (Postgres + Auth + RLS) when configured; **local IndexedDB fallback** so it runs with zero setup. One `DataStore` interface, both sectors.
- **AI:** Groq (text/vision) + Pollinations/Cloudflare/Together/fal (free image/video) behind server API routes — keys never reach the browser.

## Enable the Supabase backend (real multi-user cloud)
1. Create a free project at supabase.com.
2. Run `supabase/schema.sql` in the SQL editor (tables + row-level security + ingest log).
3. Put `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` and an
   `INGEST_SECRET` in `.env.local`. The app switches from local to cloud automatically; the n8n MEGA engines
   can then POST live metrics/leads to `/api/ingest/{workspace}` with the `x-ingest-secret` header.

Competitive analysis for the Founder OS: [`docs/RESEARCH-founder-os-competitors.md`](docs/RESEARCH-founder-os-competitors.md).
The `harshdeep/automations/**` and `tools/n8n-workflows/**` packs are the untouched server-side automation layer.

## Quick start

```bash
cp .env.example .env.local   # add your GROQ_API_KEY (free at console.groq.com)
npm install
npm run dev                  # http://localhost:3000
```

Open `/` (Ospyr landing) → **Open the OS** → name your workspace → you're in.
In **Settings**, click **Load demo data** to see the dashboard and CRM come alive instantly.

## What's wired

| Area | Provider | Key needed? |
|---|---|---|
| Captions, sales brain, content, email drafting, lead scoring, vision | **Groq** | `GROQ_API_KEY` (free) |
| Image generation | **Pollinations** (default) → Cloudflare / Together / HF / fal / Gemini | none for Pollinations |
| Video generation (beta) | **fal.ai** / Replicate | free key |
| Email sending | **Brevo** / Resend / n8n | free key |
| Owner alerts | **Telegram Bot API** (in-browser) | bot token in Settings |
| WhatsApp | `wa.me` deep links + template library | none |

See [`docs/RESEARCH-image-video-models.md`](docs/RESEARCH-image-video-models.md) for the full free-model research
and how to add each free key.

## Architecture

```
app/                    landing, /login (workspace gate), /app/* modules, /api/* AI+email routes
components/              Shell (sidebar), ui.tsx (design kit)
lib/
  data/                 store.ts (local-first adapter), types.ts, useStore.ts (reactive hook)
  ai/                   groq.ts, image.ts, video.ts, email.ts (server) · client.ts, prompts.ts
  jewellery/            calc.ts (GST/estimate), festivals.ts, compliance.ts
  settings.ts, brand.ts, telegram.ts, nav.ts
tools/                  original HTML tools + n8n workflow pack (the always-on automation layer — untouched)
```

Every module reads/writes the **same** `DataStore`, so a CRM enquiry instantly appears on Home and the
Dashboard. Swap `lib/data/store.ts`'s two persistence helpers for Supabase to go multi-device.

## The automation layer

The `tools/n8n-workflows/` pack (52 import-ready workflows) is the **server-side** engine — WhatsApp Cloud
API, schedules, webhooks, e-invoicing. The app pairs with it (see the **Automations** page) and does not modify it.

## Security

- All AI keys live in `.env.local` (gitignored) and are used **only** in `app/api/**` server routes.
- No secret is ever shipped to the browser or committed.

## Deploy

```bash
vercel        # or: use the Vercel dashboard; add env vars from .env.example
```
