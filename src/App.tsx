import { useEffect, useState } from "react";
import { BottomNav } from "./components/BottomNav";
import { Toast } from "./components/Toast";
import { useToast } from "./hooks/useToast";
import { clearHistory, loadHistory, loadSettings, saveHistory, saveSettings } from "./lib/storage";
import { HistoryPage } from "./pages/HistoryPage";
import { HomePage } from "./pages/HomePage";
import { ScanPage } from "./pages/ScanPage";
import { SettingsPage } from "./pages/SettingsPage";
import { TimerPage } from "./pages/TimerPage";
import type { AppSettings, AppTab, SolveRecord } from "./types";

function resolvedTheme(setting: AppSettings["theme"]): "light" | "dark" {
  if (setting !== "system") return setting;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const [tab, setTab] = useState<AppTab>("home");
  const [history, setHistory] = useState<SolveRecord[]>(loadHistory);
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const { toast, showToast, closeToast } = useToast();

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      document.documentElement.dataset.theme = resolvedTheme(settings.theme);
      const meta = document.querySelector('meta[name="theme-color"]');
      meta?.setAttribute("content", resolvedTheme(settings.theme) === "dark" ? "#121522" : "#f5f6fb");
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [settings.theme]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const navigate = (next: AppTab) => {
    setTab(next);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const addRecord = (record: SolveRecord) => {
    setHistory((current) => [record, ...current].slice(0, 250));
  };

  return (
    <div className="app-shell">
      <div className="app-content" key={tab}>
        {tab === "home" && <HomePage history={history} onNavigate={navigate} />}
        {tab === "scan" && <ScanPage onNavigate={navigate} showToast={showToast} />}
        {tab === "timer" && (
          <TimerPage
            history={history}
            settings={settings}
            onRecord={addRecord}
            showToast={showToast}
          />
        )}
        {tab === "history" && (
          <HistoryPage
            history={history}
            onDelete={(id) => {
              setHistory((current) => current.filter((record) => record.id !== id));
              showToast("Đã xóa lượt giải.", "success");
            }}
          />
        )}
        {tab === "settings" && (
          <SettingsPage
            settings={settings}
            onSettings={setSettings}
            onClearHistory={() => {
              clearHistory();
              setHistory([]);
              showToast("Đã xóa toàn bộ lịch sử.", "success");
            }}
          />
        )}
      </div>
      <BottomNav active={tab} onChange={navigate} />
      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}
