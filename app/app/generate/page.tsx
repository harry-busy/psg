"use client";

import { useState } from "react";
import { PageHead } from "@/components/Shell";
import { ReferenceGallery } from "@/components/ReferenceGallery";
import { Card, CardTitle, Button, Textarea, Select, Field, Chip, Badge, useToast } from "@/components/ui";
import { useSettings } from "@/lib/settings";
import { aiImage, aiVideo } from "@/lib/ai/client";
import { download } from "@/lib/utils";
import { Wand2, Film, Download, ImageIcon } from "lucide-react";

const STYLES = [
  "luxury studio product shot on seamless backdrop",
  "on a velvet jewellery bust, warm spotlight",
  "flat-lay on marble with rose petals, festive",
  "worn by an elegant model, soft bokeh, editorial",
  "Diwali festive scene with diyas and gold bokeh",
];

export default function GeneratePage() {
  const s = useSettings();
  const toast = useToast();
  const [tab, setTab] = useState<"image" | "video">("image");
  const [prompt, setPrompt] = useState("A 22K gold antique temple necklace set with Lakshmi pendant and rubies");
  const [style, setStyle] = useState(STYLES[0]);
  const [ratio, setRatio] = useState("1024x1024");
  const [provider, setProvider] = useState(s.imageProvider);
  const [img, setImg] = useState<{ url: string; provider: string } | null>(null);
  const [vid, setVid] = useState<{ url: string; provider: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const full = `${prompt}, ${style}, ultra-detailed, high-end jewellery catalog photography, no text, no watermark`;

  async function genImage() {
    setBusy(true); setImg(null);
    try {
      const [w, h] = ratio.split("x").map(Number);
      const r = await aiImage(full, { width: w, height: h, provider });
      setImg({ url: r.dataUrl, provider: r.provider });
    } catch (e) { toast((e as Error).message); }
    setBusy(false);
  }
  async function genVideo() {
    setBusy(true); setVid(null); toast("Generating video - this can take a minute…");
    try {
      const r = await aiVideo(`${prompt}, cinematic slow rotating jewellery product video, ${style}`, { imageDataUrl: img?.url });
      setVid({ url: r.url, provider: r.provider });
    } catch (e) { toast((e as Error).message); }
    setBusy(false);
  }

  return (
    <>
      <PageHead title="Image & Video Studio" sub="Generate fresh visuals with free AI models - Pollinations works with no key at all." />
      <div className="mb-4 flex gap-2">
        <Chip active={tab === "image"} onClick={() => setTab("image")} className="inline-flex items-center gap-1.5"><ImageIcon size={14} /> Image</Chip>
        <Chip active={tab === "video"} onClick={() => setTab("video")} className="inline-flex items-center gap-1.5"><Film size={14} /> Video <Badge className="ml-1">beta</Badge></Chip>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardTitle>Describe the piece</CardTitle>
          <Textarea rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          <Field label="Scene / style">
            <Select value={style} onChange={(e) => setStyle(e.target.value)}>{STYLES.map((x) => <option key={x}>{x}</option>)}</Select>
          </Field>
          {tab === "image" ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Size"><Select value={ratio} onChange={(e) => setRatio(e.target.value)}><option value="1024x1024">Square</option><option value="1024x1280">Portrait</option><option value="1280x720">Landscape</option></Select></Field>
                <Field label="Provider (free)">
                  <Select value={provider} onChange={(e) => setProvider(e.target.value)}>
                    <option value="pollinations">Pollinations (no key)</option>
                    <option value="cloudflare">Cloudflare</option>
                    <option value="together">Together</option>
                    <option value="huggingface">Hugging Face</option>
                    <option value="fal">fal.ai</option>
                    <option value="replicate">Replicate (FLUX)</option>
                    <option value="gemini">Gemini</option>
                  </Select>
                </Field>
              </div>
              <Button className="mt-4 w-full" loading={busy} onClick={genImage}><Wand2 size={16} /> Generate image</Button>
            </>
          ) : (
            <>
              <p className="mt-2 text-xs text-[var(--color-muted)]">Video uses free credits on fal.ai / Replicate (add a free key on the server). If you generated an image first, it's used as the starting frame.</p>
              <Button className="mt-4 w-full" loading={busy} onClick={genVideo}><Film size={16} /> Generate video</Button>
            </>
          )}
        </Card>

        <Card className="flex flex-col items-center justify-center">
          <CardTitle className="self-start">Result</CardTitle>
          {tab === "image" ? (
            img ? (
              <>
                <img src={img.url} alt="generated" className="max-h-[60vh] rounded-xl shadow-lg" />
                <div className="mt-3 flex items-center gap-2">
                  <Badge>via {img.provider}</Badge>
                  <Button variant="outline" onClick={() => download("ospyr-generated.jpg", img.url)}><Download size={15} /> Download</Button>
                </div>
              </>
            ) : <p className="py-20 text-center text-sm text-[var(--color-muted)]">{busy ? "Generating…" : "Your image will appear here."}</p>
          ) : (
            vid ? (
              <>
                <video src={vid.url} controls autoPlay loop className="max-h-[60vh] rounded-xl shadow-lg" />
                <Badge className="mt-3">via {vid.provider}</Badge>
              </>
            ) : <p className="py-20 text-center text-sm text-[var(--color-muted)]">{busy ? "Rendering video…" : "Your video will appear here."}</p>
          )}
        </Card>
      </div>

      <ReferenceGallery />
    </>
  );
}
