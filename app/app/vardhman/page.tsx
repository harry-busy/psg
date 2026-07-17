"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Camera, Gem, Calculator, Users, CalendarDays, Star, Wallet, LayoutDashboard,
  ArrowRight, ChevronDown, Check, Workflow, Instagram, Film, Wand2, Mic,
  MessageCircle, MapPin, Boxes, Send, MessageSquare, Smartphone, Phone,
  Image as ImageIcon, Video, Rocket, Gift, Flame, Sun, Building2, Megaphone,
  ArrowUpRight, ArrowDownRight, Clock, Hash, Heart, Eye, BarChart3, AlertTriangle,
  ExternalLink, Globe,
} from "lucide-react";

/*
 * The Revival & Growth Blueprint - Vardhman Jewels x Ospyr.
 * Native, Apple-styled rebuild of Diyam/Vardhman_Experience.html + the uploaded
 * Instagram + comparison decks (vardhmanppt). Ospyr theme: red #D2042D, cream
 * #EBE5D5. Vardhman Jewels: heritage GOLD house since 1985, Jayanagar Bengaluru,
 * handle @vardhmanjewels1985. Real numbers 18 Jun to 17 Jul 2026. Every tool
 * wired to the live module. Sister brand: Diyam House of Silver (/app/diyam).
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

/* ── data (scraped from Vardhman_Experience.html + vardhmanppt decks) ───────── */
const OWN_METRICS = [
  { v: "12", l: "Posts this month", d: "33.33% lower", up: false },
  { v: "105", l: "Total engagement", d: "71.85% lower", up: false },
  { v: "8.8", l: "Avg engagement / post", d: "57.77% lower", up: false },
  { v: "3.5", l: "Engagement / day", d: "71.85% lower", up: false },
  { v: "4,973", l: "Followers", d: "0% growth, flat", up: false },
  { v: "8,130", l: "Post views", d: "61.22% lower", up: false },
  { v: "6,372", l: "Reach", d: "53.07% lower", up: false },
  { v: "0.18%", l: "Eng. rate by followers", d: "57.77% lower", up: false },
];

const TOP_POSTS = [
  { date: "25 Jun", title: "Real stories, pure trust (customer review)", views: "930", reach: "579", likes: "23", comments: "1", er: "0.48%" },
  { date: "07 Jul", title: "The wait ends here, newest collection", views: "801", reach: "499", likes: "12", comments: "0", er: "0.24%" },
  { date: "06 Jul", title: "If you know, you know", views: "476", reach: "297", likes: "14", comments: "1", er: "0.30%" },
];

const HASHTAGS = [
  { t: "goldjewellery", n: 6 }, { t: "vardhamanjewellers", n: 5 }, { t: "templejewellery", n: 4 },
  { t: "bridaljewellery", n: 3 }, { t: "jayanagar", n: 3 }, { t: "vardhamanjewels", n: 3 }, { t: "timelesselegance", n: 2 },
];

const COMPARE = [
  { m: "Followers", d: "4,973", o: "11,201", p: "1,177,713" },
  { m: "Posts (30 days)", d: "12", o: "60", p: "190" },
  { m: "Total engagement", d: "105", o: "20.1K", p: "59.9K" },
  { m: "Avg engagement / post", d: "8.8", o: "335.1", p: "315.3" },
  { m: "Engagement / day", d: "3.5", o: "670.3", p: "1,997" },
  { m: "Avg posts / day", d: "0.4", o: "2.0", p: "6.3" },
  { m: "New followers (period)", d: "0", o: "+116", p: "+7,066" },
  { m: "Avg engagement / reel", d: "12.80", o: "789.71", p: "300.75" },
  { m: "Comments", d: "3", o: "892", p: "788" },
  { m: "Likes", d: "102", o: "19.2K", p: "59.1K" },
  { m: "Peak engagement time", d: "Mon 6 PM", o: "Sat 6 PM", p: "Thu 6 PM" },
  { m: "Avg hashtags / post", d: "5.0", o: "5.0", p: "4.8" },
];

