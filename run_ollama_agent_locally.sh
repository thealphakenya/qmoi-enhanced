#!/bin/bash
# Local runner for Ollama autonomous agent
# Executes the agent and monitors completion

set -e  # Exit on error
cd "$(dirname "$0")"

echo "======================================================================"
echo "🤖 Starting Ollama Autonomous Agent Execution"
echo "======================================================================"
echo "Time: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo "Branch: $(git rev-parse --abbrev-ref HEAD)"
echo "Commit: $(git rev-parse --short HEAD)"
echo "======================================================================\n"

# Activate venv if available
if [ -f ".venv/bin/activate" ]; then
    echo "📦 Activating Python virtual environment..."
    source .venv/bin/activate
fi

# Set environment variables for autonomous execution
export GITHUB_WORKSPACE="${GITHUB_WORKSPACE:-.}"
export AUTO_CONTINUE=1
export AUTO_CONTINUE_MAX="${OLLAMA_MAX_ITERATIONS:-200}"
export AUTO_PUSH=1
export TARGET_BRANCH="${TARGET_BRANCH:-$(git rev-parse --abbrev-ref HEAD)}"
export OLLAMA_AUTO_REPAIR=true
export QMOI_AUTONOMOUS_MODE=enhanced

echo "🔧 Environment Configuration:"
echo "   GITHUB_WORKSPACE: $GITHUB_WORKSPACE"
echo "   TARGET_BRANCH: $TARGET_BRANCH"
echo "   AUTO_CONTINUE: $AUTO_CONTINUE"
echo "   AUTO_PUSH: $AUTO_PUSH"
echo ""

# Run the agent
echo "🚀 Executing Ollama autonomous agent..."
echo "---"
python3 scripts/ollama_autonomous_agent.py

AGENT_EXIT_CODE=$?
echo "---"
echo ""

if [ $AGENT_EXIT_CODE -eq 0 ]; then
    echo "✅ Agent execution completed successfully (exit code: 0)"
else
    echo "⚠️  Agent execution completed with exit code: $AGENT_EXIT_CODE"
fi

echo ""
echo "======================================================================"
echo "📊 Checking Agent Output Files"
echo "======================================================================"

# Check for key output files
AGENT_FILES=(
    "OLLAMA_ACTIVITY_FEED.md"
    "resumefromhere.txt"
    ".ollama_agent_state.json"
    "OLLAMA_PENDING_REPORT.md"
)

for file in "${AGENT_FILES[@]}"; do
    if [ -f "$file" ]; then
        lines=$(wc -l < "$file")
        echo "✓ $file ($lines lines)"
    else
        echo "✗ $file (not found)"
    fi
done

echo ""
echo "======================================================================"
echo "📋 Agent Pending Items Summary"
echo "======================================================================"

if [ -f "OLLAMA_PENDING_REPORT.md" ]; then
    echo "Current pending items report:"
    head -50 OLLAMA_PENDING_REPORT.md
    echo ""
fi

if [ -f ".ollama_agent_state.json" ]; then
    echo "Agent state (last run):"
    python3 -c "import json; data=json.load(open('.ollama_agent_state.json')); print(f'  Iterations: {data.get(\"iteration\", 0)}'); print(f'  Processed items: {len(data.get(\"processed\", []))}'); print(f'  Branch: {data.get(\"branch\", \"N/A\")}'); print(f'  Last run: {data.get(\"last_run\", \"N/A\")}')" 2>/dev/null || echo "  (Unable to parse state file)"
fi

echo ""
echo "======================================================================"
echo "✨ Ollama Agent Execution Complete"
echo "======================================================================"
exit $AGENT_EXIT_CODE
