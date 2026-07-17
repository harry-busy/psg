import "server-only";

/**
 * Email sending via a FREE provider. Server-side only.
 * - Brevo: 300 emails/day free (recommended)
 * - Resend: 3,000 emails/month free
 * - n8n webhook: hand off to the existing automation layer
 * Pick with EMAIL_PROVIDER; the AI draft is written by Groq (see route).
 */

export type EmailProvider = "brevo" | "resend" | "n8n";

export interface SendEmailRequest {
  to: string;
  toName?: string;
  subject: string;
  text: string;
  fromEmail?: string;
  fromName?: string;
  provider?: EmailProvider;
}

export async function sendEmail(req: SendEmailRequest): Promise<{ ok: true; provider: EmailProvider }> {
  const provider = (req.provider || (process.env.EMAIL_PROVIDER as EmailProvider) || "brevo");
  const fromEmail = req.fromEmail || process.env.EMAIL_FROM || "";
  const fromName = req.fromName || process.env.EMAIL_FROM_NAME || "Showroom";
  const html = req.text
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 14px;line-height:1.6">${p.replace(/\n/g, "<br>")}</p>`)
    .join("");

  if (provider === "brevo") {
    const key = process.env.BREVO_API_KEY;
    if (!key) throw new Error("Add a free BREVO_API_KEY to send email.");
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": key, "Content-Type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: { email: fromEmail, name: fromName },
        to: [{ email: req.to, name: req.toName || req.to }],
        subject: req.subject,
        htmlContent: html,
        textContent: req.text,
      }),
    });
    if (!res.ok) throw new Error(`Brevo ${res.status}: ${(await res.text()).slice(0, 160)}`);
    return { ok: true, provider };
  }

  if (provider === "resend") {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("Add a free RESEND_API_KEY to send email.");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: [req.to],
        subject: req.subject,
        html,
        text: req.text,
      }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 160)}`);
    return { ok: true, provider };
  }

  // n8n webhook - delegate to the always-on automation layer.
  const hook = process.env.N8N_EMAIL_WEBHOOK;
  if (!hook) throw new Error("Set N8N_EMAIL_WEBHOOK or choose brevo/resend.");
  const res = await fetch(hook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error(`n8n webhook ${res.status}`);
  return { ok: true, provider: "n8n" };
}
