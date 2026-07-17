"use client";

import { useState } from "react";
import { PageHead } from "@/components/Shell";
import { Card, CardTitle, Button, Input, Field, useToast, Badge } from "@/components/ui";
import { useCollection } from "@/lib/data/useStore";
import { store } from "@/lib/data/store";
import { useSettings } from "@/lib/settings";
import { uid, today, waLink } from "@/lib/utils";
import type { BridalLead } from "@/lib/data/types";
import { Trash2, Heart } from "lucide-react";

/** The 6-month bridal journey - highest-ticket customers you cannot drop. */
const MILESTONES = [
  { id: "t180", days: 180, label: "Inspiration lookbook shared", msg: "share a bridal inspiration lookbook" },
  { id: "t150", days: 150, label: "Style consultation booked", msg: "invite for a bridal style consultation" },
  { id: "t120", days: 120, label: "Trousseau checklist sent", msg: "send the trousseau jewellery checklist" },
  { id: "t90", days: 90, label: "Order placed / karigar deadline", msg: "confirm the order and karigar timeline" },
  { id: "t60", days: 60, label: "Booking + advance", msg: "collect advance and lock the pieces" },
  { id: "t30", days: 30, label: "Rate lock / final fitting", msg: "offer a rate-lock and final fitting" },
  { id: "t7", days: 7, label: "Final support call", msg: "final support and delivery confirmation" },
  { id: "post", days: -15, label: "Congratulations + review + anniversary capture", msg: "congratulate and request a review" },
];

export default function BridalPage() {
  const brides = useCollection("bridal");
  const s = useSettings();
  const toast = useToast();
  const [form, setForm] = useState({ bride: "", phone: "", weddingDate: "", budget: "" });

  async function add() {
    if (!form.bride.trim() || !form.weddingDate) return toast("Bride name and wedding date required");
    const row: BridalLead = { id: uid(), bride: form.bride.trim(), phone: form.phone.trim(), weddingDate: form.weddingDate, budget: form.budget, milestones: {}, created: today() };
    await store.add("bridal", row);
    setForm({ bride: "", phone: "", weddingDate: "", budget: "" });
    toast("Bride added to pipeline");
  }

  function dueMilestone(b: BridalLead) {
    const now = new Date(today()).getTime();
    const wd = new Date(b.weddingDate).getTime();
    const daysLeft = Math.round((wd - now) / 864e5);
    // the next incomplete milestone whose window has arrived
    return MILESTONES.find((m) => !b.milestones[m.id] && daysLeft <= m.days);
  }

  return (
    <>
      <PageHead title="Bridal Pipeline" sub="A 6-month journey for your highest-ticket customers - nothing slips." />
      <Card className="mb-5">
        <CardTitle>New bride</CardTitle>
        <div className="grid gap-3 sm:grid-cols-4">
          <Field label="Bride name"><Input value={form.bride} onChange={(e) => setForm({ ...form, bride: e.target.value })} /></Field>
          <Field label="Phone"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
          <Field label="Wedding date"><Input type="date" value={form.weddingDate} onChange={(e) => setForm({ ...form, weddingDate: e.target.value })} /></Field>
          <Field label="Budget ₹"><Input value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="5,00,000" /></Field>
        </div>
        <Button className="mt-3" onClick={add}>Add to pipeline</Button>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {brides.length === 0 && <p className="col-span-full py-10 text-center text-[var(--color-muted)]">No brides yet - add your first above.</p>}
        {[...brides].sort((a, b) => a.weddingDate.localeCompare(b.weddingDate)).map((b) => {
          const daysLeft = Math.round((new Date(b.weddingDate).getTime() - new Date(today()).getTime()) / 864e5);
          const done = MILESTONES.filter((m) => b.milestones[m.id]).length;
          const due = dueMilestone(b);
          return (
            <Card key={b.id}>
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold flex items-center gap-2"><Heart size={16} className="text-[var(--color-crimson)]" /> {b.bride}</h3>
                  <p className="text-xs text-[var(--color-muted)]">Wedding {new Date(b.weddingDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {daysLeft >= 0 ? `${daysLeft} days to go` : "married"}{b.budget ? ` · ₹${b.budget}` : ""}</p>
                </div>
                <button onClick={() => confirm("Remove bride?") && store.remove("bridal", b.id)}><Trash2 size={15} className="text-[var(--color-muted)]" /></button>
              </div>

              {due && (
                <div className="mb-3 flex items-center justify-between rounded-xl bg-[#fff3c4]/60 px-3 py-2 text-sm">
                  <span><b>Now due:</b> {due.label}</span>
                  {b.phone && <a target="_blank" className="rounded-lg bg-[#25D366] px-2.5 py-1 text-xs font-semibold text-white" href={waLink(b.phone, `Namaste ${b.bride} ji! From ${s.name} - we'd love to ${due.msg} for your big day.`)}>Message</a>}
                </div>
              )}

              <div className="mb-2 text-xs text-[var(--color-muted)]">{done}/{MILESTONES.length} milestones · <Badge>{Math.round((done / MILESTONES.length) * 100)}%</Badge></div>
              <ul className="space-y-1.5">
                {MILESTONES.map((m) => (
                  <li key={m.id} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={!!b.milestones[m.id]} onChange={(e) => store.update("bridal", b.id, { milestones: { ...b.milestones, [m.id]: e.target.checked } })} />
                    <span className={b.milestones[m.id] ? "text-[var(--color-muted)] line-through" : ""}>{m.label}</span>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
    </>
  );
}
