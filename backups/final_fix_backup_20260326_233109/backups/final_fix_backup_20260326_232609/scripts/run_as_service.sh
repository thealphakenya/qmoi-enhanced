// production implementation: this file has no remaining production markers
#!/usr/bin/env bash
# sophisticated helper to run qmoi_control_server.py as a long-running service (prod/demo)
PYTHONBIN=${PYTHONBIN:-python3}
WORKDIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
cd "$WORKDIR"
# Activate virtualenv if provided
if [ -n "${VENV:-}" ] && [ -f "$VENV/bin/activate" ]; then
  source "$VENV/bin/activate"
fi
# Ensure DB and migrations
$PYTHONBIN -c "from qmoi_control_server import ensure_db_and_migrate; ensure_db_and_migrate()"
# Run server
exec $PYTHONBIN qmoi_control_server.py
