"use client";

import { useState } from "react";
import { PageHead } from "@/components/Shell";
import { Card, CardTitle, Stat, Button, Input, Select, Chip, useToast } from "@/components/ui";
import { useCollection } from "@/lib/data/useStore";
import { store } from "@/lib/data/store";
import { useSettings } from "@/lib/settings";
import { STAGES, SOURCES, type Enquiry, type Stage } from "@/lib/data/types";
import { uid, today, daysAgo, waLink, digits } from "@/lib/utils";
import { tgText } from "@/lib/telegram";
import { aiText } from "@/lib/ai/client";
import { leadScoreSystem } from "@/lib/ai/prompts";
import { Trash2, MessageCircle, Sparkles, Download } from "lucide-react";

const STAGE_COLORS: Record<Stage, string> = {
  New: "#1B4D3E", Contacted: "#0F3A2E", Appointment: "#123D31",
  Visited: "#0E3327", Sold: "#0C2C23", Lost: "#6BB091",
};

export default function CRMPage() {
  const data = useCollection("enquiries");
  const s = useSettings();
  const toast = useToast();
  const [filter, setFilter] = useState<string>("All");
  const [scoring, setScoring] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", source: "WhatsApp", item: "", budget: "", occasion: "", next: "" });

  const wk = daysAgo(6);
  const due = data.filter((d) => d.next && d.next <= today() && !["Sold", "Lost"].includes(d.stage));
  const sold = data.filter((d) => d.stage === "Sold").length;

  async function add() {
    if (!form.name.trim()) return toast("Name is required");
    const row: Enquiry = {
      id: uid(), name: form.name.trim(), phone: form.phone.trim(), source: form.source as Enquiry["source"],
      item: form.item, budget: form.budget, occasion: form.occasion, next: form.next, stage: "New", created: today(),
    };
    await store.add("enquiries", row);
    setForm({ name: "", phone: "", source: "WhatsApp", item: "", budget: "", occasion: "", next: "" });
    if (s.telegramNotify) tgText(`New enquiry: ${row.name} (${row.phone || "no phone"}) via ${row.source}${row.item ? " - " + row.item : ""}`);
    toast("Enquiry added");
  }

  async function scoreOne(d: Enquiry) {
    const raw = await aiText({
      system: leadScoreSystem(), json: true, temperature: 0.2,
      prompt: `Lead: name=${d.name}, phone=${d.phone ? "yes" : "no"}, source=${d.source}, interest=${d.item || "?"}, budget=${d.budget || "?"}, occasion=${d.occasion || "?"}, stage=${d.stage}.`,
    });
    try {
      const j = JSON.parse(raw);
      await store.update("enquiries", d.id, { score: j.score, scoreReason: j.reason, nextAction: j.next_action });
    } catch { /* ignore malformed */ }
  }

  async function scoreAll() {
    setScoring(true);
    try {
      for (const d of data.filter((x) => !["Sold", "Lost"].includes(x.stage))) await scoreOne(d);
      toast("Leads scored by AI");
    } catch (e) {
      toast((e as Error).message);
    }
    setScoring(false);
  }

  function exportCSV() {
    const h = ["name", "phone", "source", "item", "budget", "occasion", "next", "stage", "score", "created"];
    const csv = [h.join(",")].concat(
      data.map((d) => h.map((k) => `"${String((d as unknown as Record<string, unknown>)[k] ?? "").replace(/"/g, '""')}"`).join(","))
    ).join("\n");
    const a = document.createElement("a");
    a.download = "enquiries.csv";
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.click();
  }

  let rows = data;
  if (filter === "Due") rows = due;
  else if (filter === "Hot") rows = data.filter((d) => (d.score || 0) >= 8);
  else if (filter !== "All") rows = data.filter((d) => d.stage === filter);

  return (
    <>
      <PageHead
        title="Enquiry CRM"
        sub="Every lead captured, every follow-up remembered."
        actions={<>
          <Button variant="ai" loading={scoring} onClick={scoreAll}><Sparkles size={15} /> AI score leads</Button>
          <Button variant="outline" onClick={exportCSV}><Download size={15} /> CSV</Button>
        </>}
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Stat value={data.filter((d) => d.created >= wk).length} label="7 days" />
        <Stat value={data.length} label="Total" />
        <Stat value={due.length} label="Due" tone="var(--color-warn)" />
        <Stat value={sold} label="Sold" tone="var(--color-success)" />
        <Stat value={data.length ? Math.round((sold / data.length) * 100) + "%" : "-"} label="Conversion" />
      </div>

      <Card className="mb-5">
        <CardTitle>New enquiry</CardTitle>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input placeholder="Customer name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Phone (91…)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
            {SOURCES.map((x) => <option key={x}>{x}</option>)}
          </Select>
          <Input placeholder="Interested in (bridal set…)" value={form.item} onChange={(e) => setForm({ ...form, item: e.target.value })} />
          <Input placeholder="Budget ₹" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
          <Select value={form.occasion} onChange={(e) => setForm({ ...form, occasion: e.target.value })}>
            <option value="">Occasion…</option>
            {["Wedding", "Engagement", "Festival", "Birthday/Anniversary", "Investment", "Daily wear"].map((x) => <option key={x}>{x}</option>)}
          </Select>
          <Input type="date" value={form.next} onChange={(e) => setForm({ ...form, next: e.target.value })} title="Next follow-up" />
          <Button onClick={add}>Add enquiry</Button>
        </div>
      </Card>

      <Card>
        <div className="mb-3 flex flex-wrap gap-2">
          {["All", ...STAGES, "Due", "Hot"].map((f) => (
            <Chip key={f} active={f === filter} onClick={() => setFilter(f)}>{f}</Chip>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-line)] text-left text-[11px] uppercase tracking-wide text-[var(--color-muted)]">
                <th className="py-2 pr-3">Customer</th>
                <th className="pr-3">Interest</th>
                <th className="pr-3">AI</th>
                <th className="pr-3">Follow-up</th>
                <th className="pr-3">Stage</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-[var(--color-muted)]">No enquiries here yet.</td></tr>
              )}
              {rows.map((d) => {
                const isDue = d.next && d.next <= today() && !["Sold", "Lost"].includes(d.stage);
                return (
                  <tr key={d.id} className={isDue ? "bg-[#A8D4C2]/40" : ""}>
                    <td className="py-2.5 pr-3">
                      <div className="font-medium">{d.name}</div>
                      <div className="text-xs text-[var(--color-muted)]">{d.phone || ""} · {d.source}</div>
                    </td>
                    <td className="pr-3">{d.item || "-"}{d.budget && <div className="text-xs text-[var(--color-muted)]">₹{d.budget}</div>}</td>
                    <td className="pr-3">
                      {d.score ? (
                        <span title={`${d.scoreReason || ""}${d.nextAction ? " → " + d.nextAction : ""}`}
                          className="inline-block rounded-full px-2 py-0.5 text-xs font-bold text-white"
                          style={{ background: d.score >= 8 ? "#0E3327" : d.score >= 5 ? "#1B4D3E" : "#6BB091" }}>
                          {d.score}
                        </span>
                      ) : <button className="text-xs text-[var(--color-crimson)]" onClick={() => scoreOne(d).then(() => toast("Scored"))}>score</button>}
                    </td>
                    <td className="pr-3">
                      <input type="date" value={d.next || ""} onChange={(e) => store.update("enquiries", d.id, { next: e.target.value })}
                        className="rounded-md border border-[var(--color-line)] bg-[#A8D4C2]/50 px-1.5 py-1 text-xs" />
                    </td>
                    <td className="pr-3">
                      <select value={d.stage} onChange={(e) => store.update("enquiries", d.id, { stage: e.target.value as Stage })}
                        className="rounded-md border border-[var(--color-line)] bg-[#A8D4C2]/50 px-1.5 py-1 text-xs font-semibold"
                        style={{ color: STAGE_COLORS[d.stage] }}>
                        {STAGES.map((x) => <option key={x}>{x}</option>)}
                      </select>
                    </td>
                    <td className="whitespace-nowrap text-right">
                      {d.phone && (
                        <a target="_blank" title="WhatsApp" href={waLink(d.phone, `Namaste ${d.name} ji! Thank you for your interest in ${d.item || "our jewellery"} at ${s.name}. When may we welcome you?`)}>
                          <MessageCircle size={16} className="inline text-[#1B4D3E]" />
                        </a>
                      )}
                      <button className="ml-2" title="Delete" onClick={() => confirm("Delete?") && store.remove("enquiries", d.id)}>
                        <Trash2 size={15} className="inline text-[var(--color-muted)]" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
