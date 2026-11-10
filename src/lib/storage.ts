import type { AppSettings, SolveRecord } from "../types";

const HISTORY_KEY = "cubic-flow.history.v1";
const SETTINGS_KEY = "cubic-flow.settings.v1";

export const DEFAULT_SETTINGS: AppSettings = {
  theme: "system",
  holdMs: 550,
  haptics: true,
};

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function loadHistory(): SolveRecord[] {
  const records = readJson<SolveRecord[]>(HISTORY_KEY, []);
  return Array.isArray(records)
    ? records.filter(
        (record) =>
          typeof record?.id === "string" &&
          typeof record?.ms === "number" &&
          typeof record?.scramble === "string" &&
          typeof record?.createdAt === "string",
      )
    : [];
}

export function saveHistory(records: SolveRecord[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(records.slice(0, 250)));
}

export function loadSettings(): AppSettings {
  return { ...DEFAULT_SETTINGS, ...readJson<Partial<AppSettings>>(SETTINGS_KEY, {}) };
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}
