# PSG Gold · Ospyr Jewellery OS

The full working repository behind **PSG Gold** — a white-label operating system for jewellery
businesses, built by [Ospyr](https://www.ospyr.com). One Next.js app serves every tenant; the
workspace you log in with decides which OS, which navigation and which brand you get.

- **Vendor:** Ospyr · **Primary tenant:** PSG Gold
- **Also in this repo:** Diyam · House of Silver, Padmavathi Jewellery Mart, Vardhman, and a second
  sector (Founder OS) for Harshdeep Group
- **Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind v4 · Recharts · Framer Motion
- **Backend:** Supabase (Postgres + Auth + RLS) when configured, **local IndexedDB fallback** otherwise
  — so the app runs with zero setup
- **AI:** Groq (text + vision) and Pollinations / Cloudflare / Together / fal / Replicate / Gemini
  (image + video) behind server API routes — keys never reach the browser

---

## Quick start

```bash
cp .env.example .env.local   # add your GROQ_API_KEY (free at console.groq.com)
npm install
npm run dev                  # http://localhost:3000
```

Open `/` (Ospyr landing) → **Open the OS** → type your workspace name → you're in.
In **Settings**, click **Load demo data** to populate the dashboard and CRM instantly.

| Script | What it does |
|---|---|
| `npm run dev` | Next dev server on :3000 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | `next lint` |

---

## Two sectors, one app

Login routes by workspace name (`lib/sector.ts`):

| You type | Sector | Lands on |
|---|---|---|
| `PSG Gold`, `Diyam`, `Padmavathi`, `Vardhman`, anything gold/jewel/silver | **jewellery** | `/app/home` |
| `Harshdeep Group`, `Aurra`, `Designomics`, `Loop In`, `Arihant` | **founder** | `/app/founder/command` |
| anything else | — | the app asks you to pick |

The sector is stored in `localStorage` under `ospyr:sector`; the active workspace under
`ospyr:workspace` (defaults to `psg-gold`).

### Jewellery OS modules (`app/app/*`, nav in `lib/nav.ts`)

**Run the day** — Home · Growth Story (PSG) · Enquiry CRM · Dashboard
**Create** — Photo Studio · Product Cards · Catalog · Content Studio · Image & Video
**Sell** — Gold Estimator · Savings Scheme · Bridal Pipeline · Loyalty
**Grow** — Festive Calendar · Email Concierge · Reviews & QR · Automations
**System** — Settings

Workspace-scoped pages appear only for their tenant: `/app/story` (PSG Gold),
`/app/padmavathi`, `/app/vardhman`, and the **Diyam Playbook** group
(`/app/diyam` blueprint, content library, content calendar, reports & decks, The Circle admin).

### Founder OS modules (`app/app/founder/*`)

Command Center · AI Chief of Staff · Approvals · Brands · Leads & CRM · Money & Runway ·
Weekly Scorecard · Content Studio · Image & Video · Arihant Services · Automations · Settings.

Covers the four Harshdeep Group brands defined in `lib/brands.ts` — Aurra Hype, Designomics India,
Loop In Events, Arihant Digital — with blended ROAS/CAC, contribution margin, cash & runway.

---

## Repository map

```
app/
  page.tsx                 Ospyr landing
  login/                   workspace gate → sector routing
  app/                     the OS itself — jewellery modules + founder/* + diyam/*
  api/
    ai/{text,vision,image,video}   server-only AI routes
    email/send                     Brevo / Resend / n8n
    ingest/[workspace]             n8n → app webhook (x-ingest-secret)
components/                Shell (sidebar), ui.tsx design kit, AuthGate, PasscodeLock,
                           StudioReferences, ReferenceGallery, diyam/*
lib/
  data/                    store.ts (local-first adapter) · supabase.ts · types.ts · useStore.ts
  ai/                      groq.ts, image.ts, video.ts, email.ts (server) · client.ts, prompts.ts
  jewellery/               calc.ts (GST/making-charge estimate) · festivals.ts · compliance.ts
  diyam/                   content.generated.ts, reports.generated.ts (built by scripts/diyam/*)
  brand.ts brands.ts founder.ts nav.ts sector.ts settings.ts telegram.ts references.ts
scripts/diyam/             gen_content.py, gen_reports.py — regenerate the Diyam library
supabase/schema.sql        os_workspaces, os_members, os_collections, os_ingest (+ RLS)
tools/                     the original standalone HTML tools + the n8n workflow pack
docs/                      research write-ups (see below)
research/                  PSG Gold pitch + Padmavathi competitive scrape/decks
harshdeep/                 Founder OS source material — strategy docs, stack sheets, automations
public/                    brand assets and reference imagery
Diyam/                     Diyam · House of Silver brand kit and campaign specs
```

### Data layer

Every module reads and writes the **same** `DataStore`, so a CRM enquiry appears instantly on Home
and the Dashboard. Keys are `ospyr:{workspace}:{collection}` — persistence is workspace-scoped, and
`lib/data/store.ts` is the only place that touches it. Without Supabase env vars it uses IndexedDB
(`idb-keyval`); with them it syncs to Postgres and surfaces failures via an `ospyr:sync-error` event.

---

## Enable the Supabase backend (real multi-user cloud)

1. Create a free project at [supabase.com](https://supabase.com).
2. Run `supabase/schema.sql` in the SQL editor — tables, row-level security and the ingest log.
3. Add to `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server only)
   - `INGEST_SECRET`

The app switches from local to cloud automatically. The n8n engines can then POST live
metrics and leads to `/api/ingest/{workspace}` with the `x-ingest-secret` header.

---

## What's wired

| Area | Provider | Key needed? |
|---|---|---|
| Captions, sales brain, content, email drafting, lead scoring, vision | **Groq** | `GROQ_API_KEY` (free) |
| Image generation | **Pollinations** (default) → Cloudflare / Together / HF / fal / Replicate / Gemini | none for Pollinations |
| Video generation (beta) | **fal.ai** / Replicate | free key |
| Email sending | **Brevo** / Resend / n8n | free key |
| Owner alerts | **Telegram Bot API** (in-browser) | bot token in Settings |
| WhatsApp | `wa.me` deep links + template library | none |
| Background removal | `@imgly/background-removal` (in-browser) | none |

Provider selection is driven by `IMAGE_PROVIDER` / `VIDEO_PROVIDER` in `.env.local`.
See [`docs/RESEARCH-image-video-models.md`](docs/RESEARCH-image-video-models.md) for the full
free-model research and how to add each key, and
[`docs/RESEARCH-founder-os-competitors.md`](docs/RESEARCH-founder-os-competitors.md) for the
Founder OS competitive analysis.

---

## The automation layer

`tools/n8n-workflows/` (import-ready workflows) and `harshdeep/automations/` are the **server-side**
engine — WhatsApp Cloud API, schedules, webhooks, e-invoicing. The app pairs with them via the
**Automations** page and the `/api/ingest` webhook; it does not modify them.

`tools/*.html` are the original standalone browser tools (gold calculator, enquiry CRM, savings
scheme, festive calendar, product card, review QR, studio photo, owner dashboard). They run entirely
client-side with no data leaving the device, and are kept as a zero-dependency fallback.

---

## Security

- All AI, email and Supabase service keys live in `.env.local` (gitignored) and are used **only**
  inside `app/api/**` server routes.
- No secret is shipped to the browser or committed. `.env.example` is the template — placeholders only.
- Supabase access is governed by row-level security defined in `supabase/schema.sql`.

## Not in this repo

Diyam reel builds, render outputs and campaign media (~2.3 GB of mp4/png/zip) stay on the
workstation and are excluded via `.gitignore`. Only brand specs, prompts and source assets are
versioned here.

## Deploy

```bash
vercel        # or use the Vercel dashboard — add every var from .env.example
```
