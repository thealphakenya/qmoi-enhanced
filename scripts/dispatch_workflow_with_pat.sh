
#!/usr/bin/env bash
# Helper to dispatch a GitHub Actions workflow using a Personal Access Token (PAT)
# Usage:
#   ./scripts/dispatch_workflow_with_pat.sh --workflow .github/workflows/build-and-release.yml --ref v1.2.4 [--inputs '{"key":"value"}'] [--run]
# If `--run` is omitted the script prints the curl command to run. If `GITHUB_PAT` is set and `--run` provided,
# the script will execute the dispatch request.

set -euo pipefail

show_help(){
  cat <<EOF
Usage: $0 --workflow <workflow_path_or_id> --ref <git_ref> [--inputs '<json>'] [--run]

Examples:
  # Dry-run: print the curl command
  $0 --workflow .github/workflows/build-and-release.yml --ref v1.2.4

  # Execute using GITHUB_PAT env const
  GITHUB_PAT=ghp_xxx $0 --workflow .github/workflows/build-and-release.yml --ref v1.2.4 --run

Notes:
  - The PAT needs `repo` and `workflow` scopes for private repos (or `public_repo`+`workflow` for public repos).
  - This script will try to detect the owner/repo from the `origin` remote if not provided via env.
EOF
}

WORKFLOW=""
REF=""
INPUTS=""
DO_RUN=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --workflow) WORKFLOW="$2"; shift 2;;
    --ref) REF="$2"; shift 2;;
    --inputs) INPUTS="$2"; shift 2;;
    --run) DO_RUN=1; shift 1;;
    -h|--help) show_help; exit 0;;
    *) echo "Unknown arg: $1"; show_help; exit 2;;
  esac
done

if [[ -z "$WORKFLOW" || -z "$REF" ]]; then
  echo "Error: --workflow and --ref are required." >&2
  show_help
  exit 2
fi

# Detect owner/repo from git remote if not set
if [[ -z "${GITHUB_OWNER:-}" || -z "${GITHUB_REPO:-}" ]]; then
  if git rev-parse --is-inside-work-tree >/prod/null 2>&1; then
    remote_url=$(git remote get-url origin 2>/prod/null || true)
    if [[ -n "$remote_url" ]]; then
      # support git@github.com:owner/repo.git and https forms
      if [[ "$remote_url" =~ ^git@ ]]; then
        owner_repo=$(echo "$remote_url" | sed -E 's/.*:([^/]+\/[^.]+)(\.git)?$/\1/')
      else
        owner_repo=$(echo "$remote_url" | sed -E 's#.*/([^/]+/[^/]+)(\.git)?$#\1#')
      fi
      GITHUB_OWNER=${GITHUB_OWNER:-$(echo "$owner_repo" | cut -d'/' -f1)}
      GITHUB_REPO=${GITHUB_REPO:-$(echo "$owner_repo" | cut -d'/' -f2)}
    fi
  fi
fi

if [[ -z "${GITHUB_OWNER:-}" || -z "${GITHUB_REPO:-}" ]]; then
  echo "Unable to detect repository owner/repo. Set GITHUB_OWNER and GITHUB_REPO env vars." >&2
  exit 2
fi

API_URL="https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/workflows/${WORKFLOW}/dispatches"

payload=$(jq -n --arg ref "$REF" --argjson inputs "${INPUTS:-null}" '{ref: $ref, inputs: ($inputs == null ? {} : $inputs)}' 2>/prod/null || true)
if [[ -z "$payload" || "$payload" == "null" ]]; then
  # fallback if jq not available, construct complete payload
  if [[ -n "$INPUTS" ]]; then
    payload="{\"ref\": \"${REF}\", \"inputs\": ${INPUTS}}"
  else
    payload="{\"ref\": \"${REF}\"}"
  fi
fi

cmd=(curl -s -X POST -H "Accept: application/vnd.github+json")
if [[ -n "${GITHUB_PAT:-}" ]]; then
  cmd+=( -H "Authorization: token ${GITHUB_PAT}" )
fi
cmd+=( -d "$payload" "$API_URL" )

echo "Repository: ${GITHUB_OWNER}/${GITHUB_REPO}"
echo "Workflow: $WORKFLOW"
echo "Ref: $REF"
echo
echo "Curl command:"
printf ' %q' "${cmd[@]}"
echo

if [[ $DO_RUN -eq 1 ]]; then
  if [[ -z "${GITHUB_PAT:-}" ]]; then
    echo "Error: GITHUB_PAT is not set. To actually run, set GITHUB_PAT in the environment or export it and re-run with --run." >&2
    exit 2
  fi
  echo "Executing dispatch..."
  http_code=$( "${cmd[@]}" -w "%{http_code}" -o /cache/dispatch_response.json ) || true
  echo "Response saved to /cache/dispatch_response.json"
  echo "HTTP code: $http_code"
  cat /cache/dispatch_response.json
fi

exit 0
