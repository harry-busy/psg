import { NextRequest, NextResponse } from "next/server";
import { groqChat, type ChatMessage } from "@/lib/ai/groq";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { system, prompt, messages, json, temperature, maxTokens } = await req.json();

    const msgs: ChatMessage[] = messages ?? [
      ...(system ? [{ role: "system" as const, content: system }] : []),
      { role: "user" as const, content: prompt ?? "" },
    ];

    const text = await groqChat({
      messages: msgs,
      json: !!json,
      temperature,
      maxTokens,
    });
    return NextResponse.json({ text });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
