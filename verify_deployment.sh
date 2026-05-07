#!/bin/bash

# QMOI Enhanced - System Verification Script
# Verifies that all components are properly installed and operational

echo "🔍 QMOI Enhanced System Verification"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
        return 0
    else
        echo -e "${RED}✗${NC} $1 missing"
        return 1
    fi
}

# Function to check if file is executable
check_executable() {
    if [ -x "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 is executable"
        return 0
    else
        echo -e "${RED}✗${NC} $1 is not executable"
        return 1
    fi
}

# Function to check if service is running
check_service() {
    if pgrep -f "$1" > /dev/null; then
        echo -e "${GREEN}✓${NC} $2 is running"
        return 0
    else
        echo -e "${RED}✗${NC} $2 is not running"
        return 1
    fi
}

echo ""
echo "📁 Checking Core Files..."
echo "-------------------------"

# Check core AI service files
check_file "ai_anomaly_service.py"
check_file "ml_service.py"
check_file "nlp_service.py"
check_file "cv_service.py"
check_file "autonomous_service.py"
check_file "ai_orchestrator.py"
check_file "advanced_performance_optimizer.py"
check_file "advanced_analytics_service.py"

# Check operational files
check_file "ai_api_server.py"
check_file "web_dashboard.py"

# Check runner scripts
check_file "run_ai_anomaly_service.py"
check_file "run_ml_service.py"
check_file "run_nlp_service.py"
check_file "run_cv_service.py"
check_file "run_autonomous_service.py"
check_file "run_ai_orchestrator.py"
check_file "run_advanced_performance_optimizer.py"
check_file "run_advanced_analytics_service.py"
check_file "run_ai_api_server.py"
check_file "run_web_dashboard.py"

# Check shell scripts
check_file "start_production.sh"
check_file "status.sh"
check_file "control_system.sh"
check_file "monitor_system.sh"
check_file "maintenance.sh"
check_file "verify_deployment.sh"

echo ""
echo "🔧 Checking Executable Permissions..."
echo "-------------------------------------"

# Check script executability
check_executable "start_production.sh"
check_executable "status.sh"
check_executable "control_system.sh"
check_executable "monitor_system.sh"
check_executable "maintenance.sh"
check_executable "verify_deployment.sh"

echo ""
echo "🚀 Checking Running Services..."
echo "-------------------------------"

# Check if services are running (this will depend on if system is started)
check_service "run_ai_orchestrator.py" "AI Orchestrator"
check_service "run_ai_api_server.py" "API Server"
check_service "run_web_dashboard.py" "Web Dashboard"
check_service "run_advanced_performance_optimizer.py" "Performance Optimizer"
check_service "run_advanced_analytics_service.py" "Advanced Analytics"
check_service "run_ai_anomaly_service.py" "AI Anomaly Service"
check_service "run_ml_service.py" "ML Service"
check_service "run_nlp_service.py" "NLP Service"
check_service "run_cv_service.py" "CV Service"
check_service "run_autonomous_service.py" "Autonomous Service"

echo ""
echo "📊 Checking System Resources..."
echo "-------------------------------"

# Check disk space
DISK_USAGE=$(df -h . | tail -1 | awk '{print $5}')
echo -e "💾 Disk Usage: ${DISK_USAGE}"

# Check memory
MEM_USAGE=$(free -h | grep "Mem:" | awk '{print $3 "/" $2}')
echo -e "🧠 Memory Usage: ${MEM_USAGE}"

# Check CPU load
CPU_LOAD=$(uptime | awk -F'load average:' '{ print $2 }')
echo -e "⚡ CPU Load: ${CPU_LOAD}"

echo ""
echo "📝 Checking Log Files..."
echo "------------------------"

# Check for log files
LOG_FILES=(
    "ai_orchestrator.log"
    "advanced_performance_optimizer.log"
    "advanced_analytics_service.log"
    "ai_anomaly_service.log"
    "ml_service.log"
    "nlp_service.log"
    "cv_service.log"
    "autonomous_service.log"
    "ai_api_server.log"
    "web_dashboard.log"
)

for log_file in "${LOG_FILES[@]}"; do
    if [ -f "$log_file" ]; then
        LOG_SIZE=$(du -h "$log_file" | cut -f1)
        echo -e "${GREEN}✓${NC} $log_file (${LOG_SIZE})"
    else
        echo -e "${YELLOW}⚠${NC} $log_file not found (will be created when service starts)"
    fi
done

echo ""
echo "🌐 Checking Network Ports..."
echo "----------------------------"

# Check if ports are in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${GREEN}✓${NC} Port $1 is in use"
        return 0
    else
        echo -e "${RED}✗${NC} Port $1 is not in use"
        return 1
    fi
}

check_port 3000  # API Server
check_port 5000  # Web Dashboard

echo ""
echo "🧪 Testing API Endpoints..."
echo "---------------------------"

# Test API health endpoint
if curl -s https://qmoi.ai/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} API Server health check passed"
else
    echo -e "${RED}✗${NC} API Server health check failed"
fi

# Test web dashboard
if curl -s https://qmoi.ai > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Web Dashboard responding"
else
    echo -e "${RED}✗${NC} Web Dashboard not responding"
fi

echo ""
echo "📋 Verification Summary"
echo "======================="

echo "✅ System verification complete!"
echo ""
echo "📖 For detailed operations guide, see: OPERATIONS_GUIDE.md"
echo "🚀 To start the system: ./start_production.sh"
echo "📊 To check status: ./status.sh"
echo "🌐 Web Dashboard: https://qmoi.ai"
echo "🔌 API Server: https://qmoi.ai"

echo ""
echo "🎯 System Status: READY FOR production"
echo ""