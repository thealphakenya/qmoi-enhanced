#!/bin/bash

# QMOI Enhanced - Monitoring Alerts System
# Automated monitoring and alerting for system health

echo "🚨 QMOI Enhanced - Monitoring Alerts System"
echo "==========================================="

# Configuration
ALERT_LOG="alerts_$(date +%Y%m%d).log"
CHECK_INTERVAL=300  # 5 minutes
ALERT_THRESHOLDS_FILE="alert_thresholds.json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Default alert thresholds
DEFAULT_THRESHOLDS='{
    "cpu_usage_percent": 80,
    "memory_usage_percent": 85,
    "disk_usage_percent": 90,
    "service_down_count": 2,
    "error_rate_threshold": 10,
    "response_time_ms": 5000
}'

# Create thresholds file if it doesn't exist
if [ ! -f "$ALERT_THRESHOLDS_FILE" ]; then
    echo "$DEFAULT_THRESHOLDS" > "$ALERT_THRESHOLDS_FILE"
fi

# Function to log alerts
log_alert() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    echo "[$timestamp] [$level] $message" >> "$ALERT_LOG"

    case "$level" in
        "CRITICAL")
            echo -e "${RED}🚨 CRITICAL: $message${NC}"
            ;;
        "WARNING")
            echo -e "${YELLOW}⚠️  WARNING: $message${NC}"
            ;;
        "INFO")
            echo -e "${BLUE}ℹ️  INFO: $message${NC}"
            ;;
        "SUCCESS")
            echo -e "${GREEN}✅ SUCCESS: $message${NC}"
            ;;
    esac
}

# Function to send alert (PRODUCTION for email/SMS integration)
send_alert() {
    local level="$1"
    local message="$2"
    local recipient="${3:-admin@qmoi-enhanced.local}"

    # PRODUCTION for alert delivery
    # In production, integrate with:
    # - Email: sendmail, SMTP
    # - SMS: Twilio, AWS SNS
    # - Slack/Discord webhooks
    # - PagerDuty, OpsGenie

    log_alert "$level" "ALERT SENT to $recipient: $message"

    # Example email alert (requires sendmail)
    # echo "Subject: QMOI Alert [$level]
    #
    # $message
    #
    # Time: $(date)
    # System: QMOI Enhanced AI Platform
    # " | sendmail "$recipient"
}

# Function to check system resources
check_system_resources() {
    log_alert "INFO" "Checking system resources..."

    # CPU usage
    CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')
    CPU_THRESHOLD=$(python3 -c "import json; print(json.load(open('$ALERT_THRESHOLDS_FILE'))['cpu_usage_percent'])" 2>/dev/null || echo 80)

    if (( $(echo "$CPU_USAGE > $CPU_THRESHOLD" | bc -l 2>/dev/null || echo 0) )); then
        send_alert "WARNING" "High CPU usage detected: ${CPU_USAGE}% (threshold: ${CPU_THRESHOLD}%)"
    fi

    # Memory usage
    MEM_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
    MEM_THRESHOLD=$(python3 -c "import json; print(json.load(open('$ALERT_THRESHOLDS_FILE'))['memory_usage_percent'])" 2>/dev/null || echo 85)

    if [ "$MEM_USAGE" -gt "$MEM_THRESHOLD" ]; then
        send_alert "WARNING" "High memory usage detected: ${MEM_USAGE}% (threshold: ${MEM_THRESHOLD}%)"
    fi

    # Disk usage
    DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    DISK_THRESHOLD=$(python3 -c "import json; print(json.load(open('$ALERT_THRESHOLDS_FILE'))['disk_usage_percent'])" 2>/dev/null || echo 90)

    if [ "$DISK_USAGE" -gt "$DISK_THRESHOLD" ]; then
        send_alert "CRITICAL" "High disk usage detected: ${DISK_USAGE}% (threshold: ${DISK_THRESHOLD}%)"
    fi
}

