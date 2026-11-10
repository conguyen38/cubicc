import { describe, expect, it } from "vitest";
import {
  Moves,
  applyMoves,
  cubeFromMoves,
  facesFromCube,
  formatAlgorithm,
  isSolved,
  prepare,
  solve,
} from "@turnwise/cube-solver";
import { fromSolverFaces, toSolverFaces } from "./cube";

describe("cube solver integration", () => {
  it("round-trips the 54 sticker grid", () => {
    const scrambled = cubeFromMoves([Moves.R, Moves.U_PRIME, Moves.F2]);
    const grid = fromSolverFaces(facesFromCube(scrambled));
    const restored = toSolverFaces(grid);
    expect(restored).toEqual(facesFromCube(scrambled));
  });

  it("solves a legal scrambled cube", async () => {
    await prepare();
    const scramble = [
      Moves.F,
      Moves.R2,
      Moves.U_PRIME,
      Moves.B,
      Moves.L2,
      Moves.D,
      Moves.F2,
      Moves.R_PRIME,
      Moves.U2,
      Moves.L,
    ];
    const cube = cubeFromMoves(scramble);
    const solution = solve(cube);
    expect(formatAlgorithm(solution).length).toBeGreaterThan(0);
    expect(isSolved(applyMoves(cube, solution))).toBe(true);
  });
});
