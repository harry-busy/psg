# Ospyr — 5 Mega n8n Workflows (setup guide)

Five massive workflows, each bundling ~16–20 related sub-workflows, mapped to Harshdeep's businesses.

| File | Engine | For | Sub-flows |
|---|---|---|---|
| `MEGA_1_Content_Creative_Engine.json` | Content & creative | Aurra Hype / all | 18 |
| `MEGA_2_Sales_Leads_CRM_Engine.json` | Sales, leads & CRM | Loop In / Designomics corporate | 18 |
| `MEGA_3_Ecommerce_Order_Ops_Engine.json` | E-commerce & order ops | Aurra Hype / Designomics | 18 |
| `MEGA_4_Marketing_Social_Engine.json` | Marketing & social | All | 18 |
| `MEGA_5_Founder_OS_Business_Ops_Engine.json` | Founder OS & ops | Harshdeep | 18 |

## How to import
1. Open n8n → Workflows → **Import from File** → pick a `MEGA_*.json`.
2. Each node with a `notes` field needs a **credential**. In n8n: Credentials → New → the matching type → paste the key.
3. Flip the workflow **Active** once creds are in. Triggers are webhooks + schedules (already set, e.g. 8am, Monday, 9pm).
4. Test each branch with n8n's **Execute Node** before going live.

## Paid API keys you'll need (and where)
- **OpenAI** (copy, scoring, summaries) — https://platform.openai.com
- **ElevenLabs** (voiceover / audio briefings) — https://elevenlabs.io  (header `xi-api-key`)
- **Higgsfield** (image→video, UGC ads) — https://higgsfield.ai
- **Kling / Runway** (cinematic video) — https://klingai.com · https://runwayml.com
- **HeyGen** (avatar presenter) — https://heygen.com
- **Photoroom** (product images) — https://photoroom.com/api
- **Ideogram** (posters/text-in-image) — https://ideogram.ai
- **Opus Clip** (repurpose to clips) — https://opus.pro
- **WhatsApp Business API** (AiSensy / WATI / Interakt) — https://aisensy.com
- **Meta Graph** (Instagram + Facebook) — https://developers.facebook.com
- **Telegram Bot** — https://core.telegram.org/bots
- **HubSpot** (CRM) — https://developers.hubspot.com  (or Zoho CRM)
- **Cal.com** (booking) — https://cal.com
- **Razorpay** (invoices/payments) — https://razorpay.com  ·  **Zoho Books/Inventory** — https://www.zoho.com/in
- **Shiprocket** (shipping) — https://www.shiprocket.in  ·  **GoKwik** (RTO) — https://gokwik.co
- **Amazon SP-API / Flipkart Seller / Meesho** — respective seller portals
- **Google** (Ads, Sheets, Drive, Gmail) — https://console.cloud.google.com
- **Ahrefs / SEMrush** (SEO) — https://ahrefs.com  ·  **Brand24** (mentions) — https://brand24.com
- **Fireflies** (meeting notes) — https://fireflies.ai  ·  **Notion** — https://developers.notion.com
- **RazorpayX Payroll** (HR) — https://razorpay.com/x/payroll

## Notes
- URLs/endpoints in the nodes are the real API bases; confirm the exact path/version per provider at setup (they change).
- Where a node says "merge n1–n4 first", add an n8n **Merge** node before the AI summary so it sees all sources.
- These are production-ready *structures*. Nothing sends until you add credentials and activate — so they're safe to import and explore.
- The self-contained sales demo (`Ospyr_Live_Demo.html`) is what you show clients before any of this is connected.
