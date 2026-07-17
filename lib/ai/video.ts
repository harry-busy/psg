import "server-only";

/**
 * FREE-tier video generation (beta). Text→video and image→video.
 * fal.ai and Replicate both give free credits on signup; add either key to
 * enable. These host the best open models (LTX-Video, Wan 2.2, HunyuanVideo).
 * Returns a hosted mp4 URL.
 */

export type VideoProvider = "fal" | "replicate";

export interface VideoRequest {
  prompt: string;
  imageDataUrl?: string; // for image→video
  provider?: VideoProvider;
}

const providers: Record<VideoProvider, (r: VideoRequest) => Promise<string>> = {
  // fal.ai - LTX-Video (fastest open model). Free credits on signup.
  async fal({ prompt, imageDataUrl }) {
    const key = process.env.FAL_KEY;
    if (!key) throw new Error("Add a free FAL_KEY (fal.ai) to enable video.");
    const endpoint = imageDataUrl
      ? "https://fal.run/fal-ai/ltx-video/image-to-video"
      : "https://fal.run/fal-ai/ltx-video";
    const body: Record<string, unknown> = { prompt };
    if (imageDataUrl) body.image_url = imageDataUrl;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Key ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`fal video ${res.status}`);
    const j = await res.json();
    const url = j.video?.url || j.videos?.[0]?.url;
    if (!url) throw new Error("fal returned no video");
    return url;
  },

  // Replicate - hosts Wan 2.2 / LTX / CogVideoX. Free credits on signup.
  async replicate({ prompt, imageDataUrl }) {
    const key = process.env.REPLICATE_API_TOKEN;
    if (!key) throw new Error("Add a free REPLICATE_API_TOKEN to enable video.");
    const version =
      process.env.REPLICATE_VIDEO_VERSION ||
      "lightricks/ltx-video:8c47da666861d081eeb4d1261853087de23923a268a69b63febdf5dc1dee08e4";
    const create = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "wait",
      },
      body: JSON.stringify({
        version,
        input: imageDataUrl ? { prompt, image: imageDataUrl } : { prompt },
      }),
    });
    if (!create.ok) throw new Error(`Replicate ${create.status}`);
    const j = await create.json();
    const out = j.output;
    const url = Array.isArray(out) ? out[out.length - 1] : out;
    if (!url) throw new Error("Replicate returned no video (may still be processing)");
    return url as string;
  },
};

export async function generateVideo(req: VideoRequest): Promise<{ url: string; provider: VideoProvider }> {
  const chosen = (req.provider || (process.env.VIDEO_PROVIDER as VideoProvider) || "fal");
  const order: VideoProvider[] = [...new Set([chosen, "fal", "replicate"])].filter(
    (p): p is VideoProvider => p === "fal" || p === "replicate"
  );
  let lastErr: unknown;
  for (const p of order) {
    try {
      return { url: await providers[p]({ ...req, provider: p }), provider: p };
    } catch (e) {
      lastErr = e;
    }
  }
  throw new Error((lastErr as Error)?.message || "No video provider configured");
}
