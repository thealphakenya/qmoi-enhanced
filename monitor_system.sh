#!/bin/bash
# QMOI Enhanced - System Monitoring Dashboard
# Real-time monitoring of all AI services and system health

echo "🔍 QMOI Enhanced - System Monitoring Dashboard"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if process is running
check_process() {
    local pid_file=$1
    local service_name=$2

    if [ -f "$pid_file" ]; then
        local pid=$(cat $pid_file)
        if ps -p $pid > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $service_name (PID: $pid)${NC}"
            return 0
        else
            echo -e "${RED}❌ $service_name (PID file exists but process not running)${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️  $service_name (No PID file found)${NC}"
        return 1
    fi
}

# Function to get system metrics
get_system_metrics() {
    echo ""
    echo -e "${BLUE}📊 System Metrics:${NC}"

    # CPU usage
    cpu_usage=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')
    echo -e "CPU Usage: ${cpu_usage}%"

    # Memory usage
    mem_info=$(free | grep Mem)
    mem_total=$(echo $mem_info | awk '{print $2}')
    mem_used=$(echo $mem_info | awk '{print $3}')
    mem_percent=$((mem_used * 100 / mem_total))
    echo -e "Memory Usage: ${mem_percent}% (${mem_used}KB / ${mem_total}KB)"

    # Disk usage
    disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    echo -e "Disk Usage: ${disk_usage}%"

    # Process count
    process_count=$(ps aux | wc -l)
    echo -e "Total Processes: $process_count"
}

# Function to check service logs
check_recent_logs() {
    local log_file=$1
    local service_name=$2

    echo ""
    echo -e "${BLUE}📝 Recent $service_name Logs:${NC}"

    if [ -f "$log_file" ]; then
        tail -5 "$log_file" | while read -r line; do
            # Color code log levels
            if echo "$line" | grep -q "ERROR\|CRITICAL"; then
                echo -e "${RED}$line${NC}"
            elif echo "$line" | grep -q "WARNING"; then
                echo -e "${YELLOW}$line${NC}"
            elif echo "$line" | grep -q "INFO"; then
                echo -e "${GREEN}$line${NC}"
            else
                echo "$line"
            fi
        done
    else
        echo -e "${YELLOW}No log file found${NC}"
    fi
}

# Function to test AI orchestrator
test_orchestrator() {
    echo ""
    echo -e "${BLUE}🧪 Testing AI Orchestrator:${NC}"

    # Test system status
    python3 -c "
import sys
sys.path.append('.')
try:
    import ai_orchestrator
    orchestrator = ai_orchestrator.ai_orchestrator

    # Get system status
    status = orchestrator.get_system_status()
    print('✅ Orchestrator Status: Running')
    print(f'   Services Available: {status.get(\"services_available\", \"Unknown\")}')
    print(f'   Queued Tasks: {status.get(\"queued_tasks\", 0)}')
    print(f'   Active Tasks: {status.get(\"active_tasks\", 0)}')
    print(f'   Completed Tasks: {status.get(\"completed_tasks\", 0)}')

    # Submit a test task
    task_id = orchestrator.submit_task('anomaly_detection', {'data': [1, 2, 3, 4, 5]})
    print(f'✅ Test Task Submitted: {task_id}')

except Exception as e:
    print(f'❌ Orchestrator Test Failed: {e}')
" 2>/dev/null
}

# Main monitoring loop
while true; do
    clear
    echo "🔍 QMOI Enhanced - System Monitoring Dashboard"
    echo "=============================================="
    echo "Last Updated: $(date)"
    echo ""

    # Check service status
    echo -e "${BLUE}🤖 AI Services Status:${NC}"
    check_process "ai_anomaly_service.pid" "AI Anomaly Service"
    check_process "ml_service.pid" "ML Service"
    check_process "nlp_service.pid" "NLP Service"
    check_process "cv_service.pid" "CV Service"
    check_process "autonomous_service.pid" "Autonomous Service"
    check_process "advanced_analytics_service.pid" "Advanced Analytics Service"
    check_process "advanced_performance_optimizer.pid" "Performance Optimizer"
    check_process "ai_orchestrator.pid" "AI Orchestrator"

    # System metrics
    get_system_metrics

    # Test orchestrator
    test_orchestrator

    # Recent logs
    check_recent_logs "ai_orchestrator.log" "AI Orchestrator"
    check_recent_logs "advanced_performance_optimizer.log" "Performance Optimizer"
    check_recent_logs "advanced_analytics_service.log" "Analytics Service"

    echo ""
    echo -e "${BLUE}Commands:${NC}"
    echo "  r - Refresh dashboard"
    echo "  l - View full logs"
    echo "  t - Run system tests"
    echo "  q - Quit monitoring"
    echo ""
    echo "Press any key to refresh, 'q' to quit..."

    # Wait for user input with timeout
    read -t 10 -n 1 -s key

    if [[ $key == "q" ]]; then
        echo ""
        echo "Monitoring stopped."
        exit 0
    elif [[ $key == "l" ]]; then
        echo ""
        echo "Select log to view:"
        echo "1. AI Orchestrator"
        echo "2. Performance Optimizer"
        echo "3. Analytics Service"
        echo "4. All Services"
        read -n 1 -s log_choice

        case $log_choice in
            1) less +F ai_orchestrator.log ;;
            2) less +F advanced_performance_optimizer.log ;;
            3) less +F advanced_analytics_service.log ;;
            4) tail -f *.log ;;
        esac
    elif [[ $key == "t" ]]; then
        echo ""
        echo "Running system tests..."
        ./verify_deployment.sh
        echo ""
        echo "Press any key to continue..."
        read -n 1 -s
    fi

    # Auto-refresh every 30 seconds if no key pressed
    sleep 1
done