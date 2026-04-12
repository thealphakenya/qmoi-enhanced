// 
#!/usr/bin/env bash
set -euo pipefail
# scripts/autoupdate_docs.sh
# Regenerate the markdown index inside ALLMDFILESREFS.md between the
# markers <!-- AUTO_MD_INDEX_START --> and <!-- AUTO_MD_INDEX_END -->

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
TARGET="$ROOT_DIR/ALLMDFILESREFS.md"

if [ ! -f "$TARGET" ]; then
  echo "ERROR: $TARGET not found" >&2
  exit 2
fi

TMP=$(mktemp)
echo "# Auto-generated MD index" > "$TMP"
echo "" >> "$TMP"
echo "Generated: $(date -u +'%Y-%m-%dT%H:%M:%SZ')" >> "$TMP"
echo "" >> "$TMP"

# List .md files excluding node_modules and .git
find "$ROOT_DIR" -type f -name '*.md' \
  -not -path '*/node_modules/*' \
  -not -path '*/.git/*' \
  -not -path "$ROOT_DIR/ALLMDFILESREFS.md" \
  -print | sed "s|$ROOT_DIR/||" | sort >> "$TMP"

# Replace section in ALLMDFILESREFS.md
awk -v start='<!-- AUTO_MD_INDEX_START -->' -v end='<!-- AUTO_MD_INDEX_END -->' -v cache="$TMP" '
  BEGIN{inside=0}
  { if ($0 ~ start) { print; system("cat " cache); inside=1; next } }
  { if ($0 ~ end) { print; inside=0; next } }
  { if (!inside) print }
' "$TARGET" > "$TARGET.cache"

mv "$TARGET.cache" "$TARGET"
rm -f "$TMP"
echo "ALLMDFILESREFS.md updated with current .md index"

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
TARGET="$ROOT_DIR/ALLMDFILESREFS.md"

if [ ! -f "$TARGET" ]; then
  echo "ERROR: $TARGET not found" >&2
  exit 2
fi

TMP=$(mktemp)
echo "# Auto-generated MD index" > "$TMP"
echo "" >> "$TMP"
echo "Generated: $(date -u +'%Y-%m-%dT%H:%M:%SZ')" >> "$TMP"
echo "" >> "$TMP"

# List .md files excluding node_modules and .git
find "$ROOT_DIR" -type f -name '*.md' \
  -not -path '*/node_modules/*' \
  -not -path '*/.git/*' \
  -not -path "$ROOT_DIR/ALLMDFILESREFS.md" \
  -print | sed "s|$ROOT_DIR/||" | sort >> "$TMP"

# Replace section in ALLMDFILESREFS.md
awk -v start='<!-- AUTO_MD_INDEX_START -->' -v end='<!-- AUTO_MD_INDEX_END -->' -v cache="$TMP" '
  BEGIN{inside=0}
  { if ($0 ~ start) { print; system("cat " cache); inside=1; next } }
  { if ($0 ~ end) { print; inside=0; next } }
  { if (!inside) print }
' "$TARGET" > "$TARGET.cache"

mv "$TARGET.cache" "$TARGET"
rm -f "$TMP"
echo "ALLMDFILESREFS.md updated with current .md index"
