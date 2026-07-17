"use client";

import { PageHead } from "@/components/Shell";
import { Card, CardTitle } from "@/components/ui";
import { useSettings } from "@/lib/settings";
import { AutomationCatalog, type Group, trg, ai, act, dec, out } from "@/components/Automation";
import { CheckCircle2, Circle, Boxes } from "lucide-react";

/** The always-on automation layer lives in n8n (untouched). This page catalogs
 *  every PSG Gold workflow with a plain-English flow you can tap open. */
const GROUPS: Group[] = [
  {
    batch: "AI Voice Agent Engine  (inbound + outbound calling)",
    flows: [
      { title: "Inbound Call Concierge", desc: "Answers every showroom call in a natural voice, in English or your regional language, shares today's gold rate, checks availability, books appointments and transfers the rest, logging it all.", steps: [trg("Incoming call"), ai("AI voice answers (regional)"), ai("Understand intent"), dec("Rate / product / appointment / human?"), out("Book or transfer + log to CRM")] },
      { title: "Outbound Lead-call Engine", desc: "Calls fresh website, missed-call and Justdial leads to invite them in, share offers and book a showroom visit.", steps: [trg("New lead list"), ai("AI places live call"), ai("Invite + share offer"), dec("Interested?"), out("Book visit + log")] },
      { title: "Customer Service Call Agent", desc: "Handles order status, repair and hallmarking status, scheme balance and return questions in voice, escalating only what needs a human.", steps: [trg("Support call"), ai("AI voice answers"), ai("Resolve order / repair / scheme"), dec("Needs human?"), out("Resolve or escalate + log")] },
      { title: "Bridal & High-value Follow-up Calls", desc: "Calls bridal and big-ticket leads at each milestone to nurture the highest-value sales personally, at scale.", steps: [trg("Bridal / high-value milestone"), ai("AI calls the lead"), ai("Nurture + next step"), dec("Ready to visit?"), out("Book + update pipeline")] },
      { title: "Appointment Reminder & Reschedule Calls", desc: "Calls ahead of every booked appointment to confirm or reschedule, keeping the calendar clean.", steps: [trg("Appointment upcoming"), ai("AI confirmation call"), dec("Confirm / reschedule?"), out("Update calendar + CRM")] },
      { title: "Missed-call & After-hours Rescue", desc: "Calls back missed calls and answers after hours in voice, captures the enquiry and books or queues it so no customer is ever lost, day or night.", steps: [trg("Missed call / after hours"), ai("AI calls back / answers"), ai("Capture enquiry"), out("Book or queue lead")] },
      { title: "Post-call Intelligence", desc: "Transcribes and summarizes every call, scores buying intent, writes the next action into the CRM and alerts you the moment a hot buyer appears.", steps: [trg("Call ends"), ai("Transcribe + summarize"), ai("Score intent + next action"), dec("Hot?"), out("Update CRM + alert owner")] },
    ],
  },
  {
    batch: "Voice & Speech Studio  (complete AI voice suite)",
    flows: [
      { title: "Lifelike Text to Speech", desc: "Turn any script into ultra-realistic human speech in 70+ languages including Kannada, Hindi, Tamil and English.", steps: [trg("Script / caption"), ai("Generate lifelike voice"), dec("Language & tone"), out("Studio-quality audio")] },
      { title: "Instant Voice Cloning", desc: "Clone the owner's or a presenter's voice from a short sample, then narrate every ad, reel and reminder in that exact voice.", steps: [trg("Short voice sample"), ai("Build voice clone"), act("Narrate any script"), out("On-brand voiceover")] },
      { title: "Brand Voice Design", desc: "Craft a unique, brand-owned signature voice from a simple description, with no recording needed.", steps: [trg("Describe the voice"), ai("Design synthetic voice"), out("Signature brand voice")] },
      { title: "Multilingual Dubbing", desc: "Dub reels, ads and videos into dozens of languages while keeping the original voice, emotion and timing.", steps: [trg("Video / audio"), ai("Translate + dub"), act("Match voice & timing"), out("Multi-language versions")] },
      { title: "Speech to Text Transcription", desc: "Transcribe calls, voice notes and videos accurately, with speaker labels and searchable text.", steps: [trg("Audio / call"), ai("Transcribe + label speakers"), out("Searchable transcript")] },
      { title: "Voice Changer", desc: "Re-voice any recording in a chosen voice while keeping the emotion and delivery intact.", steps: [trg("Existing recording"), ai("Convert to target voice"), out("Re-voiced audio")] },
      { title: "AI Sound Effects", desc: "Generate custom sound effects for reels and ads from a simple text prompt.", steps: [trg("Describe the sound"), ai("Generate sound effect"), out("Ready-to-use SFX")] },
      { title: "AI Music & Jingles", desc: "Create original, royalty-free background music and a branded jingle for your content.", steps: [trg("Mood / brief"), ai("Compose music / jingle"), out("Royalty-free track")] },
      { title: "Voiceover Studio", desc: "Long-form narration for ads, IVR menus, in-store audio, explainers and reels, produced in minutes.", steps: [trg("Long script"), ai("Generate narration"), act("Edit & assemble"), out("Finished voiceover")] },
      { title: "Website Listen-Aloud Narration", desc: "Add a natural spoken narration to your catalog and blog pages so visitors can listen instead of read.", steps: [trg("Page content"), ai("Narrate the page"), out("Embedded audio player")] },
      { title: "Multi-speaker Dialogue", desc: "Generate natural back-and-forth conversations between multiple voices for skits and explainers.", steps: [trg("Dialogue script"), ai("Voice each speaker"), out("Multi-voice audio")] },
      { title: "Real-time Conversational Voice", desc: "The low-latency, human-sounding voice that powers the live call agent, in your regional language.", steps: [trg("Live conversation"), ai("Understand + speak in real time"), out("Natural voice reply")] },
    ],
  },
  {
    batch: "Cinematic Video & Image Studio  (AI video + photoreal)",
    flows: [
      { title: "Text to Cinematic Video", desc: "Turn a simple prompt into a cinematic jewellery clip, ready for reels and ads.", steps: [trg("Text prompt"), ai("Generate cinematic video"), dec("Aspect ratio & length"), out("Ready-to-post clip")] },
      { title: "Image to Video", desc: "Animate a single product photo into a smooth, moving showcase.", steps: [trg("Product photo"), ai("Animate to video"), out("Motion showcase")] },
      { title: "Pro Camera Motion", desc: "Apply professional camera moves, dolly, crane, orbit, bullet-time and zoom, to any shot.", steps: [trg("Clip / image"), dec("Choose motion preset"), ai("Apply camera move"), out("Cinematic shot")] },
      { title: "Photoreal Image Generation", desc: "Generate studio-grade, photorealistic images of models wearing your pieces, from a prompt.", steps: [trg("Prompt / reference"), ai("Generate photoreal image"), out("Campaign-ready visual")] },
      { title: "Talking Spokesperson Avatar", desc: "A lifelike presenter speaks your script with accurate lip-sync, in any language.", steps: [trg("Script + avatar"), ai("Generate talking presenter"), act("Lip-sync to voice"), out("Spokesperson video")] },
      { title: "Cinematic VFX Presets", desc: "Add sparkle, light, glow, smoke and other cinematic effects to any clip in one tap.", steps: [trg("Clip"), ai("Apply VFX preset"), out("Enhanced video")] },
      { title: "Consistent Model / Character", desc: "Keep the same model or brand character across an entire campaign.", steps: [trg("Reference character"), ai("Lock character identity"), act("Reuse across shots"), out("Consistent campaign")] },
      { title: "Product Ad Generator", desc: "Turn a single piece into a scroll-stopping, UGC-style video ad.", steps: [trg("Product + offer"), ai("Generate ad creative"), dec("Pick a winning variant"), out("Publish-ready ad")] },
      { title: "Lip-sync in Any Language", desc: "Sync any face to any voiceover, in any language, for localized ads.", steps: [trg("Face + voiceover"), ai("Lip-sync"), out("Localized video")] },
      { title: "Brand Look & Style Presets", desc: "Apply a consistent cinematic grade and look so all your content feels like one brand.", steps: [trg("Raw content"), ai("Apply brand style"), out("On-brand visuals")] },
      { title: "Batch Variations", desc: "Generate many video and image variants at once to test what performs best.", steps: [trg("One brief"), ai("Generate variations"), out("A/B-ready set")] },
      { title: "Upscale & Enhance", desc: "Upscale and sharpen images and video to crisp HD and 4K.", steps: [trg("Low-res asset"), ai("Upscale + enhance"), out("HD / 4K asset")] },
    ],
  },
  {
    batch: "Inventory & Invoicing Engine  (software + integration by us)",
    flows: [
      { title: "Inventory Software & Integration", desc: "We provide the inventory software and connect it to your existing billing or POS/ERP (Tally, Zoho, Vyapar, Marg, GoFrugal or custom), so all stock lives in one place.", steps: [trg("Onboard / connect POS + ERP"), act("Import items + opening stock"), ai("Map + de-duplicate SKUs"), out("Unified live inventory")] },
      { title: "Live Stock Sync (barcode + HUID)", desc: "Every sale, purchase and branch transfer updates stock in real time, with barcode and HUID scanning across all showrooms.", steps: [trg("Sale / purchase / transfer"), act("Scan barcode / HUID"), act("Update stock in real time"), out("Sync all branches")] },
      { title: "Auto Invoice to WhatsApp", desc: "The moment a bill is generated, a GST invoice PDF is sent straight to the customer's WhatsApp number.", steps: [trg("Bill generated"), act("Generate GST invoice PDF"), out("Send to customer WhatsApp")] },
      { title: "Auto Invoice to Email", desc: "The same invoice is emailed to the customer automatically, with a copy filed for your records.", steps: [trg("Bill generated"), act("Attach invoice PDF"), out("Email customer + archive")] },
      { title: "Low-stock & Reorder Alerts", desc: "When any item hits its reorder point or runs out, you get a WhatsApp alert with a ready-to-send purchase order.", steps: [trg("Stock changes"), dec("At / below reorder point?"), ai("Draft purchase order"), out("WhatsApp alert to owner")] },
      { title: "Inventory Issue Notifications", desc: "Any inventory issue, such as negative stock, price or rate mismatch, missing HUID or dead stock, fires an instant WhatsApp notification.", steps: [trg("Inventory check"), dec("Negative / mismatch / dead stock?"), ai("Explain issue + fix"), out("WhatsApp notification")] },
      { title: "Purchase & Supplier Sync", desc: "Purchase orders, goods receipts and supplier catalogs stay in sync, with the live gold rate applied to valuation automatically.", steps: [trg("PO / goods received"), act("Match GRN + update cost"), act("Apply live rate to valuation"), out("Books + stock updated")] },
      { title: "Daily Stock Report", desc: "A daily stock and movement summary (fast movers, low stock, value on hand) is delivered to your WhatsApp or Telegram.", steps: [trg("Daily schedule"), act("Aggregate stock + movement"), ai("Summarize"), out("WhatsApp / Telegram digest")] },
    ],
  },
  {
    batch: "Leads, follow-ups & reputation",
    flows: [
      { title: "Lead Capture Hub", desc: "Every enquiry from your website, a missed call or Justdial becomes a scored lead in the CRM, and you get pinged.", steps: [trg("Website / missed call / Justdial"), act("Dedupe + create lead in CRM"), ai("AI lead score"), out("Telegram alert to owner")] },
      { title: "Follow-up & Appointment Engine", desc: "Each morning it builds your follow-up list, drafts the nudges and books visits straight into your calendar.", steps: [trg("Daily 9am"), act("Pull due follow-ups"), ai("Draft WhatsApp nudges"), act("Send + book slot"), out("Add to Google Calendar")] },
      { title: "Reputation Engine", desc: "New Google reviews are caught instantly and an on-brand reply is drafted for you to approve in one tap.", steps: [trg("New Google review"), dec("High or low rating?"), ai("Draft on-brand reply"), dec("Owner approves"), out("Post reply + log")] },
    ],
  },
  {
    batch: "Content & marketing",
    flows: [
      { title: "Daily Gold-Rate Poster", desc: "Fetches the live gold rate every morning, makes a branded poster and posts it to your channels automatically.", steps: [trg("8am schedule"), act("Fetch live gold rate"), ai("Generate rate poster"), out("Post to Telegram + Facebook")] },
      { title: "Omni-Publisher", desc: "Drop one post in Telegram with #post and it is reformatted and published everywhere at once.", steps: [trg("Telegram #post"), act("Extract image + caption"), ai("Reformat per platform"), out("Publish to IG / FB / Pinterest")] },
      { title: "AI Content Factory", desc: "Reads your catalog weekly, researches trends and queues a week of captions for your review.", steps: [trg("Weekly schedule"), act("Read catalog"), ai("Trends + write captions"), act("Queue posts"), out("Owner review")] },
      { title: "Festive Engine", desc: "Two weeks before every gold festival it auto-builds the campaign creatives and copy, ready to schedule.", steps: [trg("Festival calendar T-14"), dec("Pick festival + offer"), ai("Generate creatives + copy"), out("Schedule broadcasts")] },
    ],
  },
  {
    batch: "Ops, money & AI intelligence",
    flows: [
      { title: "Inventory & Rate Ops", desc: "Watches stock levels and, when a line runs low, drafts a purchase order you can send to the supplier in one tap.", steps: [trg("Stock update"), dec("Below reorder point?"), ai("Draft purchase order"), out("One-tap send to supplier")] },
      { title: "Money Engine", desc: "Tracks Razorpay dues and politely chases unpaid balances until they clear, logging everything.", steps: [trg("Payment due"), act("Check Razorpay status"), dec("Still unpaid?"), ai("Send polite reminder"), out("Log payment / escalate")] },
      { title: "AI Sales Brain", desc: "Enriches and scores every lead with AI and alerts you the instant a hot buyer appears.", steps: [trg("New / updated lead"), ai("Enrich + score"), dec("Hot lead?"), out("Instant owner alert")] },
      { title: "Intelligence & Backup", desc: "Writes your daily digest and monthly review, and quietly backs up your data.", steps: [trg("Daily / monthly schedule"), act("Aggregate KPIs"), ai("Write digest / review"), out("Send + back up data")] },
    ],
  },
  {
    batch: "Commerce",
    flows: [
      { title: "E-commerce Orders", desc: "Every new order is logged, thanked and deducted from stock without you touching a thing.", steps: [trg("New order"), act("Log order"), act("Send thank-you"), out("Decrement stock")] },
      { title: "Bridal Pipeline", desc: "Tags a bridal lead and runs a 6-month AI drip of milestone touchpoints so the big-ticket sale never slips.", steps: [trg("Bridal lead tagged"), ai("Build 6-month plan"), act("Scheduled touchpoints"), out("Reminders + offers")] },
      { title: "Customer Care", desc: "Reads incoming WhatsApp messages, answers FAQs and prices itself, and escalates anything upset to you.", steps: [trg("WhatsApp message"), ai("Understand intent"), dec("FAQ / price / angry?"), out("Auto-reply or escalate")] },
    ],
  },
  {
    batch: "Loyalty & staff",
    flows: [
      { title: "Loyalty & Referral", desc: "Awards points on every purchase, moves customers up tiers and sends reward and referral messages.", steps: [trg("Purchase logged"), act("Add points + update tier"), dec("Tier up?"), out("Send reward + referral link")] },
      { title: "Staff & Compliance", desc: "Tallies staff sales into a leaderboard and nudges anyone missing PAN/KYC on high-value bills.", steps: [trg("Daily schedule"), act("Tally staff sales"), dec("PAN / KYC missing?"), out("Nudge + post leaderboard")] },
    ],
  },
  {
    batch: "Advanced & enterprise",
    flows: [
      { title: "WhatsApp & IG at Scale", desc: "Routes high-volume WhatsApp and Instagram messages with interactive flows, handing hot leads to you.", steps: [trg("Message at scale"), ai("Route by intent"), act("WhatsApp Flow / IG DM"), out("Hand off hot leads")] },
      { title: "Marketplace Repricer", desc: "Repositions your marketplace prices as rates move, never dropping below your margin floor.", steps: [trg("Rate / competitor change"), act("Recompute price"), dec("Below margin floor?"), out("Update listings safely")] },
      { title: "Finance Suite", desc: "Generates the e-invoice IRN, syncs to Zoho and reconciles the books for you.", steps: [trg("Invoice created"), act("Generate e-invoice IRN"), act("Sync to Zoho"), out("Reconcile + report")] },
      { title: "Rate Feed & Multi-branch", desc: "Pushes the live rate to every branch and rolls their sales back up into one owner view.", steps: [trg("Live rate feed"), act("Push to all branches"), act("Collect branch sales"), out("Consolidated rollup")] },
    ],
  },
];

