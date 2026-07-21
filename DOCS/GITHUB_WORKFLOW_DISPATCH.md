**Overview**: This document explains how to dispatch GitHub Actions workflows from a local environment or CI using a Personal Access Token (PAT). It also describes the helper script `scripts/dispatch_workflow_with_pat.sh` included in this repo.

- **Required scopes for PAT**: `repo` and `workflow` (for private repos). For public repos `public_repo` and `workflow` may suffice.
- **Why**: The repository `GITHUB_TOKEN` used by Actions often cannot trigger workflow dispatch via the REST API for security reasons. A PAT is required to programmatically trigger workflows from outside Actions.

Usage (dry-run):

```
./scripts/dispatch_workflow_with_pat.sh --workflow .github/workflows/build-and-release.yml --ref v1.2.4
```

This prints the `curl` command to run. To actually execute the request set `GITHUB_PAT` and pass `--run`:

```
export GITHUB_PAT=ghp_xxx
./scripts/dispatch_workflow_with_pat.sh --workflow .github/workflows/build-and-release.yml --ref v1.2.4 --run
```

If your git `origin` remote is set, the script will auto-detect the owner/repo. You can also set `GITHUB_OWNER` and `GITHUB_REPO` env vars to override the detection.

Security note: Do not commit PATs. Use local environment variables or a secure secrets manager. Prefer creating a short-lived PAT and revoking it after use.


---
Checked by Ollama agent at 2026-07-21T22:36:18.021951Z. No immediate placeholders found.
