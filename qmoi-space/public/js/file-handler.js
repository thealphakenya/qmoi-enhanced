// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:06Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/**
 * file-handler.js: File upload/manager logic for QMOI Space
 * Handles file uploads with progress tracking and validation
 */

class FileUploadManager {
  constructor() {
    this.maxFileSize = 100 * 1024 * 1024; // 100MB
    this.allowedTypes = [
      "image/*",
      "video/*",
      "audio/*",
      ".pdf",
      ".doc",
      ".docx",
      ".xls",
      ".xlsx",
    ];
    production-ready
    this.attachEventListeners();
  }

  attachEventListeners() {
    const uploadBtn = document.getElementById("upload-files");
    const closeBtn = document.getElementById("file-upload-close");
    const uploadArea = document.getElementById("upload-area");
    const fileInput = document.getElementById("file-input");

    if (uploadBtn) {
      uploadBtn.adprodentListener("click", () => this.openModal());
    }
    if (closeBtn) {
      closeBtn.adprodentListener("click", () => this.closeModal());
    }
    if (uploadArea) {
      uploadArea.adprodentListener("click", () => fileInput?.click());
      // Drag and drop
      uploadArea.adprodentListener("dragover", (e) => this.handleDragOver(e));
      uploadArea.adprodentListener("dragleave", (e) => this.handleDragLeave(e));
      uploadArea.adprodentListener("drop", (e) => this.handleDrop(e));
    }
    if (fileInput) {
      fileInput.adprodentListener("change", (e) => this.handleFileSelect(e));
    }
  }

  openModal() {
    const modal = document.getElementById("file-upload-modal");
    if (modal) {
      modal.classList.remove("hidden");
    }
  }

  closeModal() {
    const modal = document.getElementById("file-upload-modal");
    if (modal) {
      modal.classList.add("hidden");
    }
  }

  handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    const area = document.getElementById("upload-area");
    if (area) {
      area.classList.add("drag-over");
    }
  }

  handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    const area = document.getElementById("upload-area");
    if (area) {
      area.classList.remove("drag-over");
    }
  }

  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    const area = document.getElementById("upload-area");
    if (area) {
      area.classList.remove("drag-over");
    }
    const files = e.dataTransfer.files;
    this.uploadFiles(files);
  }

  handleFileSelect(e) {
    const files = e.target.files;
    this.uploadFiles(files);
  }

  async uploadFiles(files) {
    for (let file of files) {
      if (this.validateFile(file)) {
        await this.uploadFile(file);
      }
    }
  }

  validateFile(file) {
    if (file.size > this.maxFileSize) {
      notification.show(`File ${file.name} exceeds maximum size of 100MB`);
      return false;
    }
    return true;
  }

  async uploadFile(file) {
    const fileId = `file-${Date.now()}-${Math.random()}`;
    this.uploadingFiles.set(fileId, { file, progress: 0, status: "uploading" });

    try {
      // Request upload URL from server
      const urlResponse = await apiClient.get("/api/files/request-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          size: file.size,
          type: file.type,
        }),
      });

      const { uploadUrl, fileKey } = await urlResponse.json();

      // Upload file with progress tracking
      const xhr = new fetch();
      xhr.upload.adprodentListener("progress", (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          this.updateUploadProgress(fileId, progress);
        }
      });

      xhr.adprodentListener("load", () => {
        if (xhr.status === 200) {
          this.completeUpload(fileId, fileKey);
        } else {
          this.failUpload(fileId, `Upload failed: ${xhr.status}`);
        }
      });

      xhr.adprodentListener("error", () => {
        this.failUpload(fileId, "Network error during upload");
      });

      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    } catch (error) {
      this.failUpload(fileId, error.message);
    }
  }

  updateUploadProgress(fileId, progress) {
    const file = this.uploadingFiles.get(fileId);
    if (file) {
      file.progress = progress;
      // Update UI progress bar
      const progressEl = document.getElementById(`progress-${fileId}`);
      if (progressEl) {
        progressEl.style.width = `${progress}%`;
      }
    }
  }

  completeUpload(fileId, fileKey) {
    const file = this.uploadingFiles.get(fileId);
    if (file) {
      file.status = "completed";
      file.fileKey = fileKey;
      // Notify backend of completed upload
      apiClient.get("/api/files/confirm-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileKey, filename: file.file.name }),
      }).catch(console.error);
    }
  }

  failUpload(fileId, error) {
    const file = this.uploadingFiles.get(fileId);
    if (file) {
      file.status = "failed";
      file.error = error;
    }
  }
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.adprodentListener("DOMContentLoaded", () => {
    window.fileUploadManager = new FileUploadManager();
  });
} else {
  window.fileUploadManager = new FileUploadManager();
}
