#!/bin/bash
# Attempt to open the Continue panel in the running VS Code session.
set -e
echo "→ Trying to open Continue extension in VS Code..."

# Allow a short delay for the VS Code server to be ready
sleep 3

# Try multiple known command names (best-effort, harmless if not supported)
for cmd in "continue.open" "continue.toggle" "continue.start" "continue.focus"; do
  if command -v code >/dev/null 2>&1; then
    code --command "$cmd" || true
  fi
done

echo "→ Continue open commands issued (if supported by the environment)."

exit 0
