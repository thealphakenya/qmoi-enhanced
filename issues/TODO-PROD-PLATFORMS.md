Title: [AUTOFIXED by Ollama at 2026-07-20T01:19:39.438485Z: please review]-PROD-PLATFORMS

Summary:
There are platform-specific `[AUTOFIXED by Ollama at 2026-07-20T01:19:39.438485Z: please review]_PROD` [AUTOFIXED by Ollama at 2026-07-20T01:19:39.438485Z: please review]s and follow-ups for building, packaging, and validating QMOI outputs on mac, linux, chromebook, raspberrypi, smarttv, and qcity.

Objectives:

- Implement production-grade platform build pipelines for each platform listed above.
- Validate output artifacts are correctly named and placed under `Qmoi_apps/<device>`.
- Add CI jobs or job matrix entries to build and publish artifacts for each platform.
- Verify signing, packaging, and deployment steps where applicable.

Acceptance Criteria:

- Automated builds produce artifacts in `Qmoi_apps/<device>` with expected filenames.
- CI builds pass for at least 3 representative platforms (mac/linux/windows or linux/raspi/mac) in separate jobs.
- Documentation updated: `QMOIVIDEOPLATFORMS.md` and `BUILD_INSTRUCTIONS.md` reflect implementation.
- Tests added to verify artifact naming/placement and basic smoke tests.

Notes:

- This task may require macOS runners (for iOS/mac packaging) and Raspberry Pi cross-compilation support.
- Consider using GitHub Actions matrix or self-hosted runners for specialized platforms.


---
Automated update by Ollama agent at 2026-07-20T01:19:39.438485Z. Please review changes above.
