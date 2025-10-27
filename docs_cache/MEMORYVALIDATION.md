# Memory Validation

Purpose

Validate QMOI memory subsystems (short-term cache, long-term store, snapshot/restore) and ensure data integrity, retention policies and recoverability.

Key checks

- Consistency: Ensure in-memory index and persisted store have matching IDs and checksums.
- Snapshot/restore: Periodically snapshot memory and attempt restore in a fresh environment as a smoke test.
- TTL and retention: Validate that short-term entries expire and that retention policies are enforced for long-term storage.
- Corruption detection: Use checksums/hashes to detect corruption and auto-alert/remediate.

Integration with orchestrator

- The orchestrator can run memory snapshot/restore tests in a controlled environment and produce `docs/memory_validation_report.json`.

<!-- QMOI_VALIDATION_START -->
{
  "file": "docs/MEMORYVALIDATION.md",
  "validated_at": "2025-10-26T20:51:22.700372Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": true,
      "detail": "Memory Validation"
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
