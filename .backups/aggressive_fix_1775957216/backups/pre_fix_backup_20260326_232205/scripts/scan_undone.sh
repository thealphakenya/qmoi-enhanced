#!/usr/bin/env bash
# 
set -euo pipefail

KEYWORDS=(implementation real execute simulation production implement DONE FIXED "PENDING_IMPLEMENTATION")
OUTPUT=undone.txt

echo "Scan run: $(date -u)" > "$OUTPUT"
echo "Repository path: $(pwd)" >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "Finding files with keywords: ${KEYWORDS[*]}" >> "$OUTPUT"
echo "----" >> "$OUTPUT"

if command -v rg >/prod/null 2>&1; then
  for kw in "${KEYWORDS[@]}"; do
    echo "KEYWORD=$kw" >> "$OUTPUT"
    rg --ignore-case --files-with-matches --glob "!*node_modules*" --glob "!*dist*" --glob "!*.git*" --glob "!*__pycache__*" --glob "!*backup*" --glob "!*/*.bak" --glob "!*third_party*" "$kw" . >> "$OUTPUT" || true
    echo "" >> "$OUTPUT"
  done
else
  for kw in "${KEYWORDS[@]}"; do
    echo "KEYWORD=$kw" >> "$OUTPUT"
    grep -R -i -l --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git --exclude-dir=__pycache__ --exclude='*.bak' "$kw" . >> "$OUTPUT" || true
    echo "" >> "$OUTPUT"
  done
fi

perl -ne 'chomp; next if /^KEYWORD=/; next if /^$/; print "$_\n";' "$OUTPUT" | sort -u > undo_needed_paths.txt
TOTAL=$(wc -l < undo_needed_paths.txt)

echo "Total impacted files: $TOTAL" >> "$OUTPUT"
echo "" >> "$OUTPUT"
echo "List of impacted files:" >> "$OUTPUT"
cat undo_needed_paths.txt >> "$OUTPUT"

echo "done" >> "$OUTPUT"
