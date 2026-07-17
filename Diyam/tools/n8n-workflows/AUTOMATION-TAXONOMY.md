# The Complete Jewellery Automation Map — categorized
**52 automations BUILT (✅ import-ready JSON) · 12 more mapped for later (◻ needs paid API/hardware/approval).** Every built file has step-by-step SETUP + FIX inside the n8n canvas as a sticky note.

---

## GROUP 1 · LEAD CAPTURE & CRM  — `batch-1-leads/B1-lead-capture-hub.json`
✅ Website form → CRM ✅ Missed call → CRM ✅ WhatsApp-button click log+redirect ✅ Justdial email → parsed lead → *all into one sheet + Telegram alert*

## GROUP 2 · FOLLOW-UP & APPOINTMENTS — `B1-followup-appointment-engine.json`
✅ Daily follow-up due-list ✅ Booking webhook → Google Calendar + confirmation ✅ 3-day-ignored escalation ✅ Tomorrow's-visit WhatsApp reminders

## GROUP 3 · REPUTATION & REVIEWS — `B1-reputation-engine.json` + starter `4-review-request.json`
✅ New Google-review detector ✅ Gemini reply drafts ✅ Weekly reputation report ✅ Post-sale review request (3-day, template, no double-ask)

## GROUP 4 · DAILY PRESENCE & PUBLISHING — `batch-2-content/B2-daily-ratecard.json`, `B2-omni-publisher.json`
✅ Auto gold-rate poster → Telegram channel ✅ → Facebook page ✅ Photo `#post` → Cloudinary → Instagram ✅ → Facebook ✅ → Pinterest

## GROUP 5 · AI CONTENT ENGINE — `B2-ai-content-factory.json` + starter `1-photo-to-studio-post.json`
✅ Weekly AI captions from product sheet ✅ Evergreen best-post recycler ✅ Weekly trend/hashtag research ✅ Photo → Gemini studio re-shoot → back on Telegram

## GROUP 6 · FESTIVE & CAMPAIGNS — `B2-festive-engine-ugc.json` + starter `5-occasion-reminders.json`, `6-new-design-broadcast.json`
✅ T-14 auto campaign generator (offer + captions + broadcast text) ✅ UGC collector → Drive + permission ask ✅ Birthday/anniversary nudges ✅ `#new` design → channel + VIP WhatsApp broadcast

## GROUP 7 · WHATSAPP SELLING & SUPPORT — starter `2-whatsapp-autoreply.json` + `batch-4-commerce/B4-customer-care.json`
✅ PRICE/CATALOG/VISIT auto-reply menu ✅ AI triage of ANY channel's messages (intent + sentiment) ✅ FAQ auto-answers grounded in YOUR policies ✅ Angry-customer instant escalation (human takes over)

## GROUP 8 · E-COMMERCE & ORDERS — `B4-ecommerce-orders.json`
✅ Order intake (Shopify/site/WhatsApp) → log + owner alert + thank-you ✅ Auto stock decrement ✅ COD verify flag ✅ Courier status → customer update drafts

## GROUP 9 · BRIDAL PIPELINE (highest ticket) — `B4-bridal-pipeline.json`
✅ 6-month AI drip: T-180/150/120 inspiration → T-90 trousseau checklist → T-60 booking/karigar deadline → T-30 rate-lock → T-7 support → T+15 congratulations/review/anniversary capture — all one-tap, duplicate-safe

## GROUP 10 · INVENTORY & GOLD-RATE OPS — `batch-3-ops/B3-inventory-rate-ops.json`
✅ Low-stock → Telegram card with one-tap ✅Approve-PO → supplier wa.me ✅ PO-drafting webhook ✅ Rate threshold alerts (buy/sell signals)

## GROUP 11 · MONEY & PAYMENTS — `B3-money-engine.json`
✅ Razorpay payment links for dues ✅ 3-day polite chasing ✅ Scheme instalment day-of-month reminders

## GROUP 12 · LOYALTY & REFERRAL — `batch-5-loyalty-staff/B5-loyalty-referral.json`
✅ Points per ₹100 on every sale ✅ Silver/Gold/Platinum tier upgrades + congratulation ✅ Referral bonus + thank-you (all one-tap messages)

