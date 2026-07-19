"use client";

import Link from "next/link";
import { DIYAM_REPORTS, type DiyamReport } from "@/lib/diyam/reports.generated";
import { ArrowRight, Instagram, BarChart3, Images } from "lucide-react";

const GOLD = "#b8860b";
const RED = "#D2042D";

const GROUPS: { key: DiyamReport["group"]; title: string; blurb: string }[] = [
  { key: "own", title: "Diyam's own Instagram reports", blurb: "The raw analytics for @diyamhouseofsilver, 18 Jun – 17 Jul 2026." },
  { key: "compare", title: "Head-to-head comparison decks", blurb: "Diyam measured side-by-side against peers and market leaders." },
  { key: "competitor", title: "Competitor Instagram reports", blurb: "The full standalone reports for the accounts we benchmark against." },
];

/* Reports hub for Diyam — every uploaded deck rendered as its own page,
   verbatim, with the deck's own graphs. Workspace-gated to Diyam via nav. */
export default function DiyamReportsHub() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/app/diyam" className="text-[13px] font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)]">
          ← Growth Blueprint
        </Link>
        <div className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>
          The analytics
        </div>
        <h1 className="mt-2 font-display text-[clamp(1.8rem,4.6vw,2.8rem)] font-semibold leading-tight tracking-tight text-[var(--color-ink)]">
          Reports &amp; Decks
        </h1>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-[var(--color-muted)]">
          Every Instagram report and comparison deck prepared for Diyam, reproduced in full — each slide&apos;s
          numbers exactly as reported, alongside the deck&apos;s own charts and graphs. {DIYAM_REPORTS.length} reports in total.
        </p>
      </div>

      <div className="space-y-9">
        {GROUPS.map((g) => {
          const items = DIYAM_REPORTS.filter((r) => r.group === g.key);
          if (!items.length) return null;
          return (
            <section key={g.key}>
              <h2 className="font-display text-[18px] font-semibold text-[var(--color-ink)]">{g.title}</h2>
              <p className="mt-1 text-[13.5px] text-[var(--color-muted)]">{g.blurb}</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((r) => {
                  const nImgs = r.slides.reduce((n, s) => n + s.images.length, 0);
                  const Icon = r.kind === "instagram" ? Instagram : BarChart3;
                  const accent = r.group === "own" ? RED : GOLD;
                  return (
                    <Link
                      key={r.slug}
                      href={`/app/diyam/reports/${r.slug}`}
                      className="group card flex flex-col p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                      style={{ borderTop: `3px solid ${accent}` }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "var(--color-surface-2)", color: accent }}>
                          <Icon size={16} />
                        </span>
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-muted)]">{r.style}</span>
                      </div>
                      <h3 className="mt-3 font-display text-[16px] font-semibold leading-snug text-[var(--color-ink)]">{r.title}</h3>
                      <p className="mt-1 text-[12.5px] text-[var(--color-muted)]">{r.period}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-[var(--color-muted)]">
                        <span className="rounded-full px-2 py-0.5" style={{ background: "var(--color-surface-2)" }}>{r.nslides} slides</span>
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5" style={{ background: "var(--color-surface-2)" }}>
                          <Images size={11} /> {nImgs} graphics
                        </span>
                      </div>
                      <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.12em]" style={{ color: accent }}>
                        Open report <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-8 card p-5" style={{ borderLeft: `4px solid ${GOLD}` }}>
        <p className="text-[13.5px] leading-relaxed text-[var(--color-muted)]">
          The strategy built on top of these numbers lives in the{" "}
          <Link href="/app/diyam/content" className="font-semibold underline underline-offset-2" style={{ color: GOLD }}>Content Library</Link>.
        </p>
      </div>
    </div>
  );
}
