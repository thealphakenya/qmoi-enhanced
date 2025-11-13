#!/usr/bin/env bash
set -euo pipefail

# git_push_resilient.sh
# Attempts to push the current branch with retries and exponential backoff.
# If push repeatedly fails (e.g., GitHub 5xx), it creates a git bundle and
# format-patch files so you can transfer them to another machine or upload
# them as an artifact/issue for manual application.

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
REMOTE="${1:-origin}"
MAX_RETRIES=${2:-6}
SLEEP_BASE=2

echo "[resilient-push] Branch: $BRANCH, Remote: $REMOTE, max-retries=$MAX_RETRIES"

attempt=0
while true; do
  attempt=$((attempt+1))
  echo "[resilient-push] Push attempt $attempt/$MAX_RETRIES..."
  if git push "$REMOTE" "$BRANCH" --set-upstream; then
    echo "[resilient-push] Push succeeded"
    exit 0
  fi

  echo "[resilient-push] Push failed"
  if [ $attempt -ge $MAX_RETRIES ]; then
    echo "[resilient-push] Reached max retries. Creating fallbacks..."
    break
  fi

  # Exponential backoff with jitter
  sleep_seconds=$((SLEEP_BASE ** attempt))
  # Add small random jitter up to 5 seconds
  jitter=$((RANDOM % 6))
  total_sleep=$((sleep_seconds + jitter))
  echo "[resilient-push] Sleeping ${total_sleep}s before retry"
  sleep $total_sleep
done

FALLBACK_DIR="$REPO_ROOT/.git_push_fallback"
mkdir -p "$FALLBACK_DIR"

# Create git bundle of the current branch
BUNDLE_FILE="$FALLBACK_DIR/${BRANCH}-bundle.bundle"
echo "[resilient-push] Creating git bundle: $BUNDLE_FILE"
git bundle create "$BUNDLE_FILE" HEAD || true

# Create format-patch files for the branch's commits not on remote (best-effort)
PATCH_DIR="$FALLBACK_DIR/patches"
mkdir -p "$PATCH_DIR"

# Determine upstream ref if available
UPSTREAM=""
if git rev-parse --verify "$REMOTE/$BRANCH" >/dev/null 2>&1; then
  UPSTREAM="$REMOTE/$BRANCH"
fi

if [ -n "$UPSTREAM" ]; then
  echo "[resilient-push] Creating patches relative to $UPSTREAM"
  git format-patch "$UPSTREAM" -o "$PATCH_DIR" || true
else
  echo "[resilient-push] No upstream ref detected; creating patches for the last 10 commits"
  git format-patch -10 -o "$PATCH_DIR" || true
fi

# Create a README with diagnostics
DIAG="$FALLBACK_DIR/README.txt"
cat > "$DIAG" <<EOF
Resilient push fallbacks for branch: $BRANCH

What happened: git push to $REMOTE failed after $MAX_RETRIES attempts.

Files created in this folder:
- Bundle: ${BUNDLE_FILE}
- Patches: ${PATCH_DIR}/*.patch
- Diagnostics: ${DIAG}

Recommended next steps:
1) Transfer the bundle or patches to a machine with working network access to GitHub.
   - To push the bundle from another machine:
       git clone --mirror <REPO_URL> repo.git
       cd repo.git
       git fetch ../path/to/${BRANCH}-bundle.bundle
       git push origin refs/heads/${BRANCH}

   - Or apply patches on another clone:
       git am /path/to/patches/*.patch
       git push origin ${BRANCH}

2) Alternatively, open an issue and attach the bundle/patches so a maintainer can apply them.

Notes:
- This script created a bundle and patches as a fallback so your work is preserved locally.
- Persistent GitHub server errors are outside the control of this repo. Use these artifacts
  to move changes to another machine or to hand off to a maintainer.
EOF

echo "[resilient-push] Fallback artifacts written to: $FALLBACK_DIR"
ls -la "$FALLBACK_DIR"
echo "[resilient-push] DONE"
exit 2
