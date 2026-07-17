"use client";

import { useState } from "react";
import { PageHead } from "@/components/Shell";
import { Card, CardTitle, Button, Input, Field, useToast } from "@/components/ui";
import { useSettings } from "@/lib/settings";
import { useCollection } from "@/lib/data/useStore";
import { store } from "@/lib/data/store";
import { inr, uid, today, waLink } from "@/lib/utils";
import { tgText } from "@/lib/telegram";
import { karatRates } from "@/lib/jewellery/calc";
import { MessageCircle, Download } from "lucide-react";

export default function SchemePage() {
  const s = useSettings();
  const toast = useToast();
  const leads = useCollection("schemeLeads");
  const [amt, setAmt] = useState(5000);
  const [months, setMonths] = useState(11);
  const [bonus, setBonus] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const rate22 = karatRates(s.rate24)["22K"];
  const paid = amt * months, bonusAmt = amt * bonus, total = paid + bonusAmt;
  const grams = rate22 ? total / rate22 : 0;

  async function join() {
    if (!name.trim() || !phone.trim()) return toast("Enter name and phone");
    await store.add("schemeLeads", { id: uid(), name: name.trim(), phone: phone.trim(), monthly: amt, created: today() });
    if (s.telegramNotify) tgText(`Scheme lead: ${name} (${phone}) - ₹${amt}/month`);
    window.open(waLink(s.whatsapp, `Namaste! I'm ${name} (${phone}). Interested in the ${s.name} gold savings scheme at ₹${amt}/month. Please share details.`));
    setName(""); setPhone("");
    toast("Lead captured");
  }

  function exportCSV() {
    const csv = ["Name,Phone,Monthly,Date"].concat(leads.map((l) => `"${l.name}","${l.phone}",${l.monthly},${l.created}`)).join("\n");
    const a = document.createElement("a"); a.download = "scheme-leads.csv"; a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.click();
  }

  return (
    <>
      <PageHead title="Gold Savings Scheme" sub="Turn small monthly savings into a big festive purchase - and capture the lead." />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardTitle>Customer calculator</CardTitle>
          <Field label="Monthly amount (₹)">
            <Input type="number" value={amt} step={500} min={500} onChange={(e) => setAmt(+e.target.value || 0)} />
          </Field>
          <div className="my-3 text-center">
            <div className="font-display text-4xl font-extrabold text-[var(--color-crimson)]">{inr(total)}</div>
            <div className="text-xs text-[var(--color-muted)]">after {months} months ≈ {grams.toFixed(1)} g of 22K gold at today's rate</div>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-[var(--color-line)]"><td className="py-2">You pay {months} × {inr(amt)}</td><td className="py-2 text-right">{inr(paid)}</td></tr>
              <tr className="border-b border-[var(--color-line)]"><td className="py-2">{s.name} adds {bonus} month bonus</td><td className="py-2 text-right">+ {inr(bonusAmt)}</td></tr>
              <tr><td className="pt-2 font-bold text-[var(--color-crimson)]">Jewellery you can buy</td><td className="pt-2 text-right font-bold text-[var(--color-crimson)]">{inr(total)}</td></tr>
            </tbody>
          </table>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Field label="Your name"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
            <Field label="Phone"><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
          </div>
          <Button variant="wa" className="mt-3 w-full" onClick={join}><MessageCircle size={15} /> I'm interested - send my details</Button>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardTitle>Owner scheme settings</CardTitle>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Months customer pays"><Input type="number" value={months} onChange={(e) => setMonths(+e.target.value || 1)} /></Field>
              <Field label="Bonus months by showroom"><Input type="number" step="0.5" value={bonus} onChange={(e) => setBonus(+e.target.value || 0)} /></Field>
            </div>
            <p className="mt-2 text-xs text-[var(--color-muted)]">Effective benefit ≈ {((bonus / months) * 100).toFixed(1)}% extra on savings.</p>
          </Card>
          <Card>
            <CardTitle>Leads captured ({leads.length})</CardTitle>
            {leads.length === 0 ? (
              <p className="py-4 text-center text-sm text-[var(--color-muted)]">No leads yet.</p>
            ) : (
              <ul className="max-h-56 space-y-1 overflow-auto text-sm">
                {leads.map((l) => (
                  <li key={l.id} className="flex justify-between border-b border-[var(--color-line)] py-1.5">
                    <span>{l.name} · {l.phone}</span><span className="text-[var(--color-muted)]">₹{l.monthly}/mo</span>
                  </li>
                ))}
              </ul>
            )}
            <Button variant="outline" className="mt-3" onClick={exportCSV}><Download size={15} /> Export leads CSV</Button>
          </Card>
        </div>
      </div>
    </>
  );
}
