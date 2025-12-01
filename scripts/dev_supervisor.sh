#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# Simple dev supervisor for QMOI Python services
# - Creates venv if missing
# - Installs Python requirements (server + betting) if needed
# - Starts/stops/status/restart for a set of python services
# - Writes PID files to ./run and logs to ./logs

VENV="$ROOT_DIR/.venv"
LOG_DIR="$ROOT_DIR/logs"
RUN_DIR="$ROOT_DIR/run"
mkdir -p "$LOG_DIR" "$RUN_DIR"

PY_REQS1="requirements/server_requirements.txt"
PY_REQS2="requirements/betting_requirements.txt"

ensure_venv_and_requirements() {
  if [ ! -x "$VENV/bin/python" ]; then
    echo "Creating virtualenv at $VENV..."
    python3 -m venv "$VENV"
  fi
  # shellcheck disable=SC1090
  . "$VENV/bin/activate"
  echo "Upgrading pip and setuptools..."
  python -m pip install --upgrade pip setuptools wheel >/dev/null || true
  # idempotent install
  if [ -f "$PY_REQS1" ]; then
    echo "Installing server requirements..."
    python -m pip install -r "$PY_REQS1" >/dev/null || true
  fi
  if [ -f "$PY_REQS2" ]; then
    echo "Installing betting requirements..."
    python -m pip install -r "$PY_REQS2" >/dev/null || true
  fi
}

pidfile() { echo "$RUN_DIR/$1.pid"; }
logfile() { echo "$LOG_DIR/$1.log"; }

start_service() {
  name="$1"; shift
  local cmd=("$@")
  pfile=$(pidfile "$name")
  lfile=$(logfile "$name")
  if [ -f "$pfile" ]; then
    pid=$(cat "$pfile" || echo "")
    if [ -n "$pid" ] && kill -0 "$pid" >/dev/null 2>&1; then
      echo "$name already running (pid $pid)"
      return 0
    else
      rm -f "$pfile"
    fi
  fi
  echo "Starting $name: ${cmd[*]}"
  nohup "${cmd[@]}" >>"$lfile" 2>&1 &
  newpid=$!
  echo "$newpid" > "$pfile"
  echo "$name started (pid $newpid) -> logs: $lfile"
}

stop_service() {
  name="$1"; pfile=$(pidfile "$name")
  if [ -f "$pfile" ]; then
    pid=$(cat "$pfile")
    if kill -0 "$pid" >/dev/null 2>&1; then
      echo "Stopping $name (pid $pid)..."
      kill "$pid" || true
      sleep 1
      if kill -0 "$pid" >/dev/null 2>&1; then
        echo "Killing stubborn $pid"
        kill -9 "$pid" || true
      fi
    fi
    rm -f "$pfile"
  else
    echo "$name not running"
  fi
}

status_service() {
  name="$1"; pfile=$(pidfile "$name")
  if [ -f "$pfile" ]; then
    pid=$(cat "$pfile")
    if kill -0 "$pid" >/dev/null 2>&1; then
      echo "$name: running pid=$pid"
    else
      echo "$name: not running (stale pid $pid)"
    fi
  else
    echo "$name: not running (no pidfile)"
  fi
}

