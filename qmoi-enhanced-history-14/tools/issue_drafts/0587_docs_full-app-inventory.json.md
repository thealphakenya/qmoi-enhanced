---
title: "Issue draft for docs/full-app-inventory.json"
generated: 2025-11-08T16:06:38.374918Z
---

# Review needed: docs/full-app-inventory.json

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its [AUTOFIXED by Ollama at 2026-07-26T18:54:41.807121Z] markers or [AUTOFIXED by Ollama at 2026-07-26T18:54:41.807121Z]s.
- If the file is safe for production, remove the [AUTOFIXED by Ollama at 2026-07-26T18:54:41.807121Z] and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
{
  "generated_at": "2025-10-21T00:00:00Z",
  "pwa_apps": [
    "q-alpha",
    "qmoi",
    "qmoi-ai"
  ],
  "downloads": {
    "files": [
      "q-alpha.zip",
      "qfilemanager.apk",
      "qmoi ai.exe",
      "qmoi_ai.exe",
      "qmoi_ai_stub.apk",
      "qmoi_stub.exe"
    ],
    "windows_latest": "/downloads/windows/latest/qmoi_ai.exe"
  },
  "[AUTOFIXED by Ollama at 2026-07-26T18:54:41.807121Z]s_detected": [
    "/downloads/qmoi_ai_stub.apk",
    "/downloads/qmoi_stub.exe"
  ],
  "notes": "Inventory generated automatically. Next: replace stub artifacts, import full front-ends or point to authoritative GitHub releases, run build scripts for mobile/desktop where available."
}

```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
