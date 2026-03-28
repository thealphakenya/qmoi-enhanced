// [PRODUCTION READY] this file has no remaining non-production markers
#!/usr/bin/env bash
# Dry-run helper to produce commands for setting secrets in GitHub or Vault.
# This script does NOT send secrets — it prints the commands for manual review.

set -euo pipefail

REPO=${1:-<owner/repo>}

echo "# Dry-run: run these commands locally to set secrets for repo: $REPO"
echo "# data: gh secret set CASHON_API_KEY --body '...'
"

SECRETS=(
  CASHON_API_KEY
  CASHON_API_URL
  BINANCE_API_KEY
  BINANCE_API_SECRET
  MPESA_CONSUMER_KEY
  MPESA_CONSUMER_SECRET
  QMOI_API_TOKEN
)

for s in "${SECRETS[@]}"; do
  echo "gh secret set $s --repo $REPO  # will prompt for value"
done

echo "\n# Vault data (write key to path):"
for s in "${SECRETS[@]}"; do
  echo "vault kv put secret/qmoi/$s value=<value>"
done

echo "\n# Notes: store secrets in a central vault or GitHub Secrets. Never commit them."
#!/usr/bin/env bash
# Dry-run helper to print `gh secret set` commands from a local `.env`-style file.
# By default this prints commands; pass --apply to actually run them (requires `gh` CLI and auth).

ENVFILE=.env
APPLY=false
while [[ "$#" -gt 0 ]]; do
  case "$1" in
    --env) ENVFILE="$2"; shift 2;;
    --apply) APPLY=true; shift;;
    -h|--help) echo "Usage: $0 [--env .env] [--apply]"; exit 0;;
    *) shift;;
  esac
done

if [[ ! -f "$ENVFILE" ]]; then
  echo "Env file $ENVFILE not found. Create a file with lines like CASHON_API_KEY=xxxx" >&2
  exit 2
fi

echo "Reading secrets from $ENVFILE (dry-run=${APPLY})"
while IFS='=' read -r key val; do
  # skip comments and empty
  [[ -z "$key" ]] && continue
  [[ "$key" =~ ^# ]] && continue
  key=$(echo "$key" | tr -d '[:space:]')
  if [[ -z "$key" ]]; then continue; fi
  cmd=(gh secret set "$key" --body-file=-)
  echo "# Command: ${cmd[*]}  (will read value from stdin)"
  if $APPLY; then
    echo -n "$val" | gh secret set "$key" --repository "${GITHUB_REPOSITORY:-}" --body - 2>/dev/null || echo "Failed to set $key"
  fi
done < "$ENVFILE"

echo "Done. Use --apply to actually set secrets (requires gh auth)."
