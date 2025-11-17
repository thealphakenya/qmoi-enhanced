# v1.2.5 Release Inspection

Date: 2025-11-15

Scope: verify qmoi-ai platform apps (Android APK, Windows EXE, iOS IPA) are present in GitHub Release `v1.2.5`, checksummed, and perform basic static inspection for build integrity and feature markers.

1) Presence in GitHub Release
- Release `v1.2.5` exists: https://github.com/thealphakenya/qmoi-enhanced/releases/tag/v1.2.5
- Confirmed assets uploaded (10): `app-release.apk`, `qmoi-release.exe`, `qmoi-release.ipa`, plus PWA zips and `SHA256SUMS.txt`.

2) Checksums
- Downloaded `SHA256SUMS.txt` from release and downloaded all artifacts to `/tmp/qmoi_release_inspect/`.
- Recomputed SHA-256 locally for each file and verified all checksums match the release (`All checksums match: True`).

3) Static inspection
- APK (`app-release.apk`):
  - File starts with ZIP local header (`PK\x03\x04`), size ~10MB.
  - Attempting to open as a normal ZIP failed (central directory not found), Python zipfile and unzip both reported the archive lacks a readable central directory.
  - Binary scan did not find clear `AndroidManifest.xml`, `classes.dex`, `META-INF`, `res/`, or `lib/` strings at the top-level in the readable areas. This prevents automated manifest parsing here.
  - Conclusion: The APK file is present and checksummed, but static parsing in this environment cannot confirm internal manifest or declared features. This may be due to an unusual packaging method or minimal/obfuscated structure.

- IPA (`qmoi-release.ipa`):
  - File starts with ZIP local header (`PK\x03\x04`), size ~12MB.
  - Attempting to open as ZIP failed in this environment (central directory not found). No `Info.plist` could be parsed.
  - Conclusion: IPA present and checksummed, but we cannot extract `Info.plist` here to confirm bundle id/version/display name.

- EXE (`qmoi-release.exe`):
  - File downloaded and checksum verified.
  - Extracted printable ASCII strings programmatically; no obvious markers such as `qmoi`, `qmoi_ai`, `API`, `https`, `version` or similar tokens were found in the first sampled strings.
  - `file` utility was not available in the container; deeper PE header inspection not performed.
  - Conclusion: EXE exists and matches release checksum; basic strings scan didn't reveal obvious feature markers but absence of evidence isn't evidence of lack of features (binary may be packed/stripped).

4) Overall integrity & function status
- All three platform artifacts are present in GitHub Release `v1.2.5` and their checksums match what was uploaded.
- Static inspection in this container is limited (no `aapt`, `apksigner`, `codesign`, `plutil`, `file`) and could not parse APK or IPA internals due to missing central directory or packaging format, and EXE strings were limited.
- Therefore we cannot conclusively assert that each app "has all actual features" purely from these artifacts in this environment.

5) Recommended next steps to fully validate functionality (best-effort automated checklist)
- Android APK:
  - On a machine with Android SDK installed: run `aapt dump badging app-release.apk` and `apksigner verify --print-certs app-release.apk`.
  - Install on a test device or emulator and run smoke tests covering key flows (login, AI features, network calls).
- iOS IPA:
  - On macOS: unzip `qmoi-release.ipa`, parse `Payload/*.app/Info.plist` and confirm `CFBundleIdentifier`, version and entitlements.
  - Install on test device (via TestFlight or `ideviceinstaller`) and run smoke tests.
- Windows EXE:
  - Run on a Windows VM and exercise features.
  - Use `sigcheck`/`signtool` to confirm code signing (if signing expected).
  - Use `file` and `pefile` or other tools to inspect PE metadata.

6) Minimal automated tests I can run here if you approve / provide resources
- If you provide an Android emulator or connected device accessible from this environment, I can attempt `adb install` and run instrumentation tests.
- If you provide a macOS runner or `Info.plist` extraction, I can parse and verify it.

7) Artifacts locations
- Local copies used for inspection: `/tmp/qmoi_release_inspect/`
- Release: https://github.com/thealphakenya/qmoi-enhanced/releases/tag/v1.2.5
- Publish report: `/workspaces/qmoi-enhanced/RELEASE_v1.2.5_PUBLISH_REPORT.md`
- This inspection file: `/workspaces/qmoi-enhanced/RELEASE_v1.2.5_INSPECTION.md`


If you want, I can now:
- A) Attempt `aapt`/`apksigner` style checks if you want me to install Android SDK tools in this container (I can try, but may be heavy).
- B) Prepare a small checklist and scripts you can run on a macOS/Windows/Android test machine to validate internal features (preferred, fast).
- C) Spin up a Windows VM/macos runner (not available here) or guide you to run quick device installs.

Please pick A, B, or C (or tell me any other preference) and I will continue.