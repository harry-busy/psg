"use client";

import { useState } from "react";
import { PageHead } from "@/components/Shell";
import { Card, CardTitle, Stat, Button, Input, Select, Chip, useToast } from "@/components/ui";
import { useCollection } from "@/lib/data/useStore";
import { store } from "@/lib/data/store";
import { BRANDS, brandDef, leadValue } from "@/lib/brands";
import { PIPELINE, BRAND_KEYS, type Lead, type BrandKey, type PipelineStage } from "@/lib/data/types";
import { aiText } from "@/lib/ai/client";
import { leadScoreSystem } from "@/lib/ai/prompts";
import { uid, today, inr, waLink } from "@/lib/utils";
import { Sparkles, Trash2, MessageCircle } from "lucide-react";

export default function FounderLeads() {
  const leads = useCollection("fLeads");
  const toast = useToast();
  const [brandFilter, setBrandFilter] = useState<BrandKey | "all">("all");
  const [scoring, setScoring] = useState(false);
  const [form, setForm] = useState({ brand: "aurra" as BrandKey, name: "", company: "", phone: "", value: "", detail: "", next: "" });

  const rows = brandFilter === "all" ? leads : leads.filter((l) => l.brand === brandFilter);
  const won = leadValue(leads, ["Won"]);
  const open = leadValue(leads, ["New", "Qualified", "Quote"]);

  async function add() {
    if (!form.name.trim()) return toast("Name required");
    const row: Lead = {
      id: uid(), brand: form.brand, name: form.name.trim(), company: form.company, phone: form.phone,
      value: +form.value || 0, stage: "New", detail: form.detail, next: form.next, created: today(),
    };
    await store.add("fLeads", row);
    setForm({ ...form, name: "", company: "", phone: "", value: "", detail: "", next: "" });
    toast("Lead added");
  }

  async function scoreAll() {
    setScoring(true);
    try {
      for (const l of leads.filter((x) => !["Won", "Lost"].includes(x.stage))) {
        const raw = await aiText({
          system: leadScoreSystem(), json: true, temperature: 0.2,
          prompt: `Lead for ${brandDef(l.brand).name}: name=${l.name}, company=${l.company || "-"}, value=₹${l.value || "?"}, stage=${l.stage}, detail=${l.detail || "-"}.`,
        });
        try { const j = JSON.parse(raw); await store.update("fLeads", l.id, { score: j.score, scoreReason: j.reason, nextAction: j.next_action }); } catch {}
      }
      toast("Leads scored by AI");
    } catch (e) { toast((e as Error).message); }
    setScoring(false);
  }

  return (
    <>
      <PageHead title="Leads & CRM" sub="Every enquiry across all four brands - nothing dropped."
        actions={<Button variant="ai" loading={scoring} onClick={scoreAll}><Sparkles size={15} /> AI score</Button>} />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat value={leads.length} label="Total leads" />
        <Stat value={inr(open)} label="Open pipeline" tone="var(--color-warn)" />
        <Stat value={inr(won)} label="Won value" tone="var(--color-success)" />
        <Stat value={leads.filter((l) => l.next && l.next <= today() && !["Won", "Lost"].includes(l.stage)).length} label="Follow-ups due" />
      </div>

      <Card className="mb-5">
        <CardTitle>New lead</CardTitle>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Select value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value as BrandKey })}>
            {BRANDS.map((b) => <option key={b.key} value={b.key}>{b.name}</option>)}
          </Select>
          <Input placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Company (B2B)" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input placeholder="Deal value ₹" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          <Input placeholder="Detail (event date / qty / scope)" value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} />
          <Input type="date" value={form.next} onChange={(e) => setForm({ ...form, next: e.target.value })} />
          <Button onClick={add}>Add lead</Button>
        </div>
      </Card>

      <Card>
        <div className="mb-3 flex flex-wrap gap-2">
          <Chip active={brandFilter === "all"} onClick={() => setBrandFilter("all")}>All brands</Chip>
          {BRANDS.map((b) => <Chip key={b.key} active={brandFilter === b.key} onClick={() => setBrandFilter(b.key)}>{b.short}</Chip>)}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-line)] text-left text-[11px] uppercase text-[var(--color-muted)]">
                <th className="py-2 pr-3">Lead</th><th className="pr-3">Brand</th><th className="pr-3">Value</th><th className="pr-3">AI</th><th className="pr-3">Stage</th><th></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-[var(--color-muted)]">No leads - add one or load demo data.</td></tr>}
              {rows.map((l) => (
                <tr key={l.id} className="border-b border-[var(--color-line)]">
                  <td className="py-2.5 pr-3"><b>{l.name}</b>{l.company && <span className="text-[var(--color-muted)]"> · {l.company}</span>}<div className="text-xs text-[var(--color-muted)]">{l.detail || l.source || ""}</div></td>
                  <td className="pr-3"><span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: brandDef(l.brand).accent }} />{brandDef(l.brand).short}</span></td>
                  <td className="pr-3">{l.value ? inr(l.value) : "-"}</td>
                  <td className="pr-3">{l.score ? <span title={`${l.scoreReason || ""}${l.nextAction ? " → " + l.nextAction : ""}`} className="rounded-full px-2 py-0.5 text-xs font-bold text-white" style={{ background: l.score >= 8 ? "#1E7D34" : l.score >= 5 ? "#C05621" : "#999" }}>{l.score}</span> : "-"}</td>
                  <td className="pr-3">
                    <select value={l.stage} onChange={(e) => store.update("fLeads", l.id, { stage: e.target.value as PipelineStage })} className="rounded-md border border-[var(--color-line)] bg-white/60 px-1.5 py-1 text-xs font-semibold">
                      {PIPELINE.map((st) => <option key={st}>{st}</option>)}
                    </select>
                  </td>
                  <td className="whitespace-nowrap text-right">
                    {l.phone && <a target="_blank" href={waLink(l.phone, `Hi ${l.name}, following up from ${brandDef(l.brand).name}.`)}><MessageCircle size={16} className="inline text-[#25D366]" /></a>}
                    <button className="ml-2" onClick={() => store.remove("fLeads", l.id)}><Trash2 size={15} className="inline text-[var(--color-muted)]" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