const ENGINE = [
  { icon: Instagram, h: "Social Media, All Pages", p: "Every platform, one premium brand.", li: ["Instagram, Facebook, Threads, Pinterest, YouTube", "Strategy, calendar and daily posting at the right time", "Community and DM management", "Profile and bio unified under one name"] },
  { icon: Megaphone, h: "Google & Meta Ads", p: "Reach ready buyers, profitably.", li: ["Meta ads for enquiry, catalog and traffic", "Google Search, Maps and Shopping ads", "Retargeting and festive campaign bursts", "Creative plus profit tracking"] },
  { icon: Building2, h: "Meta Business Suite", p: "The engine room, set up right.", li: ["Business manager, ad accounts and pixel", "Catalog, shops and lead forms", "Roles, permissions and safety", "Everything ads need to run and scale"] },
  { icon: Workflow, h: "Google Workspace & Automation", p: "The back office, organised.", li: ["Google Workspace setup and management", "Business email, drive and shared catalog sheets", "Workspace automations, leads to sheets to alerts", "One master system feeding everything"] },
  { icon: Film, h: "Content & Creative", p: "Heritage gold, made irresistible.", li: ["Macro and on-model bridal and temple jewellery", "Reels growth engine, hook-first, right timing", "Festive and wedding lookbooks", "Trending-audio and styling formats"] },
  { icon: Wand2, h: "AI Image & Video Studio", p: "Endless content from one photo.", li: ["Product photo to a studio-grade image", "Photo to an AI 360 or showcase video", "AI on-model shots without shoots", "AI UGC-style ad videos at scale"] },
  { icon: Mic, h: "Founder & Brand Growth", p: "Make the founder the face.", li: ["Founder's film and personal brand", "Behind-the-craft and since-1985 series", "Customer stories and testimonials", "A premium legacy brand voice"] },
  { icon: MessageCircle, h: "WhatsApp Commerce (fixed)", p: "From dead chat to selling channel.", li: ["WhatsApp Business API plus full catalog", "Instant price, purity and stock replies", "Click-to-WhatsApp on every post and ad", "Broadcast lists for drops and festivals"] },
  { icon: MapPin, h: "Get Found, Local & SEO", p: "Own the map and the search bar.", li: ["Google Business Profile and Maps managed", "Justdial and listings unified under one name", "Local SEO for gold and bridal jewellery in Jayanagar", "Reviews engine, from a handful to hundreds"] },
  { icon: Boxes, h: "Jewellery-Software Integration", p: "Connect what you already run.", li: ["Link billing and inventory to catalog and site", "Auto-sync stock, designs and gold rate", "Sales and customers into the CRM", "One source of truth, no double entry"] },
  { icon: Users, h: "CRM, Retention & Loyalty", p: "Wake the sleeping customer base.", li: ["Every past and new customer in one database", "Occasion and festival reminders", "Bridal nurture and gold-savings scheme", "Win-back and referral flows"] },
  { icon: LayoutDashboard, h: "Owner Command Dashboard", p: "Run it all from one screen.", li: ["Enquiries, sales, ads and reviews in one view", "8 AM WhatsApp digest daily", "Weekly scorecard vs targets", "Ask-your-business AI assistant"] },
];

const BROKEN = [
  { x: "WhatsApp", h: "Chat dies after hello", p: "Your WhatsApp stops at Meta's welcome message, no catalog, no real reply. Every enquiry hits a wall.", fix: "Full WhatsApp Business API plus catalog" },
  { x: "Meta suite", h: "No Meta Business Suite", p: "No business manager, no ad account structure, no pixel, so no ads, no retargeting, no scale.", fix: "Meta Business Suite fully set up" },
  { x: "Google", h: "No Google Business Suite", p: "Profile unmanaged, few reviews, not ranking in the Jayanagar map pack where buyers search.", fix: "Google Business plus Workspace managed" },
  { x: "Website", h: "Website is thin and invisible", p: "The site exists but barely, no catalog, no story, no capture, no SEO. See our builds below.", fix: "A premium new website" },
  { x: "Reviews", h: "Too few reviews", p: "Four decades of happy families, almost none of it online. A low review count means lost trust and ranking.", fix: "Automated reviews engine" },
  { x: "Momentum", h: "Posting and reach declining", p: "Fewer posts, wrong timing, no ads, no automations, the account is drifting, not driving.", fix: "The full engine below" },
];

const WEBSITES = [
  { b: "Ring Flame 3D", s: "Immersive 3D jewellery experience", href: "https://ring-flame.vercel.app/" },
  { b: "ChainShield", s: "Sleek product and brand site", href: "https://chainshield-eta.vercel.app/" },
  { b: "Divaa", s: "Full e-commerce storefront", href: "https://divaa-ecommerce.vercel.app/" },
  { b: "Aurora Spa", s: "Elegant premium service site", href: "https://aurora-spa-one.vercel.app/" },
  { b: "Aether Clothing", s: "Modern fashion and retail brand", href: "https://aetherclothing-phi.vercel.app/" },
  { b: "Beanlore", s: "Storytelling brand site", href: "https://beanlore-five.vercel.app/" },
  { b: "Bangalore Bites", s: "Local business storefront", href: "https://bangalore-bites-bakery.vercel.app/" },
];

const AUTO = [
  { icon: MessageCircle, b: "WhatsApp auto-reply", p: "Catalog, price, purity and stock in seconds, no more dead chat." },
  { icon: Send, b: "Instagram auto-DM", p: "Every DM answered and turned into a lead." },
  { icon: MessageSquare, b: "Comment to auto-DM", p: "A keyword comment triggers an instant DM plus link." },
  { icon: Phone, b: "AI voice agent (Kannada)", p: "Answers calls, quotes, books visits 24/7." },
  { icon: ImageIcon, b: "Photo to branded image", p: "Send a photo, get a catalog visual back." },
  { icon: Video, b: "Photo to showcase video", p: "One photo becomes a reel-ready video." },
  { icon: Rocket, b: "New design to everywhere", p: "Auto-posted plus broadcast to VIP buyers." },
  { icon: Gift, b: "Festive broadcasts", p: "Akshaya Tritiya, Dhanteras, weddings, automatic." },
  { icon: Star, b: "Review & referral", p: "Auto-ask after every sale, reviews on autopilot." },
  { icon: Flame, b: "AI lead scoring", p: "Hot buyers flagged with the next action." },
  { icon: Heart, b: "Bridal nurture drip", p: "6-month automated journey for high-ticket bridal." },
  { icon: Sun, b: "Daily owner digest", p: "Enquiries, sales, ads and rate, one morning message." },
];