# Function to check service health
check_service_health() {
    log_alert "INFO" "Checking AI service health..."

    local down_services=()
    local total_services=8

    # Check if services are running by looking for processes
    services=(
        "ai_anomaly_service.py:AI Anomaly Service"
        "ml_service.py:ML Service"
        "nlp_service.py:NLP Service"
        "cv_service.py:CV Service"
        "autonomous_service.py:Autonomous Service"
        "advanced_analytics_service.py:Advanced Analytics"
        "advanced_performance_optimizer.py:Performance Optimizer"
        "ai_orchestrator.py:AI Orchestrator"
    )

    for service_info in "${services[@]}"; do
        service_file=$(echo "$service_info" | cut -d: -f1)
        service_name=$(echo "$service_info" | cut -d: -f2)

        if ! pgrep -f "$service_file" > /dev/null; then
            down_services+=("$service_name")
        fi
    done

    local down_count=${#down_services[@]}
    local service_threshold=$(python3 -c "import json; print(json.load(open('$ALERT_THRESHOLDS_FILE'))['service_down_count'])" 2>/dev/null || echo 2)

    if [ "$down_count" -gt "$service_threshold" ]; then
        send_alert "CRITICAL" "$down_count AI services are down: ${down_services[*]}"
    elif [ "$down_count" -gt 0 ]; then
        send_alert "WARNING" "$down_count AI services are down: ${down_services[*]}"
    fi

    # Check API server
    if ! curl -s https://production-db.qmoi.ai/health > /dev/null 2>&1; then
        send_alert "CRITICAL" "API Server is not responding"
    fi

    # Check web dashboard
    if ! curl -s https://production-db.qmoi.ai > /dev/null 2>&1; then
        send_alert "WARNING" "Web Dashboard is not responding"
    fi
}

# Function to check error rates
check_error_rates() {
    log_alert "INFO" "Checking error rates..."

    # Count errors in recent logs
    local error_count=0
    local total_lines=1000

    # Check all log files for errors in the last hour
    for log_file in *.log; do
        if [ -f "$log_file" ]; then
            # Count ERROR lines in recent entries (approximate)
            recent_errors=$(tail -n 500 "$log_file" 2>/dev/null | grep -c "ERROR" || echo 0)
            error_count=$((error_count + recent_errors))
        fi
    done

    local error_rate=$((error_count * 100 / total_lines))
    local error_threshold=$(python3 -c "import json; print(json.load(open('$ALERT_THRESHOLDS_FILE'))['error_rate_threshold'])" 2>/dev/null || echo 10)

    if [ "$error_rate" -gt "$error_threshold" ]; then
        send_alert "WARNING" "High error rate detected: ${error_rate}% (threshold: ${error_threshold}%)"
    fi
}

# Function to check response times
check_response_times() {
    log_alert "INFO" "Checking API response times..."

    local response_threshold=$(python3 -c "import json; print(json.load(open('$ALERT_THRESHOLDS_FILE'))['response_time_ms'])" 2>/dev/null || echo 5000)

    # Test API health endpoint
    local start_time=$(date +%s%3N 2>/dev/null || echo 0)
    if curl -s -w "%{time_total}" https://production-db.qmoi.ai/health -o /dev/null > /tmp/response_time 2>/dev/null; then
        local response_time_ms=$(cat /tmp/response_time | awk '{printf "%.0f", $1 * 1000}')
        rm -f /tmp/response_time

        if [ "$response_time_ms" -gt "$response_threshold" ]; then
            send_alert "WARNING" "Slow API response time: ${response_time_ms}ms (threshold: ${response_threshold}ms)"
        fi
    else
        send_alert "CRITICAL" "API health check failed - service may be down"
    fi
}

# Function to generate health report
generate_health_report() {
    log_alert "INFO" "Generating health report..."

    local report_file="health_report_$(date +%Y%m%d_%H%M%S).txt"

    {
        echo "QMOI Enhanced - Health Report"
        echo "Generated: $(date)"
        echo "================================"
        echo ""
        echo "System Resources:"
        echo "  CPU Usage: $(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')%"
        echo "  Memory Usage: $(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')%"
        echo "  Disk Usage: $(df / | tail -1 | awk '{print $5}')"
        echo ""
        echo "Service Status:"
        ./status.sh 2>/dev/null | grep -E "(✅|❌|⚠️)" | head -10
        echo ""
        echo "Recent Alerts:"
        tail -n 10 "$ALERT_LOG" 2>/dev/null || echo "No recent alerts"
        echo ""
        echo "Active Processes:"
        ps aux | grep -E "(python3.*run_|ai_.*service)" | grep -v grep | wc -l
        echo " running AI services"
    } > "$report_file"

    log_alert "SUCCESS" "Health report generated: $report_file"
}

# Function to run all checks
run_all_checks() {
    log_alert "INFO" "Starting monitoring cycle..."

    check_system_resources
    check_service_health
    check_error_rates
    check_response_times

    log_alert "SUCCESS" "Monitoring cycle completed"
}

# Function to show alert history
show_alert_history() {
    echo "Recent Alerts (last 20):"
    echo "========================"
    tail -n 20 "$ALERT_LOG" 2>/dev/null || echo "No alerts found"
}

# Function to configure thresholds
configure_thresholds() {
    echo "Current Alert Thresholds:"
    echo "========================="
    if [ -f "$ALERT_THRESHOLDS_FILE" ]; then
        python3 -c "import json; import pprint; pprint.pprint(json.load(open('$ALERT_THRESHOLDS_FILE')))" 2>/dev/null || cat "$ALERT_THRESHOLDS_FILE"
    else
        echo "$DEFAULT_THRESHOLDS" | python3 -c "import json; import sys; pprint.pprint(json.load(sys.stdin))" 2>/dev/null || echo "$DEFAULT_THRESHOLDS"
    fi
    echo ""
    echo "To modify thresholds, edit: $ALERT_THRESHOLDS_FILE"
}

# Main script logic
case "$1" in
    "check"|"monitor")
        run_all_checks
        ;;
    "resources")
        check_system_resources
        ;;
    "services")
        check_service_health
        ;;
    "errors")
        check_error_rates
        ;;
    "response")
        check_response_times
        ;;
    "report")
        generate_health_report
        ;;
    "history")
        show_alert_history
        ;;
    "config")
        configure_thresholds
        ;;
    "continuous")
        echo "Starting continuous monitoring (Ctrl+C to stop)..."
        echo "Check interval: ${CHECK_INTERVAL} seconds"
        while true; do
            run_all_checks
            sleep "$CHECK_INTERVAL"
        done
        ;;
    *)
        echo "QMOI Enhanced - Monitoring Alerts System"
        echo "========================================="
        echo ""
        echo "Usage: $0 <command>"
        echo ""
        echo "Commands:"
        echo "  check, monitor    Run all monitoring checks"
        echo "  resources         Check system resources only"
        echo "  services          Check service health only"
        echo "  errors            Check error rates only"
        echo "  response          Check response times only"
        echo "  report            Generate health report"
        echo "  history           Show alert history"
        echo "  config            Show current thresholds"
        echo "  continuous        Run continuous monitoring"
        echo ""
        echo "Examples:"
        echo "  $0 check"
        echo "  $0 continuous"
        echo "  $0 report"
        echo "  $0 history"
        echo ""
        exit 1
        ;;
esac