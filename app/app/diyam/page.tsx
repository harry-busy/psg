"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { StudioReferences } from "@/components/StudioReferences";
import {
  Camera, Gem, Calculator, Users, CalendarDays, Star, Wallet, LayoutDashboard,
  ArrowRight, ChevronDown, Check, Workflow, Instagram, Film, Wand2, Mic,
  MessageCircle, MapPin, Globe, Building2, Boxes, Send, MessageSquare,
  Smartphone, Phone, Image as ImageIcon, Video, Rocket, Gift, Flame, Sun, TrendingUp,
  ArrowUpRight, ArrowDownRight, Clock, Hash, Heart, Eye, BarChart3,
} from "lucide-react";

/*
 * The Growth Blueprint - Diyam House of Silver x Ospyr.
 * Native, Apple-styled rebuild of Diyam/Diyam_Experience.html. Uses the Ospyr
 * theme: red backgrounds #D2042D, cream background #EBE5D5. Real Instagram
 * analytics (18 Jun to 17 Jul). Every tool wired to the live module.
 * Diyam sells both 925 silver and hallmarked gold.
 */

const RED = "#D2042D";
const RED_DEEP = "#9e0426";
const CREAM = "#EBE5D5";
const CREAM_2 = "#e0d9c6";
const GOLD = "#b8860b";
const GOLD_SOFT = "#c9a227";
const INK = "#1d1d1f";
const MUTED = "#6d5f52";
const redWash = `linear-gradient(135deg, ${RED} 0%, ${RED_DEEP} 100%)`;

/* ── scroll reveal ─────────────────────────────────────────────────────────── */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={cn("transition-all duration-700 ease-out will-change-transform", seen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8", className)}>
      {children}
    </div>
  );
}

/* ── count-up ──────────────────────────────────────────────────────────────── */
function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const dur = 1500;
      let start: number | null = null;
      const step = (t: number) => {
        if (start === null) start = t;
        const p = Math.min((t - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setN(value * eased);
        if (p < 1) requestAnimationFrame(step); else setN(value);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return <span ref={ref}>{Math.round(n).toLocaleString("en-IN")}{suffix}</span>;
}

/* ── building blocks ───────────────────────────────────────────────────────── */
function Eyebrow({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) {
  return <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: onDark ? GOLD_SOFT : GOLD }}>{children}</div>;
}
function GoldLine() {
  return <div className="my-6 h-[3px] w-16 rounded-full" style={{ background: `linear-gradient(90deg, ${GOLD_SOFT}, transparent)` }} />;
}
function Section({ children }: { children: React.ReactNode }) {
  return <section className="px-5 py-16 sm:px-6 sm:py-24"><div className="mx-auto max-w-6xl">{children}</div></section>;
}
function BandSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="px-5 py-16 sm:px-6 sm:py-24" style={{ background: redWash, color: "#fbf5ec" }}>
      <div className="mx-auto max-w-6xl"><Reveal>{children}</Reveal></div>
    </section>
  );
}
function StatBlock({ value, label, sub }: { value: React.ReactNode; label: string; sub?: string }) {
  return (
    <div className="min-w-0">
      <div className="font-display text-[clamp(1.85rem,7vw,3.2rem)] font-semibold leading-none tabular-nums" style={{ color: GOLD_SOFT }}>{value}</div>
      <div className="mt-2.5 text-[13px] font-medium leading-snug sm:text-sm" style={{ color: "#f4e4d6" }}>{label}</div>
      {sub && <div className="mt-1 text-[12px]" style={{ color: "#e2c7ad" }}>{sub}</div>}
    </div>
  );
}

/* ── comparison bar (animates on view) ─────────────────────────────────────── */
function CompareBar({ name, meta, value, pct, note, you = false }: { name: string; meta: string; value: string; pct: number; note: string; you?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setW(pct); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [pct]);
  return (
    <div ref={ref}>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-2">
        <span className="text-sm font-semibold" style={{ color: "#fbf5ec" }}>{name} <span className="font-normal" style={{ color: "#e7cdb4" }}>{meta}</span></span>
        <span className="font-display text-lg font-semibold tabular-nums" style={{ color: GOLD_SOFT }}>{value}</span>
      </div>
      <div className="h-4 w-full overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.14)" }}>
        <div className="h-full rounded-full transition-[width] duration-[1400ms] ease-out" style={{ width: `${Math.max(w, 1.5)}%`, background: you ? "linear-gradient(90deg, #f6ead9, #ffffff)" : `linear-gradient(90deg, ${GOLD}, ${GOLD_SOFT})` }} />
      </div>
      <div className="mt-1.5 text-[13px]" style={{ color: "#e7cdb4" }}>{note}</div>
    </div>
  );
}

const ENGINE = [
  { icon: Instagram, h: "Social Media, All Pages", p: "Every platform, managed as one brand.", li: ["Instagram, Facebook, Threads, Pinterest, YouTube", "Strategy, calendar and daily posting", "Community and DM management", "Profile, bio and highlights optimised to convert"] },
  { icon: Film, h: "Content & Creative", p: "Scroll-stopping, jewellery-grade content.", li: ["Macro and on-model photography for silver and gold", "The reels growth engine, 4 to 5 a week, hook-first", "Bridal, festive and gifting lookbooks", "Trending-audio, which-one and styling formats"] },
  { icon: Wand2, h: "AI Image & Video Studio", p: "Endless content from a single photo.", li: ["Any product photo to a studio-grade image", "Photo to an AI 360 or showcase video", "AI on-model shots without shoots", "AI UGC-style ad videos at scale"] },
  { icon: Mic, h: "Founder Story & Legacy", p: "Your trust, turned into content.", li: ["Founder's film and brand story", "Behind-the-craft and heritage series", "Customer stories and testimonials", "A premium, legacy brand voice"] },
  { icon: MessageCircle, h: "WhatsApp Commerce", p: "The channel that actually sells.", li: ["WhatsApp Business plus a full catalog", "Instant price, purity and stock replies", "Click-to-WhatsApp on every post", "Broadcast lists for drops and festivals"] },
  { icon: MapPin, h: "Get Found, Local & Search", p: "Own the map and the search bar.", li: ["Google Business Profile and Maps management", "Justdial and local listings optimised", "Local SEO for silver and gold in Jayanagar and Bangalore", "Reviews engine, grow the 4.6 star name"] },
  { icon: Globe, h: "Website & Online Store", p: "A digital front door, finally.", li: ["Catalog website with live silver and gold rate", "Book-appointment and enquiry capture", "Optional online store for lighter pieces", "Instagram and WhatsApp shops"] },
  { icon: Building2, h: "Wholesale + Retail Engines", p: "Two motions, one brand.", li: ["Retail: impulse and gifting content, offers, D2C", "Wholesale: B2B catalog, dealer enquiries, rate sheets", "Separate funnels and broadcasts for each", "Bulk-order and reorder automation"] },
  { icon: Workflow, h: "Google Workspace & Automation", p: "The back office, organised.", li: ["Google Workspace setup and management", "Shared drive, sheets and catalog database", "Workspace automations, leads to sheets to alerts", "One master system feeding everything"] },
  { icon: Boxes, h: "Jewellery-Software Integration", p: "Connect what you already run.", li: ["Link your billing and inventory software to the catalog", "Auto-sync stock, designs and rates", "Sales and customer data into the CRM", "One source of truth, no double entry"] },
  { icon: Users, h: "CRM, Retention & Loyalty", p: "Never lose a customer again.", li: ["Every enquiry and buyer in one database", "Occasion and festival reminders", "Loyalty and referral program", "Win-back and repeat-purchase flows"] },
  { icon: LayoutDashboard, h: "Owner Command Dashboard", p: "Run it all from one screen.", li: ["Enquiries, sales, reach and reviews in one view", "8 AM WhatsApp digest every morning", "Weekly scorecard vs targets", "Ask-your-business AI assistant"] },
];

