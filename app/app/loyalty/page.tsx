"use client";

import { useState } from "react";
import { PageHead } from "@/components/Shell";
import { Card, CardTitle, Stat, Button, Input, Field, useToast } from "@/components/ui";
import { useCollection } from "@/lib/data/useStore";
import { store } from "@/lib/data/store";
import { useSettings } from "@/lib/settings";
import { uid, today, inr, waLink } from "@/lib/utils";
import type { LoyaltyMember } from "@/lib/data/types";
import { Trash2, Star, MessageCircle } from "lucide-react";

const tierFor = (pts: number): LoyaltyMember["tier"] => (pts >= 5000 ? "Platinum" : pts >= 1500 ? "Gold" : "Silver");
const TIER_COLOR = { Silver: "#7EBFA3", Gold: "#4E8A72", Platinum: "#1B4D3E" };
const POINTS_PER_100 = 1; // 1 point per ₹100 spent

export default function LoyaltyPage() {
  const members = useCollection("loyalty");
  const s = useSettings();
  const toast = useToast();
  const [form, setForm] = useState({ name: "", phone: "" });
  const [spend, setSpend] = useState<Record<string, string>>({});

  async function add() {
    if (!form.name.trim()) return toast("Name required");
    await store.add("loyalty", { id: uid(), name: form.name.trim(), phone: form.phone.trim(), points: 0, tier: "Silver", created: today() });
    setForm({ name: "", phone: "" });
    toast("Member added");
  }
  async function addSpend(m: LoyaltyMember) {
    const amt = +(spend[m.id] || 0); if (!amt) return;
    const pts = m.points + Math.floor(amt / 100) * POINTS_PER_100;
    const prevTier = m.tier, tier = tierFor(pts);
    await store.update("loyalty", m.id, { points: pts, tier });
    setSpend({ ...spend, [m.id]: "" });
    if (tier !== prevTier) toast(`${m.name} upgraded to ${tier}`);
  }

  return (
    <>
      <PageHead title="Loyalty & Referral" sub="Reward repeat customers - 1 point per ₹100, automatic tier upgrades." />
      <div className="mb-5 grid grid-cols-3 gap-3">
        <Stat value={members.length} label="Members" />
        <Stat value={members.filter((m) => m.tier !== "Silver").length} label="Gold+" tone="var(--color-gold)" />
        <Stat value={inr(members.reduce((a, m) => a + m.points, 0) * 100)} label="Lifetime spend tracked" />
      </div>

      <Card className="mb-5">
        <CardTitle>New member</CardTitle>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Phone"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
          <div className="flex items-end"><Button className="w-full" onClick={add}>Add member</Button></div>
        </div>
      </Card>

      <Card>
        <CardTitle>Members</CardTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[var(--color-line)] text-left text-[11px] uppercase text-[var(--color-muted)]"><th className="py-2">Member</th><th>Tier</th><th>Points</th><th>Add sale ₹</th><th></th></tr></thead>
            <tbody>
              {members.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-[var(--color-muted)]">No members yet.</td></tr>}
              {members.map((m) => (
                <tr key={m.id} className="border-b border-[var(--color-line)]">
                  <td className="py-2.5"><b>{m.name}</b><div className="text-xs text-[var(--color-muted)]">{m.phone}</div></td>
                  <td><span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold text-white" style={{ background: TIER_COLOR[m.tier] }}><Star size={11} /> {m.tier}</span></td>
                  <td className="font-semibold">{m.points}</td>
                  <td>
                    <div className="flex gap-1">
                      <Input className="w-24 py-1" value={spend[m.id] || ""} onChange={(e) => setSpend({ ...spend, [m.id]: e.target.value })} placeholder="25000" />
                      <Button className="px-3 py-1" onClick={() => addSpend(m)}>+</Button>
                    </div>
                  </td>
                  <td className="text-right">
                    {m.phone && <a target="_blank" title="Thank" href={waLink(m.phone, `Namaste ${m.name} ji! Thank you for being a valued ${m.tier} member at ${s.name}. You have ${m.points} reward points.`)}><MessageCircle size={14} className="inline text-[var(--color-crimson)]" /></a>}
                    <button className="ml-2" onClick={() => store.remove("loyalty", m.id)}><Trash2 size={14} className="inline text-[var(--color-muted)]" /></button>
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
