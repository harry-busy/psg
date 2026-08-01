# Padmavathi Jewellery Mart — Live scrape report

**Scraped:** 2026-08-01  
**Sources:**
- Justdial (Srinivasanagara listing) — page blocked by CDN; fields reconstructed from public search indexes + sibling Hanumantha Nagar JD listing + Magicpin
- Instagram `@padmavathi_jewellery_mart` — live API scrape (`instagram_scrape.json`)
- Magicpin store page
- Cross-check: Facebook page, Threads/local posts

---

## 1. Business snapshot

| Field | Value | Source |
|---|---|---|
| **Legal / trade name** | Padmavathi Jewellery Mart | IG, JD, Magicpin |
| **Heritage claim** | Since **1939** | IG creatives (“SINCE 1939”), JD Hanumantha Nagar listing |
| **Category** | Jewellery showroom · Gold / Silver / Platinum | JD, Magicpin, IG category “Jewelry/watches” |
| **Primary market** | Hanumantha Nagar / Banashankari / Srinivasanagara, Bengaluru | All listings |
| **Positioning (from bio + content)** | Gold & silver · bridal · daily wear · custom · silver pooja essentials · hallmarked tradition | IG |

---

## 2. Justdial listing (Srinivasanagara)

**URL:** https://www.justdial.com/Bangalore/Padmavathi-Jewellery-Mart-Srinivasanagara/080PXX80-XX80-250220211040-P7L8_BZDET

> Direct HTTP scrape returned **Access Denied** (Akamai). Fields below are from Justdial search snippets + public indexes (Aug 2026 crawl).

| Field | Value |
|---|---|
| **Area tag** | Srinivasanagara, Bangalore |
| **Address (JD snippet)** | **237, SBM Colony, Banashankari 1st Stage** |
| **Hours (JD FAQ snippet)** | **9:30 AM – 9:30 PM** |
| **Rating** | **4.9★** based on **14 customer reviews** |
| **Photos** | **42 photos** on listing |
| **Category** | Jewellery Showrooms |
| **EMI schemes** | Mentioned in JD FAQ (“Does Padmavathi Jewellery Mart provide EMI schemes…”) — answer not fully recovered |

### Related Justdial listing (Hanumantha Nagar / same brand cluster)

**URL:** https://www.justdial.com/Bangalore/Padmavathi-Jewellery-Mart-Near-Nirmala-Store-Bus-Stop-Hanumantha-Nagar/080P5140712_BZDET

| Field | Value |
|---|---|
| **Address** | No.151, Near Nirmala Store Bus Stop, **50 Feet Road**, Hanumantha Nagar, Bangalore-**560019** |
| **Established** | **1939** |
| **Hours (sample)** | Monday: **11:00 AM – 8:00 PM** (snippet; may differ from Srinivasanagara hours) |
| **Rating** | **4.0★** based on **~40 reviews** (separate listing) |

> Note: Public directories show slight address variants (50 Feet Road vs Kumaraswamy Temple Rd / SBM Colony). Treat **237, SBM Colony / Kumaraswamy Temple Rd** as the current storefront used on Instagram Maps + Magicpin; **151 Avenue Road / Raja Market** appears on older Sulekha listings and may be a different/historical location or data mix-up.

---

## 3. Instagram — live profile scrape

**URL:** https://www.instagram.com/padmavathi_jewellery_mart/?hl=en  
**Raw JSON:** `instagram_scrape.json`

### Profile

| Field | Live value (2026-08-01) |
|---|---|
| **Username** | `padmavathi_jewellery_mart` |
| **Full name** | Padmavathi Jewellery mart |
| **User ID** | `40199022780` |
| **Followers** | **563** |
| **Following** | **3** |
| **Posts (total)** | **397** |
| **Highlights** | **8** |
| **Account type** | Professional (not full “Business” flag) |
| **Verified** | No |
| **Category** | Jewelry/watches |
| **Private** | No |

### Bio (exact)

```
Padmavathi Jewellery Mart
👑 Gold & Silver Collections
✨ Bridal | Daily Wear | Custom Designs 
📍 Hanumantha Nagar
📞90366 48030, 96113 80935
```

### Contact & links

| Type | Value |
|---|---|
| **Phone 1** | **90366 48030** (+91 9036648030) |
| **Phone 2** | **96113 80935** |
| **WhatsApp** | https://wa.me/9036648030 |
| **Google Maps (bio link)** | https://share.google/bKi7VspWgfqNfwgYO |
| **Bio link titles** | “Google map location”, “Chat with us in Watsapp” |

