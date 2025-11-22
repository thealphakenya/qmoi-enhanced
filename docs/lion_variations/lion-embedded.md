<!-- QMOI_OWNER_START -->
owner: unknown
role: unknown
updated_at: 2025-11-22T13:51:58Z
<!-- QMOI_OWNER_END -->

# LION-Embedded (Tiny Runtime for Devices)

Purpose
- A minimal C/Python hybrid runtime tailored for constrained IoT devices and embedded systems.

Key features
- Small footprint, deterministic resource usage, precompiled handlers for common tasks, OTA update support.

Target platforms
- Embedded Linux, Yocto-based builds, OpenWrt, ARM Cortex boards.

Packaging
- Cross-compiled runtime packages, SDK for integrating with device firmware.

Release artifacts
- `lion-embedded-<arch>-vX.Y.Z.tar.gz`, build recipes for Yocto/OpenWrt.

Auto-update strategy
- Signed OTA bundles with delta updates and fallback safe partitioning.

Monetization
- Device OEM licensing, per-device support packages, long-term support.

Integration with QMOI
- Light telemetry and QVS snapshots synced to central QMOI hub when connectivity is available.
