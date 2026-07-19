"use client";

import Link from "next/link";
import { DIYAM_DOCS } from "@/lib/diyam/content.generated";
import { ArrowRight, FileText, CalendarDays } from "lucide-react";

const GOLD = "#b8860b";
const RED = "#D2042D";

/*
 * Content hub for Diyam House of Silver. Lists every document in
 * Diyam/content/*.md as its own subpage, verbatim. The 30-day calendar links
 * to its dedicated calendar page. Workspace-gated to Diyam via the nav.
 */
export default function DiyamContentHub() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/app/diyam" className="text-[13px] font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)]">
          ← Growth Blueprint
        </Link>
        <div className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>
          The content machine
        </div>
        <h1 className="mt-2 font-display text-[clamp(1.8rem,4.6vw,2.8rem)] font-semibold leading-tight tracking-tight text-[var(--color-ink)]">
          Diyam Content Library
        </h1>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-[var(--color-muted)]">
          The complete 30-day content system prepared for Diyam House of Silver — positioning, the day-by-day
          calendar, the Instagram features playbook, the PR & growth plan, and the caption / hook / hashtag bank.
          Every document is reproduced here in full, exactly as written.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {DIYAM_DOCS.map((d) => {
          const isCal = d.slug === "calendar";
          const href = isCal ? "/app/diyam/calendar" : `/app/diyam/content/${d.slug}`;
          const Icon = isCal ? CalendarDays : FileText;
          return (
            <Link
              key={d.slug}
              href={href}
              className="group card flex flex-col p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              style={{ borderTop: `3px solid ${isCal ? RED : GOLD}` }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-9 w-9 flex-none items-center justify-center rounded-xl"
                  style={{ background: "var(--color-surface-2)", color: isCal ? RED : GOLD }}
                >
                  <Icon size={18} />
                </span>
                <span className="font-mono text-[11px] font-bold tracking-wide text-[var(--color-muted)]">
                  {d.num}
                </span>
              </div>
              <h2 className="mt-3.5 font-display text-[18px] font-semibold text-[var(--color-ink)]">{d.title}</h2>
              <p className="mt-1.5 flex-1 text-[13.5px] leading-relaxed text-[var(--color-muted)]">{d.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.12em]" style={{ color: GOLD }}>
                {isCal ? "Open the calendar" : "Read the document"}
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="mt-2 font-mono text-[10.5px] text-[var(--color-muted)]/70">{d.filename}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 card p-5" style={{ borderLeft: `4px solid ${GOLD}` }}>
        <p className="text-[13.5px] leading-relaxed text-[var(--color-muted)]">
          Looking for the analytics? The full Instagram reports and competitor comparison decks live in{" "}
          <Link href="/app/diyam/reports" className="font-semibold underline underline-offset-2" style={{ color: GOLD }}>
            Reports &amp; Decks
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
