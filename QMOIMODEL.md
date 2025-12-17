---
title: "QMOI Model Overview"
qmoi_validation_frontmatter: true
---

<!-- LION_VALIDATION_START -->

## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI Model Overview

- **Multi-Backend Support**: Memory can be synced to local file, GitHub Gist, Hugging Face repo, SCP, and (optionally) Postgres/Redis. Backends are configured via environment variables and can be extended.
- **Authentication and Security**: All `/sync/*` endpoints require an API key (set via `QMOI_SYNC_API_KEY`). Unauthorized requests are rejected.
- All actions, errors, and fixes are logged in real time
- All multimodal API features are tested (see CURLCOMMANDS.md and qmoi_test.sh)
- [TRACKS.md](TRACKS.md)
- [DASHBOARDTRACKS.md](DASHBOARDTRACKS.md)
  <!-- QMOI_VALIDATION_START -->
  {
  "validator": "QMOI Lion (automated)",
  "checks": [
  "name": "title_present",
  "ok": true,
  "label": "QMOIMODELTESTS.md",
  "target": "./QMOIMODELTESTS.md",
  "ok": true
  },
  {
  "label": "CURLCOMMANDS.md",
  "target": "./CURLCOMMANDS.md",
  "ok": true
  },
  {
  "label": "TRACKS.md",
  "target": "./TRACKS.md",
  "ok": true
  },
  {
  "label": "DASHBOARDTRACKS.md",
  "target": "./DASHBOARDTRACKS.md",
  "ok": true
  }
  ]
  }
  ],
  "passed": true,
  "summary": {
  "total_checks": 2,
  "passed": true
  }
  }
  <!-- QMOI_VALIDATION_END -->

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
