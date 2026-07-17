"use client";

import { PageHead } from "@/components/Shell";
import { Card, CardTitle } from "@/components/ui";
import { useSettings } from "@/lib/settings";
import { AutomationCatalog, type Group, trg, ai, act, dec, out } from "@/components/Automation";
import { CheckCircle2, Circle, Boxes } from "lucide-react";

/** Five n8n MEGA engines run the Harshdeep Group machine server-side. Each
 *  workflow below opens into a plain-English flow you can tap to understand. */
const GROUPS: Group[] = [
  {
    batch: "AI Voice Agent Engine  (inbound + outbound calling)",
    flows: [
      { title: "Inbound Call Concierge", desc: "Answers every incoming call in a natural human voice, understands what the caller wants, handles FAQs and orders, and books or transfers the rest, logging it all.", steps: [trg("Incoming call"), ai("AI voice answers"), ai("Understand intent"), dec("FAQ / order / human?"), out("Book or transfer + log to CRM")] },
      { title: "Outbound Cold-call Pitching", desc: "Works through a prospect list, places live calls, pitches your custom apparel and merchandise, handles objections in real time and books demos with interested buyers.", steps: [trg("Prospect list loaded"), ai("AI places live call"), ai("Pitch + handle objections"), dec("Interested?"), out("Book meeting + log")] },
      { title: "Corporate Decision-maker Outreach", desc: "Calls founders, managers and HR at startups and small, mid and large companies to pitch bulk custom clothing, uniforms and branded merchandise, then routes qualified ones to sales.", steps: [trg("Company list: startup to enterprise"), ai("Reach founder / manager / HR"), ai("Pitch bulk custom merch + uniforms"), dec("Qualified?"), out("Route to sales + send proposal")] },
      { title: "Customer Service Call Agent", desc: "Takes support calls, resolves order status, returns and common questions in voice, and escalates only what truly needs a human.", steps: [trg("Support call"), ai("AI voice answers"), ai("Resolve order / return / query"), dec("Needs human?"), out("Resolve or escalate + log")] },
      { title: "Follow-up & Appointment Calls", desc: "Calls warm leads to follow up, confirm or reschedule appointments, and keeps the calendar and CRM in sync automatically.", steps: [trg("Follow-up due"), ai("AI calls the lead"), ai("Confirm / reschedule"), dec("Booked?"), out("Update calendar + CRM")] },
      { title: "Missed-call & After-hours Rescue", desc: "Calls back missed calls and answers after hours in voice, captures the enquiry and books or queues it so no lead is ever lost, day or night.", steps: [trg("Missed call / after hours"), ai("AI calls back / answers"), ai("Capture enquiry"), out("Book or queue lead")] },
      { title: "Post-call Intelligence", desc: "Transcribes and summarizes every call, scores buying intent, writes the next action into the CRM and alerts you the moment a hot prospect appears.", steps: [trg("Call ends"), ai("Transcribe + summarize"), ai("Score intent + next action"), dec("Hot?"), out("Update CRM + alert owner")] },
    ],
  },
  {
    batch: "Voice & Speech Studio  (complete AI voice suite)",
    flows: [
      { title: "Lifelike Text to Speech", desc: "Turn any script into ultra-realistic human speech in 70+ languages and accents, for every brand in the group.", steps: [trg("Script / caption"), ai("Generate lifelike voice"), dec("Language & tone"), out("Studio-quality audio")] },
      { title: "Instant Voice Cloning", desc: "Clone a founder's or spokesperson's voice from a short sample, then narrate ads, reels and updates in that exact voice.", steps: [trg("Short voice sample"), ai("Build voice clone"), act("Narrate any script"), out("On-brand voiceover")] },
      { title: "Brand Voice Design", desc: "Craft a unique, owned signature voice per brand from a simple description, with no recording needed.", steps: [trg("Describe the voice"), ai("Design synthetic voice"), out("Signature brand voice")] },
      { title: "Multilingual Dubbing", desc: "Dub reels, ads and product videos into dozens of languages while keeping the original voice, emotion and timing.", steps: [trg("Video / audio"), ai("Translate + dub"), act("Match voice & timing"), out("Multi-language versions")] },
      { title: "Speech to Text Transcription", desc: "Transcribe sales calls, voice notes and meetings accurately, with speaker labels and searchable text.", steps: [trg("Audio / call"), ai("Transcribe + label speakers"), out("Searchable transcript")] },
      { title: "Voice Changer", desc: "Re-voice any recording in a chosen voice while keeping the emotion and delivery intact.", steps: [trg("Existing recording"), ai("Convert to target voice"), out("Re-voiced audio")] },
      { title: "AI Sound Effects", desc: "Generate custom sound effects for reels, ads and product videos from a simple text prompt.", steps: [trg("Describe the sound"), ai("Generate sound effect"), out("Ready-to-use SFX")] },
      { title: "AI Music & Jingles", desc: "Create original, royalty-free background music and a branded jingle for each brand's content.", steps: [trg("Mood / brief"), ai("Compose music / jingle"), out("Royalty-free track")] },
      { title: "Voiceover Studio", desc: "Long-form narration for ads, IVR menus, explainers, product launches and reels, produced in minutes.", steps: [trg("Long script"), ai("Generate narration"), act("Edit & assemble"), out("Finished voiceover")] },
      { title: "Website Listen-Aloud Narration", desc: "Add a natural spoken narration to store and blog pages so visitors can listen instead of read.", steps: [trg("Page content"), ai("Narrate the page"), out("Embedded audio player")] },
      { title: "Multi-speaker Dialogue", desc: "Generate natural back-and-forth conversations between multiple voices for skits, ads and explainers.", steps: [trg("Dialogue script"), ai("Voice each speaker"), out("Multi-voice audio")] },
      { title: "Real-time Conversational Voice", desc: "The low-latency, human-sounding voice that powers the live inbound and outbound call agents.", steps: [trg("Live conversation"), ai("Understand + speak in real time"), out("Natural voice reply")] },
    ],
  },
  {
    batch: "Cinematic Video & Image Studio  (AI video + photoreal)",
    flows: [
      { title: "Text to Cinematic Video", desc: "Turn a simple prompt into a cinematic brand or product clip, ready for reels and ads.", steps: [trg("Text prompt"), ai("Generate cinematic video"), dec("Aspect ratio & length"), out("Ready-to-post clip")] },
      { title: "Image to Video", desc: "Animate a single product or apparel photo into a smooth, moving showcase.", steps: [trg("Product photo"), ai("Animate to video"), out("Motion showcase")] },
      { title: "Pro Camera Motion", desc: "Apply professional camera moves, dolly, crane, orbit, bullet-time and zoom, to any shot.", steps: [trg("Clip / image"), dec("Choose motion preset"), ai("Apply camera move"), out("Cinematic shot")] },
      { title: "Photoreal Image Generation", desc: "Generate studio-grade, photorealistic images of models wearing your custom apparel and merchandise, from a prompt.", steps: [trg("Prompt / reference"), ai("Generate photoreal image"), out("Campaign-ready visual")] },
      { title: "Talking Spokesperson Avatar", desc: "A lifelike presenter speaks your script with accurate lip-sync, in any language, for any brand.", steps: [trg("Script + avatar"), ai("Generate talking presenter"), act("Lip-sync to voice"), out("Spokesperson video")] },
      { title: "Cinematic VFX Presets", desc: "Add sparkle, light, glow, smoke and other cinematic effects to any clip in one tap.", steps: [trg("Clip"), ai("Apply VFX preset"), out("Enhanced video")] },
      { title: "Consistent Model / Character", desc: "Keep the same model or brand character across an entire campaign and every brand.", steps: [trg("Reference character"), ai("Lock character identity"), act("Reuse across shots"), out("Consistent campaign")] },
      { title: "Product Ad Generator", desc: "Turn a single product or apparel piece into a scroll-stopping, UGC-style video ad.", steps: [trg("Product + offer"), ai("Generate ad creative"), dec("Pick a winning variant"), out("Publish-ready ad")] },
      { title: "Lip-sync in Any Language", desc: "Sync any face to any voiceover, in any language, for localized ads across markets.", steps: [trg("Face + voiceover"), ai("Lip-sync"), out("Localized video")] },
      { title: "Brand Look & Style Presets", desc: "Apply a consistent cinematic grade and look per brand so all content feels unified.", steps: [trg("Raw content"), ai("Apply brand style"), out("On-brand visuals")] },
      { title: "Batch Variations", desc: "Generate many video and image variants at once to test what performs best across brands.", steps: [trg("One brief"), ai("Generate variations"), out("A/B-ready set")] },
      { title: "Upscale & Enhance", desc: "Upscale and sharpen images and video to crisp HD and 4K.", steps: [trg("Low-res asset"), ai("Upscale + enhance"), out("HD / 4K asset")] },
    ],
  },
  {
    batch: "Inventory & Invoicing Engine  (software + integration by us)",
    flows: [
      { title: "Inventory Software & Integration", desc: "We provide the inventory software and connect it to your store and back office (Shopify, WooCommerce, Zoho, Tally or custom ERP), so every brand's stock lives in one place.", steps: [trg("Onboard / connect store + ERP"), act("Import SKUs + opening stock"), ai("Map + de-duplicate SKUs"), out("Unified live inventory")] },
      { title: "Live Stock Sync (store + marketplaces)", desc: "Every order, restock and transfer updates stock in real time across your store, marketplaces and warehouse, with barcode scanning.", steps: [trg("Order / restock / transfer"), act("Scan barcode"), act("Update stock in real time"), out("Sync store + marketplaces")] },
      { title: "Auto Invoice to WhatsApp", desc: "The moment an order is billed, a GST invoice PDF is sent straight to the customer's WhatsApp number.", steps: [trg("Order billed"), act("Generate GST invoice PDF"), out("Send to customer WhatsApp")] },
      { title: "Auto Invoice to Email", desc: "The same invoice is emailed to the customer automatically, with a copy filed for your records.", steps: [trg("Order billed"), act("Attach invoice PDF"), out("Email customer + archive")] },
      { title: "Low-stock & Reorder Alerts", desc: "When any SKU hits its reorder point or sells out, you get a WhatsApp alert with a ready-to-send purchase order to the vendor.", steps: [trg("Stock changes"), dec("At / below reorder point?"), ai("Draft purchase order"), out("WhatsApp alert to owner")] },
      { title: "Inventory Issue Notifications", desc: "Any inventory issue, such as oversell, negative stock, price mismatch, dead stock or RTO restock, fires an instant WhatsApp notification.", steps: [trg("Inventory check"), dec("Oversell / mismatch / dead stock?"), ai("Explain issue + fix"), out("WhatsApp notification")] },
      { title: "Purchase & Vendor Sync", desc: "Purchase orders, goods receipts and vendor catalogs for custom clothing and merchandise stay in sync, with landed cost updated automatically.", steps: [trg("PO / goods received"), act("Match GRN + update cost"), act("Update landed cost"), out("Books + stock updated")] },
      { title: "Daily Stock Report", desc: "A daily stock and movement summary per brand (fast movers, low stock, value on hand) is delivered to your WhatsApp or Telegram.", steps: [trg("Daily schedule"), act("Aggregate stock + movement"), ai("Summarize per brand"), out("WhatsApp / Telegram digest")] },
    ],
  },
  {
    batch: "Content & Creative Engine  (Aurra / all)",
    flows: [
      { title: "Topic to Content Kit", desc: "Give it a topic and it returns an on-brand caption, hashtags and an image brief, queued to the calendar.", steps: [trg("Topic / brief"), ai("Brand voice + trends"), ai("Caption + hashtags + image brief"), out("Queue to calendar")] },
      { title: "Photo to Post + Video", desc: "One product photo becomes a branded post card and a short showcase video, ready to publish.", steps: [trg("Product photo"), ai("Studio image + branded card"), ai("Short showcase video"), out("Publish / queue")] },
      { title: "Weekly Content Calendar", desc: "Reads the product feed each week and plans a full 7-day posting calendar with drafts.", steps: [trg("Weekly schedule"), act("Read product feed"), ai("Plan 7-day calendar"), out("Draft posts")] },
      { title: "UGC + Best-post Recycler", desc: "Finds your top performers and user content, refreshes them and reschedules for another run.", steps: [trg("Performance data"), act("Find top posts + UGC"), ai("Refresh + reschedule"), out("Republish")] },
    ],
  },
  {
    batch: "Sales, Leads & CRM Engine  (Loop In / Designomics)",
    flows: [
      { title: "Lead Qualifier + Booking Bot", desc: "Qualifies and scores every inbound lead, books the meeting and drops it into the CRM.", steps: [trg("Inbound lead"), ai("Qualify + score"), act("Book meeting"), out("Push to CRM")] },
      { title: "Quote-to-Order (corporate gifting)", desc: "Turns a requirement into a quote, and on approval creates the order and invoice.", steps: [trg("Requirement"), ai("Build quote"), dec("Client approves?"), out("Create order + invoice")] },
      { title: "Follow-up Sequences", desc: "When a lead goes cold it runs a multi-step, multi-channel nudge plan so nothing is dropped.", steps: [trg("Lead goes cold"), ai("Multi-step nudge plan"), act("Send across channels"), out("Re-engage / close")] },
      { title: "AI Lead Scoring + Hot-lead Alerts", desc: "Enriches and scores leads and pings you the moment a high-intent buyer shows up.", steps: [trg("New / updated lead"), ai("Enrich + score"), dec("Hot?"), out("Alert owner instantly")] },
    ],
  },
  {
    batch: "E-commerce & Order Ops Engine  (Aurra / Designomics)",
    flows: [
      { title: "New Product to Live Everywhere", desc: "Generates listings and pushes a new product to the store, marketplaces and socials in one move.", steps: [trg("New product"), ai("Generate listings"), act("Push store + marketplaces + socials"), out("Confirm live")] },
      { title: "Abandoned-cart / Enquiry Recovery", desc: "Waits, segments, then sends a personalized recovery message to win the sale back.", steps: [trg("Cart abandoned"), dec("Wait + segment"), ai("Personalized recovery message"), out("Recover / discount")] },
      { title: "Order-status Auto-updates", desc: "Every status change is translated into a friendly customer update across channels.", steps: [trg("Status change"), act("Map to customer message"), out("Notify on WhatsApp / email")] },
      { title: "Marketplace Sync", desc: "Keeps listings and stock in sync across marketplaces and resolves conflicts safely.", steps: [trg("Stock / price change"), act("Sync across marketplaces"), dec("Conflict?"), out("Update")] },
    ],
  },
  {
    batch: "Marketing & Social Engine  (All)",
    flows: [
      { title: "Always-on Posting", desc: "Posts from your queue at the best time for each platform and tracks how it performs.", steps: [trg("Content queue"), ai("Best time per platform"), act("Auto-post"), out("Track engagement")] },
      { title: "Festive / Occasion Broadcasts", desc: "Segments your audience for each occasion and sends a generated broadcast with reminders.", steps: [trg("Occasion calendar"), act("Segment audience"), ai("Generate broadcast"), out("Send + remind")] },
      { title: "Review & UGC Requests", desc: "After a purchase it waits, then asks for a review or user content and showcases the best.", steps: [trg("Purchase complete"), dec("Wait window"), ai("Ask for review / UGC"), out("Collect + showcase")] },
      { title: "Retention Flows", desc: "Picks the right lifecycle journey per customer and runs it over email, SMS and WhatsApp.", steps: [trg("Lifecycle stage"), ai("Pick journey"), act("Send across channels"), out("Win-back / upsell")] },
    ],
  },
  {
    batch: "Founder OS & Business Ops Engine  (Harshdeep)",
    flows: [
      { title: "8am Command Digest", desc: "Pulls yesterday's numbers from all four brands and delivers one AI-written digest each morning.", steps: [trg("8am schedule"), act("Pull metrics from four brands"), ai("Summarize"), out("Telegram digest")] },
      { title: "Anomaly Alerts", desc: "Watches live metrics and, on a ROAS drop, stockout or RTO spike, explains it and alerts you.", steps: [trg("Live metrics"), dec("Anomaly?"), ai("Explain + suggest fix"), out("Alert owner")] },
      { title: "One-tap Approvals", desc: "Anything needing sign-off waits for your one-tap approval, then fires the next step automatically.", steps: [trg("Action needs sign-off"), dec("Owner approves"), act("Trigger next step"), out("Log")] },
      { title: "Weekly Scorecard + Cash/Runway Watch", desc: "Aggregates P&L and cash weekly into an AI scorecard with a live runway read for the founder.", steps: [trg("Weekly schedule"), act("Aggregate P&L + cash"), ai("Scorecard + runway"), out("Deliver to founder")] },
    ],
  },
];

