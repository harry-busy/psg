"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ── Button ───────────────────────────────────────────────────────────────── */
type Variant = "primary" | "ink" | "wa" | "tg" | "ai" | "ghost" | "outline";
const variants: Record<Variant, string> = {
  primary: "bg-[var(--color-crimson)] text-white hover:bg-[var(--color-crimson-600)]",
  ink: "bg-[var(--color-ink)] text-white hover:opacity-90",
  wa: "bg-[#25D366] text-white hover:brightness-95",
  tg: "bg-[#2AABEE] text-white hover:brightness-95",
  ai: "bg-[#5B3A8C] text-white hover:brightness-110",
  ghost: "bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-surface-2)]",
  outline: "bg-[var(--color-surface)] text-[var(--color-ink)] border border-[var(--color-line)] hover:bg-[var(--color-surface-2)]",
};

export function Button({
  variant = "primary",
  className,
  loading,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; loading?: boolean }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-wait",
        variants[variant],
        variant === "outline" || variant === "ghost" ? "" : "shadow-sm",
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      {children}
    </button>
  );
}

/* ── Card ─────────────────────────────────────────────────────────────────── */
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("card p-5", className)} {...props} />;
}
export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "mb-4 text-[15px] font-semibold tracking-[-0.01em] text-[var(--color-ink)]",
        className
      )}
      {...props}
    />
  );
}

/* ── Form controls ────────────────────────────────────────────────────────── */
const fieldCls =
  "w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-info)] focus:ring-2 focus:ring-[var(--color-info)]/15";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldCls, className)} {...props} />;
}
export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldCls, "min-h-24 resize-y", className)} {...props} />;
}
export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldCls, "appearance-none", className)} {...props}>
      {children}
    </select>
  );
}
export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("mb-1 mt-3 block text-xs font-semibold text-[var(--color-ink)]", className)} {...props} />;
}
export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

/* ── Stat / KPI ───────────────────────────────────────────────────────────── */
export function Stat({ value, label, tone }: { value: React.ReactNode; label: string; tone?: string }) {
  return (
    <div className="card flex min-h-[96px] flex-col items-center justify-center gap-2 overflow-hidden px-4 py-4 text-center [container-type:inline-size]">
      {/* Size scales with the tile's own width (cqi), so every KPI in a row
          renders at the same size and long ₹ amounts always stay on one line. */}
      <div
        className="w-full whitespace-nowrap font-display text-[clamp(0.85rem,13cqi,1.35rem)] font-semibold leading-none tracking-[-0.02em] tabular-nums"
        style={{ color: tone || "var(--color-ink)" }}
      >
        {value}
      </div>
      <div className="w-full truncate text-[11px] font-medium text-[var(--color-muted)]">{label}</div>
    </div>
  );
}

/* ── Chip ─────────────────────────────────────────────────────────────────── */
export function Chip({ active, className, ...props }: React.HTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition",
        active
          ? "border-[var(--color-crimson)] bg-[var(--color-crimson)] text-white"
          : "border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-surface-2)]",
        className
      )}
      {...props}
    />
  );
}

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-[var(--color-surface-2)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--color-muted)]",
        className
      )}
      {...props}
    />
  );
}

/* ── Toast ────────────────────────────────────────────────────────────────── */
type Toast = { id: number; msg: string };
const ToastCtx = React.createContext<(msg: string) => void>(() => {});
export const useToast = () => React.useContext(ToastCtx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const push = React.useCallback((msg: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  // Surface cloud sync failures dispatched by the persistence layer (store.ts).
  // Throttled so a batch of failing collections doesn't stack a wall of toasts.
  React.useEffect(() => {
    let last = 0;
    function onSyncError(e: Event) {
      const now = Date.now();
      if (now - last < 6000) return;
      last = now;
      const op = (e as CustomEvent<{ op: "save" | "load" }>).detail?.op;
      push(
        op === "save"
          ? "Couldn't save to the cloud - kept a copy on this device."
          : "Couldn't reach the cloud - showing this device's data."
      );
    }
    window.addEventListener("ospyr:sync-error", onSyncError);
    return () => window.removeEventListener("ospyr:sync-error", onSyncError);
  }, [push]);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[99] flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-fade-up pointer-events-auto max-w-[92%] rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm text-white shadow-lg"
          >
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
