import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conditional logic. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Indian-format rupees, e.g. ₹ 1,23,456 */
export function inr(n: number): string {
  return "₹ " + Math.round(n || 0).toLocaleString("en-IN");
}

/** Format a 0..1 ratio as a percent, e.g. 0.324 → "32%". */
export function pct(n: number): string {
  return Math.round((n || 0) * 100) + "%";
}

/** Today's date as YYYY-MM-DD (local). */
export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** N days ago as YYYY-MM-DD. */
export function daysAgo(n: number): string {
  return new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
}

/** Stable-ish unique id. */
export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/** Escape a string for safe interpolation into HTML text. */
export function esc(s: unknown): string {
  return (s ?? "").toString().replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );
}

/** Strip everything but digits (phone normalisation for wa.me). */
export function digits(s: unknown): string {
  return (s ?? "").toString().replace(/\D/g, "");
}

/** Build a wa.me deep link. */
export function waLink(phone: string | undefined, text: string): string {
  const n = digits(phone);
  return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
}

/** Trigger a client-side file download from a data URL or Blob. */
export function download(filename: string, source: string | Blob) {
  const a = document.createElement("a");
  a.download = filename;
  a.href = typeof source === "string" ? source : URL.createObjectURL(source);
  a.click();
  if (typeof source !== "string") setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
