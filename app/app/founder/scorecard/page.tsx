"use client";

import { PageHead } from "@/components/Shell";
import { Card, CardTitle, Button, Badge, useToast } from "@/components/ui";
import { useCollection } from "@/lib/data/useStore";
import { useFounder } from "@/lib/founder";
import { BRANDS, kpis } from "@/lib/brands";
import { inr, pct, daysAgo } from "@/lib/utils";
import { tgText } from "@/lib/telegram";
import { Send } from "lucide-react";

export default function FounderScorecard() {
  const metrics = useCollection("fMetrics");
  const leads = useCollection("fLeads");
  const f = useFounder();
  const toast = useToast();

  const wk = daysAgo(6);
  const rows = BRANDS.map((b) => {
    const k = kpis(metrics.filter((m) => m.brand === b.key && m.date >= wk));
    const weeklyTarget = (f.monthlyTargets[b.key] || 0) / 4.33;
    const progress = weeklyTarget ? k.revenue / weeklyTarget : 0;
    const wonThisWeek = leads.filter((l) => l.brand === b.key && l.stage === "Won" && l.created >= wk).length;
    return { b, k, weeklyTarget, progress, wonThisWeek, status: progress >= 1 ? "ahead" : progress >= 0.7 ? "on track" : "behind" };
  });

  function send() {
    const msg = `${f.groupName} - weekly scorecard\n` + rows.map((r) => `${r.b.short}: ${inr(r.k.revenue)} / ${inr(r.weeklyTarget)} (${pct(r.progress)}) ${r.status}`).join("\n");
    tgText(msg).then((r) => toast(r.ok ? "Scorecard sent to Telegram" : r.error || "Telegram not configured"));
  }

  const color = (s: string) => (s === "ahead" ? "#1E7D34" : s === "on track" ? "#C05621" : "#B02A37");

  return (
    <>
      <PageHead title="Weekly Scorecard" sub="Targets vs actuals per brand - this week." actions={<Button variant="tg" onClick={send}><Send size={15} /> Send to Telegram</Button>} />

      <div className="grid gap-4 sm:grid-cols-2">
        {rows.map((r) => (
          <Card key={r.b.key} style={{ borderTop: `3px solid ${r.b.accent}` }}>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">{r.b.name}</h3>
              <span className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: color(r.status) }}>{r.status}</span>
            </div>
            <div className="mt-3 flex items-end justify-between">
              <div><div className="text-2xl font-extrabold font-display">{inr(r.k.revenue)}</div><div className="text-xs text-[var(--color-muted)]">of {inr(r.weeklyTarget)} weekly target</div></div>
              <div className="text-right text-sm"><div>{pct(r.progress)}</div><div className="text-xs text-[var(--color-muted)]">{r.wonThisWeek} deals won</div></div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
              <div className="h-full rounded-full" style={{ width: `${Math.min(100, r.progress * 100)}%`, background: r.b.accent }} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--color-muted)]">
              <Badge>ROAS {r.k.spend ? r.k.roas.toFixed(1) + "x" : "-"}</Badge>
              <Badge>RTO {pct(r.k.rtoRate)}</Badge>
              <Badge>Margin {pct(r.k.contributionMargin)}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
