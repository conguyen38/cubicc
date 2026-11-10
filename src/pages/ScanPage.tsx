import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  Grid3X3,
  Hand,
  Lightbulb,
  LoaderCircle,
  RotateCcw,
  ScanLine,
  Sparkles,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { CameraCapture } from "../components/CameraCapture";
import { Cube3D } from "../components/Cube3D";
import { ColorPicker, StickerGrid } from "../components/StickerGrid";
import {
  completedCopy,
  createEmptyFaces,
  faceProgress,
  isFaceComplete,
} from "../lib/cube";
import { FACES, FACE_INFO } from "../lib/constants";
import { solveCube, translateSolverError } from "../lib/solverClient";
import type { AppTab, ColorKey, CompletedFaceGrid, PartialFaceGrid, SolutionResult } from "../types";

type ScanView = "scan" | "review" | "solution" | "finished";
type InputMode = "camera" | "manual";

const FACE_ACTION: Record<string, string> = {
  U: "mặt trên",
  D: "mặt dưới",
  R: "mặt phải",
  L: "mặt trái",
  F: "mặt trước",
  B: "mặt sau",
};

function moveInstruction(move: string): string {
  const face = move[0] ?? "";
  const amount = move.endsWith("2") ? "nửa vòng" : move.endsWith("'") ? "ngược chiều kim đồng hồ" : "theo chiều kim đồng hồ";
  return `Xoay ${FACE_ACTION[face] ?? "khối"} ${amount}.`;
}

