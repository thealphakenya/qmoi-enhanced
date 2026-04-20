#!/bin/bash
# QMOI Enhanced - Quick Status Check
# Fast overview of system and AI services status

echo "📊 QMOI Enhanced - Quick Status"
echo "==============================="
echo "Time: $(date)"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if process is running
check_service() {
    local pid_file=$1
    local service_name=$2

    if [ -f "$pid_file" ]; then
        local pid=$(cat $pid_file)
        if ps -p $pid > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $service_name${NC}"
            return 0
        fi
    fi
    echo -e "${RED}❌ $service_name${NC}"
    return 1
}

# Count running services
running_count=0
total_count=8

echo "🤖 AI Services:"
check_service "ai_anomaly_service.pid" "Anomaly Detection" && ((running_count++))
check_service "ml_service.pid" "Machine Learning" && ((running_count++))
check_service "nlp_service.pid" "NLP" && ((running_count++))
check_service "cv_service.pid" "Computer Vision" && ((running_count++))
check_service "autonomous_service.pid" "Autonomous Learning" && ((running_count++))
check_service "advanced_analytics_service.pid" "Advanced Analytics" && ((running_count++))
check_service "advanced_performance_optimizer.pid" "Performance Optimizer" && ((running_count++))
check_service "ai_orchestrator.pid" "AI Orchestrator" && ((running_count++))

echo ""
echo "📈 System Health: $running_count/$total_count services running"

# System metrics
echo ""
echo "💻 System Resources:"
cpu_usage=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}' | cut -d'.' -f1)
echo "CPU: ${cpu_usage}%"

mem_info=$(free | grep Mem)
mem_total=$(echo $mem_info | awk '{print $2}')
mem_used=$(echo $mem_info | awk '{print $3}')
mem_percent=$((mem_used * 100 / mem_total))
echo "Memory: ${mem_percent}%"

disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
echo "Disk: ${disk_usage}%"

# Recent orchestrator activity
echo ""
echo "🎯 Recent AI Activity:"
if [ -f "ai_orchestrator.log" ]; then
    tail -3 ai_orchestrator.log | while read -r line; do
        # Extract timestamp and message
        timestamp=$(echo "$line" | cut -d' ' -f1-2)
        message=$(echo "$line" | cut -d' ' -f5-)
        echo "  $timestamp: $message"
    done
else
    echo "  No activity logs found"
fi

# Health status
echo ""
if [ $running_count -eq $total_count ]; then
    echo -e "${GREEN}🏆 System Status: FULLY OPERATIONAL${NC}"
    echo "All AI services are running and coordinated"
elif [ $running_count -ge 6 ]; then
    echo -e "${YELLOW}⚠️  System Status: MOSTLY OPERATIONAL${NC}"
    echo "$running_count/$total_count services running"
else
    echo -e "${RED}🚨 System Status: DEGRADED${NC}"
    echo "Only $running_count/$total_count services running"
fi

echo ""
echo "💡 Quick Commands:"
echo "  ./control_system.sh    - Full system control"
echo "  ./monitor_system.sh    - Real-time monitoring"
echo "  ./verify_deployment.sh - System verification"
echo "  tail -f *.log          - View all logs"