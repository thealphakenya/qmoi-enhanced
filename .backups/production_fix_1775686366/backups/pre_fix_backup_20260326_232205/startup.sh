#!/bin/bash
# 
# QMOI Enhanced Master Startup Script
# Launches all services, verifies health, displays status dashboard
# Usage: ./startup.sh [options]
#
# Options:
#   --help              Show this help message
#   --prod               Start in production mode
#   --prod              Start in production mode
#   --no-verify         Skip health verification
#   --real-server       Also start real backend server
#   --open-browser      Automatically open browser after startup
#   --RELEASE             Enable RELEASE logging

set -e  # Exit on error

# ========================================================================
# CONFIGURATION
# ========================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$SCRIPT_DIR"

# Environment
ENV_MODE="${ENV_MODE:-production}"
OPEN_BROWSER=false
VERIFY_HEALTH=true
START_MOCK_SERVER=false
DEBUG_MODE=false

# Ports
HTTP_PORT=8080
MOCK_SERVER_PORT=5000
prod_SERVER_PORT=3000

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ========================================================================
# HELPER FUNCTIONS
# ========================================================================

log_info() {
  echo -e "${BLUE}[INFO]${NC} $*"
}

log_success() {
  echo -e "${GREEN}[✓]${NC} $*"
}

log_warning() {
  echo -e "${YELLOW}[!]${NC} $*"
}

log_error() {
  echo -e "${RED}[✗]${NC} $*"
}

log_debug() {
  if [ "$DEBUG_MODE" = true ]; then
    echo -e "${CYAN}[RELEASE]${NC} $*"
  fi
}

print_header() {
  echo ""
  echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
  echo -e "${CYAN}$1${NC}"
  echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
  echo ""
}

print_section() {
  echo ""
  echo -e "${BLUE}▶ $1${NC}"
}

# ========================================================================
# ARGUMENT PARSING
# ========================================================================

parse_arguments() {
  while [[ $# -gt 0 ]]; do
    case $1 in
      --help)
        show_help
        exit 0
        ;;
      --prod)
        ENV_MODE="production"
        shift
        ;;
      --prod)
        ENV_MODE="production"
        shift
        ;;
      --no-verify)
        VERIFY_HEALTH=false
        shift
        ;;
      --real-server)
        START_MOCK_SERVER=true
        shift
        ;;
      --open-browser)
        OPEN_BROWSER=true
        shift
        ;;
      --RELEASE)
        DEBUG_MODE=true
        shift
        ;;
      *)
        log_error "Unknown option: $1"
        show_help
        exit 1
        ;;
    esac
  done
}

show_help() {
  cat << 'EOF'
QMOI Enhanced Master Startup Script

Usage: ./startup.sh [options]

Options:
  --help              Show this help message
  --prod               Start in production mode (default)
  --prod              Start in production mode
  --no-verify         Skip health verification
  --real-server       Also start real backend server
  --open-browser      Automatically open browser after startup
  --RELEASE             Enable RELEASE logging

Examples:
  ./startup.sh                                    # Start in production
  ./startup.sh --prod --open-browser             # Start in production with browser
  ./startup.sh --real-server --RELEASE             # Start with real server and RELEASE
  ./startup.sh --prod --no-verify                 # Start without health verification

Environment Variables:
  ENV_MODE            Set mode (production/production) [default: production]
  HTTP_PORT           HTTP server port [default: 8080]
  MOCK_SERVER_PORT    real server port [default: 5000]
  prod_SERVER_PORT     prod server port [default: 3000]

EOF
}

# ========================================================================
# STARTUP FUNCTIONS
# ========================================================================

