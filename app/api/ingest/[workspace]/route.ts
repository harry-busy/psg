import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

/**
 * Inbound webhook the n8n MEGA engines POST live data into.
 * Body: { collection: "fMetrics"|"fLeads"|..., rows: [...], mode?: "append"|"replace" }
 * Auth: header `x-ingest-secret` must match env INGEST_SECRET.
 * Persists to Supabase (service role, bypasses RLS) into os_collections.
 */
export async function POST(req: NextRequest, ctx: { params: Promise<{ workspace: string }> }) {
  try {
    const { workspace } = await ctx.params;
    const secret = process.env.INGEST_SECRET;
    if (secret && req.headers.get("x-ingest-secret") !== secret) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { collection, rows, mode = "append" } = await req.json();
    if (!collection || !Array.isArray(rows)) {
      return NextResponse.json({ error: "collection and rows[] required" }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) {
      return NextResponse.json({ error: "Supabase not configured - set NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY to enable ingest." }, { status: 501 });
    }
    const admin = createClient(url, serviceKey);

    // audit log
    await admin.from("os_ingest").insert({ workspace, kind: collection, payload: { count: rows.length, mode } });

    let data = rows;
    if (mode === "append") {
      const { data: existing } = await admin.from("os_collections").select("data").eq("workspace", workspace).eq("collection", collection).maybeSingle();
      const prev = (existing?.data as unknown[]) || [];
      data = [...rows, ...prev];
    }
    await admin.from("os_collections").upsert(
      { workspace, collection, data, updated_at: new Date().toISOString() },
      { onConflict: "workspace,collection" }
    );

    return NextResponse.json({ ok: true, workspace, collection, received: rows.length });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
