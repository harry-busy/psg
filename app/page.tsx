import Link from "next/link";
import { VENDOR } from "@/lib/brand";
import {
  Camera, Calculator, Users, CalendarDays, Star, Wallet, LayoutDashboard,
  Sparkles, Mail, Heart, ArrowRight, ShieldCheck, Gem, Building2,
} from "lucide-react";

const MODULES = [
  { icon: Camera, name: "AI Photo Studio", desc: "Phone photo → luxury studio image, background removed, AI re-shoot, captions." },
  { icon: Gem, name: "Catalog", desc: "Every piece - purity, weight, HUID, price - reused across cards, posts & broadcasts." },
  { icon: Calculator, name: "Gold Estimator", desc: "22K/18K/14K auto-derive, making, wastage, old-gold, GST 3% - share on WhatsApp." },
  { icon: Users, name: "Enquiry CRM", desc: "Never lose a lead. Pipeline, follow-ups, AI lead scoring & next-best-action." },
  { icon: Wallet, name: "Savings Scheme", desc: "11+1 calculator that captures leads and computes maturity in grams of gold." },
  { icon: Heart, name: "Bridal Pipeline", desc: "6-month milestone drip for the highest-ticket customers you can't afford to drop." },
  { icon: CalendarDays, name: "Festive Calendar", desc: "Every gold festival with T-minus campaign plans, exportable to your calendar." },
  { icon: Sparkles, name: "AI Content Studio", desc: "Weekly captions from your catalog, festival campaigns, hashtag research." },
  { icon: Mail, name: "Email Concierge", desc: "AI writes warm, human replies to customers and sends them for you." },
  { icon: Star, name: "Reviews & QR", desc: "Printable QR posters that turn happy customers into 5-star Google reviews." },
  { icon: LayoutDashboard, name: "Owner Dashboard", desc: "Enquiries, sales, revenue, conversion - one calm screen, live." },
  { icon: ShieldCheck, name: "Compliance", desc: "PAN/KYC ≥ ₹2L, HUID hallmarking and GST - baked in, not bolted on." },
];

export default function Landing() {
  return (
    <main className="min-h-screen">
      {/* nav - frosted, Apple-style */}
      <header className="glass sticky top-0 z-50 border-b border-[var(--color-line)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-2 font-display text-[17px] font-semibold">
            <Gem size={18} className="text-[var(--color-crimson)]" /> {VENDOR.name}
          </div>
          <nav className="flex items-center gap-6 text-[13px]">
            <a href="#modules" className="hidden text-[var(--color-muted)] transition hover:text-[var(--color-ink)] sm:block">
              What's inside
            </a>
            <Link href="/login" className="rounded-full bg-[var(--color-ink)] px-4 py-1.5 font-medium text-[var(--color-surface)] transition hover:opacity-85">
              Open the OS
            </Link>
          </nav>
        </div>
      </header>

      {/* hero */}
      <section className="bg-warm-radial px-6 pb-16 pt-24 text-center sm:pt-32">
        <div className="mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-1.5 text-xs font-medium text-[var(--color-muted)]">
            <Sparkles size={13} className="text-[var(--color-gold)]" /> Operating systems for ambitious businesses
          </span>
          <h1 className="font-display mx-auto mt-7 max-w-3xl text-[2.75rem] font-semibold leading-[1.03] sm:text-7xl">
            One operating system.
            <br />
            <span className="text-[var(--color-crimson)]">Your</span> whole business.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-muted)] sm:text-xl">
            {VENDOR.pitch} A jewellery showroom or a founder's multi-brand group - one calm command center, real
            data, real AI, and automations that run while you sleep.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-[var(--color-crimson)] px-7 py-3 font-medium text-white transition hover:bg-[var(--color-crimson-600)]">
              Open the OS <ArrowRight size={16} />
            </Link>
            <a href="#modules" className="inline-flex items-center gap-1.5 rounded-full px-4 py-3 font-medium text-[var(--color-info)] transition hover:underline">
              See everything inside <ArrowRight size={15} />
            </a>
          </div>
          <p className="mt-5 text-xs text-[var(--color-muted)]">
            Real cloud backend · free AI included · works offline too
          </p>
        </div>
      </section>

      {/* sectors */}
      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="card p-7">
            <Building2 size={24} className="text-[var(--color-crimson)]" />
            <h3 className="font-display mt-3 text-xl font-semibold">Founder OS</h3>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              For founders like <b>Harshdeep Group</b> running multiple brands: a group command center with
              blended ROAS, contribution margin, runway, an AI chief-of-staff, approvals and per-brand deep dives.
            </p>
            <Link href="/login?sector=founder" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-crimson)]">
              Open the Founder OS <ArrowRight size={15} />
            </Link>
          </div>
          <div className="card p-7">
            <Gem size={24} className="text-[var(--color-crimson)]" />
            <h3 className="font-display mt-3 text-xl font-semibold">Jewellery OS</h3>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              For showrooms: studio photos, catalog, gold and silver estimates, enquiry CRM, savings schemes,
              festive campaigns, reviews, social analytics and an AI email concierge.
            </p>
            <div className="mt-4">
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-muted)]">Open a client workspace</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  "PSG Gold",
                  "Vardhman Jewels",
                  "Diyam House of Silver",
                  "Padmavathi Jewellery Mart",
                ].map((c) => (
                  <Link
                    key={c}
                    href={`/login?sector=jewellery&ws=${encodeURIComponent(c)}`}
                    className="rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink)] transition hover:border-[var(--color-crimson)] hover:text-[var(--color-crimson)]"
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/login?sector=jewellery" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-crimson)]">
              Open the Jewellery OS <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* modules grid */}
      <section id="modules" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display mb-3 text-center text-4xl font-semibold sm:text-5xl">
          Every tool. One system.
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-[var(--color-muted)]">
          Everything a growing business needs - and everything talks to everything else.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m) => (
            <div key={m.name} className="card p-5 transition hover:-translate-y-0.5">
              <m.icon size={22} className="text-[var(--color-crimson)]" />
              <h3 className="font-display mt-3 text-lg font-semibold">{m.name}</h3>
              <p className="mt-1 text-sm leading-relaxed text-[var(--color-muted)]">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* cta */}
      <section className="mx-auto max-w-4xl px-6 pb-24">
        <div className="card overflow-hidden p-10 text-center">
          <Gem className="mx-auto text-[var(--color-gold)]" size={30} />
          <h2 className="font-display mt-4 text-3xl font-semibold">Ready when you are.</h2>
          <p className="mx-auto mt-3 max-w-xl text-[var(--color-muted)]">
            Type <b>PSG Gold</b> for the jewellery OS or <b>Harshdeep Group</b> for the founder OS - your
            workspace name takes you straight to the right command center.
          </p>
          <Link
            href="/login"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-7 py-3 font-medium text-[var(--color-surface)] transition hover:opacity-85"
          >
            Open your workspace <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-[var(--color-line)] py-8 text-center text-xs text-[var(--color-muted)]">
        {VENDOR.product} · a white-label product by{" "}
        <a href={VENDOR.url} className="underline hover:text-[var(--color-ink)]">
          {VENDOR.name}
        </a>
      </footer>
    </main>
  );
}
