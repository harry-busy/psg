# n8n Workflow Pack — Jewellery Automation (Ospyr)

Six import-ready workflows. Import each JSON in n8n → **Workflows → Import from file**, attach your credentials, set the environment variables, activate.

## The six workflows

| # | Workflow | What it does | Trigger |
|---|---|---|---|
| 1 | photo-to-studio-post | Owner sends any photo to the Telegram bot → Gemini re-shoots it as a pro studio image → sent back instantly (+ optional Instagram post) | Telegram photo |
| 2 | whatsapp-autoreply | WhatsApp enquiries auto-answered: PRICE / CATALOG / VISIT menu, gold rate, booking; owner alerted on Telegram | WhatsApp webhook |
| 3 | daily-owner-digest | 8am summary — yesterday's enquiries by source, sales, revenue, follow-ups due — to Telegram (+ optional WhatsApp) | Cron 8:00 |
| 4 | review-request | 3 days after each sale, an approved WhatsApp template asks for a Google review; row marked so nobody is asked twice | Cron 11:00 |
| 5 | occasion-reminders | 7 days before a customer's birthday/anniversary → gift-nudge WhatsApp template + owner alert | Cron 10:00 |
| 6 | new-design-broadcast | Owner sends a photo captioned `#new` to the bot → auto-posted to the Telegram channel + templated WhatsApp alert to the opted-in VIP list (batched) | Telegram photo |

## One-time setup

**Free (10 minutes):**
- **n8n** — self-host free (Docker: `docker run -p 5678:5678 n8nio/n8n`) or n8n Cloud trial.
- **Telegram bot** — @BotFather → `/newbot` → token. Add as admin to your channel for #6.
- **Gemini API key** — aistudio.google.com → Get API key (free tier). Set env `GEMINI_API_KEY`.
- **Google Sheets** — one spreadsheet, tabs: `Enquiries` (Date, Type, Source, Item, Amount, Customer, Phone, FollowUp, Status, ReviewAsked), `Customers` (Name, Phone, Occasion, OccasionDate), `VIPList` (Name, Phone). The Ospyr Suite CRM exports a matching CSV.

**WhatsApp (needs Meta setup — the only non-instant part):**
- Meta developer app → WhatsApp → get **Phone Number ID** + **permanent access token** (env: `WA_PHONE_NUMBER_ID`, header credential `Bearer <token>`).
- Point the webhook (workflow 2) URL in Meta → WhatsApp → Configuration; handle the GET verify.
- Create the three message **templates** (texts are in the node notes): `review_request`, `occasion_nudge`, `new_design_alert`. Marketing messages to customers **require approved templates + opt-in** — that's Meta policy, keep the VIP list clean.

**Environment variables used:** `GEMINI_API_KEY, BRAND_NAME, RATE_22K, RATE_24K, CATALOG_LINK, WA_PHONE_NUMBER_ID, OWNER_WA_NUMBER, TG_OWNER_CHAT_ID, TG_CHANNEL_ID, REVIEW_LINK, IG_USER_ID, META_ACCESS_TOKEN` (set in n8n → Settings → Variables, or the host env).

**Replace placeholders:** every `REPLACE` credential id and `REPLACE_SHEET_ID`.

## Notes
- Workflow 1's Instagram node is optional and needs a public image URL step (S3/Cloudinary) + `/media_publish` second call — see node note.
- Test each workflow with **Execute workflow** before activating.
- All of this pairs with `ospyr-suite.html`: the Suite handles in-browser work (studio images, cards, calculator, CRM, Telegram sends, Gemini captions); n8n handles the always-on server-side automation (WhatsApp, schedules, webhooks).
