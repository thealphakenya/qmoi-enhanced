<!-- AUTODEV Enhanced: 2026-04-20T09:07:01.054749 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:07.206151 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:03.029927 -->

#!/bin/bash
# QMOI Disk Usage Monitor & Auto-Cleanup
WORKSPACE="/workspaces/qmoi-enhanced"
THRESHOLD=70
USAGE=$(df "$WORKSPACE" | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$USAGE" -gt "$THRESHOLD" ]; then
  echo "Disk usage is $USAGE%. Running auto-cleanup..."
  find "$WORKSPACE" -type f -size +10M -not -path "$WORKSPACE/.git/*" -not -path "$WORKSPACE/node_modules/*" -exec rm -f {} \;
  echo "Cleanup complete. Disk usage now: $(df "$WORKSPACE" | awk 'NR==2 {print $5}')"
else
  echo "Disk usage is $USAGE%. No cleanup needed."
fi
