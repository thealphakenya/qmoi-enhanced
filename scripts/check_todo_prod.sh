#!/usr/bin/env bash
set -euo pipefail

# Fail CI if TODO_PROD occurrences are found in non-excluded files.
# Excluded (safe/auto-generated) paths:
EXCLUDE=(
  "^reports/"
  "^link_report.md$"
  "^docs/placeholders_replacement_report.json$"
  "^matches_with_comments.json"
  "^matches.json"
  "^reports/"
  "^tools/"
  "^_archive_qmoi-enhanced/"
  "\.bak$"
  "^\.git/"
  "^node_modules/"
  "^coverage/"
  "^\.qmoi_validation/"
)

# Build grep exclude args
GREP_EXCLUDES=()
for p in "${EXCLUDE[@]}"; do
  GREP_EXCLUDES+=(--exclude-dir="$p" )
done

# We'll use a different approach: perform a recursive grep and filter results by file path
set +e
mapfile -t matches < <(grep -R --line-number -n "TODO_PROD" --binary-files=without-match 2>/dev/null || true)
set -e

if [ ${#matches[@]} -eq 0 ]; then
  echo "No TODO_PROD occurrences found. ✅"
  exit 0
fi

# Filter matches: keep only those not matching any EXCLUDE pattern
bad=()
for line in "${matches[@]}"; do
  # extract filename
  file="${line%%:*}"
  skip=false
  for pat in "${EXCLUDE[@]}"; do
    if echo "$file" | grep -Eq "$pat"; then
      skip=true
      break
    fi
  done
  if [ "$skip" = false ]; then
    bad+=("$line")
  fi
done

if [ ${#bad[@]} -ne 0 ]; then
  echo "Found TODO_PROD occurrences in non-excluded files (FAIL):"
  for l in "${bad[@]}"; do
    echo "  $l"
  done
  echo "\nPlease address these occurrences or add them to the allowed exclusions in scripts/check_todo_prod.sh"
  exit 2
fi

echo "All remaining TODO_PROD occurrences are in excluded/generated files. ✅"
exit 0
