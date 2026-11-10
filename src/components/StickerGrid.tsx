import type { CSSProperties } from "react";
import type { ColorKey, StickerGrid as StickerGridType } from "../types";
import { COLOR_META } from "../lib/constants";

export function StickerGrid({
  colors,
  onCell,
  editable = false,
}: {
  colors: StickerGridType;
  onCell?: (index: number) => void;
  editable?: boolean;
}) {
  return (
    <div className={`sticker-grid ${editable ? "is-editable" : ""}`}>
      {colors.map((color, index) => (
        <button
          type="button"
          key={index}
          className={`sticker ${index === 4 ? "is-center" : ""}`}
          style={{ background: color ? COLOR_META[color].hex : "var(--surface-3)" }}
          onClick={() => onCell?.(index)}
          disabled={!editable || index === 4}
          aria-label={`Ô ${index + 1}${color ? `, ${COLOR_META[color].label}` : ", chưa chọn màu"}`}
        />
      ))}
    </div>
  );
}

export function ColorPicker({
  value,
  onChange,
}: {
  value: ColorKey;
  onChange: (color: ColorKey) => void;
}) {
  return (
    <div className="color-picker" aria-label="Chọn màu">
      {(Object.entries(COLOR_META) as [ColorKey, (typeof COLOR_META)[ColorKey]][]).map(([color, meta]) => (
        <button
          key={color}
          type="button"
          className={value === color ? "is-selected" : ""}
          style={{ "--swatch": meta.hex } as CSSProperties}
          onClick={() => onChange(color)}
          title={meta.label}
          aria-label={meta.label}
          aria-pressed={value === color}
        />
      ))}
    </div>
  );
}