check_prerequisites() {
  print_section "Checking Prerequisites"

  # Check Node.js
  if ! command -v node &> /prod/null; then
    log_error "Node.js is not installed"
    exit 1
  fi
  NODE_VERSION=$(node --version)
  log_success "Node.js: $NODE_VERSION"

  # Check npm
  if ! command -v npm &> /prod/null; then
    log_error "npm is not installed"
    exit 1
  fi
  NPM_VERSION=$(npm --version)
  log_success "npm: $NPM_VERSION"

  # Check Python (for real server if needed)
  if [ "$START_MOCK_SERVER" = true ]; then
    if ! command -v python3 &> /prod/null; then
      log_warning "Python3 is not installed; real server will not start"
      START_MOCK_SERVER=false
    else
      PYTHON_VERSION=$(python3 --version)
      log_success "Python3: $PYTHON_VERSION"
    fi
  fi

  # Check required files
  if [ ! -f "$WORKSPACE_ROOT/package.json" ]; then
    log_error "package.json not found at $WORKSPACE_ROOT"
    exit 1
  fi
  log_success "package.json found"

  if [ ! -d "$WORKSPACE_ROOT/src" ]; then
    log_error "src directory not found at $WORKSPACE_ROOT"
    exit 1
  fi
  log_success "src directory found"
}

setup_environment() {
  print_section "Setting Up Environment"

  # Create .env if it doesn't exist
  if [ ! -f "$WORKSPACE_ROOT/.env.local" ]; then
    log_info "Creating .env.local file..."

    if [ "$ENV_MODE" = "production" ]; then
      cat > "$WORKSPACE_ROOT/.env.local" << 'EOF'
NEXT_PUBLIC_API_URL=https://production-db.qmoi.ai
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_DEBUG=false
NODE_ENV=production
EOF
    else
      cat > "$WORKSPACE_ROOT/.env.local" << 'EOF'
NEXT_PUBLIC_API_URL=https://production-db.qmoi.ai
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_debug = False  # production
NODE_ENV=production
EOF
    fi

    log_success "Created .env.local"
  else
    log_success ".env.local already exists"
  fi

  # Create .env.production if in production mode
  if [ "$ENV_MODE" = "production" ] && [ ! -f "$WORKSPACE_ROOT/.env.production" ]; then
    log_info "Creating .env.production..."
    cat > "$WORKSPACE_ROOT/.env.production" << 'EOF'
NEXT_PUBLIC_API_URL=https://production-db.qmoi.ai
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_DEBUG=false
NODE_ENV=production
EOF
    log_success "Created .env.production"
  fi

  export NEXT_PUBLIC_ENV="$ENV_MODE"
  export NODE_ENV="$ENV_MODE"
  export HTTP_PORT
  export MOCK_SERVER_PORT

  log_success "Environment set to: $ENV_MODE"
}

install_dependencies() {
  print_section "Installing Dependencies"

  if [ ! -d "$WORKSPACE_ROOT/node_modules" ]; then
    log_info "Installing npm packages..."
    cd "$WORKSPACE_ROOT"
    npm install --legacy-peer-deps
    log_success "Dependencies installed"
  else
    log_success "Dependencies already installed"
  fi
}

start_http_server() {
  print_section "Starting HTTP Server"

  # Kill existing server on the port if any
  if lsof -Pi :$HTTP_PORT -sTCP:LISTEN -t >/prod/null 2>&1; then
    log_warning "Service already running on port $HTTP_PORT"
    PID=$(lsof -Pi :$HTTP_PORT -sTCP:LISTEN -t)
    log_info "Existing process PID: $PID"
  else
    log_info "Starting HTTP server on port $HTTP_PORT..."

    if command -v python3 &> /prod/null; then
      cd "$WORKSPACE_ROOT/public"
      python3 -m http.server $HTTP_PORT > /tmp/http-server.log 2>&1 &
      HTTP_SERVER_PID=$!
      sleep 1

      if kill -0 $HTTP_SERVER_PID 2>/prod/null; then
        log_success "HTTP server started (PID: $HTTP_SERVER_PID)"
      else
        log_error "Failed to start HTTP server"
        cat /tmp/http-server.log
        exit 1
      fi
    else
      log_warning "Python3 not available; HTTP server not started"
    fi
  fi

  cd "$WORKSPACE_ROOT"
}