const AUTO = [
  { icon: MessageCircle, b: "WhatsApp auto-reply", p: "Price, purity, availability and catalog, answered in seconds." },
  { icon: Send, b: "Instagram auto-DM", p: "Every DM answered instantly and turned into a lead." },
  { icon: MessageSquare, b: "Comment to auto-DM", p: "A keyword comment triggers an instant DM with details and link." },
  { icon: Smartphone, b: "Text / SMS automations", p: "Offers, order and festival messages sent automatically." },
  { icon: Phone, b: "AI voice call agent (Kannada)", p: "Answers calls, quotes, books visits, round the clock." },
  { icon: ImageIcon, b: "Photo to branded image", p: "Send a product photo, get a polished catalog visual back." },
  { icon: Video, b: "Photo to showcase video", p: "One photo becomes a reel-ready 360 video, auto-posted." },
  { icon: Rocket, b: "New design to everywhere", p: "Auto-posted across channels plus broadcast to VIP buyers." },
  { icon: Gift, b: "Festive & occasion broadcasts", p: "Rakhi, Diwali, Dhanteras, weddings, timed and automatic." },
  { icon: Star, b: "Review & referral requests", p: "After every sale, an automatic ask, 5-stars on autopilot." },
  { icon: Flame, b: "AI lead scoring", p: "Hot buyers flagged with the next action, instantly." },
  { icon: Sun, b: "Daily owner digest", p: "Enquiries, sales, reach and rate, one morning message." },
];

const SPRINT = [
  { n: "Week 1", h: "Foundation", li: ["WhatsApp Business plus catalog live", "Profile, bio and highlights revamp", "Google Business plus Justdial optimised", "Content system and new caption style", "First proper shoot"] },
  { n: "Week 2", h: "Content & Automation", li: ["Reels engine at full flow, right timing", "AI image plus video automations on", "Auto-DM plus comment-to-DM live", "Reviews engine switched on", "Founder story shoot"] },
  { n: "Week 3", h: "Reach & Offers", li: ["First offer campaign plus codes", "Local micro-creators and UGC", "Meta and Google ads switched on", "Wholesale B2B broadcast list", "Instagram SEO and hashtags reworked"] },
  { n: "Week 4", h: "Prove & Scale", li: ["Festive / Rakhi push live", "WhatsApp enquiries flowing to sales", "Owner dashboard plus daily digest", "Review count climbing", "Growth curve reported"] },
];

const TOOLS = [
  { icon: Camera, name: "Studio Photo", desc: "Any phone photo becomes a pro studio image.", href: "/app/studio" },
  { icon: Gem, name: "Product Card Maker", desc: "Photo plus details becomes a branded catalog card.", href: "/app/cards" },
  { icon: Calculator, name: "Rate Calculator", desc: "Weight, rate and making gives an instant quote, for silver and gold.", href: "/app/calculator" },
  { icon: Users, name: "Enquiry CRM", desc: "Log and track every enquiry to close.", href: "/app/crm" },
  { icon: CalendarDays, name: "Festive Calendar", desc: "Every festival with campaign plans.", href: "/app/calendar" },
  { icon: Star, name: "Review QR Kit", desc: "Turn happy buyers into 5-stars.", href: "/app/reviews" },
  { icon: Wallet, name: "Savings Scheme", desc: "A customer-facing scheme calculator.", href: "/app/scheme" },
  { icon: LayoutDashboard, name: "Owner Dashboard", desc: "Your whole shop on one screen.", href: "/app/dashboard" },
];

/* ── social analytics (scraped from the uploaded Instagram report + comparison decks,
      18 Jun to 17 Jul 2026) ────────────────────────────────────────────────── */
const OWN_METRICS = [
  { v: "39", l: "Organic posts", d: "18.75% lower", up: false },
  { v: "138", l: "Total engagement", d: "26.60% lower", up: false },
  { v: "5,383", l: "Impressions", d: "57.21% higher", up: true },
  { v: "3,383", l: "Reach", d: "40.37% higher", up: true },
  { v: "281", l: "Followers", d: "+4 this period", up: true },
  { v: "5", l: "Comments", d: "400% higher", up: true },
  { v: "133", l: "Likes", d: "of 138 total engagement", up: true },
  { v: "4.1", l: "Avg hashtags / post", d: "consistent tagging", up: true },
];

const TOP_POSTS = [
  { date: "02 Jul", title: "925 Silver Adjustable Rakhi", reach: "130", eng: "8", imp: "208", likes: "7", comments: "1", er: "3.85%" },
  { date: "21 Jun", title: "925 Silver Oxidised Earrings", reach: "85", eng: "7", imp: "136", likes: "7", comments: "0", er: "5.15%" },
  { date: "27 Jun", title: "925 Silver Oxidised Necklace", reach: "120", eng: "7", imp: "192", likes: "7", comments: "0", er: "3.65%" },
];

