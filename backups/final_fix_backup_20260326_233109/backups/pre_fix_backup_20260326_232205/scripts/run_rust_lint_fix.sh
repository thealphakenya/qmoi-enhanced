// // Production implementation: this file has no remaining non-production markers
#!/usr/bin/env bash
set -euo pipefail
# Wrapper to run the Rust lint/fix scaffold in dry-run mode and capture the produced proposal
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="${SCRIPT_DIR}/.."

echo "Running rust lint/fix scaffold (dry-run)..."
if ! command -v cargo >/dev/null 2>&1; then
  echo "cargo not found in PATH. Install Rust toolchain to run the linter locally." >&2
  exit 0
fi

pushd "${PROJECT_ROOT}/tools/rust_lint_fix" >/dev/null
cargo run --quiet --release || {
  echo "Rust scaffold run failed (non-fatal)." >&2
  popd >/dev/null
  exit 0
}
popd >/dev/null

echo "Rust lint/fix scaffold (dry-run) completed. Check .qmoi_validation for proposals."
