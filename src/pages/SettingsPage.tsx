import {
  ChevronRight,
  FileText,
  Info,
  Moon,
  Smartphone,
  Sun,
  Trash2,
  Vibrate,
} from "lucide-react";
import type { AppSettings } from "../types";

export function SettingsPage({
  settings,
  onSettings,
  onClearHistory,
}: {
  settings: AppSettings;
  onSettings: (settings: AppSettings) => void;
  onClearHistory: () => void;
}) {
  const changeTheme = (theme: AppSettings["theme"]) => onSettings({ ...settings, theme });

  return (
    <main className="page">
      <header className="simple-header">
        <div>
          <p className="eyebrow">TÙY CHỈNH TRẢI NGHIỆM</p>
          <h1>Cài đặt</h1>
        </div>
      </header>

      <section className="settings-group">
        <p className="settings-label">Giao diện</p>
        <div className="card settings-card">
          <div className="settings-row static">
            <span className="settings-icon"><Sun size={19} /></span>
            <div className="settings-copy">
              <strong>Chế độ hiển thị</strong>
              <small>Theo sở thích hoặc thiết bị</small>
            </div>
          </div>
          <div className="segmented">
            <button type="button" className={settings.theme === "light" ? "is-active" : ""} onClick={() => changeTheme("light")}>
              <Sun size={16} /> Sáng
            </button>
            <button type="button" className={settings.theme === "dark" ? "is-active" : ""} onClick={() => changeTheme("dark")}>
              <Moon size={16} /> Tối
            </button>
            <button type="button" className={settings.theme === "system" ? "is-active" : ""} onClick={() => changeTheme("system")}>
              <Smartphone size={16} /> Hệ thống
            </button>
          </div>
        </div>
      </section>

      <section className="settings-group">
        <p className="settings-label">Bấm giờ</p>
        <div className="card settings-card">
          <div className="settings-row">
            <span className="settings-icon violet"><Smartphone size={19} /></span>
            <div className="settings-copy">
              <strong>Thời gian giữ</strong>
              <small>Thời gian chờ trước khi có thể bắt đầu</small>
            </div>
            <span className="settings-value">{(settings.holdMs / 1000).toFixed(1)}s</span>
          </div>
          <input
            className="range-input"
            type="range"
            min="300"
            max="1500"
            step="50"
            value={settings.holdMs}
            onChange={(event) => onSettings({ ...settings, holdMs: Number(event.target.value) })}
            aria-label="Thời gian giữ để bắt đầu"
          />
          <div className="settings-row divider-top">
            <span className="settings-icon mint"><Vibrate size={19} /></span>
            <div className="settings-copy">
              <strong>Phản hồi rung</strong>
              <small>Rung nhẹ khi bắt đầu hoặc kết thúc</small>
            </div>
            <button
              type="button"
              className={`toggle ${settings.haptics ? "is-on" : ""}`}
              onClick={() => onSettings({ ...settings, haptics: !settings.haptics })}
              aria-pressed={settings.haptics}
              aria-label="Bật hoặc tắt phản hồi rung"
            >
              <span />
            </button>
          </div>
        </div>
      </section>

      <section className="settings-group">
        <p className="settings-label">Dữ liệu và thông tin</p>
        <div className="card settings-links">
          <button type="button" onClick={() => window.location.assign("/privacy.html")}>
            <span className="settings-icon"><FileText size={19} /></span>
            <span>Chính sách quyền riêng tư</span>
            <ChevronRight size={18} />
          </button>
          <button type="button" onClick={() => window.location.assign("/eula.html")}>
            <span className="settings-icon"><Info size={19} /></span>
            <span>Điều khoản sử dụng</span>
            <ChevronRight size={18} />
          </button>
          <button
            type="button"
            className="danger-row"
            onClick={() => {
              if (window.confirm("Xóa toàn bộ lịch sử bấm giờ trên thiết bị này?")) onClearHistory();
            }}
          >
            <span className="settings-icon red"><Trash2 size={19} /></span>
            <span>Xóa toàn bộ lịch sử</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      <div className="about-card">
        <div className="mini-logo">3×3</div>
        <div>
          <strong>Cubic Flow</strong>
          <small>Phiên bản 1.0.0 · Hoạt động ngoại tuyến</small>
        </div>
      </div>
    </main>
  );
}
