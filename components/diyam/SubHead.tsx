"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const GOLD = "#b8860b";

/** Shared header for Diyam content / report sub-pages. */
export function SubHead({
  eyebrow,
  title,
  sub,
  backHref,
  backLabel,
  meta,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  backHref: string;
  backLabel: string;
  meta?: React.ReactNode;
}) {
  return (
    <div className="mb-7">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
      >
        <ArrowLeft size={14} /> {backLabel}
      </Link>
      <div className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>
        {eyebrow}
      </div>
      <h1 className="mt-2 font-display text-[clamp(1.6rem,4vw,2.4rem)] font-semibold leading-tight tracking-tight text-[var(--color-ink)]">
        {title}
      </h1>
      {sub && <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-[var(--color-muted)]">{sub}</p>}
      {meta && <div className="mt-4 flex flex-wrap items-center gap-2">{meta}</div>}
    </div>
  );
}
