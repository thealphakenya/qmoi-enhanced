#!/usr/bin/env bash
set -euo pipefail

# Safe git helper for scripted operations
# Usage:
#  ./scripts/git_safe.sh clone <remote-url> <dest-dir>
#  ./scripts/git_safe.sh worktree-add <branch> <path>

cmd=${1:-}
if [ -z "$cmd" ]; then
  echo "Usage: $0 <clone|worktree-add> ..."; exit 2
fi

if [ "$cmd" = "clone" ]; then
  REMOTE=${2:-}
  DEST=${3:-}
  if [ -z "$REMOTE" ] || [ -z "$DEST" ]; then
    echo "Usage: $0 clone <remote-url> <dest-dir>"; exit 2
  fi
  git clone --depth 1 "$REMOTE" "$DEST"
  exit $?
fi

if [ "$cmd" = "worktree-add" ]; then
  BR=${2:-}
  PATH_DIR=${3:-}
  if [ -z "$BR" ] || [ -z "$PATH_DIR" ]; then
    echo "Usage: $0 worktree-add <branch> <path>"; exit 2
  fi
  # ensure branch exists locally (fetch if needed)
  git fetch origin "$BR":"$BR" || true
  mkdir -p "$PATH_DIR"
  git worktree add --checkout "$PATH_DIR" "$BR"
  exit $?
fi

echo "Unknown command: $cmd"; exit 2
