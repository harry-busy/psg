"use client";

import { useState } from "react";
import { PageHead } from "@/components/Shell";
import { Card, CardTitle, Button, Input, Field, Select, useToast } from "@/components/ui";
import { useCollection } from "@/lib/data/useStore";
import { store } from "@/lib/data/store";
import { fileToDataUrl } from "@/lib/image";
import { aiVision } from "@/lib/ai/client";
import { uid, today } from "@/lib/utils";
import { useSettings } from "@/lib/settings";
import { Trash2, Sparkles, ImagePlus } from "lucide-react";
import type { Product } from "@/lib/data/types";

const PURITIES = ["22K · 916 Hallmark", "24K · 995", "18K · 750", "Silver 925", "Diamond · IGI"];
const CATEGORIES = ["Necklace", "Bangles", "Ring", "Earrings", "Chain", "Mangalsutra", "Bracelet", "Coin/Bar", "Other"];

export default function CatalogPage() {
  const products = useCollection("products");
  const s = useSettings();
  const toast = useToast();
  const [form, setForm] = useState<Partial<Product>>({ purity: PURITIES[0], category: CATEGORIES[0] });
  const [busy, setBusy] = useState(false);

  async function pick(file?: File) {
    if (!file) return;
    setForm({ ...form, imageDataUrl: await fileToDataUrl(file) });
  }

  async function aiFill() {
    if (!form.imageDataUrl) return toast("Add a photo first");
    setBusy(true);
    try {
      const txt = await aiVision(
        `You are cataloguing jewellery for ${s.name}. Return a short product name (max 5 words) and a likely category from [${CATEGORIES.join(", ")}] as "Name | Category".`,
        form.imageDataUrl
      );
      const [name, category] = txt.split("|").map((x) => x.trim());
      setForm({ ...form, name: name || form.name, category: CATEGORIES.includes(category) ? category : form.category });
      toast("Filled from photo");
    } catch (e) { toast((e as Error).message); }
    setBusy(false);
  }

  async function save() {
    if (!form.name?.trim()) return toast("Product name required");
    await store.add("products", {
      id: uid(), name: form.name.trim(), purity: form.purity || PURITIES[0], weight: form.weight || "",
      price: form.price || "", huid: form.huid || "", category: form.category || "Other",
      imageDataUrl: form.imageDataUrl, created: today(),
    });
    setForm({ purity: PURITIES[0], category: CATEGORIES[0] });
    toast("Added to catalog");
  }

  return (
    <>
      <PageHead title="Catalog" sub="Your product library - reused across cards, posts and broadcasts." />
      <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
        <Card>
          <CardTitle>Add a piece</CardTitle>
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-[var(--color-crimson)] bg-[var(--color-surface-2)] p-5 text-center text-sm">
            {form.imageDataUrl ? <img src={form.imageDataUrl} alt="" className="max-h-40 rounded-lg" /> : <><ImagePlus className="text-[var(--color-crimson)]" /><span>Click to add product photo</span></>}
            <input type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
          </label>
          {form.imageDataUrl && <Button variant="ai" className="mt-2 w-full" loading={busy} onClick={aiFill}><Sparkles size={15} /> Auto-fill from photo</Button>}
          <Field label="Product name"><Input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Antique Lakshmi Necklace" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Purity"><Select value={form.purity} onChange={(e) => setForm({ ...form, purity: e.target.value })}>{PURITIES.map((p) => <option key={p}>{p}</option>)}</Select></Field>
            <Field label="Category"><Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</Select></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Weight"><Input value={form.weight || ""} onChange={(e) => setForm({ ...form, weight: e.target.value })} placeholder="12.4 g" /></Field>
            <Field label="Price ₹"><Input value={form.price || ""} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="94,500" /></Field>
          </div>
          <Field label="HUID / hallmark"><Input value={form.huid || ""} onChange={(e) => setForm({ ...form, huid: e.target.value })} placeholder="HUID123456" /></Field>
          <Button className="mt-4 w-full" onClick={save}>Add to catalog</Button>
        </Card>

        <div>
          <p className="mb-3 text-sm text-[var(--color-muted)]">{products.length} piece{products.length === 1 ? "" : "s"}</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {products.length === 0 && <p className="col-span-full py-10 text-center text-[var(--color-muted)]">Nothing yet - add a piece or load demo data in Settings.</p>}
            {products.map((p) => (
              <Card key={p.id} className="p-3">
                <div className="mb-2 flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-[var(--color-surface-2)]">
                  {p.imageDataUrl ? <img src={p.imageDataUrl} alt={p.name} className="h-full w-full object-cover" /> : <span className="text-xs text-[var(--color-muted)]">no photo</span>}
                </div>
                <div className="font-medium leading-tight">{p.name}</div>
                <div className="text-xs text-[var(--color-muted)]">{p.purity}{p.weight ? " · " + p.weight : ""}</div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="font-semibold text-[var(--color-crimson)]">{p.price ? "₹" + p.price : "On request"}</span>
                  <button onClick={() => store.remove("products", p.id)}><Trash2 size={15} className="text-[var(--color-muted)]" /></button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