### Content themes (recent grid, Jul 2026)

Dominant pillars from latest 12 posts:

1. **Silver pooja essentials** — deepas, ritual articles, “pure silver · pure devotion”
2. **Festival / auspicious calendar** — Guru Purnima greetings, festive gifting
3. **Home & ritual silver** — silver for home, weddings, housewarming
4. **Brand heritage** — “SINCE 1939” on creatives
5. **Local SEO tags** — `#Hanumanthanagar` `#BengaluruJewellery` `#BangaloreJewellers`
6. **Agency watermark** — frequent `#futurereachofficial` / “Future Reach Official”

Engagement on recent posts is very low (typically **0–13 likes**, **0 comments**), matching the Jul 2026 Socialinsider audit already in this folder (563 followers, ~3.5 eng/post, 0.62% ER).

### Sample recent posts

| Date (UTC) | Type | Likes | Hook / topic |
|---|---|---|---|
| 2026-07-29 | Image | 2 | Guru Purnima greeting |
| 2026-07-27 | Image ×3 | 1–4 | Silver blessings / pure silver celebration |
| 2026-07-20 | Reel + images | 0–13 | Silver Deepa / pooja essentials |
| 2026-07-13 | Image ×3 | 2–6 | Silver ritual articles |
| 2026-07-06 | Image ×2 | 2–3 | Divine silver / deepa collection |

---

## 4. Magicpin (address confirmation)

**URL:** https://magicpin.in/Bangalore/Hanumanth-Nagar/Fashion/Padmavathi-Jewellery-Mart/store/1aa1200/

| Field | Value |
|---|---|
| **Area** | Hanumanth Nagar, Basavanagudi, Bangalore |
| **Address** | **237, Kumaraswamy Temple Rd, SBM Colony, Banashankari 1st Stage, Banashankari, Bengaluru, Karnataka 560019** |
| **Coords** | 12.9416379, 77.5613572 |
| **Products** | Gold Jewellery · Platinum Jewellery · Silver Jewellery |
| **Photos** | ~84 listed |
| **WhatsApp (platform)** | magicpin enquire number (platform), not store’s primary WA |

---

## 5. Canonical contact card (recommended for Ospyr / CRM)

Use this as the **single source of truth** for tools, growth story, and automations:

```
Name:     Padmavathi Jewellery Mart
Since:    1939
Address:  237, Kumaraswamy Temple Rd / SBM Colony,
          Banashankari 1st Stage (Srinivasanagara / Hanumantha Nagar),
          Bengaluru 560019
Maps:     https://share.google/bKi7VspWgfqNfwgYO
Phone:    +91 90366 48030 · +91 96113 80935
WhatsApp: https://wa.me/9036648030
IG:       @padmavathi_jewellery_mart  (563 followers · 397 posts)
JD:       4.9★ · 14 reviews · 42 photos (Srinivasanagara listing)
Hours:    ~9:30 AM – 9:30 PM (JD Srinivasanagara FAQ; confirm on-site)
```

---

## 6. Gaps / contradictions to resolve with the client

1. **Hours conflict:** JD Srinivasanagara FAQ says 9:30–9:30; Hanumantha Nagar JD snippet shows Mon 11:00–8:00. Confirm real timings.
2. **Address variants:** 237 SBM Colony / Kumaraswamy Temple Rd (Magicpin + Threads) vs “No.151, 50 Feet Road, Hanumantha Nagar” (JD HN listing) vs Avenue Road / Raja Market (Sulekha — likely wrong or old).
3. **IG posts_count = 397** live vs older deck copy that said “229 total posts” — update Growth Story stats.
4. **Account not Business-flagged** (`is_business_account: false`) though professional — upgrade for Commerce / product tags.
5. **No website** in IG bio (only Maps + WhatsApp). Domain `padmavathijewellerymart.com` is aspirational in pitch materials, not live on profile.
6. **Low engagement** despite steady posting — aligns with existing Ospyr pitch (reel-first, local SEO, review engine).

---

## 7. Files written this scrape

| File | Contents |
|---|---|
| `instagram_scrape.json` | Live IG profile + 12 recent posts (structured) |
| `scrape_justdial_instagram_2026-08-01.md` | This report |
| `ig_profile.json` (repo root, optional) | Raw Instagram API response — can delete after use |
