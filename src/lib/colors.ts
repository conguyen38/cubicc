import type { ColorKey } from "../types";
import { COLOR_META } from "./constants";

type Lab = [number, number, number];

const PROTOTYPES: Record<ColorKey, Lab> = Object.fromEntries(
  Object.entries(COLOR_META).map(([key, value]) => [key, hexToLab(value.hex)]),
) as Record<ColorKey, Lab>;

function srgb(value: number): number {
  const channel = value / 255;
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

export function rgbToLab(r: number, g: number, b: number): Lab {
  const rl = srgb(r);
  const gl = srgb(g);
  const bl = srgb(b);
  const x = (rl * 0.4124 + gl * 0.3576 + bl * 0.1805) / 0.95047;
  const y = rl * 0.2126 + gl * 0.7152 + bl * 0.0722;
  const z = (rl * 0.0193 + gl * 0.1192 + bl * 0.9505) / 1.08883;
  const f = (value: number) => (value > 0.008856 ? Math.cbrt(value) : 7.787 * value + 16 / 116);
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
}

export function hexToLab(hex: string): Lab {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);
  return rgbToLab((value >> 16) & 255, (value >> 8) & 255, value & 255);
}

function distance(a: Lab, b: Lab): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

export function classifyRgb(r: number, g: number, b: number): ColorKey {
  const lab = rgbToLab(r, g, b);
  return (Object.entries(PROTOTYPES) as [ColorKey, Lab][]).reduce(
    (best, current) => (distance(lab, current[1]) < distance(lab, best[1]) ? current : best),
    ["white", PROTOTYPES.white] as [ColorKey, Lab],
  )[0];
}

export function classifyPatch(data: Uint8ClampedArray): ColorKey {
  let red = 0;
  let green = 0;
  let blue = 0;
  let count = 0;

  for (let index = 0; index < data.length; index += 4) {
    const alpha = data[index + 3] ?? 0;
    const brightness = (data[index] ?? 0) + (data[index + 1] ?? 0) + (data[index + 2] ?? 0);
    if (alpha < 120 || brightness < 75) continue;
    red += data[index] ?? 0;
    green += data[index + 1] ?? 0;
    blue += data[index + 2] ?? 0;
    count += 1;
  }

  if (count === 0) return "white";
  return classifyRgb(red / count, green / count, blue / count);
}

export function classifyImageGrid(
  image: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
): ColorKey[] {
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 900;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Không thể đọc ảnh trên thiết bị này.");

  const crop = Math.min(sourceWidth, sourceHeight);
  context.drawImage(
    image,
    (sourceWidth - crop) / 2,
    (sourceHeight - crop) / 2,
    crop,
    crop,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  const colors: ColorKey[] = [];
  for (let row = 0; row < 3; row += 1) {
    for (let column = 0; column < 3; column += 1) {
      const centerX = ((column + 0.5) / 3) * canvas.width;
      const centerY = ((row + 0.5) / 3) * canvas.height;
      const size = 52;
      const patch = context.getImageData(centerX - size / 2, centerY - size / 2, size, size).data;
      colors.push(classifyPatch(patch));
    }
  }
  return colors;
}
