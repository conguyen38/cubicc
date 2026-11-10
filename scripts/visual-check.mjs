import { chromium } from "playwright-core";
import path from "node:path";
import sharp from "sharp";
import { Moves, cubeFromMoves, facesFromCube } from "@turnwise/cube-solver";

const browser = await chromium.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
  args: ["--no-sandbox"],
});
const context = await browser.newContext({
  viewport: { width: 540, height: 960 },
  deviceScaleFactor: 2,
  locale: "vi-VN",
  colorScheme: "light",
});
const page = await context.newPage();
const errors = [];
page.on("console", (message) => {
  if (message.type() === "error") errors.push(`console: ${message.text()}`);
});
page.on("pageerror", (error) => errors.push(`page: ${error.message}`));

await page.goto("http://127.0.0.1:4173", { waitUntil: "networkidle" });
await page.waitForTimeout(900);
const capture = async (filename) => {
  const raw = await page.screenshot({ fullPage: false });
  await sharp(raw).removeAlpha().png({ compressionLevel: 9 }).toFile(path.resolve(`store-assets/${filename}`));
};

await capture("phone-1-home.png");

await page.locator(".nav-item").filter({ hasText: "Quét" }).click();
await page.waitForTimeout(500);
await capture("phone-2-scan-camera.png");
await page.locator(".mode-switch button").filter({ hasText: "Nhập tay" }).click();
await page.waitForTimeout(250);
await capture("phone-3-scan-manual.png");

const faceColors = {
  U: "Trắng",
  R: "Đỏ",
  F: "Xanh lá",
  D: "Vàng",
  L: "Cam",
  B: "Xanh dương",
};
const scramble = [
  Moves.R,
  Moves.U_PRIME,
  Moves.F2,
  Moves.L,
  Moves.D_PRIME,
  Moves.R2,
  Moves.B,
  Moves.U,
];
const scrambled = facesFromCube(cubeFromMoves(scramble));
for (let face = 0; face < 6; face += 1) {
  if (face > 0) await page.locator(".face-tabs button").nth(face).click();
  const faceName = ["U", "R", "F", "D", "L", "B"][face];
  const cells = page.locator(".manual-editor .sticker:not(.is-center)");
  const positions = [0, 1, 2, 3, 5, 6, 7, 8];
  for (let cell = 0; cell < 8; cell += 1) {
    const stickerFace = scrambled[faceName][positions[cell]];
    await page.locator(`.color-picker button[aria-label="${faceColors[stickerFace]}"]`).click();
    await cells.nth(cell).click();
  }
  if (face < 5) await page.getByRole("button", { name: /Mặt tiếp theo/ }).click();
}
await page.getByRole("button", { name: /Giải khối/ }).click();
await page.waitForSelector(".solution-page", { timeout: 8000 });
await page.waitForTimeout(250);
await capture("phone-4-solution.png");

await page.getByRole("button", { name: /Bắt đầu/ }).click();
await page.waitForTimeout(150);
await page.getByRole("button", { name: /Bước tiếp theo/ }).click();
await page.waitForTimeout(150);
await capture("phone-5-solution-step.png");
let guard = 40;
while ((await page.locator(".solution-page").count()) && guard-- > 0) {
  await page.getByRole("button", { name: /Bước tiếp theo/ }).click();
  await page.waitForTimeout(40);
  if (await page.getByRole("button", { name: /Hoàn tất/ }).count()) {
    await page.getByRole("button", { name: /Hoàn tất/ }).click();
    break;
  }
}
await page.waitForSelector(".finished-page", { timeout: 3000 });
await page.waitForTimeout(250);
await capture("phone-6-solved.png");

await page.locator(".nav-item").filter({ hasText: "Bấm giờ" }).click();
await page.waitForTimeout(300);
const timerPad = page.locator(".timer-pad");
const bounds = await timerPad.boundingBox();
if (!bounds) throw new Error("Timer pad was not visible");
await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
await page.mouse.down();
await page.waitForTimeout(1250);
await page.mouse.up();
await page.waitForTimeout(12340);
await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
await page.waitForTimeout(250);
await page.getByRole("button", { name: "Đóng thông báo" }).click();
await capture("phone-7-timer.png");

await page.locator(".nav-item").filter({ hasText: "Cài đặt" }).click();
await page.waitForTimeout(250);
await page.getByRole("button", { name: "Tối" }).click();
await page.waitForTimeout(450);
await capture("phone-8-settings-dark.png");

const result = {
  title: await page.title(),
  errors,
  theme: await page.locator("html").getAttribute("data-theme"),
  records: await page.evaluate(() => JSON.parse(localStorage.getItem("cubic-flow.history.v1") || "[]").length),
  bodyScrollWidth: await page.evaluate(() => document.body.scrollWidth),
  viewportWidth: await page.evaluate(() => window.innerWidth),
};
console.log(JSON.stringify(result, null, 2));
await browser.close();