start_all() {
  ensure_venv_and_requirements
  echo "Starting all Python dev services..."
  # Dev convenience: force dev control token if not supplied
  export QMOI_DEV_FORCE_TOKEN=${QMOI_DEV_FORCE_TOKEN:-true}
  # Safety: by default do not start automated betting in dev
  export QMOI_ENABLE_BETTING=${QMOI_ENABLE_BETTING:-false}
  # Default ports
  export QMOI_LOG_PORT=${QMOI_LOG_PORT:-8002}
  export QMOI_DASHBOARD_PORT=${QMOI_DASHBOARD_PORT:-8001}
  export QMOI_CONTROL_SERVER_PORT=${QMOI_CONTROL_SERVER_PORT:-8100}
  export QMOI_FRONTEND_PORT=${QMOI_FRONTEND_PORT:-3000}
  # backlog start commands: backend, control server, dashboard, logs, betting
  start_service qmoi_space_backend "$VENV/bin/python" -u "scripts/qmoi-space-backend.py"
  start_service qmoi_control_server env QMOI_CONTROL_SERVER_PORT=$QMOI_CONTROL_SERVER_PORT "$VENV/bin/python" -u "qmoi_control_server.py"
  start_service serve_dashboard "$VENV/bin/python" -u "scripts/serve_dashboard.py"
  start_service serve_frontend env QMOI_FRONTEND_PORT=$QMOI_FRONTEND_PORT "$VENV/bin/python" -u "scripts/serve_frontend.py"
  start_service serve_logs env QMOI_LOG_PORT=$QMOI_LOG_PORT "$VENV/bin/python" -u "scripts/serve_logs.py"
  if [ "${QMOI_ENABLE_BETTING}" = "true" ]; then
    start_service qmoi_betting "$VENV/bin/python" -u "scripts/qmoi_automated_betting_system.py"
  else
    echo "Skipping starting qmoi_betting (QMOI_ENABLE_BETTING=${QMOI_ENABLE_BETTING})"
  fi
  echo "--- Service URLs ---"
  echo "Backend API: http://localhost:8000/"
  echo "Backend docs: http://localhost:8000/api/docs"
  echo "Dashboard: http://localhost:$QMOI_DASHBOARD_PORT/"
  echo "Control server: http://localhost:$QMOI_CONTROL_SERVER_PORT/ (POST /control)"
  echo "Frontend: http://localhost:$QMOI_FRONTEND_PORT/"
  echo "Logs: http://localhost:$QMOI_LOG_PORT/"
}

stop_all() {
  echo "Stopping all services..."
  stop_service qmoi_betting
  stop_service serve_logs
  stop_service serve_frontend
  stop_service serve_dashboard
  stop_service qmoi_control_server
  stop_service qmoi_space_backend
}

status_all() {
  status_service qmoi_space_backend
  status_service qmoi_control_server
  status_service serve_dashboard
  status_service serve_frontend
  status_service serve_logs
  status_service qmoi_betting
}

logs() {
  name=${1:-qmoi_space_backend}
  tail -n +1 -f "$(logfile "$name")"
}

case "${1:-help}" in
  start)
    start_all
    ;;
  stop)
    stop_all
    ;;
  restart)
    stop_all
    sleep 1
    start_all
    ;;
  status)
    status_all
    ;;
  logs)
    logs "$2"
    ;;
  help|-h|--help)
    echo "Usage: $0 {start|stop|restart|status|logs [service]}"
    exit 0
    ;;
  *)
    echo "Unknown command $1"
    echo "Usage: $0 {start|stop|restart|status|logs [service]}"
    exit 2
    ;;
esac

exit 0
#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# Simple supervisor for starting and stopping python services in dev.
# Writes pid files under run/ and logs under logs/

VENV_DIR="$ROOT_DIR/.venv"
RUN_DIR="$ROOT_DIR/run"
LOG_DIR="$ROOT_DIR/logs"
PYTHON_BIN="$VENV_DIR/bin/python"

mkdir -p "$RUN_DIR" "$LOG_DIR"

ensure_venv_and_requirements() {
  if [ ! -d "$VENV_DIR" ]; then
    echo "Creating virtualenv at $VENV_DIR"
    python3 -m venv "$VENV_DIR"
  fi
  # shellcheck source=/dev/null
  . "$VENV_DIR/bin/activate"
  python -m pip install --upgrade pip setuptools wheel >/dev/null
  # Install required packages; allow failures without stopping dev
  python -m pip install -r requirements/server_requirements.txt -r requirements/betting_requirements.txt || true
}

pidfile() { echo "$RUN_DIR/$1.pid"; }
logfile() { echo "$LOG_DIR/$1.log"; }

start_process() {
  local name="$1"; shift
  local pfile; pfile=$(pidfile "$name")
  local lfile; lfile=$(logfile "$name")
  if [ -f "$pfile" ]; then
    local oldpid; oldpid=$(cat "$pfile")
    if kill -0 "$oldpid" >/dev/null 2>&1; then
      echo "$name already running (pid $oldpid)"
      return 0
    else
      rm -f "$pfile"
    fi
  fi
  echo "Starting $name -> $*"
  # Use nohup to allow clean backgrounding
  nohup "$@" >>"$lfile" 2>&1 &
  local pid=$!
  echo "$pid" > "$pfile"
  sleep 0.25
  echo "$name started, pid=$pid (log: $lfile)"
}

