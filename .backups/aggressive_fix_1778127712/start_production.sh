#!/bin/bash
# QMOI Enhanced - Production Startup Script
# Starts all AI services and orchestration in production mode

echo "🚀 QMOI Enhanced - Production Startup"
echo "===================================="
echo ""

# Set production environment
export NODE_ENV=production
export PYTHONPATH=/workspaces/qmoi-enhanced:$PYTHONPATH

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to log with timestamp
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

# Function to check if process is running
check_process() {
    local pid=$1
    if ps -p $pid > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to start service
start_service() {
    local service_name=$1
    local command=$2
    local log_file="${service_name}.log"

    log "Starting $service_name..."
    eval "$command > $log_file 2>&1 &"
    local pid=$!
    echo $pid > "${service_name}.pid"

    # Wait a moment and check if it's still running
    sleep 2
    if check_process $pid; then
        echo -e "${GREEN}✅ $service_name started (PID: $pid)${NC}"
        return 0
    else
        echo -e "${RED}❌ $service_name failed to start${NC}"
        return 1
    fi
}

# Function to stop service
stop_service() {
    local service_name=$1
    local pid_file="${service_name}.pid"

    if [ -f "$pid_file" ]; then
        local pid=$(cat $pid_file)
        if check_process $pid; then
            log "Stopping $service_name (PID: $pid)..."
            kill $pid 2>/dev/null
            sleep 2
            if check_process $pid; then
                kill -9 $pid 2>/dev/null
                sleep 1
            fi
            if check_process $pid; then
                echo -e "${RED}❌ Failed to stop $service_name${NC}"
            else
                echo -e "${GREEN}✅ $service_name stopped${NC}"
            fi
        else
            echo -e "${YELLOW}⚠️  $service_name was not running${NC}"
        fi
        rm -f $pid_file
    else
        echo -e "${YELLOW}⚠️  No PID file found for $service_name${NC}"
    fi
}

# Cleanup function
cleanup() {
    log "Shutting down all services..."
    stop_service "ai_orchestrator"
    stop_service "advanced_performance_optimizer"
    stop_service "advanced_analytics_service"
    stop_service "ai_anomaly_service"
    stop_service "ml_service"
    stop_service "nlp_service"
    stop_service "cv_service"
    stop_service "autonomous_service"
    log "All services stopped."
    exit 0
}

# Set trap for cleanup on exit
trap cleanup SIGINT SIGTERM

# Check Python availability
log "Checking Python environment..."
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 not found${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Python 3 available: $(python3 --version)${NC}"

# Start individual AI services first
log "Starting AI services..."

# Start anomaly detection service
start_service "ai_anomaly_service" "python3 run_ai_anomaly_service.py"

# Start ML service
start_service "ml_service" "python3 run_ml_service.py"

# Start NLP service
start_service "nlp_service" "python3 run_nlp_service.py"

# Start CV service
start_service "cv_service" "python3 run_cv_service.py"

# Start autonomous learning service
start_service "autonomous_service" "python3 run_autonomous_service.py"

# Start advanced analytics service
start_service "advanced_analytics_service" "python3 run_advanced_analytics_service.py"

# Start performance optimizer
start_service "advanced_performance_optimizer" "python3 run_advanced_performance_optimizer.py"

# Start API server
start_service "ai_api_server" "python3 run_ai_api_server.py"

# Start web dashboard
start_service "web_dashboard" "python3 run_web_dashboard.py"

# Start monitoring alerts system
start_service "monitoring_alerts" "./monitoring_alerts.sh continuous"

# Wait for services to initialize
log "Waiting for AI services to initialize..."
sleep 5

# Start the main orchestrator
log "Starting AI Orchestrator..."
start_service "ai_orchestrator" "python3 -c \"
import ai_orchestrator
orchestrator = ai_orchestrator.ai_orchestrator
orchestrator.start_orchestration()
import time
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    orchestrator.stop_orchestration()
\""

echo ""
echo -e "${GREEN}🎉 QMOI Enhanced Production System Started!${NC}"
echo ""
echo "Services running:"
echo "  • AI Orchestrator (Main coordination service)"
echo "  • Advanced Performance Optimizer (System monitoring)"
echo "  • Advanced Analytics Service (Predictive modeling)"
echo "  • AI Anomaly Service (Neural network anomaly detection)"
echo "  • ML Service (Machine learning algorithms)"
echo "  • NLP Service (Natural language processing)"
echo "  • CV Service (Computer vision)"
echo "  • Autonomous Service (Reinforcement learning)"
echo ""
echo "Monitor logs:"
echo "  tail -f ai_orchestrator.log"
echo "  tail -f advanced_performance_optimizer.log"
echo "  tail -f advanced_analytics_service.log"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Keep the script running to monitor services
log "Production system is running. Press Ctrl+C to stop."

# Monitor loop
while true; do
    sleep 30

    # Check if orchestrator is still running
    if [ -f "ai_orchestrator.pid" ]; then
        orchestrator_pid=$(cat ai_orchestrator.pid)
        if ! check_process $orchestrator_pid; then
            echo -e "${RED}❌ AI Orchestrator stopped unexpectedly${NC}"
            log "Attempting to restart AI Orchestrator..."
            start_service "ai_orchestrator" "python3 -c \"
import ai_orchestrator
orchestrator = ai_orchestrator.ai_orchestrator
orchestrator.start_orchestration()
import time
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    orchestrator.stop_orchestration()
\""
        fi
    fi
done