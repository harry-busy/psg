"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_BRAND, type Brand } from "./brand";

/**
 * Workspace settings (brand, daily rates, integrations). Local-first,
 * per-workspace. Rates/brand are the app-wide config every module reads.
 */

export interface Settings extends Brand {
  rate24: number; // ₹/g 24K gold
  rateSilver: number; // ₹/g
  makingDefault: number; // %
  telegramToken: string;
  telegramChat: string;
  telegramNotify: boolean;
  imageProvider: string;
  emailFrom: string;
}

export const DEFAULT_SETTINGS: Settings = {
  ...DEFAULT_BRAND,
  rate24: 7400,
  rateSilver: 110,
  makingDefault: 12,
  telegramToken: "",
  telegramChat: "",
  telegramNotify: true,
  imageProvider: "pollinations",
  emailFrom: "",
};

function wsKey() {
  const ws = typeof window !== "undefined" ? localStorage.getItem("ospyr:workspace") || "psg-gold" : "psg-gold";
  return `ospyr:${ws}:settings`;
}

const subs = new Set<() => void>();
let cached: { key: string; value: Settings } | null = null;

function read(): Settings {
  const key = wsKey();
  if (cached && cached.key === key) return cached.value;
  let value = DEFAULT_SETTINGS;
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(key);
      if (raw) value = { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {}
  }
  cached = { key, value };
  return value;
}

export function saveSettings(patch: Partial<Settings>) {
  const next = { ...read(), ...patch };
  const key = wsKey();
  localStorage.setItem(key, JSON.stringify(next));
  cached = { key, value: next };
  subs.forEach((fn) => fn());
}

export function getSettings(): Settings {
  return read();
}

export function useSettings(): Settings {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    read,
    () => DEFAULT_SETTINGS
  );
}
