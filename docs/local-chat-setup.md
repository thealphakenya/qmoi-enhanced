# Local Chat Helper — Setup & Usage

This document describes how to run the local chat helper, merge QMOI memory, generate context bundles, and invoke the Copilot CLI (when available). It also describes the recommended CI route for Copilot CLI smoke tests because the devcontainer may be incompatible with Node/compiled binaries.

Prerequisites
- Python 3.8+ with pip
- (Optional) Node.js + npm if you want to install the `@githubnext/copilot-cli` locally — note: the repository devcontainer is Alpine/musl and often incompatible with prebuilt Node binaries; prefer CI for Copilot CLI runs.

Quick start (local)

1. Install minimal Python deps (recommended in a venv):

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Merge local QMOI memory artifacts (writes `.qmoi_state/merged_memory.json`):

```bash
python3 scripts/qmoi_memory_sync.py
```

3. Generate a compact context bundle for assistants (writes `.qmoi_local_chat/context_bundle_*.json`):

```bash
python3 scripts/local_chat_helper.py context
```

4. Run the local Copilot runner (will call Copilot CLI if present):

```bash
bash scripts/run_local_copilot.sh
```

Notes about Copilot CLI and Node
- CI (recommended): The repository includes `.github/workflows/copilot-setup-smoke.yml` which runs on `ubuntu-latest` and installs Node/npm and `@githubnext/copilot-cli`. Open a PR from `chore/local-chat-integration-20251122T104216Z` to trigger the workflow for validation.
- Local (optional): Installing Node in the Alpine devcontainer may fail or produce incompatible binaries. If you want a local Copilot CLI installation, perform it on a native Debian/Ubuntu machine or in a compatible container image.

Resolving the repository working-tree conflict
- Your current working tree on `auto-merge/imported-theofalphakenya-20251122T092741Z` has unmerged files. Options:
  - Manual: Inspect conflicted files, resolve them locally, and commit.
  - Safe worktree: Create a new worktree/branch and apply changes there for testing. Example:

```bash
# create a clean worktree from origin/main
git fetch origin
git worktree add /tmp/qmoi_worktree_test origin/autosync-backup-20250926-232440
cd /tmp/qmoi_worktree_test
# apply or test changes here
```

Opening a PR (recommended for Copilot smoke tests)
- I can open a PR from `chore/local-chat-integration-20251122T104216Z` into the default branch for you so GitHub Actions runs the Copilot smoke checks on Ubuntu. Tell me to "Open the PR" and I will draft a short PR body and create it.

Troubleshooting
- If Python cannot import `uvicorn`, run:

```bash
pip install 'uvicorn[standard]'
```

- If you see Node binary errors in the devcontainer (e.g., "cannot execute: required file not found"), run the Copilot workflow in CI or use a different devcontainer image (Debian/Ubuntu).

Files touched by these helpers
- `scripts/qmoi_memory_sync.py` — merges `.qmoi_state/*` memory files
- `scripts/local_chat_helper.py` — creates `.qmoi_local_chat/context_bundle_*.json` and `reports/api_endpoints.json`
- `scripts/run_local_copilot.sh` — merges memory, writes full context, and calls the Copilot CLI if available

If you want, I can also add a short `Makefile` or `devcontainer` image recommendation to simplify this process.
