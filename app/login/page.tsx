"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { VENDOR } from "@/lib/brand";
import { Button, Input, Field, Select, Chip } from "@/components/ui";
import { sectorFor, setSector, SECTOR_HOME, type Sector } from "@/lib/sector";
import { supabaseEnabled, signInEmail, signUpEmail, ensureWorkspace } from "@/lib/data/supabase";
import { Gem, Building2, Cloud, HardDrive } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [name, setName] = useState("Harshdeep Group");
  const [role, setRole] = useState("Owner");
  const [sector, setSel] = useState<Sector>("founder");
  const [touched, setTouched] = useState(false);

  // Picking a business type also swaps the workspace name to that sector's flagship,
  // so choosing "Founder group" flips the name above from PSG Gold to Harshdeep Group.
  function pickSector(s: Sector) {
    setSel(s);
    setTouched(true);
    setName(s === "founder" ? "Harshdeep Group" : "PSG Gold");
  }

  const [cloud, setCloud] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => setCloud(supabaseEnabled()), []);
  // If the landing page linked here with ?sector=..., open straight into that
  // sector with its flagship name (Founder → Harshdeep Group, Jewellery → PSG Gold).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const p = q.get("sector");
    const w = q.get("ws");
    if (p === "jewellery" || p === "founder") {
      setSel(p);
      setName(w?.trim() || (p === "founder" ? "Harshdeep Group" : "PSG Gold"));
      setTouched(true);
    } else if (w?.trim()) {
      setName(w.trim());
      const guess = sectorFor(w);
      if (guess) setSel(guess);
      setTouched(true);
    }
  }, []);
  useEffect(() => {
    if (touched) return;
    const guess = sectorFor(name);
    if (guess) setSel(guess);
  }, [name, touched]);

  const slug = (name.trim() || "workspace").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  function persistLocal(ws = slug) {
    localStorage.setItem("ospyr:workspace", ws);
    localStorage.setItem("ospyr:role", role);
    setSector(sector);
    const k = sector === "jewellery" ? `ospyr:${ws}:settings` : `ospyr:${ws}:founder`;
    const field = sector === "jewellery" ? "name" : "groupName";
    if (!localStorage.getItem(k)) localStorage.setItem(k, JSON.stringify({ [field]: name.trim() }));
  }

  async function enterCloud() {
    const em = email.trim();
    if (!em) { setMsg("Enter an email to continue."); return; }
    setBusy(true); setMsg("");
    // Any email works: a blank password falls back to a shared demo password so
    // first-time sign-ups always succeed.
    const pw = password || "ospyr-demo-pass";
    try {
      // Try to sign in first; if the account doesn't exist yet, create it.
      const signIn = await signInEmail(em, pw);
      const res = signIn.error ? await signUpEmail(em, pw) : signIn;
      const data = res.data;
      if (data?.session) {
        localStorage.removeItem("ospyr:localOnly");
        // Scope the cloud workspace to the owner's user id so two accounts that
        // pick the same name can never share (and leak) each other's data.
        const cloudWs = `${data.session.user.id}-${slug}`;
        persistLocal(cloudWs);
        await ensureWorkspace(cloudWs, name.trim(), sector);
        router.push(SECTOR_HOME[sector]);
        return;
      }
      // No session (email confirmation required, or a wrong password on an
      // existing account) - still let them in on this device so any email works.
      enterLocal();
    } catch {
      // Backend unreachable - fall back to local so login always works.
      enterLocal();
    }
  }

  function enterLocal() {
    localStorage.setItem("ospyr:localOnly", "1");
    persistLocal();
    router.push(SECTOR_HOME[sector]);
  }

  // Pressing Enter anywhere in the form starts sign-in (or local entry).
  function submit() {
    if (busy) return;
    if (cloud) enterCloud(); else enterLocal();
  }
  function onKey(e: KeyboardEvent) {
    if (e.key === "Enter") { e.preventDefault(); submit(); }
  }

  return (
    <main className="bg-warm-radial flex min-h-screen items-center justify-center px-6 py-10">
      <div className="card w-full max-w-md p-8">
        <Link href="/" className="mb-6 flex items-center gap-2 font-display text-lg font-semibold">
          <Gem size={18} className="text-[var(--color-crimson)]" /> {VENDOR.name}
        </Link>
        <h1 className="font-display text-2xl font-semibold">Open your workspace</h1>
        <p className="mb-6 mt-1 text-sm text-[var(--color-muted)]">
          Your workspace name decides where you land - a jewellery showroom or a founder group.
        </p>

        <Field label="Workspace name">
          <Input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={onKey} placeholder="PSG Gold  ·  Diyam House of Silver  ·  Harshdeep Group" />
        </Field>

        <div className="mb-1 mt-2 flex flex-wrap gap-2">
          {[
            { n: "PSG Gold", s: "jewellery" as Sector },
            { n: "Vardhman Jewels", s: "jewellery" as Sector },
            { n: "Diyam House of Silver", s: "jewellery" as Sector },
            { n: "Padmavathi Jewellery Mart", s: "jewellery" as Sector },
            { n: "Harshdeep Group", s: "founder" as Sector },
          ].map((q) => (
            <Chip key={q.n} active={name.trim() === q.n} onClick={() => { setName(q.n); setSel(q.s); setTouched(true); }}>{q.n}</Chip>
          ))}
        </div>

        <Field label="Type of business">
          <div className="flex gap-2">
            <Chip active={sector === "jewellery"} onClick={() => pickSector("jewellery")} className="inline-flex items-center gap-1.5"><Gem size={14} /> Jewellery</Chip>
            <Chip active={sector === "founder"} onClick={() => pickSector("founder")} className="inline-flex items-center gap-1.5"><Building2 size={14} /> Founder group</Chip>
          </div>
        </Field>

        <Field label="I am the…">
          <Select value={role} onChange={(e) => setRole(e.target.value)}>
            <option>Owner / Founder</option><option>Manager</option><option>Team</option>
          </Select>
        </Field>

        {cloud ? (
          <>
            <div className="mt-5 mb-1 flex items-center gap-2 text-xs font-semibold text-[var(--color-success)]">
              <Cloud size={14} /> Cloud backend connected - {authMode === "signup" ? "create your account" : "sign in"} to sync across devices
            </div>
            <Field label="Email"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={onKey} placeholder="you@company.com" /></Field>
            <Field label="Password"><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={onKey} placeholder="••••••••" /></Field>
            {msg && <p className="mt-2 text-xs text-[var(--color-warn)]">{msg}</p>}
            <Button className="mt-4 w-full" loading={busy} onClick={enterCloud}>
              {authMode === "signup" ? "Create account & enter" : "Sign in & enter"}
            </Button>
            <div className="mt-3 flex items-center justify-between text-xs">
              <button className="text-[var(--color-muted)] hover:text-[var(--color-ink)]" onClick={() => { setAuthMode(authMode === "signup" ? "signin" : "signup"); setMsg(""); }}>
                {authMode === "signup" ? "Have an account? Sign in" : "New here? Create account"}
              </button>
              <button className="flex items-center gap-1 text-[var(--color-muted)] hover:text-[var(--color-ink)]" onClick={enterLocal}>
                <HardDrive size={12} /> Use this device only
              </button>
            </div>
          </>
        ) : (
          <Button className="mt-6 w-full" onClick={enterLocal}>Enter workspace</Button>
        )}

        <p className="mt-5 text-center text-xs text-[var(--color-muted)]">
          Try <b>PSG Gold</b> or <b>Diyam House of Silver</b> (jewellery), or <b>Harshdeep Group</b> (founder).
        </p>
      </div>
    </main>
  );
}