const HASHTAGS = [
  { t: "925silver", n: 26 }, { t: "elegantjewellery", n: 26 }, { t: "luxurystyle", n: 26 },
  { t: "necklacedesign", n: 26 }, { t: "silverjewellery", n: 26 }, { t: "bangalore", n: 6 }, { t: "hyderabad", n: 6 },
];

const COMPARE = [
  { m: "Followers", d: "281", o: "11,201", p: "1,177,713" },
  { m: "Posts (30 days)", d: "39", o: "60", p: "190" },
  { m: "Total engagement", d: "138", o: "20.1K", p: "59.9K" },
  { m: "Avg engagement / post", d: "3.5", o: "335.1", p: "315.3" },
  { m: "Engagement / day", d: "4.6", o: "670.3", p: "1,997" },
  { m: "Avg posts / day", d: "1.3", o: "2.0", p: "6.3" },
  { m: "New followers (period)", d: "+4", o: "+116", p: "+7,066" },
  { m: "Avg engagement / reel", d: "4.13", o: "789.71", p: "300.75" },
  { m: "Comments", d: "5", o: "892", p: "788" },
  { m: "Likes", d: "133", o: "19.2K", p: "59.1K" },
  { m: "Peak engagement time", d: "Sun 11 AM", o: "Sat 6 PM", p: "Thu 6 PM" },
  { m: "Avg hashtags / post", d: "4.1", o: "5.0", p: "4.8" },
];

function Metric({ v, l, d, up }: { v: string; l: string; d: string; up: boolean }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_12px_34px_-22px_rgba(60,10,25,0.35)]">
      <div className="font-display text-[2rem] font-semibold leading-none tabular-nums" style={{ color: RED }}>{v}</div>
      <div className="mt-1.5 text-[13px] font-medium" style={{ color: INK }}>{l}</div>
      <div className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: up ? "#1d8a3f" : "#b25000" }}>
        {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />} {d}
      </div>
    </div>
  );
}
function PerfBar({ label, count, avg, pct }: { label: string; count: string; avg: string; pct: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-[14px] font-semibold" style={{ color: INK }}>{label} <span className="font-normal" style={{ color: MUTED }}>{count}</span></span>
        <span className="font-display text-[15px] font-semibold tabular-nums" style={{ color: RED }}>{avg} <span className="text-[11px] font-normal" style={{ color: MUTED }}>avg eng</span></span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full" style={{ background: CREAM_2 }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: redWash }} />
      </div>
    </div>
  );
}
function TimeBox({ k, l }: { k: string; l: string }) {
  return (
    <div className="rounded-xl p-3" style={{ background: CREAM_2 }}>
      <div className="font-display text-lg font-semibold" style={{ color: "#7a0b25" }}>{k}</div>
      <div className="mt-0.5 text-[12px]" style={{ color: MUTED }}>{l}</div>
    </div>
  );
}
function PostStat({ icon, v, l }: { icon: React.ReactNode; v: string; l: string }) {
  return (
    <div className="rounded-lg py-2" style={{ background: "#faf7f1" }}>
      <div className="flex items-center justify-center gap-1 font-display text-[15px] font-semibold tabular-nums" style={{ color: RED }}>
        <span style={{ color: GOLD }}>{icon}</span>{v}
      </div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wide" style={{ color: MUTED }}>{l}</div>
    </div>
  );
}

