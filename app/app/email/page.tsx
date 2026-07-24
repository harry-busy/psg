"use client";

import { useState } from "react";
import { PageHead } from "@/components/Shell";
import { Card, CardTitle, Button, Input, Field, Select, Textarea, Chip, Badge, useToast } from "@/components/ui";
import { useCollection } from "@/lib/data/useStore";
import { store } from "@/lib/data/store";
import { useSettings } from "@/lib/settings";
import { aiText, sendEmail } from "@/lib/ai/client";
import { emailReplySystem } from "@/lib/ai/prompts";
import { uid, today } from "@/lib/utils";
import type { EmailThread } from "@/lib/data/types";
import { Sparkles, Send, Mail } from "lucide-react";

const TONES = ["Warm & personal", "Concise & professional", "Festive & celebratory", "Reassuring (price/quality question)"];

export default function EmailPage() {
  const emails = useCollection("emails");
  const s = useSettings();
  const toast = useToast();
  const [form, setForm] = useState({ from: "", name: "", subject: "", incoming: "" });
  const [tone, setTone] = useState(TONES[0]);
  const [active, setActive] = useState<string | null>(null);
  const [busy, setBusy] = useState("");

  const current = emails.find((e) => e.id === active);

  async function addThread() {
    if (!form.from.trim() || !form.incoming.trim()) return toast("Add the customer's email and message");
    const row: EmailThread = {
      id: uid(), from: form.from.trim(), name: form.name.trim(), subject: form.subject.trim() || "Your enquiry",
      incoming: form.incoming.trim(), status: "new", created: today(),
    };
    await store.add("emails", row);
    setForm({ from: "", name: "", subject: "", incoming: "" });
    setActive(row.id);
    void draft(row);
  }

  async function draft(t: EmailThread) {
    setBusy("draft");
    try {
      const reply = await aiText({
        system: emailReplySystem(s.name, s.city),
        prompt: `Customer ${t.name || t.from} wrote (subject "${t.subject}"):\n"""${t.incoming}"""\nTone: ${tone}. Write the reply only.`,
        temperature: 0.75,
      });
      await store.update("emails", t.id, { draft: reply.trim(), status: "drafted", tone });
    } catch (e) { toast((e as Error).message); }
    setBusy("");
  }

  async function send(t: EmailThread) {
    if (!t.draft) return toast("Draft a reply first");
    if (!s.emailFrom) return toast("Set a send-from email in Settings first");
    setBusy("send");
    try {
      const r = await sendEmail({ to: t.from, toName: t.name, subject: "Re: " + t.subject, text: t.draft, fromEmail: s.emailFrom, fromName: s.name });
      await store.update("emails", t.id, { status: "sent", sentAt: new Date().toISOString() });
      toast(`Sent via ${r.provider}`);
    } catch (e) { toast((e as Error).message); }
    setBusy("");
  }

  return (
    <>
      <PageHead title="Email Concierge" sub="AI writes warm, human replies your customers actually feel - you approve and send." />
      <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
        <div className="space-y-5">
          <Card>
            <CardTitle>New customer email</CardTitle>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Customer email"><Input value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} placeholder="anita@gmail.com" /></Field>
              <Field label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Anita" /></Field>
            </div>
            <Field label="Subject"><Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Temple jewellery availability" /></Field>
            <Field label="Their message"><Textarea rows={4} value={form.incoming} onChange={(e) => setForm({ ...form, incoming: e.target.value })} placeholder="Paste the email you received…" /></Field>
            <Field label="Reply tone"><Select value={tone} onChange={(e) => setTone(e.target.value)}>{TONES.map((t) => <option key={t}>{t}</option>)}</Select></Field>
            <Button className="mt-3 w-full" onClick={addThread}><Sparkles size={15} /> Draft reply with AI</Button>
            <p className="mt-2 text-xs text-[var(--color-muted)]">Sending uses a free provider (Brevo 9k/mo or Resend 3k/mo) configured on the server. Always-on inbox auto-reply runs in the n8n automation pack.</p>
          </Card>

          <Card>
            <CardTitle>Inbox ({emails.length})</CardTitle>
            {emails.length === 0 ? <p className="py-4 text-center text-sm text-[var(--color-muted)]">No threads yet.</p> : (
              <ul className="space-y-1">
                {emails.map((e) => (
                  <li key={e.id}>
                    <button onClick={() => setActive(e.id)} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${active === e.id ? "bg-[var(--color-surface-2)]" : "hover:bg-[var(--color-surface-2)]"}`}>
                      <span><b>{e.name || e.from}</b><br /><span className="text-xs text-[var(--color-muted)]">{e.subject}</span></span>
                      <StatusBadge status={e.status} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <Card>
          {current ? (
            <>
              <div className="mb-3 flex items-center justify-between">
                <div><CardTitle className="mb-0 border-0 pb-0">{current.subject}</CardTitle><p className="text-xs text-[var(--color-muted)]">from {current.name || current.from} · {current.from}</p></div>
                <StatusBadge status={current.status} />
              </div>
              <div className="rounded-xl bg-[var(--color-surface-2)] p-3 text-sm"><b className="text-xs uppercase text-[var(--color-muted)]">Customer wrote</b><p className="mt-1 whitespace-pre-wrap">{current.incoming}</p></div>
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <b className="text-xs uppercase text-[var(--color-muted)]">AI reply {current.tone && <Badge className="ml-1">{current.tone}</Badge>}</b>
                  <div className="flex gap-2">
                    <Chip onClick={() => draft(current)}>↻ Redraft</Chip>
                    {TONES.slice(0, 3).map((t) => <Chip key={t} onClick={() => { setTone(t); draft({ ...current }); }}>{t.split(" ")[0]}</Chip>)}
                  </div>
                </div>
                <Textarea rows={9} value={current.draft || ""} onChange={(e) => store.update("emails", current.id, { draft: e.target.value })} placeholder={busy === "draft" ? "Writing…" : "The AI reply will appear here."} />
                <div className="mt-3 flex gap-2">
                  <Button variant="primary" loading={busy === "send"} onClick={() => send(current)}><Send size={15} /> Send reply</Button>
                  <Button variant="outline" onClick={() => { navigator.clipboard.writeText(current.draft || ""); toast("Copied"); }}>Copy</Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center py-20 text-center text-[var(--color-muted)]">
              <Mail size={30} className="mb-3 text-[var(--color-line)]" />
              Add a customer email on the left - the AI will draft a reply that sounds like a real, caring person.
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

function StatusBadge({ status }: { status: EmailThread["status"] }) {
  const map = { new: ["New", "#6BB091"], drafted: ["Drafted", "#4E8A72"], sent: ["Sent", "#1B4D3E"] } as const;
  const [label, color] = map[status];
  return <span className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: color }}>{label}</span>;
}