const SPRINT = [
  { n: "Week 1", h: "Unify & fix", li: ["Lock one official brand name everywhere", "Secure domains and handles", "WhatsApp Business API plus catalog live", "Meta Business Suite plus Google Business set up", "Profile and bio revamp"] },
  { n: "Week 2", h: "Content & automation", li: ["Reels engine at full flow, Monday 6 PM", "AI image plus video automations on", "Auto-DM plus comment-to-DM live", "Reviews engine switched on", "Founder story shoot"] },
  { n: "Week 3", h: "Ads & reach", li: ["Meta plus Google ads live", "Retargeting the sleeping 5K audience", "Local creators and UGC", "New premium website launched", "SEO and listings unified"] },
  { n: "Week 4", h: "Prove & scale", li: ["Festive and wedding-season push", "WhatsApp enquiries to sales", "Owner dashboard plus daily digest", "Reviews climbing", "Growth curve reported"] },
];

const TOOLS = [
  { icon: Camera, name: "Studio Photo", desc: "Any phone photo becomes a pro studio image.", href: "/app/studio" },
  { icon: Gem, name: "Product Card Maker", desc: "Photo plus details becomes a branded catalog card.", href: "/app/cards" },
  { icon: Calculator, name: "Gold Estimator", desc: "Weight, karat and rate plus making gives an instant quote.", href: "/app/calculator" },
  { icon: Users, name: "Enquiry CRM", desc: "Log and track every enquiry to close.", href: "/app/crm" },
  { icon: CalendarDays, name: "Festive Calendar", desc: "Every festival with campaign plans.", href: "/app/calendar" },
  { icon: Star, name: "Review QR Kit", desc: "Turn happy families into 5-stars.", href: "/app/reviews" },
  { icon: Wallet, name: "Savings Scheme", desc: "A gold savings-scheme calculator.", href: "/app/scheme" },
  { icon: LayoutDashboard, name: "Owner Dashboard", desc: "Your whole shop on one screen.", href: "/app/dashboard" },
];

