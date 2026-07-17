# Founder OS — Competitive Analysis & What We Copied (2026)

Research for the **Harshdeep Founder sector**. Question: is anyone building a single command center for a
founder running *several* brands at once, and what should we copy?

## The landscape
The ecommerce "operating system" category is real and maturing, but it is almost entirely **single-brand**:

| Tool | What it is | Strength | Gap for us |
|---|---|---|---|
| **Triple Whale** | "AI operating system for ecommerce"; **Moby 2** is an AI *operator* that acts, not just reports | Blended ROAS/CAC, creative analytics, fast operator UX; 60k+ brands | Built per store — a 4-brand + agency group view isn't its model |
| **Polar Analytics** | All-in-one no-code data stack for omnichannel DTC | Multi-store, dedicated warehouse on higher tiers, pre-built CAC/ROAS/LTV dashboards | BI layer, not an operating cockpit; pricey; no agency/pipeline layer |
| **Northbeam / Rockerbox** | Attribution | Deep MTA | Narrow (attribution only) |
| **Glew / Daasity / Fairview** | Profit/contribution-margin analytics | True margin after COGS/ads/RTO | Reporting, not workflow |
| **Fathom / Float / Mosaic** | Cash-flow & runway forecasting | Scenario planning | Finance silo |
| **Motion / Reclaim, Fathom/Fireflies, Notion** | Time, meetings, work | Founder productivity | Not connected to the numbers |

**The gap we own:** a founder with **four assets** (Aurra Hype D2C, Designomics gifting, Loop In events,
Arihant agency) has to stitch a per-brand analytics tool + a spreadsheet + a CRM + a finance app + a
task app. Nobody packages a **holding-group command center** where all brands, the B2B pipelines, cash,
approvals and an AI chief-of-staff live on one screen.

## What we copied (and where it lives)
- **Blended ROAS / CAC / AOV** across brands → `lib/brands.ts` `kpis()`, Command Center + Brands + Money.
- **Contribution margin** (revenue − COGS − ad spend − RTO loss) — the number that says if a brand *actually*
  makes money (Fairview/Glew's core) → `kpis().contribution`, shown per brand in Money & Command Center.
- **Cash & runway** (Fathom/Float) → Founder settings (cash, burn) → runway on every screen.
- **AI operator over live data** (Triple Whale Moby) → **AI Chief of Staff** (`/app/founder/chief`): sends a
  live JSON snapshot of the group to Groq and answers in plain language with a recommended action.
- **One-tap operator workflows** (approve spend/creative/hires) → `/app/founder/approvals`.
- **Anomaly-first attention** (signal not noise) → Command Center "What needs you" alerts (ROAS < 1.5,
  RTO > 25%, target < 50%, runway < 6mo).
- **RTO control emphasis** (India apparel margin killer, GoKwik's pitch) → RTO rate is a first-class metric.

## What we do that they don't
- **Four brands + an agency** in one view, with each brand's own pipeline type (product / corporate / events / agency).
- **The Arihant flywheel** made explicit: a Services catalog the founder pitches, fed by the group's own results.
- **Free/low-cost stack**: Groq (free) for the AI operator, Pollinations (free) for creative, Supabase (free
  tier) for the backend — versus Triple Whale/Polar at $129–$21k/mo.

## Sources
- https://www.triplewhale.com/blog/triple-whale-vs-polar-analytics
- https://www.prnewswire.com/news-releases/triple-whale-unveils-the-ai-operating-system-for-ecommerce-with-the-launch-of-moby-2-302776288.html
- https://ask-luca.com/blogs/ecommerce-analytics-dashboard
- https://getfairview.com/d2c-metrics
- https://www.polaranalytics.com/alternatives/triple-whale
