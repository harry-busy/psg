// Visual check: hover-reveal sidebar + KPI row arrangement on a founder dashboard.
import { chromium } from "playwright-core";
import { readFileSync } from "node:fs";
const EXE = process.env.CHROME_EXE, BASE = "http://localhost:3000";
const env = {};
for (const l of readFileSync(".env.local", "utf8").split("\n")) { const m = l.match(/^([A-Z0-9_]+)=(.*)$/); if (m) env[m[1]] = m[2].trim(); }
const SB_URL = env.NEXT_PUBLIC_SUPABASE_URL, SB_SERVICE = env.SUPABASE_SERVICE_ROLE_KEY;
const email = `qa+${Date.now()}@ospyr-test.dev`;
await fetch(`${SB_URL}/auth/v1/admin/users`, { method: "POST", headers: { apikey: SB_SERVICE, Authorization: `Bearer ${SB_SERVICE}`, "Content-Type": "application/json" }, body: JSON.stringify({ email, password: "TestPass!2026", email_confirm: true }) });

const browser = await chromium.launch({ executablePath: EXE, headless: true });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const errs = [];
page.on("pageerror", (e) => errs.push(e.message));

await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Founder group" }).click();
await page.locator("input").first().fill("Harshdeep Group");
await page.locator('input[type="email"]').fill(email);
await page.locator('input[type="password"]').fill("TestPass!2026");
await page.getByRole("button", { name: /Sign in & enter/i }).click();
await page.waitForURL(/\/app\//, { timeout: 15000 }).catch(() => {});
await page.goto(`${BASE}/app/founder/command`, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

// seed demo data so KPI tiles have real numbers
const demo = page.getByRole("button", { name: /load demo/i }).first();
if (await demo.count()) { await demo.click().catch(() => {}); await page.waitForTimeout(1500); }

// 1) collapsed: sidebar hidden, only the handle visible
await page.screenshot({ path: "tools/_ui-collapsed.png" });
const asideBox = await page.locator("aside").first().boundingBox();
console.log(`[collapsed] aside x=${asideBox?.x?.toFixed(0)} (negative = off-canvas, good)`);

// 2) hover the left handle → nav reveals
await page.mouse.move(6, 450);
await page.waitForTimeout(600);
await page.screenshot({ path: "tools/_ui-hover.png" });
const asideBox2 = await page.locator("aside").first().boundingBox();
console.log(`[hover]     aside x=${asideBox2?.x?.toFixed(0)} (0 = revealed, good)`);

// 3) KPI row: measure each tile's number size + overflow
await page.mouse.move(900, 450);
await page.waitForTimeout(400);
const kpi = await page.evaluate(() => {
  const tiles = [...document.querySelectorAll(".card")].filter((c) => c.querySelector(".tabular-nums"));
  return tiles.slice(0, 6).map((c) => {
    const num = c.querySelector(".tabular-nums");
    const cs = getComputedStyle(num);
    return { text: num.textContent.trim(), fontPx: Math.round(parseFloat(cs.fontSize)), overflow: num.scrollWidth > num.clientWidth + 1 };
  });
});
console.log("[kpi tiles]");
for (const t of kpi) console.log(`  "${t.text}"  ${t.fontPx}px  ${t.overflow ? "⚠️ OVERFLOW" : "fits"}`);
const sizes = new Set(kpi.map((t) => t.fontPx));
console.log(`\nuniform size across row? ${sizes.size === 1 ? "YES ✅ (" + [...sizes][0] + "px)" : "NO — sizes " + [...sizes].join(",")}`);
console.log(`any overflow? ${kpi.some((t) => t.overflow) ? "YES ❌" : "NO ✅"}`);
console.log(`pageerrors: ${errs.length ? errs.join(" | ") : "none"}`);
await browser.close();
