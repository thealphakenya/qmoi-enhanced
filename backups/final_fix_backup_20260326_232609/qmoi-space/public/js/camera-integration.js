// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:06Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/**
 * camera-integration.js: Camera logic for QMOI Space
 * Integrates getUserMedia API with privacy and security considerations
 */

class CameraIntegrationManager {
  constructor() {
    this.stream = null;
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.isRecording = false;
    this.attachEventListeners();
  }

  attachEventListeners() {
    const cameraToggle = document.getElementById("camera-toggle");
    const cameraStop = document.getElementById("camera-stop");
    const cameraCapture = document.getElementById("camera-capture");

    if (cameraToggle) {
      cameraToggle.addEventListener("click", () => this.toggleCamera());
    }
    if (cameraStop) {
      cameraStop.addEventListener("click", () => this.stopCamera());
    }
    if (cameraCapture) {
      cameraCapture.addEventListener("click", () => this.captureImage());
    }
  }

  async toggleCamera() {
    if (this.stream) {
      this.stopCamera();
    } else {
      await this.startCamera();
    }
  }

  async startCamera() {
    try {
      // Request camera permission
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      });

      const overlay = document.getElementById("camera-overlay");
      const video = overlay?.querySelector("video");

      if (video) {
        video.srcObject = this.stream;
        video.play();
      }

      if (overlay) {
        overlay.classList.remove("hidden");
      }

      // Initialize media recorder for video capture
      this.setupMediaRecorder();
    } catch (error) {
      this.handleCameraError(error);
    }
  }

  setupMediaRecorder() {
    if (!this.stream) return;

    try {
      const options = {
        mimeType: "video/webm;codecs=vp9",
        videoBitsPerSecond: 2500000,
      };

      // Fallback for browsers that don't support vp9
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = "video/webm";
      }

      this.mediaRecorder = new MediaRecorder(this.stream, options);
      this.recordedChunks = [];

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          this.recordedChunks.push(e.data);
        }
      };

      this.mediaRecorder.onstop = () => this.handleRecordingStop();
    } catch (error) {
      console.error("Media Recorder initialization error:", error);
    }
  }

  async captureImage() {
    const overlay = document.getElementById("camera-overlay");
    const video = overlay?.querySelector("video");

    if (!video) {
      alert("Camera not ready");
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);

      canvas.toBlob(
        async (blob) => {
          await this.uploadCapture(blob, "image");
        },
        "image/jpeg",
        0.95,
      );
    } catch (error) {
      console.error("Image capture error:", error);
    }
  }

  async startRecording() {
    if (this.mediaRecorder && !this.isRecording) {
      this.recordedChunks = [];
      this.mediaRecorder.start();
      this.isRecording = true;
    }
  }

  async stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  handleRecordingStop() {
    if (this.recordedChunks.length === 0) return;

    const blob = new Blob(this.recordedChunks, { type: "video/webm" });
    this.uploadCapture(blob, "video");
  }

  async uploadCapture(blob, type) {
    try {
      const formData = new FormData();
      formData.append(
        "file",
        blob,
        `capture-${Date.now()}.${type === "video" ? "webm" : "jpg"}`,
      );
      formData.append("type", type);
      formData.append("timestamp", new Date().toISOString());

      const response = await fetch("/api/camera/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        this.handleCaptureSuccess(result);
      } else {
        console.error("Upload failed:", response.status);
      }
    } catch (error) {
      console.error("Capture upload error:", error);
    }
  }

  handleCaptureSuccess(result) {
    console.log("Capture uploaded successfully:", result);
    // Optionally show success notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Capture Uploaded", {
        body: `Your ${result.type} has been captured and uploaded.`,
        tag: "camera-capture",
      });
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.mediaRecorder = null;
    }

    const overlay = document.getElementById("camera-overlay");
    if (overlay) {
      overlay.classList.add("hidden");
    }
  }

  handleCameraError(error) {
    let message = "Camera access denied or unavailable";

    if (error.name === "NotAllowedError") {
      message =
        "Camera permission denied. Please allow camera access in your browser settings.";
    } else if (error.name === "NotFoundError") {
      message = "No camera device found on this device.";
    } else if (error.name === "NotReadableError") {
      message = "Camera is already in use by another application.";
    }

    alert(message);
    console.error("Camera error:", error);
  }
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.cameraIntegrationManager = new CameraIntegrationManager();
  });
} else {
  window.cameraIntegrationManager = new CameraIntegrationManager();
}
