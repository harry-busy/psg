"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { PageHead } from "@/components/Shell";
import { ReferenceGallery } from "@/components/ReferenceGallery";
import { Card, CardTitle, Button, Input, Field, Select, Textarea, useToast } from "@/components/ui";
import { useSettings } from "@/lib/settings";
import { useCollection } from "@/lib/data/useStore";
import { fileToDataUrl } from "@/lib/image";
import { download, waLink } from "@/lib/utils";
import { tgPhoto } from "@/lib/telegram";
import { aiText } from "@/lib/ai/client";
import { captionPrompt, brandSystem } from "@/lib/ai/prompts";
import { Sparkles, Download, Send, Upload } from "lucide-react";

const THEMES = {
  light: { bg1: "#A8D4C2", bg2: "#7EBFA3", ink: "#1B4D3E", acc: "#1B4D3E", sub: "#0E3327" },
  dark: { bg1: "#1B4D3E", bg2: "#0D3326", ink: "#FFFFFF", acc: "#A8D4C2", sub: "#7EBFA3" },
  red: { bg1: "#0E3327", bg2: "#0D3326", ink: "#FFFFFF", acc: "#7EBFA3", sub: "#A8D4C2" },
} as const;
type Theme = keyof typeof THEMES;

export default function CardsPage() {
  const s = useSettings();
  const products = useCollection("products");
  const toast = useToast();
  const cvRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [f, setF] = useState({ name: "", purity: "22K · 916 Hallmark", weight: "", price: "", theme: "light" as Theme });
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);

  const draw = useCallback(() => {
    const cv = cvRef.current; if (!cv) return;
    const W = cv.width, H = cv.height, t = THEMES[f.theme], ctx = cv.getContext("2d")!;
    const rr = (x: number, y: number, w: number, h: number, r: number) => { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); };
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, t.bg1); g.addColorStop(1, t.bg2); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = t.acc; ctx.fillRect(0, 0, W, 8); ctx.textAlign = "center";
    ctx.fillStyle = t.ink; ctx.font = `700 ${W * 0.045}px Georgia`; ctx.fillText((s.name || "Your Brand").toUpperCase(), W / 2, H * 0.075);
    const py = H * 0.115, ph = H * 0.55, px = W * 0.08, pw = W * 0.84;
    ctx.save(); rr(px, py, pw, ph, 24); ctx.clip(); ctx.fillStyle = f.theme === "light" ? "#fff" : "rgba(255,255,255,.06)"; ctx.fillRect(px, py, pw, ph);
    const img = imgRef.current;
    if (img) { const sc = Math.min(pw / img.width, ph / img.height) * 0.94, dw = img.width * sc, dh = img.height * sc; ctx.drawImage(img, px + (pw - dw) / 2, py + (ph - dh) / 2, dw, dh); }
    else { ctx.fillStyle = t.sub; ctx.font = `${W * 0.03}px sans-serif`; ctx.fillText("Add a product photo", W / 2, py + ph / 2); }
    ctx.restore(); ctx.strokeStyle = t.acc; ctx.lineWidth = 3; rr(px, py, pw, ph, 24); ctx.stroke();
    let y = py + ph + H * 0.06; ctx.fillStyle = t.ink; ctx.font = `600 ${W * 0.042}px Georgia`; ctx.fillText(f.name || "Product Name", W / 2, y);
    y += H * 0.045; ctx.font = `${W * 0.028}px sans-serif`; ctx.fillStyle = t.sub;
    ctx.fillText([f.purity, f.weight && "Weight: " + f.weight].filter(Boolean).join("   ·   "), W / 2, y);
    if (f.price) { y += H * 0.055; ctx.fillStyle = t.acc; ctx.font = `700 ${W * 0.05}px sans-serif`; ctx.fillText((/^[0-9]/.test(f.price) ? "₹ " : "") + f.price, W / 2, y); }
    const fy = H - H * 0.06; ctx.fillStyle = t.acc; rr(W * 0.2, fy - H * 0.033, W * 0.6, H * 0.05, 26); ctx.fill();
    ctx.fillStyle = f.theme === "light" ? "#fff" : "#0E3327"; ctx.font = `600 ${W * 0.026}px sans-serif`;
    ctx.fillText(s.whatsapp ? "WhatsApp to order · +" + s.whatsapp : "Visit our showroom", W / 2, fy);
  }, [f, s.name, s.whatsapp]);

  useEffect(() => { draw(); }, [draw]);

  async function pick(file?: File) {
    if (!file) return;
    const url = await fileToDataUrl(file);
    const img = new Image(); img.onload = () => { imgRef.current = img; draw(); }; img.src = url;
  }
  function loadProduct(id: string) {
    const p = products.find((x) => x.id === id); if (!p) return;
    setF({ ...f, name: p.name, purity: p.purity, weight: p.weight || "", price: p.price || "" });
    if (p.imageDataUrl) { const img = new Image(); img.onload = () => { imgRef.current = img; draw(); }; img.src = p.imageDataUrl; }
  }
  async function genCaption() {
    setBusy(true);
    try {
      const txt = await aiText({ system: brandSystem(s.name, s.city), prompt: captionPrompt(s.name, `${f.name}, ${f.purity}, weight ${f.weight || "n/a"}, price ${f.price || "on request"}`) });
      setCaption(txt.trim());
    } catch (e) { toast((e as Error).message); }
    setBusy(false);
  }
  function dl(square = false) {
    const cv = cvRef.current!; cv.width = 1080; cv.height = square ? 1080 : 1350; draw();
    download((f.name || "card").toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".jpg", cv.toDataURL("image/jpeg", 0.94));
    cv.width = 1080; cv.height = 1350; draw();
  }

  return (
    <>
      <PageHead title="Product Cards" sub="Branded catalog cards for WhatsApp & Instagram." />
      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <Card>
          <CardTitle>Card details</CardTitle>
          {products.length > 0 && (
            <Field label="Load from catalog">
              <Select defaultValue="" onChange={(e) => e.target.value && loadProduct(e.target.value)}>
                <option value="">- choose a piece -</option>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </Select>
            </Field>
          )}
          <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--color-crimson)] bg-[var(--color-surface-2)] p-3 text-sm">
            <Upload size={15} /> Add / replace photo<input type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
          </label>
          <Field label="Product name"><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Antique Lakshmi Necklace" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Purity"><Select value={f.purity} onChange={(e) => setF({ ...f, purity: e.target.value })}>{["22K · 916 Hallmark", "24K · 995", "18K · 750", "Silver 925", "Diamond · IGI"].map((p) => <option key={p}>{p}</option>)}</Select></Field>
            <Field label="Weight"><Input value={f.weight} onChange={(e) => setF({ ...f, weight: e.target.value })} placeholder="12.4 g" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price ₹"><Input value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} placeholder="94,500 / On request" /></Field>
            <Field label="Theme"><Select value={f.theme} onChange={(e) => setF({ ...f, theme: e.target.value as Theme })}><option value="light">Sea glass</option><option value="dark">Emerald</option><option value="red">Deep emerald</option></Select></Field>
          </div>
          <div className="mt-4 flex gap-2">
            <Button className="flex-1" onClick={() => dl(false)}><Download size={15} /> Portrait</Button>
            <Button variant="outline" className="flex-1" onClick={() => dl(true)}><Download size={15} /> Square</Button>
          </div>
          <Button variant="tg" className="mt-2 w-full" onClick={() => tgPhoto(cvRef.current!, `${f.name} - ${f.purity}${f.price ? " - ₹" + f.price : ""}`)}><Send size={15} /> Send to Telegram</Button>
          <Button variant="ai" className="mt-2 w-full" loading={busy} onClick={genCaption}><Sparkles size={15} /> AI caption</Button>
          {caption && <>
            <Textarea className="mt-2" rows={4} value={caption} onChange={(e) => setCaption(e.target.value)} />
            <Button variant="wa" className="mt-2 w-full" onClick={() => window.open(waLink(undefined, caption))}>Share caption on WhatsApp</Button>
          </>}
        </Card>
        <Card className="flex flex-col items-center">
          <CardTitle className="self-start">Preview</CardTitle>
          <canvas ref={cvRef} width={1080} height={1350} className="max-h-[70vh] max-w-full rounded-xl shadow-lg" />
        </Card>
      </div>

      <ReferenceGallery />
    </>
  );
}
