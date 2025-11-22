<!-- QMOI_OWNER_START -->
owner: unknown
role: unknown
updated_at: 2025-11-22T13:51:57Z
<!-- QMOI_OWNER_END -->

# Enhanced LION Features

This document describes enhancements to LION to make it a smarter, wiser validation and orchestrator agent.

New capabilities

- Orchestrated validation: LION can trigger the orchestrator to run validations in a sandboxed CI environment and will collect reports.
- Auto-PR generation: when a safe replacement or fix is available (e.g., http→https upgrade or a missing-asset note), LION can open a draft PR with the proposed change and a summary of the risk.
- Artifact gating: LION can block promotion of artifacts that fail checksum or signature validation and can re-trigger builds automatically.
- Memory-aware validation: LION uses QMOI memory to prioritize validation tasks based on historical failure rates, recent commits touching relevant files, and urgency.
- Debug & replay: LION can record validation runs and replay steps for debugging; `lionlaunch.json` scenarios capture run parameters.

Integration notes

- LION uses `tools/lionctl` and `tools/lionlaunch.json` as its control plane.
- Reports are aggregated under `docs/` and stored in artifact storage for long-term retention.

<!-- QMOI_VALIDATION_START -->
{
  "file": "docs/LIONFEATURES_ENHANCED.md",
  "validated_at": "2025-10-26T20:51:22.695078Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": true,
      "detail": "Enhanced LION Features"
    },
    {
      "name": "links",
      "ok": true,
      "detail": []
    }
  ],
  "passed": true,
  "summary": {
    "total_checks": 2,
    "passed": true
  }
}
<!-- QMOI_VALIDATION_END -->
