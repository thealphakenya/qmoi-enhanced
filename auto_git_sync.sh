#!/bin/bash
# QMOI Enhanced Auto Git Sync & Backup Script
set -e
BRANCH=$(git rev-parse --abbrev-ref HEAD)
REPO_URL=$(git remote get-url origin)

# Add and commit all changes
if ! git diff --quiet || ! git diff --cached --quiet; then
  git add -A
  git commit -m "auto: sync and backup at $(date '+%Y-%m-%d %H:%M:%S')" || true
fi

# Try to rebase and push to main branch
if git pull --rebase origin $BRANCH; then
  if ! git push origin $BRANCH; then
    # If push fails, create a backup branch and push there
    BACKUP_BRANCH="autosync-backup-$(date '+%Y%m%d-%H%M%S')"
    git checkout -b $BACKUP_BRANCH
    git push origin $BACKUP_BRANCH
    git checkout $BRANCH
  fi
else
  # If rebase fails, try a merge and push
  git pull --no-rebase --allow-unrelated-histories || true
  if ! git push origin $BRANCH; then
    BACKUP_BRANCH="autosync-backup-$(date '+%Y%m%d-%H%M%S')"
    git checkout -b $BACKUP_BRANCH
    git push origin $BACKUP_BRANCH
    git checkout $BRANCH
  fi
fi
