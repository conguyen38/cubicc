export type FaceKey = "U" | "R" | "F" | "D" | "L" | "B";
export type ColorKey = "white" | "yellow" | "red" | "orange" | "green" | "blue";

export type StickerGrid = (ColorKey | null)[];
export type PartialFaceGrid = Record<FaceKey, StickerGrid>;
export type CompletedFaceGrid = Record<FaceKey, ColorKey[]>;

export type AppTab = "home" | "scan" | "timer" | "history" | "settings";

export interface SolveRecord {
  id: string;
  ms: number;
  scramble: string;
  createdAt: string;
}

export interface AppSettings {
  theme: "light" | "dark" | "system";
  holdMs: number;
  haptics: boolean;
}

export interface SolutionStep {
  move: string;
  faces: CompletedFaceGrid;
}

export interface SolutionResult {
  moves: string[];
  steps: SolutionStep[];
  start: CompletedFaceGrid;
}
