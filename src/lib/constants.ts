import type { ColorKey, FaceKey } from "../types";

export const FACES: FaceKey[] = ["U", "R", "F", "D", "L", "B"];
export const COLORS: ColorKey[] = ["white", "yellow", "red", "orange", "green", "blue"];

export const FACE_COLORS: Record<FaceKey, ColorKey> = {
  U: "white",
  R: "red",
  F: "green",
  D: "yellow",
  L: "orange",
  B: "blue",
};

export const FACE_INFO: Record<FaceKey, { title: string; hint: string; color: ColorKey }> = {
  U: { title: "Mặt trên", hint: "Giữ mặt xanh lá hướng về phía bạn", color: "white" },
  R: { title: "Mặt phải", hint: "Đặt mặt trắng lên trên, xoay khối sang phải", color: "red" },
  F: { title: "Mặt trước", hint: "Đặt mặt trắng lên trên, nhìn thẳng vào khối", color: "green" },
  D: { title: "Mặt dưới", hint: "Lật khối lên, đặt mặt xanh lá lên trên", color: "yellow" },
  L: { title: "Mặt trái", hint: "Đặt mặt trắng lên trên, xoay khối sang trái", color: "orange" },
  B: { title: "Mặt sau", hint: "Đặt mặt trắng lên trên, quay khối nửa vòng", color: "blue" },
};

export const COLOR_META: Record<ColorKey, { hex: string; label: string }> = {
  white: { hex: "#f7f6ef", label: "Trắng" },
  yellow: { hex: "#f4d448", label: "Vàng" },
  red: { hex: "#e34c55", label: "Đỏ" },
  orange: { hex: "#f28a35", label: "Cam" },
  green: { hex: "#26ad69", label: "Xanh lá" },
  blue: { hex: "#347ce5", label: "Xanh dương" },
};
