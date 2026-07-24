"use client";

import { useState } from "react";
import { PageHead } from "@/components/Shell";
import { ReferenceGallery } from "@/components/ReferenceGallery";
import { Card, CardTitle, Button, Field, Select, Textarea, Chip, Badge, useToast } from "@/components/ui";
import { useSettings } from "@/lib/settings";
import { useCollection } from "@/lib/data/useStore";
import { fileToDataUrl } from "@/lib/image";
import { download, waLink } from "@/lib/utils";
import { tgImage } from "@/lib/telegram";
import { aiText, aiVision, aiImage } from "@/lib/ai/client";
import { brandSystem, captionPrompt } from "@/lib/ai/prompts";
import { Sparkles, Wand2, Upload, Download, Send, X } from "lucide-react";

/**
 * AI Photo Studio - generation-first (Higgsfield-style). Upload a product
 * photo (or just describe it) and get a clean, professional studio image.
 * No manual background/backdrop editing - just the finished image.
 */

const SCENES = [
  "seamless cream studio backdrop, soft key light",
  "black velvet jewellery bust, warm spotlight",
  "white marble flat-lay with soft shadows",
  "pearl-grey gradient, luxury e-commerce look",
  "festive Diwali scene with warm gold bokeh and diyas",
  "worn by an elegant model, editorial, soft bokeh",
];
const SIZES = { "1024x1024": "Square 1:1", "1024x1280": "Portrait 4:5", "1280x720": "Landscape 16:9" };
const PROVIDERS = [
  ["pollinations", "Pollinations · free, no key"],
  ["cloudflare", "Cloudflare"],
  ["together", "Together"],
  ["huggingface", "Hugging Face"],
  ["fal", "fal.ai"],
  ["gemini", "Gemini"],
];

export default function StudioPage() {
  const s = useSettings();
  const products = useCollection("products");
  const toast = useToast();
  const [source, setSource] = useState<string | null>(null); // uploaded product photo (data URL)
  const [describe, setDescribe] = useState("22K gold antique temple necklace with Lakshmi pendant");
  const [scene, setScene] = useState(SCENES[0]);
  const [size, setSize] = useState("1024x1024");
  const [provider, setProvider] = useState(s.imageProvider);
  const [result, setResult] = useState<{ url: string; provider: string } | null>(null);
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState("");

  async function upload(file?: File) {
    if (!file) return;
    setSource(await fileToDataUrl(file));
  }

  async function create() {
    setBusy("create");
    setResult(null);
    setCaption("");
    try {
      // If a real photo is provided, describe it precisely so the studio shot matches the actual piece.
      let subject = describe;
      if (source) {
        toast("Reading your photo…");
        subject = await aiVision(
          "Describe ONLY this jewellery piece precisely for an image generator (type, metal colour, stones, style). One sentence, no background.",
          source
        );
        setDescribe(subject);
      }
      const [w, h] = size.split("x").map(Number);
      const prompt = `Professional luxury studio product photograph of ${subject}, on ${scene}, ultra-detailed, crisp focus, high-end jewellery catalog photography, realistic, no text, no watermark, no people unless a model is specified.`;
      const r = await aiImage(prompt, { width: w, height: h, provider });
      setResult({ url: r.dataUrl, provider: r.provider });
      toast(`Studio image ready (${r.provider})`);
    } catch (e) {
      toast((e as Error).message);
    }
    setBusy("");
  }

  async function genCaption() {
    if (!result) return;
    setBusy("cap");
    try {
      const txt = await aiText({ system: brandSystem(s.name, s.city), prompt: captionPrompt(s.name, describe) });
      setCaption(txt.trim());
    } catch (e) { toast((e as Error).message); }
    setBusy("");
  }

  return (
    <>
      <PageHead title="AI Photo Studio" sub="Turn any product into a clean, professional studio image - just the image, ready to post." />
      <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
        {/* controls */}
        <div className="space-y-5">
          <Card>
            <CardTitle>Subject</CardTitle>

            {source ? (
              <div className="relative mb-2">
                <img src={source} alt="source" className="w-full rounded-xl object-cover" />
                <button onClick={() => setSource(null)} className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white" aria-label="Remove"><X size={14} /></button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-[var(--color-line)] bg-[var(--color-surface-2)] p-6 text-center text-sm text-[#3F6E5C]">
                <Upload size={18} className="text-[var(--color-crimson)]" />
                Upload a product photo <span className="text-xs">(optional - improves accuracy)</span>
                <input type="file" accept="image/*" hidden onChange={(e) => upload(e.target.files?.[0])} />
              </label>
            )}

            {products.length > 0 && !source && (
              <Field label="…or pick from your catalog">
                <Select defaultValue="" onChange={(e) => { const p = products.find((x) => x.id === e.target.value); if (p?.imageDataUrl) setSource(p.imageDataUrl); if (p) setDescribe(`${p.name}, ${p.purity}`); }}>
                  <option value="">Choose a piece…</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </Select>
              </Field>
            )}

            <Field label={source ? "Description (auto-read from photo)" : "Describe the piece"}>
              <Textarea rows={2} value={describe} onChange={(e) => setDescribe(e.target.value)} />
            </Field>
          </Card>

          <Card>
            <CardTitle>Studio scene</CardTitle>
            <div className="flex flex-wrap gap-2">
              {SCENES.map((sc) => <Chip key={sc} active={scene === sc} onClick={() => setScene(sc)}>{sc.split(",")[0]}</Chip>)}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Field label="Size"><Select value={size} onChange={(e) => setSize(e.target.value)}>{Object.entries(SIZES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</Select></Field>
              <Field label="Provider (free)"><Select value={provider} onChange={(e) => setProvider(e.target.value)}>{PROVIDERS.map(([k, v]) => <option key={k} value={k}>{v}</option>)}</Select></Field>
            </div>
            <Button className="mt-4 w-full" loading={busy === "create"} onClick={create}><Wand2 size={16} /> Create studio image</Button>
          </Card>
        </div>

        {/* result */}
        <Card className="flex min-h-[420px] flex-col">
          <CardTitle>Result</CardTitle>
          {result ? (
            <div className="flex flex-1 flex-col items-center">
              <img src={result.url} alt="studio result" className="max-h-[60vh] rounded-xl shadow-lg" />
              <Badge className="mt-3">generated via {result.provider}</Badge>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Button variant="outline" onClick={() => download("studio.jpg", result.url)}><Download size={15} /> Download</Button>
                <Button variant="tg" onClick={async () => { const r = await tgImage(result.url, `${s.name} - new design`); toast(r.ok ? "Sent to Telegram" : r.error || "Telegram not configured"); }}><Send size={15} /> Telegram</Button>
                <Button variant="ai" loading={busy === "cap"} onClick={genCaption}><Sparkles size={15} /> AI caption</Button>
              </div>
              {caption && (
                <div className="mt-3 w-full">
                  <Textarea rows={4} value={caption} onChange={(e) => setCaption(e.target.value)} />
                  <Button variant="wa" className="mt-2 w-full" onClick={() => window.open(waLink(undefined, caption))}>Share caption on WhatsApp</Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-center text-sm text-[var(--color-muted)]">
              <Wand2 size={28} className="mb-3 text-[var(--color-line)]" />
              {busy === "create" ? "Creating your studio image…" : "Your professional studio image will appear here."}
            </div>
          )}
        </Card>
      </div>

      <ReferenceGallery />
    </>
  );
}
