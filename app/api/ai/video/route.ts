import { NextRequest, NextResponse } from "next/server";
import { generateVideo, type VideoProvider } from "@/lib/ai/video";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const { prompt, imageDataUrl, provider } = await req.json();
    if (!prompt) return NextResponse.json({ error: "prompt required" }, { status: 400 });
    const { url, provider: used } = await generateVideo({
      prompt,
      imageDataUrl,
      provider: provider as VideoProvider,
    });
    return NextResponse.json({ url, provider: used });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
