"use client";

import { useSyncExternalStore } from "react";
import type { BrandKey } from "./data/types";

/** Founder-sector config: targets, cash position, and integration toggles. */
export interface FounderConfig {
  groupName: string;
  monthlyTargets: Record<BrandKey, number>; // revenue target ₹/brand
  cashBalance: number;
  monthlyBurn: number;
  telegramDigest: boolean;
  ingestSecret: string; // guards the inbound n8n webhook
}

export const DEFAULT_FOUNDER: FounderConfig = {
  groupName: "Harshdeep Group",
  monthlyTargets: { aurra: 1500000, designomics: 800000, loopin: 600000, arihant: 1000000 },
  cashBalance: 2500000,
  monthlyBurn: 900000,
  telegramDigest: true,
  ingestSecret: "",
};

function key() {
  const ws =
    typeof window !== "undefined" ? localStorage.getItem("ospyr:workspace") || "harshdeep" : "harshdeep";
  return `ospyr:${ws}:founder`;
}

const subs = new Set<() => void>();
let cached: { k: string; v: FounderConfig } | null = null;

function read(): FounderConfig {
  const k = key();
  if (cached && cached.k === k) return cached.v;
  let v = DEFAULT_FOUNDER;
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(k);
      if (raw) v = { ...DEFAULT_FOUNDER, ...JSON.parse(raw) };
    } catch {}
  }
  cached = { k, v };
  return v;
}

export function saveFounder(patch: Partial<FounderConfig>) {
  const next = { ...read(), ...patch };
  const k = key();
  localStorage.setItem(k, JSON.stringify(next));
  cached = { k, v: next };
  subs.forEach((fn) => fn());
}

export const getFounder = read;

export function useFounder(): FounderConfig {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    read,
    () => DEFAULT_FOUNDER
  );
}
