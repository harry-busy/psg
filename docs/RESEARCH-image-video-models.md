# Free Image & Video Generation — Research & Provider Strategy (2026)

Research for **Ospyr Jewellery OS**. Goal: production-quality image (and video) generation that is
**free**, needs **no GPU**, and slots behind one swappable adapter (`lib/ai/image.ts`,
`lib/ai/video.ts`). Everything below is wired or ready to wire — you only add a free key.

---

## TL;DR recommendation

| Need | Use now (free, no/low friction) | Upgrade later |
|---|---|---|
| **Image — default** | **Pollinations** (no key, FLUX) — already the default | Gemini 2.5 Flash Image / Higgsfield (your keys) |
| **Image — higher volume** | **Cloudflare Workers AI** (~100k req/day free, FLUX-1-schnell) | Together AI FLUX-free, Hugging Face |
| **Video (beta)** | **fal.ai** free credits (LTX-Video, fastest) | Replicate (Wan 2.2, CogVideoX), Higgsfield |
| **Text / vision / captions** | **Groq** (Llama 3.3 70B + Llama-4 vision) — already wired | — |

The app defaults to Pollinations so **image generation works the moment you open it, with zero setup**.
Add any key below and switch the provider in Settings.

---

## Best open image models (2026)

| Model | Maker | License | Why it matters |
|---|---|---|---|
| **FLUX.2** / FLUX.1 [schnell] | Black Forest Labs | schnell = Apache-2.0 | Frontier quality; schnell makes an image in 1–4 steps (fast, free-friendly). **Our default via Pollinations/Cloudflare/Together.** |
| **Stable Diffusion 3.5** | Stability AI | community | Biggest ecosystem — LoRAs, ControlNet, inpainting. |
| **Qwen-Image / Z-Image-Turbo** | Alibaba | Apache-2.0 | Excellent bilingual **text rendering** (great for on-image offer text); Z-Image rivals FLUX at a fraction of size. |
| **HunyuanImage 3.0** | Tencent | community | Strong photoreal quality. |
| **NVIDIA Sana** | NVIDIA | research/OSS | 1024² in <1s on modest hardware. |

## Best open video models (2026)

| Model | Maker | License | Notes |
|---|---|---|---|
| **Wan 2.2** | Alibaba | Apache-2.0 | Most versatile — text→video, image→video, editing in one model. Best commercial pick. |
| **LTX-Video** | Lightricks | OpenRAIL-ish | **Fastest** — ~5s clip in <30s on a 4090. Our default on fal.ai. |
| **HunyuanVideo 1.5** | Tencent | community (≤100M MAU free) | High quality. |
| **CogVideoX (2B/5B)** | Zhipu AI | Apache-2.0 (2B) | Runs on 24GB consumer GPUs. |
| **Mochi 1 / Open-Sora 2.0 / SkyReels V2** | various | Apache-2.0 | Fully commercial, no restrictions. |

---

## Free hosted APIs (no GPU needed) — what's actually free

### Wired into the app (`lib/ai/image.ts` / `video.ts`)

1. **Pollinations** — `image.pollinations.ai` — **no key, no signup, unlimited**, OpenAI-compatible, FLUX-based. Default. Repo: https://github.com/pollinations/pollinations
2. **Cloudflare Workers AI** — free tier ~**100,000 req/day**, FLUX-1-schnell + SDXL. Keys: `CF_ACCOUNT_ID`, `CF_API_TOKEN`. Docs: https://developers.cloudflare.com/workers-ai/models/
   - Self-host option (even more control): https://github.com/dotusmanali/Cloudflare-Image-Worker (OpenAI-compatible worker, works with n8n).
3. **Together AI** — `FLUX.1-schnell-Free` tier. Key: `TOGETHER_API_KEY`. https://api.together.xyz
4. **Hugging Face Inference** — small monthly free credit, thousands of models. Key: `HF_TOKEN`. https://huggingface.co/docs/inference-providers
5. **fal.ai** — ~$10 free credits on signup (≈50–100 videos). Best for **video** (LTX/Wan). Key: `FAL_KEY`. https://fal.ai
6. **Replicate** — small free credits, widest model catalog (Wan 2.2, CogVideoX, LTX). Key: `REPLICATE_API_TOKEN`. https://replicate.com/collections/image-to-video
7. **Gemini 2.5 Flash Image** — your key drops in (`GEMINI_API_KEY`); best for image **edit/re-shoot** (true image-to-image).

### How to get keys (all free)
- **Cloudflare:** dash.cloudflare.com → Workers & AI → API token (Workers AI) + Account ID.
- **Together:** api.together.xyz → sign up → API key.
- **Hugging Face:** huggingface.co → Settings → Access Tokens.
- **fal.ai:** fal.ai → keys.
- **Replicate:** replicate.com → account → API tokens.

Put any of them in `.env.local` and set `IMAGE_PROVIDER` / `VIDEO_PROVIDER`, or pick per-request in the
Image & Video studio / Settings. The adapter **falls back to Pollinations** if a keyed provider fails,
so the app never breaks.

---

## Not free enough (avoid for the free tier)
- **OpenAI GPT Image** — no free API tier.
- **Google Imagen** (standalone) — no free API route; use Gemini 2.5 Flash Image instead.
- **Leonardo** — only $5 trial credit, not recurring.
- **SendGrid-style trials** — time-limited.

---

## Email (for the Email Concierge) — free sending
| Provider | Free tier | Key |
|---|---|---|
| **Brevo** (recommended) | 300 emails/day (~9,000/mo) | `BREVO_API_KEY` |
| **Resend** | 3,000/mo, dev-friendly | `RESEND_API_KEY` |
| **n8n webhook** | delegate to the automation pack | `N8N_EMAIL_WEBHOOK` |

Wired in `lib/ai/email.ts`. The AI reply is written by **Groq** (`emailReplySystem` prompt) so it sounds
like a real, caring person; you approve, then it sends via the provider above.

---

## Sources
- https://www.bentoml.com/blog/a-guide-to-open-source-image-generation-models
- https://www.thundercompute.com/blog/best-open-source-image-generation-models
- https://localaimaster.com/blog/best-local-image-models-compared
- https://ltx.io/blog/best-open-source-video-generation-models
- https://www.hyperstack.cloud/blog/case-study/best-open-source-video-generation-models
- https://github.com/pollinations/pollinations
- https://developers.cloudflare.com/workers-ai/models/
- https://github.com/dotusmanali/Cloudflare-Image-Worker
- https://fal.ai/models/fal-ai/ltx-video/image-to-video/api
- https://www.brevo.com/blog/best-email-api/
