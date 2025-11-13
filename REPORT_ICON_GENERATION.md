# Generated Icon Sets and Finalization Instructions

This PR adds auto-generated platform icon sets for detected apps and documents how to finalize them for each platform.

What I generated
- PWA icons (48/192/512) under `pwa_apps/<app>/icons/` for each detected PWA.
- Windows `.ico` files and macOS `.iconset` folders under `packaging/icons/<app>.iconset/` and `packaging/icons/<app>.ico`.
- iOS `AppIcon.appiconset` folders under `packaging/icons/<app>/AppIcon.appiconset/` (PNG files + `Contents.json`).
- Linux PNG icons under `packaging/icons/<app>/` (512 and 192 px).

Where files live
- `pwa_apps/<app>/icons/` — PWA icons used by web manifests.
- `packaging/icons/<app>.ico` — Windows ICO files (multi-size).
- `packaging/icons/<app>.iconset/` — macOS iconset folders (run `iconutil` on macOS to produce `.icns`).
- `packaging/icons/<app>/AppIcon.appiconset/` — iOS Xcode asset app icon sets.

How to finalize macOS `.icns`
1. On a macOS machine with Xcode tools installed, run:

```bash
iconutil -c icns packaging/icons/<APPNAME>.iconset
# produces <APPNAME>.icns
```

2. Move the resulting `.icns` to your Electron/mac packaging resources (e.g. `build/icons/`), then re-run the packaging workflow.

How to finalize iOS App Icon
1. Open Xcode, select the iOS project, open Assets.xcassets, and drag the folder `packaging/icons/<APPNAME>/AppIcon.appiconset` into the project's asset catalog.
2. Ensure `Contents.json` metadata matches your Xcode target requirements. The generated set includes common sizes and a 1024 App Store icon.

Notes and caveats
- The generated `.iconset` is ready for conversion but `iconutil` is macOS-only; this environment could not produce `.icns` binaries.
- I updated PWA manifest `icons` entries where possible to point to the generated icons. Please review commits to confirm paths.
- After you (or CI) produce signed natives and attach them to GitHub Releases, run `python3 scripts/qmoi-app-validator.py` without `ALLOW_FALLBACK` to strictly validate artifacts.

Automated next steps in this PR
- I added a workflow `ci/verify-post-packaging.yml` (below) that will run once packaging jobs create artifacts and will:
  - Re-run the strict validator (no fallback) on a runner that has access to packaging outputs (if artifacts are uploaded to the release or workflow artifacts).
  - Run `tools/verify_releases.sh` to compare release asset checksums with `tools/discovered_assets.json` (requires `GITHUB_TOKEN` and that assets are attached to releases).

If you want me to open the PR automatically I can dispatch the repository's `open-inventory-pr.yml` workflow, or you can open the PR yourself from this branch.

If anything here should be refined (sizes, additional formats, different masters), tell me which app(s) to target and I will regenerate with adjusted parameters.
