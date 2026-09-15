# Production build plan (auto/placeholder-stubs)

Generated: 2025-10-28

This document prioritizes missing artifacts and provides concrete build steps, required secrets, runner types, and a minimal CI job sketch for each app/platform found missing in `docs/missing_builds_report.json`.

Summary of missing artifacts
- See `docs/missing_builds_report.json` (generated). Prioritize native apps and zero-sized artifacts (icons, manifests).

High-level priorities
1. Core runtime & monitoring
   - Ensure `scripts/qmoi_supervisor.sh` is installed on the production host (systemd unit or container entrypoint).
   - Healthcheck: `/scripts/qmoi_healthcheck.sh` produces `.qmoi/healthcheck.json`. Configure your monitoring to fetch this file and alert on `overall_ok: false`.

2. Web PWAs (quick wins)
   - `pwa_apps/q-alpha`, `pwa_apps/qmoi`, `pwa_apps/qmoi-ai` appear in inventory.
   - Build steps (example):
     - Setup Node 18+ in runner.
     - cd pwa_apps/{app}
     - npm ci
     - npm run build
     - Archive the `build/` or `dist/` output as a release artifact
   - GitHub Actions job sketch:
     - name: Build PWA q-alpha
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: '18'
         - run: |
             cd pwa_apps/q-alpha
             npm ci
             npm run build
         - uses: actions/upload-artifact@v4
           with:
             name: q-alpha-dist
             path: pwa_apps/q-alpha/build

3. Android builds
   - Path: `mobile/android`
   - Requirements: Android SDK, Gradle, keystore file and password (store in repo secrets), GitHub runner with proper JDK.
   - Build commands:
     - ./gradlew assembleRelease
     - Artifact: `app/build/outputs/apk/release/app-release.apk`
   - CI job notes: Use `actions/checkout`, setup Java (temurin), setup Android SDK (actions/setup-android), insert keystore via secrets, run Gradle, upload artifact.

4. Icons & manifests (small but important)
   - Zero-sized icons (e.g., `pwa_apps/qmoi/icon-192.png`) should be replaced with final assets. You can either commit final images or prepare signed artifacts in CI.

5. Other native platforms (iOS, smartTV, Raspberry)
   - iOS/macOS require macOS runners and Apple signing credentials.
   - Smart TV or Raspberry builds typically require platform toolchains; containerized cross-builders are recommended.

Release & signing steps
- After successful build jobs, add a release job that collects artifacts and drafts a GitHub Release. Use `actions/create-release` and `actions/upload-release-asset`.
- Keep signing keys in repository/org secrets and restrict to release workflows.

Monitoring & post-deploy
- Configure healthcheck polling (every 30–60s) and set alert thresholds for disk usage and webhook queue depth.
- Integrate `.qmoi/healthcheck.json` into your Prometheus/Grafana or a simple alerting lambda.

Estimated runner/time costs (rough)
- PWA builds: ~3–6 minutes per app on ubuntu-latest.
- Android builds: ~6–20 minutes depending on caching.
- iOS builds: 8–30 minutes on macOS runners; requires paid resources.

Next steps I can take for you (pick one):
- Scaffold GitHub Actions jobs for the PWAs found (I can add jobs for q-alpha, qmoi, qmoi-ai).
- Add an Android build job template (needs keystore secret placeholders).
- Create placeholder icon files in-place (only with explicit approval).

Limitations
- I cannot perform signing or upload to external stores without secrets and credentialed runners.
- I cannot push or open GitHub PRs without your approval.

Contact
- When ready, say: `Commit and push` to have me push the branch and open a draft PR, or `Scaffold PWA builds` to add PWA build jobs now.
