import { Camera, ImagePlus, RefreshCw, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { classifyImageGrid } from "../lib/colors";
import type { ColorKey } from "../types";

export function CameraCapture({ onCapture }: { onCapture: (colors: ColorKey[]) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "denied" | "unsupported">("loading");
  const [restartKey, setRestartKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("unsupported");
      return;
    }
    setStatus("loading");
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();
        }
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("denied");
      });

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [restartKey]);

  const classifyFile = useCallback(
    (file: File) => {
      const url = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        try {
          onCapture(classifyImageGrid(image, image.naturalWidth, image.naturalHeight));
        } finally {
          URL.revokeObjectURL(url);
        }
      };
      image.onerror = () => URL.revokeObjectURL(url);
      image.src = url;
    },
    [onCapture],
  );

  const capture = () => {
    const video = videoRef.current;
    if (!video || status !== "ready" || !video.videoWidth) return;
    onCapture(classifyImageGrid(video, video.videoWidth, video.videoHeight));
  };

  return (
    <div className="camera-wrap">
      <div className="camera-viewport">
        {status === "ready" ? (
          <>
            <video ref={videoRef} playsInline muted aria-label="Camera quét khối Rubik" />
            <div className="camera-grid" aria-hidden="true">
              {Array.from({ length: 9 }, (_, index) => <span key={index} />)}
            </div>
            <div className="camera-corners" aria-hidden="true" />
          </>
        ) : (
          <div className="camera-placeholder">
            <span className="camera-placeholder-icon"><Camera size={30} /></span>
            <strong>{status === "loading" ? "Đang mở camera…" : "Camera chưa sẵn sàng"}</strong>
            <p>
              {status === "denied"
                ? "Hãy cấp quyền camera hoặc chọn ảnh có sẵn."
                : status === "unsupported"
                  ? "Thiết bị này không hỗ trợ camera trực tiếp."
                  : "Giữ khối trong khung để nhận diện chính xác."}
            </p>
            <button type="button" className="button button-secondary small" onClick={() => setRestartKey((value) => value + 1)}>
              <RefreshCw size={16} /> Thử lại camera
            </button>
          </div>
        )}
      </div>

      <div className="camera-actions">
        <button type="button" className="camera-shutter" onClick={capture} disabled={status !== "ready"} aria-label="Chụp mặt khối">
          <span><Camera size={23} /></span>
        </button>
        <button type="button" className="photo-button" onClick={() => fileRef.current?.click()}>
          <ImagePlus size={18} /> Chọn ảnh
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) classifyFile(file);
            event.target.value = "";
          }}
        />
      </div>

      <p className="on-device-note"><ShieldCheck size={15} /> Ảnh được xử lý trên thiết bị và không được tải lên.</p>
    </div>
  );
}
