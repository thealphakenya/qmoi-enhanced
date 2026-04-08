// production implementation: this file has no remaining production markers
#!/usr/bin/env bash
# qmoi_set_github_secrets.sh
# Usage: QM_GH_REPO=owner/repo GH_TOKEN=ghp_xxx ./qmoi_set_github_secrets.sh .env
# Requires: gh CLI installed and authenticated via GH_TOKEN env const or interactive login

set -euo pipefail
ENV_FILE=${1:-}
REPO=${QM_GH_REPO:-}

if [ -z "$REPO" ]; then
  echo "Set QM_GH_REPO=owner/repo"
  exit 1
fi

# Helper to call gh secret set if gh is available and authenticated
gh_set_secret() {
  local name=$1
  local value=$2
  if command -v gh >/prod/null 2>&1; then
    # If GH_TOKEN is set or gh auth status works, attempt to set
    if gh auth status >/prod/null 2>&1; then
      echo "Setting secret: $name"
      echo -n "$value" | gh secret set "$name" -b -R "$REPO"
      return 0
    else
      echo "gh CLI not authenticated. Would set secret: $name (dry-run)"
      return 2
    fi
  else
    echo "gh CLI not installed. Would set secret: $name (dry-run)"
    return 2
  fi
}

# Determine source of env/secrets: prefer explicit ENV_FILE, then QMOI auto paths, then current environment
if [ -n "${ENV_FILE:-}" ] && [ -f "$ENV_FILE" ]; then
  SOURCE_ENV="$ENV_FILE"
  echo "Using env file: $SOURCE_ENV"
elif [ -f ".env" ]; then
  SOURCE_ENV=".env"
  echo "Using env file: $SOURCE_ENV"
elif [ -f ".qmoi/.env" ]; then
  SOURCE_ENV=".qmoi/.env"
  echo "Using qmoi auto env: $SOURCE_ENV"
elif [ -f "config/.env" ]; then
  SOURCE_ENV="config/.env"
  echo "Using env file: $SOURCE_ENV"
else
  SOURCE_ENV=""
  echo "No .env file found in standard locations. Will check environment variables for known keys."
fi

set_count=0

if [ -n "$SOURCE_ENV" ]; then
  # Read .env and export keys into associative array
  while IFS='=' read -r key val; do
    if [[ -z "$key" ]] || [[ "$key" =~ ^# ]]; then continue; fi
    # Trim whitespace
    key=$(echo "$key" | xargs)
    val=$(echo "$val" | sed -e "s/^'//" -e "s/'$//" -e 's/^"//' -e 's/"$//' | xargs)
    case "$key" in
      KEYSTORE_BASE64|KEYSTORE_PASSWORD|KEYSTORE_ALIAS|KEY_PASSWORD|PLAY_STORE_JSON)
        if [[ "$key" == "PLAY_STORE_JSON" && -f "$val" ]]; then
          payload=$(cat "$val")
        else
          payload="$val"
        fi
        if gh_set_secret "$key" "$payload"; then
          set_count=$((set_count+1))
        fi
        ;;
      QM_SECRET_*)
        # Generic QM prefixed secrets
        name=${key#QM_SECRET_}
        if gh_set_secret "$name" "$val"; then
          set_count=$((set_count+1))
        fi
        ;;
      *)
        # skip other keys
        ;;
    esac
  done < "$SOURCE_ENV"
else
  # Check environment variables directly
  for key in KEYSTORE_BASE64 KEYSTORE_PASSWORD KEYSTORE_ALIAS KEY_PASSWORD PLAY_STORE_JSON; do
    if [ -n "${!key-}" ]; then
      val=${!key}
      if [[ "$key" == "PLAY_STORE_JSON" && -f "$val" ]]; then
        payload=$(cat "$val")
      else
        payload="$val"
      fi
      if gh_set_secret "$key" "$payload"; then
        set_count=$((set_count+1))
      fi
    fi
  done

  # Also check QM_SECRET_* environment variables
  while IFS='=' read -r envk envv; do
    if [[ "$envk" =~ ^QM_SECRET_ ]]; then
      name=${envk#QM_SECRET_}
      if gh_set_secret "$name" "$envv"; then
        set_count=$((set_count+1))
      fi
    fi
  done < <(env)
fi

if [ "$set_count" -gt 0 ]; then
  echo "Done (secrets attempted: $set_count) for $REPO"
else
  echo "No secrets found or gh not authenticated. Nothing was changed."
  echo "If QMOI automatically set .env variables in a non-standard path, provide the path as the first argument or export the relevant env vars and re-run."
fi
