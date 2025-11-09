---
title: "Issue draft for release.json"
generated: 2025-11-08T16:06:38.958993Z
---

# Review needed: release.json

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its placeholder markers or TODOs.
- If the file is safe for production, remove the placeholder and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
{
  "version": "v1.0.1",
  "title": "QMOI v1.0.1 - Universal Fix & Deployment",
  "changelog": "✅ All apps rebuilt, verified, installable, and now cross-platform auto-validated.\n\n- Android APKs\n- Windows EXEs\n- iOS IPAs\n- macOS Universal\n- Linux, RaspberryPi, QCity\n\nFixes:\n- Auto-repair support\n- Install test via emulator\n- GitHub asset publishing\n- Debug system enhanced"
}

```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
