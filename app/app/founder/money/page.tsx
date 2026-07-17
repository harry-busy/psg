"use client";

import { PageHead } from "@/components/Shell";
import { Card, CardTitle, Stat } from "@/components/ui";
import { useCollection } from "@/lib/data/useStore";
import { useFounder } from "@/lib/founder";
import { BRANDS, kpis } from "@/lib/brands";
import { inr, pct, daysAgo } from "@/lib/utils";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

export default function FounderMoney() {
  const metrics = useCollection("fMetrics");
  const f = useFounder();
  const m30 = metrics.filter((m) => m.date >= daysAgo(29));
  const group = kpis(m30);
  const runway = f.monthlyBurn ? f.cashBalance / f.monthlyBurn : Infinity;

  const perBrand = BRANDS.map((b) => ({ b, k: kpis(m30.filter((m) => m.brand === b.key)) }));
  const chart = perBrand.map(({ b, k }) => ({ name: b.short, Revenue: k.revenue, "Ad spend": k.spend, COGS: k.cogs, Contribution: Math.round(k.contribution) }));

  return (
    <>
      <PageHead title="Money & Runway" sub="True profit after COGS, ad spend and returns - per brand." />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat value={inr(group.revenue)} label="Revenue 30d" />
        <Stat value={inr(group.spend)} label="Ad spend 30d" />
        <Stat value={inr(group.contribution)} label="Contribution" tone={group.contribution < 0 ? "var(--color-warn)" : "var(--color-success)"} />
        <Stat value={pct(group.contributionMargin)} label="Margin" />
        <Stat value={inr(f.cashBalance)} label="Cash" />
        <Stat value={`${runway === Infinity ? "∞" : runway.toFixed(1)} mo`} label="Runway" tone={runway < 6 ? "var(--color-warn)" : undefined} />
      </div>

      <Card className="mb-5">
        <CardTitle>Revenue → contribution by brand (30 days)</CardTitle>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chart} margin={{ left: 0, right: 8, top: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" />
            <XAxis dataKey="name" fontSize={12} stroke="var(--color-muted)" />
            <YAxis fontSize={11} stroke="var(--color-muted)" tickFormatter={(v) => (v / 1000).toFixed(0) + "k"} />
            <Tooltip formatter={(v: number) => inr(v)} />
            <Legend />
            <Bar dataKey="Revenue" fill="#1F2A44" radius={[5, 5, 0, 0]} />
            <Bar dataKey="Ad spend" fill="#EC4899" radius={[5, 5, 0, 0]} />
            <Bar dataKey="COGS" fill="#F59E0B" radius={[5, 5, 0, 0]} />
            <Bar dataKey="Contribution" fill="#22C55E" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <CardTitle>Per-brand economics</CardTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[var(--color-line)] text-left text-[11px] uppercase text-[var(--color-muted)]"><th className="py-2">Brand</th><th>Revenue</th><th>Spend</th><th>COGS</th><th>Contribution</th><th>Margin</th></tr></thead>
            <tbody>
              {perBrand.map(({ b, k }) => (
                <tr key={b.key} className="border-b border-[var(--color-line)]">
                  <td className="py-2.5"><span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: b.accent }} />{b.name}</span></td>
                  <td>{inr(k.revenue)}</td><td>{inr(k.spend)}</td><td>{inr(k.cogs)}</td>
                  <td className={k.contribution < 0 ? "text-[var(--color-warn)]" : "text-[var(--color-success)]"}>{inr(k.contribution)}</td>
                  <td>{pct(k.contributionMargin)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-[var(--color-muted)]">Contribution = revenue − COGS − ad spend − estimated RTO loss. This is the number that tells you if a brand actually makes money.</p>
      </Card>
    </>
  );
}
