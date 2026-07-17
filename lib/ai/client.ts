"use client";

/** Thin browser client for our server AI routes. No keys ever touch the client. */

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);
  return json as T;
}

export function aiText(opts: {
  system?: string;
  prompt?: string;
  json?: boolean;
  temperature?: number;
  maxTokens?: number;
}) {
  return post<{ text: string }>("/api/ai/text", opts).then((r) => r.text);
}

export function aiVision(prompt: string, imageDataUrl: string) {
  return post<{ text: string }>("/api/ai/vision", { prompt, imageDataUrl }).then((r) => r.text);
}

export function aiImage(prompt: string, opts: { width?: number; height?: number; provider?: string } = {}) {
  return post<{ dataUrl: string; provider: string }>("/api/ai/image", { prompt, ...opts });
}

export function aiVideo(prompt: string, opts: { imageDataUrl?: string; provider?: string } = {}) {
  return post<{ url: string; provider: string }>("/api/ai/video", { prompt, ...opts });
}

export function sendEmail(opts: {
  to: string;
  toName?: string;
  subject: string;
  text: string;
  fromEmail?: string;
  fromName?: string;
  provider?: string;
}) {
  return post<{ ok: true; provider: string }>("/api/email/send", opts);
}
