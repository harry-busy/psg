import "server-only";

/**
 * Multi-provider FREE image generation. All server-side.
 * Default provider "pollinations" needs NO key and works immediately.
 * Add any free key in .env.local to enable the others; set IMAGE_PROVIDER to pick.
 *
 * Every provider returns a data URL (base64) so the browser can render,
 * edit on canvas and download without CORS issues.
 */

export type ImageProvider =
  | "pollinations"
  | "cloudflare"
  | "huggingface"
  | "together"
  | "fal"
  | "replicate"
  | "gemini";

/** Map a pixel size to the closest aspect ratio Replicate's FLUX accepts. */
function aspectRatio(w: number, h: number): string {
  if (w === h) return "1:1";
  const r = w / h;
  if (Math.abs(r - 16 / 9) < 0.12) return "16:9";
  if (Math.abs(r - 9 / 16) < 0.12) return "9:16";
  if (Math.abs(r - 4 / 5) < 0.12) return "4:5";
  if (Math.abs(r - 5 / 4) < 0.12) return "5:4";
  return r > 1 ? "3:2" : "2:3";
}

export interface ImageRequest {
  prompt: string;
  width?: number;
  height?: number;
  provider?: ImageProvider;
}

async function bytesToDataUrl(buf: ArrayBuffer, mime = "image/jpeg"): Promise<string> {
  const b64 = Buffer.from(buf).toString("base64");
  return `data:${mime};base64,${b64}`;
}

const providers: Record<ImageProvider, (r: ImageRequest) => Promise<string>> = {
  // ── Free, no key. FLUX-based. ──────────────────────────────────────────────
  async pollinations({ prompt, width = 1024, height = 1024 }) {
    const seed = Math.floor(Math.random() * 1e6);
    const url =
      `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}` +
      `?width=${width}&height=${height}&nologo=true&seed=${seed}&model=flux`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Pollinations ${res.status}`);
    return bytesToDataUrl(await res.arrayBuffer(), "image/jpeg");
  },

  // ── Cloudflare Workers AI - free tier ~100k req/day (FLUX-1-schnell). ───────
  async cloudflare({ prompt }) {
    const acct = process.env.CF_ACCOUNT_ID;
    const token = process.env.CF_API_TOKEN;
    if (!acct || !token) throw new Error("Set CF_ACCOUNT_ID + CF_API_TOKEN");
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${acct}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, steps: 6 }),
      }
    );
    if (!res.ok) throw new Error(`Cloudflare ${res.status}`);
    const j = await res.json();
    const b64 = j.result?.image;
    if (!b64) throw new Error("Cloudflare returned no image");
    return `data:image/jpeg;base64,${b64}`;
  },

  // ── Hugging Face Inference - small free monthly credit. ─────────────────────
  async huggingface({ prompt }) {
    const token = process.env.HF_TOKEN;
    if (!token) throw new Error("Set HF_TOKEN");
    const model = process.env.HF_IMAGE_MODEL || "black-forest-labs/FLUX.1-schnell";
    const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: prompt }),
    });
    if (!res.ok) throw new Error(`HuggingFace ${res.status}`);
    return bytesToDataUrl(await res.arrayBuffer(), "image/png");
  },

  // ── Together AI - FLUX.1-schnell-Free tier. ─────────────────────────────────
  async together({ prompt, width = 1024, height = 1024 }) {
    const key = process.env.TOGETHER_API_KEY;
    if (!key) throw new Error("Set TOGETHER_API_KEY");
    const res = await fetch("https://api.together.xyz/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "black-forest-labs/FLUX.1-schnell-Free",
        prompt,
        width,
        height,
        response_format: "b64_json",
      }),
    });
    if (!res.ok) throw new Error(`Together ${res.status}`);
    const j = await res.json();
    const b64 = j.data?.[0]?.b64_json;
    const url = j.data?.[0]?.url;
    if (b64) return `data:image/jpeg;base64,${b64}`;
    if (url) return bytesToDataUrl(await (await fetch(url)).arrayBuffer());
    throw new Error("Together returned no image");
  },

  // ── fal.ai - $ free credits on signup (LTX/FLUX). ──────────────────────────
  async fal({ prompt, width = 1024, height = 1024 }) {
    const key = process.env.FAL_KEY;
    if (!key) throw new Error("Set FAL_KEY");
    const res = await fetch("https://fal.run/fal-ai/flux/schnell", {
      method: "POST",
      headers: { Authorization: `Key ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, image_size: { width, height } }),
    });
    if (!res.ok) throw new Error(`fal ${res.status}`);
    const j = await res.json();
    const url = j.images?.[0]?.url;
    if (!url) throw new Error("fal returned no image");
    return bytesToDataUrl(await (await fetch(url)).arrayBuffer());
  },

  // ── Replicate - hosts FLUX schnell. Free trial credits (REPLICATE_API_TOKEN). ─
  async replicate({ prompt, width = 1024, height = 1024 }) {
    const key = process.env.REPLICATE_API_TOKEN;
    if (!key) throw new Error("Set REPLICATE_API_TOKEN");
    const model = process.env.REPLICATE_IMAGE_MODEL || "black-forest-labs/flux-schnell";
    const res = await fetch(`https://api.replicate.com/v1/models/${model}/predictions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "wait" },
      body: JSON.stringify({
        input: {
          prompt,
          aspect_ratio: aspectRatio(width, height),
          output_format: "jpg",
          num_outputs: 1,
          go_fast: true,
        },
      }),
    });
    if (!res.ok) throw new Error(`Replicate ${res.status}`);
    const j = await res.json();
    const out = j.output;
    const url = Array.isArray(out) ? out[0] : out;
    if (!url) throw new Error("Replicate returned no image (may still be processing)");
    return bytesToDataUrl(await (await fetch(url)).arrayBuffer(), "image/jpeg");
  },

  // ── Gemini image (drops in when you add GEMINI_API_KEY). ────────────────────
  async gemini({ prompt }) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("Set GEMINI_API_KEY");
    const model = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ["IMAGE"] },
        }),
      }
    );
    if (!res.ok) throw new Error(`Gemini ${res.status}`);
    const j = await res.json();
    const part = j.candidates?.[0]?.content?.parts?.find(
      (p: { inlineData?: unknown }) => p.inlineData
    );
    const b64 = part?.inlineData?.data;
    if (!b64) throw new Error("Gemini returned no image");
    return `data:image/png;base64,${b64}`;
  },
};

export async function generateImage(req: ImageRequest): Promise<{ dataUrl: string; provider: ImageProvider }> {
  const chosen = (req.provider || (process.env.IMAGE_PROVIDER as ImageProvider) || "pollinations");
  const order: ImageProvider[] = [chosen, "pollinations"]; // graceful fallback to the free no-key one
  let lastErr: unknown;
  for (const p of [...new Set(order)]) {
    try {
      const dataUrl = await providers[p]({ ...req, provider: p });
      return { dataUrl, provider: p };
    } catch (e) {
      lastErr = e;
    }
  }
  throw new Error(`All image providers failed: ${(lastErr as Error)?.message}`);
}
