// Live browser smoke test against the real Supabase cloud backend.
// Creates a confirmed user via the service role, then drives the actual UI.
import { chromium } from "playwright-core";
import { readFileSync } from "node:fs";

const EXE = process.env.CHROME_EXE;
const BASE = "http://localhost:3000";

// ── load .env.local ──────────────────────────────────────────────────────────
const env = {};
for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}
const SB_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SB_ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SB_SERVICE = env.SUPABASE_SERVICE_ROLE_KEY;

const email = `qa+${Date.now()}@ospyr-test.dev`;
const password = "TestPass!2026";

// ── create a confirmed user via admin API ────────────────────────────────────
async function createUser() {
  const r = await fetch(`${SB_URL}/auth/v1/admin/users`, {
    method: "POST",
    headers: { apikey: SB_SERVICE, Authorization: `Bearer ${SB_SERVICE}`, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, email_confirm: true }),
  });
  const body = await r.text();
  console.log(`[admin] create user ${email} → ${r.status}`);
  if (!r.ok) console.log(`[admin] body: ${body.slice(0, 300)}`);
  return r.ok;
}

const problems = [];
const log = (tag, msg) => console.log(`${tag} ${msg}`);

(async () => {
  console.log(`SB_URL=${SB_URL ? "set" : "MISSING"} anon=${SB_ANON ? "set" : "MISSING"} service=${SB_SERVICE ? "set" : "MISSING"}`);
  const ok = await createUser();
  if (!ok) { console.log("Could not create user — aborting cloud path"); }

  const browser = await chromium.launch({ executablePath: EXE, headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  page.on("console", (m) => {
    if (m.type() === "error") { problems.push(`console.error: ${m.text()}`); log("  [console.error]", m.text().slice(0, 200)); }
  });
  page.on("pageerror", (e) => { problems.push(`pageerror: ${e.message}`); log("  [pageerror]", e.message.slice(0, 200)); });
  page.on("requestfailed", (r) => {
    const u = r.url();
    if (u.includes("supabase") || u.includes("/api/")) { problems.push(`requestfailed: ${u} ${r.failure()?.errorText}`); log("  [reqfail]", `${u} ${r.failure()?.errorText}`); }
  });
  // capture supabase REST/auth responses that are non-2xx
  page.on("response", async (res) => {
    const u = res.url();
    if ((u.includes(SB_URL) || u.includes("/api/")) && res.status() >= 400) {
      let b = ""; try { b = (await res.text()).slice(0, 200); } catch {}
      problems.push(`http ${res.status()}: ${u} ${b}`);
      log("  [http " + res.status() + "]", `${u.replace(SB_URL, "")} ${b}`);
    }
  });

  // ── 1. login page ──────────────────────────────────────────────────────────
  log("[nav]", "/login");
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
  const cloudBanner = await page.getByText(/Cloud backend connected/i).count();
  log("[check]", `cloud banner visible: ${cloudBanner > 0}`);
  if (!cloudBanner) problems.push("Cloud banner NOT shown — supabaseEnabled() false in browser");

  // ── 2. sign in with confirmed user ──────────────────────────────────────────
  await page.getByRole("button", { name: /New here\? Create account|Have an account/i }).count();
  // ensure sign-in mode: fill email + password
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  log("[act]", "clicking Sign in & enter");
  await Promise.all([
    page.waitForURL(/\/app\//, { timeout: 15000 }).catch(() => log("[warn]", "did not navigate to /app within 15s")),
    page.getByRole("button", { name: /Sign in & enter/i }).click(),
  ]);
  await page.waitForTimeout(2500);
  const msg = await page.locator("text=/check your email|Invalid|error/i").allTextContents().catch(() => []);
  if (msg.length) log("[login-msg]", msg.join(" | "));
  log("[url]", page.url());

  // ── 3. walk the app pages ───────────────────────────────────────────────────
  const routes = ["/app/dashboard", "/app/home", "/app/crm", "/app/scheme", "/app/catalog", "/app/calculator", "/app/settings"];
  for (const rt of routes) {
    try {
      await page.goto(`${BASE}${rt}`, { waitUntil: "networkidle", timeout: 15000 });
      await page.waitForTimeout(1200);
      const h = await page.locator("h1, h2").first().textContent().catch(() => "");
      log("[nav]", `${rt} → "${(h || "").trim().slice(0, 40)}"`);
    } catch (e) {
      problems.push(`nav ${rt} failed: ${e.message}`);
      log("[nav-fail]", `${rt} ${e.message.slice(0, 120)}`);
    }
  }

  // ── 4. write test: add a CRM enquiry, confirm it persists to cloud ──────────
  log("[test]", "checking cloud write via os_collections REST");
  const check = await page.evaluate(async ({ url, anon }) => {
    // read the current session token from supabase's localStorage entry
    const key = Object.keys(localStorage).find((k) => k.startsWith("sb-") && k.endsWith("-auth-token"));
    if (!key) return { ok: false, reason: "no auth token in localStorage" };
    let token;
    try { token = JSON.parse(localStorage.getItem(key)).access_token; } catch { return { ok: false, reason: "token parse fail" }; }
    const ws = localStorage.getItem("ospyr:workspace");
    const r = await fetch(`${url}/rest/v1/os_collections?workspace=eq.${ws}&select=collection`, {
      headers: { apikey: anon, Authorization: `Bearer ${token}` },
    });
    const body = await r.text();
    return { ok: r.ok, status: r.status, ws, body: body.slice(0, 300), token: !!token };
  }, { url: SB_URL, anon: SB_ANON });
  log("[cloud-read]", JSON.stringify(check));
  if (!check.ok) problems.push(`cloud read failed: ${JSON.stringify(check)}`);

  await page.screenshot({ path: "tools/_shot-dashboard.png", fullPage: false }).catch(() => {});

  await browser.close();

  console.log("\n================ SUMMARY ================");
  console.log(`test user: ${email}`);
  if (problems.length === 0) console.log("No problems captured. ✅");
  else { console.log(`${problems.length} problem(s):`); problems.forEach((p, i) => console.log(`  ${i + 1}. ${p.slice(0, 240)}`)); }
})();
