import "server-only";

/**
 * Groq (OpenAI-compatible) helper. Runs ONLY on the server - the key never
 * reaches the browser. Used for captions, sales brain, content, email drafting,
 * FAQ replies, lead scoring and vision analysis of jewellery photos.
 */

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string | Array<Record<string, unknown>>;
};

export interface GroqOptions {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  json?: boolean;
}

export async function groqChat(opts: GroqOptions): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY is not set on the server.");

  const body: Record<string, unknown> = {
    model: opts.model || process.env.GROQ_TEXT_MODEL || "llama-3.3-70b-versatile",
    messages: opts.messages,
    temperature: opts.temperature ?? 0.7,
    max_tokens: opts.maxTokens ?? 1024,
  };
  if (opts.json) body.response_format = { type: "json_object" };

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Groq ${res.status}: ${detail.slice(0, 200)}`);
  }
  const json = await res.json();
  return json.choices?.[0]?.message?.content ?? "";
}

export const VISION_MODEL = () =>
  process.env.GROQ_VISION_MODEL || "meta-llama/llama-4-scout-17b-16e-instruct";
