"use client";

import Link from "next/link";
import { PageHead } from "@/components/Shell";
import { Card, CardTitle, Stat, Button, Badge, useToast } from "@/components/ui";
import { useCollection } from "@/lib/data/useStore";
import { useFounder } from "@/lib/founder";
import { setMode } from "@/lib/mode";
import { BRANDS, brandDef, kpis, leadValue } from "@/lib/brands";
import { inr, daysAgo, pct } from "@/lib/utils";
import { tgText } from "@/lib/telegram";
import { BRAND_KEYS } from "@/lib/data/types";
import { Send, ArrowRight, AlertTriangle, TrendingUp } from "lucide-react";

export default function CommandCenter() {
  const metrics = useCollection("fMetrics");
  const leads = useCollection("fLeads");
  const approvals = useCollection("fApprovals");
  const f = useFounder();
  const toast = useToast();

  const last30 = metrics.filter((m) => m.date >= daysAgo(29));
  const group = kpis(last30);
  const targetTotal = BRAND_KEYS.reduce((a, k) => a + (f.monthlyTargets[k] || 0), 0);
  const runway = f.monthlyBurn ? f.cashBalance / f.monthlyBurn : Infinity;
  const pipeline = leadValue(leads, ["Qualified", "Quote"]);
  const pendingApprovals = approvals.filter((a) => a.status === "pending").length;

  // per-brand rollup
  const perBrand = BRAND_KEYS.map((k) => {
    const k30 = kpis(last30.filter((m) => m.brand === k));
    const target = f.monthlyTargets[k] || 0;
    return { key: k, def: brandDef(k), k: k30, target, progress: target ? k30.revenue / target : 0 };
  });

  // alerts
  const alerts: string[] = [];
  perBrand.forEach((b) => {
    if (b.k.spend > 0 && b.k.roas < 1.5) alerts.push(`${b.def.short}: ROAS ${b.k.roas.toFixed(1)}x is below 1.5 - pause weak ads.`);
    if (b.k.rtoRate > 0.25) alerts.push(`${b.def.short}: RTO ${pct(b.k.rtoRate)} is eating margin - tighten COD.`);
    if (b.target && b.progress < 0.5) alerts.push(`${b.def.short}: at ${pct(b.progress)} of the monthly target.`);
  });
  if (runway < 6) alerts.push(`Group runway is ${runway.toFixed(1)} months - watch burn.`);

  const empty = metrics.length === 0;

  function digest() {
    const msg =
      `${f.groupName} - command digest ${daysAgo(0)}\n` +
      `30d revenue ${inr(group.revenue)} (target ${inr(targetTotal)})\n` +
      `Blended ROAS ${group.roas.toFixed(1)}x · CAC ${inr(group.cac)} · Contribution ${pct(group.contributionMargin)}\n` +
      `Cash ${inr(f.cashBalance)} · runway ${runway.toFixed(1)} mo\n` +
      `Pipeline ${inr(pipeline)} · ${pendingApprovals} approvals waiting`;
    tgText(msg).then((r) => toast(r.ok ? "Digest sent to Telegram" : r.error || "Telegram not configured"));
  }

  return (
    <>
      <PageHead
        title="Command Center"
        sub={`${f.groupName} - four brands, one screen`}
        actions={<>
          {empty && <Button variant="ink" onClick={() => setMode("demo", "founder").then(() => toast("Demo data loaded"))}>Load demo data</Button>}
          <Button variant="tg" onClick={digest}><Send size={15} /> 8am digest</Button>
        </>}
      />

      {empty ? (
        <Card className="text-center">
          <p className="py-10 text-[var(--color-muted)]">
            No data yet. Click <b>Load demo data</b> above to explore the full operating system, or add real
            numbers via Settings → import / the n8n webhook.
          </p>
        </Card>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <Stat value={inr(group.revenue)} label="Revenue 30d" />
            <Stat value={`${group.roas.toFixed(1)}x`} label="Blended ROAS" tone="var(--color-success)" />
            <Stat value={inr(group.cac)} label="Blended CAC" />
            <Stat value={pct(group.contributionMargin)} label="Contribution" tone={group.contributionMargin < 0.1 ? "var(--color-warn)" : "var(--color-success)"} />
            <Stat value={inr(f.cashBalance)} label="Cash" />
            <Stat value={`${runway === Infinity ? "∞" : runway.toFixed(1)} mo`} label="Runway" tone={runway < 6 ? "var(--color-warn)" : undefined} />
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {/* brand health */}
            <div className="lg:col-span-2">
              <Card>
                <CardTitle>Brand health - last 30 days</CardTitle>
                <div className="grid gap-3 sm:grid-cols-2">
                  {perBrand.map((b) => (
                    <Link key={b.key} href="/app/founder/brands" className="rounded-2xl border border-[var(--color-line)] p-4 transition hover:-translate-y-0.5 hover:shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-2 font-display font-semibold">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ background: b.def.accent }} />
                          {b.def.name}
                        </span>
                        <Badge>{b.def.pipeline}</Badge>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                        <div><div className="font-semibold">{inr(b.k.revenue)}</div><div className="text-[10px] uppercase text-[var(--color-muted)]">rev</div></div>
                        <div><div className="font-semibold">{b.k.spend ? b.k.roas.toFixed(1) + "x" : "-"}</div><div className="text-[10px] uppercase text-[var(--color-muted)]">roas</div></div>
                        <div><div className="font-semibold">{pct(b.k.contributionMargin)}</div><div className="text-[10px] uppercase text-[var(--color-muted)]">margin</div></div>
                      </div>
                      {b.target > 0 && (
                        <div className="mt-3">
                          <div className="mb-1 flex justify-between text-[11px] text-[var(--color-muted)]"><span>target {inr(b.target)}</span><span>{pct(b.progress)}</span></div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                            <div className="h-full rounded-full" style={{ width: `${Math.min(100, b.progress * 100)}%`, background: b.def.accent }} />
                          </div>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </Card>
            </div>

            {/* alerts + pipeline */}
            <div className="space-y-5">
              <Card>
                <CardTitle>What needs you</CardTitle>
                {alerts.length === 0 ? (
                  <p className="flex items-center gap-2 py-3 text-sm text-[var(--color-success)]"><TrendingUp size={16} /> All green across the group.</p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {alerts.map((a) => (
                      <li key={a} className="flex items-start gap-2"><AlertTriangle size={15} className="mt-0.5 shrink-0 text-[var(--color-warn)]" /> {a}</li>
                    ))}
                  </ul>
                )}
              </Card>
              <Card>
                <CardTitle>Pipeline & approvals</CardTitle>
                <div className="flex items-center justify-between py-1 text-sm"><span className="text-[var(--color-muted)]">Open B2B pipeline</span><b>{inr(pipeline)}</b></div>
                <div className="flex items-center justify-between py-1 text-sm"><span className="text-[var(--color-muted)]">Approvals waiting</span><b>{pendingApprovals}</b></div>
                <div className="mt-3 flex gap-2">
                  <Link href="/app/founder/leads" className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-crimson)]">Leads <ArrowRight size={14} /></Link>
                  <Link href="/app/founder/approvals" className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-crimson)]">Approvals <ArrowRight size={14} /></Link>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}
    </>
  );
}
