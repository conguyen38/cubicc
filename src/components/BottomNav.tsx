import { Clock3, History, Home, ScanLine, SlidersHorizontal } from "lucide-react";
import type { AppTab } from "../types";

const items: { id: AppTab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Trang chủ", icon: Home },
  { id: "scan", label: "Quét", icon: ScanLine },
  { id: "timer", label: "Bấm giờ", icon: Clock3 },
  { id: "history", label: "Lịch sử", icon: History },
  { id: "settings", label: "Cài đặt", icon: SlidersHorizontal },
];

export function BottomNav({
  active,
  onChange,
}: {
  active: AppTab;
  onChange: (tab: AppTab) => void;
}) {
  return (
    <nav className="bottom-nav" aria-label="Điều hướng chính">
      {items.map(({ id, label, icon: Icon }) => (
        <button
          type="button"
          key={id}
          className={`nav-item ${active === id ? "is-active" : ""}`}
          onClick={() => onChange(id)}
          aria-current={active === id ? "page" : undefined}
        >
          <span className="nav-icon">
            <Icon size={21} strokeWidth={active === id ? 2.7 : 2} />
          </span>
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
