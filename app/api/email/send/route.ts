import { NextRequest, NextResponse } from "next/server";
import { sendEmail, type EmailProvider } from "@/lib/ai/email";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.to || !body.subject || !body.text)
      return NextResponse.json({ error: "to, subject, text required" }, { status: 400 });
    const result = await sendEmail({ ...body, provider: body.provider as EmailProvider });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
