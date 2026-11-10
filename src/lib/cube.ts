import type { ColorKey, CompletedFaceGrid, FaceKey, PartialFaceGrid, StickerGrid } from "../types";
import { FACES, FACE_COLORS } from "./constants";

const COLOR_TO_FACE: Record<ColorKey, FaceKey> = {
  white: "U",
  red: "R",
  green: "F",
  yellow: "D",
  orange: "L",
  blue: "B",
};

const FACE_TO_COLOR = FACE_COLORS;

export function createEmptyFaces(): PartialFaceGrid {
  return FACES.reduce(
    (result, face) => {
      const grid: StickerGrid = Array<ColorKey | null>(9).fill(null);
      grid[4] = FACE_COLORS[face];
      result[face] = grid;
      return result;
    },
    {} as PartialFaceGrid,
  );
}

export function isFaceComplete(grid: StickerGrid | undefined): grid is ColorKey[] {
  return Boolean(grid?.length === 9 && grid.every((cell) => cell !== null));
}

export function areAllFacesComplete(faces: PartialFaceGrid): faces is CompletedFaceGrid {
  return FACES.every((face) => isFaceComplete(faces[face]));
}

export function toSolverFaces(faces: CompletedFaceGrid) {
  return Object.fromEntries(
    FACES.map((face) => [face, faces[face].map((color) => COLOR_TO_FACE[color])]),
  ) as unknown as import("@turnwise/cube-solver").FaceGrid;
}

export function fromSolverFaces(faces: import("@turnwise/cube-solver").FaceGrid): CompletedFaceGrid {
  return Object.fromEntries(
    FACES.map((face) => [face, [...faces[face]].map((piece) => FACE_TO_COLOR[piece])]),
  ) as CompletedFaceGrid;
}

export function solvedFaces(): CompletedFaceGrid {
  return Object.fromEntries(FACES.map((face) => [face, Array<ColorKey>(9).fill(FACE_COLORS[face])])) as CompletedFaceGrid;
}

export function completedCopy(faces: PartialFaceGrid): CompletedFaceGrid | null {
  if (!areAllFacesComplete(faces)) return null;
  return Object.fromEntries(FACES.map((face) => [face, [...faces[face]]])) as CompletedFaceGrid;
}

export function faceProgress(faces: PartialFaceGrid): number {
  const filled = FACES.reduce(
    (total, face) => total + faces[face].filter((cell) => cell !== null).length,
    0,
  );
  return Math.round((filled / 54) * 100);
}
