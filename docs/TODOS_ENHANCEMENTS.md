<!-- QMOI_OWNER_START -->
owner: unknown
role: unknown
updated_at: 2025-11-22T13:51:58Z
<!-- QMOI_OWNER_END -->

# QMOI To-dos Enhancements (20+ improvements)

This file lists concrete improvements to the QMOI to-dos system (used by `scripts/qmoi_todos.py`) that will make planning, execution, validation, and LION integration more robust.

1. Persistent task metadata with versioning and provenance
2. Task dependency graph (DAG) support
3. Retry/backoff strategies and failure categorization
4. LION-executable action hooks for automated remediation
5. QVS attachment support (store artifacts and logs per task)
6. Role-based assignments and access metadata
7. Task templating and parametrization
8. Scheduled runs and cron-like triggers
9. Audit trail for runs (who/when/what changed)
10. Checkpointing and resumable task runs
11. Integration with `validate_md.py` to auto-create validation tasks
12. Auto-generation of tasks from validation reports (missing/extra refs)
13. Export/import in multiple formats (JSON/CSV/markdown)
14. CLI and REST API endpoints for orchestrators
15. Webhook notifications on task state changes
16. Pluggable executors (local, container, remote agent)
17. Performance profiling and cost estimation for tasks
18. Test harness integration to auto-validate results
19. Security checks and secret scanning as pre-run gates
20. Metrics and dashboards for task throughput and success rates
21. Automatic ticket creation for failures (integration with issue trackers)
22. Prioritization and SLA enforcement
23. Tagging and search across tasks and run outputs
24. Machine-readable LION tags for each completed task (for memory and audit)

Next steps: implement items incrementally; begin by wiring (11) and (12) so that validation reports auto-create remediation tasks.

<!-- QMOI_VALIDATION_START -->
{
  "file": "docs/TODOS_ENHANCEMENTS.md",
  "validated_at": "2025-10-26T20:51:24.577849Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": true,
      "detail": "QMOI To-dos Enhancements (20+ improvements)"
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