export function ScanPage({
  onNavigate,
  showToast,
}: {
  onNavigate: (tab: AppTab) => void;
  showToast: (text: string, type?: "success" | "info") => void;
}) {
  const [view, setView] = useState<ScanView>("scan");
  const [mode, setMode] = useState<InputMode>("camera");
  const [faceIndex, setFaceIndex] = useState(0);
  const [faces, setFaces] = useState<PartialFaceGrid>(createEmptyFaces);
  const [capturedColors, setCapturedColors] = useState<ColorKey[] | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorKey>("white");
  const [solving, setSolving] = useState(false);
  const [error, setError] = useState("");
  const [solution, setSolution] = useState<SolutionResult | null>(null);
  const [stepIndex, setStepIndex] = useState(-1);

  const currentFace = FACES[faceIndex]!;
  const currentInfo = FACE_INFO[currentFace];
  const currentManual = faces[currentFace];

  const completeCount = useMemo(
    () => FACES.filter((face) => isFaceComplete(faces[face])).length,
    [faces],
  );
  const progress = faceProgress(faces);

  const updateCell = <T,>(grid: T[], index: number, color: T): T[] => {
    if (index === 4) return grid;
    const next = [...grid];
    next[index] = color;
    return next;
  };

  const selectFace = (index: number) => {
    setFaceIndex(index);
    const face = FACES[index]!;
    setSelectedColor(FACE_INFO[face].color);
    setError("");
  };

  const solve = useCallback(
    async (grid: CompletedFaceGrid) => {
      setSolving(true);
      setError("");
      try {
        const result = await solveCube(grid);
        setSolution(result);
        setStepIndex(-1);
        setView(result.moves.length ? "solution" : "finished");
      } catch (caught) {
        setError(translateSolverError(caught instanceof Error ? caught.message : "Invalid cube."));
      } finally {
        setSolving(false);
      }
    },
    [],
  );

  const acceptCapture = async () => {
    if (!capturedColors) return;
    const center = FACE_INFO[currentFace].color;
    const normalized = capturedColors.map((color, index) => (index === 4 ? center : color));
    const next = { ...faces, [currentFace]: normalized };
    setFaces(next);
    setCapturedColors(null);

    if (faceIndex < FACES.length - 1) {
      const nextIndex = faceIndex + 1;
      setFaceIndex(nextIndex);
      setSelectedColor(FACE_INFO[FACES[nextIndex]!].color);
      showToast(`Đã lưu ${FACE_INFO[currentFace].title}.`, "success");
      return;
    }

    const completed = completedCopy(next);
    if (completed) await solve(completed);
  };

  const solveManual = async () => {
    const incompleteIndex = FACES.findIndex((face) => !isFaceComplete(faces[face]));
    if (incompleteIndex >= 0) {
      selectFace(incompleteIndex);
      setMode("manual");
      showToast(`Hãy nhập đủ 9 màu ở ${FACE_INFO[FACES[incompleteIndex]!].title}.`);
      return;
    }
    const completed = completedCopy(faces);
    if (completed) await solve(completed);
  };

  const reset = () => {
    setFaces(createEmptyFaces());
    setFaceIndex(0);
    setCapturedColors(null);
    setSolution(null);
    setStepIndex(-1);
    setError("");
    setView("scan");
    setMode("camera");
    setSelectedColor("white");
  };

  if (solving) {
    return (
      <main className="page centered-page">
        <div className="solving-orb"><LoaderCircle size={34} /></div>
        <p className="eyebrow">ĐANG PHÂN TÍCH</p>
        <h1>Đang tìm lời giải ngắn nhất…</h1>
        <p className="center-copy">Bộ giải đang kiểm tra toàn bộ 54 ô màu. Quá trình này chỉ diễn ra trên thiết bị.</p>
        <div className="solving-steps"><span /> <span /> <span /></div>
      </main>
    );
  }

  if (view === "review" && capturedColors && !error) {
    return (
      <main className="page scan-page">
        <header className="flow-header">
          <button type="button" className="icon-button" onClick={() => setCapturedColors(null)}><ChevronLeft size={20} /></button>
          <div><small>KIỂM TRA KẾT QUẢ</small><h1>{currentInfo.title}</h1></div>
          <span className="face-pill">{faceIndex + 1}/6</span>
        </header>

        <section className="review-layout">
          <div className="review-visual">
            <div className="review-glow" />
            <StickerGrid
              colors={capturedColors}
              editable
              onCell={(index) => setCapturedColors(updateCell(capturedColors, index, selectedColor))}
            />
          </div>
          <p className="review-hint">Chạm vào ô nhận diện sai, sau đó chọn màu đúng.</p>
          <ColorPicker value={selectedColor} onChange={setSelectedColor} />
        </section>

        <div className="tip-box">
          <Lightbulb size={20} />
          <p><strong>Mẹo nhỏ</strong> Tâm khối luôn cố định theo hướng bạn giữ. Kiểm tra các viên cạnh trước khi tiếp tục.</p>
        </div>

        <div className="flow-actions">
          <button
            type="button"
            className="button button-secondary"
            onClick={() => {
              setCapturedColors(null);
              setError("");
            }}
          >
            <RotateCcw size={18} /> Chụp lại
          </button>
          <button type="button" className="button button-primary" onClick={acceptCapture}>
            <Check size={18} /> Đúng rồi, tiếp tục
          </button>
        </div>
      </main>
    );
  }

  if (view === "solution" && solution) {
    const currentSnapshot =
      stepIndex < 0 ? solution.start : solution.steps[stepIndex]?.faces ?? solution.start;
    const currentMove = solution.moves[stepIndex];
    const atLast = stepIndex === solution.moves.length - 1;

    return (
      <main className="page solution-page">
        <header className="flow-header">
          <button type="button" className="icon-button" onClick={() => setView("scan")}><ChevronLeft size={20} /></button>
          <div><small>HƯỚNG DẪN TỪNG BƯỚC</small><h1>Lời giải của bạn</h1></div>
          <button
            type="button"
            className="icon-button"
            aria-label="Sao chép lời giải"
            onClick={async () => {
              await navigator.clipboard.writeText(solution.moves.join(" "));
              showToast("Đã sao chép chuỗi lời giải.", "success");
            }}
          >
            <Clipboard size={19} />
          </button>
        </header>

        <div className="solution-progress">
          <span style={{ width: `${Math.max(4, ((stepIndex + 1) / solution.moves.length) * 100)}%` }} />
        </div>

        <section className="solution-visual">
          <div className="solution-orbit" />
          <Cube3D faces={currentSnapshot} size={152} spinning={stepIndex < 0} />
          <div className="move-bubble">
            <small>BƯỚC {Math.max(1, stepIndex + 1)} / {solution.moves.length}</small>
            <strong>{currentMove ?? "Sẵn sàng"}</strong>
          </div>
        </section>

        <div className="instruction-card card">
          <span className="instruction-number">{String(Math.max(1, stepIndex + 1)).padStart(2, "0")}</span>
          <div>
            <h2>{currentMove ? moveInstruction(currentMove) : "Quan sát khối đã quét"}</h2>
            <p>{currentMove ? "Giữ khối cố định và xoay đúng lớp được chỉ dẫn." : "Nhấn “Bắt đầu” để xem lần lượt 20 bước giải."}</p>
          </div>
        </div>

        <div className="algorithm-strip" aria-label="Danh sách các nước xoay">
          {solution.moves.map((move, index) => (
            <button
              type="button"
              className={`${index === stepIndex ? "is-current" : ""} ${index < stepIndex ? "is-done" : ""}`}
              onClick={() => setStepIndex(index)}
              key={`${move}-${index}`}
            >
              {move}
            </button>
          ))}
        </div>

        <div className="flow-actions solution-actions">
          <button
            type="button"
            className="button button-secondary"
            disabled={stepIndex < 0}
            onClick={() => setStepIndex((value) => Math.max(-1, value - 1))}
          >
            <ChevronLeft size={18} /> Trước
          </button>
          <button
            type="button"
            className="button button-primary"
            onClick={() => {
              if (atLast) setView("finished");
              else setStepIndex((value) => value + 1);
            }}
          >
            {atLast ? "Hoàn tất" : stepIndex < 0 ? "Bắt đầu" : "Bước tiếp theo"} <ArrowRight size={18} />
          </button>
        </div>
      </main>
    );
  }

  if (view === "finished") {
    return (
      <main className="page centered-page finished-page">
        <div className="success-ring"><CheckCircle2 size={42} /></div>
        <p className="eyebrow">HOÀN THÀNH</p>
        <h1>Khối đã được giải!</h1>
        <p className="center-copy">Tuyệt vời. Bạn có thể xem lại từng bước hoặc quét một khối mới.</p>
        <Cube3D size={108} spinning />
        <div className="finish-actions">
          <button type="button" className="button button-secondary" onClick={() => { setView("solution"); setStepIndex(-1); }}>
            <RotateCcw size={18} /> Xem lại
          </button>
          <button type="button" className="button button-primary" onClick={reset}>Quét khối mới</button>
        </div>
        <button type="button" className="text-button" onClick={() => onNavigate("timer")}>Luyện thêm với bấm giờ</button>
      </main>
    );
  }

  return (
    <main className="page scan-page">
      <header className="simple-header">
        <div>
          <p className="eyebrow">CUBE SCANNER</p>
          <h1>Quét khối 3×3</h1>
        </div>
        <span className="progress-badge">{completeCount}/6 mặt</span>
      </header>

      <div className="mode-switch" role="tablist" aria-label="Cách nhập màu">
        <button type="button" className={mode === "camera" ? "is-active" : ""} onClick={() => setMode("camera")}>
          <Camera size={17} /> Camera
        </button>
        <button type="button" className={mode === "manual" ? "is-active" : ""} onClick={() => setMode("manual")}>
          <Hand size={17} /> Nhập tay
        </button>
      </div>

      <div className="face-progress">
        <div className="progress-label">
          <span>Tiến độ nhập màu</span>
          <strong>{progress}%</strong>
        </div>
        <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
        <div className="face-tabs">
          {FACES.map((face, index) => (
            <button
              type="button"
              key={face}
              className={`${faceIndex === index ? "is-active" : ""} ${isFaceComplete(faces[face]) ? "is-complete" : ""}`}
              onClick={() => selectFace(index)}
            >
              {isFaceComplete(faces[face]) ? <Check size={13} /> : face}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="error-banner" role="alert">
          <span><Grid3X3 size={19} /></span>
          <div><strong>Chưa thể giải khối</strong><p>{error}</p></div>
          <button type="button" onClick={() => setError("")}>Đóng</button>
        </div>
      )}

      {mode === "camera" ? (
        <>
          <section className="face-instruction">
            <span className="face-number">{faceIndex + 1}</span>
            <div>
              <strong>{currentInfo.title}</strong>
              <p>{currentInfo.hint}</p>
            </div>
          </section>
          <CameraCapture
            onCapture={(colors) => {
              setCapturedColors(colors);
              setSelectedColor("white");
              setError("");
              setView("review");
            }}
          />
        </>
      ) : (
        <section className="manual-editor">
          <div className="manual-intro">
            <span className="instruction-icon"><Sparkles size={20} /></span>
            <div>
              <strong>Chọn màu cho từng ô</strong>
              <p>{currentInfo.hint}</p>
            </div>
          </div>
          <div className="manual-grid-wrap">
            <span className="grid-label top">{currentFace}</span>
            <StickerGrid
              colors={currentManual}
              editable
              onCell={(index) =>
                setFaces((value) => ({
                  ...value,
                  [currentFace]: updateCell(value[currentFace], index, selectedColor),
                }))
              }
            />
          </div>
          <ColorPicker value={selectedColor} onChange={setSelectedColor} />
          <p className="manual-hint">Tâm khối được khóa theo hướng mặt. Chỉ cần nhập 8 ô xung quanh.</p>
        </section>
      )}

      <div className="scanner-nav">
        <button
          type="button"
          className="button button-secondary"
          disabled={faceIndex === 0}
          onClick={() => selectFace(faceIndex - 1)}
        >
          <ArrowLeft size={18} /> Mặt trước
        </button>
        <button
          type="button"
          className="button button-primary"
          onClick={() => {
            if (mode === "camera") {
              if (faceIndex < FACES.length - 1) selectFace(faceIndex + 1);
              else void solveManual();
            } else if (faceIndex < FACES.length - 1) {
              selectFace(faceIndex + 1);
            } else {
              void solveManual();
            }
          }}
        >
          {faceIndex < FACES.length - 1 ? "Mặt tiếp theo" : "Giải khối"} <ArrowRight size={18} />
        </button>
      </div>

      <div className="scan-tips card">
        <span className="tip-icon"><Lightbulb size={20} /></span>
        <div>
          <strong>Để nhận diện tốt nhất</strong>
          <p>Dùng ánh sáng đều, giữ khối phẳng và để 9 ô màu lấp đầy khung vuông.</p>
        </div>
      </div>
    </main>
  );
}
