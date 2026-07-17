"use client";

import { useState } from "react";
import { PageHead } from "@/components/Shell";
import { Card, CardTitle, Button, Input, Select, Field } from "@/components/ui";
import { useSettings } from "@/lib/settings";
import { estimate, PURITY } from "@/lib/jewellery/calc";
import { complianceForSale } from "@/lib/jewellery/compliance";
import { inr, waLink } from "@/lib/utils";
import { tgText } from "@/lib/telegram";
import { MessageCircle, Send } from "lucide-react";

export default function CalculatorPage() {
  const s = useSettings();
  const [purityKey, setPurityKey] = useState("Gold 22K (916)");
  const [weight, setWeight] = useState(10);
  const [making, setMaking] = useState(s.makingDefault);
  const [makingType, setMakingType] = useState<"pct" | "pg" | "flat">("pct");
  const [wastagePct, setWastage] = useState(0);
  const [oldGold, setOldGold] = useState(0);

  const est = estimate({
    purityKey, weight, rate24: s.rate24, rateSilver: s.rateSilver,
    making, makingType, wastagePct, oldGoldDeduct: oldGold,
  });

  const msg = `*${s.name} - Estimate*\n${purityKey}, ${weight} g\nMetal: ${inr(est.metal)}\nMaking: ${inr(est.making)}\nGST 3%: ${inr(est.gst)}\n*Total: ${inr(est.total)}*\n_Estimate only - visit us for exact billing._`;
  const rows: [string, string][] = [
    [`Rate (${purityKey})`, inr(est.ratePerGram) + " /g"],
    [`Metal value (${weight} g${wastagePct ? ` +${wastagePct}% wastage` : ""})`, inr(est.metal)],
    ["Making charges", inr(est.making)],
    ["GST (3%)", inr(est.gst)],
  ];
  if (oldGold) rows.push(["Old-gold exchange", "− " + inr(oldGold)]);

  return (
    <>
      <PageHead title="Gold Estimator" sub="Instant, honest estimates your customer can trust." />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardTitle>Item</CardTitle>
          <Field label="Metal / purity">
            <Select value={purityKey} onChange={(e) => setPurityKey(e.target.value)}>
              {Object.keys(PURITY).map((k) => <option key={k}>{k}</option>)}
            </Select>
          </Field>
          <Field label="Weight (grams)">
            <Input type="number" value={weight} min={0} step="0.01" onChange={(e) => setWeight(+e.target.value || 0)} />
          </Field>
          <Field label="Making charge">
            <div className="flex gap-2">
              <Input type="number" className="flex-[2]" value={making} step="0.1" onChange={(e) => setMaking(+e.target.value || 0)} />
              <Select className="flex-1" value={makingType} onChange={(e) => setMakingType(e.target.value as "pct")}>
                <option value="pct">% of gold</option>
                <option value="pg">₹ / gram</option>
                <option value="flat">₹ flat</option>
              </Select>
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Wastage %"><Input type="number" value={wastagePct} step="0.1" onChange={(e) => setWastage(+e.target.value || 0)} /></Field>
            <Field label="Old-gold deduction ₹"><Input type="number" value={oldGold} onChange={(e) => setOldGold(+e.target.value || 0)} /></Field>
          </div>
        </Card>

        <Card>
          <CardTitle>Estimate</CardTitle>
          <table className="w-full text-sm">
            <tbody>
              {rows.map(([k, v]) => (
                <tr key={k} className="border-b border-[var(--color-line)]"><td className="py-2">{k}</td><td className="py-2 text-right font-medium">{v}</td></tr>
              ))}
              <tr>
                <td className="pt-3 font-display text-lg font-extrabold text-[var(--color-crimson)]">Total</td>
                <td className="pt-3 text-right font-display text-xl font-extrabold text-[var(--color-crimson)]">{inr(est.total)}</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-4 flex gap-2">
            <Button variant="wa" className="flex-1" onClick={() => window.open(waLink(s.whatsapp, msg))}><MessageCircle size={15} /> WhatsApp</Button>
            <Button variant="tg" className="flex-1" onClick={() => tgText(msg)}><Send size={15} /> Telegram</Button>
          </div>
          <p className="mt-3 text-xs text-[var(--color-muted)]">GST 3% included · estimate only - final at billing.</p>
          {est.total >= 200000 && (
            <ul className="mt-3 space-y-1 rounded-xl bg-[var(--color-surface-2)] p-3 text-xs text-[var(--color-warn)]">
              {complianceForSale(est.total).map((n) => <li key={n}>• {n}</li>)}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
