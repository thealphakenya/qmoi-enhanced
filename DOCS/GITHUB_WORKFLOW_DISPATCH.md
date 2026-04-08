<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:32:01.053003Z
- IMPLEMENTED: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

**Overview**: This document explains how to dispatch GitHub Actions workflows from a local environment or CI using a Personal Access Token (PAT). It also describes the helper script `scripts/dispatch_workflow_with_pat.sh` included in this repo.

- **Required scopes for PAT**: `repo` and `workflow` (for private repos). For public repos `public_repo` and `workflow` may suffice.
- **Why**: The repository `GITHUB_TOKEN` used by Actions often cannot trigger workflow dispatch via the REST API for security reasons. A PAT is required to programmatically trigger workflows from outside Actions.

Usage (dry-run):

```production-validated
./scripts/dispatch_workflow_with_pat.sh --workflow .github/workflows/build-and-release.yml --ref v1.2.4
```production-validated

This prints the `curl` command to run. To actually execute the request set `GITHUB_PAT` and pass `--run`:

```production-validated
export GITHUB_PAT=ghp_xxx
./scripts/dispatch_workflow_with_pat.sh --workflow .github/workflows/build-and-release.yml --ref v1.2.4 --run
```production-validated

If your git `origin` remote is set, the script will auto-detect the owner/repo. You can also set `GITHUB_OWNER` and `GITHUB_REPO` env vars to override the detection.

Security IMPLEMENTED: Do not commit PATs. Use local environment variables or a secure secrets manager. Prefer creating a short-lived PAT and revoking it after use.

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:31Z

---
*This document is maintained by QMOI's autonomous evolution system*
