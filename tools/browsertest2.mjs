// Round-2: identify the 404, verify a real UI write round-trips to cloud.
import { chromium } from "playwright-core";
import { readFileSync } from "node:fs";

const EXE = process.env.CHROME_EXE;
const BASE = "http://localhost:3000";
const env = {};
for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/); if (m) env[m[1]] = m[2].trim();
}
const SB_URL = env.NEXT_PUBLIC_SUPABASE_URL, SB_ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY, SB_SERVICE = env.SUPABASE_SERVICE_ROLE_KEY;
const email = `qa+${Date.now()}@ospyr-test.dev`, password = "TestPass!2026";

async function createUser() {
  const r = await fetch(`${SB_URL}/auth/v1/admin/users`, {
    method: "POST",
    headers: { apikey: SB_SERVICE, Authorization: `Bearer ${SB_SERVICE}`, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, email_confirm: true }),
  });
  console.log(`[admin] create ${email} → ${r.status}`);
  return r.ok;
}

(async () => {
  await createUser();
  const browser = await chromium.launch({ executablePath: EXE, headless: true });
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();

  const four04 = [];
  page.on("response", (res) => { if (res.status() === 404) four04.push(res.url()); });

  // sign in
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole("button", { name: /Sign in & enter/i }).click();
  await page.waitForURL(/\/app\//, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2000);
  console.log(`[login] landed ${page.url()}`);
  console.log(`[404s on login] ${[...new Set(four04)].join("  |  ") || "none"}`);

  // ── real UI write: add a CRM enquiry ────────────────────────────────────────
  four04.length = 0;
  await page.goto(`${BASE}/app/crm`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  // find a name/text input and a submit/add button
  const nameInput = page.locator('input[type="text"], input:not([type])').first();
  const marker = `QA-${Date.now()}`;
  let wrote = false;
  if (await nameInput.count()) {
    await nameInput.fill(marker);
    // try clicking an Add/Save button
    const addBtn = page.getByRole("button", { name: /add|save|create|log enquiry|new/i }).first();
    if (await addBtn.count()) { await addBtn.click().catch(() => {}); wrote = true; }
  }
  await page.waitForTimeout(2500);
  console.log(`[write] attempted UI add of "${marker}": ${wrote}`);

  // verify via REST that it landed in cloud
  const verify = await page.evaluate(async ({ url, anon, marker }) => {
    const key = Object.keys(localStorage).find((k) => k.startsWith("sb-") && k.endsWith("-auth-token"));
    const token = JSON.parse(localStorage.getItem(key)).access_token;
    const ws = localStorage.getItem("ospyr:workspace");
    const r = await fetch(`${url}/rest/v1/os_collections?workspace=eq.${ws}&select=collection,data`, { headers: { apikey: anon, Authorization: `Bearer ${token}` } });
    const rows = await r.json();
    const found = JSON.stringify(rows).includes(marker);
    return { status: r.status, collections: Array.isArray(rows) ? rows.map((x) => x.collection) : rows, markerInCloud: found };
  }, { url: SB_URL, anon: SB_ANON, marker });
  console.log(`[cloud-verify] ${JSON.stringify(verify)}`);

  // ── founder sector: does a founder workspace route/render? ───────────────────
  await page.evaluate(() => { localStorage.setItem("ospyr:sector", "founder"); });
  await page.goto(`${BASE}/app/founder`, { waitUntil: "networkidle", timeout: 15000 }).catch((e) => console.log(`[founder] nav err ${e.message.slice(0,80)}`));
  await page.waitForTimeout(1000);
  const fh = await page.locator("h1,h2").first().textContent().catch(() => "");
  console.log(`[founder] /app/founder → "${(fh || "").trim().slice(0, 40)}"`);

  await page.screenshot({ path: "tools/_shot-crm.png" }).catch(() => {});
  await browser.close();
  console.log(`\ntest user: ${email}`);
})();
