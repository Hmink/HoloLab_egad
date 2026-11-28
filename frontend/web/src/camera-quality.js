/** Camera resolution is independent of the model's input size and CSS preview size. */
export const CAMERA_PROFILES = Object.freeze({
  LOW: { width: 640, height: 480, label: "Low" },
  HD: { width: 1280, height: 720, label: "HD" },
  FHD: { width: 1920, height: 1080, label: "Full HD" },
});
export function cameraConstraints(quality = "HD", exact = false) {
  const p = CAMERA_PROFILES[quality];
  if (!p) throw Error("Unknown camera quality");
  const bound = exact ? "exact" : "ideal";
  return {
    width: { [bound]: p.width },
    height: { [bound]: p.height },
    frameRate: { ideal: 60, max: 60 },
    resizeMode: { ideal: "none" },
  };
}
export function publicCameraSettings(track) {
  const s = track?.getSettings?.() || {},
    r = {};
  for (const k of [
    "width",
    "height",
    "frameRate",
    "aspectRatio",
    "resizeMode",
    "focusMode",
  ])
    if (s[k] !== undefined) r[k] = s[k];
  return r;
}
export async function configureCamera(track, quality = "HD") {
  let actual = quality,
    note = "";
  try {
    await track.applyConstraints(cameraConstraints(quality, true));
  } catch (error) {
    // Even a range in getCapabilities doesn't prove that a width/height pair exists.
    actual = quality === "FHD" ? "HD" : quality;
    await track.applyConstraints(cameraConstraints(actual, false));
    note =
      quality === "FHD"
        ? "Camera không nhận Full HD; đã yêu cầu HD."
        : "Camera dùng chế độ gần nhất hỗ trợ.";
  }
  const capabilities = track.getCapabilities?.() || {};
  if (capabilities.focusMode?.includes("continuous")) {
    try {
      const s = publicCameraSettings(track);
      await track.applyConstraints({
        width: { exact: s.width },
        height: { exact: s.height },
        frameRate: { ideal: s.frameRate || 30 },
        advanced: [{ focusMode: "continuous" }],
      });
    } catch {
      /* Optional hardware control, not a startup failure. */
    }
  }
  return {
    applied: actual,
    settings: publicCameraSettings(track),
    autofocus: capabilities.focusMode?.includes("continuous") || false,
    note,
  };
}
export class CameraLoadPolicy {
  constructor() {
    this.reset();
  }
  reset() {
    this.slowSince = null;
    this.lastChange = -Infinity;
  }
  next(now, current, { fps, inferenceMs, ageMs }) {
    const slow = (fps > 0 && fps < 42) || (inferenceMs > 70 && ageMs > 120);
    if (!slow) {
      this.slowSince = null;
      return null;
    }
    if (this.slowSince === null) this.slowSince = now;
    if (now - this.slowSince < 10000 || now - this.lastChange < 15000)
      return null;
    const lower = current === "FHD" ? "HD" : current === "HD" ? "LOW" : null;
    if (lower) {
      this.lastChange = now;
      this.slowSince = null;
    }
    return lower;
  }
}
