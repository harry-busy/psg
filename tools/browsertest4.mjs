// Security proof: two users who pick the SAME workspace name must NOT share data.
import { chromium } from "playwright-core";
import { readFileSync } from "node:fs";

const EXE = process.env.CHROME_EXE, BASE = "http://localhost:3000";
const env = {};
for (const l of readFileSync(".env.local", "utf8").split("\n")) { const m = l.match(/^([A-Z0-9_]+)=(.*)$/); if (m) env[m[1]] = m[2].trim(); }
const SB_URL = env.NEXT_PUBLIC_SUPABASE_URL, SB_SERVICE = env.SUPABASE_SERVICE_ROLE_KEY, SB_ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const WS_NAME = "Shared Name Co";           // both users type the identical name
const marker = `SECRET-A-${Date.now()}`;

async function mkUser() {
  const email = `qa+${Date.now()}${Math.floor(Math.random()*999)}@ospyr-test.dev`;
  await fetch(`${SB_URL}/auth/v1/admin/users`, { method: "POST",
    headers: { apikey: SB_SERVICE, Authorization: `Bearer ${SB_SERVICE}`, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: "TestPass!2026", email_confirm: true }) });
  return email;
}

async function login(page, email) {
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Founder group" }).click().catch(() => {});
  await page.locator("input").first().fill(WS_NAME);
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill("TestPass!2026");
  await page.getByRole("button", { name: /Sign in & enter/i }).click();
  await page.waitForURL(/\/app\//, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2000);
  return page.evaluate(() => localStorage.getItem("ospyr:workspace"));
}

const browser = await chromium.launch({ executablePath: EXE, headless: true });

// ── User A: log in, write a secret enquiry to the cloud ──────────────────────
const emailA = await mkUser();
const pA = await (await browser.newContext()).newPage();
const wsA = await login(pA, emailA);
await pA.goto(`${BASE}/app/crm`, { waitUntil: "networkidle" });
await pA.waitForTimeout(800);
const inA = pA.locator('input[type="text"], input:not([type])').first();
if (await inA.count()) { await inA.fill(marker); await pA.getByRole("button", { name: /add|save|create|log enquiry|new/i }).first().click().catch(() => {}); }
await pA.waitForTimeout(2000);
console.log(`[A] ws=${wsA}`);

// ── User B: DIFFERENT account, SAME workspace name — must not see A's data ────
const emailB = await mkUser();
const pB = await (await browser.newContext()).newPage();
const wsB = await login(pB, emailB);
const leak = await pB.evaluate(async ({ url, anon, marker }) => {
  const key = Object.keys(localStorage).find((k) => k.startsWith("sb-") && k.endsWith("-auth-token"));
  const token = JSON.parse(localStorage.getItem(key)).access_token;
  const ws = localStorage.getItem("ospyr:workspace");
  const r = await fetch(`${url}/rest/v1/os_collections?workspace=eq.${ws}&select=data`, { headers: { apikey: anon, Authorization: `Bearer ${token}` } });
  const rows = await r.json();
  return { ws, sawSecret: JSON.stringify(rows).includes(marker) };
}, { url: SB_URL, anon: SB_ANON, marker });
console.log(`[B] ws=${leak.ws}`);

console.log(`\nsame name, different slug? ${wsA !== wsB ? "YES ✅" : "NO ❌"}`);
console.log(`B can see A's secret enquiry? ${leak.sawSecret ? "YES ❌ LEAK" : "NO ✅ isolated"}`);
await browser.close();
