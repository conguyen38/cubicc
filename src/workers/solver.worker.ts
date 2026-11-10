/// <reference lib="webworker" />

import {
  applyMoves,
  cubeFromFaces,
  facesFromCube,
  formatAlgorithm,
  prepare,
  solve,
} from "@turnwise/cube-solver";
import { fromSolverFaces, toSolverFaces } from "../lib/cube";
import type { CompletedFaceGrid } from "../types";

interface SolveRequest {
  id: number;
  faces: CompletedFaceGrid;
}

const ready = prepare();

self.addEventListener("message", async (event: MessageEvent<SolveRequest>) => {
  const { id, faces } = event.data;
  try {
    await ready;
    const cube = cubeFromFaces(toSolverFaces(faces));
    const solution = solve(cube);
    const steps = solution.map((_, index) => {
      const next = applyMoves(cube, solution.slice(0, index + 1));
      return {
        move: formatAlgorithm([solution[index]!]),
        faces: fromSolverFaces(facesFromCube(next)),
      };
    });
    self.postMessage({
      id,
      result: {
        moves: solution.map((move) => formatAlgorithm([move])),
        steps,
        start: faces,
      },
    });
  } catch (error) {
    self.postMessage({
      id,
      error: error instanceof Error ? error.message : "Invalid cube state.",
    });
  }
});

export {};
