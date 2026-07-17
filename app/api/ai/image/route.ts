import { NextRequest, NextResponse } from "next/server";
import { generateImage, type ImageProvider } from "@/lib/ai/image";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { prompt, width, height, provider } = await req.json();
    if (!prompt) return NextResponse.json({ error: "prompt required" }, { status: 400 });
    const { dataUrl, provider: used } = await generateImage({
      prompt,
      width,
      height,
      provider: provider as ImageProvider,
    });
    return NextResponse.json({ dataUrl, provider: used });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
