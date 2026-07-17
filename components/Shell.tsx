"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { navFor } from "@/lib/nav";
import { useSettings, saveSettings } from "@/lib/settings";
import { useFounder } from "@/lib/founder";
import { getSector, SECTOR_HOME } from "@/lib/sector";
import { useMode, setMode } from "@/lib/mode";
import { useCollection } from "@/lib/data/useStore";
import { kpis } from "@/lib/brands";
import { karatRates } from "@/lib/jewellery/calc";
import { inr, cn, daysAgo } from "@/lib/utils";
import { Menu, X, Moon, Sun, LogOut, Gem, Building2, ChevronRight } from "lucide-react";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const s = useSettings();
  const f = useFounder();
  const metrics = useCollection("fMetrics");
  const [open, setOpen] = useState(false);
  const [sector, setSector] = useState<"jewellery" | "founder">("jewellery");
  const [ws, setWs] = useState("");
  const mode = useMode();

  async function switchMode(m: "demo" | "live") {
    if (m === mode) return;
    if (m === "live" && !window.confirm("Switch to Live mode? This clears the sample demo data so you can start with your real data.")) return;
    await setMode(m, sector);
  }

  useEffect(() => {
    setSector(getSector());
    setWs(typeof window !== "undefined" ? localStorage.getItem("ospyr:workspace") || "" : "");
  }, [pathname]);
  useEffect(() => {
    document.documentElement.classList.toggle("velvet", !!s.velvet && sector === "jewellery");
  }, [s.velvet, sector]);
  useEffect(() => setOpen(false), [pathname]);

  const nav = navFor(sector);
  // Client-specific items (e.g. a pitch page) declare a `workspace` and only
  // show when the current workspace slug matches, so PSG and Diyam each see
  // their own blueprint and nothing else.
  const items = nav.items.filter((n) => !n.workspace || ws.includes(n.workspace));
  const groups = nav.groups.filter((g) => items.some((n) => n.group === g));
  const isFounder = sector === "founder";
  const title = isFounder ? f.groupName || "Group" : s.name || "Workspace";
  const rates = karatRates(s.rate24);

  // founder runway mini-stat
  const monthRev = kpis(metrics.filter((m) => m.date >= daysAgo(29))).revenue;
  const runwayMonths = f.monthlyBurn ? (f.cashBalance / f.monthlyBurn).toFixed(1) : "∞";

  return (
    <div className="min-h-screen">
      {/* mobile top bar */}
      <div className="glass sticky top-0 z-30 flex items-center justify-between border-b border-[var(--color-line)] px-4 py-3 lg:hidden">
        <button onClick={() => setOpen(true)} aria-label="Menu"><Menu size={22} /></button>
        <span className="font-display font-semibold">{title}</span>
        <span className="text-xs text-[var(--color-muted)]">
          {isFounder ? `${runwayMonths}mo runway` : `${inr(rates["22K"])}/g`}
        </span>
      </div>

      {/* ── desktop: hover-reveal drawer. A slim handle sits on the left edge;
          hovering (or focusing) it slides the full nav out over the content. ── */}
      <div className="group/side">
        {/* always-visible hover handle (desktop only) */}
        <div className="fixed inset-y-0 left-0 z-40 hidden w-3.5 cursor-pointer items-center justify-center border-r border-[var(--color-line)] bg-[var(--color-surface-2)] text-[var(--color-muted)] transition-colors group-hover/side:bg-[var(--color-surface)] lg:flex">
          <ChevronRight size={13} className="transition-transform duration-300 group-hover/side:translate-x-px" />
        </div>

        {/* sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex w-80 flex-col overflow-y-auto border-r border-[var(--color-line)] bg-[var(--color-surface)] px-5 py-6 transition-transform duration-300 ease-out",
            // mobile: hamburger drawer
            open ? "translate-x-0" : "-translate-x-full",
            // desktop: hidden off-canvas, revealed on hover/focus of the handle
            "lg:-translate-x-full lg:shadow-2xl lg:group-hover/side:translate-x-0 lg:focus-within:translate-x-0"
          )}
        >
        <div className="mb-5 flex items-center justify-between">
          <Link href={SECTOR_HOME[sector]} className="flex items-center gap-2 font-display text-lg font-semibold">
            {isFounder ? <Building2 size={18} className="text-[var(--color-crimson)]" /> : <Gem size={18} className="text-[var(--color-crimson)]" />}
            {title}
          </Link>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close"><X size={20} /></button>
        </div>

        {/* sector-specific summary chip */}
        <div className="mb-5 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-2)] p-3.5 text-xs tabular-nums">
          {isFounder ? (
            <>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[var(--color-muted)]">Cash</span>
                <span className="truncate font-display text-sm font-semibold">{inr(f.cashBalance)}</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-[var(--color-muted)]">
                <span>{runwayMonths} mo runway</span><span className="truncate">{inr(monthRev)} · 30d</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[var(--color-muted)]">Gold 22K</span>
                <span className="truncate font-display text-sm font-semibold">{inr(rates["22K"])}/g</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-[var(--color-muted)]">
                <span>24K {inr(rates["24K"])}</span><span className="truncate">Ag {inr(s.rateSilver)}</span>
              </div>
            </>
          )}
        </div>

        <nav className="space-y-5">
          {groups.map((g) => (
            <div key={g} className="space-y-1">
              <div className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-muted)]">{g}</div>
              {items.filter((n) => n.group === g).map((n) => {
                const active = pathname === n.href;
                return (
                  <Link key={n.href} href={n.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                      active ? "bg-[var(--color-surface-2)] font-semibold text-[var(--color-ink)]" : "font-medium text-[var(--color-ink)]/80 hover:bg-[var(--color-surface-2)]"
                    )}>
                    <n.icon size={18} className={active ? "text-[var(--color-crimson)]" : "text-[var(--color-muted)]"} />
                    {n.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* demo / live data mode */}
        <div className="mt-5">
          <div className="mb-1.5 px-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-muted)]">Data mode</div>
          <div className="flex rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-2)] p-1 text-xs font-semibold">
            <button onClick={() => switchMode("demo")} className={cn("flex-1 rounded-lg py-1.5 transition", mode === "demo" ? "bg-[var(--color-crimson)] text-white shadow-sm" : "text-[var(--color-muted)] hover:text-[var(--color-ink)]")}>Demo</button>
            <button onClick={() => switchMode("live")} className={cn("flex-1 rounded-lg py-1.5 transition", mode === "live" ? "bg-[var(--color-ink)] text-white shadow-sm" : "text-[var(--color-muted)] hover:text-[var(--color-ink)]")}>Live</button>
          </div>
          <p className="mt-1.5 px-1 text-[10px] leading-snug text-[var(--color-muted)]">
            {mode === "demo" ? "Showing sample data for a walkthrough." : "Your real workspace. Demo data is cleared."}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[var(--color-line)] pt-4">
          {!isFounder && (
            <button onClick={() => saveSettings({ velvet: !s.velvet })}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-[var(--color-muted)] hover:bg-[var(--color-surface-2)]">
              {s.velvet ? <Sun size={15} /> : <Moon size={15} />} {s.velvet ? "Light" : "Velvet"}
            </button>
          )}
          <button onClick={async () => { const { signOutCloud } = await import("@/lib/data/supabase"); await signOutCloud().catch(() => {}); localStorage.removeItem("ospyr:workspace"); router.push("/login"); }}
            className="ml-auto flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-[var(--color-muted)] hover:bg-[var(--color-surface-2)]">
            <LogOut size={15} /> Switch
          </button>
        </div>
        </aside>
      </div>

      {open && <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setOpen(false)} />}
      <main className="min-w-0 px-4 py-6 sm:px-8 lg:pl-10">{children}</main>
    </div>
  );
}

/** Page header used by every module. */
export function PageHead({ title, sub, actions }: { title: string; sub?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
        {sub && <p className="mt-1 text-sm text-[var(--color-muted)]">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
