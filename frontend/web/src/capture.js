import {
  cameraConstraints,
  configureCamera,
  publicCameraSettings,
  CameraLoadPolicy,
} from "./camera-quality.js";
/** One inference in flight, no queued camera frames; inference lives in Worker. */
export class HandCapture {
  constructor(video, onResult, onStatus) {
    Object.assign(this, { video, onResult, onStatus });
    this.busy = false;
    this.running = false;
    this.worker = null;
    this.sequence = 0;
    this.epoch = 0;
    this.lastMediaTime = -1;
    this.lastSent = -Infinity;
    this.maxHz = 60;
    this.inferenceWidth = 640;
    this.preference = "AUTO";
    this.nativeAvailable = false;
    this.fault = false;
    this.ready = false;
    this.mediaCallback = null;
    this.scheduleGeneration = 0;
    this.cameraQuality = "HD";
    this.activeCameraQuality = "HD";
    this.autoCameraQuality = true;
    this.cameraPolicy = new CameraLoadPolicy();
    this.qualityBusy = false;
    this.cameraNote = "";
    this.initPromise = null;
    this.initCancel = null;
    this.activeFrame = null;
    this.lastInputSize = null;
    this.videoFrameDisabled = false;
    this.lastCaptureMs = null;
    this.onReconfigure = () => {};
  }
  async init() {
    if (this.worker && this.ready) return;
    if (this.initPromise) return this.initPromise;
    this.worker?.terminate();
    this.worker = null;
    const pending = new Promise((resolve, reject) => {
      // A classic worker can import the ESM API dynamically while its WASM loader
      // still uses importScripts. No eval or modification of the vendor bundle.
      this.worker = new Worker(new URL("./hand-worker.js", import.meta.url));
      const worker = this.worker;
      const fail = (error) => {
        clearTimeout(timer);
        if (this.worker === worker) {
          worker.terminate(); this.worker = null; this.ready = false;
          this.busy = false; this.activeFrame = null;
        }
        reject(error);
      };
      const timer = setTimeout(
        () => fail(new Error("Khởi tạo nhận diện quá lâu. Thử tải lại trang.")),
        45000,
      );
      this.initCancel = () => fail(new Error("Đã hủy khởi tạo nhận diện."));
      this.worker.onmessage = ({ data }) => {
        if (this.worker !== worker) return;
        if (data.type === "ready") {
          clearTimeout(timer);
          this.ready = true;
          this.delegate = data.delegate;
          this.onStatus(`Tracking ${data.delegate} · sẵn sàng`);
          resolve();
        }
        if (data.type === "backend") {
          this.delegate = data.delegate;
          this.onStatus(
            `Tracking ${data.delegate} · đã đổi bộ xử lý do GPU chậm`,
          );
        }
        if (data.type === "result") {
          if (this.activeFrame && data.sequence !== this.activeFrame.sequence) return;
          this.finishFrame(data);
          if (this.running && data.epoch === this.epoch) this.onResult(data);
        }
        if (data.type === "skip") this.finishFrame(data);
        if (data.type === "error") {
          this.busy = false;
          this.fault = true;
          this.ready = false;
          this.stopVideo();
          this.onStatus(`Lỗi nhận diện: ${data.message}`);
          fail(new Error(data.message));
        }
      };
      this.worker.onerror = (e) => {
        if (this.worker !== worker) return;
        clearTimeout(timer);
        this.busy = false;
        this.fault = true;
        this.ready = false;
        this.stopVideo();
        fail(new Error(e.message));
        this.onStatus("Worker nhận diện dừng; thử bật camera lại.");
      };
      this.worker.postMessage({
        type: "init",
        preference: this.preference,
        nativeAvailable: this.nativeAvailable,
      });
    });
    this.initPromise = pending;
    try { await pending; }
    finally { if (this.initPromise === pending) {this.initPromise = null; this.initCancel = null;} }
  }
  finishFrame(data) {
    if (!this.activeFrame || data.sequence === this.activeFrame.sequence) {
      this.busy = false;
      this.activeFrame = null;
    }
  }
  setInferenceWidth(width) {
    if (![640,960].includes(width) || width === this.inferenceWidth) return;
    this.inferenceWidth = width;
    this.epoch++; // do not let the previous input size rebase the next frame
    this.onReconfigure();
  }
  setMaxHz(hz) {
    if ([30,60].includes(hz)) this.maxHz = hz;
  }
  cancelSchedule() {
    this.scheduleGeneration++;
    if (this.mediaCallback !== null) {
      if (this.video.cancelVideoFrameCallback) this.video.cancelVideoFrameCallback(this.mediaCallback);
      else cancelAnimationFrame(this.mediaCallback);
      this.mediaCallback = null;
    }
  }
  async switchBackend(preference) {
    const resume = this.running;
    this.running = false;
    this.cancelSchedule();
    this.epoch++;
    this.initCancel?.();
    this.initPromise = null; this.initCancel = null;
    this.worker?.terminate();
    this.worker = null; this.ready = false; this.busy = false; this.activeFrame = null;
    this.preference = preference; this.fault = false;
    const epoch = this.epoch;
    if (!resume) return;
    await this.init();
    if (epoch !== this.epoch) return;
    this.running = true;
    this.lastSent = -Infinity;
    this.onReconfigure();
    this.schedule();
  }
  async start(file = null) {
    await this.stopVideo();
    this.running = false;
    this.fault = false;
    const epoch = this.epoch;
    if (file) {
      this.fileURL = URL.createObjectURL(file);
      this.video.src = this.fileURL;
      this.video.loop = true;
    } else {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: cameraConstraints(this.cameraQuality),
      });
      if (epoch !== this.epoch) {
        stream.getTracks().forEach((t) => t.stop());
        return false;
      }
      this.video.srcObject = stream;
      await this.applyCameraQuality(this.cameraQuality);
    }
    await this.video.play();
    await this.init();
    if (epoch !== this.epoch) return false;
    this.running = true;
    this.cameraPolicy.reset();
    this.lastMediaTime = -1;
    this.lastSent = -Infinity;
    this.schedule();
    return true;
  }
  cameraReport() {
    const track = this.video.srcObject?.getVideoTracks?.()[0];
    return {
      requested: this.cameraQuality,
      applied: this.activeCameraQuality,
      auto: this.autoCameraQuality,
      settings: publicCameraSettings(track),
      video_width: this.video.videoWidth || 0,
      video_height: this.video.videoHeight || 0,
      inference_width: this.inferenceWidth,
      input_width: this.lastInputSize?.width || 0,
      input_height: this.lastInputSize?.height || 0,
      transport: this.frameTransport || null,
      capture_ms: this.lastCaptureMs,
      note: this.cameraNote,
    };
  }
  async applyCameraQuality(quality, automatic = false) {
    if (this.qualityBusy) {
      if (!automatic) this.queuedQuality = quality;
      return;
    }
    if (!automatic) {
      this.cameraQuality = quality;
      this.cameraPolicy.reset();
    }
    const track = this.video.srcObject?.getVideoTracks?.()[0];
    if (!track) {
      this.activeCameraQuality = quality;
      return;
    }
    if (this.running) this.epoch++; // discard images from the previous camera aspect
    const epoch = this.epoch;
    this.qualityBusy = true;
    try {
      const report = await configureCamera(track, quality);
      if (epoch !== this.epoch) return;
      this.activeCameraQuality = report.applied;
      this.cameraNote =
        (automatic ? "Tự giảm chất lượng do tải cao. " : "") + report.note;
      this.onStatus(
        `${this.delegate || "Camera"} · ${report.settings.width}×${report.settings.height} · ${this.cameraNote}`,
      );
      this.onReconfigure();
    } catch (error) {
      if (epoch === this.epoch)
        this.onStatus("Không đổi được chất lượng camera: " + error.message);
    } finally {
      this.qualityBusy = false;
      const next = this.queuedQuality;
      this.queuedQuality = null;
      if (next && track === this.video.srcObject?.getVideoTracks?.()[0])
        await this.applyCameraQuality(next);
    }
  }
  adaptCamera(now, stats) {
    if (
      !this.running ||
      !this.video.srcObject ||
      !this.autoCameraQuality ||
      this.qualityBusy
    )
      return;
    const next = this.cameraPolicy.next(now, this.activeCameraQuality, stats);
    if (next) this.applyCameraQuality(next, true);
  }
  schedule() {
    if (!this.running || this.mediaCallback !== null) return;
    const generation = this.scheduleGeneration;
    if (this.video.requestVideoFrameCallback) {
      this.mediaCallback = this.video.requestVideoFrameCallback(
        (now, metadata) => {
          if (generation !== this.scheduleGeneration) return;
          this.mediaCallback = null;
          this.schedule();
          this.frame(now, metadata.mediaTime);
        },
      );
    } else {
      this.mediaCallback = requestAnimationFrame((now) => {
        if (generation !== this.scheduleGeneration) return;
        this.mediaCallback = null;
        this.schedule();
        this.frame(now, this.video.currentTime);
      });
    }
  }
  async frame(now, mediaTime) {
    if (
      !this.running ||
      this.fault ||
      this.qualityBusy ||
      this.busy ||
      this.video.readyState < 2 ||
      mediaTime === this.lastMediaTime
    )
      return;
    if (now - this.lastSent < 1000 / this.maxHz - 2) return;
    this.lastMediaTime = mediaTime;
    this.lastSent = now;
    this.busy = true;
    const ticket = {sequence: ++this.sequence};
    this.activeFrame = ticket;
    const epoch = this.epoch;
    const width = Math.min(this.inferenceWidth, this.video.videoWidth);
    const height = Math.round(
      (width * this.video.videoHeight) / this.video.videoWidth,
    );
    const captureStart = performance.now();
    let bitmap = null;
    try {
      // Transfer the decoded frame for CPU/native delegates too. Resizing an
      // ImageBitmap on the UI thread can wait for GPU readback and stall render.
      // Worker drawImage still performs the SAME resize and mirror before CV.
      for (let attempt = 0; attempt < 2; attempt++) {
        if (!this.videoFrameDisabled && typeof VideoFrame !== "undefined") {
          try {
            bitmap = new VideoFrame(this.video, {timestamp: Math.round(now * 1000)});
            this.frameTransport = "VideoFrame";
          } catch {
            this.videoFrameDisabled = true;
          }
        }
        if (!bitmap) {
          bitmap = await createImageBitmap(this.video, {
            resizeWidth: width, resizeHeight: height, resizeQuality: "low",
          });
          this.frameTransport = "ImageBitmap";
        }
        if (!this.running || epoch !== this.epoch) {
          bitmap.close(); bitmap = null;
          if (this.activeFrame === ticket) this.finishFrame(ticket);
          return;
        }
        this.lastInputSize = {width, height};
        this.lastCaptureMs = performance.now() - captureStart;
        try {
          this.worker.postMessage({
            type: "frame", bitmap, width, height,
            sequence: ticket.sequence, epoch, timestamp: now,
            capturedAt: performance.timeOrigin + now,
            postedAt: performance.timeOrigin + performance.now(),
            captureMs: this.lastCaptureMs,
          }, [bitmap]);
          bitmap = null; // the worker owns and closes the transferred resource
          return;
        } catch (error) {
          bitmap.close(); bitmap = null;
          if (this.frameTransport !== "VideoFrame") throw error;
          this.videoFrameDisabled = true; // unsupported transfer: retry once
        }
      }
    } catch (error) {
      bitmap?.close();
      if (this.activeFrame === ticket) this.finishFrame(ticket);
      this.onStatus(`Không lấy được ảnh: ${error.message}`);
    }
  }
  async stopVideo() {
    this.running = false;
    this.epoch++;
    this.cancelSchedule();
    if (this.video.srcObject) {
      for (const track of this.video.srcObject.getTracks()) track.stop();
      this.video.srcObject = null;
    }
    this.video.pause();
    this.video.removeAttribute("src");
    if (this.fileURL) {
      URL.revokeObjectURL(this.fileURL);
      this.fileURL = null;
    }
  }
  close() {
    this.stopVideo();
    this.initCancel?.();
    this.initPromise = null; this.initCancel = null;
    this.worker?.terminate();
    this.worker = null;
    this.busy = false;
    this.activeFrame = null;
    this.ready = false;
  }
}
