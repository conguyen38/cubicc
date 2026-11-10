import { Award, BarChart3, Clock3, Trash2, TrendingUp } from "lucide-react";
import { useState } from "react";
import { SectionHeader } from "../components/SectionHeader";
import { average, bestTime, formatRelativeDate, formatTime } from "../lib/scramble";
import type { SolveRecord } from "../types";

export function HistoryPage({
  history,
  onDelete,
}: {
  history: SolveRecord[];
  onDelete: (id: string) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const best = bestTime(history);
  const avg5 = average(history, 5);
  const avg12 = average(history, 12);

  return (
    <main className="page">
      <header className="simple-header">
        <div>
          <p className="eyebrow">TIẾN BỘ CỦA BẠN</p>
          <h1>Lịch sử</h1>
        </div>
        <span className="header-count">{history.length} lượt</span>
      </header>

      <section className="analytics-card">
        <div className="analytics-title">
          <span><BarChart3 size={18} /> Tổng quan</span>
          <span className="analytics-tag">3×3</span>
        </div>
        <div className="analytics-grid">
          <div>
            <small>Kỷ lục</small>
            <strong>{best ? formatTime(best) : "--.--"}</strong>
          </div>
          <div>
            <small>TB 5</small>
            <strong>{avg5 ? formatTime(avg5) : "--.--"}</strong>
          </div>
          <div>
            <small>TB 12</small>
            <strong>{avg12 ? formatTime(avg12) : "--.--"}</strong>
          </div>
        </div>
        <div className="spark-bars" aria-hidden="true">
          {[36, 52, 44, 63, 55, 79, 68, 86, 74, 92, 71, 88].map((height, index) => (
            <span key={index} style={{ height: `${height}%` }} />
          ))}
        </div>
      </section>

      <SectionHeader title="Tất cả lượt giải" />
      {history.length ? (
        <div className="history-list">
          {history.map((record, index) => (
            <article className={`history-item card ${openId === record.id ? "is-open" : ""}`} key={record.id}>
              <button type="button" className="history-main" onClick={() => setOpenId(openId === record.id ? null : record.id)}>
                <span className="history-number">#{String(history.length - index).padStart(2, "0")}</span>
                <span className="history-time">
                  <strong>{formatTime(record.ms)}</strong>
                  <small>{formatRelativeDate(record.createdAt)}</small>
                </span>
                {record.ms === best && <span className="record-pill"><Award size={13} /> PB</span>}
                <TrendingUp size={17} className="history-chevron" />
              </button>
              {openId === record.id && (
                <div className="history-detail">
                  <div>
                    <span>Chuỗi xáo</span>
                    <p>{record.scramble}</p>
                  </div>
                  <button type="button" className="danger-text" onClick={() => onDelete(record.id)}>
                    <Trash2 size={16} /> Xóa lượt này
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="large-empty card">
          <span><Clock3 size={30} /></span>
          <h2>Chưa có lượt giải</h2>
          <p>Thời gian của bạn sẽ xuất hiện ở đây sau lượt bấm giờ đầu tiên.</p>
        </div>
      )}
    </main>
  );
}
