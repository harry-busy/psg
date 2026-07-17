"use client";

import { useState } from "react";
import { PageHead } from "@/components/Shell";
import { Card, CardTitle, Stat, Chip, Badge } from "@/components/ui";
import { useCollection } from "@/lib/data/useStore";
import { useFounder } from "@/lib/founder";
import { BRANDS, brandDef, kpis } from "@/lib/brands";
import { PIPELINE, type BrandKey } from "@/lib/data/types";
import { inr, pct, daysAgo } from "@/lib/utils";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const NOTES: Record<BrandKey, string[]> = {
  aurra: ["Run a drop calendar with waitlists + early access.", "Watch RTO - apparel's silent margin killer (target < 15%).", "Scale only creatives with ROAS > 2.5; kill the rest."],
  designomics: ["Two engines: impulse D2C gifting + contract corporate gifting.", "Push quote-to-order for corporate; bulk GST invoicing.", "Occasion automations turn one-time gifters into recurring."],
  loopin: ["Rebrand + trademark is Month-1, non-negotiable (name clash).", "Pipeline: enquiry → quote → booked → delivered → testimonial.", "Runs Aurra launches + Designomics corporate experiences."],
  arihant: ["The engine: builds/markets the group at cost.", "Turn brand wins into case studies → outside clients.", "Move clients to monthly retainers for predictable revenue."],
};

export default function FounderBrands() {
  const metrics = useCollection("fMetrics");
  const leads = useCollection("fLeads");
  const f = useFounder();
  const [sel, setSel] = useState<BrandKey>("aurra");
  const def = brandDef(sel);

  const m30 = metrics.filter((m) => m.brand === sel && m.date >= daysAgo(29));
  const k = kpis(m30);
  const target = f.monthlyTargets[sel] || 0;
  const brandLeads = leads.filter((l) => l.brand === sel);

  const days = [...Array(30)].map((_, i) => daysAgo(29 - i));
  const chart = days.map((d) => ({ day: d.slice(5), revenue: m30.filter((x) => x.date === d).reduce((a, x) => a + x.revenue, 0) }));

  return (
    <>
      <PageHead title="Brands" sub="Deep-dive into each business in the group." />

      <div className="mb-5 flex flex-wrap gap-2">
        {BRANDS.map((b) => (
          <Chip key={b.key} active={sel === b.key} onClick={() => setSel(b.key)} className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: b.accent }} /> {b.name}
          </Chip>
        ))}
      </div>

      <Card className="mb-5" style={{ borderTop: `3px solid ${def.accent}` }}>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="font-display text-2xl font-semibold">{def.name}</h2>
            <p className="text-sm text-[var(--color-muted)]">{def.tagline}{def.site ? ` · ${def.site}` : ""}</p>
          </div>
          <Badge>{def.role}</Badge>
        </div>
      </Card>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat value={inr(k.revenue)} label="Revenue 30d" />
        <Stat value={k.spend ? `${k.roas.toFixed(1)}x` : "-"} label="ROAS" tone="var(--color-success)" />
        <Stat value={k.orders ? inr(k.aov) : "-"} label="AOV" />
        <Stat value={k.orders ? inr(k.cac) : "-"} label="CAC" />
        <Stat value={pct(k.rtoRate)} label="RTO rate" tone={k.rtoRate > 0.2 ? "var(--color-warn)" : undefined} />
        <Stat value={pct(k.contributionMargin)} label="Contribution" tone={k.contributionMargin < 0.1 ? "var(--color-warn)" : "var(--color-success)"} />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardTitle>Revenue - 30 days {target > 0 && <span className="float-right font-normal text-[var(--color-muted)]">target {inr(target)}/mo · {pct(target ? k.revenue / target : 0)}</span>}</CardTitle>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chart} margin={{ left: -18, right: 8, top: 8 }}>
              <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={def.accent} stopOpacity={0.35} /><stop offset="100%" stopColor={def.accent} stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" />
              <XAxis dataKey="day" fontSize={10} stroke="var(--color-muted)" interval={4} />
              <YAxis fontSize={10} stroke="var(--color-muted)" />
              <Tooltip formatter={(v: number) => inr(v)} />
              <Area type="monotone" dataKey="revenue" stroke={def.accent} fill="url(#bg)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardTitle>Playbook</CardTitle>
          <ul className="space-y-2 text-sm">
            {NOTES[sel].map((n) => <li key={n} className="flex gap-2"><span style={{ color: def.accent }}>-</span> {n}</li>)}
          </ul>
        </Card>
      </div>

      <Card className="mt-5">
        <CardTitle>{def.short} pipeline ({brandLeads.length})</CardTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {PIPELINE.map((st) => {
            const list = brandLeads.filter((l) => l.stage === st);
            const val = list.reduce((a, l) => a + (l.value || 0), 0);
            return (
              <div key={st} className="rounded-xl border border-[var(--color-line)] p-3">
                <div className="text-xs font-semibold uppercase text-[var(--color-muted)]">{st}</div>
                <div className="mt-1 text-lg font-bold">{list.length}</div>
                <div className="text-xs text-[var(--color-muted)]">{inr(val)}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}
