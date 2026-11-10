import { describe, expect, it, vi } from "vitest";
import { formatTime } from "./scramble";
import { generateScramble } from "./scramble";

describe("timer formatting", () => {
  it("formats sub-minute and minute values", () => {
    expect(formatTime(12345)).toBe("12.345");
    expect(formatTime(62123)).toBe("1:02.123");
  });
});

describe("scramble generation", () => {
  it("creates the requested number of moves without adjacent turns on the same axis", () => {
    vi.spyOn(Math, "random").mockReturnValueOnce(0).mockReturnValueOnce(0).mockReturnValueOnce(0);
    const moves = generateScramble(20).split(" ");
    expect(moves).toHaveLength(20);
    const axis = (move: string) => ["UD", "RL", "FB"].findIndex((faces) => faces.includes(move[0]!));
    for (let index = 1; index < moves.length; index += 1) {
      expect(axis(moves[index]!)).not.toBe(axis(moves[index - 1]!));
    }
    vi.restoreAllMocks();
  });
});
