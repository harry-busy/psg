"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase document-store adapter. Activates ONLY when the two public env vars
 * are present; otherwise the app stays on the local (IndexedDB) adapter. Maps
 * one row per (workspace, collection) → the app's DataStore, so nothing in the
 * modules changes. Per-user Auth + RLS (schema.sql) secures multi-user access.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

export function supabaseEnabled(): boolean {
  return !!(url && anon);
}

/** Cloud is active when configured AND the user hasn't chosen "this device only". */
export function cloudMode(): boolean {
  if (!supabaseEnabled()) return false;
  if (typeof window !== "undefined" && localStorage.getItem("ospyr:localOnly") === "1") return false;
  return true;
}

// ── Auth (email + password) ──────────────────────────────────────────────────
export async function currentSession() {
  if (!supabaseEnabled()) return null;
  const { data } = await supabase().auth.getSession();
  return data.session;
}

export async function signInEmail(email: string, password: string) {
  return supabase().auth.signInWithPassword({ email, password });
}

export async function signUpEmail(email: string, password: string) {
  return supabase().auth.signUp({ email, password });
}

export async function signOutCloud() {
  if (supabaseEnabled()) await supabase().auth.signOut();
}

/** Create the workspace (if new) and add the current user as a member. */
export async function ensureWorkspace(slug: string, name: string, sector: string) {
  return supabase().rpc("os_create_workspace", { p_slug: slug, p_name: name, p_sector: sector });
}

export function supabase(): SupabaseClient {
  if (!client) {
    if (!url || !anon) throw new Error("Supabase env not configured");
    client = createClient(url, anon, { auth: { persistSession: true, autoRefreshToken: true } });
  }
  return client;
}

/** Read a collection blob for a workspace. Throws on a genuine backend error
 *  (so the caller can fall back to local) - but treats "no rows" as empty. */
export async function sbRead<T>(workspace: string, collection: string, fallback: T): Promise<T> {
  const { data, error } = await supabase()
    .from("os_collections")
    .select("data")
    .eq("workspace", workspace)
    .eq("collection", collection)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return fallback;
  return (data.data as T) ?? fallback;
}

/** Upsert a collection blob for a workspace. Throws when the write is rejected
 *  (e.g. RLS, expired token, network) instead of silently losing the data. */
export async function sbWrite<T>(workspace: string, collection: string, value: T): Promise<void> {
  const { error } = await supabase()
    .from("os_collections")
    .upsert({ workspace, collection, data: value, updated_at: new Date().toISOString() }, { onConflict: "workspace,collection" });
  if (error) throw new Error(error.message);
}
