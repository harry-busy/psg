"use client";

import * as React from "react";

/*
 * Lightweight, dependency-free Markdown renderer tuned for the Diyam content
 * docs. Supports: ATX headings, GFM pipe tables, blockquotes, ordered &
 * unordered lists (one level of nesting), horizontal rules, and inline
 * **bold**, *italic*, `code` and [links](url). Text is rendered verbatim —
 * nothing from the source docs is dropped.
 */

// Brand accent — mid emerald (two-colour constitution: emerald + sea glass only)
const GOLD = "#2D6B56";

/* ── inline ─────────────────────────────────────────────────────────────── */
function inline(text: string, keyBase: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // token regex: code | bold | italic | link
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const tok = m[0];
    const k = `${keyBase}-${i++}`;
    if (tok.startsWith("`")) {
      nodes.push(
        <code key={k} className="rounded bg-[var(--color-surface-2)] px-1.5 py-0.5 font-mono text-[0.85em]">
          {tok.slice(1, -1)}
        </code>
      );
    } else if (tok.startsWith("**")) {
      nodes.push(<strong key={k} className="font-semibold text-[var(--color-ink)]">{tok.slice(2, -2)}</strong>);
    } else if (tok.startsWith("*")) {
      nodes.push(<em key={k}>{tok.slice(1, -1)}</em>);
    } else {
      const mm = /\[([^\]]+)\]\(([^)]+)\)/.exec(tok)!;
      nodes.push(
        <a key={k} href={mm[2]} className="font-medium underline underline-offset-2" style={{ color: GOLD }} target="_blank" rel="noreferrer">
          {mm[1]}
        </a>
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

/* ── block parser ───────────────────────────────────────────────────────── */
export function Markdown({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let key = 0;
  const nk = () => `b${key++}`;

  while (i < lines.length) {
    let line = lines[i];

    // blank
    if (line.trim() === "") { i++; continue; }

    // horizontal rule
    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      blocks.push(<hr key={nk()} className="my-7 border-0 border-t" style={{ borderColor: "var(--color-line)" }} />);
      i++; continue;
    }

    // heading
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      const level = h[1].length;
      const txt = h[2].replace(/\s+#*\s*$/, "");
      const sizes = ["text-[1.7rem]", "text-[1.4rem]", "text-[1.18rem]", "text-[1.02rem]", "text-[0.95rem]", "text-[0.9rem]"];
      const El = (`h${Math.min(level, 6)}` as unknown) as keyof React.JSX.IntrinsicElements;
      blocks.push(
        React.createElement(
          El,
          {
            key: nk(),
            className: `font-display font-semibold tracking-tight text-[var(--color-ink)] ${sizes[level - 1]} ${level <= 2 ? "mt-9 mb-3" : "mt-6 mb-2"}`,
            style: level <= 2 ? { borderBottom: level === 1 ? `2px solid ${GOLD}44` : undefined, paddingBottom: level === 1 ? "0.4rem" : undefined } : undefined,
          },
          inline(txt, nk())
        )
      );
      i++; continue;
    }

    // table (GFM): current line has |, next line is a separator
    if (line.includes("|") && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(lines[i + 1]) && lines[i + 1].includes("-")) {
      const parseRow = (l: string) =>
        l.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
      const header = parseRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim() !== "") {
        rows.push(parseRow(lines[i]));
        i++;
      }
      blocks.push(
        <div key={nk()} className="my-5 overflow-x-auto rounded-xl border" style={{ borderColor: "var(--color-line)" }}>
          <table className="w-full border-collapse text-left text-[13.5px]">
            <thead>
              <tr style={{ background: "var(--color-surface-2)" }}>
                {header.map((c, ci) => (
                  <th key={ci} className="border-b px-3.5 py-2.5 font-semibold text-[var(--color-ink)]" style={{ borderColor: "var(--color-line)" }}>
                    {inline(c, `th${ci}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri} style={{ background: ri % 2 ? "var(--color-surface-2)" : "transparent" }}>
                  {header.map((_, ci) => (
                    <td key={ci} className="border-t px-3.5 py-2.5 align-top text-[var(--color-ink)]/85" style={{ borderColor: "var(--color-line)" }}>
                      {inline(r[ci] ?? "", `td${ri}-${ci}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // blockquote
    if (/^\s*>\s?/.test(line)) {
      const quote: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^\s*>\s?/, ""));
        i++;
      }
      blocks.push(
        <blockquote key={nk()} className="my-5 rounded-r-lg py-2 pl-4 pr-3 text-[15px] italic text-[var(--color-ink)]/80" style={{ borderLeft: `3px solid ${GOLD}`, background: "var(--color-surface-2)" }}>
          {quote.map((q, qi) => <p key={qi} className={qi ? "mt-2" : ""}>{inline(q, `q${qi}`)}</p>)}
        </blockquote>
      );
      continue;
    }

    // lists (ordered or unordered), with one level of nesting via indentation
    if (/^\s*([-*+]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\.\s+/.test(line);
      const items: { text: string; children: string[] }[] = [];
      while (i < lines.length && /^\s*([-*+]|\d+\.)\s+/.test(lines[i])) {
        const indent = (/^(\s*)/.exec(lines[i])![1] || "").length;
        const content = lines[i].replace(/^\s*([-*+]|\d+\.)\s+/, "");
        if (indent >= 2 && items.length) {
          items[items.length - 1].children.push(content);
        } else {
          items.push({ text: content, children: [] });
        }
        i++;
      }
      const ListTag = ordered ? "ol" : "ul";
      blocks.push(
        React.createElement(
          ListTag,
          { key: nk(), className: `my-4 space-y-1.5 pl-5 text-[15px] leading-relaxed text-[var(--color-ink)]/85 ${ordered ? "list-decimal" : "list-disc"}`, style: { marginLeft: "0.25rem" } },
          items.map((it, ii) => (
            <li key={ii} className="pl-1" style={{ "--tw-marker": GOLD } as React.CSSProperties}>
              {inline(it.text, `li${ii}`)}
              {it.children.length > 0 && (
                <ul className="mt-1.5 list-[circle] space-y-1 pl-5">
                  {it.children.map((c, ci) => <li key={ci}>{inline(c, `lic${ii}-${ci}`)}</li>)}
                </ul>
              )}
            </li>
          ))
        )
      );
      continue;
    }

    // paragraph (gather consecutive non-blank, non-structural lines)
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^(#{1,6})\s+/.test(lines[i]) &&
      !/^\s*>\s?/.test(lines[i]) &&
      !/^\s*([-*+]|\d+\.)\s+/.test(lines[i]) &&
      !/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(lines[i])
    ) {
      para.push(lines[i]);
      i++;
    }
    blocks.push(
      <p key={nk()} className="my-3.5 text-[15px] leading-relaxed text-[var(--color-ink)]/85">
        {para.map((p, pi) => (
          <React.Fragment key={pi}>
            {pi > 0 && <br />}
            {inline(p, `p${pi}`)}
          </React.Fragment>
        ))}
      </p>
    );
  }

  return <div className="diyam-md max-w-none">{blocks}</div>;
}
