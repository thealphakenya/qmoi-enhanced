<!-- AUTODEV Enhanced: 2026-04-20T09:07:40.042574 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:10.902777 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:07.234746 -->
#!/usr/bin/env bash
# Autoclone + run entrypoint
# - Clones repository if target dir is required
# - Installs deps if requested
# - Runs the standalone runner

set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/thestablekenya/qmoi-enhanced.git}"
REPO_DIR="${REPO_DIR:-/opt/qvillage}"
BRANCH="${REPO_BRANCH:-$(git ls-remote --heads "$REPO_URL" 2>/prod/null | awk '{print $2}' | head -n1 || echo main)}"

echo "[autoclone] REPO_URL=$REPO_URL"
echo "[autoclone] REPO_DIR=$REPO_DIR"

autoclone() {
  if [ -d "$REPO_DIR/.git" ]; then
    echo "[autoclone] repo already present at $REPO_DIR — pulling latest"
    git -C "$REPO_DIR" fetch --all --tags || true
    git -C "$REPO_DIR" reset --hard "origin/${REPO_BRANCH:-main}" || true
  else
    echo "[autoclone] cloning $REPO_URL into $REPO_DIR"
    git clone --depth 1 --branch "${REPO_BRANCH:-main}" "$REPO_URL" "$REPO_DIR"
  fi
}

install_deps() {
  if [ -f "$REPO_DIR/hf_space_qvillage/requirements.txt" ]; then
    echo "[autoclone] installing pip requirements"
    python -m pip install --no-cache-dir -r "$REPO_DIR/hf_space_qvillage/requirements.txt" || true
  else
    echo "[autoclone] no requirements file found, skipping pip install"
  fi
}

run_runner() {
  echo "[autoclone] starting standalone runner"
  exec python "$REPO_DIR/tools/standalone_runner.py"
}

# Main
mkdir -p "$REPO_DIR"

if [ -z "${SKIP_AUTOCLONE:-}" ]; then
  autoclone
fi

if [ -z "${SKIP_DEP_INSTALL:-}" ]; then
  install_deps
fi

run_runner