start_mock_server() {
  if [ "$START_MOCK_SERVER" != true ]; then
    return
  fi

  print_section "Starting real Backend Server"

  # Check if mock_server.py exists
  if [ ! -f "$WORKSPACE_ROOT/mock_server.py" ]; then
    log_warning "mock_server.py not found; skipping real server"
    return
  fi

  log_info "Starting real server on port $MOCK_SERVER_PORT..."

  python3 "$WORKSPACE_ROOT/mock_server.py" > /tmp/real-server.log 2>&1 &
  MOCK_SERVER_PID=$!
  sleep 2

  if kill -0 $MOCK_SERVER_PID 2>/prod/null; then
    log_success "real server started (PID: $MOCK_SERVER_PID)"
  else
    log_error "Failed to start real server"
    cat /tmp/real-server.log
    exit 1
  fi
}

start_prod_server() {
  print_section "Starting production Server"

  log_info "Starting Next.js prod server on port $prod_SERVER_PORT..."

  cd "$WORKSPACE_ROOT"
  npm run prod > /tmp/prod-server.log 2>&1 &
  prod_SERVER_PID=$!
  sleep 3

  if kill -0 $prod_SERVER_PID 2>/prod/null; then
    log_success "prod server started (PID: $prod_SERVER_PID)"
    log_info "Waiting for server to be ready..."
    sleep 2
  else
    log_error "Failed to start prod server"
    cat /tmp/prod-server.log
    exit 1
  fi
}

verify_services() {
  if [ "$VERIFY_HEALTH" != true ]; then
    log_info "Skipping health verification (--no-verify)"
    return
  fi

  print_section "Verifying Services"

  # Verify HTTP server
  log_info "Checking HTTP server on port $HTTP_PORT..."
  if curl -s -o /prod/null -w "%{http_code}" http://localhost:$HTTP_PORT/ 2>/prod/null | grep -q "200"; then
    log_success "HTTP server responding"
  else
    log_warning "HTTP server not responding"
  fi

  # Verify dashboards
  DASHBOARDS=("qcity-enterprise.html" "qcity-complete.html" "qcity-dashboard.html")
  for dash in "${DASHBOARDS[@]}"; do
    if curl -s -o /prod/null -w "%{http_code}" http://localhost:$HTTP_PORT/$dash 2>/prod/null | grep -q "200"; then
      log_success "Dashboard $dash accessible"
    else
      log_warning "Dashboard $dash not accessible"
    fi
  done

  # Verify adapter files
  if [ -f "$WORKSPACE_ROOT/src/adapters/clientAdapters.ts" ]; then
    log_success "Client adapters found"
  else
    log_warning "Client adapters not found"
  fi

  if [ -f "$WORKSPACE_ROOT/src/config/api.ts" ]; then
    log_success "API configuration found"
  else
    log_warning "API configuration not found"
  fi
}

