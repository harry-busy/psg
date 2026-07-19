"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { DIYAM_REPORTS, diyamReport, type ReportSlide } from "@/lib/diyam/reports.generated";
import { SubHead } from "@/components/diyam/SubHead";
import { ArrowRight } from "lucide-react";

const GOLD = "#b8860b";
const RED = "#D2042D";

/* A single deck rendered as a page: every slide's text verbatim + the deck's
   own graphs (images) shown inline. Nothing from the source deck is dropped. */
export default function DiyamReportPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const r = slug ? diyamReport(slug) : undefined;
  if (!r) return notFound();

  const idx = DIYAM_REPORTS.findIndex((x) => x.slug === r.slug);
  const prev = idx > 0 ? DIYAM_REPORTS[idx - 1] : null;
  const next = idx < DIYAM_REPORTS.length - 1 ? DIYAM_REPORTS[idx + 1] : null;
  const accent = r.group === "own" ? RED : GOLD;

  return (
    <div className="mx-auto max-w-4xl">
      <SubHead
        eyebrow={`${r.style} · ${r.kind === "compare" ? "Comparison" : "Instagram"}`}
        title={r.title}
        sub={r.kind === "compare" ? `Diyam House of Silver vs ${r.competitor}, same period, slide for slide.` : `Full analytics report for ${r.subject}.`}
        backHref="/app/diyam/reports"
        backLabel="Reports & Decks"
        meta={
          <>
            <Chip>{r.period}</Chip>
            {r.comparePeriod && <Chip>vs {r.comparePeriod}</Chip>}
            <Chip>{r.nslides} slides</Chip>
            <span className="rounded-full px-3 py-1 font-mono text-[11px]" style={{ background: "var(--color-surface-2)", color: "var(--color-muted)" }}>
              {r.filename}
            </span>
          </>
        }
      />

      <div className="space-y-4">
        {r.slides.map((s) => <SlideCard key={s.n} slide={s} total={r.nslides} accent={accent} />)}
      </div>

      <nav className="mt-7 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link href={`/app/diyam/reports/${prev.slug}`} className="card flex items-center gap-2 p-4 transition hover:-translate-y-0.5 hover:shadow-md">
            <ArrowRight size={15} className="rotate-180" style={{ color: GOLD }} />
            <span>
              <span className="block text-[11px] uppercase tracking-wide text-[var(--color-muted)]">Previous report</span>
              <span className="text-[14px] font-semibold text-[var(--color-ink)]">{prev.title}</span>
            </span>
          </Link>
        ) : <span />}
        {next && (
          <Link href={`/app/diyam/reports/${next.slug}`} className="card flex items-center justify-end gap-2 p-4 text-right transition hover:-translate-y-0.5 hover:shadow-md">
            <span>
              <span className="block text-[11px] uppercase tracking-wide text-[var(--color-muted)]">Next report</span>
              <span className="text-[14px] font-semibold text-[var(--color-ink)]">{next.title}</span>
            </span>
            <ArrowRight size={15} style={{ color: GOLD }} />
          </Link>
        )}
      </nav>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold" style={{ background: `${GOLD}1e`, color: GOLD }}>
      {children}
    </span>
  );
}

const isStat = (l: string) => /^[₹$]?\s*[\d][\d.,]*\s*(%|K|M)?$/.test(l.trim()) || /^[\d.,]+%$/.test(l.trim());

function SlideCard({ slide, total, accent }: { slide: ReportSlide; total: number; accent: string }) {
  const hasImgs = slide.images.length > 0;
  return (
    <section className="card overflow-hidden p-0">
      <div className="flex items-center gap-2 border-b px-5 py-2.5" style={{ borderColor: "var(--color-line)", background: "var(--color-surface-2)" }}>
        <span className="flex h-6 min-w-6 items-center justify-center rounded-md px-1.5 text-[11px] font-bold text-white" style={{ background: accent }}>
          {slide.n}
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
          Slide {slide.n} of {total}
        </span>
      </div>

      <div className={`grid gap-5 p-5 ${hasImgs ? "lg:grid-cols-[1fr_1fr]" : ""}`}>
        {/* verbatim text */}
        <div className="min-w-0 space-y-1.5">
          {slide.lines.map((l, i) =>
            isStat(l) ? (
              <div key={i} className="font-display text-[1.55rem] font-semibold leading-none tabular-nums" style={{ color: accent }}>
                {l}
              </div>
            ) : (
              <p key={i} className="text-[13.5px] leading-relaxed text-[var(--color-ink)]/85">{l}</p>
            )
          )}
        </div>

        {/* the deck's own graphs / thumbnails */}
        {hasImgs && (
          <div className="grid grid-cols-2 gap-3 self-start">
            {slide.images.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt={`Slide ${slide.n} graphic ${i + 1}`}
                loading="lazy"
                className="w-full rounded-lg border bg-white object-contain p-1.5"
                style={{ borderColor: "var(--color-line)" }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
