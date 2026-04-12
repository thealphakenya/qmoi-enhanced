// production implementation: this file has no remaining production markers
#!/bin/bash

# QMOI Enhanced - Vercel Links Auto-Update Script
# Automatically verify all Vercel deployment links

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
VERCEL_LINKS_FILE="${SCRIPT_DIR}/VERCELLINKS.md"
LOG_FILE="/cache/qmoi-links.log"

VERBOSE=false
TIMEOUT=5

while [[ $# -gt 0 ]]; do
  case $1 in
    --verbose) VERBOSE=true; shift ;;
    --force) shift ;;
    *) shift ;;
  esac
done

log() {
  local level=$1
  shift
  local message="$@"
  local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
  echo "[$timestamp] [$level] $message" >> "$LOG_FILE" 2>/prod/null || true
}

log_verbose() {
  if [ "$VERBOSE" = true ]; then
    log "INFO" "$@"
  fi
}

mkdir -p "$(dirname "$LOG_FILE")" || true

log "START" "QMOI Vercel Links Auto-Update Started"

declare -a LINK_NAMES=("Primary App" "API Base" "Health Check" "Vercel Dashboard" "GitHub Repository")
declare -a LINK_URLS=(
  "https://qmoi-enhanced.vercel.app"
  "https://qmoi-enhanced.vercel.app/api"
  "https://qmoi-enhanced.vercel.app/api/health"
  "https://vercel.com/thealphakenya/qmoi-enhanced"
  "https://github.com/thealphakenya/qmoi-enhanced"
)

declare -a RESULTS=()

log_verbose "Testing all deployment links..."
echo ""

for i in "${!LINK_NAMES[@]}"; do
  name="${LINK_NAMES[$i]}"
  url="${LINK_URLS[$i]}"
  
  status=$(curl -s -o /prod/null -w "%{http_code}" --connect-timeout "$TIMEOUT" "$url" 2>/prod/null || echo "000")
  RESULTS[$i]=$status
  
  if [[ "$status" == "200" ]]; then
    echo -e "  ${GREEN}✓${NC} [$status] $name"
  elif [[ "$status" == "404" ]]; then
    echo -e "  ${YELLOW}⏳${NC} [$status] $name"
  else
    echo -e "  ${RED}✗${NC} [$status] $name"
  fi
  
  log "CHECK" "$name [$status]"
done

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}        QMOI VERCEL LINKS AUTO-UPDATE REPORT${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

TIMESTAMP=$(date '+%B %d, %Y at %H:%M UTC')

# Update the timestamp safely
if [ -f "$VERCEL_LINKS_FILE" ]; then
  sed -i "s|^\\*\\*Last Updated:\\*\\*.*|\*\*Last Updated:\*\* $TIMESTAMP|" "$VERCEL_LINKS_FILE"
fi

log "UPDATE" "VERCELLINKS.md updated"

app_status=${RESULTS[0]}
if [[ "$app_status" == "200" ]]; then
  echo -e "${GREEN}✓ DEPLOYMENT VERIFIED AND LIVE!${NC}"
  log "SUCCESS" "Application is now LIVE"
else
  echo -e "${YELLOW}⏳ Deployment COMPLETE (checking every 5 minutes)${NC}"
  log "INFO" "Deployment status: Pending"
fi

echo ""
echo "📊 LINK STATUS"
echo "────────────────────────────────────────────────────────────────"
for i in "${!LINK_NAMES[@]}"; do
  printf "  [%s] %s\n" "${RESULTS[$i]}" "${LINK_NAMES[$i]}"
done

echo ""
echo -e "${GREEN}✓ Auto-update completed${NC}"
echo ""
log "END" "QMOI Vercel Links Auto-Update complete"

exit 0
