import { NextRequest, NextResponse } from "next/server";
import { groqChat, VISION_MODEL } from "@/lib/ai/groq";

export const runtime = "nodejs";

/** Analyse a jewellery photo (data URL) with Groq vision. */
export async function POST(req: NextRequest) {
  try {
    const { prompt, imageDataUrl } = await req.json();
    if (!imageDataUrl) return NextResponse.json({ error: "imageDataUrl required" }, { status: 400 });

    const text = await groqChat({
      model: VISION_MODEL(),
      temperature: 0.4,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt || "Describe this jewellery piece for a catalog." },
            { type: "image_url", image_url: { url: imageDataUrl } },
          ],
        },
      ],
    });
    return NextResponse.json({ text });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
