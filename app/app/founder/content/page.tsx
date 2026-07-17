"use client";

import { useState } from "react";
import { PageHead } from "@/components/Shell";
import { Card, CardTitle, Button, Textarea, Select, Field, Chip, useToast } from "@/components/ui";
import { BRANDS, brandDef } from "@/lib/brands";
import type { BrandKey } from "@/lib/data/types";
import { aiText } from "@/lib/ai/client";
import { Sparkles, Copy, Images } from "lucide-react";

// Sample creatives produced by our team, shipped as ready-to-use references.
const DEMO_IMAGES = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg"];

type Mode = "captions" | "reel" | "hashtags" | "offer" | "cold";
const MODES: { id: Mode; label: string }[] = [
  { id: "captions", label: "Post captions" },
  { id: "reel", label: "Reel / video script" },
  { id: "hashtags", label: "Hashtags" },
  { id: "offer", label: "Offer / promo" },
  { id: "cold", label: "Cold outreach (B2B)" },
];

export default function FounderContent() {
  const toast = useToast();
  const [brand, setBrand] = useState<BrandKey>("aurra");
  const [mode, setMode] = useState<Mode>("captions");
  const [input, setInput] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [out, setOut] = useState("");
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true); setOut("");
    const b = brandDef(brand);
    const system = `You are the content lead for ${b.name} - ${b.tagline}. Voice: on-brand, sharp, modern. Do not use emojis.`;
    const prompts: Record<Mode, string> = {
      captions: `Write 5 ${platform} captions for ${b.name} about: ${input || b.tagline}. Each: a hook line + 1 line + 6 hashtags. Number them.`,
      reel: `Write a 20-second ${platform} reel script for ${b.name} about: ${input || b.tagline}. Shot-by-shot (Hook, 3 beats, CTA) + on-screen text + a trending-audio idea.`,
      hashtags: `Give 30 ${platform} hashtags for ${b.name} on the topic "${input || b.tagline}". Group as Broad / Niche / Local (Bengaluru).`,
      offer: `Write promo copy for ${b.name} for: ${input || "a limited offer"}. Headline, 2-line body, a WhatsApp broadcast (<=40 words), and a poster line.`,
      cold: `Write a short B2B cold outreach message for ${b.name} to win: ${input || "a corporate client"}. 3 sentences, one clear CTA, no fluff.`,
    };
    try {
      setOut((await aiText({ system, prompt: prompts[mode], temperature: 0.85, maxTokens: 1200 })).trim());
    } catch (e) { setOut((e as Error).message); }
    setBusy(false);
  }

  return (
    <>
      <PageHead title="Content Studio" sub="On-brand content for any of the four businesses - powered by Groq." />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardTitle>Brief</CardTitle>
          <div className="mb-3 flex flex-wrap gap-2">
            {BRANDS.map((b) => <Chip key={b.key} active={brand === b.key} onClick={() => setBrand(b.key)} className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: b.accent }} />{b.short}</Chip>)}
          </div>
          <div className="mb-3 flex flex-wrap gap-2">
            {MODES.map((m) => <Chip key={m.id} active={mode === m.id} onClick={() => setMode(m.id)}>{m.label}</Chip>)}
          </div>
          <Field label="Platform"><Select value={platform} onChange={(e) => setPlatform(e.target.value)}>{["Instagram", "WhatsApp", "LinkedIn", "YouTube Shorts", "Email"].map((p) => <option key={p}>{p}</option>)}</Select></Field>
          <Field label="Topic / product / target (optional)"><Textarea rows={3} value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. new oversized tee drop / Diwali corporate hampers / offsite for 200" /></Field>
          <Button className="mt-3 w-full" loading={busy} onClick={run}><Sparkles size={15} /> Generate</Button>
        </Card>
        <Card>
          <div className="mb-2 flex items-center justify-between">
            <CardTitle className="mb-0 border-0 pb-0">Result</CardTitle>
            {out && <button className="flex items-center gap-1 text-xs text-[var(--color-muted)]" onClick={() => { navigator.clipboard.writeText(out); toast("Copied"); }}><Copy size={13} /> Copy</button>}
          </div>
          {out ? <pre className="mt-2 whitespace-pre-wrap font-sans text-sm leading-relaxed">{out}</pre> : <p className="py-16 text-center text-sm text-[var(--color-muted)]">Your generated content will appear here.</p>}
        </Card>
      </div>

      <Card className="mt-5">
        <div className="mb-2 flex items-center gap-2">
          <Images size={16} className="text-[var(--color-crimson)]" />
          <CardTitle className="mb-0 border-0 pb-0">Demo images our team created</CardTitle>
        </div>
        <p className="mb-4 text-sm text-[var(--color-muted)]">
          Ready-made creatives our team designed for you. Use them as-is or as references for your own posts.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {DEMO_IMAGES.map((src) => (
            <a
              key={src}
              href={`/demo/${src}`}
              target="_blank"
              rel="noreferrer"
              className="group relative block overflow-hidden rounded-xl border border-[var(--color-line)]"
            >
              <img
                src={`/demo/${src}`}
                alt="Demo creative by our team"
                loading="lazy"
                className="aspect-square w-full object-cover transition group-hover:scale-[1.03]"
              />
            </a>
          ))}
        </div>
      </Card>
    </>
  );
}