export default function AutomationsPage() {
  const s = useSettings();
  const connected = { telegram: !!(s.telegramToken && s.telegramChat) };
  return (
    <>
      <PageHead title="Automations" sub="The always-on engine for PSG Gold, including a full AI voice-calling engine, a complete voice and speech studio, and a cinematic video and image studio. These run server-side in n8n and pair with this app. Tap any workflow to see how it runs." />

      <Card className="mb-5">
        <CardTitle>Connections</CardTitle>
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-2">{connected.telegram ? <CheckCircle2 size={16} className="text-[var(--color-success)]" /> : <Circle size={16} className="text-[var(--color-muted)]" />} Telegram alerts</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[var(--color-success)]" /> WhatsApp share links</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[var(--color-success)]" /> AI voice calling (inbound + outbound)</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[var(--color-success)]" /> Voice & speech studio (TTS, cloning, dubbing)</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[var(--color-success)]" /> AI video & photoreal image studio</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[var(--color-success)]" /> Groq AI (server)</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[var(--color-success)]" /> Image gen (Pollinations, free)</span>
        </div>
        <p className="mt-3 text-xs text-[var(--color-muted)]">
          Full WhatsApp Cloud API, schedules and webhooks require the n8n pack (server-side, Meta blocks browser automation).
          Import each JSON in n8n, Workflows, Import, then follow the on-canvas sticky note.
        </p>
      </Card>

      <Card className="mb-5">
        <div className="mb-1 flex items-center gap-2">
          <Boxes size={16} className="text-[var(--color-crimson)]" />
          <b className="font-display">Inventory software and integration, provided by us</b>
        </div>
        <p className="text-sm text-[var(--color-muted)]">
          We set up the inventory software and connect it to your existing billing / POS / ERP (Tally, Zoho, Vyapar, Marg, GoFrugal or custom). From there you get real-time stock across all branches, barcode and HUID scanning, purchase orders and supplier sync, live gold-rate valuation, GST invoices auto-sent to each customer's WhatsApp and email, and WhatsApp alerts for every stock issue: low stock, out of stock, reorder, negative stock and dead stock. Tap the flows below to see each one.
        </p>
      </Card>

      <AutomationCatalog groups={GROUPS} />

      <p className="mt-5 text-xs text-[var(--color-muted)]">
        Recommended enable order: Wk1 leads, Wk2 daily presence, Wk3 trust &amp; support, Wk4 orders &amp; money, Wk5 bridal &amp; loyalty, Wk6 intelligence layer.
      </p>
    </>
  );
}
