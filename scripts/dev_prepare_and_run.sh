#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "Dev prepare and run helper - will try Node/npm, else Docker, else Python dev-only via supervisor"

if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
  echo "Node/npm detected. Installing Node deps and running the app (dev mode)"
  npm ci
  npm run dev &
  # Meanwhile, start python services via supervisor
  chmod +x ./scripts/dev_supervisor.sh
  ./scripts/dev_supervisor.sh start
elif command -v docker >/dev/null 2>&1 && command -v docker-compose >/dev/null 2>&1; then
  echo "Docker+docker-compose detected. Bringing up containers..."
  docker-compose up --build
else
  echo "Neither Node nor Docker found; running Python-only services via supervisor"
  if [ -f ".venv/bin/activate" ]; then
    echo "Found .venv; activating"
    . .venv/bin/activate
  fi
  chmod +x ./scripts/dev_supervisor.sh
  ./scripts/dev_supervisor.sh start
fi

echo "Dev prepare and run complete"
exit 0
#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "Dev Prepare & Run: ensure venv and either run Node (npm) or Docker fallback or Python-only supervisor"

VENV="$ROOT_DIR/.venv"
VENV_PY="$VENV/bin/python"

ensure_venv() {
  if [ ! -f "$VENV/bin/activate" ]; then
    echo "Creating virtualenv..."
    python3 -m venv "$VENV"
  fi
  # shellcheck source=/dev/null
  . "$VENV/bin/activate"
  python -m pip install --upgrade pip setuptools wheel >/dev/null
}

ensure_venv

echo "Installing python requirements (server & betting). This may take a moment..."
python -m pip install -r requirements/server_requirements.txt -r requirements/betting_requirements.txt || true

if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
  echo "Node & npm found. Running frontend dev (Next.js) and other services where applicable."
  # Run the python services (backend, control) under supervisor and run the node dev in the foreground
  chmod +x scripts/dev_supervisor.sh
  scripts/dev_supervisor.sh start
  echo "Starting Node dev server (npm run dev). Logs go to stdout; stop with Ctrl+C."
  npm ci
  npm run dev
elif command -v docker >/dev/null 2>&1 && command -v docker-compose >/dev/null 2>&1; then
  echo "Node not found but Docker & docker-compose found. Spinning up with docker-compose."
  docker-compose up --build
else
  echo "Neither Node nor Docker found; falling back to Python-only local services."
  chmod +x scripts/dev_supervisor.sh
  scripts/dev_supervisor.sh start
  echo "Python-only services started. Use ./scripts/dev_supervisor.sh status to check and ./scripts/dev_supervisor.sh logs [service] to tail logs."
fi

exit 0
#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "QMOI Dev Helper: checking environment"

if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
  echo "Node and npm found — installing JS deps and starting dev server"
  # Run a quick compatibility check for ESM/CJS mismatches
  if [ -f scripts/check_node_compat.js ]; then
    echo "Running Node compat check (scripts/check_node_compat.js)"
    node scripts/check_node_compat.js || true
  fi
  export CI=${CI:-false}
  # Avoid breaking on peer deps for older lockfiles
  if npm ci --silent --legacy-peer-deps; then
    echo "npm ci completed successfully"
  else
    echo "npm ci failed — attempting npm install --legacy-peer-deps"
    npm install --legacy-peer-deps
  fi
  # Run the dev server (Next/Express/React). This is interactive; run in foreground
  echo "Starting Node dev server (foreground). Press Ctrl-C to stop."
  npm run dev
  exit 0
fi

if command -v docker >/dev/null 2>&1 && command -v docker-compose >/dev/null 2>&1; then
  echo "Node not found; Docker and docker-compose available — launching containers"
  docker-compose up --build
  exit 0
fi

echo "Neither Node nor Docker is installed or available."
echo "You can install Node >=18 (recommended) or use Docker (if available)."
echo "To run a Python-only dev environment, use:"
echo "  .venv/bin/python -m pip install -r requirements/server_requirements.txt -r requirements/betting_requirements.txt"
echo "  ./scripts/dev_supervisor.sh start"
exit 1
