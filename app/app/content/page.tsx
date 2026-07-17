"use client";

import { useState } from "react";
import { PageHead } from "@/components/Shell";
import { ReferenceGallery } from "@/components/ReferenceGallery";
import { Card, CardTitle, Button, Textarea, Select, Field, Chip, useToast } from "@/components/ui";
import { useSettings } from "@/lib/settings";
import { useCollection } from "@/lib/data/useStore";
import { aiText } from "@/lib/ai/client";
import { brandSystem } from "@/lib/ai/prompts";
import { Sparkles, Copy } from "lucide-react";

type Mode = "captions" | "hashtags" | "reel" | "reply" | "offer";
const MODES: { id: Mode; label: string }[] = [
  { id: "captions", label: "Weekly captions from catalog" },
  { id: "reel", label: "Reel / video script" },
  { id: "hashtags", label: "Hashtag research" },
  { id: "offer", label: "Offer / promo copy" },
  { id: "reply", label: "Reply to a customer message" },
];

export default function ContentPage() {
  const s = useSettings();
  const products = useCollection("products");
  const toast = useToast();
  const [mode, setMode] = useState<Mode>("captions");
  const [input, setInput] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [out, setOut] = useState("");
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true); setOut("");
    const catalog = products.slice(0, 8).map((p) => `${p.name} (${p.purity}${p.weight ? ", " + p.weight : ""})`).join("; ");
    const prompts: Record<Mode, string> = {
      captions: `Write ${platform} captions for this week for ${s.name}. Products: ${catalog || input || "gold jewellery collection"}. Give 5 posts, each: 2 lines + 6 hashtags. Number them.`,
      reel: `Write a 20-second ${platform} reel script for ${s.name} about: ${input || catalog || "a new gold collection"}. Give shot-by-shot (Hook, 3 beats, CTA) + on-screen text + a trending-audio suggestion.`,
      hashtags: `Give 30 ${platform} hashtags for a jewellery post about "${input || "gold jewellery"}" for ${s.name}${s.city ? " in " + s.city : ""}. Mix broad, niche and local. Group as Broad / Niche / Local.`,
      offer: `Write festive/promo copy for ${s.name} for: ${input || "a limited-time gold offer"}. Give a headline, 2-line body, WhatsApp broadcast (<=40 words), and a short poster line.`,
      reply: `A customer messaged ${s.name}: "${input}". Write a warm, human, on-brand reply that answers them and moves toward a visit/appointment. Plain text, <=80 words.`,
    };
    try {
      const txt = await aiText({ system: brandSystem(s.name, s.city), prompt: prompts[mode], temperature: 0.85, maxTokens: 1400 });
      setOut(txt.trim());
    } catch (e) { setOut((e as Error).message); }
    setBusy(false);
  }

  return (
    <>
      <PageHead title="AI Content Studio" sub="Your marketing team in a box - powered by Groq, tuned for jewellery." />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardTitle>What do you need?</CardTitle>
          <div className="mb-3 flex flex-wrap gap-2">
            {MODES.map((m) => <Chip key={m.id} active={mode === m.id} onClick={() => setMode(m.id)}>{m.label}</Chip>)}
          </div>
          <Field label="Platform">
            <Select value={platform} onChange={(e) => setPlatform(e.target.value)}>
              {["Instagram", "WhatsApp", "Facebook", "YouTube Shorts", "Google Business"].map((p) => <option key={p}>{p}</option>)}
            </Select>
          </Field>
          <Field label={mode === "reply" ? "Paste the customer's message" : "Topic / product (optional - uses your catalog)"}>
            <Textarea rows={4} value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === "reply" ? "Do you have temple jewellery sets under 50k?" : "e.g. Akshaya Tritiya lightweight collection"} />
          </Field>
          <Button className="mt-3 w-full" loading={busy} onClick={run}><Sparkles size={15} /> Generate</Button>
          {mode === "captions" && !products.length && <p className="mt-2 text-xs text-[var(--color-muted)]">Tip: add pieces to your Catalog and captions will use them automatically.</p>}
        </Card>

        <Card>
          <div className="mb-2 flex items-center justify-between">
            <CardTitle className="mb-0 border-0 pb-0">Result</CardTitle>
            {out && <button className="flex items-center gap-1 text-xs text-[var(--color-muted)]" onClick={() => { navigator.clipboard.writeText(out); toast("Copied"); }}><Copy size={13} /> Copy</button>}
          </div>
          {out ? <pre className="mt-2 whitespace-pre-wrap font-sans text-sm leading-relaxed">{out}</pre>
            : <p className="py-16 text-center text-sm text-[var(--color-muted)]">Your generated content will appear here.</p>}
        </Card>
      </div>

      <ReferenceGallery />
    </>
  );
}
