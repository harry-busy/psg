# n8n Automation Library — Master Index (30 automations, 3 batches of 10)

Every workflow has its **step-by-step SETUP + FIX instructions embedded as a sticky note on the n8n canvas** — import it and the instructions are right there next to the nodes.

**Import:** n8n → Workflows → ⋯ → Import from File → pick a JSON → follow the sticky note → attach credentials → replace `REPLACE_*` → Activate.

**Shared variables** (n8n → Settings → Variables): `TG_OWNER_CHAT_ID, TG_CHANNEL_ID, BRAND_NAME, GEMINI_API_KEY, OWNER_WA_NUMBER, N8N_BASE_URL, WA_PHONE_NUMBER_ID, META_ACCESS_TOKEN, IG_USER_ID, FB_PAGE_ID, PLACE_ID, MAPS_API_KEY, CLOUDINARY_CLOUD, CLOUDINARY_PRESET, PIN_TOKEN, PIN_BOARD_ID, RATE_ALERT_ABOVE, RATE_ALERT_BELOW`.

**One master Google Sheet**, tabs: `Enquiries, Rates, Stock, Dues, SchemeMembers, Customers, VIPList, Festivals, Products, ContentBank, BestPosts, Reviews`.

---

## BATCH 1 — Leads, Follow-ups & Reputation (basics) — `batch-1-leads/`
| File | Automations inside |
|---|---|
| B1-lead-capture-hub | ① website-form → CRM ② missed-call → CRM ③ WhatsApp-button click logger+redirect ④ Justdial email → parsed lead — all → one sheet + Telegram alert |
| B1-followup-appointment-engine | ⑤ daily follow-up list ⑥ booking webhook → Google Calendar + confirm ⑦ 3-day escalation + tomorrow's-visit WhatsApp reminders |
| B1-reputation-engine | ⑧ new Google-review detector ⑨ Gemini reply-drafts to Telegram ⑩ weekly reputation report |

## BATCH 2 — Content & Marketing (intermediate) — `batch-2-content/`
| File | Automations inside |
|---|---|
| B2-daily-ratecard | ⑪ auto gold-rate poster (free quickchart) → Telegram channel ⑫ → Facebook page |
| B2-omni-publisher | ⑬ Telegram photo `#post` → Cloudinary → Instagram (2-step publish) ⑭ → Facebook ⑮ → Pinterest, with confirmation |
| B2-ai-content-factory | ⑯ Monday: Gemini writes the week's captions from your product sheet ⑰ Thursday: evergreen best-post recycler ⑱ Saturday: trend & hashtag research brief |
| B2-festive-engine-ugc | ⑲ festival T-14 → Gemini generates the FULL campaign (offer, captions, broadcast) ⑳ UGC webhook → Drive save + permission-request text |

## BATCH 3 — Ops, Money & AI Intelligence (advanced) — `batch-3-ops/`
| File | Automations inside |
|---|---|
| B3-inventory-rate-ops | ㉑ low-stock → Telegram card with ✅ one-tap PO approval → supplier wa.me ㉒ PO-drafting webhook ㉓ gold-rate threshold alerts (buy/sell signals) |
| B3-money-engine | ㉔ Razorpay payment-link creation for dues ㉕ 3-day polite payment chasing ㉖ scheme-instalment day-of-month reminders |
| B3-ai-sales-brain | ㉗ Gemini lead scoring (1-10) + 🔥 hot-lead alerts with next actions ㉘ stale leads → AI-personalised one-tap re-engagement nudges |
| B3-intelligence-backup | ㉙ Monday market-watch brief + monthly AI business review (this-vs-last month, 3 actions) ㉚ nightly sheet backup to Drive |

*(Plus the original 6 starter workflows in the parent folder — photo→studio, WhatsApp auto-reply, daily digest, review request, occasion reminders, new-design broadcast.)*

## Recommended enable order
Week 1: B1 hub + follow-up engine (leads never lost). Week 2: B2 rate-card + content factory (daily presence). Week 3: B2 omni publisher + B1 reputation. Week 4: B3 money + inventory. Then: AI sales brain + intelligence — the advanced layer.
