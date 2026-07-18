"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { StudioReferences } from "@/components/StudioReferences";
import {
  Camera, Gem, Calculator, Users, CalendarDays, Star, Wallet, LayoutDashboard,
  ArrowRight, ChevronDown, Check, Workflow, Sparkles, Film, Search, MessageCircle,
  MapPin, Heart, Globe, TrendingUp,
} from "lucide-react";

/*
 * The Growth Story - Padmavathi Jewellery Mart x Ospyr.
 * Native, Apple-styled rebuild of research/Padmavathi_Jewellery_Mart/
 * Padmavathi_Experience.html. Uses the Ospyr theme: red backgrounds #D2042D,
 * cream background #EBE5D5. Real numbers: 385 followers, 229 posts, 4.0 star
 * Google (~40 reviews), no website/WhatsApp/system yet. A gold jeweller in
 * Hanumantha Nagar, Bengaluru. Every tool wired to the live module.
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
function StatBlock({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="min-w-0">
      <div className="font-display text-[clamp(1.85rem,7vw,3.4rem)] font-semibold leading-none tabular-nums" style={{ color: GOLD_SOFT }}>{value}</div>
      <div className="mt-2.5 text-[13px] font-medium leading-snug sm:text-sm" style={{ color: "#f4e4d6" }}>{label}</div>
    </div>
  );
}

const ENGINES = [
  { no: "Engine 01", icon: Sparkles, h: "Content Pillars & Identity", p: "A clear look and a reason to follow, not just product photos.", li: ["Signature visual style and brand colours", "5 content themes: new designs, behind-the-craft, customer joy, gold tips, festive", "Bio, highlights and profile optimised to convert visitors"] },
  { no: "Engine 02", icon: Film, h: "Reels Growth Engine", p: "Reels are how a small account reaches thousands for free.", li: ["4 to 5 scroll-stopping reels every week", "Trending audio plus jewellery hooks that get shared and saved", "Macro shots, try-on and which-one formats built to go wide"] },
  { no: "Engine 03", icon: Search, h: "Instagram SEO & Discovery", p: "Get found when Bangalore searches for jewellery.", li: ["Keyword-rich captions and a searchable profile", "Local plus niche hashtag strategy that actually reaches buyers", "Geo-tags, collabs and posting-time optimisation"] },
  { no: "Engine 04", icon: MessageCircle, h: "WhatsApp Catalog & Selling", p: "Turn a nice post into a real conversation and a sale.", li: ["Your full collection browsable inside WhatsApp", "Instant price, purity and availability replies", "Click-to-WhatsApp on every post, straight to enquiry"] },
  { no: "Engine 05", icon: MapPin, h: "Get-Found Locally", p: "Own the map the moment someone searches nearby.", li: ["Google Business Profile fully optimised, photos, posts, offers", "Justdial and local listings tuned to send buyers to you", "Rank for jewellers in Hanumantha Nagar and Bangalore"] },
  { no: "Engine 06", icon: Star, h: "Reviews & Trust Engine", p: "Your 4.0 star is gold, let's turn 40 reviews into 400.", li: ["A simple in-store QR that asks every happy buyer", "A steady 5-star flow that lifts ranking and confidence", "Customer stories and testimonials as content"] },
  { no: "Engine 07", icon: CalendarDays, h: "Festive & Occasion Calendar", p: "A planned year, never miss the days gold sells itself.", li: ["Akshaya Tritiya, Dhanteras, Ugadi, wedding season", "A campaign built ahead of every festival", "Offers and broadcasts timed to peak buying"] },
];

const WEEK = [
  { d: "Mon", t: "Reel", s: "New design reveal" },
  { d: "Tue", t: "Story", s: "Gold rate plus poll" },
  { d: "Wed", t: "Reel", s: "Behind the craft" },
  { d: "Thu", t: "Post", s: "Customer joy" },
  { d: "Fri", t: "Reel", s: "Try-on / which one" },
  { d: "Sat", t: "Post", s: "Festive / offer" },
  { d: "Sun", t: "Story", s: "Reviews plus WhatsApp CTA" },
];

const TOOLS = [
  { icon: Camera, name: "Studio Photo", desc: "Any phone photo becomes a pro studio image.", href: "/app/studio" },
  { icon: Gem, name: "Product Card Maker", desc: "Photo plus details becomes a branded catalog card.", href: "/app/cards" },
  { icon: Calculator, name: "Gold Estimator", desc: "Weight, karat and rate gives an instant quote.", href: "/app/calculator" },
  { icon: Users, name: "Enquiry CRM", desc: "Log and track every enquiry to close.", href: "/app/crm" },
  { icon: CalendarDays, name: "Festive Calendar", desc: "Every festival with campaign plans.", href: "/app/calendar" },
  { icon: Star, name: "Review QR Kit", desc: "Turn happy buyers into 5-stars.", href: "/app/reviews" },
  { icon: Wallet, name: "Savings Scheme", desc: "A customer-facing scheme calculator.", href: "/app/scheme" },
  { icon: LayoutDashboard, name: "Owner Dashboard", desc: "Your whole shop on one screen.", href: "/app/dashboard" },
];

export default function PadmavathiStory() {
  return (
    <div className="-mx-4 -my-6 sm:-mx-8 lg:-ml-10 lg:-mr-8" style={{ background: CREAM, color: INK }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden px-5 py-20 sm:px-6 sm:py-32" style={{ background: `radial-gradient(120% 90% at 82% 8%, #e6203f 0%, ${RED} 44%, ${RED_DEEP} 100%)`, color: "#fbf5ec" }}>
        <div className="pointer-events-none absolute -right-32 -top-28 h-72 w-72 rounded-full opacity-40 sm:h-[420px] sm:w-[420px]" style={{ background: `radial-gradient(circle, ${GOLD_SOFT}55, transparent 65%)` }} />
        <div className="pointer-events-none absolute -bottom-28 -left-28 h-64 w-64 rounded-full opacity-30 sm:h-80 sm:w-80" style={{ background: `radial-gradient(circle, ${GOLD_SOFT}44, transparent 65%)` }} />
        <div className="relative mx-auto max-w-5xl">
          <div className="mb-6 text-[10px] font-semibold uppercase tracking-[0.22em] sm:mb-7 sm:text-[12px] sm:tracking-[0.38em]" style={{ color: GOLD_SOFT }}>
            Padmavathi Jewellery Mart &middot; Hanumantha Nagar, Bengaluru
          </div>
          <h1 className="font-display text-[clamp(2rem,7.4vw,4.75rem)] font-semibold leading-[1.05] tracking-tight">
            A trusted shop the city<br />hasn&apos;t <span className="italic" style={{ color: GOLD_SOFT }}>discovered yet.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[clamp(1rem,2.4vw,1.45rem)] leading-relaxed sm:mt-7" style={{ color: "#f4e4d6" }}>
            Padmavathi has the gold, the craft and the goodwill. What it is missing is a voice online. This is the plan to
            build one, and turn a quiet local jeweller into a name Bangalore searches for.
          </p>
          <div className="mt-9 inline-block border-t pt-4 text-[13px] tracking-wide sm:mt-11 sm:text-sm" style={{ borderColor: `${GOLD_SOFT}55`, color: "#e6d3bb" }}>
            A social-media growth strategy prepared for Padmavathi Jewellery Mart &middot; by Ospyr
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2" style={{ color: GOLD_SOFT }}>
          <span className="block animate-bounce"><ChevronDown size={20} /></span>
        </div>
      </header>

      {/* ── HONEST CURRENT STATE ─────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <Eyebrow>Where you are today, honestly</Eyebrow>
          <h2 className="max-w-3xl font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight" style={{ color: RED }}>
            You have been showing up. Almost no one is watching, yet.
          </h2>
          <GoldLine />
          <p className="max-w-3xl text-base leading-relaxed sm:text-lg" style={{ color: "#4a3b33" }}>
            This is not a criticism, it is the opportunity. You have already posted <b>229 times</b>. The effort is there.
            What is missing is the <i>system</i> that turns posts into reach, reach into followers, and followers into
            customers walking through your door.
          </p>
          <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { k: <CountUp value={385} />, d: "Instagram followers, a small, loyal start with enormous room to grow." },
              { k: <CountUp value={229} />, d: "Posts already published, you are consistent; the reach just is not there yet." },
              { k: "4.0", d: "Google star rating, real trust from only about 40 reviews. Proof people love you." },
              { k: "0", d: "Website, WhatsApp catalog or growth system, the whole engine is still to be built." },
            ].map((n, i) => (
              <div key={i} className="rounded-3xl bg-white p-7 shadow-[0_18px_50px_-24px_rgba(60,10,25,0.4)]" style={{ borderLeft: `5px solid ${RED}` }}>
                <div className="font-display text-[2rem] font-semibold leading-none tabular-nums sm:text-4xl" style={{ color: RED }}>{n.k}</div>
                <div className="mt-3 text-[14.5px]" style={{ color: MUTED }}>{n.d}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* ── THE OPPORTUNITY (red band) ───────────────────────────────────── */}
      <BandSection>
        <Eyebrow onDark>The opportunity</Eyebrow>
        <h2 className="max-w-4xl font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight">
          Bangalore is searching for a jeweller like you. It just cannot find you.
        </h2>
        <div className="mt-12 grid gap-9 sm:grid-cols-3 sm:gap-8">
          <StatBlock value="50%+" label="of jewellery purchase decisions are influenced by social media" />
          <StatBlock value="80%" label="of jewellery buyers research online before they ever step in" />
          <StatBlock value="No. 1" label="most buyers pick the shop they discover and trust online first" />
        </div>
        <p className="mx-auto mt-10 max-w-2xl text-center text-base sm:text-lg" style={{ color: "#f4e4d6" }}>
          Every one of those buyers in your area is on Instagram and Google right now. Today, they find your competitors.
          The entire strategy below is about making them find <b style={{ color: GOLD_SOFT }}>you</b>.
        </p>
      </BandSection>

      {/* ── PULL QUOTE ───────────────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <div className="relative overflow-hidden rounded-[22px] px-6 py-12 text-center shadow-[0_20px_60px_-20px_rgba(60,10,25,0.5)] sm:rounded-[28px] sm:px-12 sm:py-16" style={{ background: redWash, color: "#fbf5ec" }}>
            <span className="pointer-events-none absolute left-4 top-1 font-display text-[100px] leading-none sm:left-6 sm:top-2 sm:text-[160px]" style={{ color: `${GOLD_SOFT}22` }}>&ldquo;</span>
            <q className="relative block font-display text-[clamp(1.3rem,3.8vw,2.35rem)] font-medium italic leading-snug">
              You are not unknown because you are not good. You are unknown because no one has built your presence yet.
            </q>
            <div className="mt-6 text-[13px] font-semibold uppercase tracking-[0.2em]" style={{ color: GOLD_SOFT }}>The whole opportunity, in one line</div>
          </div>
        </Reveal>
      </Section>

      {/* ── THE STRATEGY / 7 ENGINES ─────────────────────────────────────── */}
      <Section>
        <Reveal>
          <Eyebrow>The complete social-media growth strategy</Eyebrow>
          <h2 className="font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight" style={{ color: RED }}>
            Seven engines that build a brand from a standing start.
          </h2>
          <GoldLine />
          <p className="max-w-3xl text-base leading-relaxed sm:text-lg" style={{ color: "#4a3b33" }}>
            Not random posting, a system. Each engine feeds the next: content earns reach, reach earns followers,
            followers become enquiries, enquiries become customers, customers become reviews that pull in more people.
          </p>
        </Reveal>
        <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ENGINES.map((e, i) => (
            <Reveal key={e.h} delay={(i % 3) * 60} className="h-full">
              <div className="flex h-full flex-col rounded-2xl bg-white p-7 shadow-[0_12px_34px_-20px_rgba(60,10,25,0.32)] transition-transform duration-200 hover:-translate-y-1" style={{ borderTop: `5px solid ${GOLD}` }}>
                <div className="flex items-center gap-2">
                  <e.icon size={22} style={{ color: RED }} />
                  <span className="text-[12px] font-bold uppercase tracking-[0.14em]" style={{ color: GOLD }}>{e.no}</span>
                </div>
                <h3 className="mt-3 font-display text-[19px] font-semibold" style={{ color: "#7a0b25" }}>{e.h}</h3>
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

      {/* ── SAMPLE WEEK (red band) ───────────────────────────────────────── */}
      <BandSection>
        <Eyebrow onDark>What a week looks like</Eyebrow>
        <h2 className="font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight">
          Consistent, planned, effortless for you.
        </h2>
        <p className="mt-5 max-w-3xl text-base sm:text-lg" style={{ color: "#f4e4d6" }}>
          A sample posting rhythm, we create it, you approve it, it goes out.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {WEEK.map((w) => (
            <div key={w.d} className="rounded-2xl border p-4 text-center" style={{ background: "#2b0512", borderColor: `${GOLD_SOFT}2e` }}>
              <div className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: GOLD_SOFT }}>{w.d}</div>
              <div className="mt-2 text-[14px] font-semibold" style={{ color: "#fbf5ec" }}>{w.t}</div>
              <div className="mt-1 text-[12px]" style={{ color: "#e6d0c2" }}>{w.s}</div>
            </div>
          ))}
        </div>
      </BandSection>

      {/* ── GROWTH TARGETS ───────────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <Eyebrow>The growth we build toward</Eyebrow>
          <h2 className="font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight" style={{ color: RED }}>
            From 385 followers to a real audience.
          </h2>
          <GoldLine />
          <p className="max-w-3xl text-base leading-relaxed sm:text-lg" style={{ color: "#4a3b33" }}>
            Directional targets, honest, not hype. The same shop, the same craft; just finally seen.
          </p>
          <div className="mt-11 grid gap-6 sm:grid-cols-3">
            {[
              { h: "90 days", n: "5,000+", c: "engaged followers and a steady stream of WhatsApp enquiries", mid: false },
              { h: "6 months", n: "15,000+", c: "reels regularly crossing 10K+ views, footfall visibly up", mid: true },
              { h: "12 months", n: "25K to 50K", c: "a recognised Bangalore jewellery brand online", mid: false },
            ].map((g) => (
              <div key={g.h} className={cn("rounded-3xl bg-white p-7 text-center shadow-[0_18px_50px_-24px_rgba(0,0,0,0.4)] sm:p-8", g.mid && "sm:scale-[1.05]")} style={{ borderTop: `5px solid ${g.mid ? RED : GOLD}` }}>
                <h4 className="text-[13px] font-bold uppercase tracking-[0.14em]" style={{ color: MUTED }}>{g.h}</h4>
                <div className="my-3 font-display text-[2.4rem] font-semibold leading-none sm:text-[2.9rem]" style={{ color: g.mid ? RED : "#7a0b25" }}>{g.n}</div>
                <div className="text-[15px]" style={{ color: MUTED }}>{g.c}</div>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm italic" style={{ color: MUTED }}>
            Targets, not guarantees. We report the real numbers every week so you always see exactly what is working.
          </p>
        </Reveal>
      </Section>

      {/* ── GIANTS / PROVEN PATH ─────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <Eyebrow>This is a proven path</Eyebrow>
          <h2 className="max-w-3xl font-display text-[clamp(1.45rem,4.2vw,2.7rem)] font-semibold leading-[1.16] tracking-tight" style={{ color: RED }}>
            Every big jewellery name started exactly where you are.
          </h2>
          <GoldLine />
          <p className="max-w-3xl text-base leading-relaxed sm:text-lg" style={{ color: "#4a3b33" }}>
            CaratLane, Mejuri and countless local shops grew the same way: consistent content builds desire, discovery
            brings new eyes, WhatsApp captures the interest, and the showroom closes the sale. We simply run that machine
            for Padmavathi.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Sparkles, b: "Content builds desire", p: "Reels and styling that make people want the piece." },
              { icon: Search, b: "Discovery brings eyes", p: "Instagram SEO plus Google and Justdial put you in front of buyers." },
              { icon: MessageCircle, b: "WhatsApp captures", p: "Every interested person becomes a real conversation." },
              { icon: Heart, b: "Trust closes", p: "Reviews plus your showroom turn enquiries into sales." },
            ].map((g) => (
              <div key={g.b} className="rounded-2xl bg-white p-6 shadow-[0_10px_30px_-18px_rgba(60,10,25,0.35)]">
                <g.icon size={22} style={{ color: RED }} />
                <b className="mt-3 block text-[17px]" style={{ color: "#7a0b25" }}>{g.b}</b>
                <p className="mt-2 text-sm" style={{ color: MUTED }}>{g.p}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* ── SERVICES / TIERS ─────────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <Eyebrow>Everything we will provide</Eyebrow>
          <h2 className="font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight" style={{ color: RED }}>
            Build the foundation now. Grow into the rest.
          </h2>
          <GoldLine />
          <Tier
            tone={redWash}
            badge={<Star size={18} />}
            title="Build now, the foundation"
            sub="First 90 days"
            items={[
              ["Instagram growth management", "Content pillars, reels engine, SEO, posting and community, done for you."],
              ["Jewellery content and reels", "Scroll-stopping photos and videos, weekly."],
              ["WhatsApp catalog and selling", "Collection in chat, instant enquiry replies."],
              ["Google Business plus Justdial", "Get found the moment someone searches nearby."],
              ["Reviews and trust engine", "Turn happy customers into a flood of 5-stars."],
              ["Festive campaign calendar", "Own every gold-buying festival, planned ahead."],
            ]}
          />
          <Tier
            tone={`linear-gradient(90deg, #9a6212, ${GOLD_SOFT})`}
            badge={<Sparkles size={18} />}
            title="Grow into, as you scale"
            sub="Once the foundation is live"
            items={[
              ["Catalog website plus live gold rate", "A digital front door with book-an-appointment."],
              ["Local micro-influencers and UGC", "Bangalore creators styling your pieces."],
              ["Meta and Google ads", "Reach ready buyers in your area, profitably."],
              ["Automations and auto-replies", "Never miss an enquiry as volume grows."],
              ["Gold-savings scheme and CRM", "Bring customers back, again and again."],
              ["Owner dashboard", "Your whole shop's numbers on one screen."],
            ]}
          />
        </Reveal>
      </Section>

      {/* ── ROADMAP (red band) ───────────────────────────────────────────── */}
      <BandSection>
        <Eyebrow onDark>The 90-day plan</Eyebrow>
        <h2 className="font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold tracking-tight">Set up. Grow. Prove.</h2>
        <div className="mt-11 grid gap-6 sm:grid-cols-3">
          {[
            { n: "Month 1", h: "Set the foundation", p: "Profile revamp, content system, WhatsApp catalog, Google and Justdial optimised, first proper shoot, reviews engine on.", tgt: "Presence looks professional" },
            { n: "Month 2", h: "Grow the reach", p: "Reels engine in full flow, Instagram SEO working, community management, first reels crossing thousands of views.", tgt: "Followers and enquiries climbing" },
            { n: "Month 3", h: "Prove the results", p: "A festive campaign, steady WhatsApp enquiries, a growing review count, and a clear upward curve you can see weekly.", tgt: "Footfall visibly up" },
          ].map((m) => (
            <div key={m.n} className="rounded-3xl bg-white p-8 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.5)]" style={{ borderTop: `5px solid ${RED}` }}>
              <div className="text-[12px] font-bold uppercase tracking-[0.16em]" style={{ color: GOLD }}>{m.n}</div>
              <h4 className="mt-2 mb-3 font-display text-xl font-semibold" style={{ color: "#7a0b25" }}>{m.h}</h4>
              <p className="text-[14.5px]" style={{ color: MUTED }}>{m.p}</p>
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold" style={{ background: CREAM_2, color: "#7a0b25" }}>
                <ArrowRight size={14} /> {m.tgt}
              </div>
            </div>
          ))}
        </div>
      </BandSection>

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
              Eight white-label tools and a full automation library are ready, configured for Padmavathi. Click any tool
              to open the real thing, running inside your OS.
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
                All eight tools are white-label, brand name, colours and WhatsApp number configure to Padmavathi in
                seconds.{" "}
                <Link href="/app/automations" className="inline-flex items-center gap-1 font-semibold underline underline-offset-2" style={{ color: GOLD_SOFT }}>
                  See all automations <ArrowRight size={13} />
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
            <h2 className="font-display text-[clamp(1.45rem,4vw,2.6rem)] font-semibold tracking-tight">We build the foundation, then grow it with you.</h2>
            <div className="mt-9 grid gap-6 sm:grid-cols-2">
              {[
                { n: "Phase 1 - Build", h: "Set up your entire presence", p: "Instagram revamp, content system, WhatsApp catalog, Google and Justdial, reviews engine, all built and switched on. A one-time setup that gives you a professional presence from day one." },
                { n: "Phase 2 - Grow", h: "Run and grow it every month", p: "Ospyr creates the content, runs the reels engine, manages the community and reports the numbers, as your monthly growth partner, so you focus on the shop and the customers." },
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
              The trust is already yours. Let&apos;s make Bangalore see it.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg" style={{ color: "#4a3b33" }}>
              A great shop deserves to be found. Let&apos;s build the presence Padmavathi has always deserved.
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
        <p className="mt-3 text-[13px]">The team behind the jeweller. &middot; Prepared for Padmavathi Jewellery Mart, Bengaluru.</p>
      </footer>
    </div>
  );
}