export default function DiyamBlueprint() {
  return (
    <div className="-mx-4 -my-6 sm:-mx-8 lg:-ml-10 lg:-mr-8" style={{ background: CREAM, color: INK }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden px-5 py-20 sm:px-6 sm:py-32" style={{ background: `radial-gradient(120% 90% at 82% 8%, #e6203f 0%, ${RED} 44%, ${RED_DEEP} 100%)`, color: "#fbf5ec" }}>
        <div className="pointer-events-none absolute -right-32 -top-28 h-72 w-72 rounded-full opacity-40 sm:h-[420px] sm:w-[420px]" style={{ background: `radial-gradient(circle, ${GOLD_SOFT}55, transparent 65%)` }} />
        <div className="pointer-events-none absolute -bottom-28 -left-28 h-64 w-64 rounded-full opacity-30 sm:h-80 sm:w-80" style={{ background: `radial-gradient(circle, ${GOLD_SOFT}44, transparent 65%)` }} />
        <div className="relative mx-auto max-w-5xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/diyam-logo.png" alt="Diyam House of Silver logo" className="mb-6 h-20 w-auto rounded-2xl shadow-[0_16px_44px_-18px_rgba(0,0,0,0.55)] ring-1 ring-white/15 sm:h-24" />
          <div className="mb-6 text-[10px] font-semibold uppercase tracking-[0.22em] sm:mb-7 sm:text-[12px] sm:tracking-[0.38em]" style={{ color: GOLD_SOFT }}>
            Diyam House of Silver &middot; 925 Silver &amp; Hallmark Gold &middot; Jayanagar, Bengaluru
          </div>
          <h1 className="font-display text-[clamp(2rem,7.4vw,4.75rem)] font-semibold leading-[1.05] tracking-tight">
            You have done the work.<br />Now let&apos;s make the world <span className="italic" style={{ color: GOLD_SOFT }}>see it.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[clamp(1rem,2.4vw,1.45rem)] leading-relaxed sm:mt-7" style={{ color: "#f4e4d6" }}>
            39 posts a month. 31 reels. Real craft in 925 silver and hallmarked gold, a 4.6 star name. Everything is in
            place except the engine that turns all that effort into followers, enquiries and sales. This is that engine.
          </p>
          <div className="mt-9 inline-block border-t pt-4 text-[13px] tracking-wide sm:mt-11 sm:text-sm" style={{ borderColor: `${GOLD_SOFT}55`, color: "#e6d3bb" }}>
            A complete growth and sales blueprint prepared for Diyam House of Silver &middot; by Ospyr
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2" style={{ color: GOLD_SOFT }}>
          <span className="block animate-bounce"><ChevronDown size={20} /></span>
        </div>
      </header>

      {/* ── LEGACY / FOUNDER ─────────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <Eyebrow>The house and its founder</Eyebrow>
          <h2 className="max-w-3xl font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight" style={{ color: RED }}>
            A house built on purity, in silver and gold alike.
          </h2>
          <GoldLine />
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            <div>
              <p className="max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: "#4a3b33" }}>
                Diyam House of Silver was born from a simple belief: that sterling silver deserves the same reverence as
                gold, the same craft, the same trust, the same soul. From a workbench in Jayanagar to a name that serves
                both wholesale partners and walk-in families, Diyam has quietly built a reputation on one promise: real
                925 silver and honest, hallmarked gold.
              </p>
              <p className="mt-4 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: "#4a3b33" }}>
                That story, the founder&apos;s hands, the first design, the families who return generation after
                generation, is the most powerful marketing you own. Most people who would love Diyam have simply never
                heard it. We put the legacy at the centre of the brand: a founder&apos;s film, the craft in motion, the
                meaning behind every piece.
              </p>
              <div className="mt-5 rounded-xl px-4 py-3 text-[13px] italic" style={{ background: CREAM_2, borderLeft: `3px solid ${GOLD}`, color: MUTED }}>
                Draft narrative. We replace this with your real founder&apos;s name, the year Diyam began, and the family
                story before this goes live. Give us the true details and we write the film script around them.
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-5 rounded-[22px] p-8 text-center shadow-[0_24px_70px_-30px_rgba(60,10,25,0.5)]" style={{ background: redWash, border: `1px solid ${GOLD_SOFT}44` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/diyam-logo.png" alt="Diyam House of Silver logo" className="w-full max-w-[300px] rounded-2xl shadow-[0_18px_50px_-22px_rgba(0,0,0,0.6)] ring-1 ring-white/10" />
              <div className="text-[12px] uppercase tracking-[0.2em]" style={{ color: "#e2c7ad" }}>Exclusive silver jewellery &amp; artecrafts</div>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ── TODAY / ANALYTICS (red band) ─────────────────────────────────── */}
      <BandSection>
        <Eyebrow onDark>Where you stand today, the real numbers</Eyebrow>
        <h2 className="font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight">
          Huge effort. Almost no reward, yet.
        </h2>
        <p className="mt-5 max-w-2xl text-base sm:text-lg" style={{ color: "#f4e4d6" }}>
          Straight from your Instagram analytics, 18 June to 17 July. Read them without flinching, because every one of
          these is about to change.
        </p>
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3 sm:gap-8 lg:grid-cols-6">
          <StatBlock value={<CountUp value={281} />} label="Followers" sub="+4 this month" />
          <StatBlock value={<CountUp value={39} />} label="Posts published" sub="31 reels, 8 images" />
          <StatBlock value={<CountUp value={138} />} label="Total engagement" sub="~4.6 a day" />
          <StatBlock value={<CountUp value={5} />} label="Comments, all month" sub="133 likes total" />
          <StatBlock value={<CountUp value={3383} />} label="Reach" sub="up 40 percent" />
          <StatBlock value={<CountUp value={5383} />} label="Impressions" sub="up 57 percent" />
        </div>
        <p className="mt-10 max-w-3xl text-base sm:text-lg" style={{ color: "#f4e4d6" }}>
          The good news is buried in here: reach is up 40 percent, impressions up 57 percent, and your reels already
          outperform images 4-to-1. The raw material is working. It has never been organised into a system. That is all
          this is.
        </p>
      </BandSection>

      {/* ── COMPLETE SOCIAL ANALYTICS (from the uploaded reports) ─────────── */}
      <Section>
        <Reveal>
          <Eyebrow>Complete social analytics</Eyebrow>
          <h2 className="font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight" style={{ color: RED }}>
            Every number from your report, in one place.
          </h2>
          <GoldLine />
          <p className="max-w-3xl text-base leading-relaxed sm:text-lg" style={{ color: "#4a3b33" }}>
            Pulled straight from your Instagram Insights for <b>18 June to 17 July 2026</b>, compared to the previous
            month, plus a head-to-head against OnnMe and PSG Gold.
          </p>
          <Link href="/app/diyam/reports" className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold" style={{ color: RED }}>
            Open the full reports and comparison decks <ArrowRight size={15} />
          </Link>
        </Reveal>

        {/* headline metrics */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {OWN_METRICS.map((m, i) => (
            <Reveal key={m.l} delay={(i % 4) * 50}><Metric {...m} /></Reveal>
          ))}
        </div>

        {/* post mix + best time */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Reveal className="h-full">
            <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-[0_12px_34px_-22px_rgba(60,10,25,0.35)]">
              <div className="flex items-center gap-2"><BarChart3 size={18} style={{ color: RED }} /><b className="font-display text-[17px]" style={{ color: INK }}>Post mix and what performs</b></div>
              <p className="mt-1 text-[13.5px]" style={{ color: MUTED }}>31 reels vs 8 images. Reels earn 3.3x the engagement, this is your growth lever.</p>
              <div className="mt-4 space-y-4">
                <PerfBar label="Reels" count="31 posts" avg="4.13" pct={100} />
                <PerfBar label="Images" count="8 posts" avg="1.25" pct={30} />
              </div>
            </div>
          </Reveal>
          <Reveal className="h-full">
            <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-[0_12px_34px_-22px_rgba(60,10,25,0.35)]">
              <div className="flex items-center gap-2"><Clock size={18} style={{ color: RED }} /><b className="font-display text-[17px]" style={{ color: INK }}>When your audience shows up</b></div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <TimeBox k="Sunday" l="Highest-engagement day" />
                <TimeBox k="11 AM" l="Highest-engagement hour" />
                <TimeBox k="Wednesday" l="Where you post most" />
                <TimeBox k="11 AM" l="Where you post most" />
              </div>
              <p className="mt-4 text-[13px]" style={{ color: "#b25000" }}>
                The leaders post at 6 PM. Shifting your slot alone leaves easy engagement on the table.
              </p>
            </div>
          </Reveal>
        </div>

        {/* top posts */}
        <Reveal>
          <h3 className="mt-10 font-display text-xl font-semibold" style={{ color: "#7a0b25" }}>Your top 3 posts this month</h3>
        </Reveal>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {TOP_POSTS.map((p, i) => (
            <Reveal key={p.date} delay={i * 60} className="h-full">
              <div className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-[0_12px_34px_-22px_rgba(60,10,25,0.35)]" style={{ borderTop: `4px solid ${GOLD}` }}>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: GOLD }}>{p.date}</span>
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase" style={{ background: CREAM_2, color: "#7a0b25" }}>Reel</span>
                </div>
                <b className="mt-2 block text-[15px]" style={{ color: INK }}>{p.title}</b>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <PostStat icon={<Eye size={13} />} v={p.reach} l="Reach" />
                  <PostStat icon={<Heart size={13} />} v={p.eng} l="Eng." />
                  <PostStat icon={<BarChart3 size={13} />} v={p.imp} l="Impr." />
                </div>
                <div className="mt-3 border-t pt-3 text-[12px]" style={{ borderColor: "#efe7d6", color: MUTED }}>
                  {p.likes} likes &middot; {p.comments} comments &middot; {p.er} eng. by impressions
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* hashtags */}
        <Reveal>
          <div className="mt-8 flex items-center gap-2"><Hash size={18} style={{ color: RED }} /><b className="font-display text-[17px]" style={{ color: INK }}>Your most-used hashtags</b><span className="text-[13px]" style={{ color: MUTED }}>4.1 avg per post</span></div>
          <div className="mt-3 flex flex-wrap gap-2">
            {HASHTAGS.map((h) => (
              <span key={h.t} className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium" style={{ borderColor: `${GOLD}55`, background: "#fff", color: INK }}>
                #{h.t} <span className="text-[11px] font-bold" style={{ color: GOLD }}>{h.n}</span>
              </span>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* ── HEAD TO HEAD COMPARISON (from the compare decks) ──────────────── */}
      <Section>
        <Reveal>
          <Eyebrow>Head to head</Eyebrow>
          <h2 className="font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight" style={{ color: RED }}>
            Diyam vs OnnMe vs PSG Gold.
          </h2>
          <GoldLine />
          <p className="max-w-3xl text-base leading-relaxed sm:text-lg" style={{ color: "#4a3b33" }}>
            Same 30 days, side by side. OnnMe is a close peer already winning; PSG Gold is the mountain-top. This is
            exactly the ground the engine closes.
          </p>
        </Reveal>
        <Reveal>
          <div className="mt-8 overflow-hidden rounded-[18px] bg-white shadow-[0_20px_60px_-28px_rgba(60,10,25,0.4)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left">
                <thead>
                  <tr style={{ background: redWash, color: "#fbf5ec" }}>
                    <th className="px-4 py-3 text-[12px] font-bold uppercase tracking-[0.1em] sm:px-6">Metric</th>
                    <th className="px-4 py-3 text-[13px] font-bold sm:px-6" style={{ color: GOLD_SOFT }}>Diyam</th>
                    <th className="px-4 py-3 text-[13px] font-semibold sm:px-6">OnnMe</th>
                    <th className="px-4 py-3 text-[13px] font-semibold sm:px-6">PSG Gold</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map((r, i) => (
                    <tr key={r.m} style={{ background: i % 2 ? "#faf7f1" : "#fff" }}>
                      <td className="px-4 py-3 text-[13.5px] font-medium sm:px-6" style={{ color: INK }}>{r.m}</td>
                      <td className="px-4 py-3 text-[14px] font-bold tabular-nums sm:px-6" style={{ color: RED, background: "rgba(210,4,45,0.06)" }}>{r.d}</td>
                      <td className="px-4 py-3 text-[13.5px] tabular-nums sm:px-6" style={{ color: MUTED }}>{r.o}</td>
                      <td className="px-4 py-3 text-[13.5px] tabular-nums sm:px-6" style={{ color: MUTED }}>{r.p}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { big: "146x", t: "OnnMe's monthly engagement", p: "20.1K vs your 138, on only 60 posts to your 39, because their reels average 789 vs your 4." },
            { big: "3.3x", t: "your reels beat your images", p: "4.13 vs 1.25 average engagement. The format already works; it just needs reach and consistency." },
            { big: "6 PM", t: "when the leaders post", p: "OnnMe peaks Saturday 6 PM, PSG Gold Thursday 6 PM. You post at 11 AM on Wednesday." },
          ].map((k) => (
            <Reveal key={k.t} className="h-full">
              <div className="flex h-full flex-col rounded-2xl p-6" style={{ background: redWash, color: "#fbf5ec" }}>
                <div className="font-display text-4xl font-semibold" style={{ color: GOLD_SOFT }}>{k.big}</div>
                <b className="mt-2 block text-[15px]">{k.t}</b>
                <p className="mt-1.5 text-[13.5px]" style={{ color: "#f4e4d6" }}>{k.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-sm italic" style={{ color: MUTED }}>
          Source: your Instagram Insights and the OnnMe and PSG Gold comparison reports, 18 June to 17 July 2026.
        </p>
      </Section>

      {/* ── THE GAP / COMPARISON ─────────────────────────────────────────── */}
      <div className="px-5 py-16 sm:px-6 sm:py-24" style={{ background: redWash, color: "#fbf5ec" }}>
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow onDark>The gap, you vs the field</Eyebrow>
            <h2 className="max-w-4xl font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight">
              You are outworking brands many times your size, for a fraction of the return.
            </h2>
            <p className="mt-5 max-w-3xl text-base sm:text-lg" style={{ color: "#f4e4d6" }}>
              Same month, same effort level. This is not to discourage you, it is proof that the ceiling is enormous and
              the fix is a system, not more hours.
            </p>
            <div className="mt-11 flex flex-col gap-7">
              <CompareBar you name="Diyam" meta="281 followers, 39 posts" value="138" pct={2.5} note="Total monthly engagement" />
              <CompareBar name="OnnMe" meta="11.2K followers, 60 posts (a close peer)" value="20,100" pct={40} note="About 146x your engagement, using offers, trends, creators and better timing" />
              <CompareBar name="PSG Gold" meta="1.18M followers, 190 posts" value="59,900" pct={100} note="The mountain-top, where a fully-run engine reaches" />
            </div>
            <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-4 sm:gap-8">
              <StatBlock value="4.6" label="Diyam engagement / day" />
              <StatBlock value="670" label="OnnMe engagement / day" />
              <StatBlock value="1,997" label="PSG engagement / day" />
              <StatBlock value="789" label="OnnMe avg engagement / reel (yours ~4)" />
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── WHY / DIAGNOSIS ──────────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <Eyebrow>Why the gap exists</Eyebrow>
          <h2 className="font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight" style={{ color: RED }}>
            Six fixable reasons, every one is in your data.
          </h2>
          <GoldLine />
          <p className="max-w-3xl text-base leading-relaxed sm:text-lg" style={{ color: "#4a3b33" }}>
            None of these are about how good your jewellery is. They are about the machine around it.
          </p>
          <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { x: "Captions", h: "Every post says the same thing", p: "925 silver, available in stock, DM or visit store. No hook, no story, no desire, no reason to stop scrolling.", fix: "Hook-driven captions and storytelling" },
              { x: "Timing", h: "Posting at 11 AM", p: "Your own peak is Sunday; strong brands like OnnMe post 6 PM. You are publishing when your buyers are not watching.", fix: "Data-driven posting schedule" },
              { x: "No offers", h: "Nothing to act on", p: "Peers use codes and urgency. Diyam gives no reason to buy now, so no one does.", fix: "Offer and campaign calendar" },
              { x: "No WhatsApp", h: "DM for details leads nowhere", p: "No WhatsApp Business, no catalog, no fast reply. Every interested buyer hits a dead end.", fix: "WhatsApp catalog plus instant replies" },
              { x: "No reach engine", h: "Reels are not built to travel", p: "No hooks, trending audio, creators or shareable formats, so reels reach about 120 people, not 12,000.", fix: "Reel growth engine plus UGC" },
              { x: "No system", h: "Effort without a machine", p: "Posting by hand, no automations, no funnel, no follow-up, no data loop. Hard work leaks out everywhere.", fix: "The full growth engine below" },
            ].map((d) => (
              <div key={d.x} className="rounded-2xl bg-white p-6 shadow-[0_10px_30px_-18px_rgba(60,10,25,0.3)]" style={{ borderLeft: `4px solid ${RED}` }}>
                <div className="text-[13px] font-bold uppercase tracking-[0.08em]" style={{ color: RED }}>{d.x}</div>
                <h4 className="mt-1.5 font-display text-[17px] font-semibold" style={{ color: INK }}>{d.h}</h4>
                <p className="mt-2 text-[14.5px] leading-relaxed" style={{ color: MUTED }}>{d.p}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-semibold" style={{ color: "#0E7C57" }}>
                  <ArrowRight size={14} /> {d.fix}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* ── PULL QUOTE ───────────────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <div className="relative overflow-hidden rounded-[22px] px-6 py-12 text-center shadow-[0_20px_60px_-20px_rgba(60,10,25,0.5)] sm:rounded-[28px] sm:px-12 sm:py-16" style={{ background: redWash, color: "#fbf5ec" }}>
            <span className="pointer-events-none absolute left-4 top-1 font-display text-[100px] leading-none sm:left-6 sm:top-2 sm:text-[160px]" style={{ color: `${GOLD_SOFT}22` }}>&ldquo;</span>
            <q className="relative block font-display text-[clamp(1.3rem,3.8vw,2.35rem)] font-medium italic leading-snug">
              Diyam does not need to work harder. It needs the machine that finally pays back the work you are already doing.
            </q>
            <div className="mt-6 text-[13px] font-semibold uppercase tracking-[0.2em]" style={{ color: GOLD_SOFT }}>The entire pitch, in one line</div>
          </div>
        </Reveal>
      </Section>

      {/* ── THE ENGINE / SERVICES ────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <Eyebrow>Everything we build and run for you</Eyebrow>
          <h2 className="font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight" style={{ color: RED }}>
            The complete growth engine.
          </h2>
          <GoldLine />
          <p className="max-w-3xl text-base leading-relaxed sm:text-lg" style={{ color: "#4a3b33" }}>
            A full high-end marketing department for Diyam, built once, run every day. Wholesale and retail, online and
            in-store, content and commerce, silver and gold.
          </p>
        </Reveal>
        <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ENGINE.map((e, i) => (
            <Reveal key={e.h} delay={(i % 3) * 60} className="h-full">
              <div className="flex h-full flex-col rounded-2xl bg-white p-7 shadow-[0_12px_34px_-20px_rgba(60,10,25,0.32)] transition-transform duration-200 hover:-translate-y-1" style={{ borderTop: `4px solid ${RED}` }}>
                <e.icon size={24} style={{ color: RED }} />
                <h3 className="mt-3 font-display text-[19px] font-semibold" style={{ color: INK }}>{e.h}</h3>
                <p className="mt-1.5 text-[14.5px]" style={{ color: MUTED }}>{e.p}</p>
                <ul className="mt-3 space-y-1.5">
                  {e.li.map((x) => (
                    <li key={x} className="flex items-start gap-2 text-[14px]" style={{ color: "#4a3b33" }}>
                      <Check size={15} className="mt-1 flex-none" style={{ color: GOLD }} /> {x}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── AUTOMATION SUITE (red band) ──────────────────────────────────── */}
      <div className="px-5 py-16 sm:px-6 sm:py-24" style={{ background: redWash, color: "#fbf5ec" }}>
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow onDark>The automation suite, you click, it happens</Eyebrow>
            <h2 className="font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight">
              Every routine job, on autopilot.
            </h2>
            <p className="mt-5 max-w-3xl text-base sm:text-lg" style={{ color: "#f4e4d6" }}>
              The work that is impossible to do by hand, answered instantly, 24/7, in Kannada and English.
            </p>
          </Reveal>
          <div className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {AUTO.map((a, i) => (
              <Reveal key={a.b} delay={(i % 4) * 50} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border p-6 transition-transform duration-200 hover:-translate-y-1" style={{ background: "#2b0512", borderColor: `${GOLD_SOFT}30` }}>
                  <a.icon size={22} style={{ color: GOLD_SOFT }} />
                  <b className="mt-3 block text-[16px]" style={{ color: GOLD_SOFT }}>{a.b}</b>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed" style={{ color: "#e6d0c2" }}>{a.p}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-8 rounded-2xl p-6 sm:mt-9 sm:p-7" style={{ background: "#2b0512", borderLeft: `4px solid ${GOLD_SOFT}` }}>
              <p className="text-[14px] leading-relaxed sm:text-[15px]" style={{ color: "#f0ddc7" }}>
                <b style={{ color: GOLD_SOFT }}>52 automations across 21 groups are already built and import-ready</b>, lead
                capture, WhatsApp selling, AI content, festive engines, bridal drip, reviews, inventory, money, loyalty,
                AI sales intelligence, Kannada voice, Instagram-at-scale and the owner-intelligence layer. Diyam gets the
                whole library, configured to your channels.{" "}
                <Link href="/app/automations" className="inline-flex items-center gap-1 font-semibold underline underline-offset-2" style={{ color: GOLD_SOFT }}>
                  See all automations <ArrowRight size={13} />
                </Link>
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── 30-DAY SPRINT ────────────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <Eyebrow>The first 30 days, growth fast</Eyebrow>
          <h2 className="font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight" style={{ color: RED }}>
            One month to flip the machine on.
          </h2>
          <GoldLine />
          <p className="max-w-3xl text-base leading-relaxed sm:text-lg" style={{ color: "#4a3b33" }}>
            You asked for growth in the next month. Here is exactly how we spend it, foundation to first results in four weeks.
          </p>
          <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SPRINT.map((w) => (
              <div key={w.n} className="rounded-2xl bg-white p-6 shadow-[0_18px_50px_-26px_rgba(60,10,25,0.4)]" style={{ borderTop: `5px solid ${RED}` }}>
                <div className="text-[12px] font-bold uppercase tracking-[0.16em]" style={{ color: GOLD }}>{w.n}</div>
                <h4 className="mt-2 mb-3 font-display text-lg font-semibold" style={{ color: "#7a0b25" }}>{w.h}</h4>
                <ul className="space-y-1.5">
                  {w.li.map((x) => (
                    <li key={x} className="flex items-start gap-2 text-[13.5px]" style={{ color: MUTED }}>
                      <ArrowRight size={13} className="mt-1 flex-none" style={{ color: GOLD }} /> {x}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* ── SALES FLOW (red band) ────────────────────────────────────────── */}
      <BandSection>
        <Eyebrow onDark>From followers to sales</Eyebrow>
        <h2 className="font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight">
          Reach is nice. We are here for revenue.
        </h2>
        <p className="mt-5 max-w-3xl text-base sm:text-lg" style={{ color: "#f4e4d6" }}>
          Every part of the engine points at one thing, money in the till, retail and wholesale. Here is the path a
          single reel now takes:
        </p>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { n: "01", b: "Reel reaches thousands", s: "hook plus timing plus audio" },
            { n: "02", b: "Comment / DM", s: "auto-answered instantly" },
            { n: "03", b: "WhatsApp catalog", s: "price, purity, stock" },
            { n: "04", b: "Order or store visit", s: "retail sale, wholesale enquiry" },
            { n: "05", b: "Review plus repeat", s: "referral and occasion nurture" },
          ].map((node) => (
            <div key={node.n} className="rounded-2xl border p-5 text-center" style={{ background: "#2b0512", borderColor: `${GOLD_SOFT}2e` }}>
              <div className="font-display text-[15px] font-bold" style={{ color: GOLD_SOFT }}>{node.n}</div>
              <b className="mt-2 block text-[15px]" style={{ color: "#fbf5ec" }}>{node.b}</b>
              <span className="mt-1 block text-[12.5px]" style={{ color: "#e6d0c2" }}>{node.s}</span>
            </div>
          ))}
        </div>
        <p className="mt-10 max-w-3xl text-base sm:text-lg" style={{ color: "#f4e4d6" }}>
          Silver&apos;s advantage: lower ticket, high gifting and impulse, festive-driven for Rakhi, Diwali and weddings,
          and endlessly repeatable, while gold anchors the high-value sales. That means <b style={{ color: GOLD_SOFT }}>volume
          and value together</b>, the perfect pairing for a content-and-WhatsApp engine to compound quickly.
        </p>
      </BandSection>

      {/* ── TARGETS ──────────────────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <Eyebrow>The growth we build toward</Eyebrow>
          <h2 className="font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight" style={{ color: RED }}>
            From 281 followers to a real audience.
          </h2>
          <GoldLine />
          <p className="max-w-3xl text-base leading-relaxed sm:text-lg" style={{ color: "#4a3b33" }}>
            Honest, directional targets, the same craft, finally seen. We report the real curve every week.
          </p>
          <div className="mt-11 grid gap-6 sm:grid-cols-3">
            {[
              { h: "30 days", n: "1,500+", c: "followers, reels crossing thousands, live WhatsApp enquiries", mid: false },
              { h: "90 days", n: "8,000+", c: "a real content brand, steady sales from Instagram plus WhatsApp", mid: true },
              { h: "12 months", n: "50K+", c: "a recognised Bangalore silver and gold name, retail and wholesale", mid: false },
            ].map((g) => (
              <div key={g.h} className={cn("rounded-3xl bg-white p-7 text-center shadow-[0_18px_50px_-24px_rgba(0,0,0,0.4)] sm:p-8", g.mid && "sm:scale-[1.05]")} style={{ borderTop: `5px solid ${g.mid ? RED : GOLD}` }}>
                <h4 className="text-[13px] font-bold uppercase tracking-[0.14em]" style={{ color: MUTED }}>{g.h}</h4>
                <div className="my-3 font-display text-[2.75rem] font-semibold leading-none sm:text-5xl" style={{ color: g.mid ? RED : "#7a0b25" }}>{g.n}</div>
                <div className="text-[15px]" style={{ color: MUTED }}>{g.c}</div>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm italic" style={{ color: MUTED }}>
            Targets, not guarantees. Your reels already outperform 4-to-1 and reach is up 40 percent, the momentum is
            real; we are organising it into a system.
          </p>
        </Reveal>
      </Section>

      {/* ── THE PLAYBOOK / CONTENT + REPORTS ─────────────────────────────── */}
      <Section>
        <Reveal>
          <Eyebrow>Everything, written down</Eyebrow>
          <h2 className="font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight" style={{ color: RED }}>
            The full playbook and every report.
          </h2>
          <GoldLine />
          <p className="max-w-3xl text-base leading-relaxed sm:text-lg" style={{ color: "#4a3b33" }}>
            The complete 30-day content machine, the day-by-day calendar, and every Instagram report and competitor
            comparison deck, reproduced in full, exactly as prepared, down to the last graph.
          </p>
        </Reveal>
        <div className="mt-9 grid gap-5 sm:grid-cols-3">
          {[
            { icon: BarChart3, name: "Content Library", desc: "Positioning, Instagram features, PR plan and the caption, hook and hashtag bank, in full.", href: "/app/diyam/content" },
            { icon: CalendarDays, name: "30-Day Content Calendar", desc: "Every day mapped, hook to CTA, building to Raksha Bandhan on 28 August.", href: "/app/diyam/calendar" },
            { icon: TrendingUp, name: "Reports & Decks", desc: "Diyam's own analytics plus head-to-heads vs OnnMe, PSG Gold, Tiffany, SILVANA and more.", href: "/app/diyam/reports" },
          ].map((t, i) => (
            <Reveal key={t.name} delay={i * 60} className="h-full">
              <Link href={t.href} className="group flex h-full flex-col rounded-2xl bg-white p-7 shadow-[0_12px_34px_-20px_rgba(60,10,25,0.32)] transition-transform duration-200 hover:-translate-y-1" style={{ borderTop: `4px solid ${GOLD}` }}>
                <t.icon size={24} style={{ color: RED }} />
                <h3 className="mt-3 font-display text-[19px] font-semibold" style={{ color: INK }}>{t.name}</h3>
                <p className="mt-1.5 flex-1 text-[14.5px]" style={{ color: MUTED }}>{t.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: GOLD }}>
                  Open <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <StudioReferences />

      {/* ── PROOF / TOOLS (red band) ─────────────────────────────────────── */}
      <div className="px-5 py-16 sm:px-6 sm:py-24" style={{ background: redWash, color: "#fbf5ec" }}>
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow onDark>The unfair advantage</Eyebrow>
            <h2 className="max-w-4xl font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight">
              Most agencies show slides. We hand you working software.
            </h2>
            <p className="mt-5 max-w-3xl text-base sm:text-lg" style={{ color: "#f4e4d6" }}>
              Eight white-label tools and 52 automations are already built, configured for Diyam. Click any tool to open
              the real thing, running inside your OS.
            </p>
          </Reveal>
          <div className="mt-11 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {TOOLS.map((t, i) => (
              <Reveal key={t.name} delay={(i % 4) * 60} className="h-full">
                <Link href={t.href} className="group flex h-full flex-col rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-1" style={{ background: "#2b0512", borderColor: `${GOLD_SOFT}30` }}>
                  <t.icon size={24} style={{ color: GOLD_SOFT }} />
                  <b className="mt-3 block text-[16px] sm:text-[17px]" style={{ color: GOLD_SOFT }}>{t.name}</b>
                  <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: "#e6d0c2" }}>{t.desc}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-4 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: GOLD }}>
                    Open tool <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-8 rounded-2xl p-6 sm:mt-9 sm:p-7" style={{ background: "#2b0512", borderLeft: `4px solid ${GOLD_SOFT}` }}>
              <p className="text-[14px] leading-relaxed sm:text-[15px]" style={{ color: "#f0ddc7" }}>
                All eight tools are white-label, brand name, colours and WhatsApp number configure to Diyam in seconds.{" "}
                <Link href="/app/home" className="inline-flex items-center gap-1 font-semibold underline underline-offset-2" style={{ color: GOLD_SOFT }}>
                  Open your command center <ArrowRight size={13} />
                </Link>
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── ENGAGEMENT ───────────────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <div className="rounded-[22px] px-6 py-12 shadow-[0_20px_60px_-20px_rgba(60,10,25,0.5)] sm:rounded-[28px] sm:px-12 sm:py-14" style={{ background: redWash, color: "#fbf5ec" }}>
            <Eyebrow onDark>How we work together</Eyebrow>
            <h2 className="font-display text-[clamp(1.45rem,4vw,2.6rem)] font-semibold tracking-tight">Full build, then we run it with you.</h2>
            <div className="mt-9 grid gap-6 sm:grid-cols-2">
              {[
                { n: "Phase 1 - Build", h: "We build your entire engine", p: "WhatsApp, content system, automations, website, Google and workspace, software integration, dashboard, set up, connected and switched on in the first 30 days." },
                { n: "Phase 2 - Grow", h: "We run and grow it every month", p: "Ospyr creates the content, runs the reels and ad engines, manages every page and channel, and reports the numbers, your full marketing department, on retainer." },
              ].map((ph) => (
                <div key={ph.n} className="rounded-2xl p-6 sm:p-7" style={{ background: "rgba(255,255,255,0.07)", border: `1px solid ${GOLD_SOFT}40` }}>
                  <div className="text-[12px] font-bold uppercase tracking-[0.16em]" style={{ color: GOLD_SOFT }}>{ph.n}</div>
                  <h4 className="mt-2 mb-2 font-display text-xl font-semibold">{ph.h}</h4>
                  <p className="text-[15px]" style={{ color: "#f0ddc7" }}>{ph.p}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <div className="text-center">
            <Eyebrow>The invitation</Eyebrow>
            <h2 className="mx-auto max-w-3xl font-display text-[clamp(1.65rem,5.4vw,3.2rem)] font-semibold leading-[1.12] tracking-tight" style={{ color: "#7a0b25" }}>
              The silver is pure, the gold is true, the story is real. Let&apos;s make Bangalore see it.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg" style={{ color: "#4a3b33" }}>
              You have already done the hard part for a year. Give us one month to show you what happens when the whole
              engine turns on.
            </p>
            <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link href="/app/home" className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-[15px] font-semibold shadow-[0_16px_40px_-12px_rgba(198,162,78,0.55)] transition-transform hover:-translate-y-0.5 sm:text-[16px]" style={{ background: `linear-gradient(90deg, #9a6212, ${GOLD_SOFT})`, color: INK }}>
                Open your command center <ArrowRight size={17} />
              </Link>
              <Link href="/app/automations" className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-[15px] font-semibold transition-colors" style={{ border: `1.5px solid ${RED}`, color: RED }}>
                <Workflow size={16} /> See the automations
              </Link>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="px-6 py-12 text-center" style={{ background: INK, color: "#cbbcae" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/diyam-logo.png" alt="Diyam House of Silver logo" className="mx-auto mb-6 h-16 w-auto rounded-xl opacity-95 shadow-lg" />
        <div className="font-display text-xl font-semibold tracking-[0.2em]" style={{ color: GOLD_SOFT }}>OSPYR</div>
        <p className="mt-3 text-[13px]">The team behind the jeweller. &middot; Prepared for Diyam House of Silver, Jayanagar, Bengaluru.</p>
      </footer>
    </div>
  );
}
