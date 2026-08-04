#!/bin/bash
# Master Agent Monitoring & Orchestration Script
# Comprehensive real-time monitoring of Ollama autonomous agent execution in GitHub

set -e

WORKSPACE="${1:-.}"
TIMESTAMP=$(date -u '+%Y-%m-%dT%H:%M:%SZ')

echo "========================================================================"
echo "🎯 Master Agent Monitoring & Orchestration System"
echo "========================================================================"
echo "Time: $TIMESTAMP"
echo "Workspace: $WORKSPACE"
echo ""

cd "$WORKSPACE"

# Activate venv if available
if [ -f ".venv/bin/activate" ]; then
    source .venv/bin/activate
fi

echo "📊 Starting comprehensive monitoring..."
echo ""

# ========================================================================
# Section 1: GitHub Webhook Monitoring
# ========================================================================
echo "🔔 GitHub Webhook Monitoring"
echo "---"
python3 scripts/github_webhook_monitor.py 2>/dev/null || echo "⚠ Webhook monitor not available"
echo ""

# ========================================================================
# Section 2: Pro-Developer Workflow Analysis
# ========================================================================
echo "👨‍💻 Pro-Developer Workflow Analysis"
echo "---"
python3 scripts/agent_pro_developer.py 2>/dev/null || echo "⚠ Pro-developer module not available"
echo ""

# ========================================================================
# Section 3: GitHub Actions Monitoring
# ========================================================================
echo "⚙️  GitHub Actions Workflow Monitoring"
echo "---"
python3 scripts/github_actions_monitor.py 2>/dev/null || echo "⚠ Actions monitor not available"
echo ""

# ========================================================================
# Section 4: Agent State and Progress
# ========================================================================
echo "📈 Agent Execution State"
echo "---"
if [ -f ".ollama_agent_state.json" ]; then
    python3 << 'PYEOF'
import json
try:
    data = json.load(open('.ollama_agent_state.json'))
    print(f"✓ Iterations: {data.get('iteration', 0)}")
    print(f"✓ Processed Items: {len(data.get('processed', []))}")
    print(f"✓ Branch: {data.get('branch', 'N/A')}")
    print(f"✓ Last Run: {data.get('last_run', 'N/A')}")
except Exception as e:
    print(f"✗ Error reading state: {e}")
PYEOF
else
    echo "✗ Agent state file not found"
fi
echo ""

# ========================================================================
# Section 5: Activity Feed Summary
# ========================================================================
echo "📋 Recent Activity (Last 15 entries)"
echo "---"
if [ -f "OLLAMA_ACTIVITY_FEED.md" ]; then
    tail -n 15 OLLAMA_ACTIVITY_FEED.md | head -n 12
else
    echo "✗ No activity feed found"
fi
echo ""

# ========================================================================
# Section 6: Pending Items Summary
# ========================================================================
echo "⏳ Pending Work Summary"
echo "---"
if [ -f "OLLAMA_PENDING_REPORT.md" ]; then
    python3 << 'PYEOF'
import re
try:
    text = open('OLLAMA_PENDING_REPORT.md').read()
    match = re.search(r'Total pending items: (\d+)', text)
    if match:
        count = int(match.group(1))
        print(f"Total Pending: {count}")
        if count == 0:
            print("✓ All items complete!")
        else:
            print(f"⏳ {count} items require attention")
            # Show first 5 items
            items = re.findall(r'^- (.+)$', text, re.MULTILINE)
            for item in items[:5]:
                print(f"  • {item[:60]}...")
            if len(items) > 5:
                print(f"  ... and {len(items)-5} more")
except Exception as e:
    print(f"Error: {e}")
PYEOF
else
    echo "✗ Pending report not found"
fi
echo ""

