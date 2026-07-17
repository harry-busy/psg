"use client";

import { useState } from "react";
import { PageHead } from "@/components/Shell";
import { Card, Button, Input, Chip, useToast } from "@/components/ui";
import { useCollection } from "@/lib/data/useStore";
import { useFounder } from "@/lib/founder";
import { BRANDS, kpis, leadValue } from "@/lib/brands";
import { aiText } from "@/lib/ai/client";
import { chiefOfStaffSystem } from "@/lib/ai/prompts";
import { daysAgo, inr } from "@/lib/utils";
import { Bot, Send, User } from "lucide-react";

const QUICK = [
  "Which brand is most at risk this month and why?",
  "What's my true contribution margin per brand after RTO?",
  "Where should I move ad budget next week?",
  "Draft this week's investor update from the numbers.",
  "Which leads should I chase first?",
];

type Msg = { role: "user" | "assistant"; text: string };

export default function ChiefOfStaff() {
  const metrics = useCollection("fMetrics");
  const leads = useCollection("fLeads");
  const approvals = useCollection("fApprovals");
  const f = useFounder();
  const toast = useToast();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  function snapshot() {
    const m30 = metrics.filter((m) => m.date >= daysAgo(29));
    return {
      group: f.groupName,
      cash: f.cashBalance,
      monthlyBurn: f.monthlyBurn,
      runwayMonths: f.monthlyBurn ? +(f.cashBalance / f.monthlyBurn).toFixed(1) : null,
      last30: BRANDS.map((b) => {
        const k = kpis(m30.filter((x) => x.brand === b.key));
        return {
          brand: b.name, target: f.monthlyTargets[b.key],
          revenue: Math.round(k.revenue), adSpend: Math.round(k.spend), roas: +k.roas.toFixed(2),
          cac: Math.round(k.cac), aov: Math.round(k.aov), rtoRate: +(k.rtoRate * 100).toFixed(0),
          contribution: Math.round(k.contribution), contributionMarginPct: +(k.contributionMargin * 100).toFixed(0),
        };
      }),
      openPipeline: inr(leadValue(leads, ["Qualified", "Quote"])),
      topLeads: leads.filter((l) => !["Won", "Lost"].includes(l.stage)).sort((a, b) => (b.value || 0) - (a.value || 0)).slice(0, 6).map((l) => ({ name: l.name, brand: l.brand, value: l.value, stage: l.stage, score: l.score })),
      pendingApprovals: approvals.filter((a) => a.status === "pending").map((a) => ({ brand: a.brand, kind: a.kind, title: a.title, amount: a.amount })),
    };
  }

  async function ask(q: string) {
    if (!q.trim() || busy) return;
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setBusy(true);
    try {
      const text = await aiText({
        system: chiefOfStaffSystem(f.groupName),
        prompt: `Live data snapshot (JSON):\n${JSON.stringify(snapshot())}\n\nFounder's question: ${q}`,
        temperature: 0.4, maxTokens: 900,
      });
      setMsgs((m) => [...m, { role: "assistant", text: text.trim() }]);
    } catch (e) {
      setMsgs((m) => [...m, { role: "assistant", text: (e as Error).message }]);
      toast("AI error");
    }
    setBusy(false);
  }

  return (
    <>
      <PageHead title="AI Chief of Staff" sub="Ask anything about the group - answered from your live numbers by Groq." />

      <Card className="flex h-[62vh] flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          {msgs.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center text-sm text-[var(--color-muted)]">
              <Bot size={30} className="mb-3 text-[var(--color-line)]" />
              Ask about revenue, margins, ad budget, runway, or which leads to chase.
              {metrics.length === 0 && <span className="mt-2 text-xs">Tip: load demo data in Settings first so there's something to analyse.</span>}
            </div>
          )}
          {msgs.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "assistant" && <Bot size={20} className="mt-1 shrink-0 text-[var(--color-crimson)]" />}
              <div className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-[var(--color-crimson)] text-white" : "bg-[var(--color-surface-2)]"}`}>{m.text}</div>
              {m.role === "user" && <User size={20} className="mt-1 shrink-0 text-[var(--color-muted)]" />}
            </div>
          ))}
          {busy && <div className="flex gap-2"><Bot size={20} className="mt-1 text-[var(--color-crimson)]" /><div className="rounded-2xl bg-[var(--color-surface-2)] px-4 py-2.5 text-sm text-[var(--color-muted)]">Thinking…</div></div>}
        </div>

        <div className="mt-3">
          <div className="mb-2 flex flex-wrap gap-2">{QUICK.map((q) => <Chip key={q} onClick={() => ask(q)}>{q}</Chip>)}</div>
          <div className="flex gap-2">
            <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask(input)} placeholder="Ask your business anything…" />
            <Button loading={busy} onClick={() => ask(input)}><Send size={15} /></Button>
          </div>
        </div>
      </Card>
    </>
  );
}
