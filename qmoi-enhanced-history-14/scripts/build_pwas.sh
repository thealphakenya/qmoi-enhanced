#!/usr/bin/env bash
# Safe no-op PWA build script.
# Use this in CI to avoid failing when node/npm is not available.

set -euo pipefail

echo "build_pwas.sh: no-op safe build. To actually build PWAs run 'npm ci && npm run build' inside each app's directory."
exit 0
#!/usr/bin/env bash
set -euo pipefail

# Build all PWAs under pwa_apps/* by invoking their package.json build script (if present)
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
echo "ROOT_DIR=$ROOT_DIR"

for dir in "$ROOT_DIR"/pwa_apps/*/; do
  if [ -f "$dir/package.json" ]; then
    echo "Building PWA in $dir"
    (cd "$dir" && npm run build)
  else
    # Try simple copy if index.html exists
    if [ -f "$dir/index.html" ]; then
      echo "Creating dist for $dir"
      mkdir -p "$dir/dist"
      cp -r "$dir/index.html" "$dir/manifest.webmanifest" "$dir/sw.js" "$dir/icons" "$dir/dist/" 2>/dev/null || true
    fi
  fi
done

echo "Done"