export default function VardhmanBlueprint() {
  return (
    <div className="-mx-4 -my-6 sm:-mx-8 lg:-ml-10 lg:-mr-8" style={{ background: CREAM, color: INK }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden px-5 py-20 sm:px-6 sm:py-32" style={{ background: `radial-gradient(120% 90% at 82% 8%, #e6203f 0%, ${RED} 44%, ${RED_DEEP} 100%)`, color: "#fbf5ec" }}>
        <div className="pointer-events-none absolute -right-32 -top-28 h-72 w-72 rounded-full opacity-40 sm:h-[420px] sm:w-[420px]" style={{ background: `radial-gradient(circle, ${GOLD_SOFT}55, transparent 65%)` }} />
        <div className="pointer-events-none absolute -bottom-28 -left-28 h-64 w-64 rounded-full opacity-30 sm:h-80 sm:w-80" style={{ background: `radial-gradient(circle, ${GOLD_SOFT}44, transparent 65%)` }} />
        <div className="relative mx-auto max-w-5xl">
          <div className="mb-6 text-[10px] font-semibold uppercase tracking-[0.22em] sm:mb-7 sm:text-[12px] sm:tracking-[0.36em]" style={{ color: GOLD_SOFT }}>
            Vardhman Jewels &middot; Since 1985 &middot; Jayanagar, Bengaluru
          </div>
          <h1 className="font-display text-[clamp(2rem,7.4vw,4.75rem)] font-semibold leading-[1.05] tracking-tight">
            A 40-year legacy deserves to <span className="italic" style={{ color: GOLD_SOFT }}>lead</span>, not fade.
          </h1>
          <p className="mt-6 max-w-2xl text-[clamp(1rem,2.4vw,1.45rem)] leading-relaxed sm:mt-7" style={{ color: "#f4e4d6" }}>
            Vardhman Jewels has four decades of gold, trust and craft behind it. But online, the legacy is going quiet:
            reach halved, views down 61 percent, growth at zero. This is the plan to revive it, unify it, and make it the
            digital name Bangalore searches for.
          </p>
          <div className="mt-9 inline-block border-t pt-4 text-[13px] tracking-wide sm:mt-11 sm:text-sm" style={{ borderColor: `${GOLD_SOFT}55`, color: "#e6d3bb" }}>
            A revival, growth and sales blueprint prepared for Vardhman Jewels &middot; by Ospyr
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2" style={{ color: GOLD_SOFT }}>
          <span className="block animate-bounce"><ChevronDown size={20} /></span>
        </div>
      </header>

      {/* ── LEGACY ───────────────────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <Eyebrow>The house and its founder</Eyebrow>
          <h2 className="max-w-3xl font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight" style={{ color: RED }}>
            Four decades of gold. A name families trust.
          </h2>
          <GoldLine />
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            <div>
              <p className="max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: "#4a3b33" }}>
                Since <b>1985</b>, Vardhman Jewels has been part of Jayanagar&apos;s story, temple jewellery, bridal gold,
                and the kind of trust that only time can build. Four decades of families who came for a wedding and came
                back for the next generation&apos;s.
              </p>
              <p className="mt-4 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: "#4a3b33" }}>
                That heritage is a moat no new brand can copy. Yet online, almost none of it shows. The founder&apos;s
                story, the craft, the meaning behind temple and bridal gold, are invisible. We put the legacy at the
                centre: a founder&apos;s film, the since-1985 mark on everything, and a brand that finally feels as
                premium online as it does in person.
              </p>
              <div className="mt-5 rounded-xl px-4 py-3 text-[13px] italic" style={{ background: CREAM_2, borderLeft: `3px solid ${GOLD}`, color: MUTED }}>
                Draft narrative. We build this around your real founder&apos;s name, the family story, and the true
                milestones of the house before it goes live. Give us the details and we script the founder&apos;s film.
              </div>
            </div>
            <div className="grid aspect-square place-items-center rounded-[22px] text-center shadow-[0_24px_70px_-30px_rgba(60,10,25,0.5)]" style={{ background: redWash, border: `1px solid ${GOLD_SOFT}44` }}>
              <div>
                <div className="font-display text-[76px] leading-none" style={{ color: GOLD_SOFT }}>V</div>
                <div className="mt-3 text-[13px] uppercase tracking-[0.3em]" style={{ color: "#f4e4d6" }}>Vardhman Jewels</div>
                <div className="mt-1.5 text-[12px] uppercase tracking-[0.2em]" style={{ color: "#e2c7ad" }}>Est. 1985 &middot; Jayanagar</div>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ── TODAY / ANALYTICS (red band) ─────────────────────────────────── */}
      <BandSection>
        <Eyebrow onDark>Where you stand today, the real numbers</Eyebrow>
        <h2 className="font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight">
          A legacy that is going quiet online.
        </h2>
        <p className="mt-5 max-w-2xl text-base sm:text-lg" style={{ color: "#f4e4d6" }}>
          Straight from your Instagram analytics, 18 June to 17 July. Every arrow is pointing down, and that is exactly
          what we reverse.
        </p>
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3 sm:gap-8 lg:grid-cols-6">
          <StatBlock value={<CountUp value={4973} />} label="Followers" sub="0% growth, flat" />
          <StatBlock value={<CountUp value={12} />} label="Posts this month" sub="down from 18" />
          <StatBlock value={<CountUp value={105} />} label="Total engagement" sub="down 72%, ~3.5 a day" />
          <StatBlock value={<CountUp value={3} />} label="Comments, all month" sub="102 likes total" />
          <StatBlock value={<CountUp value={6372} />} label="Reach" sub="down 53%" />
          <StatBlock value={<CountUp value={8130} />} label="Views" sub="down 61%, video 19K to 3.5K" />
        </div>
        <p className="mt-10 max-w-3xl text-base sm:text-lg" style={{ color: "#f4e4d6" }}>
          You have a 5,000-strong audience built over years, but it is asleep. Posting has slowed, reels are not
          reaching, and not one new follower joined this month. The good news: an established audience wakes up far
          faster than a cold one. The foundation is already paid for.
        </p>
      </BandSection>

      {/* ── COMPLETE SOCIAL ANALYTICS ────────────────────────────────────── */}
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
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {OWN_METRICS.map((m, i) => (
            <Reveal key={m.l} delay={(i % 4) * 50}><Metric {...m} /></Reveal>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Reveal className="h-full">
            <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-[0_12px_34px_-22px_rgba(60,10,25,0.35)]">
              <div className="flex items-center gap-2"><BarChart3 size={18} style={{ color: RED }} /><b className="font-display text-[17px]" style={{ color: INK }}>Post mix and what performs</b></div>
              <p className="mt-1 text-[13.5px]" style={{ color: MUTED }}>Images fill the feed, but reels drive the results, 2.6x the engagement. Flip the mix.</p>
              <div className="mt-4 space-y-4">
                <PerfBar label="Reels" count="5 posts" avg="12.80" pct={100} />
                <PerfBar label="Carousels" count="1 post" avg="11.00" pct={86} />
                <PerfBar label="Images" count="6 posts" avg="5.00" pct={39} />
              </div>
            </div>
          </Reveal>
          <Reveal className="h-full">
            <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-[0_12px_34px_-22px_rgba(60,10,25,0.35)]">
              <div className="flex items-center gap-2"><Clock size={18} style={{ color: RED }} /><b className="font-display text-[17px]" style={{ color: INK }}>When your audience shows up</b></div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <TimeBox k="Monday" l="Highest-engagement day" />
                <TimeBox k="6 PM" l="Highest-engagement hour" />
                <TimeBox k="Thursday" l="Where you post most" />
                <TimeBox k="4 PM" l="Where you post most" />
              </div>
              <p className="mt-4 text-[13px]" style={{ color: "#b25000" }}>
                You post Thursday 4 PM, but your audience peaks Monday 6 PM, exactly when OnnMe and PSG Gold post too.
              </p>
            </div>
          </Reveal>
        </div>

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
                  <PostStat icon={<Eye size={13} />} v={p.views} l="Views" />
                  <PostStat icon={<BarChart3 size={13} />} v={p.reach} l="Reach" />
                  <PostStat icon={<Heart size={13} />} v={p.likes} l="Likes" />
                </div>
                <div className="mt-3 border-t pt-3 text-[12px]" style={{ borderColor: "#efe7d6", color: MUTED }}>
                  {p.comments} comments &middot; {p.er} engagement rate
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-8 flex items-center gap-2"><Hash size={18} style={{ color: RED }} /><b className="font-display text-[17px]" style={{ color: INK }}>Your most-used hashtags</b><span className="text-[13px]" style={{ color: MUTED }}>5.0 avg per post</span></div>
          <div className="mt-3 flex flex-wrap gap-2">
            {HASHTAGS.map((h) => (
              <span key={h.t} className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium" style={{ borderColor: `${GOLD}55`, background: "#fff", color: INK }}>
                #{h.t} <span className="text-[11px] font-bold" style={{ color: GOLD }}>{h.n}</span>
              </span>
            ))}
          </div>
          <p className="mt-3 text-[13px] italic" style={{ color: "#b25000" }}>
            Note the mixed spelling in your own tags: #vardhamanjewellers and #vardhamanjewels vs the handle
            @vardhmanjewels1985. That split is costing you discovery, more on it below.
          </p>
        </Reveal>
      </Section>

      {/* ── HEAD TO HEAD ─────────────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <Eyebrow>Head to head</Eyebrow>
          <h2 className="font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight" style={{ color: RED }}>
            Vardhman vs OnnMe vs PSG Gold.
          </h2>
          <GoldLine />
          <p className="max-w-3xl text-base leading-relaxed sm:text-lg" style={{ color: "#4a3b33" }}>
            Same 30 days, side by side. A younger brand with barely twice your followers earns nearly 200 times your
            engagement, purely on system, content and consistency.
          </p>
        </Reveal>
        <Reveal>
          <div className="mt-8 overflow-hidden rounded-[18px] bg-white shadow-[0_20px_60px_-28px_rgba(60,10,25,0.4)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left">
                <thead>
                  <tr style={{ background: redWash, color: "#fbf5ec" }}>
                    <th className="px-4 py-3 text-[12px] font-bold uppercase tracking-[0.1em] sm:px-6">Metric</th>
                    <th className="px-4 py-3 text-[13px] font-bold sm:px-6" style={{ color: GOLD_SOFT }}>Vardhman</th>
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
            { big: "191x", t: "OnnMe's monthly engagement", p: "20.1K vs your 105, on 60 posts to your 12, from a brand with barely twice your followers." },
            { big: "2.6x", t: "your reels beat your images", p: "12.80 vs 5.00 average engagement, yet images still fill half your feed. Flip the mix to reels." },
            { big: "0.4", t: "posts per day, you are nearly silent", p: "OnnMe posts 2 a day, PSG Gold 6.3. Cadence plus 6 PM timing is the fastest lever you have." },
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

      {/* ── THE GAP (red band) ───────────────────────────────────────────── */}
      <div className="px-5 py-16 sm:px-6 sm:py-24" style={{ background: redWash, color: "#fbf5ec" }}>
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow onDark>The gap, you vs the field</Eyebrow>
            <h2 className="max-w-4xl font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight">
              A 40-year house, being out-marketed by newcomers.
            </h2>
            <p className="mt-5 max-w-3xl text-base sm:text-lg" style={{ color: "#f4e4d6" }}>
              Same month. A younger brand with barely twice your followers earns nearly 200 times your engagement, purely
              on system, content and consistency.
            </p>
            <div className="mt-11 flex flex-col gap-7">
              <CompareBar you name="Vardhman" meta="4,973 followers, 12 posts" value="105" pct={2} note="Total monthly engagement, about 3.5 a day" />
              <CompareBar name="OnnMe" meta="11.2K followers, 60 posts" value="20,100" pct={34} note="About 191x your engagement, offers, trends, creators, 6 PM timing" />
              <CompareBar name="PSG Gold" meta="1.18M followers, 190 posts" value="59,900" pct={100} note="Where a fully-run gold house reaches" />
            </div>
            <p className="mt-9 max-w-3xl text-base sm:text-lg" style={{ color: "#f4e4d6" }}>
              Your reels already beat your images (12.8 vs 5 engagement) and you post best on Monday 6 PM, but you are
              publishing Thursday 4 PM. Small, data-clear fixes with outsized payoff.
            </p>
          </Reveal>
        </div>
      </div>

      {/* ── WHAT'S BROKEN ────────────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <Eyebrow>What is actually broken</Eyebrow>
          <h2 className="font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight" style={{ color: RED }}>
            Six leaks, all fixable, some in a single day.
          </h2>
          <GoldLine />
        </Reveal>

        {/* name split callout */}
        <Reveal>
          <div className="mt-6 overflow-hidden rounded-[20px] p-7 sm:p-9" style={{ background: redWash, color: "#fbf5ec" }}>
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide" style={{ background: GOLD_SOFT, color: "#3a0712" }}>
              <AlertTriangle size={13} /> Brand-name split, fix this first
            </span>
            <h3 className="mt-4 font-display text-2xl font-semibold" style={{ color: GOLD_SOFT }}>
              Is it Vardhaman or Vardhman? Right now, it is both.
            </h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.08)", border: `1px solid ${GOLD_SOFT}40` }}>
                <div className="text-[11px] uppercase tracking-[0.14em]" style={{ color: "#e2c7ad" }}>Instagram &middot; Website &middot; Showroom board</div>
                <b className="mt-1.5 block font-display text-2xl" style={{ color: GOLD_SOFT }}>VARDHMAN</b>
              </div>
              <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.08)", border: `1px solid ${GOLD_SOFT}40` }}>
                <div className="text-[11px] uppercase tracking-[0.14em]" style={{ color: "#e2c7ad" }}>Google &middot; Justdial &middot; your own captions</div>
                <b className="mt-1.5 block font-display text-2xl" style={{ color: "#fff" }}>VARDHAMAN</b>
              </div>
            </div>
            <p className="mt-5 max-w-3xl text-[15px]" style={{ color: "#f4e4d6" }}>
              Your handle, website and the board outside the showroom say <b>VARDHMAN</b>, but Google, Justdial and even
              your own posts say <b>VARDHAMAN</b> with the extra A. One missing letter splits your search results, your
              reviews and your brand in two. Customers searching one spelling never find the other. Step one: pick one
              official spelling, unify it everywhere, board, bio, website, listings, hashtags, and secure the matching
              domains and handles so no one else can.
            </p>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BROKEN.map((d) => (
            <Reveal key={d.x} className="h-full">
              <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-[0_10px_30px_-18px_rgba(60,10,25,0.3)]" style={{ borderLeft: `4px solid ${RED}` }}>
                <div className="text-[13px] font-bold uppercase tracking-[0.08em]" style={{ color: RED }}>{d.x}</div>
                <h4 className="mt-1.5 font-display text-[17px] font-semibold" style={{ color: INK }}>{d.h}</h4>
                <p className="mt-2 text-[14.5px] leading-relaxed" style={{ color: MUTED }}>{d.p}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-semibold" style={{ color: "#0E7C57" }}>
                  <ArrowRight size={14} /> {d.fix}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── PULL QUOTE ───────────────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <div className="relative overflow-hidden rounded-[22px] px-6 py-12 text-center shadow-[0_20px_60px_-20px_rgba(60,10,25,0.5)] sm:rounded-[28px] sm:px-12 sm:py-16" style={{ background: redWash, color: "#fbf5ec" }}>
            <span className="pointer-events-none absolute left-4 top-1 font-display text-[100px] leading-none sm:left-6 sm:top-2 sm:text-[160px]" style={{ color: `${GOLD_SOFT}22` }}>&ldquo;</span>
            <q className="relative block font-display text-[clamp(1.3rem,3.8vw,2.35rem)] font-medium italic leading-snug">
              You spent 40 years earning the trust. Give us one month to make the internet finally show it.
            </q>
            <div className="mt-6 text-[13px] font-semibold uppercase tracking-[0.2em]" style={{ color: GOLD_SOFT }}>The Vardhman opportunity, in one line</div>
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
            A full high-end marketing department for Vardhman, heritage brought online, and every channel working
            together.
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

      {/* ── WEBSITE REFERENCES (red band) ────────────────────────────────── */}
      <div className="px-5 py-16 sm:px-6 sm:py-24" style={{ background: redWash, color: "#fbf5ec" }}>
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow onDark>Your new digital front door</Eyebrow>
            <h2 className="font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight">
              A website worthy of a 40-year house.
            </h2>
            <p className="mt-5 max-w-3xl text-base sm:text-lg" style={{ color: "#f4e4d6" }}>
              Your current site is thin and invisible. We build premium, fast, modern sites, here are live examples of
              the calibre we deliver. Open any of them.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WEBSITES.map((w, i) => (
              <Reveal key={w.b} delay={(i % 4) * 50} className="h-full">
                <a href={w.href} target="_blank" rel="noopener noreferrer" className="group flex h-full flex-col rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-1" style={{ background: "#2b0512", borderColor: `${GOLD_SOFT}30` }}>
                  <b className="block text-[16px]" style={{ color: GOLD_SOFT }}>{w.b}</b>
                  <p className="mt-1.5 text-[13px]" style={{ color: "#e6d0c2" }}>{w.s}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-4 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: GOLD }}>
                    View live <ExternalLink size={12} />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-8 rounded-2xl p-6 sm:p-7" style={{ background: "#2b0512", borderLeft: `4px solid ${GOLD_SOFT}` }}>
              <p className="text-[14px] leading-relaxed sm:text-[15px]" style={{ color: "#f0ddc7" }}>
                <b style={{ color: GOLD_SOFT }}>Secure the brand before someone else does.</b> These matching domains are
                available now, we recommend locking them alongside unifying the name:
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["vardhamanjewels.com", "vardhmangems.com", "diyamjewels.com", "diyamhouseofsilver.com"].map((d) => (
                  <code key={d} className="rounded-md px-2.5 py-1 text-[12.5px]" style={{ background: "#3a0712", color: GOLD_SOFT }}>{d}</code>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── AUTOMATION SUITE ─────────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <Eyebrow>The automation suite</Eyebrow>
          <h2 className="font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight" style={{ color: RED }}>
            Every routine job, on autopilot.
          </h2>
          <GoldLine />
          <p className="max-w-3xl text-base leading-relaxed sm:text-lg" style={{ color: "#4a3b33" }}>
            The work that is impossible by hand, answered instantly, 24/7, in Kannada and English.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AUTO.map((a, i) => (
            <Reveal key={a.b} delay={(i % 4) * 50} className="h-full">
              <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-[0_10px_30px_-20px_rgba(60,10,25,0.3)]" style={{ borderTop: `4px solid ${GOLD}` }}>
                <a.icon size={22} style={{ color: RED }} />
                <b className="mt-3 block text-[15.5px]" style={{ color: INK }}>{a.b}</b>
                <p className="mt-1.5 text-[13.5px] leading-relaxed" style={{ color: MUTED }}>{a.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="mt-8 rounded-2xl p-6 sm:p-7" style={{ background: CREAM_2 }}>
            <p className="text-[14px] leading-relaxed sm:text-[15px]" style={{ color: "#4a3b33" }}>
              <b style={{ color: "#7a0b25" }}>52 automations across 21 groups are already built</b> and import-ready,
              Vardhman gets the whole library, configured to your channels and your gold catalog.{" "}
              <Link href="/app/automations" className="inline-flex items-center gap-1 font-semibold underline underline-offset-2" style={{ color: RED }}>
                See all automations <ArrowRight size={13} />
              </Link>
            </p>
          </div>
        </Reveal>
      </Section>

      {/* ── 30-DAY SPRINT (red band) ─────────────────────────────────────── */}
      <BandSection>
        <Eyebrow onDark>The first 30 days</Eyebrow>
        <h2 className="font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight">
          One month to revive the legacy online.
        </h2>
        <p className="mt-5 max-w-3xl text-base sm:text-lg" style={{ color: "#f4e4d6" }}>
          You asked for growth in the next month. Here is exactly how we spend it.
        </p>
        <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SPRINT.map((w) => (
            <div key={w.n} className="rounded-2xl bg-white p-6 shadow-[0_18px_50px_-26px_rgba(0,0,0,0.5)]" style={{ borderTop: `5px solid ${GOLD}` }}>
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
      </BandSection>

      {/* ── SALES FLOW ───────────────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <Eyebrow>From followers to sales</Eyebrow>
          <h2 className="font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight" style={{ color: RED }}>
            Reach is nice. We are here for revenue.
          </h2>
          <GoldLine />
          <p className="max-w-3xl text-base leading-relaxed sm:text-lg" style={{ color: "#4a3b33" }}>
            Every part of the engine points at gold in the till, bridal, festive and repeat. The path a single reel now
            takes:
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { n: "01", b: "Reel plus ad reach", s: "hook, timing, targeting" },
              { n: "02", b: "Comment / DM", s: "auto-answered instantly" },
              { n: "03", b: "WhatsApp catalog", s: "price, purity, booking" },
              { n: "04", b: "Showroom visit / order", s: "bridal, festive, wholesale" },
              { n: "05", b: "Review plus repeat", s: "referral and occasion nurture" },
            ].map((node) => (
              <div key={node.n} className="rounded-2xl p-5 text-center" style={{ background: CREAM_2 }}>
                <div className="font-display text-[15px] font-bold" style={{ color: RED }}>{node.n}</div>
                <b className="mt-2 block text-[15px]" style={{ color: INK }}>{node.b}</b>
                <span className="mt-1 block text-[12.5px]" style={{ color: MUTED }}>{node.s}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-base sm:text-lg" style={{ color: "#4a3b33" }}>
            Gold&apos;s advantage: high ticket, occasion-driven (bridal, Akshaya Tritiya, Dhanteras, wedding season) and a
            5,000-strong warm base to re-activate. One recovered bridal customer can outweigh a month of ad spend.
          </p>
        </Reveal>
      </Section>

      {/* ── TARGETS (red band) ───────────────────────────────────────────── */}
      <BandSection>
        <Eyebrow onDark>The growth we build toward</Eyebrow>
        <h2 className="font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight">
          From flat to climbing, fast.
        </h2>
        <p className="mt-5 max-w-3xl text-base sm:text-lg" style={{ color: "#f4e4d6" }}>
          Honest, directional targets. An established, warm audience revives quicker than a cold one, that is your head
          start.
        </p>
        <div className="mt-11 grid gap-6 sm:grid-cols-3">
          {[
            { h: "30 days", n: "8K+", c: "followers reactivated, reach and enquiries climbing, ads live", mid: false },
            { h: "90 days", n: "20K+", c: "a leading Jayanagar gold name online, steady bridal enquiries", mid: true },
            { h: "12 months", n: "100K+", c: "a recognised Bangalore gold house across every channel", mid: false },
          ].map((g) => (
            <div key={g.h} className={cn("rounded-3xl bg-white p-7 text-center shadow-[0_18px_50px_-24px_rgba(0,0,0,0.5)] sm:p-8", g.mid && "sm:scale-[1.05]")} style={{ borderTop: `5px solid ${g.mid ? GOLD_SOFT : "#7a0b25"}` }}>
              <h4 className="text-[13px] font-bold uppercase tracking-[0.14em]" style={{ color: MUTED }}>{g.h}</h4>
              <div className="my-3 font-display text-[2.75rem] font-semibold leading-none sm:text-5xl" style={{ color: g.mid ? RED : "#7a0b25" }}>{g.n}</div>
              <div className="text-[15px]" style={{ color: MUTED }}>{g.c}</div>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-sm italic" style={{ color: "#e2c7ad" }}>
          Targets, not guarantees. Reported weekly, always transparent.
        </p>
      </BandSection>

      {/* ── THE GROUP ────────────────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <Eyebrow>One family, two houses</Eyebrow>
          <h2 className="font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight" style={{ color: RED }}>
            Vardhman and Diyam, grown together.
          </h2>
          <GoldLine />
          <p className="max-w-3xl text-base leading-relaxed sm:text-lg" style={{ color: "#4a3b33" }}>
            Two identities, one standard of trust: Vardhman Jewels for gold, Diyam House of Silver for 925 sterling. We
            grow both in parallel, shared systems, separate brands, so each speaks to its own customer while the group
            compounds.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl p-7" style={{ background: redWash, color: "#fbf5ec", border: `1px solid ${GOLD_SOFT}40` }}>
              <div className="text-[11px] uppercase tracking-[0.2em]" style={{ color: "#e2c7ad" }}>Gold &middot; Since 1985</div>
              <h3 className="mt-1.5 font-display text-2xl font-semibold" style={{ color: GOLD_SOFT }}>Vardhman Jewels</h3>
              <p className="mt-1.5 text-[14px]" style={{ color: "#f4e4d6" }}>The heritage gold house, bridal, temple and festive. Revive, unify, lead.</p>
              <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: GOLD_SOFT }}>You are here</span>
            </div>
            <Link href="/app/diyam" className="group rounded-2xl bg-white p-7 shadow-[0_18px_50px_-26px_rgba(60,10,25,0.4)] transition-transform hover:-translate-y-1" style={{ borderTop: `4px solid ${RED}` }}>
              <div className="text-[11px] uppercase tracking-[0.2em]" style={{ color: MUTED }}>925 Sterling Silver</div>
              <h3 className="mt-1.5 font-display text-2xl font-semibold" style={{ color: "#7a0b25" }}>Diyam House of Silver</h3>
              <p className="mt-1.5 text-[14px]" style={{ color: MUTED }}>The modern silver brand, giftable, trend-led, wholesale and retail.</p>
              <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: RED }}>Open Diyam&apos;s blueprint <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" /></span>
            </Link>
          </div>
        </Reveal>
      </Section>

      {/* ── PROOF / TOOLS (red band) ─────────────────────────────────────── */}
      <div className="px-5 py-16 sm:px-6 sm:py-24" style={{ background: redWash, color: "#fbf5ec" }}>
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow onDark>The unfair advantage</Eyebrow>
            <h2 className="max-w-4xl font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight">
              Most agencies show slides. We hand you working software.
            </h2>
            <p className="mt-5 max-w-3xl text-base sm:text-lg" style={{ color: "#f4e4d6" }}>
              Eight white-label tools and 52 automations, already built, configured for Vardhman. Click any tool to open
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
                All eight tools are white-label, brand name, colours and WhatsApp number configure to Vardhman in
                seconds.{" "}
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
                { n: "Phase 1 - Build", h: "We build and fix your entire engine", p: "Name unified, WhatsApp fixed, Meta and Google suites, ads, website, workspace, software integration, automations, dashboard, set up in the first 30 days." },
                { n: "Phase 2 - Grow", h: "We run and grow it every month", p: "Ospyr creates the content, runs the ads, manages every page and channel across Vardhman and Diyam, and reports the numbers, your full marketing department." },
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
              40 years of trust. One month to make the world see it.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg" style={{ color: "#4a3b33" }}>
              Let&apos;s unify the name, revive the legacy, and turn Vardhman Jewels into the digital gold house it has
              always deserved to be.
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
        <div className="font-display text-xl font-semibold tracking-[0.2em]" style={{ color: GOLD_SOFT }}>OSPYR</div>
        <p className="mt-3 text-[13px]">The team behind the jeweller. &middot; Prepared for Vardhman Jewels, Jayanagar, Bengaluru.</p>
      </footer>
    </div>
  );
}
