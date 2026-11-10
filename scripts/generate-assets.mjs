import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const publicDir = path.join(root, "public");
const iconDir = path.join(publicDir, "icons");
const storeDir = path.join(root, "store-assets");

await mkdir(iconDir, { recursive: true });
await mkdir(storeDir, { recursive: true });

const icon = await readFile(path.join(publicDir, "icon.svg"));
await sharp(icon).resize(192, 192).png().toFile(path.join(iconDir, "icon-192.png"));
await sharp(icon).resize(512, 512).png().toFile(path.join(iconDir, "icon-512.png"));
await sharp(icon).resize(1024, 1024).png().toFile(path.join(storeDir, "icon-1024.png"));
await sharp(icon).resize(512, 512).png().toFile(path.join(storeDir, "play-icon-512.png"));

const featureGraphic = `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="500" viewBox="0 0 1024 500">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1024" y2="500" gradientUnits="userSpaceOnUse">
      <stop stop-color="#1B153C"/>
      <stop offset=".5" stop-color="#4430B8"/>
      <stop offset="1" stop-color="#15AABF"/>
    </linearGradient>
    <radialGradient id="glow">
      <stop stop-color="#75EDEF" stop-opacity=".68"/>
      <stop offset="1" stop-color="#75EDEF" stop-opacity="0"/>
    </radialGradient>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="20" stdDeviation="18" flood-color="#090714" flood-opacity=".4"/>
    </filter>
  </defs>
  <rect width="1024" height="500" fill="url(#bg)"/>
  <circle cx="805" cy="255" r="260" fill="url(#glow)"/>
  <g opacity=".15" fill="none" stroke="#fff">
    <circle cx="808" cy="245" r="175"/>
    <circle cx="808" cy="245" r="220"/>
    <path d="M0 418C180 350 360 487 557 404s300-62 467-4"/>
  </g>
  <g filter="url(#shadow)" stroke="#15172B" stroke-width="12" stroke-linejoin="round">
    <path fill="#F6F8FF" d="m807 67 143 83-143 83-144-83Z"/>
    <path fill="#63D9E5" d="m663 150 144 83v166l-144-83Z"/>
    <path fill="#AC9AFF" d="m951 150-144 83v166l144-83Z"/>
    <path d="m807 233-144-83M807 233l144-83M712 205l95 55M902 205l-95 55M712 285l95-52M902 285l-95-52M712 363l95-52v71M902 363l-95-52v71" fill="none" stroke-width="9"/>
  </g>
  <text x="74" y="158" fill="#7DEDEF" font-family="Segoe UI, sans-serif" font-size="20" font-weight="700" letter-spacing="5">3 × 3 CUBE COMPANION</text>
  <text x="70" y="238" fill="#FFFFFF" font-family="Segoe UI, sans-serif" font-size="66" font-weight="800" letter-spacing="-3">CUBIC FLOW</text>
  <text x="74" y="294" fill="#D8D4EF" font-family="Segoe UI, sans-serif" font-size="28" font-weight="500">Scan. Solve. Improve.</text>
  <rect x="74" y="338" width="340" height="4" rx="2" fill="#7DEDEF" opacity=".7"/>
  <text x="74" y="389" fill="#FFFFFF" opacity=".76" font-family="Segoe UI, sans-serif" font-size="21">Guided moves · Speed timer · On-device</text>
</svg>`;

await sharp(Buffer.from(featureGraphic)).png().toFile(path.join(storeDir, "feature-graphic-1024x500.png"));

const androidRes = path.join(root, "android", "app", "src", "main", "res");
const densityIcons = {
  mdpi: 48,
  hdpi: 72,
  xhdpi: 96,
  xxhdpi: 144,
  xxxhdpi: 192,
};
const densityForegrounds = {
  mdpi: 108,
  hdpi: 162,
  xhdpi: 216,
  xxhdpi: 324,
  xxxhdpi: 432,
};
const foreground = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 432 432">
  <g transform="translate(82 72)" fill="none" stroke="#FFFFFF" stroke-width="25" stroke-linejoin="round">
    <path d="M134 10 258 82 134 154 10 82Z" fill="#F7F7FF"/>
    <path d="M10 82 134 154v142L10 224Z" fill="#65E2E7"/>
    <path d="M258 82 134 154v142l124-72Z" fill="#B7A9FF"/>
    <path d="M73 46 134 82l61-36M20 110l114 64M248 110l-114 64M68 166l66 38v76M200 166l-66 38v76" stroke="#171A2D" stroke-width="15"/>
  </g>
</svg>`;

for (const [density, size] of Object.entries(densityIcons)) {
  const dir = path.join(androidRes, `mipmap-${density}`);
  await mkdir(dir, { recursive: true });
  await sharp(icon).resize(size, size).png().toFile(path.join(dir, "ic_launcher.png"));
  const circleMask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`,
  );
  const roundIcon = await sharp(icon)
    .resize(size, size)
    .composite([{ input: circleMask, blend: "dest-in" }])
    .png()
    .toBuffer();
  await sharp(roundIcon).toFile(path.join(dir, "ic_launcher_round.png"));
}

for (const [density, size] of Object.entries(densityForegrounds)) {
  const dir = path.join(androidRes, `mipmap-${density}`);
  await sharp(Buffer.from(foreground)).resize(size, size).png().toFile(path.join(dir, "ic_launcher_foreground.png"));
}
