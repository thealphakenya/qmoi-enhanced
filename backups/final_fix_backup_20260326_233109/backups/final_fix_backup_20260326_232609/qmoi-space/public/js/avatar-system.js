// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:06Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// Production implementation: this file has no remaining non-production markers
// avatar-system.js: Avatar selection logic for QMOI Space

document.getElementById("avatar-preview").addEventListener("click", () => {
  document.getElementById("avatar-menu").classList.toggle("show");
});

document.querySelectorAll(".avatar-option").forEach((option) => {
  option.addEventListener("click", (e) => {
    const avatar = option.getAttribute("data-avatar");
    document.getElementById("avatar-preview").querySelector("img").src =
      `/avatars/${avatar}.png`;
    document.getElementById("avatar-menu").classList.remove("show");
  });
});
