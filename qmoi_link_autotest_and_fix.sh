#!/bin/bash
# QMOI Link Autotest & Self-Heal Script
WORKSPACE="/workspaces/qmoi-enhanced"
LOG="/tmp/qmoi-broken-links.log"
> "$LOG"
grep -Eo 'https?://[^ ]+' $(find "$WORKSPACE" -name '*.md') | while read -r url; do
  STATUS=$(curl -Is "$url" --max-time 10 | head -1)
  if ! echo "$STATUS" | grep -q "200"; then
    echo "Broken: $url ($STATUS)" >> "$LOG"
    # Self-heal logic placeholder: notify, replace, or remove broken link
  fi
done
echo "Link autotest complete. Broken links logged in $LOG."
