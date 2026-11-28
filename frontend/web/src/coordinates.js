import { clamp } from "./filters.js";

export function containRect(width, height, videoWidth, videoHeight) {
  const scale = Math.min(width / videoWidth, height / videoHeight);
  const w = videoWidth * scale,
    h = videoHeight * scale;
  return { x: (width - w) / 2, y: (height - h) / 2, width: w, height: h };
}
// Reflect only when the model-input orientation differs from the chosen display.
export function displayPoint(p, mirror = true) {
  return { x: mirror ? 1 - p.x : p.x, y: p.y, z: p.z || 0 };
}
// Landmarks are mapped over the entire application, including the inventory.
// Skeleton uses containRect separately: no stretching/cropping of camera pixels.
export function pointerPoint(p, width, height, margin = 0.035) {
  return {
    x: clamp((p.x - margin) / (1 - 2 * margin), 0, 1) * width,
    y: clamp((p.y - margin) / (1 - 2 * margin), 0, 1) * height,
  };
}
export function screenToPlane(point, rect, fov, aspect, z, cameraZ = 7) {
  const h = 2 * Math.tan((fov * Math.PI) / 360) * (cameraZ - z);
  return {
    x: ((point.x - rect.left) / rect.width - 0.5) * h * aspect,
    y: (0.5 - (point.y - rect.top) / rect.height) * h,
    z,
  };
}
export function planeToScreen(p, rect, fov, aspect, cameraZ = 7) {
  const h = 2 * Math.tan((fov * Math.PI) / 360) * (cameraZ - p.z);
  return {
    x: (p.x / (h * aspect) + 0.5) * rect.width + rect.left,
    y: (0.5 - p.y / h) * rect.height + rect.top,
  };
}
