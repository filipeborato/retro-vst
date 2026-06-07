// Dev helper: screenshot key states of the app for visual review.
// Usage: node scripts/shoot.mjs [baseUrl]
import { chromium } from "playwright";

const base = process.argv[2] || "http://localhost:3000";
const out = "/tmp";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1320, height: 920 } });

await page.goto(base, { waitUntil: "networkidle" });
await page.waitForTimeout(2200);
await page.screenshot({ path: `${out}/retro-home.png` });
console.log("home ✓");

// open first rack unit -> modal
await page.locator(".rack-unit").first().click();
await page.waitForTimeout(900);
await page.screenshot({ path: `${out}/retro-modal.png` });
console.log("modal ✓");

// open login modal (close plugin modal first via ESC)
await page.keyboard.press("Escape");
await page.waitForTimeout(400);
const loginBtn = page.locator(".hw-btn-amber");
if (await loginBtn.count()) {
  await loginBtn.first().click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${out}/retro-login.png` });
  console.log("login ✓");
}

await browser.close();