export default function FounderAutomations() {
  const s = useSettings();
  const tg = !!(s.telegramToken && s.telegramChat);
  return (
    <>
      <PageHead title="Automations" sub="Nine n8n MEGA engines, including a full AI voice-calling engine, a complete voice and speech studio, a cinematic video and image studio, and inventory and invoicing, run the machine server-side. This OS is the cockpit; tap any workflow to see how it runs." />

      <Card className="mb-5">
        <CardTitle>Connections</CardTitle>
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-2">{tg ? <CheckCircle2 size={16} className="text-[var(--color-success)]" /> : <Circle size={16} className="text-[var(--color-muted)]" />} Telegram alerts</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[var(--color-success)]" /> AI voice calling (inbound + outbound)</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[var(--color-success)]" /> Voice & speech studio (TTS, cloning, dubbing)</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[var(--color-success)]" /> AI video & photoreal image studio</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[var(--color-success)]" /> Groq AI (server)</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[var(--color-success)]" /> Image / video gen (free)</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[var(--color-success)]" /> Ingest webhook ready</span>
        </div>
        <p className="mt-3 text-xs text-[var(--color-muted)]">Import each <code>MEGA_*.json</code> in n8n, add credentials, then activate. They POST live metrics and leads into this OS via the ingest webhook (Settings). Nothing sends until you connect accounts.</p>
      </Card>

      <Card className="mb-5">
        <div className="mb-1 flex items-center gap-2">
          <Boxes size={16} className="text-[var(--color-crimson)]" />
          <b className="font-display">Inventory software and integration, provided by us</b>
        </div>
        <p className="text-sm text-[var(--color-muted)]">
          We set up the inventory software and connect it to your store and back office (Shopify, WooCommerce, Zoho, Tally or custom ERP) across every brand. From there you get real-time stock across store, marketplaces and warehouse, barcode scanning, purchase orders and vendor sync for custom clothing and merchandise, landed-cost valuation, GST invoices auto-sent to each customer's WhatsApp and email, and WhatsApp alerts for every stock issue: low stock, out of stock, reorder, oversell and dead stock. Tap the flows below to see each one.
        </p>
      </Card>

      <AutomationCatalog groups={GROUPS} />
    </>
  );
}
