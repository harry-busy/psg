"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ArrowRight, ChevronDown, Check, ArrowUpRight, ArrowDownRight,
  Instagram, ExternalLink,
} from "lucide-react";

/*
 * Padmavathi Jewellery Mart × Ospyr — Growth Blueprint
 * UI: Apple Business + ospyr.com — minimal, editorial, luxury.
 * Red only as accent. Cream / white / black surfaces. No visual noise.
 * Data: as per our research 02 Jul – 31 Jul 2026.
 */

/* ── palette ─────────────────────────────────────────────────────────────── */
const RED = "#D2042D";
const BLACK = "#1d1d1f";
const GRAY = "#86868b";
const GRAY_LIGHT = "#6e6e73";
const HAIRLINE = "#d2d2d7";
const CREAM = "#f5f5f7"; /* Apple light canvas */
const WHITE = "#ffffff";
const SURFACE = "#fbfbfd";

/* ── motion ──────────────────────────────────────────────────────────────── */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
        seen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

function CountUp({ value, decimals = 0, suffix = "" }: { value: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      let start: number | null = null;
      const step = (t: number) => {
        if (start === null) start = t;
        const p = Math.min((t - start) / 1400, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setN(value * eased);
        if (p < 1) requestAnimationFrame(step);
        else setN(value);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  const text = decimals > 0 ? n.toFixed(decimals) : Math.round(n).toLocaleString("en-IN");
  return <span ref={ref}>{text}{suffix}</span>;
}

/* ── layout atoms ────────────────────────────────────────────────────────── */
function Shell({ children, dark = false, cream = false }: { children: React.ReactNode; dark?: boolean; cream?: boolean }) {
  const bg = dark ? BLACK : cream ? CREAM : WHITE;
  const color = dark ? "#f5f5f7" : BLACK;
  return (
    <section className="px-6 py-20 sm:px-10 sm:py-28 lg:px-12 lg:py-32" style={{ background: bg, color }}>
      <div className="mx-auto max-w-[980px]">{children}</div>
    </section>
  );
}

function Label({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p className="mb-4 text-[12px] font-normal tracking-wide" style={{ color: dark ? "#a1a1a6" : GRAY }}>
      {children}
    </p>
  );
}

function H2({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <h2
      className="font-display text-[clamp(1.75rem,4.2vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em]"
      style={{ color: dark ? "#f5f5f7" : BLACK }}
    >
      {children}
    </h2>
  );
}

function Lead({ children, dark = false, className = "" }: { children: React.ReactNode; dark?: boolean; className?: string }) {
  return (
    <p className={cn("mt-5 max-w-[640px] text-[17px] font-normal leading-[1.55] sm:text-[19px]", className)} style={{ color: dark ? "#a1a1a6" : GRAY_LIGHT }}>
      {children}
    </p>
  );
}

function Rule({ dark = false }: { dark?: boolean }) {
  return <div className="my-8 h-px w-full max-w-[40px]" style={{ background: dark ? "rgba(255,255,255,0.2)" : HAIRLINE }} />;
}

function TextLink({ href, children, external = false }: { href: string; children: React.ReactNode; external?: boolean }) {
  const cls = "inline-flex items-center gap-1 text-[15px] font-normal transition-opacity hover:opacity-70";
  const style = { color: RED };
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>
        {children} <ExternalLink size={13} strokeWidth={1.75} />
      </a>
    );
  }
  return (
    <Link href={href} className={cls} style={style}>
      {children} <ArrowRight size={14} strokeWidth={1.75} />
    </Link>
  );
}

/* ── data ────────────────────────────────────────────────────────────────── */
const METRICS = [
  { v: "16", l: "Posts in July", d: "11.11% lower", up: false },
  { v: "56", l: "Total engagement", d: "73.83% lower", up: false },
  { v: "3.5", l: "Avg engagement / post", d: "70.56% lower", up: false },
  { v: "1.9", l: "Avg engagement / day", d: "73.83% lower", up: false },
  { v: "0.62%", l: "Eng. rate by followers", d: "Beats CaratLane & PSG", up: true },
  { v: "247.6", l: "Avg reach / post", d: "96.33% lower", up: false },
  { v: "281.6", l: "Avg views / post", d: "97.01% lower", up: false },
  { v: "1.6%", l: "Eng. rate by reach", d: "10.62% higher", up: true },
  { v: "1.2%", l: "Eng. rate by views", d: "11.7% higher", up: true },
  { v: "−5", l: "Follower growth", d: "Growth % −0.9", up: false },
  { v: "8.5", l: "Avg engagement / reel", d: "60.77% lower", up: false },
  { v: "3s", l: "Avg reel length", d: "CaratLane 29s · PSG 7s", up: false },
];

const TOP = [
  { date: "20 Jul", type: "Reel", title: "Sacred silver · Deepa elegance", er: "2.31%", views: "246", likes: "13", reach: "153" },
  { date: "13 Jul", type: "Image", title: "Tradition for every ritual", er: "1.07%", views: "605", likes: "6", reach: "550" },
  { date: "02 Jul", type: "Image", title: "Silver that shines with tradition", er: "0.89%", views: "504", likes: "5", reach: "458" },
  { date: "27 Jul", type: "Image", title: "Prosperity, tradition, divine grace", er: "0.71%", views: "403", likes: "4", reach: "367" },
  { date: "29 Jul", type: "Image", title: "Guru Purnima greeting", er: "0.36%", views: "202", likes: "2", reach: "183" },
  { date: "20 Jul", type: "Reel", title: "Purity, tradition, divine elegance", er: "0.71%", views: "227", likes: "4", reach: "141" },
];

const COMPARE = [
  { m: "Followers", p: "563", c: "1.7M", s: "1.2M" },
  { m: "Followers growth", p: "−5", c: "+18.4K", s: "−865" },
  { m: "Posts (period)", p: "16", c: "26", s: "237" },
  { m: "Avg posts / day", p: "0.53", c: "0.87", s: "7.9" },
  { m: "Total engagement", p: "56", c: "28.8K", s: "66.6K" },
  { m: "Eng. rate by followers", p: "0.62%", c: "0.07%", s: "0.02%" },
  { m: "Avg eng. / post", p: "3.5", c: "1,109", s: "280.85" },
  { m: "Avg reach / post", p: "247.56", c: "775.6K", s: "23.0K" },
  { m: "Avg views / post", p: "281.56", c: "1.2M", s: "36.4K" },
  { m: "Avg reel length", p: "3s", c: "29s", s: "7s" },
];

const DIAGNOSIS = [
  { t: "Reel length", h: "Three-second reels", p: "Compare decks show 3s average. CaratLane averages 29s. Hooks never get room." },
  { t: "Content mix", h: "Eighty-eight percent still images", p: "14 of 16 July posts were images. Reels travel further; they are underused." },
  { t: "Conversation", h: "Zero comments all month", p: "56 total engagements, no comments. Admiration without dialogue." },
  { t: "Offers", h: "Nothing to act on", p: "Beautiful product, no booking incentive. Interest ends at the post." },
  { t: "Local search", h: "Ratings unused as growth", p: "4.9★ Justdial and 4.0★ Google exist. Volume does not yet." },
  { t: "System", h: "Effort without a machine", p: "Posting by hand. Domain planned. No automation loop yet." },
];

const ENGINE = [
  { h: "Digital flagship", p: "padmavathijewellerymart.com — domain available, planned launch.", items: ["Catalog with live gold & silver rate", "WhatsApp booking", "Mobile-first storefront"] },
  { h: "Social media", p: "@padmavathi_jewellery_mart managed as one brand.", items: ["Instagram, Facebook, Threads, Shorts", "Calendar & community", "Profile built to convert"] },
  { h: "Content & reels", p: "Fix the image-heavy, short-reel problem.", items: ["4–5 reels weekly, 15–30s", "Bridal, temple, daily wear, pooja", "Hook-first storytelling"] },
  { h: "AI studio", p: "Endless assets from a single photo.", items: ["Studio-grade stills", "360° showcase video", "On-model without shoots"] },
  { h: "Heritage story", p: "Trust, turned into content.", items: ["Founder film", "Craft series", "Customer voices"] },
  { h: "WhatsApp commerce", p: "The channel that closes.", items: ["Business catalog", "Instant price & purity", "Click-to-chat on every post"] },
  { h: "Local & search", p: "Own Srinivasanagara and Hanumantha Nagar.", items: ["Google Business growth", "Justdial scaled", "Review engine after every sale"] },
  { h: "Wholesale + retail", p: "Two motions. One brand.", items: ["Retail content & offers", "B2B catalog & rates", "Separate funnels"] },
  { h: "Workspace & ops", p: "The back office, organised.", items: ["Google Workspace", "Lead sheets & alerts", "One source of truth"] },
  { h: "Software link", p: "Connect what you already run.", items: ["Billing & inventory sync", "CRM sales data", "No double entry"] },
  { h: "CRM & loyalty", p: "Never lose a customer again.", items: ["Every enquiry logged", "Festival reminders", "Gold savings scheme"] },
  { h: "Owner dashboard", p: "One screen. Every morning.", items: ["Reach, sales, reviews", "8 AM digest", "Weekly scorecard"] },
];

const AUTO = [
  "WhatsApp auto-reply", "Instagram auto-DM", "Comment → DM", "SMS automations",
  "Kannada voice agent", "Photo → branded still", "Photo → showcase reel", "Design → all channels",
  "Festive broadcasts", "Review requests", "AI lead scoring", "Daily owner digest",
];

const SPRINT = [
  { w: "Week 1", h: "Foundation", items: ["Domain setup: padmavathijewellerymart.com", "WhatsApp Business + catalog", "Profile & highlights", "Google + Justdial", "First shoot"] },
  { w: "Week 2", h: "Content", items: ["Reels engine live", "AI image & video on", "Auto-DM live", "Reviews engine", "Heritage shoot"] },
  { w: "Week 3", h: "Reach", items: ["Website launch", "First offer campaign", "Local creators", "Ads on", "B2B list"] },
  { w: "Week 4", h: "Proof", items: ["Festive push", "Enquiries to sales", "Dashboard + digest", "Reviews climbing", "Report vs July baseline"] },
];

const TOOLS = [
  { name: "Studio Photo", href: "/app/studio", d: "Phone photo to studio still." },
  { name: "Product Card", href: "/app/cards", d: "Details to branded card." },
  { name: "Gold Estimator", href: "/app/calculator", d: "Weight, karat, quote." },
  { name: "Enquiry CRM", href: "/app/crm", d: "Track every lead." },
  { name: "Festive Calendar", href: "/app/calendar", d: "Campaigns by date." },
  { name: "Review QR", href: "/app/reviews", d: "Happy buyers to stars." },
  { name: "Savings Scheme", href: "/app/scheme", d: "Customer calculator." },
  { name: "Owner Dashboard", href: "/app/dashboard", d: "The whole shop." },
];

export default function PadmavathiBlueprint() {
  return (
    <div className="-mx-4 -my-6 sm:-mx-8 lg:-ml-10 lg:-mr-8" style={{ background: WHITE, color: BLACK, fontFeatureSettings: '"kern", "liga"' }}>

      {/* ── HERO — full cherry red hook ─────────────────────────────────── */}
      <header
        className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 py-28 text-center sm:px-10"
        style={{ background: "linear-gradient(165deg, #E81A42 0%, #D2042D 38%, #93001C 72%, #5c0012 100%)" }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(255,255,255,0.14) 0%, transparent 55%)" }}
        />
        <div className="relative z-10 mx-auto max-w-[820px]">
          <p className="mb-8 text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: "rgba(255,255,255,0.78)" }}>
            Padmavathi Jewellery Mart · Srinivasanagara / Hanumantha Nagar
          </p>
          <h1 className="font-display text-[clamp(2.4rem,7vw,4.5rem)] font-semibold leading-[1.07] tracking-[-0.03em]" style={{ color: "#ffffff" }}>
            You have done the work.<br />
            <span className="italic" style={{ color: "#fff", borderBottom: "2px solid rgba(255,255,255,0.35)", paddingBottom: 2 }}>
              Now let Bangalore see it.
            </span>
          </h1>
          <p className="mx-auto mt-7 max-w-[540px] text-[17px] leading-[1.55] sm:text-[19px]" style={{ color: "rgba(255,245,246,0.9)" }}>
            563 followers. 16 posts in July. 397 on the profile.
            Real gold and silver. The only missing piece is the system.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a
              href="https://wa.me/9036648030"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-[15px] font-semibold shadow-[0_12px_40px_rgba(0,0,0,0.2)] transition-transform hover:-translate-y-0.5"
              style={{ background: "#ffffff", color: RED }}
            >
              WhatsApp us
            </a>
            <Link
              href="/app/home"
              className="inline-flex items-center justify-center rounded-full border-[1.5px] px-7 py-3.5 text-[15px] font-medium transition-colors hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.55)", color: "#ffffff" }}
            >
              Enter workspace
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {[
              { href: "https://www.instagram.com/padmavathi_jewellery_mart/", label: "@padmavathi_jewellery_mart" },
              { href: "tel:+919036648030", label: "90366 48030" },
              { href: "tel:+919611380935", label: "96113 80935" },
            ].map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="inline-flex rounded-full border px-3.5 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-white/15"
                style={{ borderColor: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.08)" }}
              >
                {c.label}
              </a>
            ))}
          </div>
          <p className="mt-12 text-[12px]" style={{ color: "rgba(255,255,255,0.55)" }}>
            Domain available · padmavathijewellerymart.com · planned flagship
          </p>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-50" style={{ color: "#ffffff" }}>
          <ChevronDown size={18} strokeWidth={1.5} />
        </div>
      </header>

      {/* ── PART 1: COMPLETE WEBSITE & BUSINESS STACK (first) ─────────────── */}
      <Shell>
        <Reveal>
          <Label>Part 1 · Complete website &amp; business stack</Label>
          <H2>Complete website.<br />Complete business system.</H2>
          <Lead>
            First — everything that ships: e‑commerce, admin, catalogue, AI, automations, payments, ERP, and more.
            One partner. End to end. Configured for <b style={{ color: BLACK }}>Padmavathi Jewellery Mart</b>.
          </Lead>
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl sm:grid-cols-2 lg:grid-cols-3" style={{ background: HAIRLINE }}>
          {[
            { tag: "Website", h: "Complete e‑commerce website", p: "Full storefront on your domain — product browse, cart, checkout-ready for gold & silver, mobile-first for Bengaluru buyers." },
            { tag: "Admin", h: "Owner admin dashboard", p: "One control panel: orders, enquiries, content status, sales snapshot, and day-to-day ops." },
            { tag: "Catalogue", h: "Products page & catalogue", p: "Structured product pages with purity, weight, making, photos — for web, WhatsApp, and Meta / Instagram catalogues." },
            { tag: "AI creative", h: "AI image enhancement tools", p: "Phone photos to studio-grade stills, clean backgrounds, catalogue-ready visuals without a full reshoot every time." },
            { tag: "Automations", h: "WhatsApp · Email · Instagram", p: "Auto-replies, lead capture, follow-ups, and campaigns across WhatsApp, professional email, and Instagram DMs." },
            { tag: "Trust", h: "Auto reviews", p: "After every happy sale, automatic review requests — grow Justdial and Google without manual chasing." },
            { tag: "Workspace", h: "Google Workspace management", p: "Business Google accounts, Drive, shared sheets, calendars — not scattered across personal Gmail." },
            { tag: "Meta", h: "Meta Business Suite management", p: "Facebook + Instagram assets, ad structure, pixels, and Suite workflows managed cleanly." },
            { tag: "Email", h: "Professional business email", p: "Branded addresses on your domain — client trust, not free consumer mail." },
            { tag: "Domain", h: "International domain", p: "padmavathijewellerymart.com — available & planned: registration, DNS, SSL, live flagship setup." },
            { tag: "AI bots", h: "WhatsApp · Meta · Instagram bots", p: "AI assistants for purity, price, stock, and catalogue — 24/7 on WhatsApp, Messenger, and Instagram." },
            { tag: "Catalogue sync", h: "WhatsApp & Instagram catalogue", p: "Product catalogue where customers already message — browse, enquire, convert in chat." },
            { tag: "Stock", h: "Inventory management", p: "Tray, reserved, sold — designs and weights tracked so sales and website stay aligned." },
            { tag: "ERP", h: "ERP system", p: "Orders, purchases, stock, and customers in one layer — less double entry, clearer owner view." },
            { tag: "Loyalty", h: "Loyalty page & programme", p: "Customer-facing loyalty and savings scheme — return for festivals, weddings, reorders." },
            { tag: "Payments", h: "Razorpay & PayPal integration", p: "Secure online payments for deposits, schemes, and e‑commerce — India with Razorpay, global with PayPal." },
          ].map((x) => (
            <div key={x.h} className="p-7" style={{ background: WHITE }}>
              <div className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: RED }}>{x.tag}</div>
              <h3 className="mt-2 text-[16px] font-semibold tracking-[-0.01em]" style={{ color: BLACK }}>{x.h}</h3>
              <p className="mt-2 text-[13px] leading-[1.55]" style={{ color: GRAY_LIGHT }}>{x.p}</p>
            </div>
          ))}
        </div>
        <Reveal>
          <div className="mt-8 rounded-2xl px-6 py-5 text-[14px] leading-[1.55]" style={{ background: BLACK, color: "#a1a1a6" }}>
            <b style={{ color: "#f5f5f7" }}>Page order:</b>{" "}
            <b style={{ color: "#f5f5f7" }}>Part 1</b> — complete website &amp; business stack (this section).
            Scroll for <b style={{ color: "#f5f5f7" }}>Part 2</b> — complete social media analytics and growth plan, as per our research.
          </div>
        </Reveal>
      </Shell>

      {/* ── LEGACY ───────────────────────────────────────────────────────── */}
      <Shell cream>
        <Reveal>
          <Label>The house</Label>
          <H2>Built on purity.<br />Gold and silver, honestly crafted.</H2>
          <Rule />
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-[17px] leading-[1.65] sm:text-[18px]" style={{ color: GRAY_LIGHT }}>
                Padmavathi Jewellery Mart sits at 237, SBM Colony / Kumaraswamy Temple Road,
                Banashankari 1st Stage — Srinivasanagara and Hanumantha Nagar, Bengaluru.
                Bridal, temple, daily wear, custom, and silver pooja. Families return for a reason.
              </p>
              <p className="mt-5 text-[17px] leading-[1.65] sm:text-[18px]" style={{ color: GRAY_LIGHT }}>
                That story is the marketing asset. Most of South Bengaluru has simply never heard it online.
              </p>
            </div>
            <div className="space-y-0 divide-y" style={{ borderColor: HAIRLINE }}>
              {[
                ["Hours", "Daily 9:30 AM – 9:30 PM"],
                ["Justdial", "4.9★ · 14 reviews · 42 photos"],
                ["Google", "4.0★"],
                ["Instagram", "@padmavathi_jewellery_mart"],
                ["Domain", "padmavathijewellerymart.com · available · planned"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 py-4 first:pt-0">
                  <span className="text-[14px]" style={{ color: GRAY }}>{k}</span>
                  <span className="text-right text-[14px] font-medium" style={{ color: BLACK }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Shell>

      {/* ── PART 2: COMPLETE SOCIAL MEDIA ANALYTICS ──────────────────────── */}
      <Shell>
        <Reveal>
          <Label>Part 2 · Complete social media analytics</Label>
          <H2>Your Instagram today.<br />Complete analytics.</H2>
          <Lead>
            After the full website stack above — the honest picture of @padmavathi_jewellery_mart for 02 Jul – 31 Jul 2026, as per our research. Every figure below is about to change.
          </Lead>
        </Reveal>
        <Reveal>
          <p className="mt-10 text-[13px] font-medium" style={{ color: GRAY }}>Where you stand · July 2026</p>
          <H2>Consistent effort. Almost no reward, yet.</H2>
        </Reveal>
        <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-4">
          {[
            { n: <CountUp value={563} />, l: "Followers", s: "−5 in July" },
            { n: <CountUp value={16} />, l: "Posts in July", s: "14 images · 2 reels" },
            { n: <CountUp value={397} />, l: "Total posts", s: "Profile lifetime" },
            { n: <CountUp value={56} />, l: "Engagement", s: "−73.83%" },
            { n: <><CountUp value={0.62} decimals={2} />%</>, l: "Follower ER", s: "Beats peers" },
            { n: <CountUp value={3961} />, l: "Organic reach", s: "247.6 avg / post" },
            { n: <CountUp value={4505} />, l: "Organic views", s: "281.6 avg / post" },
            { n: "4.9★", l: "Justdial", s: "Google 4.0★" },
          ].map((x) => (
            <Reveal key={x.l}>
              <div className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-[-0.03em] tabular-nums" style={{ color: BLACK }}>
                {x.n}
              </div>
              <div className="mt-2 text-[13px] font-medium" style={{ color: BLACK }}>{x.l}</div>
              <div className="mt-0.5 text-[12px]" style={{ color: GRAY }}>{x.s}</div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mt-14 max-w-[640px] text-[15px] leading-[1.6]" style={{ color: GRAY_LIGHT }}>
            Your 0.62% follower engagement rate beats CaratLane (0.07%) and PSG Gold (0.02%).
            July: 56 likes, 0 comments, 473 video views. Trust is present. Scale is not.
          </p>
        </Reveal>
      </Shell>

      {/* ── FULL METRICS ─────────────────────────────────────────────────── */}
      <Shell cream>
        <Reveal>
          <Label>Complete Instagram analytics · full detail</Label>
          <H2>Every number — as per our research.</H2>
          <Lead>Own report plus Posts report. Comparison period: 2 Jun – 1 Jul 2026.</Lead>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl sm:grid-cols-2 lg:grid-cols-3" style={{ background: HAIRLINE }}>
          {METRICS.map((m) => (
            <div key={m.l} className="px-6 py-6" style={{ background: WHITE }}>
              <div className="font-display text-[28px] font-semibold tracking-[-0.02em] tabular-nums" style={{ color: BLACK }}>{m.v}</div>
              <div className="mt-1 text-[14px]" style={{ color: BLACK }}>{m.l}</div>
              <div className="mt-2 flex items-center gap-1 text-[12px]" style={{ color: m.up ? "#1d6b3a" : GRAY }}>
                {m.up ? <ArrowUpRight size={12} strokeWidth={1.75} /> : <ArrowDownRight size={12} strokeWidth={1.75} />}
                {m.d}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-10 sm:grid-cols-2">
          <Reveal>
            <p className="text-[13px] font-medium" style={{ color: GRAY }}>Content mix</p>
            <p className="mt-2 text-[21px] font-semibold tracking-[-0.02em]" style={{ color: BLACK }}>88% images. 12% reels.</p>
            <p className="mt-2 text-[15px] leading-[1.55]" style={{ color: GRAY_LIGHT }}>
              Image accounted for 70% of engagement. Reels are the lever still unused.
            </p>
            <div className="mt-6 space-y-4">
              {[
                { l: "Image · 14 posts", p: 88 },
                { l: "Reel · 2 posts", p: 12 },
              ].map((r) => (
                <div key={r.l}>
                  <div className="mb-1.5 flex justify-between text-[13px]">
                    <span style={{ color: BLACK }}>{r.l}</span>
                    <span style={{ color: GRAY }}>{r.p}%</span>
                  </div>
                  <div className="h-[3px] w-full rounded-full" style={{ background: CREAM }}>
                    <div className="h-full rounded-full" style={{ width: `${r.p}%`, background: BLACK }} />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <p className="text-[13px] font-medium" style={{ color: GRAY }}>Reel length</p>
            <p className="mt-2 text-[21px] font-semibold tracking-[-0.02em]" style={{ color: BLACK }}>3s vs 29s.</p>
            <p className="mt-2 text-[15px] leading-[1.55]" style={{ color: GRAY_LIGHT }}>
              Compare decks: Padmavathi 3s · CaratLane 29s · PSG Gold 7s. Target: 15–30s with a story.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                ["3s", "You"],
                ["29s", "CaratLane"],
                ["7s", "PSG Gold"],
                ["15–30s", "Target"],
              ].map(([a, b]) => (
                <div key={b} className="rounded-xl px-4 py-3" style={{ background: CREAM }}>
                  <div className="font-display text-[22px] font-semibold tracking-tight" style={{ color: BLACK }}>{a}</div>
                  <div className="mt-0.5 text-[12px]" style={{ color: GRAY }}>{b}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Shell>

      {/* ── TOP POSTS ────────────────────────────────────────────────────── */}
      <Shell cream>
        <Reveal>
          <Label>Top content · Posts report</Label>
          <H2>What worked in July.</H2>
        </Reveal>
        <div className="mt-12 divide-y" style={{ borderColor: HAIRLINE }}>
          {TOP.map((p) => (
            <Reveal key={p.date + p.title}>
              <div className="grid gap-3 py-6 sm:grid-cols-[100px_1fr_auto] sm:items-center sm:gap-8">
                <div>
                  <div className="text-[13px] font-medium" style={{ color: BLACK }}>{p.date}</div>
                  <div className="text-[12px]" style={{ color: GRAY }}>{p.type}</div>
                </div>
                <div className="text-[16px] font-medium leading-snug" style={{ color: BLACK }}>{p.title}</div>
                <div className="flex gap-5 text-[13px] tabular-nums" style={{ color: GRAY }}>
                  <span><b style={{ color: BLACK }}>{p.er}</b> ER</span>
                  <span><b style={{ color: BLACK }}>{p.views}</b> views</span>
                  <span><b style={{ color: BLACK }}>{p.likes}</b> likes</span>
                  <span><b style={{ color: BLACK }}>{p.reach}</b> reach</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-[12px]" style={{ color: GRAY }}>As per our research · 16 posts · 0 comments in period</p>
      </Shell>

      {/* ── HEAD TO HEAD ─────────────────────────────────────────────────── */}
      <Shell>
        <Reveal>
          <Label>Head to head</Label>
          <H2>Padmavathi vs CaratLane vs PSG Gold.</H2>
          <Lead>Same thirty days. Efficiency is yours. Scale is theirs.</Lead>
        </Reveal>
        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left">
            <thead>
              <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                <th className="pb-4 pr-4 text-[12px] font-normal" style={{ color: GRAY }}>Metric</th>
                <th className="pb-4 pr-4 text-[12px] font-medium" style={{ color: BLACK }}>Padmavathi</th>
                <th className="pb-4 pr-4 text-[12px] font-normal" style={{ color: GRAY }}>CaratLane</th>
                <th className="pb-4 text-[12px] font-normal" style={{ color: GRAY }}>PSG Gold</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((r) => (
                <tr key={r.m} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                  <td className="py-3.5 pr-4 text-[14px]" style={{ color: GRAY_LIGHT }}>{r.m}</td>
                  <td className="py-3.5 pr-4 text-[14px] font-semibold tabular-nums" style={{ color: BLACK }}>{r.p}</td>
                  <td className="py-3.5 pr-4 text-[14px] tabular-nums" style={{ color: GRAY }}>{r.c}</td>
                  <td className="py-3.5 text-[14px] tabular-nums" style={{ color: GRAY }}>{r.s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {[
            { n: "0.62%", t: "Follower ER wins", p: "CaratLane 0.07%. PSG 0.02%. Quality of attention is already there." },
            { n: "88%", t: "Still static", p: "Two reels in sixteen posts. Flip the mix." },
            { n: "3s → 30s", t: "Length gap", p: "Storytelling needs seconds. Currently, it has almost none." },
          ].map((k) => (
            <Reveal key={k.t}>
              <div className="font-display text-[32px] font-semibold tracking-[-0.03em]" style={{ color: BLACK }}>{k.n}</div>
              <div className="mt-2 text-[15px] font-medium" style={{ color: BLACK }}>{k.t}</div>
              <p className="mt-1 text-[14px] leading-[1.5]" style={{ color: GRAY }}>{k.p}</p>
            </Reveal>
          ))}
        </div>
      </Shell>

      {/* ── DIAGNOSIS ────────────────────────────────────────────────────── */}
      <Shell cream>
        <Reveal>
          <Label>Why the gap exists</Label>
          <H2>Six fixable reasons.</H2>
          <Lead>None about the jewellery. All about the machine around it.</Lead>
        </Reveal>
        <div className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {DIAGNOSIS.map((d, i) => (
            <Reveal key={d.t} delay={i * 40}>
              <p className="text-[12px] tabular-nums" style={{ color: GRAY }}>0{i + 1}</p>
              <h3 className="mt-2 text-[18px] font-semibold tracking-[-0.01em]" style={{ color: BLACK }}>{d.h}</h3>
              <p className="mt-2 text-[14px] leading-[1.55]" style={{ color: GRAY_LIGHT }}>{d.p}</p>
            </Reveal>
          ))}
        </div>
      </Shell>

      {/* ── QUOTE ────────────────────────────────────────────────────────── */}
      <Shell dark>
        <Reveal>
          <p className="font-display text-[clamp(1.5rem,3.5vw,2.25rem)] font-medium leading-[1.3] tracking-[-0.02em]" style={{ color: "#f5f5f7" }}>
            Padmavathi Jewellery Mart does not need to work harder.
            It needs the machine that finally pays back the work already done.
          </p>
          <p className="mt-8 text-[13px]" style={{ color: "#86868b" }}>The pitch, in one line.</p>
        </Reveal>
      </Shell>

      {/* ── ENGINE ───────────────────────────────────────────────────────── */}
      <Shell>
        <Reveal>
          <Label>What we build</Label>
          <H2>The complete growth engine.</H2>
          <Lead>Twelve capabilities. Built once. Run every day. For Padmavathi Jewellery Mart.</Lead>
        </Reveal>
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl sm:grid-cols-2 lg:grid-cols-3" style={{ background: HAIRLINE }}>
          {ENGINE.map((e) => (
            <div key={e.h} className="flex flex-col p-7 sm:p-8" style={{ background: WHITE }}>
              <h3 className="text-[17px] font-semibold tracking-[-0.01em]" style={{ color: BLACK }}>{e.h}</h3>
              <p className="mt-2 text-[13px] leading-[1.5]" style={{ color: GRAY }}>{e.p}</p>
              <ul className="mt-5 space-y-2 border-t pt-5" style={{ borderColor: HAIRLINE }}>
                {e.items.map((x) => (
                  <li key={x} className="flex items-start gap-2 text-[13px]" style={{ color: GRAY_LIGHT }}>
                    <Check size={14} className="mt-0.5 flex-none" strokeWidth={1.75} style={{ color: RED }} />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Shell>

      {/* ── AUTOMATIONS ──────────────────────────────────────────────────── */}
      <Shell cream>
        <Reveal>
          <Label>Automation</Label>
          <H2>Every routine job. On autopilot.</H2>
          <Lead>Fifty-two automations across twenty-one groups. Kannada and English. Already built.</Lead>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {AUTO.map((a) => (
            <div key={a} className="rounded-xl px-4 py-4 text-[13px] font-medium" style={{ background: WHITE, color: BLACK, border: `1px solid ${HAIRLINE}` }}>
              {a}
            </div>
          ))}
        </div>
        <Reveal>
          <p className="mt-10 text-[14px]" style={{ color: GRAY_LIGHT }}>
            Lead capture, WhatsApp selling, AI content, festive engines, bridal drip, reviews, loyalty, voice, and owner intelligence.{" "}
            <TextLink href="/app/automations">See all automations</TextLink>
          </p>
        </Reveal>
      </Shell>

      {/* ── SPRINT ───────────────────────────────────────────────────────── */}
      <Shell>
        <Reveal>
          <Label>First thirty days</Label>
          <H2>One month to flip the machine on.</H2>
        </Reveal>
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {SPRINT.map((w) => (
            <Reveal key={w.w}>
              <p className="text-[12px]" style={{ color: GRAY }}>{w.w}</p>
              <h3 className="mt-1 text-[20px] font-semibold tracking-[-0.02em]" style={{ color: BLACK }}>{w.h}</h3>
              <ul className="mt-5 space-y-2.5">
                {w.items.map((x) => (
                  <li key={x} className="text-[13px] leading-[1.45]" style={{ color: GRAY_LIGHT }}>{x}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Shell>

      {/* ── SALES ────────────────────────────────────────────────────────── */}
      <Shell dark>
        <Label dark>From followers to sales</Label>
        <H2 dark>Reach is nice. We are here for revenue.</H2>
        <Lead dark>Path of a single reel.</Lead>
        <div className="mt-14 grid gap-6 sm:grid-cols-5">
          {[
            ["01", "Reel reaches", "Hook, timing, audio"],
            ["02", "Comment / DM", "Answered instantly"],
            ["03", "WhatsApp / site", "Domain planned"],
            ["04", "Visit or order", "Srinivasanagara store"],
            ["05", "Review + repeat", "Google engine"],
          ].map(([n, t, s]) => (
            <div key={n}>
              <div className="text-[12px] tabular-nums" style={{ color: "#86868b" }}>{n}</div>
              <div className="mt-2 text-[15px] font-medium" style={{ color: "#f5f5f7" }}>{t}</div>
              <div className="mt-1 text-[13px]" style={{ color: "#86868b" }}>{s}</div>
            </div>
          ))}
        </div>
      </Shell>

      {/* ── TARGETS ──────────────────────────────────────────────────────── */}
      <Shell cream>
        <Reveal>
          <Label>Direction</Label>
          <H2>Growth from 563 followers — in multiples.</H2>
          <Lead>
            Baseline today: <b style={{ color: BLACK }}>563 followers</b>. We speak in <b style={{ color: BLACK }}>× growth</b>
            {" "}(e.g. 500 → 3,000 is ~6×), not confusing percentages. Directional only — reported weekly as per our research.
          </Lead>
        </Reveal>
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl sm:grid-cols-2 lg:grid-cols-4" style={{ background: HAIRLINE }}>
          {[
            { h: "1 month", n: "6×", to: "→ ~3,400 followers", c: "From 563. Reels in thousands. Live WhatsApp enquiries.", mid: false },
            { h: "3 months", n: "15×", to: "→ ~8,500 followers", c: "A content brand. Steady Instagram + WhatsApp sales.", mid: true },
            { h: "6 months", n: "35×", to: "→ ~20,000 followers", c: "Local name in South Bangalore. Repeat enquiries compound.", mid: false },
            { h: "12 months", n: "90×", to: "→ ~50,000 followers", c: "A recognised jewellery brand online — retail & wholesale.", mid: true },
          ].map((g) => (
            <div key={g.h} className="px-6 py-10 text-center" style={{ background: g.mid ? BLACK : WHITE, color: g.mid ? "#f5f5f7" : BLACK }}>
              <div className="text-[12px]" style={{ color: g.mid ? "#86868b" : GRAY }}>{g.h}</div>
              <div className="mt-3 font-display text-[clamp(2rem,3.5vw,2.75rem)] font-semibold tracking-[-0.03em]" style={{ color: RED }}>{g.n}</div>
              <div className="mt-2 text-[13px] font-semibold" style={{ color: g.mid ? "#f5f5f7" : BLACK }}>{g.to}</div>
              <p className="mx-auto mt-3 max-w-[200px] text-[13px] leading-[1.45]" style={{ color: g.mid ? "#a1a1a6" : GRAY_LIGHT }}>{g.c}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-[12px]" style={{ color: GRAY }}>
          From 563: 6× ≈ 3,400 · 15× ≈ 8,500 · 35× ≈ 20,000 · 90× ≈ 50,000. Targets, not guarantees.
        </p>
      </Shell>

      {/* ── TOOLS ────────────────────────────────────────────────────────── */}
      <Shell>
        <Reveal>
          <Label>Working software</Label>
          <H2>Most agencies show slides.<br />We hand you tools.</H2>
          <Lead>Eight white-label modules, configured for Padmavathi Jewellery Mart.</Lead>
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl sm:grid-cols-2 lg:grid-cols-4" style={{ background: HAIRLINE }}>
          {TOOLS.map((t) => (
            <Link
              key={t.name}
              href={t.href}
              className="group flex flex-col p-6 transition-colors hover:bg-[#fafafa]"
              style={{ background: WHITE }}
            >
              <span className="text-[15px] font-semibold" style={{ color: BLACK }}>{t.name}</span>
              <span className="mt-1 flex-1 text-[13px]" style={{ color: GRAY }}>{t.d}</span>
              <span className="mt-5 inline-flex items-center gap-1 text-[13px] transition-opacity group-hover:opacity-70" style={{ color: RED }}>
                Open <ArrowRight size={13} strokeWidth={1.75} />
              </span>
            </Link>
          ))}
        </div>
      </Shell>

      {/* ── PHASES ───────────────────────────────────────────────────────── */}
      <Shell cream>
        <Reveal>
          <Label>How we work</Label>
          <H2>Build. Then grow beside you.</H2>
        </Reveal>
        <div className="mt-12 grid gap-10 sm:grid-cols-2">
          {[
            {
              n: "Phase 1",
              h: "Build the engine",
              p: "WhatsApp, content system, automations, padmavathijewellerymart.com launch, Google and Justdial, CRM, dashboard. First thirty days.",
            },
            {
              n: "Phase 2",
              h: "Run and grow",
              p: "We create content, run reels and ads for @padmavathi_jewellery_mart, manage every channel, and report against the July PPT baseline.",
            },
          ].map((ph) => (
            <Reveal key={ph.n}>
              <p className="text-[12px]" style={{ color: GRAY }}>{ph.n}</p>
              <h3 className="mt-2 text-[22px] font-semibold tracking-[-0.02em]" style={{ color: BLACK }}>{ph.h}</h3>
              <p className="mt-3 text-[15px] leading-[1.6]" style={{ color: GRAY_LIGHT }}>{ph.p}</p>
            </Reveal>
          ))}
        </div>
      </Shell>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <Shell dark>
        <Reveal>
          <div className="mx-auto max-w-[560px] text-center">
            <p className="text-[12px] tracking-wide" style={{ color: "#86868b" }}>The invitation</p>
            <h2 className="mt-5 font-display text-[clamp(1.85rem,4.5vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.03em]" style={{ color: "#f5f5f7" }}>
              The gold is pure.<br />The story is real.
            </h2>
            <p className="mx-auto mt-6 max-w-[420px] text-[16px] leading-[1.55]" style={{ color: "#a1a1a6" }}>
              One month to switch the engine on — and take padmavathijewellerymart.com from available domain to live flagship.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <Link
                href="/app/home"
                className="inline-flex items-center justify-center rounded-full px-7 py-3 text-[15px] transition-opacity hover:opacity-90"
                style={{ background: "#f5f5f7", color: BLACK }}
              >
                Enter workspace
              </Link>
              <Link href="/app/automations" className="text-[15px] transition-opacity hover:opacity-70" style={{ color: "#2997ff" }}>
                View automations
              </Link>
            </div>
          </div>
        </Reveal>
      </Shell>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="px-6 py-14 sm:px-10" style={{ background: BLACK, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="mx-auto max-w-[980px]">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="text-[13px] font-semibold tracking-[0.12em]" style={{ color: "#f5f5f7" }}>OSPYR</div>
              <p className="mt-3 max-w-sm text-[13px] leading-[1.55]" style={{ color: "#86868b" }}>
                Prepared for Padmavathi Jewellery Mart.<br />
                Srinivasanagara / Hanumantha Nagar, Bengaluru.
              </p>
            </div>
            <div className="text-[12px] leading-[1.8] sm:text-right" style={{ color: "#6e6e73" }}>
              237, SBM Colony, Banashankari 1st Stage, 560019<br />
              Daily 9:30 AM – 9:30 PM<br />
              padmavathijewellerymart.com · available · planned<br />
              @padmavathi_jewellery_mart · Justdial 4.9★ · Google 4.0★
            </div>
          </div>
          <div className="mt-10 flex items-center gap-4 border-t pt-6" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <a href="https://www.instagram.com/padmavathi_jewellery_mart/" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70" style={{ color: "#86868b" }}>
              <Instagram size={16} strokeWidth={1.5} />
            </a>
            <span className="text-[11px]" style={{ color: "#6e6e73" }}>As per our research · 02 Jul – 31 Jul 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
