#!/usr/bin/env bash
# WARNING: This script rewrites git history. Use only after team coordination.
# It depends on `git-filter-repo` being installed. It will create a backup remote named
# `origin-backup` before force-pushing. REVIEW the script before running.

set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <pattern-file>
  pattern-file: path to a file containing newline-separated regexes or exact strings to remove"
  exit 2
fi

PATTERN_FILE="$1"

if [ ! -f "$PATTERN_FILE" ]; then
  echo "Pattern file not found: $PATTERN_FILE"
  exit 2
fi

echo "This script will rewrite repository history. Make a full backup before proceeding." 
read -p "Have you backed up the repo and informed collaborators? (yes/NO) " confirm
if [ "$confirm" != "yes" ]; then
  echo "Aborting. Please backup and coordinate with your team before running this script."
  exit 1
fi

echo "Creating a mirror clone 'repo-clean-mirror.git'..."
git clone --mirror "$(git config --get remote.origin.url)" repo-clean-mirror.git
cd repo-clean-mirror.git

echo "Running git-filter-repo with patterns from $PATTERN_FILE"
# Build regex from file
regex=$(paste -sd '|' "$PATTERN_FILE")
git filter-repo --invert-regex --regex "$regex"

echo "Pruning refs and garbage collecting..."
git reflog expire --expire=now --all || true
git gc --prune=now --aggressive || true

echo "Force-pushing cleaned history to origin..."
git push origin --force --all
git push origin --force --tags

echo "History rewrite complete. Notify collaborators to re-clone the repository."
