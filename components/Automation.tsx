"use client";

import { useState } from "react";
import { Card, Badge } from "@/components/ui";
import { Workflow, ChevronDown, ChevronRight } from "lucide-react";

/**
 * Clickable automation catalog: each workflow expands to a plain-English
 * description and an easy-to-read flowchart. Used by both the PSG Gold
 * (jewellery) and Harshdeep Group (founder) automation pages.
 */

export type Kind = "trigger" | "ai" | "action" | "decision" | "output";
export type Step = { t: string; k: Kind };
export type Flow = { title: string; desc: string; steps: Step[] };
export type Group = { batch: string; flows: Flow[] };

// Terse builders so the page data reads like the flow itself.
export const trg = (t: string): Step => ({ t, k: "trigger" });
export const ai = (t: string): Step => ({ t, k: "ai" });
export const act = (t: string): Step => ({ t, k: "action" });
export const dec = (t: string): Step => ({ t, k: "decision" });
export const out = (t: string): Step => ({ t, k: "output" });

const KIND: Record<Kind, { label: string; color: string; bg: string }> = {
  trigger: { label: "Trigger", color: "var(--color-info)", bg: "color-mix(in srgb, var(--color-info) 12%, transparent)" },
  ai: { label: "AI", color: "#7c4dbf", bg: "color-mix(in srgb, #7c4dbf 12%, transparent)" },
  action: { label: "Action", color: "var(--color-crimson)", bg: "color-mix(in srgb, var(--color-crimson) 10%, transparent)" },
  decision: { label: "Check", color: "var(--color-warn)", bg: "color-mix(in srgb, var(--color-warn) 14%, transparent)" },
  output: { label: "Output", color: "var(--color-success)", bg: "color-mix(in srgb, var(--color-success) 12%, transparent)" },
};

function Node({ step }: { step: Step }) {
  const k = KIND[step.k];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium"
      style={{ borderColor: k.color, background: k.bg, color: "var(--color-ink)" }}
    >
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: k.color }} />
      {step.t}
    </span>
  );
}

export function Flowchart({ steps }: { steps: Step[] }) {
  return (
    <div className="flex flex-wrap items-center gap-y-2">
      {steps.map((s, i) => (
        <span key={i} className="flex items-center">
          <Node step={s} />
          {i < steps.length - 1 && <ChevronRight size={15} className="mx-1 shrink-0 text-[var(--color-muted)]" />}
        </span>
      ))}
    </div>
  );
}

function Row({ flow }: { flow: Flow }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="border-t border-[var(--color-line)] first:border-t-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 py-2.5 text-left text-sm"
        aria-expanded={open}
      >
        <ChevronDown size={15} className={`shrink-0 text-[var(--color-muted)] transition-transform ${open ? "" : "-rotate-90"}`} />
        <span className="font-medium">{flow.title}</span>
      </button>
      {open && (
        <div className="pb-3 pl-6">
          <p className="mb-3 text-sm text-[var(--color-muted)]">{flow.desc}</p>
          <Flowchart steps={flow.steps} />
        </div>
      )}
    </li>
  );
}

function Legend() {
  return (
    <div className="mb-5 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-[var(--color-muted)]">
      {(Object.keys(KIND) as Kind[]).map((k) => (
        <span key={k} className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: KIND[k].color }} />
          {KIND[k].label}
        </span>
      ))}
    </div>
  );
}

export function AutomationCatalog({ groups }: { groups: Group[] }) {
  return (
    <>
      <Legend />
      <div className="grid items-start gap-4 lg:grid-cols-2">
        {groups.map((g) => (
          <Card key={g.batch}>
            <div className="mb-1 flex items-center gap-2">
              <Workflow size={16} className="text-[var(--color-crimson)]" />
              <b className="font-display">{g.batch}</b>
              <Badge className="ml-auto">{g.flows.length} flows</Badge>
            </div>
            <p className="mb-1 text-xs text-[var(--color-muted)]">Tap any workflow to see how it runs.</p>
            <ul>
              {g.flows.map((f) => <Row key={f.title} flow={f} />)}
            </ul>
          </Card>
        ))}
      </div>
    </>
  );
}
