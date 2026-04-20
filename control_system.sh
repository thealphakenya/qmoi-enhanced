#!/bin/bash
# QMOI Enhanced - System Control Center
# Manage and control all AI services

echo "🎛️  QMOI Enhanced - System Control Center"
echo "========================================"
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
    if [ -f "$pid_file" ]; then
        local pid=$(cat $pid_file)
        if ps -p $pid > /dev/null 2>&1; then
            return 0
        fi
    fi
    return 1
}

# Function to stop service
stop_service() {
    local service_name=$1
    local pid_file="${service_name}.pid"

    if [ -f "$pid_file" ]; then
        local pid=$(cat $pid_file)
        if check_process "$pid_file"; then
            echo -e "${BLUE}Stopping $service_name (PID: $pid)...${NC}"
            kill $pid 2>/dev/null
            sleep 2
            if check_process "$pid_file"; then
                kill -9 $pid 2>/dev/null
                sleep 1
            fi
            if check_process "$pid_file"; then
                echo -e "${RED}❌ Failed to stop $service_name${NC}"
            else
                echo -e "${GREEN}✅ $service_name stopped${NC}"
                rm -f $pid_file
            fi
        else
            echo -e "${YELLOW}⚠️  $service_name was not running${NC}"
            rm -f $pid_file
        fi
    else
        echo -e "${YELLOW}⚠️  No PID file found for $service_name${NC}"
    fi
}

# Function to start service
start_service() {
    local service_name=$1
    local command=$2
    local log_file="${service_name}.log"

    if check_process "${service_name}.pid"; then
        echo -e "${YELLOW}⚠️  $service_name is already running${NC}"
        return 1
    fi

    echo -e "${BLUE}Starting $service_name...${NC}"
    eval "$command > $log_file 2>&1 &"
    local pid=$!
    echo $pid > "${service_name}.pid"

    sleep 2
    if check_process "${service_name}.pid"; then
        echo -e "${GREEN}✅ $service_name started (PID: $pid)${NC}"
        return 0
    else
        echo -e "${RED}❌ $service_name failed to start${NC}"
        return 1
    fi
}

# Function to restart service
restart_service() {
    local service_name=$1
    local command=$2

    echo -e "${BLUE}Restarting $service_name...${NC}"
    stop_service "$service_name"
    sleep 1
    start_service "$service_name" "$command"
}

# Function to show service status
show_status() {
    echo ""
    echo -e "${BLUE}🤖 AI Services Status:${NC}"

    services=("ai_anomaly_service" "ml_service" "nlp_service" "cv_service" "autonomous_service" "advanced_analytics_service" "advanced_performance_optimizer" "ai_orchestrator")

    for service in "${services[@]}"; do
        if check_process "${service}.pid"; then
            pid=$(cat "${service}.pid")
            echo -e "${GREEN}✅ $service (PID: $pid)${NC}"
        else
            echo -e "${RED}❌ $service (Not running)${NC}"
        fi
    done
}

# Function to test AI orchestrator
test_orchestrator() {
    echo ""
    echo -e "${BLUE}🧪 Testing AI Orchestrator:${NC}"

    python3 -c "
import sys
sys.path.append('.')
try:
    import ai_orchestrator
    orchestrator = ai_orchestrator.ai_orchestrator

    # Submit test tasks
    tasks = [
        ('anomaly_detection', {'data': [1, 2, 3, 4, 5]}),
        ('predictive_analytics', {'data': {'metric1': 10, 'metric2': 20}})
    ]

    for task_type, data in tasks:
        task_id = orchestrator.submit_task(task_type, data)
        print(f'✅ Submitted {task_type} task: {task_id}')

    # Get status
    status = orchestrator.get_system_status()
    print(f'📊 System Health: {status.get(\"overall_health\", \"Unknown\")}')
    print(f'📋 Queued Tasks: {status.get(\"queued_tasks\", 0)}')

except Exception as e:
    print(f'❌ Test failed: {e}')
" 2>/dev/null
}

