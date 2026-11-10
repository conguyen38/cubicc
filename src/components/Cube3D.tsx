import type { CSSProperties } from "react";
import type { ColorKey, CompletedFaceGrid, FaceKey } from "../types";
import { COLOR_META, FACES, FACE_COLORS } from "../lib/constants";
import { solvedFaces } from "../lib/cube";

interface Cube3DProps {
  faces?: CompletedFaceGrid;
  size?: number;
  spinning?: boolean;
  compact?: boolean;
  className?: string;
}

const FACE_CLASS: Record<FaceKey, string> = {
  U: "cube-top",
  D: "cube-bottom",
  R: "cube-right",
  L: "cube-left",
  F: "cube-front",
  B: "cube-back",
};

function stickerStyle(color: ColorKey | null): CSSProperties {
  return { "--sticker": color ? COLOR_META[color].hex : "#d8dbe9" } as CSSProperties;
}

export function Cube3D({
  faces = solvedFaces(),
  size = 132,
  spinning = false,
  compact = false,
  className = "",
}: Cube3DProps) {
  return (
    <div
      className={`cube-stage ${spinning ? "is-spinning" : ""} ${className}`}
      style={{ "--cube-size": `${size}px` } as CSSProperties}
      aria-label="Mô hình khối Rubik 3D"
      role="img"
    >
      <div className={`cube-object ${compact ? "is-compact" : ""}`}>
        {FACES.map((face) => (
          <div className={`cube-face ${FACE_CLASS[face]}`} key={face}>
            {Array.from({ length: 9 }, (_, index) => (
              <span
                className={`cube-sticker ${index === 4 ? "is-center" : ""}`}
                style={stickerStyle(faces[face]?.[index] ?? FACE_COLORS[face])}
                key={`${face}-${index}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
