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

# QMOI Model (Aggregator)

QMOI now exposes a canonical _aggregator_ model named `qmoi` which is the single source of truth for inference across the system.

## Design Goals

- Always use `qmoi` as the canonical model name in APIs and health checks.
- Aggregate results from multiple underlying model backends (local first, cloud optionally) into one deterministic response.
- Persist model state and metrics and create backups after important events.
- Prevent runtime or query-based overrides of the active model for safety and determinism.

## Behavior

- `aggregate_and_respond(messages)` collects candidate responses from configured backends.
- It merges outputs with metadata about their source and returns a single `model: "qmoi"` response payload.
- A backup is attempted after processing to ensure persistent metrics and configuration are saved.

## Configuration

Relevant config keys (in `config.json` or passed via config file):

- `ai.model.hybrid_mode` - when true, the aggregator includes cloud backends as candidates.
- `ai.model.auto_backup` - enable/disable automatic backups.
- `ai.model.backup_interval` - seconds between background backups (defaults to 3600s).

## Notes for Developers

- The current aggregator implementation is conservative and intentionally simple. Replace the placeholder inference calls with real model calls when integrating third-party models.
- Tests should assert that `model` override query params are ignored and that responses always include `model: "qmoi"`.
- Documentation and front-end UI must not expose model-selection controls to the end user unless gated and audited for master use only.

### Quick usage example (Python)

```python
from qmoi.model import QMOIModel
m = QMOIModel()
resp = m.aggregate_and_respond([{"role":"user","content":"How are you doing today?"}], validate=True)
print(resp)
# => {'success': True, 'results': [...], 'model': 'qmoi', 'metrics': {...}}
```

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
