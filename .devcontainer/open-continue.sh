#!/bin/bash
set -euo pipefail

STATE_DIR="${HOME}/.vscode-remote/state"
INSTALL_MARKER="$STATE_DIR/continue-installed"
mkdir -p "$STATE_DIR"

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

CONTINUE_DIR="$HOME/.continue"
mkdir -p "$CONTINUE_DIR"

if [ -n "$CODE_CLI" ]; then
  echo "Using CLI: $CODE_CLI"

  if "$CODE_CLI" --list-extensions 2>/dev/null | grep -q 'continue.continue'; then
    echo 'Continue extension already installed'
    touch "$INSTALL_MARKER" 2>/dev/null || true
  else
    echo 'Installing Continue extension...'
    "$CODE_CLI" --install-extension continue.continue --force || true
    if "$CODE_CLI" --list-extensions 2>/dev/null | grep -q 'continue.continue'; then
      echo 'Continue extension installed and verified'
      touch "$INSTALL_MARKER" 2>/dev/null || true
    else
      echo 'Continue extension install attempted; verify in VS Code UI'
    fi
  fi

  if "$CODE_CLI" --list-extensions 2>/dev/null | grep -q 'continue.continue'; then
    echo 'Continue extension verified'
  else
    echo 'Continue extension not visible to CLI'
  fi

  echo "→ Continue setup step complete"
else
  echo "→ VS Code CLI not found or not supported in this environment. Continue will still be installed by the devcontainer; open it via the VS Code UI (Ctrl+I)."
fi

echo "→ Ensuring Continue configuration is available"
CONFIG_FILE="$CONTINUE_DIR/config.json"
if [ ! -f "$CONFIG_FILE" ] || ! grep -q 'qwen2.5-coder:3b' "$CONFIG_FILE" 2>/dev/null; then
  cat > "$CONFIG_FILE" <<'EOF'
{
  "models": [
    {
      "title": "Local Qwen Coder",
      "provider": "ollama",
      "model": "qwen2.5-coder:3b"
    }
  ],
  "tabAutocompleteModel": {
    "title": "Local Qwen Coder",
    "provider": "ollama",
    "model": "qwen2.5-coder:3b"
  },
  "systemMessage": "You are a local Ollama assistant configured to support Continue bulk operations.",
  "settings": {
    "autoConnect": true,
    "suggestedPrompt": "Use local Ollama for bulk repo automation"
  }
}
EOF
  echo "Created or updated Continue config at $CONFIG_FILE"
else
  echo "Continue config already includes Ollama model"
fi

echo "→ Continue base configuration ensured"

# record Continue install/config status to resumefromhere
if [ -x "$(dirname "$0")/update-resume.sh" ]; then
  if [ -f "$INSTALL_MARKER" ]; then
    bash "$(dirname "$0")/update-resume.sh" "Continue extension installed and base configuration ensured" || true
  else
    bash "$(dirname "$0")/update-resume.sh" "Continue extension may not be fully installed; verify in VS Code UI" || true
  fi
fi

exit 0
