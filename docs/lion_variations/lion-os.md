---
title: "LION-OS (Appliance Image)"
qmoi_validation_frontmatter: true
---

# LION-OS (Appliance Image)

Purpose
- A self-contained appliance image (Linux-based) that packages LION services and a minimal runtime for edge or on-prem deployments.

Key features
- Pre-installed LION services, local qmoi memory, builtin orchestrator and queue worker.
- Secure defaults, automatic updates, signed images and checksums.
- Optional WebUI for local administration.

Target platforms
- x86_64 and ARM (Raspberry Pi/embedded x86 boards).
- Distribution via disk images (ISO/img), container images (for appliance containers) and cloud marketplace images.

Packaging
- Produce compressed disk images (.img.gz) and Docker images.
- Provide SHA256 checksums and GPG signatures for images.

Release artifacts
- `lion-os-<arch>-vX.Y.Z.img.gz`, `lion-os-<arch>-vX.Y.Z.docker.tar.gz`

Auto-update strategy
- Agent checks GitHub Releases for new version tags; downloads delta or full image and applies update using a safe reboot/upgrade process.

Monetization
- Appliance subscriptions (support + updates), managed hosting, hardware+software bundles.

Integration with QMOI
- Used for on-prem demonstrations, partner deployments and paid managed installs.
