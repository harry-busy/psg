"use client";

import { useState } from "react";
import { PageHead } from "@/components/Shell";
import { Card, CardTitle, Button, Input, Field, Select, useToast } from "@/components/ui";
import { useSettings, saveSettings } from "@/lib/settings";
import { tgText, tgDetectChat } from "@/lib/telegram";
import { store } from "@/lib/data/store";
import { setMode } from "@/lib/mode";
import { VENDOR } from "@/lib/brand";

export default function SettingsPage() {
  const s = useSettings();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  return (
    <>
      <PageHead title="Settings" sub="White-label this workspace, set today's rates, and connect your channels." />

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Business */}
        <Card>
          <CardTitle>Business & brand</CardTitle>
          <Field label="Showroom name">
            <Input value={s.name} onChange={(e) => saveSettings({ name: e.target.value })} />
          </Field>
          <Field label="Tagline">
            <Input value={s.tagline} onChange={(e) => saveSettings({ tagline: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="City">
              <Input value={s.city} onChange={(e) => saveSettings({ city: e.target.value })} />
            </Field>
            <Field label="WhatsApp (91…)">
              <Input value={s.whatsapp} onChange={(e) => saveSettings({ whatsapp: e.target.value.replace(/\D/g, "") })} placeholder="919876543210" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Showroom email">
              <Input value={s.email} onChange={(e) => saveSettings({ email: e.target.value })} placeholder="hello@shop.com" />
            </Field>
            <Field label="Google review link">
              <Input value={s.reviewLink} onChange={(e) => saveSettings({ reviewLink: e.target.value })} placeholder="https://g.page/r/…" />
            </Field>
          </div>
        </Card>

        {/* Rates */}
        <Card>
          <CardTitle>Today's rates - update each morning</CardTitle>
          <div className="grid grid-cols-2 gap-3">
            <Field label="24K gold ₹/g">
              <Input type="number" value={s.rate24} onChange={(e) => saveSettings({ rate24: +e.target.value || 0 })} />
            </Field>
            <Field label="Silver ₹/g">
              <Input type="number" value={s.rateSilver} onChange={(e) => saveSettings({ rateSilver: +e.target.value || 0 })} />
            </Field>
          </div>
          <Field label="Default making charge %">
            <Input type="number" value={s.makingDefault} onChange={(e) => saveSettings({ makingDefault: +e.target.value || 0 })} />
          </Field>
          <p className="mt-2 text-xs text-[var(--color-muted)]">
            22K / 18K / 14K derive automatically. Every module - calculator, cards, scheme - reads these.
          </p>
        </Card>

        {/* AI + Image */}
        <Card>
          <CardTitle>AI & image generation</CardTitle>
          <p className="mb-2 text-xs text-[var(--color-muted)]">
            Text & vision run on <b>Groq</b> (configured on the server). Image generation defaults to the free
            no-key <b>Pollinations</b>; add any free key on the server to switch providers.
          </p>
          <Field label="Preferred image provider">
            <Select value={s.imageProvider} onChange={(e) => saveSettings({ imageProvider: e.target.value })}>
              <option value="pollinations">Pollinations - free, no key</option>
              <option value="cloudflare">Cloudflare Workers AI - free ~100k/day</option>
              <option value="together">Together AI - FLUX free tier</option>
              <option value="huggingface">Hugging Face - free credit</option>
              <option value="fal">fal.ai - free credits</option>
              <option value="gemini">Gemini - your key</option>
            </Select>
          </Field>
          <Field label="Send-from email (for the Email Concierge)">
            <Input value={s.emailFrom} onChange={(e) => saveSettings({ emailFrom: e.target.value })} placeholder="hello@yourshowroom.com" />
          </Field>
        </Card>

        {/* Telegram */}
        <Card>
          <CardTitle>Telegram alerts</CardTitle>
          <Field label="Bot token (from @BotFather)">
            <Input value={s.telegramToken} onChange={(e) => saveSettings({ telegramToken: e.target.value })} placeholder="123456:ABC…" />
          </Field>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Field label="Chat ID">
                <Input value={s.telegramChat} onChange={(e) => saveSettings({ telegramChat: e.target.value })} />
              </Field>
            </div>
            <Button
              variant="outline"
              onClick={async () => {
                const id = await tgDetectChat(s.telegramToken);
                if (id) { saveSettings({ telegramChat: id }); toast("Chat ID detected: " + id); }
                else toast("Open your bot, send 'hi', then Detect again");
              }}
            >
              Detect
            </Button>
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={s.telegramNotify} onChange={(e) => saveSettings({ telegramNotify: e.target.checked })} />
            Alert me on every new enquiry & lead
          </label>
          <Button
            variant="tg"
            className="mt-3"
            onClick={async () => {
              const r = await tgText(`${s.name} - ${VENDOR.product} connected.`);
              toast(r.ok ? "Sent to Telegram" : r.error || "Telegram not configured");
            }}
          >
            Send a test message
          </Button>
        </Card>

        {/* Data */}
        <Card className="lg:col-span-2">
          <CardTitle>Workspace data</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="ink"
              loading={busy}
              onClick={async () => { setBusy(true); await setMode("demo", "jewellery"); setBusy(false); toast("Demo data loaded"); }}
            >
              Load demo data
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                if (confirm("Erase ALL data in this workspace? This cannot be undone.")) {
                  await store.clearWorkspace();
                  toast("Workspace cleared");
                }
              }}
            >
              Reset workspace
            </Button>
          </div>
          <p className="mt-3 text-xs text-[var(--color-muted)]">
            Data is stored on this device (IndexedDB). Connect Supabase later for multi-device sync - the
            modules won't change.
          </p>
        </Card>
      </div>
    </>
  );
}
