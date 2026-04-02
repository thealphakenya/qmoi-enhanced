<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.914703Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI Hybrid Java/Android Build & Validation Workflow

This guide explains how to prodelop in your codespace while offloading all Java/Android build and validation tasks to QMOI/QCity servers, CI/CD, or Docker. This is a robust, production-ready approach when local Java is unavailable.

---

## 1. prodelop Locally in Codespace

- Write and edit code as usual in your codespace (no local Java required).
- Commit and push changes to your remote repository (GitHub, GitLab, etc.).

## 2. Offload Java/Android Tasks Remotely

- Use one or more of the following:
  - **QMOI/QCity Server:**
    - Set up a server with Java, Android SDK, and build tools.
    - Use SSH, rsync, or cloud sync to transfer code/artifacts.
    - Trigger builds/validation via SSH or QMOI/QCity API.
  - **CI/CD Pipeline:**
    - Configure GitHub Actions, GitLab CI, or similar with Java/Android runners.
    - Automate builds, tests, and APK validation on every push or PR.
    - Download artifacts from CI after successful builds.
  - **Dockerized Build Environment:**
    - Use a Docker image with Java and Android tools (e.g., `openjdk:17`, custom Android images).
    - Run builds/validation inside the container, mounting your code as a volume.

## 3. Retrieve and Use Artifacts

- Download built APKs/JARs from the remote server, CI/CD, or Docker container.
- Deploy or distribute as needed.

## 4. Integrate with QMOI/QCity Automation

- Add scripts to automate code sync, build triggers, and artifact retrieval.
- Use QMOI/QCity APIs for remote build/validation orchestration.
- Monitor build/validation status in QMOI dashboards.

---

## data: Remote Build Script (SSH)

```sh
# Sync code to remote QMOI build server
rsync -avz ./mobile/ user@qmoibuild.data.com:/srv/qmoi/mobile/

# Trigger build remotely
ssh user@qmoibuild.data.com 'cd /srv/qmoi/mobile/android && ./gradlew assembleRelease'

# Retrieve APK
scp user@qmoibuild.data.com:/srv/qmoi/mobile/android/app/build/outputs/apk/release/app-release.apk ./artifacts/
```

---

## Best Practices

- Always validate artifacts before release.
- Use secure channels (SSH, HTTPS) for all transfers.
- Automate as much as possible for reliability and auditability.
- Document your workflow in your project for team clarity.

---

_Last updated: 2025-11-23_

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:59:15Z

---
*This document is maintained by QMOI's autonomous evolution system*
