Auto-fix and Rebase automation
=================================

Files added:
- `scripts/auto_fix.sh` - attempts formatting, linting, tests, and a rebase/merge; pushes branch and can create & merge a PR via the GitHub API.
- `.github/workflows/auto_fix.yml` - runs the script on PR open/sync and manual dispatch.

Configuration / Secrets:
- `AUTOMERGE_TOKEN` (optional) - a personal access token with `repo` and `pull_request` permissions. If not provided, the `GITHUB_TOKEN` will be used (note: `GITHUB_TOKEN` may not have permissions to merge depending on repo settings).

Limitations and safety notes:
- Automatic conflict resolution is limited. The script attempts a non-destructive strategy but may fail on complex conflicts. Human review is recommended.
- For strict branch protection rules (required reviews, status checks), automatic merges may be blocked.
- The workflow uses `jq` and `curl` for API interactions.

Next steps:
1. Add the `AUTOMERGE_TOKEN` secret in the repository settings if you want to use a token with broader permissions.
2. Adjust `TARGET_BRANCH` or workflow triggers as required.
