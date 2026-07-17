"use client";

/** Telegram Bot API works directly from the browser (CORS-allowed). */
import { getSettings } from "./settings";

export async function tgText(text: string): Promise<{ ok: boolean; error?: string }> {
  const s = getSettings();
  if (!s.telegramToken || !s.telegramChat) return { ok: false, error: "Add Telegram token + chat ID in Settings" };
  try {
    const r = await fetch(`https://api.telegram.org/bot${s.telegramToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: s.telegramChat, text }),
    });
    const j = await r.json();
    return j.ok ? { ok: true } : { ok: false, error: "Telegram rejected - check token/chat ID" };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function tgPhoto(canvas: HTMLCanvasElement, caption = ""): Promise<{ ok: boolean; error?: string }> {
  const s = getSettings();
  if (!s.telegramToken || !s.telegramChat) return { ok: false, error: "Add Telegram token + chat ID in Settings" };
  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) return resolve({ ok: false, error: "Could not read image" });
      const fd = new FormData();
      fd.append("chat_id", s.telegramChat);
      fd.append("caption", caption);
      fd.append("photo", blob, "image.jpg");
      try {
        const r = await fetch(`https://api.telegram.org/bot${s.telegramToken}/sendPhoto`, { method: "POST", body: fd });
        const j = await r.json();
        resolve(j.ok ? { ok: true } : { ok: false, error: "Telegram rejected" });
      } catch (e) {
        resolve({ ok: false, error: (e as Error).message });
      }
    }, "image/jpeg", 0.92);
  });
}

export async function tgImage(dataUrl: string, caption = ""): Promise<{ ok: boolean; error?: string }> {
  const s = getSettings();
  if (!s.telegramToken || !s.telegramChat) return { ok: false, error: "Add Telegram token + chat ID in Settings" };
  try {
    const blob = await (await fetch(dataUrl)).blob();
    const fd = new FormData();
    fd.append("chat_id", s.telegramChat);
    fd.append("caption", caption);
    fd.append("photo", blob, "image.jpg");
    const r = await fetch(`https://api.telegram.org/bot${s.telegramToken}/sendPhoto`, { method: "POST", body: fd });
    const j = await r.json();
    return j.ok ? { ok: true } : { ok: false, error: "Telegram rejected" };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function tgDetectChat(token: string): Promise<string | null> {
  try {
    const j = await (await fetch(`https://api.telegram.org/bot${token}/getUpdates`)).json();
    return j.result?.at(-1)?.message?.chat?.id?.toString() ?? null;
  } catch {
    return null;
  }
}
