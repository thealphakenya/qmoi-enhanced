// file-handler.js: File upload/manager logic for QMOI Space
// TODO: Integrate with real file API for production (e.g., signed uploads, virus scanning, ACLs)

document.getElementById("upload-files").addEventListener("click", () => {
  document.getElementById("file-upload-modal").classList.remove("hidden");
});

document.getElementById("file-upload-close").addEventListener("click", () => {
  document.getElementById("file-upload-modal").classList.add("hidden");
});

document.getElementById("upload-area").addEventListener("click", () => {
  document.getElementById("file-input").click();
});

document.getElementById("file-input").addEventListener("change", (e) => {
  // TODO: Implement real file upload logic
  alert("File upload not yet implemented.");
});
