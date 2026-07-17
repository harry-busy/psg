# PSG Gold — Founder Operating System
### Internal / full-detail working document — prepared by Ospyr
*How the owner runs the whole business from one place, with automations and AI doing the routine work. Names the real tools (client pitch describes it by outcome only).*

---

## 1. The idea

A jeweller's day is pulled in every direction — walk-ins, WhatsApp enquiries, karigars/vendors, gold rate, staff, festivals, accounts. The Founder Operating System puts every number, enquiry and decision into **one command center**, and lets automations + AI handle the routine, so the owner spends time on customers, designs and relationships — not on chasing information. Target: run the business from **one screen and one morning message**, with everything else on autopilot.

It's built in layers; roll them out over the 90 days (layers 1–4 first).

---

## 2. The command layers

| Layer | What it is | Tools |
|---|---|---|
| **1 · Command dashboard** | One screen: enquiries, appointments booked, sales, gold rate, top designs, stock/karat, ad results, reviews | Looker Studio + Sheets fed by n8n |
| **2 · Daily WhatsApp digest** | Each morning: yesterday's enquiries, appointments today, sales, gold rate, campaign performance, low stock | n8n + GPT + WhatsApp |
| **3 · Ask-your-business** | Ask in plain language ("how many bridal enquiries this week? best-selling design this festival?") | Claude + MCP connectors |
| **4 · Enquiry & customer pipeline (CRM)** | Every WhatsApp/DM/walk-in enquiry tracked from first contact → appointment → sale → repeat | HubSpot/Zoho CRM + WhatsApp |
| **5 · Catalog & content control** | One place for designs, photos, videos, captions; publish to IG/FB/Pinterest/WhatsApp | Notion + scheduler |
| **6 · Gold-rate & pricing view** | Live gold rate, auto-updated pricing/making charges across catalog and WhatsApp | Gold-rate feed + automation |
| **7 · Money view** | Sales, GST (3% gold), gold-savings-scheme balances, expenses, cash | Zoho Books/Tally |
| **8 · Festive & occasion calendar** | Campaign planner for Akshaya Tritiya, Dhanteras, Ugadi, wedding season, customer occasions | Calendar + CRM triggers |
| **9 · One-tap approvals** | Creative, offers, ad spend, discounts come to the owner to approve | n8n + WhatsApp |
| **10 · Weekly scorecard** | Enquiries → appointments → sales conversion, footfall, AOV, repeat, festive lift vs target | Looker + n8n |

---

## 3. The command center (what's on the screen)

For the group and for each channel: today's/this-week's **enquiries** (WhatsApp, Instagram, walk-in) and where they are in the pipeline; **appointments** booked and completed; **sales** and average order value; **live gold rate**; **top designs/collections** by interest and sales; **stock by karat/design** and lay-away; **ad spend and cost per qualified enquiry**; **reviews and rating**; and the **festive campaign tracker**. Green is fine; red gets attention.

---

## 4. The AI "manager" (Claude + MCP)

Instead of digging through registers and chats, the owner asks: *"How many bridal enquiries came in this week and how many booked a visit?"*, *"Which earring designs got the most WhatsApp interest this month?"*, *"Draft a festive broadcast for Akshaya Tritiya for our VIP customers."* With Claude connected to the catalog, WhatsApp, CRM and sheets via MCP, it answers from live data and drafts the work. Recurring jobs (weekly report, festive reminders, review requests) run as automations without the owner touching them.

---

## 5. The owner's cadence

**Daily (about an hour, in blocks).** Read the morning digest and open the dashboard (10 min). Clear the approvals queue — creative, offers, ad spend (10 min). Review new enquiries and make sure each has a next step/appointment (20 min). Spend the rest on customers, designs and karigar/vendor relationships.

**Weekly.** Review the scorecard (enquiries → appointments → sales, footfall, AOV, repeat). Approve the week's content and any campaign. Plan the next festive/occasion push. Quick money review (sales, GST, scheme balances, expenses).

**Monthly.** Review the growth curve and unit economics with the CA; plan the next festival/wedding-season campaign; decide what to automate or delegate next; review stock and fast/slow designs.

---

## 6. Owner-level automations (protect the owner's time)

| Automation | What it does |
|---|---|
| **Morning digest** | Enquiries, appointments, sales, gold rate, campaign performance, low stock — one WhatsApp message |
| **Anomaly alerts** | Only pings for what matters — a spike in bridal enquiries, an ad that stopped converting, a low-stock bestseller |
| **Enquiry never dropped** | Every WhatsApp/DM/walk-in is logged and gets a next step + reminder until closed |
| **One-tap approvals** | Creative, offers and ad-budget requests arrive as approve/reject |
| **Festive/occasion triggers** | Auto-scheduled broadcasts and reminders for festivals and each customer's occasions |
| **Weekly scorecard** | Targets vs actuals per channel, built and sent automatically |
| **Review & referral requests** | After each sale, an automatic ask for a Google review + referral |
| **Media-from-WhatsApp** | Send a product photo → get back a branded image and an AI showcase video, ready to post |

---

## 7. A day in the life (target state)

The owner wakes to one message: yesterday brought 12 WhatsApp enquiries (5 bridal), 3 appointments today, two sales, gold rate up slightly, the Akshaya Tritiya campaign tracking ahead, and one bestselling design low on stock with a reorder ready to approve. He approves the reorder and a new festive creative with two taps. He opens the dashboard — all green except bridal follow-ups, so he personally messages three high-value bridal enquiries and books two visits. New designs from the karigar are photographed; he sends the photos on WhatsApp and gets back polished images and showcase videos that auto-post and broadcast to VIPs. By midday the routine is handled, and his time goes where it matters — customers, designs and trust. That is the point: leverage, not busywork.

---

*Companion files: the Growth & Services Blueprint, the Ospyr pitch service-catalogue, and the pitch deck.*
