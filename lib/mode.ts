"use client";

import { useSyncExternalStore } from "react";
import { store } from "./data/store";
import { seedDemo } from "./demo";
import { seedFounderDemo } from "./demoFounder";
import type { Sector } from "./sector";
import type { CollectionName } from "./data/types";

/**
 * Per-workspace data mode. "demo" fills the workspace with realistic sample
 * data for walkthroughs; "live" clears it so the owner starts on real data.
 */
export type Mode = "demo" | "live";

const JEWELLERY_COLLECTIONS: CollectionName[] = ["enquiries", "sales", "schemeLeads", "products"];
const FOUNDER_COLLECTIONS: CollectionName[] = ["fMetrics", "fLeads", "fApprovals", "fTasks"];

function wsKey() {
  const ws = typeof window !== "undefined" ? localStorage.getItem("ospyr:workspace") || "psg-gold" : "psg-gold";
  return `ospyr:${ws}:mode`;
}

const subs = new Set<() => void>();

export function getMode(): Mode {
  if (typeof window === "undefined") return "live";
  return (localStorage.getItem(wsKey()) as Mode) || "live";
}

export function useMode(): Mode {
  return useSyncExternalStore(
    (cb) => { subs.add(cb); return () => subs.delete(cb); },
    getMode,
    () => "live"
  );
}

/** Switch mode: seed sample data for "demo", clear it for "live". */
export async function setMode(mode: Mode, sector: Sector) {
  localStorage.setItem(wsKey(), mode);
  subs.forEach((fn) => fn());
  if (mode === "demo") {
    if (sector === "founder") await seedFounderDemo();
    else await seedDemo();
  } else {
    const cols = sector === "founder" ? FOUNDER_COLLECTIONS : JEWELLERY_COLLECTIONS;
    for (const c of cols) await store.replace(c, []);
  }
}
