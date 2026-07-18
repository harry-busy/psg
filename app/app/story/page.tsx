"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { StudioReferences } from "@/components/StudioReferences";
import {
  Camera, Gem, Calculator, Users, CalendarDays, Star, Wallet, LayoutDashboard,
  ArrowRight, ArrowDown, Zap, CalendarCheck, Sparkles, Check, Workflow, ChevronDown,
} from "lucide-react";

/*
 * The Growth Story - PSG Gold x Ospyr.
 * The research pitch (research/PSG_Gold_Experience.html) rebuilt natively into
 * the OS: Apple-styled, every "tool" wired to the real working module.
 * Colour rules honoured: red backgrounds use #D2042D, cream backgrounds #EBE5D5.
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
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn("transition-all duration-700 ease-out will-change-transform", seen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8", className)}
    >
      {children}
    </div>
  );
}

/* ── count-up ──────────────────────────────────────────────────────────────── */
function CountUp({ value, suffix = "", decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const dur = 1400;
      let start: number | null = null;
      const step = (t: number) => {
        if (start === null) start = t;
        const p = Math.min((t - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setN(value * eased);
        if (p < 1) requestAnimationFrame(step);
        else setN(value);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  const shown = decimals > 0 ? n.toFixed(decimals) : Math.round(n).toLocaleString("en-IN");
  return <span ref={ref}>{shown}{suffix}</span>;
}

/* ── small building blocks ─────────────────────────────────────────────────── */
function Eyebrow({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) {
  return (
    <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: onDark ? GOLD_SOFT : GOLD }}>
      {children}
    </div>
  );
}
function GoldLine() {
  return <div className="my-6 h-[3px] w-16 rounded-full" style={{ background: `linear-gradient(90deg, ${GOLD_SOFT}, transparent)` }} />;
}

const TOOLS = [
  { icon: Camera, name: "Studio Photo", desc: "Any phone photo becomes a pro studio image with premium backdrops, shadow and watermark.", href: "/app/studio" },
  { icon: Gem, name: "Product Card Maker", desc: "Photo plus price, purity and weight becomes a branded catalog card for WhatsApp and Instagram.", href: "/app/cards" },
  { icon: Calculator, name: "Gold Price Calculator", desc: "Weight, karat and rate plus making and GST gives an instant quote with a WhatsApp share.", href: "/app/calculator" },
  { icon: Users, name: "Enquiry CRM", desc: "Log every enquiry, move it through the pipeline, never miss a follow-up.", href: "/app/crm" },
  { icon: CalendarDays, name: "Festive Calendar", desc: "The full festival calendar with T-minus campaign plans and post ideas.", href: "/app/calendar" },
  { icon: Star, name: "Review QR Kit", desc: "Printable branded QR posters and cards that turn happy customers into 5-star reviews.", href: "/app/reviews" },
  { icon: Wallet, name: "Savings Scheme Calculator", desc: "A customer-facing gold-savings calculator that shows maturity value and captures leads.", href: "/app/scheme" },
  { icon: LayoutDashboard, name: "Owner Dashboard", desc: "One screen: enquiries, sales, revenue, follow-ups, top items and source charts.", href: "/app/dashboard" },
];

export default function GrowthStory() {
  return (
    <div className="-mx-4 -my-6 sm:-mx-8 lg:-ml-10 lg:-mr-8" style={{ background: CREAM, color: INK }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden px-5 py-20 sm:px-6 sm:py-32" style={{ background: `radial-gradient(120% 90% at 82% 8%, #e6203f 0%, ${RED} 44%, ${RED_DEEP} 100%)`, color: "#fbf5ec" }}>
        <div className="pointer-events-none absolute -right-32 -top-28 h-72 w-72 rounded-full opacity-40 sm:h-[420px] sm:w-[420px]" style={{ background: `radial-gradient(circle, ${GOLD_SOFT}55, transparent 65%)` }} />
        <div className="pointer-events-none absolute -bottom-28 -left-28 h-64 w-64 rounded-full opacity-30 sm:h-80 sm:w-80" style={{ background: `radial-gradient(circle, ${GOLD_SOFT}44, transparent 65%)` }} />
        <div className="relative mx-auto max-w-5xl">
          <div className="mb-6 text-[10px] font-semibold uppercase tracking-[0.22em] sm:mb-7 sm:text-[12px] sm:tracking-[0.4em]" style={{ color: GOLD_SOFT }}>
            PSG Gold &middot; Mysore &middot; Since generations
          </div>
          <h1 className="font-display text-[clamp(2rem,7.4vw,4.75rem)] font-semibold leading-[1.05] tracking-tight">
            You have <span className="italic" style={{ color: GOLD_SOFT }}>1.1 million</span> reasons to grow.
            <br />Let&apos;s stop losing them.
          </h1>
          <p className="mt-6 max-w-2xl text-[clamp(1rem,2.4vw,1.45rem)] leading-relaxed sm:mt-7" style={{ color: "#f4e4d6" }}>
            PSG Gold has the one thing every jeweller in India dreams of, a million people who already want you.
            This is the story of what happens when you finally answer them all.
          </p>
          <div className="mt-9 inline-block border-t pt-4 text-[13px] tracking-wide sm:mt-11 sm:text-sm" style={{ borderColor: `${GOLD_SOFT}55`, color: "#e6d3bb" }}>
            A growth vision prepared exclusively for PSG Gold &middot; by Ospyr
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.25em]" style={{ color: GOLD_SOFT }}>
          <span className="mx-auto block text-center animate-bounce"><ChevronDown size={20} className="mx-auto" /></span>
        </div>
      </header>

      {/* ── THE WIN (red band) ───────────────────────────────────────────── */}
      <BandSection>
        <Eyebrow onDark>You already did the hardest part</Eyebrow>
        <h2 className="max-w-3xl font-display text-[clamp(1.55rem,4.8vw,3rem)] font-semibold leading-[1.14] tracking-tight">
          Most jewellers spend a lifetime and a fortune chasing attention. You already command it.
        </h2>
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-9 sm:mt-14 sm:grid-cols-4 sm:gap-8">
          <StatBlock value={<CountUp value={1.1} decimals={1} suffix="M" />} label="Instagram followers" />
          <StatBlock value={<CountUp value={30} suffix="K" />} label="Average views per post" />
          <StatBlock value={<CountUp value={1000} suffix="+" />} label="New people messaging daily" />
          <StatBlock value={<CountUp value={750} />} label="Phone calls every day" />
        </div>
      </BandSection>

      {/* ── THE LEAK ─────────────────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <Eyebrow>But here is the leak</Eyebrow>
          <h2 className="max-w-3xl font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.12] tracking-tight" style={{ color: RED }}>
            The demand is real. The showroom has two hands.
          </h2>
          <GoldLine />
          <p className="max-w-3xl text-base leading-relaxed sm:text-lg" style={{ color: "#4a3b33" }}>
            Every day, over a thousand new people ask about your jewellery, and most never hear back. Not because you
            do not care, but because no human being can answer a thousand messages and a thousand calls a day while
            running a showroom. So the enquiries pile up.
          </p>
          <div className="mt-11 grid gap-5 sm:grid-cols-3">
            {[
              { k: "10,000+", d: "Unread messages, real customers, asking about real pieces, waiting." },
              { k: "~1,000", d: "Brand-new enquiries every single day that go unanswered." },
              { k: "500 to 1,000", d: "Calls a day; the ones that ring out are simply gone." },
            ].map((l) => (
              <div key={l.k} className="rounded-3xl bg-white p-7 shadow-[0_18px_50px_-24px_rgba(60,10,25,0.4)] sm:p-8" style={{ borderLeft: `5px solid ${RED}` }}>
                <div className="font-display text-[2rem] font-semibold leading-none sm:text-4xl" style={{ color: RED }}>{l.k}</div>
                <div className="mt-3 text-[15px]" style={{ color: MUTED }}>{l.d}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* ── SPEED TO LEAD (red band) ─────────────────────────────────────── */}
      <BandSection>
        <Eyebrow onDark>What an unanswered message really is</Eyebrow>
        <h2 className="max-w-4xl font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight">
          A customer who is about to buy, from whoever replies first.
        </h2>
        <p className="mt-5 text-lg" style={{ color: "#f0ddc7" }}>This is not opinion, it is how buying works everywhere:</p>
        <div className="mt-10 grid gap-9 sm:mt-11 sm:grid-cols-3 sm:gap-8">
          <StatBlock value="78%" label="of buyers purchase from the business that responds first" />
          <StatBlock value="8 to 21x" label="more likely to convert when you reply in 5 minutes vs an hour" />
          <StatBlock value="391%" label="jump in conversion when the reply comes in the first minute" />
        </div>
        <p className="mt-9 max-w-2xl text-sm italic" style={{ color: "#e7cdb4" }}>
          Right now, for most of those thousand daily enquiries, the reply time is not five minutes or an hour. It is never.
        </p>
      </BandSection>

      {/* ── PULL QUOTE ───────────────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <div className="relative overflow-hidden rounded-[22px] px-6 py-12 text-center shadow-[0_20px_60px_-20px_rgba(60,10,25,0.5)] sm:rounded-[28px] sm:px-12 sm:py-16" style={{ background: redWash, color: "#fbf5ec" }}>
            <span className="pointer-events-none absolute left-4 top-1 font-display text-[100px] leading-none sm:left-6 sm:top-2 sm:text-[160px]" style={{ color: `${GOLD_SOFT}22` }}>&ldquo;</span>
            <q className="relative block font-display text-[clamp(1.3rem,3.8vw,2.35rem)] font-medium italic leading-snug">
              You are not short of customers. You are drowning in them, and every unanswered message is a sale walking
              to another shop.
            </q>
            <div className="mt-6 text-[13px] font-semibold uppercase tracking-[0.2em]" style={{ color: GOLD_SOFT }}>The one problem worth solving</div>
          </div>
        </Reveal>
      </Section>

      {/* ── WORKED EXAMPLE ───────────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <Eyebrow>What can happen, one simple example</Eyebrow>
          <h2 className="font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.12] tracking-tight" style={{ color: RED }}>
            Imagine catching just a sliver of one day.
          </h2>
          <GoldLine />
          <p className="mb-8 max-w-3xl text-base leading-relaxed sm:mb-10 sm:text-lg" style={{ color: "#4a3b33" }}>
            You do not need to convert everyone. Watch what happens to a <b>single day&apos;s</b> new messages when every
            one of them gets an instant, on-brand answer, a price, and a booked visit, automatically.
          </p>
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-11">
            <div className="rounded-[22px] bg-white p-2 shadow-[0_20px_60px_-24px_rgba(60,10,25,0.4)]">
              <FlowRow icon={<span className="font-display text-lg font-bold">1</span>} title="1,000 new enquiries in a day" sub="the people already messaging you" />
              <FlowRow icon={<ArrowDown size={20} />} title="~150 are serious buyers" sub="asking price, purity, availability" />
              <FlowRow icon={<Zap size={20} />} title="All answered in seconds, 24/7" sub="catalog sent, quote given, visit offered" />
              <FlowRow icon={<CalendarCheck size={20} />} title="A handful book a showroom visit" sub="the system never forgets to follow up" />
              <FlowRow win icon={<Sparkles size={20} />} title="Even 3 to 5 extra sales, from ONE day" sub="multiplied across every day of the year" />
            </div>
            <div>
              <h3 className="font-display text-2xl font-semibold leading-snug" style={{ color: RED }}>
                The math is not the point. The multiplier is.
              </h3>
              <p className="mt-4 text-base leading-relaxed sm:text-lg" style={{ color: "#4a3b33" }}>
                A few extra sales a day, from messages you are <i>already receiving for free</i>, compounds into a growth
                curve most businesses would spend crores to chase.
              </p>
              <p className="mt-4 text-base leading-relaxed sm:text-lg" style={{ color: "#4a3b33" }}>
                And this is <b>before</b> a single new follower, reel, or ad, pure recovery of demand that exists today.
              </p>
            </div>
          </div>
          <p className="mt-8 max-w-3xl text-sm italic" style={{ color: MUTED }}>
            Illustrative example to show the shape of the opportunity, built only from your own numbers. Actual results
            depend on the pieces, the season, and execution; we track the real figures from day one.
          </p>
        </Reveal>
      </Section>

      {/* ── GROWTH SCENARIOS (red band) ──────────────────────────────────── */}
      <BandSection>
        <Eyebrow onDark>The growth we build toward</Eyebrow>
        <h2 className="font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.12] tracking-tight">
          Three honest scenarios, you choose the ambition.
        </h2>
        <p className="mt-4 max-w-2xl text-lg" style={{ color: "#f0ddc7" }}>
          The same audience, the same shop, just how much of the existing demand we successfully catch and convert.
        </p>
        <div className="mt-11 grid gap-6 sm:grid-cols-3">
          {[
            { h: "Conservative", n: "2 to 3x", c: "growth in qualified enquiries reaching the showroom", mid: false },
            { h: "Momentum", n: "4 to 6x", c: "as content, try-on and festive engines switch on", mid: true },
            { h: "Full engine", n: "8x+", c: "omnichannel, the audience fully monetised", mid: false },
          ].map((g) => (
            <div key={g.h} className={cn("rounded-3xl bg-white p-7 text-center shadow-[0_18px_50px_-24px_rgba(0,0,0,0.5)] sm:p-8", g.mid && "sm:scale-[1.05]")} style={{ borderTop: `5px solid ${g.mid ? RED : GOLD}` }}>
              <h4 className="text-[13px] font-bold uppercase tracking-[0.14em]" style={{ color: MUTED }}>{g.h}</h4>
              <div className="my-3 font-display text-[2.75rem] font-semibold leading-none sm:text-5xl" style={{ color: g.mid ? RED : "#7a0b25" }}>{g.n}</div>
              <div className="text-[15px]" style={{ color: MUTED }}>{g.c}</div>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-9 max-w-2xl text-center text-sm" style={{ color: "#e7cdb4" }}>
          Directional targets, not guarantees. We report the real curve every week so you always see exactly what is working.
        </p>
      </BandSection>

      {/* ── THE GIANTS ───────────────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <Eyebrow>This is exactly how the giants do it</Eyebrow>
          <h2 className="max-w-3xl font-display text-[clamp(1.45rem,4.2vw,2.7rem)] font-semibold leading-[1.16] tracking-tight" style={{ color: RED }}>
            Tanishq, CaratLane, Malabar, Mejuri. They all run the same machine.
          </h2>
          <GoldLine />
          <p className="max-w-3xl text-base leading-relaxed sm:text-lg" style={{ color: "#4a3b33" }}>
            Content builds desire, transparency builds trust, WhatsApp and Instagram capture the demand, and the showroom
            closes the sale. <b>PSG Gold already has the desire and the audience.</b> We are simply adding the capture
            layer the big brands paid millions to build.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { b: "Mejuri", p: "Community and influencer-led from day one. Our move: your micro-influencer and UGC engine." },
              { b: "CaratLane", p: "Transparency, try-at-home, AR try-on. Our move: live pricing and virtual try-on." },
              { b: "Tanishq / Malabar", p: "Festive calendars, gold-savings, omnichannel trust. Our move: your festive calendar and CRM." },
              { b: "Blue Nile", p: "Education-first buying and occasion campaigns. Our move: your content and occasion engine." },
            ].map((g) => (
              <div key={g.b} className="rounded-2xl bg-white p-6 shadow-[0_10px_30px_-18px_rgba(60,10,25,0.35)]">
                <b className="text-[17px]" style={{ color: "#7a0b25" }}>{g.b}</b>
                <p className="mt-2 text-sm" style={{ color: MUTED }}>{g.p}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* ── THE SYSTEM / SERVICES ────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <Eyebrow>Everything we will provide</Eyebrow>
          <h2 className="font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.12] tracking-tight" style={{ color: RED }}>
            The full system, in the order that matters.
          </h2>
          <GoldLine />
          <p className="max-w-3xl text-base leading-relaxed sm:text-lg" style={{ color: "#4a3b33" }}>
            First we stop the bleeding. Then we multiply. Then we expand. Nothing wasted, nothing before its time.
          </p>

          <Tier
            tone={redWash}
            badge={<Star size={18} />}
            title={"Must-have, “Capture Everything”"}
            sub="Weeks 1 to 4 - fixes the leak"
            items={[
              ["WhatsApp catalog and in-chat selling", "Your whole collection, browsable and priced, inside chat."],
              ["24/7 AI auto-reply (Instagram and WhatsApp)", "Price, purity, availability, answered in seconds, in Kannada and English."],
              ["Comment to auto-DM", "Every comment on a 30K-view reel becomes a captured lead."],
              ["Enquiry to appointment plus never-drop CRM", "All 1,000 a day logged and followed up until closed."],
              ["AI Kannada call agent", "Answers the 500 to 1,000 daily calls and books visits, round the clock."],
              ["Live gold rate plus instant quote", "Fast, transparent pricing with a calculator and branded cards."],
              ["Review and referral engine", "Turn happy buyers into 5-star trust and fresh reach."],
              ["Owner dashboard plus daily digest", "Enquiries, appointments, sales and rate, one screen, one morning message."],
            ]}
          />
          <Tier
            tone={`linear-gradient(90deg, #9a6212, ${GOLD_SOFT})`}
            badge={<Gem size={18} />}
            title="Multiply, build on the demand"
            sub="Months 2 to 3 - pours on fuel"
            items={[
              ["Reels engine plus AI content factory", "Feed your 1.1M audience consistently, effortlessly."],
              ["Virtual / AR try-on", "AR lifts purchase likelihood meaningfully."],
              ["Festive campaign engine", "Own Akshaya Tritiya, Dhanteras and wedding season."],
              ["Bridal 6-month nurture pipeline", "Your highest-ticket journey, on autopilot."],
              ["Catalog website plus live rate", "A digital front door with book-an-appointment."],
              ["Gold-savings scheme plus digital gold", "Recurring commitment and lead capture."],
              ["Micro-influencer and UGC engine", "Extend the reach that is already working."],
            ]}
          />
          <Tier
            tone="linear-gradient(90deg, #4a3b33, #6d5f52)"
            badge={<Sparkles size={18} />}
            title="Expand, when you are ready"
            sub="Later - scale and new revenue"
            items={[
              ["D2C store plus marketplaces", "Amazon, Flipkart, Meesho, ONDC and social shops."],
              ["NRI shipping and try-at-home", "Insured delivery for diaspora and city buyers."],
              ["Offline reach", "OOH, radio, print, cinema, expos and trunk shows."],
              ["Inventory, GST and BIS-HUID suite", "Compliance and stock, handled cleanly."],
              ["Loyalty program and smart mirror", "Tiers, points and an in-store AR experience."],
              ["Multi-branch rollout", "A playbook to open the next showrooms."],
            ]}
          />
        </Reveal>
      </Section>

      {/* ── FESTIVE (red band) ───────────────────────────────────────────── */}
      <BandSection>
        <Eyebrow onDark>The festive goldmine</Eyebrow>
        <h2 className="max-w-4xl font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight">
          A few festival days decide a huge slice of the year.
        </h2>
        <div className="mt-10 grid gap-9 sm:mt-12 sm:grid-cols-3 sm:gap-8">
          <StatBlock value="15 to 18%" label="of annual jewellery revenue comes from Akshaya Tritiya alone" />
          <StatBlock value="20 to 30%" label="of yearly revenue lands across the festive days" />
          <StatBlock value="South-led" label="South India leads Akshaya Tritiya buying, your home turf" />
        </div>
        <p className="mx-auto mt-9 max-w-2xl text-center text-lg" style={{ color: "#f0ddc7" }}>
          We build a campaign engine that plans, creates and broadcasts every festive push automatically, so you never
          miss the days that matter most.
        </p>
      </BandSection>

      <StudioReferences />

      {/* ── PROOF / TOOLS (red band) ─────────────────────────────────────── */}
      <div className="px-5 py-16 sm:px-6 sm:py-24" style={{ background: redWash, color: "#fbf5ec" }}>
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow onDark>The unfair advantage</Eyebrow>
            <h2 className="max-w-4xl font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight">
              Most agencies show slides. We are handing you working software, already built.
            </h2>
            <p className="mt-5 max-w-3xl text-base sm:text-lg" style={{ color: "#f4e4d6" }}>
              Eight white-label tools and <b style={{ color: GOLD_SOFT }}>52 production-ready automations</b> are done and
              ready. Click any tool below to open the real thing, running inside your OS.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:mt-11 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {TOOLS.map((t, i) => (
              <Reveal key={t.name} delay={i * 60} className="h-full">
                <Link
                  href={t.href}
                  className="group flex h-full flex-col rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-1"
                  style={{ background: "#2b0512", borderColor: `${GOLD_SOFT}30` }}
                >
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
                <b style={{ color: GOLD_SOFT }}>Plus 52 automations across 21 groups</b>, lead capture, 24/7 WhatsApp
                selling, AI content, festive campaigns, bridal drip, reviews, inventory, money, loyalty, AI sales
                intelligence, a Kannada voice agent, and the owner intelligence layer. Every one is import-ready with
                setup instructions built in.{" "}
                <Link href="/app/automations" className="inline-flex items-center gap-1 font-semibold underline underline-offset-2" style={{ color: GOLD_SOFT }}>
                  See all automations <ArrowRight size={13} />
                </Link>
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── COMMAND SCREEN ───────────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <Eyebrow>Run it all in an hour a day</Eyebrow>
          <h2 className="font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.12] tracking-tight" style={{ color: RED }}>
            One command screen. One morning message.
          </h2>
          <GoldLine />
          <p className="max-w-3xl text-base leading-relaxed sm:text-lg" style={{ color: "#4a3b33" }}>
            Everything above rolls up into a single owner&apos;s dashboard and a daily WhatsApp digest, so you spend your
            time on customers, designs and trust, while the system handles the rest.
          </p>
          <div className="mt-9 grid gap-3 sm:grid-cols-2">
            <Tile lab="Enquiries today" v="1,024" />
            <Tile lab="Appointments booked" v="18" />
            <Tile lab="Sales, this week" v="Live" />
            <Tile lab="22K gold rate" v="Live" />
            <div className="rounded-2xl p-6 sm:col-span-2" style={{ background: "linear-gradient(90deg, #25D366, #128C7E)", color: "#fff" }}>
              <div className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.85)" }}>8:00 AM, your morning digest</div>
              <div className="mt-2 text-[15px] leading-relaxed">
                Yesterday: 1,024 enquiries (142 bridal), 18 visits booked for today, 6 sales, gold rate steady, Akshaya
                campaign tracking ahead. One bestseller low on stock, reorder ready to approve.
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ── ROADMAP (red band) ───────────────────────────────────────────── */}
      <BandSection>
        <Eyebrow onDark>The 90-day plan</Eyebrow>
        <h2 className="font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold tracking-tight">Catch, build, scale.</h2>
        <div className="mt-11 grid gap-6 sm:grid-cols-3">
          {[
            { n: "Month 1", h: "Catch the demand", p: "WhatsApp catalog, 24/7 auto-reply, call agent, CRM and dashboard live. The leak stops, every enquiry gets answered." },
            { n: "Month 2", h: "Build the engine", p: "Reels and AI content, virtual try-on, comment-to-DM at scale, review engine, bridal and retention flows switch on." },
            { n: "Month 3", h: "Scale and prove", p: "A full festive campaign, influencer and UGC reach, and a documented growth curve you can see every week." },
          ].map((m) => (
            <div key={m.n} className="rounded-3xl bg-white p-7 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.5)] sm:p-8" style={{ borderTop: `5px solid ${RED}` }}>
              <div className="text-[12px] font-bold uppercase tracking-[0.16em]" style={{ color: GOLD }}>{m.n}</div>
              <h4 className="mt-2 mb-3 font-display text-xl font-semibold" style={{ color: "#7a0b25" }}>{m.h}</h4>
              <p className="text-[15px]" style={{ color: MUTED }}>{m.p}</p>
            </div>
          ))}
        </div>
      </BandSection>

      {/* ── ENGAGEMENT ───────────────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <div className="rounded-[22px] px-6 py-12 shadow-[0_20px_60px_-20px_rgba(60,10,25,0.5)] sm:rounded-[28px] sm:px-12 sm:py-14" style={{ background: redWash, color: "#fbf5ec" }}>
            <Eyebrow onDark>How we work together</Eyebrow>
            <h2 className="font-display text-[clamp(1.45rem,4vw,2.6rem)] font-semibold tracking-tight">Full build, then we run it with you.</h2>
            <div className="mt-9 grid gap-6 sm:grid-cols-2">
              {[
                { n: "Phase 1 - Build", h: "We build your entire capture system", p: "WhatsApp, auto-reply, call agent, CRM, dashboard, content and festive engines, set up, connected to your channels, and switched on. A one-time build that turns demand you are losing into demand you keep." },
                { n: "Phase 2 - Retainer", h: "We run and grow it every month", p: "Ospyr operates the machine, creates the content, runs the campaigns and reports the numbers, as your ongoing growth partner. You focus on the craft and the customers." },
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
              The trust is yours. Let&apos;s bring you the customers you are already earning.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg" style={{ color: "#4a3b33" }}>
              A million people are already listening. Let&apos;s make sure PSG Gold answers every one of them.
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
        <p className="mt-3 text-[13px]">The team behind the jeweller. &middot; Prepared for PSG Gold, Mysore.</p>
      </footer>
    </div>
  );
}

/* ── section wrappers ──────────────────────────────────────────────────────── */
function Section({ children }: { children: React.ReactNode }) {
  return (
    <section className="px-5 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}
function BandSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="px-5 py-16 sm:px-6 sm:py-24" style={{ background: redWash, color: "#fbf5ec" }}>
      <div className="mx-auto max-w-6xl">
        <Reveal>{children}</Reveal>
      </div>
    </section>
  );
}
function StatBlock({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="min-w-0">
      <div className="font-display text-[clamp(1.85rem,7vw,3.4rem)] font-semibold leading-none tabular-nums" style={{ color: GOLD_SOFT }}>{value}</div>
      <div className="mt-2.5 text-[13px] leading-snug sm:text-sm" style={{ color: "#e7d8c9" }}>{label}</div>
    </div>
  );
}
function FlowRow({ icon, title, sub, win = false }: { icon: React.ReactNode; title: string; sub: string; win?: boolean }) {
  return (
    <div
      className={cn("flex items-center gap-3.5 border-b px-4 py-4 last:border-b-0 sm:gap-4 sm:px-5 sm:py-5", win && "rounded-[18px] border-b-0")}
      style={win ? { background: redWash, color: "#fbf5ec", borderColor: "transparent" } : { borderColor: "#efe7d6" }}
    >
      <div
        className="grid h-11 w-11 flex-none place-items-center rounded-xl"
        style={win ? { background: GOLD_SOFT, color: "#7a0b25" } : { background: CREAM_2, color: "#7a0b25" }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <b className="block text-[15px] sm:text-[16px]" style={{ color: win ? GOLD_SOFT : INK }}>{title}</b>
        <span className="text-[13px] sm:text-[14px]" style={{ color: win ? "#f0ddc7" : MUTED }}>{sub}</span>
      </div>
    </div>
  );
}
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
function Tile({ lab, v }: { lab: string; v: string }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_10px_28px_-18px_rgba(60,10,25,0.3)]">
      <div className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: MUTED }}>{lab}</div>
      <div className="mt-2 font-display text-3xl font-semibold" style={{ color: "#7a0b25" }}>{v}</div>
    </div>
  );
}
