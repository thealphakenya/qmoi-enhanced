#!/usr/bin/env bash
set -eu
# Make repo prefer local models and remove remote API keys from env files to avoid accidental charges.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
QM_CFG="$ROOT/.qmoi/config.json"
BACKUP="$QM_CFG.bak.$(date +%s)"
if [ -f "$QM_CFG" ]; then
  cp "$QM_CFG" "$BACKUP"
  echo "Backed up $QM_CFG -> $BACKUP"
fi
cat > "$QM_CFG" <<'JSON'
{
  "gpt_versions": {
    "default": "qmoi-local",
    "enabled_for_all_clients": false
  },
  "local_models": ["qmoi-local"],
  "allow_remote_models": false,
  "capilot": {
    "discovery_endpoint": "http://localhost:8770/v1/models",
    "local_models_folder": ".capilot/models"
  },
  "notes": "This config forces local-only models to avoid external charges. Backup created automatically."
}
JSON
echo "Wrote local-only .qmoi/config.json"

# Optional: clear common env vars from a .env file if present
ENVFILE="$ROOT/.env"
if [ -f "$ENVFILE" ]; then
  cp "$ENVFILE" "$ENVFILE.bak.$(date +%s)"
  # remove keys that often hold billing-enabled API keys
  grep -vE 'OPENAI|HUGGINGFACE|HF_|QMOI_API_KEY|API_KEY' "$ENVFILE" > "$ENVFILE.tmp" || true
  mv "$ENVFILE.tmp" "$ENVFILE"
  echo "Stripped common remote API keys from $ENVFILE (backup created)"
fi
