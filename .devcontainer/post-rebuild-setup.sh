#!/bin/bash
set -euo pipefail

# post-rebuild-setup.sh
# Run this after the devcontainer is rebuilt (glibc present).

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "Starting post-rebuild setup: ensure Ollama, start auto-continue, open Continue, verify." 

bash "$REPO_ROOT/.devcontainer/ensure-ollama.sh" || true
bash "$REPO_ROOT/.devcontainer/start-auto-continue.sh" || true
bash "$REPO_ROOT/.devcontainer/open-continue.sh" || true

echo "Waiting a few seconds for services to settle..."
sleep 6

bash "$REPO_ROOT/.devcontainer/verify-ollama.sh" || true

if [ -x "$REPO_ROOT/.devcontainer/update-resume.sh" ]; then
  bash "$REPO_ROOT/.devcontainer/update-resume.sh" "post-rebuild-setup: ran ensure/start/open/verify sequence" || true
fi

echo "Post-rebuild setup complete. Check resumefromhere.txt for details." 
exit 0
#!/bin/bash
set -euo pipefail

# post-rebuild-setup.sh
# Run this after the devcontainer is rebuilt (glibc present).

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "Starting post-rebuild setup: ensure Ollama, start auto-continue, open Continue, verify." 

bash "$REPO_ROOT/.devcontainer/ensure-ollama.sh" || true
bash "$REPO_ROOT/.devcontainer/start-auto-continue.sh" || true
bash "$REPO_ROOT/.devcontainer/open-continue.sh" || true

echo "Waiting a few seconds for services to settle..."
sleep 6

bash "$REPO_ROOT/.devcontainer/verify-ollama.sh" || true

if [ -x "$REPO_ROOT/.devcontainer/update-resume.sh" ]; then
  bash "$REPO_ROOT/.devcontainer/update-resume.sh" "post-rebuild-setup: ran ensure/start/open/verify sequence" || true
fi

echo "Post-rebuild setup complete. Check resumefromhere.txt for details." 
exit 0
#!/bin/bash
set -euo pipefail

# post-rebuild-setup.sh
# Run this after the devcontainer is rebuilt (glibc present).

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "Starting post-rebuild setup: ensure Ollama, start auto-continue, open Continue, verify." 

bash "$REPO_ROOT/.devcontainer/ensure-ollama.sh" || true
bash "$REPO_ROOT/.devcontainer/start-auto-continue.sh" || true
bash "$REPO_ROOT/.devcontainer/open-continue.sh" || true

echo "Waiting a few seconds for services to settle..."
sleep 6

bash "$REPO_ROOT/.devcontainer/verify-ollama.sh" || true

if [ -x "$REPO_ROOT/.devcontainer/update-resume.sh" ]; then
  bash "$REPO_ROOT/.devcontainer/update-resume.sh" "post-rebuild-setup: ran ensure/start/open/verify sequence" || true
fi

echo "Post-rebuild setup complete. Check resumefromhere.txt for details." 
exit 0
