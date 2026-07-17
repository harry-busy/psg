"use client";

/** Two sectors live in one app; login routes to the right one. */
export type Sector = "jewellery" | "founder";

/** Guess the sector from a workspace name (used at login for known clients). */
export function sectorFor(name: string): Sector | null {
  const n = name.toLowerCase();
  if (/(psg|gold|jewel|jewell|diyam|silver|padmav|vardh)/.test(n)) return "jewellery";
  if (/(harshdeep|aurra|designomics|loop\s*in|arihant|founder|group)/.test(n)) return "founder";
  return null; // unknown → ask the user to pick
}

export function getSector(): Sector {
  if (typeof window === "undefined") return "jewellery";
  return (localStorage.getItem("ospyr:sector") as Sector) || "jewellery";
}

export function setSector(s: Sector) {
  if (typeof window !== "undefined") localStorage.setItem("ospyr:sector", s);
}

/** Where each sector's home lives. */
export const SECTOR_HOME: Record<Sector, string> = {
  jewellery: "/app/home",
  founder: "/app/founder/command",
};
