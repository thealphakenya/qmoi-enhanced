#!/bin/bash
# Best-effort: install Continue extension and attempt to open its panel.
set -e
echo "→ Ensuring Continue extension is installed and attempting to open it..."

sleep 2

CODE_CLI=""
if command -v code >/dev/null 2>&1; then
  CODE_CLI="code"
elif [ -x "/vscode/bin/remote-cli" ]; then
  CODE_CLI="/vscode/bin/remote-cli"
elif command -v "remote-cli" >/dev/null 2>&1; then
  CODE_CLI="remote-cli"
fi

if [ -n "$CODE_CLI" ]; then
  echo "Using CLI: $CODE_CLI"
  # Install extension if missing
  "$CODE_CLI" --install-extension continue.continue --force || true

  # Try opening via known commands; some CLI builds ignore --command
  for cmd in "continue.open" "continue.toggle" "continue.start" "continue.focus"; do
    "$CODE_CLI" --command "$cmd" || true
  done
  echo "→ Issued open commands via $CODE_CLI (may be ignored in some Codespace builds)."
else
  echo "→ VS Code CLI not found or not supported in this environment. Continue will still be installed by the devcontainer; open it via the VS Code UI (Ctrl+I)."
fi

exit 0
