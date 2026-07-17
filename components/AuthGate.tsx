"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cloudMode, currentSession } from "@/lib/data/supabase";

/**
 * When the cloud backend is active (Supabase configured and not "device only"),
 * require a signed-in session before showing the app. Otherwise render immediately.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!cloudMode()) { setReady(true); return; }
      const session = await currentSession();
      if (!alive) return;
      if (!session) router.replace("/login");
      else setReady(true);
    })();
    return () => { alive = false; };
  }, [router]);

  if (!ready)
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-[var(--color-muted)]">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--color-line)] border-t-[var(--color-crimson)]" />
      </div>
    );
  return <>{children}</>;
}
