"use client";

import { useState } from "react";
import { PageHead } from "@/components/Shell";
import { Card, CardTitle, Stat, Button, Input, Select, Field, Chip, useToast } from "@/components/ui";
import { useCollection } from "@/lib/data/useStore";
import { store } from "@/lib/data/store";
import { BRANDS, brandDef } from "@/lib/brands";
import { BRAND_KEYS, type Approval, type ApprovalKind, type BrandKey } from "@/lib/data/types";
import { uid, today, inr } from "@/lib/utils";
import { Check, X, Plus } from "lucide-react";

const KINDS: ApprovalKind[] = ["Creative", "Ad spend", "Hire", "Discount", "Purchase order"];

export default function FounderApprovals() {
  const approvals = useCollection("fApprovals");
  const toast = useToast();
  const [tab, setTab] = useState<"pending" | "decided">("pending");
  const [form, setForm] = useState({ brand: "aurra" as BrandKey, kind: "Ad spend" as ApprovalKind, title: "", amount: "" });

  const pending = approvals.filter((a) => a.status === "pending");
  const decided = approvals.filter((a) => a.status !== "pending");
  const rows = tab === "pending" ? pending : decided;

  async function add() {
    if (!form.title.trim()) return toast("Add a title");
    await store.add("fApprovals", { id: uid(), brand: form.brand, kind: form.kind, title: form.title.trim(), amount: +form.amount || undefined, requestedBy: "You", status: "pending", created: today() } as Approval);
    setForm({ ...form, title: "", amount: "" });
  }
  async function decide(a: Approval, status: "approved" | "rejected") {
    await store.update("fApprovals", a.id, { status, decidedAt: new Date().toISOString() });
    toast(status === "approved" ? "Approved - next step triggered" : "Rejected");
  }

  return (
    <>
      <PageHead title="Approvals" sub="Creative, spend and hires - one tap each. Your decision fires the next step." />

      <div className="mb-6 grid grid-cols-3 gap-3">
        <Stat value={pending.length} label="Waiting on you" tone="var(--color-warn)" />
        <Stat value={inr(pending.reduce((a, x) => a + (x.amount || 0), 0))} label="Pending value" />
        <Stat value={decided.filter((d) => d.status === "approved").length} label="Approved" tone="var(--color-success)" />
      </div>

      <Card className="mb-5">
        <CardTitle>Raise a request</CardTitle>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Select value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value as BrandKey })}>{BRANDS.map((b) => <option key={b.key} value={b.key}>{b.short}</option>)}</Select>
          <Select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as ApprovalKind })}>{KINDS.map((k) => <option key={k}>{k}</option>)}</Select>
          <Input placeholder="What needs approval" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input placeholder="Amount ₹ (optional)" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <Button onClick={add}><Plus size={15} /> Add</Button>
        </div>
      </Card>

      <div className="mb-3 flex gap-2">
        <Chip active={tab === "pending"} onClick={() => setTab("pending")}>Pending ({pending.length})</Chip>
        <Chip active={tab === "decided"} onClick={() => setTab("decided")}>Decided ({decided.length})</Chip>
      </div>

      <div className="space-y-3">
        {rows.length === 0 && <Card><p className="py-6 text-center text-[var(--color-muted)]">Nothing here.</p></Card>}
        {rows.map((a) => (
          <Card key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div className="flex items-center gap-3">
              <span className="h-9 w-1.5 rounded-full" style={{ background: brandDef(a.brand).accent }} />
              <div>
                <div className="font-medium">{a.title}</div>
                <div className="text-xs text-[var(--color-muted)]">{brandDef(a.brand).short} · {a.kind}{a.amount ? ` · ${inr(a.amount)}` : ""} · {a.requestedBy}</div>
              </div>
            </div>
            {a.status === "pending" ? (
              <div className="flex gap-2">
                <Button variant="primary" onClick={() => decide(a, "approved")}><Check size={15} /> Approve</Button>
                <Button variant="outline" onClick={() => decide(a, "rejected")}><X size={15} /> Reject</Button>
              </div>
            ) : (
              <span className="rounded-full px-3 py-1 text-xs font-bold text-white" style={{ background: a.status === "approved" ? "#1E7D34" : "#999" }}>{a.status}</span>
            )}
          </Card>
        ))}
      </div>
    </>
  );
}
