#!/bin/bash
# Quick Monitor Launcher for Ollama PR Validation Workflow
# Usage: ./scripts/monitor.sh [RUN_ID] [--interval SECONDS] [--duration SECONDS]

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Default values
RUN_ID="${1:}"
INTERVAL=10
DURATION=3600
REPO="thealphakenya/qmoi-enhanced"

# Parse optional arguments
while [[ $# -gt 1 ]]; do
    case $2 in
        --interval)
            INTERVAL="$3"
            shift 2
            ;;
        --duration)
            DURATION="$3"
            shift 2
            ;;
        --repo)
            REPO="$3"
            shift 2
            ;;
        *)
            shift
            ;;
    esac
done

# Function to show usage
show_usage() {
    echo "Usage: $0 <RUN_ID> [OPTIONS]"
    echo ""
    echo "Required:"
    echo "  RUN_ID                 GitHub workflow run ID to monitor"
    echo ""
    echo "Optional:"
    echo "  --interval SECONDS     Update interval in seconds (default: 10)"
    echo "  --duration SECONDS     Maximum monitoring duration in seconds (default: 3600)"
    echo "  --repo OWNER/REPO      Repository to monitor (default: thealphakenya/qmoi-enhanced)"
    echo ""
    echo "Examples:"
    echo "  $0 31834413057"
    echo "  $0 31834413057 --interval 5"
    echo "  $0 31834413057 --interval 5 --duration 1800"
}

# Validate input
if [ -z "$RUN_ID" ]; then
    echo -e "${RED}Error: RUN_ID is required${NC}"
    echo ""
    show_usage
    exit 1
fi

# Check if gh CLI is available
if ! command -v gh &> /dev/null; then
    echo -e "${RED}Error: GitHub CLI (gh) is not installed${NC}"
    echo "Install it from: https://cli.github.com/"
    exit 1
fi

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: Python 3 is not installed${NC}"
    exit 1
fi

# Verify the monitoring script exists
MONITOR_SCRIPT="$(dirname "$0")/realtime_workflow_monitor.py"
if [ ! -f "$MONITOR_SCRIPT" ]; then
    echo -e "${RED}Error: Monitoring script not found at $MONITOR_SCRIPT${NC}"
    exit 1
fi

# Set up GitHub token
if [ -z "$GH_TOKEN" ]; then
    # Try to resolve token
    for var in MY_CUSTOM_TOKEN MY_CUTOM_TOKEN GITHUB_TOKEN GH_TOKEN; do
        if [ ! -z "${!var}" ]; then
            export GH_TOKEN="${!var}"
            break
        fi
    done
fi

if [ -z "$GH_TOKEN" ]; then
    echo -e "${YELLOW}Warning: No GitHub token found in environment${NC}"
    echo "You may be prompted to authenticate with GitHub"
fi

# Show intro
echo -e "${BOLD}${BLUE}========================================${NC}"
echo -e "${BOLD}🔴 OLLAMA PR VALIDATION REALTIME MONITOR${NC}"
echo -e "${BOLD}${BLUE}========================================${NC}"
echo ""
echo -e "Repository:   ${BOLD}${REPO}${NC}"
echo -e "Run ID:       ${BOLD}${RUN_ID}${NC}"
echo -e "Interval:     ${BOLD}${INTERVAL}s${NC}"
echo -e "Max Duration: ${BOLD}${DURATION}s${NC}"
echo ""
echo -e "${YELLOW}Starting real-time workflow monitoring...${NC}"
echo ""

# Run the monitoring script
python3 "$MONITOR_SCRIPT" "$RUN_ID" \
    --repo "$REPO" \
    --interval "$INTERVAL" \
    --duration "$DURATION"

exit $?
