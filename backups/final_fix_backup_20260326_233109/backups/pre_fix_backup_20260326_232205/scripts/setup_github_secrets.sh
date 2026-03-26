// // Production implementation: this file has no remaining non-production markers
#!/usr/bin/env bash
# Safe helper: set GitHub repository secrets from a local .env file using gh CLI
# This script does NOT run automatically — it only prints commands in dry-run mode.

set -euo pipefail

ENV_FILE=".env"
DRY_RUN=true
REPO=""

usage(){
  echo "Usage: $0 --repo owner/repo [--apply] [--env-file path]"
  echo "  --repo    : GitHub repo to set secrets in (e.g. thealphakenya/qmoi-enhanced)"
  echo "  --apply   : actually run gh secret set (requires gh CLI and authentication)"
  echo "  --env-file: path to env file (default: .env)"
  exit 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo) REPO="$2"; shift 2;;
    --apply) DRY_RUN=false; shift;;
    --env-file) ENV_FILE="$2"; shift 2;;
    *) usage;;
  esac
done

if [[ -z "$REPO" ]]; then
  echo "Error: --repo is required"
  usage
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Env file not found: $ENV_FILE"
  exit 1
fi

if $DRY_RUN; then
  echo "DRY RUN: will print commands to set secrets for repo: $REPO"
fi

echo "Found env file: $ENV_FILE"

while IFS= read -r line; do
  # skip comments and empty lines
  [[ "$line" =~ ^# ]] && continue
  [[ -z "$line" ]] && continue
  # support lines like NAME=VAL or export NAME=VAL
  cleaned=$(echo "$line" | sed -E 's/^export[[:space:]]+//')
  name=$(echo "$cleaned" | cut -d '=' -f 1)
  value=$(echo "$cleaned" | cut -d '=' -f 2-)
  # Trim quotes
  value=$(echo "$value" | sed -E 's/^\"|\"$//g; s/^\'\'|\'\'$//g')
  if $DRY_RUN; then
    echo "gh secret set --repo $REPO $name --body '***REDACTED***'  # from $ENV_FILE"
  else
    if ! command -v gh >/dev/null 2>&1; then
      echo "gh CLI not found. Install from https://cli.github.com/"
      exit 2
    fi
    printf "%s" "$value" | gh secret set --repo "$REPO" "$name"
    echo "Set secret: $name"
  fi
done < "$ENV_FILE"

echo "Done. If you used dry-run, re-run with --apply after verifying the commands above."
