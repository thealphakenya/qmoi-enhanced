# AUTODEV OVERVIEW

This document describes the autodev (automatic developer) responsibilities and the conservative design choices implemented by the QMOI conservative pass.

Principles
- Conservative by default: All actions are dry-run unless explicitly enabled via environment gating.
- Audit everything: Every intended action is recorded to `.qmoi_validation/*` logs in JSON-lines.
- Minimal trust: No provider calls or file-writes are performed without `PRODUCTION_CONFIRMED=true`.
- Restore safety: Restores are suggestion-first (dry-run), then require explicit confirmation.

Core components
- `scripts/autodev_manager.py` - snapshot, list, suggest-restore, restore (dry-run default).
- `api/adapters/*` - adapter endpoints that are dry-run and audit their intended actions.
- `.qmoi_snapshots/` - snapshot storage (created when non-dry-run snapshots are run).
- `.qmoi_validation/` - audit logs and validation artifacts.

Gating and secrets
- Use `PRODUCTION_CONFIRMED=true` and `QMOI_ALLOW_NETWORK=true` to allow network and write operations.
- Provider-specific secrets must be set in the environment (e.g., `SENDGRID_API_KEY`, `TWILIO_ACCOUNT_SID`) and handled securely.

Next steps
- Harden snapshot manifests with signatures and optional off-site copies.
- Implement a memory index and autosync plugin.
- Add UI components to surface autodev status and action history.

For quick usage examples, see `MASTERINSTRUCTIONSREQUESTSTESTS.md`.
