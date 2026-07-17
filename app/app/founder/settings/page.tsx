"use client";

import { useState } from "react";
import { PageHead } from "@/components/Shell";
import { Card, CardTitle, Button, Input, Field, useToast } from "@/components/ui";
import { useFounder, saveFounder } from "@/lib/founder";
import { useSettings, saveSettings } from "@/lib/settings";
import { BRANDS } from "@/lib/brands";
import { BRAND_KEYS } from "@/lib/data/types";
import { setMode } from "@/lib/mode";
import { supabaseEnabled } from "@/lib/data/supabase";
import { inr, uid } from "@/lib/utils";
import { tgText, tgDetectChat } from "@/lib/telegram";

export default function FounderSettings() {
  const f = useFounder();
  const s = useSettings(); // shared: telegram creds live here
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  return (
    <>
      <PageHead title="Settings" sub="Configure the group, brand targets, integrations and data." />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardTitle>Group</CardTitle>
          <Field label="Group name"><Input value={f.groupName} onChange={(e) => saveFounder({ groupName: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Cash balance ₹"><Input type="number" value={f.cashBalance} onChange={(e) => saveFounder({ cashBalance: +e.target.value || 0 })} /></Field>
            <Field label="Monthly burn ₹"><Input type="number" value={f.monthlyBurn} onChange={(e) => saveFounder({ monthlyBurn: +e.target.value || 0 })} /></Field>
          </div>
          <p className="mt-2 text-xs text-[var(--color-muted)]">Runway = cash ÷ burn = {f.monthlyBurn ? (f.cashBalance / f.monthlyBurn).toFixed(1) : "∞"} months.</p>
        </Card>

        <Card>
          <CardTitle>Monthly revenue targets</CardTitle>
          {BRANDS.map((b) => (
            <Field key={b.key} label={b.name}>
              <Input type="number" value={f.monthlyTargets[b.key]} onChange={(e) => saveFounder({ monthlyTargets: { ...f.monthlyTargets, [b.key]: +e.target.value || 0 } })} />
            </Field>
          ))}
          <p className="mt-2 text-xs text-[var(--color-muted)]">Group target: {inr(BRAND_KEYS.reduce((a, k) => a + (f.monthlyTargets[k] || 0), 0))}/month.</p>
        </Card>

        <Card>
          <CardTitle>Brand identity</CardTitle>
          <p className="mb-2 text-xs text-[var(--color-muted)]">Each brand carries its own accent. Send the real logos, fonts and hex codes and these become pixel-exact per brand.</p>
          <div className="space-y-2">
            {BRANDS.map((b) => (
              <div key={b.key} className="flex items-center gap-3 rounded-xl border border-[var(--color-line)] p-3">
                <span className="h-8 w-8 rounded-lg" style={{ background: `linear-gradient(135deg, ${b.primary}, ${b.accent})` }} />
                <div className="min-w-0">
                  <div className="truncate font-medium">{b.name}</div>
                  <div className="truncate text-xs text-[var(--color-muted)]">{b.tagline}{b.site ? ` · ${b.site}` : ""}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardTitle>Integrations</CardTitle>
          <Field label="Telegram bot token (from @BotFather)"><Input value={s.telegramToken} onChange={(e) => saveSettings({ telegramToken: e.target.value })} placeholder="123456:ABC…" /></Field>
          <div className="flex items-end gap-2">
            <div className="flex-1"><Field label="Chat ID"><Input value={s.telegramChat} onChange={(e) => saveSettings({ telegramChat: e.target.value })} /></Field></div>
            <Button variant="outline" onClick={async () => { const id = await tgDetectChat(s.telegramToken); if (id) { saveSettings({ telegramChat: id }); toast("Detected: " + id); } else toast("Message your bot, then Detect"); }}>Detect</Button>
          </div>
          <Button variant="tg" className="mt-3" onClick={async () => { const r = await tgText(`${f.groupName} - Founder OS connected.`); toast(r.ok ? "Sent to Telegram" : r.error || "Not configured"); }}>Send a test message</Button>
          <div className="mt-4 rounded-xl bg-[var(--color-surface-2)] p-3 text-xs">
            <div className="mb-1 font-semibold">Backend: {supabaseEnabled() ? "Supabase (cloud) - connected" : "Local device (cloud not yet connected)"}</div>
            Paste your Supabase URL + anon key into <code>.env.local</code> and run <code>supabase/schema.sql</code> to switch on multi-user cloud sync. AI (Groq) and image/video already run on the server.
          </div>
          <Field label="Ingest webhook secret (for n8n → this OS)">
            <div className="flex gap-2">
              <Input value={f.ingestSecret} readOnly placeholder="generate a secret →" />
              <Button variant="outline" onClick={() => { const sec = uid() + uid(); saveFounder({ ingestSecret: sec }); toast("Secret generated"); }}>Generate</Button>
            </div>
          </Field>
          <p className="mt-1 text-xs text-[var(--color-muted)]">Point the n8n MEGA engines at <code>/api/ingest/{"{workspace}"}</code> with this secret to push live metrics & leads.</p>
        </Card>

        <Card className="lg:col-span-2">
          <CardTitle>Data</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Button variant="ink" loading={busy} onClick={async () => { setBusy(true); await setMode("demo", "founder"); setBusy(false); toast("Realistic demo data loaded for all 4 brands"); }}>Load demo data</Button>
            <Button variant="outline" onClick={async () => { if (confirm("Erase all founder data in this workspace?")) { await setMode("live", "founder"); toast("Cleared"); } }}>Reset data</Button>
          </div>
          <p className="mt-3 text-xs text-[var(--color-muted)]">Demo mode fills believable numbers so you can explore the whole OS instantly; real data flows in via manual entry, CSV import, or the n8n webhook.</p>
        </Card>
      </div>
    </>
  );
}
