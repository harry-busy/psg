"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import QRCode from "qrcode";
import { PageHead } from "@/components/Shell";
import { Card, CardTitle, Button, Input, Field, Select } from "@/components/ui";
import { useSettings } from "@/lib/settings";
import { download } from "@/lib/utils";

const FORMATS = {
  poster: { label: "A4 poster", dims: [1240, 1754] },
  card: { label: 'Counter card 5×7"', dims: [1050, 1470] },
  sticker: { label: 'Square sticker 4×4"', dims: [1200, 1200] },
} as const;
type Fmt = keyof typeof FORMATS;

export default function ReviewsPage() {
  const s = useSettings();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [url, setUrl] = useState(s.reviewLink || "");
  const [tag, setTag] = useState("Loved your jewellery? Bless us with a review!");
  const [fmt, setFmt] = useState<Fmt>("poster");

  const draw = useCallback(async () => {
    const cv = canvasRef.current;
    if (!cv) return;
    const [W, H] = FORMATS[fmt].dims;
    cv.width = W; cv.height = H;
    const ctx = cv.getContext("2d")!;
    const dark = s.velvet;
    ctx.fillStyle = dark ? "#0D3326" : "#EAF5F0"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#1B4D3E"; ctx.fillRect(0, 0, W, H * 0.015); ctx.fillRect(0, H - H * 0.015, W, H * 0.015);
    ctx.textAlign = "center";
    ctx.fillStyle = dark ? "#EAF5F0" : "#1B4D3E"; ctx.font = `700 ${W * 0.06}px Georgia`;
    ctx.fillText((s.name || "Your Brand").toUpperCase(), W / 2, H * 0.12);
    ctx.font = `${W * 0.055}px sans-serif`; ctx.fillText("★★★★★", W / 2, H * 0.19);
    ctx.fillStyle = "#1B4D3E"; ctx.font = `600 ${W * 0.033}px sans-serif`;
    wrap(ctx, tag, W * 0.8, W * 0.033).forEach((l, i) => ctx.fillText(l, W / 2, H * 0.25 + i * W * 0.045));

    const qrData = await QRCode.toDataURL(url || "https://google.com", { width: 512, margin: 1 });
    const img = new Image();
    await new Promise((res) => { img.onload = res; img.src = qrData; });
    const q = Math.min(W, H) * 0.42, qx = (W - q) / 2, qy = H * 0.33;
    ctx.fillStyle = "#fff"; round(ctx, qx - 20, qy - 20, q + 40, q + 40, 20); ctx.fill();
    ctx.strokeStyle = "#7EBFA3"; ctx.lineWidth = 4; round(ctx, qx - 20, qy - 20, q + 40, q + 40, 20); ctx.stroke();
    ctx.drawImage(img, qx, qy, q, q);

    ctx.fillStyle = dark ? "#EAF5F0" : "#1B4D3E"; ctx.font = `600 ${W * 0.03}px sans-serif`;
    ctx.fillText("Scan with your phone camera", W / 2, H * 0.83);
    ctx.fillStyle = dark ? "#A8D4C2" : "#4E8A72"; ctx.font = `${W * 0.024}px sans-serif`;
    ctx.fillText("30 seconds - it means the world to our family business", W / 2, H * 0.88);
  }, [fmt, s.name, s.velvet, tag, url]);

  useEffect(() => { void draw(); }, [draw]);

  return (
    <>
      <PageHead title="Reviews & QR Kit" sub="Turn happy customers into 5-star Google reviews." />
      <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
        <Card>
          <CardTitle>Details</CardTitle>
          <Field label="Google review link"><Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://g.page/r/…/review" /></Field>
          <Field label="Tagline"><Input value={tag} onChange={(e) => setTag(e.target.value)} /></Field>
          <Field label="Format">
            <Select value={fmt} onChange={(e) => setFmt(e.target.value as Fmt)}>
              {Object.entries(FORMATS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </Select>
          </Field>
          <Button className="mt-4 w-full" onClick={() => download(`review-qr-${fmt}.png`, canvasRef.current!.toDataURL("image/png"))}>Download PNG</Button>
          <p className="mt-3 text-xs text-[var(--color-muted)]">Get your link: Google Business Profile → "Ask for reviews" → copy link.</p>
        </Card>
        <Card className="flex flex-col items-center">
          <CardTitle className="self-start">Preview</CardTitle>
          <canvas ref={canvasRef} className="max-h-[70vh] max-w-full rounded-xl shadow-lg" />
        </Card>
      </div>
    </>
  );
}

function wrap(ctx: CanvasRenderingContext2D, t: string, maxW: number, fontRatio: number) {
  ctx.font = `600 ${ctx.canvas.width * fontRatio}px sans-serif`;
  const words = t.split(" "); const lines: string[] = []; let line = "";
  words.forEach((w) => {
    if (ctx.measureText(line + " " + w).width > maxW && line) { lines.push(line); line = w; }
    else line = line ? line + " " + w : w;
  });
  if (line) lines.push(line);
  return lines;
}
function round(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
