#!/usr/bin/env bash
# Create a pull request on the upstream repo using the GitHub API.
# Usage: create_upstream_pr.sh <upstream_owner> <upstream_repo> <branch> <title> <body>
set -euo pipefail

if [ "$#" -lt 5 ]; then
  echo "Usage: $0 <upstream_owner> <upstream_repo> <branch> <title> <body>"
  exit 1
fi

UP_OWNER=$1
UP_REPO=$2
BRANCH=$3
TITLE=$4
BODY=$5

if [ -z "${UPSTREAM_PAT:-}" ]; then
  echo "UPSTREAM_PAT is required in the environment"
  exit 1
fi

API_URL="https://api.github.com/repos/${UP_OWNER}/${UP_REPO}/pulls"

# Check if a PR already exists for this head branch
EXISTS=$(curl -s -H "Authorization: token ${UPSTREAM_PAT}" "https://api.github.com/repos/${UP_OWNER}/${UP_REPO}/pulls?head=${BRANCH}&state=open" | jq '.[0] != null')
if [ "$EXISTS" = "true" ]; then
  echo "A pull request already exists for branch ${BRANCH} on ${UP_OWNER}/${UP_REPO}. Skipping creation."
  exit 0
fi

PAYLOAD=$(jq -n --arg t "$TITLE" --arg h "$BRANCH" --arg b "$BODY" '{title:$t, head:$h, base:"main", body:$b}')

RESP=$(curl -s -o /dev/stderr -w "%{http_code}" -X POST -H "Authorization: token ${UPSTREAM_PAT}" -H "Content-Type: application/json" -d "$PAYLOAD" "$API_URL" ) || true

if [ "$RESP" = "201" ]; then
  echo "Pull request created successfully."
  exit 0
else
  echo "Failed to create pull request. HTTP status: $RESP"
  exit 2
fi