## GROUP 13 · AI SALES INTELLIGENCE — `B3-ai-sales-brain.json`
✅ Gemini lead scoring 1-10 + 🔥 hot-lead alerts with next actions ✅ Stale-lead personalised AI re-engagement nudges

## GROUP 14 · STAFF & COMPLIANCE — `B5-staff-compliance.json`
✅ Weekly staff sales leaderboard 🏆 ✅ High-value sale → PAN/KYC checklist (Rule 114B ₹2L+) ✅ GST/BIS/insurance/calibration deadline reminders

## GROUP 15 · OWNER INTELLIGENCE & SAFETY — `B3-intelligence-backup.json` + starter `3-daily-owner-digest.json`
✅ 8am daily digest ✅ Monday market-watch brief ✅ Monthly AI business review (month-vs-month + 3 actions) ✅ Nightly sheet backup to Drive

---

## GROUP 16 · AI VOICE & SPEECH — `batch-6-advanced/B6-ai-voice-speech-suite.json`
✅ Kannada AI voice agent answers showroom calls (Vapi) → call summary + booking → CRM ✅ End-of-call structuring (Gemini) ✅ Voice-note → transcribed → CRM (forward any customer voice note to the bot)

## GROUP 17 · WHATSAPP & IG AT SCALE — `B6-whatsapp-instagram-scale.json`
✅ WhatsApp Flows in-chat booking forms → parsed → CRM (Meta approval steps included) ✅ Instagram DM automation at scale (ManyChat Pro ↔ n8n AI brain) ✅ Google Business Profile weekly auto-posts from ContentBank (GBP allowlist steps included)

## GROUP 18 · MARKETPLACE INTELLIGENCE — `B6-marketplace-intelligence.json`
✅ Amazon SP-API offer/buy-box monitor ✅ Floor-guarded repricer with owner one-tap approval (never below your margin floor) ✅ Competitor price watch on ANY site (Flipkart/Tanishq/CaratLane pages) with >3% move alerts

## GROUP 19 · FINANCE & ACCOUNTING — `batch-7-enterprise/B7-finance-accounting-suite.json`
✅ E-invoice IRN generation via GSP (HSN 7113, GST 3% schema built-in) ✅ Zoho Books nightly invoice sync (marked, no duplicates) ✅ Daily Razorpay-vs-Orders reconciliation with mismatch alerts

## GROUP 20 · LIVE RATE & STORE INTELLIGENCE — `B7-rate-feed-store-intel.json`
✅ Live metal-rate API feed → ₹/gram 24K/22K + local premium → auto-fills Rates (calculator, posters, alerts all update themselves) ✅ CCTV/sensor footfall counting + daily conversion summary ✅ AR try-on event tracking → weekly most-tried-designs report

## GROUP 21 · MULTI-BRANCH & ENTERPRISE — `B7-multibranch-consolidation.json`
✅ Nightly all-branch rollup board + history ✅ Stock-transfer requests with owner one-tap approval + HUID pick/receive checklists ✅ Monday AI branch scorecards (win/concern/action per branch, sent to managers too)

## ◻ STILL LATER (genuinely blocked externally)
◻ Flipkart Seller API repricing (needs partner onboarding — competitor-watch covers it meanwhile) ◻ Tally on-prem sync (needs Tally.NET/ODBC gateway on the shop PC) ◻ WhatsApp Status auto-posting (no official API exists — policy, not tech)

---

## Enable order (practical)
Wk1: Groups 1-2 (never lose a lead) → Wk2: 4-5 (daily presence) → Wk3: 3+7 (trust + support) → Wk4: 8+10-11 (orders & money) → Wk5: 9+12 (bridal + loyalty) → Wk6: 13-15 (intelligence layer).
One master Sheet powers everything — tabs: Enquiries, Rates, Stock, Orders, Dues, SchemeMembers, Customers, VIPList, Festivals, Products, ContentBank, BestPosts, Reviews, CareLog, Bridal, Loyalty, StaffSales, Compliance.
