import { ArrowRight, Dices, RotateCcw, TimerReset } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SectionHeader } from "../components/SectionHeader";
import { average, formatTime, generateScramble } from "../lib/scramble";
import type { AppSettings, SolveRecord } from "../types";

type TimerMode = "idle" | "holding" | "ready" | "running" | "stopped";

function vibrate(settings: AppSettings, pattern: number | number[]) {
  if (settings.haptics && "vibrate" in navigator) navigator.vibrate(pattern);
}

export function TimerPage({
  history,
  settings,
  onRecord,
  showToast,
}: {
  history: SolveRecord[];
  settings: AppSettings;
  onRecord: (record: SolveRecord) => void;
  showToast: (text: string, type?: "success" | "info") => void;
}) {
  const [mode, setModeState] = useState<TimerMode>("idle");
  const modeRef = useRef<TimerMode>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [scramble, setScramble] = useState(() => generateScramble());
  const startRef = useRef(0);
  const holdTimerRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  const setMode = useCallback((next: TimerMode) => {
    modeRef.current = next;
    setModeState(next);
  }, []);

  const clearHold = useCallback(() => {
    if (holdTimerRef.current) window.clearTimeout(holdTimerRef.current);
    holdTimerRef.current = null;
  }, []);

  const newScramble = useCallback(() => {
    setScramble(generateScramble());
    showToast("Đã tạo chuỗi xáo mới.", "success");
  }, [showToast]);

  const startTimer = useCallback(() => {
    clearHold();
    startRef.current = performance.now();
    setElapsed(0);
    setMode("running");
    vibrate(settings, 30);
  }, [clearHold, setMode, settings]);

  const stopTimer = useCallback(() => {
    if (modeRef.current !== "running") return;
    const duration = performance.now() - startRef.current;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    setElapsed(duration);
    setMode("stopped");
    vibrate(settings, [35, 30, 70]);
    onRecord({
      id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      ms: Math.round(duration),
      scramble,
      createdAt: new Date().toISOString(),
    });
    showToast("Đã lưu lượt giải.", "success");
  }, [onRecord, scramble, setMode, settings, showToast]);

  const pressDown = useCallback(() => {
    if (modeRef.current === "running") {
      stopTimer();
      return;
    }
    if (modeRef.current === "holding" || modeRef.current === "ready") return;
    setElapsed(0);
    setMode("holding");
    clearHold();
    holdTimerRef.current = window.setTimeout(() => {
      setMode("ready");
      vibrate(settings, 20);
    }, settings.holdMs);
  }, [clearHold, setMode, settings, stopTimer]);

  const pressUp = useCallback(() => {
    clearHold();
    if (modeRef.current === "ready") startTimer();
    else if (modeRef.current === "holding") setMode("idle");
  }, [clearHold, setMode, startTimer]);

  const reset = () => {
    setElapsed(0);
    setMode("idle");
    setScramble(generateScramble());
  };

  useEffect(() => {
    const update = () => {
      setElapsed(performance.now() - startRef.current);
      frameRef.current = requestAnimationFrame(update);
    };
    if (mode === "running") frameRef.current = requestAnimationFrame(update);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [mode]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space" || event.repeat) return;
      event.preventDefault();
      pressDown();
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code !== "Space") return;
      event.preventDefault();
      pressUp();
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [pressDown, pressUp]);

  useEffect(
    () => () => {
      clearHold();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    },
    [clearHold],
  );

  const timerLabel = mode === "stopped" ? "Lượt vừa xong" : mode === "running" ? "Đang tính giờ" : "Sẵn sàng";
  const avg5 = average(history, 5);

  return (
    <main className={`page timer-page ${mode === "running" ? "timer-running" : ""} ${mode === "ready" ? "timer-ready" : ""}`}>
      <header className="simple-header">
        <div>
          <p className="eyebrow">SPEED TIMER</p>
          <h1>Bấm giờ 3×3</h1>
        </div>
        <button className="icon-button" type="button" onClick={reset} aria-label="Đặt lại bấm giờ">
          <RotateCcw size={19} />
        </button>
      </header>

      <section className="scramble-card card">
        <div className="scramble-head">
          <span>Chuỗi xáo trộn</span>
          <button type="button" onClick={newScramble}>
            <Dices size={16} /> Đổi
          </button>
        </div>
        <p>{scramble}</p>
      </section>

      <button
        type="button"
        className={`timer-pad ${mode}`}
        onPointerDown={pressDown}
        onPointerUp={pressUp}
        onPointerCancel={pressUp}
        onContextMenu={(event) => event.preventDefault()}
        aria-label={mode === "running" ? "Dừng bấm giờ" : "Giữ để bắt đầu"}
      >
        <span className="timer-state">{timerLabel}</span>
        <strong>{formatTime(elapsed)}</strong>
        <span className="timer-instruction">
          {mode === "running"
            ? "Chạm để dừng"
            : mode === "holding"
              ? "Giữ thêm một chút…"
              : mode === "ready"
                ? "Thả để bắt đầu"
                : "Giữ và thả để bắt đầu"}
        </span>
      </button>

      <SectionHeader title="Thống kê nhanh" />
      <div className="timer-stats">
        <div className="card compact-stat">
          <small>TB 5 lượt</small>
          <strong>{avg5 ? formatTime(avg5) : "--.--"}</strong>
        </div>
        <div className="card compact-stat">
          <small>Tổng lượt</small>
          <strong>{history.length}</strong>
        </div>
      </div>

      <div className="keyboard-hint">
        <TimerReset size={16} />
        <span>Trên máy tính, giữ phím <kbd>Space</kbd> rồi thả để bắt đầu.</span>
      </div>

      <button className="button button-secondary full-width" type="button" onClick={newScramble}>
        Tạo chuỗi xáo mới <ArrowRight size={18} />
      </button>
    </main>
  );
}
