"use client";

import { useCallback, useEffect, useState } from "react";
import { Delete, Lock } from "lucide-react";

/**
 * Whole-site numeric passcode gate. Nothing renders until the correct code is
 * entered; the unlock is remembered on the device so it is asked once.
 * Set NEXT_PUBLIC_SITE_PASSCODE to change the code (defaults to 123456).
 */
const CODE = process.env.NEXT_PUBLIC_SITE_PASSCODE || "123456";
const KEY = "ospyr:unlocked";

export function PasscodeLock({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [entry, setEntry] = useState("");
  const [wrong, setWrong] = useState(false);

  useEffect(() => {
    setUnlocked(typeof window !== "undefined" && localStorage.getItem(KEY) === CODE);
    setMounted(true);
  }, []);

  const press = useCallback((d: string) => {
    setWrong(false);
    setEntry((prev) => {
      if (prev.length >= CODE.length) return prev;
      const next = prev + d;
      if (next.length === CODE.length) {
        if (next === CODE) {
          localStorage.setItem(KEY, CODE);
          setUnlocked(true);
        } else {
          setWrong(true);
          setTimeout(() => setEntry(""), 400);
        }
      }
      return next;
    });
  }, []);

  const back = useCallback(() => { setWrong(false); setEntry((p) => p.slice(0, -1)); }, []);

  useEffect(() => {
    if (unlocked) return;
    function onKey(e: KeyboardEvent) {
      if (e.key >= "0" && e.key <= "9") press(e.key);
      else if (e.key === "Backspace") back();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [unlocked, press, back]);

  if (!mounted)
    return <div className="min-h-screen bg-[var(--color-canvas)]" />;

  if (unlocked) return <>{children}</>;

  return (
    <main className="bg-warm-radial fixed inset-0 z-[999] flex min-h-screen flex-col items-center justify-center px-6">
      <div className={`card w-full max-w-xs p-7 text-center ${wrong ? "animate-shake" : ""}`}>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-2)]">
          <Lock size={20} className="text-[var(--color-crimson)]" />
        </div>
        <h1 className="font-display text-lg font-semibold">Enter passcode</h1>
        <p className="mt-1 text-xs text-[var(--color-muted)]">This workspace is locked.</p>

        <div className="my-6 flex justify-center gap-3">
          {Array.from({ length: CODE.length }).map((_, i) => (
            <span
              key={i}
              className="h-3 w-3 rounded-full border transition"
              style={{
                borderColor: wrong ? "var(--color-crimson)" : "var(--color-line)",
                background: i < entry.length ? (wrong ? "var(--color-crimson)" : "var(--color-ink)") : "transparent",
              }}
            />
          ))}
        </div>
        {wrong && <p className="mb-4 -mt-2 text-xs font-medium text-[var(--color-crimson)]">Wrong passcode, try again.</p>}

        <div className="grid grid-cols-3 gap-3">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
            <button key={d} onClick={() => press(d)} className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] py-3 text-lg font-medium transition hover:bg-[var(--color-surface-2)] active:scale-95">
              {d}
            </button>
          ))}
          <span />
          <button onClick={() => press("0")} className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] py-3 text-lg font-medium transition hover:bg-[var(--color-surface-2)] active:scale-95">
            0
          </button>
          <button onClick={back} aria-label="Delete" className="flex items-center justify-center rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] py-3 transition hover:bg-[var(--color-surface-2)] active:scale-95">
            <Delete size={18} className="text-[var(--color-muted)]" />
          </button>
        </div>
      </div>
    </main>
  );
}
