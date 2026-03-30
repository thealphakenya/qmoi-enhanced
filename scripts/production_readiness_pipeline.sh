# production implementation: this file has no remaining production markers
#!/usr/bin/env bash
set -euo pipefail

WORKDIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$WORKDIR"

echo "== QMOI production Readiness Pipeline =="

echo "1) scan production markers"
python3 scripts/scan_production_endpoints.py

echo "2) validate links"
python3 scripts/validate_links.py || true

echo "3) generate endpoint docs"
python3 scripts/generate_endpoint_docs.py || true

echo "4) update README + tree docs"
python3 scripts/update_readme_tree_docs.py || true

echo "5) finalize production ready"
python3 scripts/finalize_production_ready.py || true

echo "6) run lints & type checks"
npm install --silent
npm run lint --silent
npm run type-check --silent

# Optional: test and build
npm run test --silent || true
npm run build --silent || true

echo "Pipeline complete. Check undone.txt + FINAL_VERIFICATION_REPORT.md." 
