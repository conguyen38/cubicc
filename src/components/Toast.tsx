import { Check, Info, X } from "lucide-react";

export interface ToastMessage {
  id: number;
  text: string;
  type?: "success" | "info";
}

export function Toast({ toast, onClose }: { toast: ToastMessage | null; onClose: () => void }) {
  if (!toast) return null;
  return (
    <div className={`toast ${toast.type ?? "info"}`} role="status">
      <span className="toast-icon">
        {toast.type === "success" ? <Check size={16} /> : <Info size={16} />}
      </span>
      <span>{toast.text}</span>
      <button type="button" onClick={onClose} aria-label="Đóng thông báo">
        <X size={16} />
      </button>
    </div>
  );
}