# Function to show logs
show_logs() {
    echo ""
    echo "Select service to view logs:"
    echo "1. AI Orchestrator"
    echo "2. Performance Optimizer"
    echo "3. Analytics Service"
    echo "4. AI Anomaly Service"
    echo "5. ML Service"
    echo "6. NLP Service"
    echo "7. CV Service"
    echo "8. Autonomous Service"
    echo "9. All logs"
    echo "0. Back to main menu"
    echo ""

    read -n 1 -s choice

    case $choice in
        1) less +F ai_orchestrator.log ;;
        2) less +F advanced_performance_optimizer.log ;;
        3) less +F advanced_analytics_service.log ;;
        4) less +F ai_anomaly_service.log ;;
        5) less +F ml_service.log ;;
        6) less +F nlp_service.log ;;
        7) less +F cv_service.log ;;
        8) less +F autonomous_service.log ;;
        9) tail -f *.log ;;
        0) return ;;
    esac
}

# Function to show system metrics
show_metrics() {
    echo ""
    echo -e "${BLUE}📊 System Metrics:${NC}"

    # CPU, Memory, Disk
    echo "CPU Usage: $(top -bn1 | grep 'Cpu(s)' | sed 's/.*, *\([0-9.]*\)%* id.*/\1/' | awk '{print 100 - $1}')%"
    mem_info=$(free | grep Mem)
    mem_total=$(echo $mem_info | awk '{print $2}')
    mem_used=$(echo $mem_info | awk '{print $3}')
    echo "Memory: $((mem_used * 100 / mem_total))% ($mem_used KB / $mem_total KB)"
    echo "Disk Usage: $(df / | tail -1 | awk '{print $5}')"
    echo "Processes: $(ps aux | wc -l)"
}

# Main menu
while true; do
    clear
    echo "🎛️  QMOI Enhanced - System Control Center"
    echo "========================================"
    echo "Date: $(date)"
    echo ""

    show_status

    echo ""
    echo -e "${BLUE}Control Options:${NC}"
    echo "1. Start All Services"
    echo "2. Stop All Services"
    echo "3. Restart All Services"
    echo "4. Start Individual Service"
    echo "5. Stop Individual Service"
    echo "6. Restart Individual Service"
    echo "7. Test AI Orchestrator"
    echo "8. View System Metrics"
    echo "9. View Service Logs"
    echo "0. Exit"
    echo ""

    read -n 1 -s choice
    echo ""

    case $choice in
        1) # Start all services
            echo "Starting all AI services..."
            start_service "ai_anomaly_service" "python3 run_ai_anomaly_service.py"
            start_service "ml_service" "python3 run_ml_service.py"
            start_service "nlp_service" "python3 run_nlp_service.py"
            start_service "cv_service" "python3 run_cv_service.py"
            start_service "autonomous_service" "python3 run_autonomous_service.py"
            start_service "advanced_analytics_service" "python3 run_advanced_analytics_service.py"
            start_service "advanced_performance_optimizer" "python3 run_advanced_performance_optimizer.py"
            sleep 3
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
            echo "All services started. Press any key to continue..."
            read -n 1 -s
            ;;

        2) # Stop all services
            echo "Stopping all services..."
            stop_service "ai_orchestrator"
            stop_service "advanced_performance_optimizer"
            stop_service "advanced_analytics_service"
            stop_service "ai_anomaly_service"
            stop_service "ml_service"
            stop_service "nlp_service"
            stop_service "cv_service"
            stop_service "autonomous_service"
            echo "All services stopped. Press any key to continue..."
            read -n 1 -s
            ;;

        3) # Restart all services
            echo "Restarting all services..."
            # Stop all
            stop_service "ai_orchestrator"
            stop_service "advanced_performance_optimizer"
            stop_service "advanced_analytics_service"
            stop_service "ai_anomaly_service"
            stop_service "ml_service"
            stop_service "nlp_service"
            stop_service "cv_service"
            stop_service "autonomous_service"
            sleep 2
            # Start all
            start_service "ai_anomaly_service" "python3 run_ai_anomaly_service.py"
            start_service "ml_service" "python3 run_ml_service.py"
            start_service "nlp_service" "python3 run_nlp_service.py"
            start_service "cv_service" "python3 run_cv_service.py"
            start_service "autonomous_service" "python3 run_autonomous_service.py"
            start_service "advanced_analytics_service" "python3 run_advanced_analytics_service.py"
            start_service "advanced_performance_optimizer" "python3 run_advanced_performance_optimizer.py"
            sleep 3
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
            echo "All services restarted. Press any key to continue..."
            read -n 1 -s
            ;;

        4) # Start individual service
            echo "Select service to start:"
            echo "1. AI Anomaly Service"
            echo "2. ML Service"
            echo "3. NLP Service"
            echo "4. CV Service"
            echo "5. Autonomous Service"
            echo "6. Advanced Analytics Service"
            echo "7. Performance Optimizer"
            echo "8. AI Orchestrator"
            read -n 1 -s service_choice

            case $service_choice in
                1) start_service "ai_anomaly_service" "python3 run_ai_anomaly_service.py" ;;
                2) start_service "ml_service" "python3 run_ml_service.py" ;;
                3) start_service "nlp_service" "python3 run_nlp_service.py" ;;
                4) start_service "cv_service" "python3 run_cv_service.py" ;;
                5) start_service "autonomous_service" "python3 run_autonomous_service.py" ;;
                6) start_service "advanced_analytics_service" "python3 run_advanced_analytics_service.py" ;;
                7) start_service "advanced_performance_optimizer" "python3 run_advanced_performance_optimizer.py" ;;
                8) start_service "ai_orchestrator" "python3 -c \"
