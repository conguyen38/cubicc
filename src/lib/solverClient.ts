import type { CompletedFaceGrid, SolutionResult } from "../types";

interface WorkerResponse {
  id: number;
  result?: SolutionResult;
  error?: string;
}

let worker: Worker | null = null;
let requestId = 0;
const pending = new Map<
  number,
  { resolve: (value: SolutionResult) => void; reject: (reason: Error) => void }
>();

function getWorker(): Worker {
  if (worker) return worker;
  worker = new Worker(new URL("../workers/solver.worker.ts", import.meta.url), { type: "module" });
  worker.addEventListener("message", (event: MessageEvent<WorkerResponse>) => {
    const request = pending.get(event.data.id);
    if (!request) return;
    pending.delete(event.data.id);
    if (event.data.error) request.reject(new Error(event.data.error));
    else if (event.data.result) request.resolve(event.data.result);
    else request.reject(new Error("Bộ giải không trả về kết quả."));
  });
  worker.addEventListener("error", () => {
    for (const request of pending.values()) {
      request.reject(new Error("Không thể khởi động bộ giải trên thiết bị này."));
    }
    pending.clear();
    worker?.terminate();
    worker = null;
  });
  return worker;
}

export function solveCube(faces: CompletedFaceGrid): Promise<SolutionResult> {
  const id = ++requestId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    getWorker().postMessage({ id, faces });
  });
}

export function translateSolverError(message: string): string {
  if (/twisted|twist/i.test(message)) {
    return "Một góc đang bị xoay sai. Hãy kiểm tra ba ô màu ở các góc rồi thử lại.";
  }
  if (/flipped|flip/i.test(message)) {
    return "Một cạnh đang bị lật sai. Hãy kiểm tra hai ô màu ở các cạnh rồi thử lại.";
  }
  if (/parity|traded|swap/i.test(message)) {
    return "Hai mảnh đang đổi chỗ. Một hoặc nhiều màu có thể đã được nhập nhầm.";
  }
  if (/Unknown piece|Duplicate piece|sticker/i.test(message)) {
    return "Các màu chưa tạo thành khối Rubik hợp lệ. Hãy kiểm tra lại từng mặt.";
  }
  return "Chưa thể giải khối này. Hãy xem lại màu ở các cạnh và góc, sau đó thử lại.";
}