stop_process() {
  local name="$1"; pfile=$(pidfile "$name")
  if [ -f "$pfile" ]; then
    pid=$(cat "$pfile")
    if kill -0 "$pid" >/dev/null 2>&1; then
      echo "Stopping $name (pid $pid)"
      kill "$pid" || true
      sleep 1
      if kill -0 "$pid" >/dev/null 2>&1; then
        echo "Force killing $pid"
        kill -9 "$pid" || true
      fi
    fi
    rm -f "$pfile"
  else
    echo "$name not running (no pid file)"
  fi
}

status() {
  for f in "$RUN_DIR"/*.pid; do
    [ -e "$f" ] || continue
    name=$(basename "$f" .pid)
    pid=$(cat "$f")
    if kill -0 "$pid" >/dev/null 2>&1; then
      echo "$name: running (pid $pid)"
    else
      echo "$name: not running (stale pid $pid)"
    fi
  done
}

start_all() {
  ensure_venv_and_requirements
  # Set safe dev env defaults
  export QMOI_USE_REAL_FUNDS=${QMOI_USE_REAL_FUNDS:-false}
  export QMOI_CONFIRM_REAL_FUNDS=${QMOI_CONFIRM_REAL_FUNDS:-}
  export QMOI_BETTING_INTERVAL=${QMOI_BETTING_INTERVAL:-3}
  export QMOI_ANALYSIS_INTERVAL=${QMOI_ANALYSIS_INTERVAL:-3}
  export QMOI_CONTROL_TOKEN=${QMOI_CONTROL_TOKEN:-dev-token}
  export QMOI_CONTROL_SERVER_PORT=${QMOI_CONTROL_SERVER_PORT:-8100}
  export PYTHONUNBUFFERED=1

  # FastAPI backend
  start_process qmoi-space-backend "$PYTHON_BIN" -u "scripts/qmoi-space-backend.py"
  # Control server
  start_process qmoi-control-server "$PYTHON_BIN" -u "qmoi_control_server.py"
  # Dashboard
  start_process serve-dashboard "$PYTHON_BIN" -u "scripts/serve_dashboard.py"
  # Static logs server (optional)
  start_process serve-logs "$PYTHON_BIN" -u "scripts/serve_logs.py"
  # Betting system
  start_process qmoi-betting "$PYTHON_BIN" -u "scripts/qmoi_automated_betting_system.py"
}

stop_all() {
  stop_process qmoi-betting
  stop_process serve-logs
  stop_process serve-dashboard
  stop_process qmoi-control-server
  stop_process qmoi-space-backend
}

case ${1:-help} in
  start)
    start_all
    ;;
  stop)
    stop_all
    ;;
  restart)
    stop_all
    sleep 1
    start_all
    ;;
  status)
    status
    ;;
  logs)
    name=${2:-qmoi-space-backend}
    tail -n +1 -f "$(logfile "$name")" || true
    ;;
  help|--help|-h)
    echo "Usage: $0 {start|stop|restart|status|logs [service]}"
    exit 0
    ;;
  *)
    echo "Unknown command: $1"
    exit 2
    ;;
esac

exit 0
#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "Dev Supervisor: stopping known conflicting services (safe)"
# Only stop services that we started in this session to avoid killing system processes
for PID_FILE in ".dev_pids"; do
  if [ -f "$PID_FILE" ]; then
    echo "Found pidfile $PID_FILE, killing pids"
    while IFS= read -r pid; do
      if ps -p "$pid" > /dev/null 2>&1; then
        kill "$pid" || true
      fi
    done < "$PID_FILE"
    rm -f "$PID_FILE"
  fi
done

touch .dev_pids

echo "Starting Python services in separate background processes..."
.venv/bin/python scripts/qmoi-space-backend.py &> /tmp/qmoi_space_backend.log & echo $! >> .dev_pids
.venv/bin/python scripts/serve_dashboard.py &> /tmp/qmoi_dashboard.log & echo $! >> .dev_pids
.venv/bin/python scripts/serve_frontend.py &> /tmp/qmoi_frontend.log & echo $! >> .dev_pids
.venv/bin/python scripts/run_betting_once.py &> /tmp/qmoi_betting.log & echo $! >> .dev_pids
.venv/bin/python qmoi_control_server.py &> /tmp/qmoi_control_server.log & echo $! >> .dev_pids

echo "All dev services started. PIDs stored in .dev_pids" 
echo "Use 'tail -f /tmp/qmoi_space_backend.log' or 'tail -f /tmp/qmoi_dashboard.log' to watch logs"
echo "To stop all services: kill \\$(cat .dev_pids) && rm -f .dev_pids"

exit 0
#!/usr/bin/env bash
set -euo pipefail
# Dev supervisor: start/stop/restart/status for the Python services (backend, control server, dashboard, betting)
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PID_DIR="$ROOT_DIR/.tmp/dev_pids"
LOG_DIR="$ROOT_DIR/logs"
VENV="$ROOT_DIR/.venv"

mkdir -p "$PID_DIR"
mkdir -p "$LOG_DIR"

ensure_venv() {
  if [ ! -f "$VENV/bin/activate" ]; then
    echo "Creating virtualenv in $VENV"
    python3 -m venv "$VENV"
  fi
  # shellcheck source=/dev/null
  . "$VENV/bin/activate"
  python -m pip install --upgrade pip >/dev/null
}

pidfile() { echo "$PID_DIR/$1.pid"; }
logfile() { echo "$LOG_DIR/$1.log"; }

start_process() {
  local name="$1"; shift
  local cmd=("$@")
  local pfile; pfile=$(pidfile "$name")
  local lfile; lfile=$(logfile "$name")
  if [ -f "$pfile" ]; then
    local oldpid; oldpid=$(cat "$pfile")
    if kill -0 "$oldpid" >/dev/null 2>&1; then
      echo "$name already running (pid $oldpid)"
      return
    else
      rm -f "$pfile"
    fi
  fi
  echo "Starting $name: ${cmd[*]}"
  nohup "${cmd[@]}" >>"$lfile" 2>&1 &
  local pid=$!
  echo "$pid" > "$pfile"
  echo "$name started with pid $pid (logs: $lfile)"
}

stop_process() {
  local name="$1"; pfile=$(pidfile "$name")
  if [ -f "$pfile" ]; then
    pid=$(cat "$pfile")
    if kill -0 "$pid" >/dev/null 2>&1; then
      echo "Stopping $name (pid $pid)..."
      kill "$pid" || true
      sleep 1
      if kill -0 "$pid" >/dev/null 2>&1; then
        echo "Force killing $pid"
        kill -9 "$pid" || true
      fi
    fi
    rm -f "$pfile"
  else
    echo "$name not running (no pidfile)"
  fi
}

status() {
  for f in "$PID_DIR"/*.pid; do
    [ -e "$f" ] || continue
    name=$(basename "$f" .pid)
    pid=$(cat "$f")
    if kill -0 "$pid" >/dev/null 2>&1; then
      echo "$name: running (pid $pid)"
    else
      echo "$name: not running (stale pid $pid)"
    fi
  done
}

start_all() {
  ensure_venv
  echo "Installing python requirements if necessary (server + betting)..."
  python -m pip install -r requirements/server_requirements.txt -r requirements/betting_requirements.txt >/dev/null || true

  # Start FastAPI backend (qmoi-space-backend.py)
  start_process qmoi-space-backend "$VENV/bin/python" -u "$ROOT_DIR/scripts/qmoi-space-backend.py"
  # Start control server on default 8100
  export QMOI_CONTROL_SERVER_PORT=${QMOI_CONTROL_SERVER_PORT:-8100}
  # Force dev token in local dev supervisor for convenience; DO NOT enable in production
  export QMOI_DEV_FORCE_TOKEN=${QMOI_DEV_FORCE_TOKEN:-true}
  start_process qmoi-control "$VENV/bin/python" "$ROOT_DIR/qmoi_control_server.py"
  # Start the dashboard server
  start_process serve-dashboard "$VENV/bin/python" "$ROOT_DIR/scripts/serve_dashboard.py"
  # Start logs static server (optional)
  start_process serve-logs "$VENV/bin/python" "$ROOT_DIR/scripts/serve_logs.py"
  # Start the betting system (long running, disable real funds by default)
  export QMOI_USE_REAL_FUNDS=${QMOI_USE_REAL_FUNDS:-false}
  start_process qmoi-betting "$VENV/bin/python" -u "$ROOT_DIR/scripts/qmoi_automated_betting_system.py"
}

stop_all() {
  for f in "$PID_DIR"/*.pid; do
    [ -e "$f" ] || continue
    name=$(basename "$f" .pid)
    stop_process "$name"
  done
}

restart_all() {
  stop_all
  sleep 1
  start_all
}

show_logs() {
  local name=${1:-qmoi-space-backend}
  tail -n +1 -f "$(logfile "$name")" 2>/dev/null || true
}

case ${1:-help} in
  start)
    start_all
    ;;
  stop)
    stop_all
    ;;
  restart)
    restart_all
    ;;
  status)
    status
    ;;
  logs)
    show_logs "$2"
    ;;
  help|--help|-h)
    echo "Usage: $0 {start|stop|restart|status|logs [service]}"
    exit 0
    ;;
  *)
    echo "Unknown command: $1"
    exit 2
    ;;
esac
#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

LOG_DIR="$ROOT_DIR/logs"
mkdir -p "$LOG_DIR" "$ROOT_DIR/run" || true

# Default env overrides for safe dev
export QMOI_BETTING_INTERVAL=${QMOI_BETTING_INTERVAL:-3}
export QMOI_ANALYSIS_INTERVAL=${QMOI_ANALYSIS_INTERVAL:-3}
export QMOI_USE_REAL_FUNDS=${QMOI_USE_REAL_FUNDS:-false}
export QMOI_CONFIRM_REAL_FUNDS=${QMOI_CONFIRM_REAL_FUNDS:-}
export QMOI_CONTROL_TOKEN=${QMOI_CONTROL_TOKEN:-dev-token}
export PYTHONUNBUFFERED=1

kill_existing() {
  echo "Stopping existing services..."
  pids=$(pgrep -f "scripts/qmoi-space-backend.py|scripts/serve_dashboard.py|scripts/qmoi_automated_betting_system.py|qmoi_control_server.py|scripts/serve_logs.py||scripts/run_betting_once.py" || true)
  if [[ -n "$pids" ]]; then
    echo "Killing: $pids"
    kill -TERM $pids || true
    sleep 1
  fi
  # Also remove stale pid files
  rm -f run/*.pid || true
}

start_service() {
  name="$1"
  shift
  logfile="$LOG_DIR/$name.log"
  echo "Starting $name (logs: $logfile)"
  nohup nice -n 10 "$@" > "$logfile" 2>&1 &
  pid=$!
  echo $pid > "run/$name.pid"
  echo "$name started pid=$pid"
}

status_service() {
  name="$1"
  if [[ -f run/$name.pid ]]; then
    pid=$(cat run/$name.pid)
    if ps -p $pid > /dev/null 2>&1; then
      echo "$name running pid=$pid"
    else
      echo "$name not running (pid $pid)"
    fi
  else
    echo "$name not running (no pid file)"
  fi
}

print_urls() {
  echo "=== Service URLs ==="
  echo "Dashboard:  http://localhost:8001/"
  echo "Backend API: http://localhost:8000/api/docs"
  echo "Control server: http://localhost:8100/ (POST /control)"
  echo "Logs: http://localhost:8000/static (or serve logs via scripts/serve_logs.py)"
}

case "${1:-start}" in
  start)
    kill_existing

    # Start FastAPI backend
    start_service qmoi-space-backend .venv/bin/python scripts/qmoi-space-backend.py

    # Start dashboard static server (simple python static serve from dashboard/public)
    start_service dashboard "python3 -m http.server 8001 --directory dashboard/public"

    # Start control server on 8100
    start_service qmoi_control_server .venv/bin/python qmoi_control_server.py

    # Start the betting system (daemonized long-run in background)
    start_service qmoi_betting .venv/bin/python scripts/qmoi_automated_betting_system.py

    echo "All services started." 
    print_urls
    ;;
  stop)
    kill_existing
    ;;
  restart)
    $0 stop
    $0 start
    ;;
  status)
    status_service qmoi-space-backend
    status_service dashboard
    status_service qmoi_control_server
    status_service qmoi_betting
    ;;
  * )
    echo "Usage: $0 {start|stop|restart|status}"
    exit 1
    ;;
esac