# ========================================================================
# Section 7: GitHub Integration Status
# ========================================================================
echo "🔗 GitHub Integration Status"
echo "---"
echo "Branch: $(git rev-parse --abbrev-ref HEAD)"
echo "Commit: $(git rev-parse --short HEAD)"
echo "Remote: $(git remote get-url origin)"
UNPUSHED=$(git rev-list --count @{u}..HEAD 2>/dev/null || echo "0")
UNPULLED=$(git rev-list --count HEAD..@{u} 2>/dev/null || echo "0")
echo "Unpushed commits: $UNPUSHED"
echo "Unpulled commits: $UNPULLED"
echo ""

# ========================================================================
# Section 8: Monitoring Artifacts
# ========================================================================
echo "📁 Monitoring Artifacts Generated"
echo "---"
ARTIFACTS=(
    "AGENT_EXECUTION_PLAN.md"
    "AGENT_RESEARCH_FINDINGS.md"
    "AGENT_CODE_QUALITY.md"
    "GITHUB_WEBHOOK_LOG.md"
    "GITHUB_AGENT_STATUS.json"
    "GITHUB_WORKFLOW_STATUS.md"
    "WORKFLOW_ORCHESTRATION.md"
    "AGENT_NOTIFICATIONS.md"
    "AGENT_EXECUTION_MONITOR.md"
    "AGENT_MONITORING_DASHBOARD.md"
)

FOUND=0
for artifact in "${ARTIFACTS[@]}"; do
    if [ -f "$artifact" ]; then
        SIZE=$(wc -c < "$artifact" | numfmt --to=iec 2>/dev/null || echo "$(wc -c < "$artifact") bytes")
        echo "  ✓ $artifact ($SIZE)"
        ((FOUND++))
    fi
done
echo "Total monitoring artifacts: $FOUND"
echo ""

# ========================================================================
# Section 9: Recommendations & Next Steps
# ========================================================================
echo "💡 Recommendations & Next Steps"
echo "---"

if [ $UNPUSHED -gt 0 ]; then
    echo "1. ✓ Push changes to remote:"
    echo "   git push origin $(git rev-parse --abbrev-ref HEAD)"
fi

if grep -q "WORKFLOW_TOKEN_GAP" OLLAMA_PENDING_REPORT.md 2>/dev/null; then
    echo "2. ⚠ Resolve workflow token gaps:"
    echo "   Check GitHub Actions workflow configurations"
fi

PENDING=$(python3 -c "import json, re; data=open('OLLAMA_PENDING_REPORT.md').read(); m=re.search(r'Total pending items: (\d+)', data); print(m.group(1) if m else '0')" 2>/dev/null || echo "0")
if [ "$PENDING" != "0" ]; then
    echo "3. ⏳ Process remaining $PENDING pending items:"
    echo "   Run: python3 scripts/ollama_autonomous_agent.py"
fi

echo "4. 📊 Review monitoring dashboard:"
echo "   cat AGENT_MONITORING_DASHBOARD.md"

echo "5. 🚀 Trigger next workflow run (when ready):"
echo "   git push origin main  # Triggers ollamatrigger workflow"
echo ""

# ========================================================================
# Section 10: System Health Check
# ========================================================================
echo "🏥 System Health Check"
echo "---"

# Check Python
python3 -V >/dev/null 2>&1 && echo "✓ Python: OK" || echo "✗ Python: MISSING"

# Check Git
git --version >/dev/null 2>&1 && echo "✓ Git: OK" || echo "✗ Git: MISSING"

# Check required files
[ -f "scripts/ollama_autonomous_agent.py" ] && echo "✓ Agent script: OK" || echo "✗ Agent script: MISSING"
[ -d ".github/workflows" ] && echo "✓ Workflows: OK" || echo "✗ Workflows: MISSING"
[ -f "resumefromhere.txt" ] && echo "✓ Resume file: OK" || echo "✗ Resume file: MISSING"

echo ""
echo "========================================================================"
echo "✨ Monitoring cycle complete"
echo "========================================================================"
echo "Next monitoring: $(date -u -d '+1 hour' '+%Y-%m-%dT%H:%M:%SZ' 2>/dev/null || echo 'manual')"
echo ""
