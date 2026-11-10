import type { SolveRecord } from "../types";

const FACE_MOVES = ["U", "D", "L", "R", "F", "B"] as const;
const SUFFIXES = ["", "'", "2"] as const;
const AXIS: Record<(typeof FACE_MOVES)[number], number> = {
  U: 0,
  D: 0,
  R: 1,
  L: 1,
  F: 2,
  B: 2,
};

export function generateScramble(length = 20): string {
  const moves: string[] = [];
  let previousFace = "";
  let previousAxis = -1;

  while (moves.length < length) {
    const face = FACE_MOVES[Math.floor(Math.random() * FACE_MOVES.length)]!;
    if (face === previousFace || AXIS[face] === previousAxis) continue;
    const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)]!;
    moves.push(`${face}${suffix}`);
    previousFace = face;
    previousAxis = AXIS[face];
  }
  return moves.join(" ");
}

export function formatTime(ms: number): string {
  const safe = Math.max(0, ms);
  const minutes = Math.floor(safe / 60000);
  const seconds = Math.floor((safe % 60000) / 1000);
  const millis = Math.floor(safe % 1000);
  if (minutes > 0) {
    return `${minutes}:${String(seconds).padStart(2, "0")}.${String(millis).padStart(3, "0")}`;
  }
  return `${seconds}.${String(millis).padStart(3, "0")}`;
}

export function formatRelativeDate(date: string): string {
  const value = new Date(date);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - value.getTime()) / 86400000);
  if (diffDays <= 0) {
    return value.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  }
  if (diffDays === 1) return "Hôm qua";
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return value.toLocaleDateString("vi-VN", { day: "2-digit", month: "short" });
}

export function average(records: SolveRecord[], count: number): number | null {
  if (records.length < count) return null;
  const times = records
    .slice(0, count)
    .map((record) => record.ms)
    .sort((a, b) => a - b);
  const trimmed = times.slice(1, -1);
  return trimmed.reduce((sum, value) => sum + value, 0) / trimmed.length;
}

export function bestTime(records: SolveRecord[]): number | null {
  return records.length ? Math.min(...records.map((record) => record.ms)) : null;
}

export function parseMove(move: string): string {
  return move.replace("_PRIME", "'");
}
