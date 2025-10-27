# lion-lite

Description
- A minimal, lightweight LION variant for edge devices and constrained environments.

Key features
- Reduced dependency surface and memory footprint
- Disabled heavy QVS indexing by default
- Cross-compiled Docker images for arm/v7 and arm64

Release & packaging
- Delivered as a small tar.gz and a tiny Docker image. Suitable for IoT and edge deployments.
# LION-Lite (Developer / Hobbyist)

Purpose
- A lightweight, minimal LION distribution focused on developers and hobbyists for local testing and experimentation.

Key features
- Minimal runtime, single-process mode, simplified local storage, quickstart scripts, UI for exploration.

Target platforms
- Desktop Linux, macOS (via container), Raspberry Pi.

Packaging
- Python wheel, lightweight Docker image, and a simple tarball with quickstart script.

Release artifacts
- `lion-lite-vX.Y.Z.tar.gz`, `lion-lite-vX.Y.Z.whl`, `lion-lite-vX.Y.Z.docker.tar.gz`.

Auto-update strategy
- Checks GitHub Releases; developer opt-in auto-updates via pip or scripted upgrade.

Monetization
- Free tier; paid add-ons for cloud sync or advanced plugins.

Integration with QMOI
- Useful for local development of QVS plugins and integration tests.
