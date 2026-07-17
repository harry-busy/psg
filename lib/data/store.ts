"use client";

import { get, set, del, keys } from "idb-keyval";
import type { CollectionName, Collections } from "./types";

/**
 * Local-first, workspace-scoped reactive store.
 *
 * Keys are `ospyr:{workspace}:{collection}`. This is the ONLY place modules
 * touch persistence, so swapping to Supabase later means replacing the two
 * private read/write helpers below - the public API and hooks stay identical.
 */

type Listener = () => void;

const cache = new Map<string, unknown>();
const listeners = new Map<string, Set<Listener>>();

// Stable empty reference - critical for useSyncExternalStore snapshot equality.
// Returning a fresh [] each call causes an infinite render loop.
const EMPTY: readonly never[] = Object.freeze([]);

function activeWorkspace(): string {
  if (typeof window === "undefined") return "default";
  return localStorage.getItem("ospyr:workspace") || "psg-gold";
}

function keyFor(collection: string, ws = activeWorkspace()): string {
  return `ospyr:${ws}:${collection}`;
}

// ── low-level persistence - Supabase when configured, else local IndexedDB ───
function parseKey(k: string): { ws: string; collection: string } {
  const p = k.split(":"); // ospyr:{ws}:{collection}
  return { ws: p[1] || "default", collection: p.slice(2).join(":") };
}

// Tell the UI a cloud sync failed. store.ts isn't a React component, so it
// bridges to the ToastProvider via a window event (throttled there).
function emitSyncError(op: "save" | "load", e: unknown): void {
  if (typeof window === "undefined") return;
  const message = e instanceof Error ? e.message : String(e);
  window.dispatchEvent(new CustomEvent("ospyr:sync-error", { detail: { op, message } }));
}

async function readRaw<T>(k: string, fallback: T): Promise<T> {
  try {
    const { cloudMode, sbRead } = await import("./supabase");
    if (cloudMode()) {
      const { ws, collection } = parseKey(k);
      try {
        return await sbRead<T>(ws, collection, fallback);
      } catch (e) {
        // Cloud unreachable - fall back to local data, but flag it as stale.
        emitSyncError("load", e);
      }
    }
  } catch {
    /* supabase not configured - use local */
  }
  try {
    const v = await get(k);
    return (v as T) ?? fallback;
  } catch {
    return fallback;
  }
}

async function writeRaw<T>(k: string, v: T): Promise<void> {
  try {
    const { cloudMode, sbWrite } = await import("./supabase");
    if (cloudMode()) {
      const { ws, collection } = parseKey(k);
      try {
        await sbWrite(ws, collection, v);
        return;
      } catch (e) {
        // Cloud write rejected - keep a local backup so nothing is lost, and
        // surface it so the user knows it hasn't reached the cloud.
        await set(k, v).catch(() => {});
        emitSyncError("save", e);
        return;
      }
    }
  } catch {
    /* supabase not configured - use local */
  }
  await set(k, v);
}
// ─────────────────────────────────────────────────────────────────────────────

function emit(k: string) {
  listeners.get(k)?.forEach((fn) => fn());
}

export const store = {
  workspace: activeWorkspace,

  setWorkspace(ws: string) {
    if (typeof window !== "undefined") localStorage.setItem("ospyr:workspace", ws);
    cache.clear();
    listeners.forEach((set) => set.forEach((fn) => fn()));
  },

  /** Synchronous cached read (returns [] until hydrated). */
  peek<K extends CollectionName>(collection: K): Collections[K] {
    const k = keyFor(collection);
    return (cache.get(k) as Collections[K]) ?? (EMPTY as unknown as Collections[K]);
  },

  /** Async read that hydrates the cache and notifies subscribers. */
  async load<K extends CollectionName>(collection: K): Promise<Collections[K]> {
    const k = keyFor(collection);
    const v = await readRaw<Collections[K]>(k, [] as unknown as Collections[K]);
    cache.set(k, v);
    emit(k);
    return v;
  },

  async replace<K extends CollectionName>(collection: K, rows: Collections[K]) {
    const k = keyFor(collection);
    cache.set(k, rows);
    await writeRaw(k, rows);
    emit(k);
  },

  /** Insert at top (newest first). */
  async add<K extends CollectionName>(collection: K, row: Collections[K][number]) {
    const rows = [row, ...store.peek(collection)] as Collections[K];
    await store.replace(collection, rows);
    return row;
  },

  async update<K extends CollectionName>(
    collection: K,
    id: string,
    patch: Partial<Collections[K][number]>
  ) {
    const rows = store.peek(collection).map((r) =>
      (r as { id: string }).id === id ? { ...r, ...patch } : r
    ) as Collections[K];
    await store.replace(collection, rows);
  },

  async remove<K extends CollectionName>(collection: K, id: string) {
    const rows = store.peek(collection).filter(
      (r) => (r as { id: string }).id !== id
    ) as Collections[K];
    await store.replace(collection, rows);
  },

  subscribe(collection: CollectionName, fn: Listener): () => void {
    const k = keyFor(collection);
    if (!listeners.has(k)) listeners.set(k, new Set());
    listeners.get(k)!.add(fn);
    return () => listeners.get(k)?.delete(fn);
  },

  /** Wipe the current workspace (used by "reset demo"). */
  async clearWorkspace() {
    const all = await keys();
    const prefix = `ospyr:${activeWorkspace()}:`;
    await Promise.all(
      all.filter((k) => String(k).startsWith(prefix)).map((k) => del(k))
    );
    cache.clear();
    listeners.forEach((set) => set.forEach((fn) => fn()));
  },
};
