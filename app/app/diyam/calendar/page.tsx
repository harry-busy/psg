"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { diyamDoc } from "@/lib/diyam/content.generated";
import { Markdown } from "@/components/diyam/Markdown";
import { SubHead } from "@/components/diyam/SubHead";
import { CalendarDays } from "lucide-react";

const GOLD = "#b8860b";
const RED = "#D2042D";

interface Section { title: string; short: string; body: string; days: number; }

/*
 * Diyam's 30-Day Content Calendar (Diyam/content/02_...). The full document is
 * reproduced verbatim; it's just split into an intro + week tabs so each stretch
 * is easy to work through day by day. This is Diyam-specific and separate from
 * the shared Festive Calendar.
 */
export default function DiyamCalendarPage() {
  const doc = diyamDoc("calendar");
  const { intro, sections } = useMemo(() => parse(doc?.markdown ?? ""), [doc?.markdown]);
  const [active, setActive] = useState(0); // 0 = overview, else section index+1

  if (!doc) return null;

  const totalDays = sections.reduce((n, s) => n + s.days, 0);

  return (
    <div className="mx-auto max-w-4xl">
      <SubHead
        eyebrow="Content · 02"
        title="30-Day Content Calendar"
        sub="Mon 20 July → Tue 18 Aug 2026 · every day mapped: Reel, stories and posts with hook, script, shot list, audio, caption, hashtags and CTA. Built toward Raksha Bandhan (28 Aug)."
        backHref="/app/diyam/content"
        backLabel="Content Library"
        meta={
          <>
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold" style={{ background: `${RED}14`, color: RED }}>
              <CalendarDays size={13} /> {totalDays} days
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold" style={{ background: `${GOLD}1e`, color: GOLD }}>
              {sections.filter((s) => /week/i.test(s.title)).length} weeks
            </span>
            <span className="rounded-full px-3 py-1 font-mono text-[11px]" style={{ background: "var(--color-surface-2)", color: "var(--color-muted)" }}>
              {doc.filename}
            </span>
          </>
        }
      />

      {/* tab strip */}
      <div className="sticky top-0 z-10 -mx-4 mb-6 overflow-x-auto border-b border-[var(--color-line)] bg-[var(--color-canvas)]/85 px-4 py-2 backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:px-3">
        <div className="flex gap-1.5">
          <Tab active={active === 0} onClick={() => setActive(0)} label="Overview" />
          {sections.map((s, i) => (
            <Tab key={s.title} active={active === i + 1} onClick={() => setActive(i + 1)} label={s.short} badge={s.days || undefined} />
          ))}
        </div>
      </div>

      <article className="card p-6 sm:p-8">
        {active === 0 ? (
          <Markdown source={intro} />
        ) : (
          <>
            <h2 className="mb-1 font-display text-[1.4rem] font-semibold tracking-tight text-[var(--color-ink)]" style={{ borderBottom: `2px solid ${GOLD}44`, paddingBottom: "0.4rem" }}>
              {sections[active - 1].title}
            </h2>
            <Markdown source={sections[active - 1].body} />
          </>
        )}
      </article>

      <div className="mt-6 card p-5" style={{ borderLeft: `4px solid ${GOLD}` }}>
        <p className="text-[13.5px] leading-relaxed text-[var(--color-muted)]">
          The rest of the system — positioning, Instagram features, PR plan and the caption bank — lives in the{" "}
          <Link href="/app/diyam/content" className="font-semibold underline underline-offset-2" style={{ color: GOLD }}>Content Library</Link>.
        </p>
      </div>
    </div>
  );
}

function Tab({ active, onClick, label, badge }: { active: boolean; onClick: () => void; label: string; badge?: number }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-none items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-[13px] font-semibold transition"
      style={active ? { background: RED, color: "#fff" } : { background: "var(--color-surface-2)", color: "var(--color-muted)" }}
    >
      {label}
      {badge != null && (
        <span className="rounded-full px-1.5 text-[10px] font-bold" style={{ background: active ? "rgba(255,255,255,0.25)" : "var(--color-surface)", color: active ? "#fff" : GOLD }}>
          {badge}
        </span>
      )}
    </button>
  );
}

/* split the doc into the intro (before the first ## heading) and ## sections */
function parse(md: string): { intro: string; sections: Section[] } {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const heads: number[] = [];
  lines.forEach((l, i) => { if (/^##\s+/.test(l)) heads.push(i); });
  const intro = lines.slice(0, heads[0] ?? lines.length).join("\n").trim();
  const sections: Section[] = [];
  for (let h = 0; h < heads.length; h++) {
    const start = heads[h];
    const end = h + 1 < heads.length ? heads[h + 1] : lines.length;
    const title = lines[start].replace(/^##\s+/, "").trim();
    const body = lines.slice(start + 1, end).join("\n").trim();
    const days = (body.match(/^###\s+Day\s/gm) || []).length;
    const wk = /^WEEK\s+(\d+)/i.exec(title);
    const short = wk ? `Week ${wk[1]}` : title.replace(/["“”]/g, "").split(/[—(]/)[0].trim().slice(0, 22);
    sections.push({ title, short, body, days });
  }
  return { intro, sections };
}
