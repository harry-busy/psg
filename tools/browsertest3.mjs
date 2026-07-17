import { chromium } from "playwright-core";
import { readFileSync } from "node:fs";
const EXE = process.env.CHROME_EXE, BASE = "http://localhost:3000";
const env = {};
for (const l of readFileSync(".env.local", "utf8").split("\n")) { const m = l.match(/^([A-Z0-9_]+)=(.*)$/); if (m) env[m[1]] = m[2].trim(); }
const SB_URL = env.NEXT_PUBLIC_SUPABASE_URL, SB_SERVICE = env.SUPABASE_SERVICE_ROLE_KEY;
const email = `qa+${Date.now()}@ospyr-test.dev`, password = "TestPass!2026";
await fetch(`${SB_URL}/auth/v1/admin/users`, { method: "POST", headers: { apikey: SB_SERVICE, Authorization: `Bearer ${SB_SERVICE}`, "Content-Type": "application/json" }, body: JSON.stringify({ email, password, email_confirm: true }) });

const browser = await chromium.launch({ executablePath: EXE, headless: true });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
const errs = [];
page.on("pageerror", (e) => errs.push(`pageerror: ${e.message}`));
page.on("console", (m) => { if (m.type() === "error" && !m.text().includes("404")) errs.push(`console: ${m.text().slice(0,120)}`); });

// sign in as a founder workspace
await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Founder group" }).click();
await page.locator('input').first().fill("Harshdeep Group");
await page.locator('input[type="email"]').fill(email);
await page.locator('input[type="password"]').fill(password);
await page.getByRole("button", { name: /Sign in & enter/i }).click();
await page.waitForURL(/\/app\//, { timeout: 15000 }).catch(() => {});
await page.waitForTimeout(2000);
console.log(`[founder-login] landed ${page.url()}`);

const routes = ["/app/founder/command", "/app/founder/money", "/app/founder/brands", "/app/founder/leads", "/app/founder/scorecard", "/app/founder/chief"];
for (const rt of routes) {
  await page.goto(`${BASE}${rt}`, { waitUntil: "networkidle", timeout: 15000 }).catch((e) => console.log(`[fail] ${rt} ${e.message.slice(0,60)}`));
  await page.waitForTimeout(900);
  const h = await page.locator("h1,h2").first().textContent().catch(() => "");
  const is404 = (await page.locator("text=/404|not found/i").count()) > 0;
  console.log(`[nav] ${rt} → "${(h||"").trim().slice(0,36)}"${is404 ? "  ⚠️ 404" : ""}`);
}
await page.screenshot({ path: "tools/_shot-founder.png" });
await browser.close();
console.log(`\nerrors: ${errs.length ? errs.join(" || ") : "none"}`);
console.log(`test user: ${email}`);
