let model = null,
  delegate = "CPU",
  preference = "AUTO",
  slowGpuFrames = 0,
  lastTimestamp = -1,
  native = false;
let input = null, context = null, cpuInput = null;
function prepareInput() {
  const cpu = native || delegate === "CPU";
  if (context && cpuInput === cpu) return;
  // CPU inference reads pixels. Keep its preprocessing canvas in CPU memory
  // rather than synchronizing an accelerated 2D surface with a GL readback.
  input = new OffscreenCanvas(1, 1);
  context = input.getContext("2d", {alpha: false, willReadFrequently: cpu});
  cpuInput = cpu;
}
self.onmessage = async ({ data }) => {
  if (data.type === "init") {
    try {
      const { FilesetResolver, HandLandmarker } = await import(
        "../vendor/vision_bundle.mjs"
      );
      const files = await FilesetResolver.forVisionTasks(
        new URL("../vendor/wasm", self.location.href).href,
      );
      preference = data.preference || "AUTO";
      const canvas = new OffscreenCanvas(16, 16),
        gl = canvas.getContext("webgl2");
      const debug = gl?.getExtension("WEBGL_debug_renderer_info");
      const renderer = debug
        ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)
        : "";
      const software = /swiftshader|llvmpipe|software/i.test(renderer);
      const useCPU =
        preference === "CPU" ||
        preference === "NATIVE" ||
        (preference === "AUTO" && (!gl || software));
      if (
        ((useCPU && preference === "AUTO") || preference === "NATIVE") &&
        data.nativeAvailable
      ) {
        try {
          const response = await fetch("/api/tracking/init", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: "{}",
          });
          if (!response.ok) throw Error("Native init failed");
          native = true;
          delegate = "Python CPU";
          self.postMessage({ type: "ready", delegate, renderer });
          return;
        } catch (error) {
          /* The complete WASM runtime remains available as fallback. */
        }
      }
      const options = {
        baseOptions: {
          modelAssetPath: new URL(
            "../models/hand_landmarker.task",
            self.location.href,
          ).href,
          delegate: "GPU",
        },
        canvas,
        runningMode: "VIDEO",
        numHands: 2,
        minHandDetectionConfidence: 0.45,
        minHandPresenceConfidence: 0.45,
        minTrackingConfidence: 0.5,
      };
      if (useCPU) options.baseOptions.delegate = "CPU";
      try {
        model = await HandLandmarker.createFromOptions(files, options);
        delegate = useCPU ? "CPU" : "GPU";
      } catch (error) {
        options.baseOptions.delegate = "CPU";
        delete options.canvas;
        model = await HandLandmarker.createFromOptions(files, options);
        delegate = "CPU";
      }
      self.postMessage({ type: "ready", delegate, renderer });
    } catch (error) {
      self.postMessage({ type: "error", message: String(error) });
    }
    return;
  }
  if (data.type === "frame") {
    const { bitmap, timestamp, sequence, capturedAt, epoch } = data;
    if ((!model && !native) || timestamp <= lastTimestamp) {
      bitmap.close();
      self.postMessage({ type: "skip", sequence });
      return;
    }
    lastTimestamp = timestamp;
    try {
      const start = performance.now();
      const captureMs = data.captureMs ?? null;
      const queueMs = data.postedAt == null ? null : Math.max(0,
        performance.timeOrigin + start - data.postedAt);
      const width = data.width || bitmap.displayWidth || bitmap.width,
        height = data.height || bitmap.displayHeight || bitmap.height;
      prepareInput();
      if (input.width !== width || input.height !== height) {
        input.width = width;
        input.height = height;
      }
      // Detector always receives selfie-mirrored pixels. UI mirroring is independent.
      context.setTransform(-1, 0, 0, 1, input.width, 0);
      context.drawImage(bitmap, 0, 0, input.width, input.height);
      const preprocessMs = performance.now() - start;
      if (native) {
        const jpeg = await input.convertToBlob({
          type: "image/jpeg",
          quality: 0.9,
        });
        const response = await fetch("/api/tracking/frame", {
          method: "POST",
          headers: { "Content-Type": "image/jpeg" },
          body: jpeg,
        });
        if (response.status === 429) {
          self.postMessage({ type: "skip", sequence });
          return;
        }
        if (!response.ok)
          throw Error("Native tracking HTTP " + response.status);
        const result = await response.json();
        self.postMessage({
          type: "result",
          sequence,
          capturedAt,
          timestamp,
          delegate,
          epoch,
          ...result,
          width,
          height,
          transportMs: performance.now() - start - result.inferenceMs,
          captureMs,
          queueMs,
          preprocessMs,
          modelMs: result.inferenceMs,
        });
        return;
      }
      const detectStart = performance.now();
      const result = model.detectForVideo(input, timestamp);
      const modelMs = performance.now() - detectStart;
      const inferenceMs = performance.now() - start;
      // A supported GPU can still be slower than CPU (software GL, driver issues).
      if (preference === "AUTO" && delegate === "GPU") {
        slowGpuFrames = inferenceMs > 120 ? slowGpuFrames + 1 : 0;
        if (slowGpuFrames >= 5) {
          await model.setOptions({ baseOptions: { delegate: "CPU" } });
          delegate = "CPU";
          self.postMessage({ type: "backend", delegate });
        }
      }
      self.postMessage({
        type: "result",
        sequence,
        capturedAt,
        timestamp,
        delegate,
        epoch,
        inferenceMs,
        captureMs,
        queueMs,
        preprocessMs,
        modelMs,
        width,
        height,
        hands: result.landmarks.map((landmarks, i) => ({
          landmarks,
          label: result.handedness[i]?.[0]?.categoryName || "Unknown",
          score: result.handedness[i]?.[0]?.score || 0,
        })),
      });
    } catch (error) {
      self.postMessage({ type: "error", message: String(error) });
    } finally {
      bitmap.close();
    }
  }
};
