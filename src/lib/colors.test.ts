import { describe, expect, it } from "vitest";
import { classifyPatch, classifyRgb } from "./colors";

describe("cube colour classification", () => {
  it.each([
    [247, 246, 239, "white"],
    [244, 212, 72, "yellow"],
    [227, 76, 85, "red"],
    [242, 138, 53, "orange"],
    [38, 173, 105, "green"],
    [52, 124, 229, "blue"],
  ] as const)("classifies %i, %i, %i as %s", (red, green, blue, expected) => {
    expect(classifyRgb(red, green, blue)).toBe(expected);
  });

  it("keeps a representative patch stable under slight lighting changes", () => {
    const patch = new Uint8ClampedArray(52 * 52 * 4);
    for (let index = 0; index < patch.length; index += 4) {
      patch[index] = 210;
      patch[index + 1] = 65;
      patch[index + 2] = 72;
      patch[index + 3] = 255;
    }
    expect(classifyPatch(patch)).toBe("red");
  });
});
