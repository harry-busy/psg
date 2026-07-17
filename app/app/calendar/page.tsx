"use client";

import { useState } from "react";
import { PageHead } from "@/components/Shell";
import { Card, Button, Select, Chip, Badge, useToast } from "@/components/ui";
import { useSettings } from "@/lib/settings";
import { FESTIVALS, festivalDate, minusDays, fmtShort, buildICS, type Festival } from "@/lib/jewellery/festivals";
import { today } from "@/lib/utils";
import { tgText } from "@/lib/telegram";
import { aiText } from "@/lib/ai/client";
import { festivalCampaignSystem } from "@/lib/ai/prompts";
import { Sparkles, Download, Send, X } from "lucide-react";

export default function CalendarPage() {
  const s = useSettings();
  const toast = useToast();
  const [year, setYear] = useState<"2026" | "2027">("2026");
  const [onlyMajor, setOnlyMajor] = useState(false);
  const [campaign, setCampaign] = useState<{ name: string; text: string } | null>(null);
  const [busy, setBusy] = useState("");

  const rows = FESTIVALS
    .map((f) => ({ f, date: festivalDate(f, year) }))
    .filter(({ f }) => !onlyMajor || f.major)
    .sort((a, b) => a.date.localeCompare(b.date));

  const md = (date: string, n: number) => minusDays(date, n).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  async function genCampaign(f: Festival, date: string) {
    setBusy(f.name);
    try {
      const text = await aiText({
        system: festivalCampaignSystem(s.name, s.city),
        prompt: `Festival: ${f.name} on ${date}. Why it matters: ${f.why}. Create the campaign.`,
        temperature: 0.8,
      });
      setCampaign({ name: f.name, text });
    } catch (e) { toast((e as Error).message); }
    setBusy("");
  }

  function exportCSV() {
    const csv = ["Festival,Date,Major,Teaser start,Main push,Reminder,Idea 1,Idea 2,Idea 3"]
      .concat(rows.map(({ f, date }) => [f.name, date, f.major ? "Yes" : "No", md(date, 14), md(date, 7), md(date, 2), ...f.ideas].map((x) => `"${x}"`).join(",")))
      .join("\n");
    const a = document.createElement("a"); a.download = `festive-calendar-${year}.csv`; a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.click();
  }
  function exportICS() {
    const a = document.createElement("a"); a.download = `festive-campaigns-${year}.ics`;
    a.href = URL.createObjectURL(new Blob([buildICS(year, onlyMajor)], { type: "text/calendar" })); a.click();
  }
  function sendNext() {
    const up = rows.find(({ date }) => date >= today());
    if (!up) return toast("No upcoming festival in this view");
    tgText(`Next festival: ${up.f.name} - ${up.date}\nTeasers: ${md(up.date, 14)}\nMain push: ${md(up.date, 7)}\nReminder: ${md(up.date, 2)}\nPrep the collection + broadcast list now.`)
      .then((r) => toast(r.ok ? "Sent to Telegram" : r.error || "Telegram not configured"));
  }

  return (
    <>
      <PageHead
        title="Festive Campaign Calendar"
        sub="Every gold festival with a ready T-minus plan. Dates marked ≈ follow the lunar calendar - verify near the date."
        actions={<>
          <Button variant="outline" onClick={exportCSV}><Download size={15} /> CSV</Button>
          <Button variant="outline" onClick={exportICS}><Download size={15} /> Calendar (.ics)</Button>
          <Button variant="tg" onClick={sendNext}><Send size={15} /> Next festival to Telegram</Button>
        </>}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Select className="w-28" value={year} onChange={(e) => setYear(e.target.value as "2026")}><option>2026</option><option>2027</option></Select>
        <Chip active={!onlyMajor} onClick={() => setOnlyMajor(false)}>All festivals</Chip>
        <Chip active={onlyMajor} onClick={() => setOnlyMajor(true)}>Gold-major only</Chip>
      </div>

      {campaign && (
        <Card className="mb-4 border-l-4 border-l-[var(--color-gold)]">
          <div className="mb-2 flex items-center justify-between">
            <b className="font-display text-lg">AI campaign · {campaign.name}</b>
            <button className="text-[var(--color-muted)]" onClick={() => setCampaign(null)} aria-label="Close"><X size={16} /></button>
          </div>
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{campaign.text}</pre>
        </Card>
      )}

      <div className="space-y-3">
        {rows.map(({ f, date }) => (
          <Card key={f.name} className={f.major ? "border-l-4 border-l-[var(--color-gold)]" : "border-l-4 border-l-[var(--color-crimson)]"}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="font-display text-lg font-semibold">
                  {f.name} {f.major && <Badge className="bg-[var(--color-gold)]/15 text-[var(--color-gold)]">gold-major</Badge>}
                </h3>
                <p className="mt-0.5 text-sm text-[var(--color-muted)]">{f.why}</p>
              </div>
              <div className="text-right">
                <div className="font-medium text-[var(--color-crimson)]">{fmtShort(date)}</div>
                {f.approx && <div className="text-[10px] text-[var(--color-warn)]">≈ verify</div>}
              </div>
            </div>
            <div className="mt-3 rounded-xl bg-[var(--color-surface-2)] p-3 text-sm">
              <b className="text-[var(--color-crimson)]">Plan:</b> teasers <b>{md(date, 14)}</b> · main push <b>{md(date, 7)}</b> · reminder <b>{md(date, 2)}</b> · review-ask day after.
              <div className="mt-1"><b className="text-[var(--color-crimson)]">Ideas:</b> {f.ideas.map((i, n) => `${n + 1}) ${i}`).join("  ")}</div>
            </div>
            <Button variant="ai" className="mt-3" loading={busy === f.name} onClick={() => genCampaign(f, date)}>
              <Sparkles size={15} /> Generate full campaign
            </Button>
          </Card>
        ))}
      </div>
    </>
  );
}
