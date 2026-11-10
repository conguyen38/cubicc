import { useCallback, useEffect, useRef, useState } from "react";
import type { ToastMessage } from "../components/Toast";

export function useToast() {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const showToast = useCallback((text: string, type: ToastMessage["type"] = "info") => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setToast({ id: Date.now(), text, type });
    timeoutRef.current = window.setTimeout(() => setToast(null), 2800);
  }, []);

  useEffect(
    () => () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    },
    [],
  );

  return { toast, showToast, closeToast: () => setToast(null) };
}
