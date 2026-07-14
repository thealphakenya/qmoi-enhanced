#!/bin/bash
set -euo pipefail

STATE_DIR="${HOME}/.vscode-remote/state"
INSTALL_MARKER="$STATE_DIR/continue-installed"
mkdir -p "$STATE_DIR"

CONTINUE_DIR="$HOME/.continue"
mkdir -p "$CONTINUE_DIR"

echo "→ Continue startup is now opt-in; no automatic installation will be attempted."

echo "→ Ensuring Continue config is available without forcing extension installation"
CONFIG_FILE="$CONTINUE_DIR/config.json"
if [ ! -f "$CONFIG_FILE" ] || ! grep -q 'qwen2.5-coder:3b' "$CONFIG_FILE" 2>/dev/null; then
  cat > "$CONFIG_FILE" <<'EOF'
{
  "models": [
    {
      "title": "Local Qwen Coder",
      "provider": "ollama",
      "model": "qwen2.5-coder:3b",
      "apiBase": "http://127.0.0.1:11434"
    }
  ],
  "tabAutocompleteModel": {
    "title": "Local Qwen Coder",
    "provider": "ollama",
    "model": "qwen2.5-coder:3b",
    "apiBase": "http://127.0.0.1:11434"
  },
  "systemMessage": "You are a local Ollama assistant configured to support Continue bulk operations.",
  "settings": {
    "autoConnect": true,
    "suggestedPrompt": "Use local Ollama for bulk repo automation",
    "useLocalOllamaByDefault": true
  }
}
EOF
  echo "Created or updated Continue config at $CONFIG_FILE"
else
  echo "Continue config already includes Ollama model"
fi

if [ -f "$CONFIG_FILE" ]; then
  python - <<'PY' "$CONFIG_FILE"
import json, sys, pathlib
path = pathlib.Path(sys.argv[1])
obj = json.loads(path.read_text())
for model in obj.get('models', []):
    if model.get('provider') == 'ollama':
        model['apiBase'] = 'http://127.0.0.1:11434'
if 'tabAutocompleteModel' in obj and obj['tabAutocompleteModel'].get('provider') == 'ollama':
    obj['tabAutocompleteModel']['apiBase'] = 'http://127.0.0.1:11434'
obj.setdefault('settings', {})['useLocalOllamaByDefault'] = True
path.write_text(json.dumps(obj, indent=2) + '\n')
PY
  echo "Pinned Continue config to local Ollama at http://127.0.0.1:11434"
fi

echo "→ Continue base configuration ensured"

if [ -x "$(dirname "$0")/update-resume.sh" ]; then
  if [ -f "$INSTALL_MARKER" ]; then
    bash "$(dirname "$0")/update-resume.sh" "Continue configuration ensured; extension installation remains opt-in" || true
  else
    bash "$(dirname "$0")/update-resume.sh" "Continue configuration ensured; install later manually if desired" || true
  fi
fi

exit 0
