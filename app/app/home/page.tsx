"use client";

import Link from "next/link";
import { PageHead } from "@/components/Shell";
import { Card, CardTitle, Stat, Button, useToast } from "@/components/ui";
import { useCollection } from "@/lib/data/useStore";
import { useSettings } from "@/lib/settings";
import { useMode, setMode } from "@/lib/mode";
import { karatRates } from "@/lib/jewellery/calc";
import { inr, today, daysAgo, waLink } from "@/lib/utils";
import { tgText } from "@/lib/telegram";
import { ArrowRight, Send } from "lucide-react";

export default function HomePage() {
  const enquiries = useCollection("enquiries");
  const sales = useCollection("sales");
  const scheme = useCollection("schemeLeads");
  const s = useSettings();
  const toast = useToast();
  const mode = useMode();
  const rates = karatRates(s.rate24);
  const empty = enquiries.length === 0 && sales.length === 0 && scheme.length === 0;

  const wk = daysAgo(6);
  const due = enquiries.filter((d) => d.next && d.next <= today() && !["Sold", "Lost"].includes(d.stage));
  const salesWk = sales.filter((d) => d.date >= wk);
  const rev = salesWk.reduce((a, d) => a + d.amount, 0);
  const sold = enquiries.filter((d) => d.stage === "Sold").length;

  function sendDigest() {
    const msg =
      `${s.name} - daily digest ${today()}\n` +
      `Enquiries (7d): ${enquiries.filter((d) => d.created >= wk).length}\n` +
      `Sales (7d): ${salesWk.length} · Revenue ${inr(rev)}\n` +
      `Follow-ups due: ${due.length}${due.length ? " (" + due.map((d) => d.name).join(", ") + ")" : ""}\n` +
      `Gold 22K: ${inr(rates["22K"])}/g`;
    tgText(msg).then((r) => toast(r.ok ? "Digest sent to Telegram" : r.error || "Telegram not configured"));
  }

  return (
    <>
      <PageHead
        title={`Good day at ${s.name}`}
        sub={new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        actions={<>
          {empty && <Button variant="ink" onClick={() => setMode("demo", "jewellery").then(() => toast("Demo data loaded"))}>Load demo data</Button>}
          <Button variant="tg" onClick={sendDigest}><Send size={15} /> Send today's digest</Button>
        </>}
      />

      {empty && (
        <Card className="mb-6 text-center">
          <CardTitle>{mode === "demo" ? "Demo mode is on" : "Your workspace is empty"}</CardTitle>
          <p className="mx-auto max-w-md text-sm text-[var(--color-muted)]">
            Load realistic sample enquiries, sales, savings-scheme leads and catalog pieces to see every screen come alive. Switch to Live mode anytime from the sidebar to clear it and start on your real data.
          </p>
          <Button className="mt-4" variant="ink" onClick={() => setMode("demo", "jewellery").then(() => toast("Demo data loaded"))}>Load demo data</Button>
        </Card>
      )}

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat value={enquiries.filter((d) => d.created >= wk).length} label="Enquiries 7d" />
        <Stat value={salesWk.length} label="Sales 7d" tone="var(--color-success)" />
        <Stat value={inr(rev)} label="Revenue 7d" />
        <Stat value={due.length} label="Follow-ups due" tone="var(--color-warn)" />
        <Stat value={inr(rates["22K"])} label="22K /g" />
        <Stat value={enquiries.length ? Math.round((sold / enquiries.length) * 100) + "%" : "-"} label="Conversion" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardTitle>Follow-ups due today</CardTitle>
          {due.length === 0 ? (
            <p className="py-6 text-center text-sm text-[var(--color-muted)]">All caught up - nothing pending.</p>
          ) : (
            <ul className="divide-y divide-[var(--color-line)]">
              {due.map((d) => (
                <li key={d.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <div className="font-medium">{d.name}</div>
                    <div className="text-xs text-[var(--color-muted)]">{d.item || "-"} · {d.source}</div>
                  </div>
                  {d.phone && (
                    <a
                      className="rounded-lg bg-[var(--color-crimson)] px-3 py-1.5 text-xs font-semibold text-white"
                      target="_blank"
                      href={waLink(d.phone, `Namaste ${d.name} ji! Just following up on your interest in ${d.item || "our jewellery"} at ${s.name}. When may we welcome you?`)}
                    >
                      Follow up
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
          <Link href="/app/crm" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-crimson)]">
            Open CRM <ArrowRight size={15} />
          </Link>
        </Card>

        <Card>
          <CardTitle>Today's focus</CardTitle>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2"><span className="text-[var(--color-gold)]">-</span> Gold 22K today ≈ <b>{inr(rates["22K"])}/g</b>. Post the daily rate card.</li>
            <li className="flex gap-2"><span className="text-[var(--color-gold)]">-</span> Shoot one new design in <Link className="font-semibold text-[var(--color-crimson)]" href="/app/studio">Photo Studio</Link>.</li>
            <li className="flex gap-2"><span className="text-[var(--color-gold)]">-</span> Check upcoming festival pushes in the <Link className="font-semibold text-[var(--color-crimson)]" href="/app/calendar">Calendar</Link>.</li>
            <li className="flex gap-2"><span className="text-[var(--color-gold)]">-</span> {scheme.length} savings-scheme lead{scheme.length === 1 ? "" : "s"} to nurture.</li>
          </ul>
        </Card>
      </div>
    </>
  );
}
