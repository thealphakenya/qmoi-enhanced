#!/usr/bin/env bash
set -euo pipefail

OUT=docs/static_checks_report.txt
echo "Static checks run at: $(date -u -Iseconds)" > "$OUT"

echo "\n-- Python syntax checks (py_compile) --" >> "$OUT"
PY_FILES=$(find . -path './.venv' -prune -o -name '*.py' -print)
BAD_PY=0
for f in $PY_FILES; do
  if python3 -m py_compile "$f" 2>> "$OUT"; then
    :
  else
    echo "PY SYNTAX ERROR: $f" >> "$OUT"
    BAD_PY=$((BAD_PY+1))
  fi
done
echo "Python files checked: $(echo "$PY_FILES" | wc -w), failures: $BAD_PY" >> "$OUT"

echo "\n-- Shell script syntax checks (bash -n) --" >> "$OUT"
SH_FILES=$(find scripts -maxdepth 2 -type f -name '*.sh' -print || true)
BAD_SH=0
for f in $SH_FILES; do
  if bash -n "$f" 2>> "$OUT"; then
    :
  else
    echo "BASH SYNTAX ERROR: $f" >> "$OUT"
    BAD_SH=$((BAD_SH+1))
  fi
done
echo "Shell scripts checked: $(echo "$SH_FILES" | wc -w), failures: $BAD_SH" >> "$OUT"

echo "\n-- Short summary --" >> "$OUT"
echo "PY_FAILS=$BAD_PY" >> "$OUT"
echo "SH_FAILS=$BAD_SH" >> "$OUT"

echo "Wrote $OUT"
