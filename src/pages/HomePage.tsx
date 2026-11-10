import {
  ArrowRight,
  Clock3,
  Grid3X3,
  ScanLine,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Cube3D } from "../components/Cube3D";
import { Logo } from "../components/Logo";
import { SectionHeader } from "../components/SectionHeader";
import { bestTime, formatRelativeDate, formatTime } from "../lib/scramble";
import type { AppTab, SolveRecord } from "../types";

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 11) return "Chào buổi sáng";
  if (hour < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}

export function HomePage({
  history,
  onNavigate,
}: {
  history: SolveRecord[];
  onNavigate: (tab: AppTab) => void;
}) {
  const best = bestTime(history);

  return (
    <main className="page home-page">
      <header className="app-header">
        <Logo />
        <button className="avatar-button" type="button" onClick={() => onNavigate("history")} aria-label="Mở thống kê">
          <Trophy size={18} />
        </button>
      </header>

      <section className="welcome-copy">
        <p className="eyebrow">{greeting()}</p>
        <h1>Sẵn sàng cho<br />lượt xoay mới?</h1>
      </section>

      <section className="hero-card">
        <div className="hero-glow" />
        <div className="hero-content">
          <span className="hero-badge"><Sparkles size={14} /> Bộ giải thông minh</span>
          <h2>Đưa khối về<br />trạng thái hoàn chỉnh.</h2>
          <p>Quét sáu mặt, nhận hướng dẫn rõ ràng cho từng bước.</p>
          <button className="button button-light" type="button" onClick={() => onNavigate("scan")}>
            Quét khối ngay <ArrowRight size={18} />
          </button>
        </div>
        <Cube3D size={116} spinning className="hero-cube" />
      </section>

      <section className="quick-grid" aria-label="Thao tác nhanh">
        <button className="quick-card quick-card-blue" type="button" onClick={() => onNavigate("scan")}>
          <span className="quick-icon"><ScanLine size={23} /></span>
          <span>
            <strong>Nhập màu</strong>
            <small>Tự chỉnh 6 mặt</small>
          </span>
        </button>
        <button className="quick-card quick-card-lilac" type="button" onClick={() => onNavigate("timer")}>
          <span className="quick-icon"><Clock3 size={23} /></span>
          <span>
            <strong>Bấm giờ</strong>
            <small>Đua tốc độ</small>
          </span>
        </button>
      </section>

      <section className="home-stats card">
        <div className="stat">
          <span className="stat-icon"><Grid3X3 size={18} /></span>
          <div>
            <strong>{history.length}</strong>
            <small>Lượt đã giải</small>
          </div>
        </div>
        <span className="stat-divider" />
        <div className="stat">
          <span className="stat-icon warm"><Trophy size={18} /></span>
          <div>
            <strong>{best ? formatTime(best) : "--:--"}</strong>
            <small>Kỷ lục cá nhân</small>
          </div>
        </div>
      </section>

      <SectionHeader
        title="Lượt gần đây"
        action={
          history.length > 0 ? (
            <button className="text-button" type="button" onClick={() => onNavigate("history")}>
              Xem tất cả
            </button>
          ) : undefined
        }
      />

      {history.length ? (
        <div className="recent-list">
          {history.slice(0, 3).map((record, index) => (
            <div className="recent-row card" key={record.id}>
              <span className="recent-rank">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>{formatTime(record.ms)}</strong>
                <small>{formatRelativeDate(record.createdAt)} · 3×3</small>
              </div>
              <span className="recent-scramble">{record.scramble.split(" ").slice(0, 3).join(" ")}…</span>
            </div>
          ))}
        </div>
      ) : (
        <button className="empty-card card" type="button" onClick={() => onNavigate("timer")}>
          <span className="empty-icon"><Clock3 size={24} /></span>
          <span>
            <strong>Chưa có lượt bấm giờ</strong>
            <small>Hoàn thành lượt đầu tiên để bắt đầu theo dõi tiến bộ.</small>
          </span>
          <ArrowRight size={18} />
        </button>
      )}

      <p className="privacy-note">Mọi thao tác quét và giải đều chạy trên thiết bị của bạn.</p>
    </main>
  );
}