import ai_orchestrator
orchestrator = ai_orchestrator.ai_orchestrator
orchestrator.start_orchestration()
import time
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    orchestrator.stop_orchestration()
\"" ;;
            esac
            echo "Press any key to continue..."
            read -n 1 -s
            ;;

        5) # Stop individual service
            echo "Select service to stop:"
            echo "1. AI Anomaly Service"
            echo "2. ML Service"
            echo "3. NLP Service"
            echo "4. CV Service"
            echo "5. Autonomous Service"
            echo "6. Advanced Analytics Service"
            echo "7. Performance Optimizer"
            echo "8. AI Orchestrator"
            read -n 1 -s service_choice

            case $service_choice in
                1) stop_service "ai_anomaly_service" ;;
                2) stop_service "ml_service" ;;
                3) stop_service "nlp_service" ;;
                4) stop_service "cv_service" ;;
                5) stop_service "autonomous_service" ;;
                6) stop_service "advanced_analytics_service" ;;
                7) stop_service "advanced_performance_optimizer" ;;
                8) stop_service "ai_orchestrator" ;;
            esac
            echo "Press any key to continue..."
            read -n 1 -s
            ;;

        6) # Restart individual service
            echo "Select service to restart:"
            echo "1. AI Anomaly Service"
            echo "2. ML Service"
            echo "3. NLP Service"
            echo "4. CV Service"
            echo "5. Autonomous Service"
            echo "6. Advanced Analytics Service"
            echo "7. Performance Optimizer"
            echo "8. AI Orchestrator"
            read -n 1 -s service_choice

            case $service_choice in
                1) restart_service "ai_anomaly_service" "python3 run_ai_anomaly_service.py" ;;
                2) restart_service "ml_service" "python3 run_ml_service.py" ;;
                3) restart_service "nlp_service" "python3 run_nlp_service.py" ;;
                4) restart_service "cv_service" "python3 run_cv_service.py" ;;
                5) restart_service "autonomous_service" "python3 run_autonomous_service.py" ;;
                6) restart_service "advanced_analytics_service" "python3 run_advanced_analytics_service.py" ;;
                7) restart_service "advanced_performance_optimizer" "python3 run_advanced_performance_optimizer.py" ;;
                8) restart_service "ai_orchestrator" "python3 -c \"
import ai_orchestrator
orchestrator = ai_orchestrator.ai_orchestrator
orchestrator.start_orchestration()
import time
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    orchestrator.stop_orchestration()
\"" ;;
            esac
            echo "Press any key to continue..."
            read -n 1 -s
            ;;

        7) # Test orchestrator
            test_orchestrator
            echo "Press any key to continue..."
            read -n 1 -s
            ;;

        8) # Show metrics
            show_metrics
            echo "Press any key to continue..."
            read -n 1 -s
            ;;

        9) # Show logs
            show_logs
            ;;

        0) # Exit
            echo "Exiting System Control Center..."
            exit 0
            ;;

        *) # Invalid choice
            echo "Invalid choice. Press any key to continue..."
            read -n 1 -s
            ;;
    esac
done