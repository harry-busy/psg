"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { DIYAM_DOCS, diyamDoc } from "@/lib/diyam/content.generated";
import { Markdown } from "@/components/diyam/Markdown";
import { SubHead } from "@/components/diyam/SubHead";
import { ArrowRight } from "lucide-react";

const GOLD = "#4E8A72";   // sea glass dark

/* Renders one Diyam content document (verbatim markdown) with prev/next nav. */
export default function DiyamDocPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const doc = slug ? diyamDoc(slug) : undefined;
  if (!doc) return notFound();

  const idx = DIYAM_DOCS.findIndex((d) => d.slug === doc.slug);
  const prev = idx > 0 ? DIYAM_DOCS[idx - 1] : null;
  const next = idx < DIYAM_DOCS.length - 1 ? DIYAM_DOCS[idx + 1] : null;
  const linkFor = (s: string) => (s === "calendar" ? "/app/diyam/calendar" : `/app/diyam/content/${s}`);

  return (
    <div className="mx-auto max-w-3xl">
      <SubHead
        eyebrow={`Content · ${doc.num}`}
        title={doc.title}
        sub={doc.desc}
        backHref="/app/diyam/content"
        backLabel="Content Library"
        meta={
          <span className="rounded-full px-3 py-1 font-mono text-[11px]" style={{ background: "var(--color-surface-2)", color: "#3F6E5C" }}>
            {doc.filename}
          </span>
        }
      />

      <article className="card p-6 sm:p-8">
        <Markdown source={doc.markdown} />
      </article>

      <nav className="mt-6 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link href={linkFor(prev.slug)} className="card flex items-center gap-2 p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md">
            <ArrowRight size={15} className="rotate-180" style={{ color: GOLD }} />
            <span>
              <span className="block text-[11px] uppercase tracking-wide text-[var(--color-muted)]">Previous</span>
              <span className="text-[14px] font-semibold text-[var(--color-ink)]">{prev.title}</span>
            </span>
          </Link>
        ) : <span />}
        {next && (
          <Link href={linkFor(next.slug)} className="card flex items-center justify-end gap-2 p-4 text-right transition hover:-translate-y-0.5 hover:shadow-md">
            <span>
              <span className="block text-[11px] uppercase tracking-wide text-[var(--color-muted)]">Next</span>
              <span className="text-[14px] font-semibold text-[var(--color-ink)]">{next.title}</span>
            </span>
            <ArrowRight size={15} style={{ color: GOLD }} />
          </Link>
        )}
      </nav>
    </div>
  );
}
