"use client";

import { PageHead } from "@/components/Shell";
import { Card, CardTitle, Stat } from "@/components/ui";
import { useCollection } from "@/lib/data/useStore";
import { inr, today, daysAgo } from "@/lib/utils";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

export default function DashboardPage() {
  const enquiries = useCollection("enquiries");
  const sales = useCollection("sales");
  const scheme = useCollection("schemeLeads");

  const wk = daysAgo(6);
  const due = enquiries.filter((d) => d.next && d.next <= today() && !["Sold", "Lost"].includes(d.stage));
  const sold = enquiries.filter((d) => d.stage === "Sold");
  const revenue = sales.reduce((a, d) => a + d.amount, 0);

  const days = [...Array(14)].map((_, i) => daysAgo(13 - i));
  const lineData = days.map((d) => ({
    day: d.slice(5),
    Enquiries: enquiries.filter((x) => x.created === d).length,
    Sales: sales.filter((x) => x.date === d).length,
  }));

  const bySource: Record<string, number> = {};
  enquiries.forEach((d) => (bySource[d.source] = (bySource[d.source] || 0) + 1));
  const sourceData = Object.entries(bySource).map(([name, value]) => ({ name, value }));

  const byItem: Record<string, number> = {};
  enquiries.forEach((d) => d.item && (byItem[d.item] = (byItem[d.item] || 0) + 1));
  const topItems = Object.entries(byItem).sort((a, b) => b[1] - a[1]).slice(0, 8);

  return (
    <>
      <PageHead title="Owner Dashboard" sub={`Updated ${new Date().toLocaleString("en-IN")}`} />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat value={enquiries.filter((d) => d.created >= wk).length} label="Enquiries 7d" />
        <Stat value={sold.length} label="Sold" tone="var(--color-success)" />
        <Stat value={inr(revenue)} label="Revenue (all)" />
        <Stat value={due.length} label="Follow-ups due" tone="var(--color-warn)" />
        <Stat value={scheme.length} label="Scheme leads" />
        <Stat value={enquiries.length ? Math.round((sold.length / enquiries.length) * 100) + "%" : "-"} label="Conversion" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardTitle>Enquiries & sales - 14 days</CardTitle>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={lineData} margin={{ left: -20, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1B4D3E" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#1B4D3E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" />
              <XAxis dataKey="day" fontSize={11} stroke="var(--color-muted)" />
              <YAxis fontSize={11} stroke="var(--color-muted)" allowDecimals={false} />
              <Tooltip />
              <Area type="monotone" dataKey="Enquiries" stroke="#1B4D3E" fill="url(#g1)" strokeWidth={2} />
              <Area type="monotone" dataKey="Sales" stroke="#0E3327" fill="transparent" strokeWidth={2} strokeDasharray="5 3" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardTitle>Enquiries by source</CardTitle>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={sourceData} margin={{ left: -20, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" />
              <XAxis dataKey="name" fontSize={10} stroke="var(--color-muted)" interval={0} angle={-20} textAnchor="end" height={50} />
              <YAxis fontSize={11} stroke="var(--color-muted)" allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#1B4D3E" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardTitle>Top items by interest</CardTitle>
          {topItems.length === 0 ? (
            <p className="py-6 text-center text-sm text-[var(--color-muted)]">No data yet - add enquiries or load demo data.</p>
          ) : (
            <ul className="space-y-2.5">
              {topItems.map(([name, v]) => (
                <li key={name} className="text-sm">
                  <div className="mb-1 flex items-center justify-between">
                    <span>{name}</span><span className="font-semibold text-[var(--color-muted)]">{v}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                    <div className="h-full rounded-full bg-[var(--color-gold)]" style={{ width: `${(v / topItems[0][1]) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardTitle>Follow-ups due</CardTitle>
          <table className="w-full text-sm">
            <tbody>
              {due.length === 0 && <tr><td className="py-6 text-center text-[var(--color-muted)]">Nothing due - nice.</td></tr>}
              {due.slice(0, 10).map((d) => (
                <tr key={d.id} className="border-b border-[var(--color-line)]">
                  <td className="py-2">{d.name}</td>
                  <td className="py-2 text-[var(--color-muted)]">{d.item || "-"}</td>
                  <td className="py-2 text-right">{d.next}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  );
}