/* ── services tier ─────────────────────────────────────────────────────────── */
function Tier({ tone, badge, title, sub, items }: { tone: string; badge: React.ReactNode; title: string; sub: string; items: [string, string][] }) {
  return (
    <div className="mt-6 overflow-hidden rounded-[18px] bg-white shadow-[0_20px_60px_-28px_rgba(60,10,25,0.4)] sm:mt-8 sm:rounded-[22px]">
      <div className="flex flex-wrap items-center gap-3 px-5 py-5 sm:gap-4 sm:px-7 sm:py-6" style={{ background: tone, color: "#fbf5ec" }}>
        <span className="grid h-10 w-10 flex-none place-items-center rounded-full" style={{ background: "rgba(255,255,255,0.15)" }}>{badge}</span>
        <h3 className="min-w-0 font-display text-lg font-semibold sm:text-xl">{title}</h3>
        <span className="w-full text-[13px] sm:ml-auto sm:w-auto sm:text-right sm:text-sm" style={{ color: "rgba(255,255,255,0.9)" }}>{sub}</span>
      </div>
      <div className="grid gap-x-8 px-5 py-3 sm:grid-cols-2 sm:px-7 sm:py-4">
        {items.map(([b, s]) => (
          <div key={b} className="flex items-start gap-3 border-b py-4 last:border-b-0" style={{ borderColor: "#efe7d6" }}>
            <Check size={18} className="mt-0.5 flex-none" style={{ color: GOLD }} />
            <div>
              <b className="text-[15.5px]" style={{ color: INK }}>{b}</b>
              <span className="block text-[13.5px]" style={{ color: MUTED }}>{s}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
