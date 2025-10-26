# LION Validation

Purpose

Define how the LION runtime validates configuration, permissions, orchestrator access, and self-heal procedures that QMOI relies on.

Capabilities

- Permission checks: verify required OS/user permissions for orchestration (sudo, access to package managers, network egress to artifact storage).
- Environment checks: ensure required tools (docker, jq, curl, tar, unzip, rpm/dpkg) are present.
- Policy enforcement: LION validates that only signed artifacts are promoted to production when signatures are in use.
- Self-heal triggers: if validation fails, LION can run pre-configured recovery steps (retry, re-trigger CI, rollback to previous artifact).

Integration

- LION interacts with the orchestrator using `tools/lionctl` and `tools/lionlaunch.json`.
- Validation runs produce artifact reports and remediation suggestions.