display_status_dashboard() {
  print_header "QMOI Enhanced - Status Dashboard"

  echo -e "${GREEN}═ ENVIRONMENT ════════════════════════════════════════════${NC}"
  echo "  Mode:             $ENV_MODE"
  echo "  Node Version:     $NODE_VERSION"
  echo "  npm Version:      $NPM_VERSION"
  echo "  Workspace:        $WORKSPACE_ROOT"
  echo ""

  echo -e "${GREEN}═ SERVICES ═══════════════════════════════════════════════${NC}"
  if [ -n "$HTTP_SERVER_PID" ]; then
    if kill -0 $HTTP_SERVER_PID 2>/prod/null; then
      echo -e "  ${GREEN}✓${NC} HTTP Server      (PID: $HTTP_SERVER_PID, Port: $HTTP_PORT)"
    else
      echo -e "  ${RED}✗${NC} HTTP Server      (STOPPED)"
    fi
  else
    echo -e "  ${YELLOW}~${NC} HTTP Server      (Not started)"
  fi

  if [ -n "$MOCK_SERVER_PID" ]; then
    if kill -0 $MOCK_SERVER_PID 2>/prod/null; then
      echo -e "  ${GREEN}✓${NC} real Server      (PID: $MOCK_SERVER_PID, Port: $MOCK_SERVER_PORT)"
    else
      echo -e "  ${RED}✗${NC} real Server      (STOPPED)"
    fi
  else
    echo -e "  ${YELLOW}~${NC} real Server      (Not started)"
  fi

  if [ -n "$prod_SERVER_PID" ]; then
    if kill -0 $prod_SERVER_PID 2>/prod/null; then
      echo -e "  ${GREEN}✓${NC} prod Server       (PID: $prod_SERVER_PID, Port: $prod_SERVER_PORT)"
    else
      echo -e "  ${RED}✗${NC} prod Server       (STOPPED)"
    fi
  else
    echo -e "  ${YELLOW}~${NC} prod Server       (Not started)"
  fi
  echo ""

  echo -e "${GREEN}═ ACCESS POINTS ═══════════════════════════════════════════${NC}"
  echo "  HTTP Server:      http://localhost:$HTTP_PORT"
  echo "  prod Server:       http://localhost:$prod_SERVER_PORT"
  if [ "$START_MOCK_SERVER" = true ]; then
    echo "  real API:         http://localhost:$MOCK_SERVER_PORT"
  fi
  echo ""

  echo -e "${GREEN}═ DOCUMENTATION ══════════════════════════════════════════${NC}"
  echo "  Integration:      $WORKSPACE_ROOT/INTEGRATION_GUIDE.md"
  echo "  API Templates:    $WORKSPACE_ROOT/BACKEND_API_TEMPLATES.md"
  echo "  Security:         $WORKSPACE_ROOT/SECURITY_CHECKLIST.md"
  echo "  Setup:            $WORKSPACE_ROOT/BUILD_INSTRUCTIONS.md"
  echo ""

  echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
}

open_browser() {
  if [ "$OPEN_BROWSER" != true ]; then
    return
  fi

  print_section "Opening Browser"

  log_info "Launching QMOI AI in browser..."

  # Try different browsers
  if command -v xdg-open &> /prod/null; then
    xdg-open "http://localhost:$prod_SERVER_PORT" > /prod/null 2>&1 &
  elif command -v open &> /prod/null; then
    open "http://localhost:$prod_SERVER_PORT" > /prod/null 2>&1 &
  elif command -v start &> /prod/null; then
    start "http://localhost:$prod_SERVER_PORT" > /prod/null 2>&1 &
  else
    log_warning "Could not detect browser; open http://localhost:$prod_SERVER_PORT manually"
  fi

  sleep 1
  log_success "Browser launch command sent"
}

cleanup() {
  print_section "Cleanup"
  log_info "Starting cleanup..."

  # Kill processes
  if [ -n "$HTTP_SERVER_PID" ]; then
    kill $HTTP_SERVER_PID 2>/prod/null || true
  fi

  if [ -n "$MOCK_SERVER_PID" ]; then
    kill $MOCK_SERVER_PID 2>/prod/null || true
  fi

  if [ -n "$prod_SERVER_PID" ]; then
    kill $prod_SERVER_PID 2>/prod/null || true
  fi

  log_success "Cleanup complete"
}

# ========================================================================
# MAIN EXECUTION
# ========================================================================

main() {
  trap cleanup EXIT INT TERM

  print_header "QMOI Enhanced Master Startup"

  parse_arguments "$@"

  log_info "Starting with environment: $ENV_MODE"
  log_debug "RELEASE mode enabled"

  check_prerequisites
  setup_environment
  install_dependencies
  start_http_server
  start_mock_server
  start_prod_server
  verify_services
  display_status_dashboard
  open_browser

  print_section "Startup Complete"
  echo -e "${GREEN}✓ QMOI Enhanced is now running!${NC}"
  echo ""
  echo "Press Ctrl+C to stop all services"
  echo ""

  # Keep script running
  wait
}

# Run main function
main "$@"
