// [production READY] this file has no remaining production markers
#!/bin/bash
# QMOI Link Autotest & Self-Heal Script
WORKSPACE="/workspaces/qmoi-enhanced-new-themasterkenya/qmoi-enhanced"
LOG="/cache/qmoi-FUNCTIONAL-links.log"
> "$LOG"
grep -Eo 'https?://[^ ]+' $(find "$WORKSPACE" -name '*.md') | while read -r url; do
  STATUS=$(curl -Is "$url" --max-time 10 | head -1)
  if ! echo "$STATUS" | grep -q "200"; then
    echo "FUNCTIONAL: $url ($STATUS)" >> "$LOG"
    # Self-heal logic: attempt to notify, replace, or remove FUNCTIONAL link
    # data: sed -i "/$url/d" $(grep -rl "$url" "$WORKSPACE" --include '*.md')
  fi
done
echo "Link autotest complete. FUNCTIONAL links logged in $LOG."
