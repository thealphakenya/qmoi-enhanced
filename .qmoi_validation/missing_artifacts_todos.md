Missing artifacts remediation todos
=================================

This file was generated from the link-normalization report. It groups missing local artifacts into actionable todos.

Top categories found (examples):

- downloads/ (windows/mac/android/linux builds) — many referenced files under `downloads/` and `downloads/*/latest/` do not exist in the repo. Create CI/upload steps or point links to release assets.
- pwa_apps/ and Qmoi_apps/ — PWA and app bundles referenced but not found. Add build/publish jobs or update links to release artifacts.
- qmoi_apps/* and Qmoi_apps/* — multiple platform binaries not found; recommend adding release assets or documenting external storage location.

Suggested remediation todos (examples you can pick from):

1) Create release artifacts for downloads/
 - Create CI job to build platform artifacts or upload prebuilt binaries to GitHub Releases or an S3 bucket.
 - Update markdown links to point to release URLs or hosted storage.

2) Publish PWA bundles
 - Build `pwa_apps/qmoi-ai-pwa.zip` and upload to releases or update link to hosted manifest.

3) Consolidate qmoi_apps artifacts
 - Provide a small script in `scripts/` that checks for the presence of expected artifacts and fails CI if missing.

4) Document artifact hosting and add a `RELEASES.md` describing where each artifact is hosted and the required CI job to produce it.

How I can help next (pick one):
- I can create GitHub Actions workflow stubs for building and publishing artifacts (will need build commands or binary sources).
- I can create per-artifact todos under `.qmoi_validation/todos.json` enumerating exact missing files (automatically parsed) — this may be large.
- I can run the conservative link-fixer script in a batch (slow) and create a PR-ready branch with backups included.
