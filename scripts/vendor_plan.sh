#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
echo "Vendor plan helper - prints recommended commands to run on a trusted CI/QCity runner."
echo
echo "Python wheels (if you have requirements.txt):"
echo "  mkdir -p $ROOT/vendor/wheels"
echo "  pip download -r requirements.txt -d $ROOT/vendor/wheels || true"
echo
echo "Node modules (if you have package-lock.json):"
echo "  mkdir -p $ROOT/vendor/npm && cd $ROOT/vendor/npm"
echo "  # create tarballs of packages referenced in package-lock.json (example)
  jq -r '.. | objects | select(has("version")) | .name + "@" + .version' ../package-lock.json | sort -u | xargs -I pkg npm pack pkg || true"
echo
echo "After running these on CI, upload $ROOT/vendor/ as artifacts or release assets so Codespaces can use them locally."
#!/usr/bin/env bash
set -euo pipefail

# Vendor plan helper (no-op unless run on a machine with network or CI runner)
# This script prints recommended commands to vendor Python wheels and npm packages
# Use a QCity runner or allowed CI to run these commands and commit `vendor/` artifacts.

echo "Vendor plan - what to run on CI or an allowed runner"
echo
echo "1) Python: vendor wheels (example)"
echo "   mkdir -p vendor/wheels"
echo "   pip download -r requirements.txt -d vendor/wheels --no-binary=:none: || true"
echo
echo "2) Node: vendor npm packages (example uses package-lock.json)",
echo "   mkdir -p vendor/npm"
echo "   # create tarballs for each dependency (run on CI)",
echo "   npm ci --package-lock-only && npm pack <package> # see project-specific steps"
echo
echo "3) Create an archive for distribution"
echo "   tar -czf vendor-pack.tar.gz vendor/"
echo
echo "Notes:"
echo "- Run these commands in a trusted runner (QCity runner, CI, or a machine you control)."
echo "- Committing large vendor artifacts may bloat the repo; prefer release artifacts or a dedicated vendor repo if size is a concern."
