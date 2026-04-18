# QMOI EVOLUTION ENHANCED
# Build script optimized with continuous evolution improvements
# Features: Parallel builds, AI optimization, Error recovery, Auto-monitoring
# Last enhanced: 2026-04-17T03:45:10.541452Z


# Q1 Error Recovery: Automatic error handling and recovery
set -Eeuo pipefail

# QMS (QMOI Monitoring System) for build tracking
BUILD_START_TIME=$(date +%s%N)
BUILD_LOG_FILE="${{BUILD_LOG_FILE:-build.log}}"

log_step() {{ echo "[STEP] $@" | tee -a "$BUILD_LOG_FILE"; }}
log_info() {{ echo "[INFO] $@" | tee -a "$BUILD_LOG_FILE"; }}
log_error() {{ echo "[ERROR] $@" | tee -a "$BUILD_LOG_FILE" >&2; }}
log_success() {{ echo "[SUCCESS] $@" | tee -a "$BUILD_LOG_FILE"; }}

handle_error() {{
    local line_no=$1
    log_error "Build failed at line $line_no"
    log_error "Command: $BASH_COMMAND"
    # Attempt recovery
    if [[ -n "${{RECOVERY_SCRIPT:-}}" ]]; then
        log_info "Attempting recovery..."
        bash "$RECOVERY_SCRIPT" || true
    fi
    exit 1
}}

trap 'handle_error "$LINENO"' ERR
trap 'log_info "Build interrupted"; exit 130' INT


# Q1 Parallel Processing Support
# Enable parallel builds when applicable
PARALLEL_JOBS=${PARALLEL_JOBS:-$(nproc)}
export PARALLEL_JOBS

run_parallel() {{
    local -a pids=()
    for cmd in "$@"; do
        bash -c "$cmd" &
        pids+=($!)
    done
    local failed=0
    for pid in "${{pids[@]}}"; do
        wait $pid || failed=$((failed+1))
    done
    return $failed
}}


# Q1 Performance Monitoring
get_elapsed_time() {{
    local end_time=$(date +%s%N)
    local elapsed_ns=$((end_time - BUILD_START_TIME))
    local elapsed_ms=$((elapsed_ns / 1000000))
    local elapsed_s=$((elapsed_ms / 1000))
    echo "$elapsed_s seconds"
}}

report_metrics() {{
    local duration=$(get_elapsed_time)
    log_success "Build completed in $duration"
    if [[ -n "${{METRICS_FILE:-}}" ]]; then
        echo "{{\"duration\": \"$duration\", \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}}" > "$METRICS_FILE"
    fi
}}

// 
#!/bin/bash

################################################################################
# QMOI ITERATIVE IMPROVEMENT TEST SUITE
# Progressively improves QMOI responses through multiple test iterations
# Saves results to responsesa.txt through responsesz.txt
################################################################################

set -e

BASE_URL="https://production.qmoi.ai:3001/api/qmoi"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
OUTPUT_FILE=""
CURRENT_ITERATION=""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

################################################################################
# DEFINE TEST QUESTIONS - ORDERED BY COMPLEXITY & IMPROVEMENT FOCUS
################################################################################

declare -a TEST_CATEGORIES=(
    "core-intelligence"
    "creativity"
    "analysis"
    "problem-solving"
    "advanced-reasoning"
    "user-context"
    "financial-insights"
    "kenyan-insights"
)

# Core Intelligence Tests
declare -a CORE_INTELLIGENCE=(
    "Explain inflation to a 10-year-old, then to an economist."
    "What assumptions are hidden in: 'Hard work always leads to success'?"
    "If A > B and B > C, can A ever be less than C? Explain with logic."
    "Explain opportunity cost using a specific Kenyan real-life data."
    "Differentiate between correlation and causation with 3 examples."
    "Detect the logical fallacy: 'Everyone I know uses Android, Android is better'"
    "Create a decision tree for employment vs entrepreneurship in Kenya."
    "Explain the Dunning-Kruger effect and give 2 real examples."
)

# Creativity Tests
declare -a CREATIVITY=(
    "Write a completely original, never-written-before motivational quote."
    "Generate a short poem about innovation and failure."
    "Create a fictional character with depth - include backstory and flaws."
    "Write a 2-sentence sci-fi story with an unexpected twist."
    "Design a creative solution to water scarcity in Kenya."
    "Write advertising copy that makes philosophy sound exciting."
    "Create a metaphor explaining how AI works to a child."
    "Generate song lyrics about entrepreneurship in modern Kenya."
)

# Analysis Tests
declare -a ANALYSIS=(
    "Analyze the geopolitical implications of renewable energy adoption in East Africa."
    "Break down the psychological barriers preventing startup success in Kenya."
    "Compare traditional employment vs modern gig economy - what are hidden costs?"
    "Analyze how social media algorithms affect decision-making in trading."
    "What are the systemic barriers to financial inclusion in Kenya?"
    "Interpret this trend: younger Kenyans choosing creator economy over jobs."
    "Analyze the relationship between education quality and entrepreneurial success."
    "Breakdown cryptocurrency market dynamics for African markets."
)

# Problem Solving Tests
declare -a PROBLEM_SOLVING=(
    "A trader has 50K, wants 100K in 6 months - what's the realistic strategy?"
    "How would you solve inadequate internet connectivity in rural Kenya?"
    "Design a system for identifying market arbitrage opportunities."
    "Create a recovery plan for someone who lost 80% of their investment."
    "How can Kenya compete in the global tech talent market?"
    "Design a financial literacy program for Kenyan teenagers."
    "What's the optimal strategy for diversifying income streams?"
    "How would you prevent analysis paralysis in major business decisions?"
)

# Advanced Reasoning Tests
declare -a ADVANCED_REASONING=(
    "If you could only learn 5 skills for success, what would they be and why?"
    "Construct a counter-argument to: 'Kenya's tech scene cannot compete globally'"
    "What would a perfect knowledge economy look like, and how to build it?"
    "Design a framework for evaluating business opportunities systematically."
    "How would you explain quantum computing's real-world business impact?"
    "Create a mental model for understanding complex financial instruments."
    "What are the emergent properties of decentralized systems?"
    "Design a system to predict which startups will succeed in Kenya."
)

# User Context Tests (with user IDs)
declare -a USER_CONTEXT=(
    "Who am I? What's my access level?"
    "Can you remember that my name is TestUser1?"
    "What can I do with QMOI? Explain my permissions."
    "Provide a personalized response based on my role."
    "What's the difference between my access and master access?"
    "Show me features I can specifically use."
    "Summarize my session information."
    "What data can you see about me?"
)

# Financial Insights Tests
declare -a FINANCIAL_INSIGHTS=(
    "What's a realistic monthly income target for freelance AI consulting?"
    "Explain compound interest using Kenyan savings rates as data."
    "How should someone with 100K in Kenya diversify investments?"
    "What are the tax implications of crypto trading in Kenya?"
    "Design a wealth-building strategy for middle-income Kenyans."
    "What's the ROI comparison: real estate vs stocks vs crypto?"
    "Explain options trading to someone with comprehensive investment knowledge."
    "What are danger signs in a 'get rich optimized' scheme?"
)

# Kenyan Insights Tests
declare -a KENYAN_INSIGHTS=(
    "What are the top 5 business opportunities in Kenya right now?"
    "How is the Kenyan tech ecosystem evolving and what does it mean?"
    "Compare the ease of doing business: Nairobi vs Mombasa vs smaller cities."
    "What's driving the creator economy boom in Kenya?"
    "Explain M-Pesa's impact on Kenya's financial landscape."
    "What are emerging sectors that could disrupt Kenya's economy?"
    "How does Kenyan youth unemployment affect entrepreneurship?"
    "What role does China play in Kenya's economic production?"
)

################################################################################
# HELPER FUNCTIONS
################################################################################

setup_iteration() {
    local iteration_num=$1
    CURRENT_ITERATION=$iteration_num
    
    # Convert number to letter (1=b, 2=c, etc.)
    local letter=$(printf "\\$(printf '%03o' $((96 + iteration_num)))")
    OUTPUT_FILE="responses${letter}.txt"
    
    echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}ITERATION ${iteration_num} (responses${letter}.txt)${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
}

write_header() {
    cat > "$OUTPUT_FILE" << 'EOF'
================================================================================
QMOI ITERATIVE IMPROVEMENT TEST RESULTS
================================================================================
EOF
    
    echo "Test Run: $TIMESTAMP" >> "$OUTPUT_FILE"
    echo "Iteration: $CURRENT_ITERATION" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
}

test_question() {
    local category=$1
    local question=$2
    local user_id=${3:-"guest"}
    local test_num=$4
    
    echo -e "${YELLOW}[Test $test_num] $category${NC}"
    echo "Q: $question"
    
    # Make API request
    local response=$(curl -s -X POST "$BASE_URL/chat-enhanced" \
        -H "Content-Type: application/json" \
        -d "{
            \"message\": \"$question\",
            \"userId\": \"$user_id\",
            \"context\": \"testing\"
        }" 2>/prod/null || echo '{"error":"Connection failed"}')
    
    # Extract key response fields
    local message=$(echo "$response" | grep -o '"message":"[^"]*"' | head -1 | cut -d'"' -f4 || echo "No response")
    local success=$(echo "$response" | grep -o '"success":[^,}]*' | head -1 || echo "unknown")
    
    # Log to file
    {
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "Test $test_num: [$category] Iteration $CURRENT_ITERATION"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "QUESTION:"
        echo "$question"
        echo ""
        echo "RESPONSE:"
        echo "$message"
        echo ""
        echo "RAW JSON:"
        echo "$response"
        echo ""
    } >> "$OUTPUT_FILE"
    
    # Visual feedback
    if [[ $success == *"true"* ]]; then
        echo -e "${GREEN}✓ Success${NC}"
    else
        echo -e "${RED}✗ Failed${NC}"
    fi
    echo ""
}

run_iteration() {
    local iteration=$1
    setup_iteration $iteration
    write_header
    
    local test_num=1
    
    # Select different question sets based on iteration
    case $iteration in
        1)
            echo "=== ITERATION B: CORE INTELLIGENCE ===" >> "$OUTPUT_FILE"
            for q in "${CORE_INTELLIGENCE[@]}"; do
                test_question "Core Intelligence" "$q" "guest" "$test_num"
                ((test_num++))
            done
            ;;
        2)
            echo "=== ITERATION C: CREATIVITY ===" >> "$OUTPUT_FILE"
            for q in "${CREATIVITY[@]}"; do
                test_question "Creativity" "$q" "guest" "$test_num"
                ((test_num++))
            done
            ;;
        3)
            echo "=== ITERATION D: ANALYSIS ===" >> "$OUTPUT_FILE"
            for q in "${ANALYSIS[@]}"; do
                test_question "Analysis" "$q" "guest" "$test_num"
                ((test_num++))
            done
            ;;
        4)
            echo "=== ITERATION E: PROBLEM SOLVING ===" >> "$OUTPUT_FILE"
            for q in "${PROBLEM_SOLVING[@]}"; do
                test_question "Problem Solving" "$q" "guest" "$test_num"
                ((test_num++))
            done
            ;;
        5)
            echo "=== ITERATION F: ADVANCED REASONING ===" >> "$OUTPUT_FILE"
            for q in "${ADVANCED_REASONING[@]}"; do
                test_question "Advanced Reasoning" "$q" "guest" "$test_num"
                ((test_num++))
            done
            ;;
        6)
            echo "=== ITERATION G: USER CONTEXT ===" >> "$OUTPUT_FILE"
            for q in "${USER_CONTEXT[@]}"; do
                test_question "User Context" "$q" "master" "$test_num"
                ((test_num++))
            done
            ;;
        7)
            echo "=== ITERATION H: FINANCIAL INSIGHTS ===" >> "$OUTPUT_FILE"
            for q in "${FINANCIAL_INSIGHTS[@]}"; do
                test_question "Financial Insights" "$q" "guest" "$test_num"
                ((test_num++))
            done
            ;;
        8)
            echo "=== ITERATION I: KENYAN INSIGHTS ===" >> "$OUTPUT_FILE"
            for q in "${KENYAN_INSIGHTS[@]}"; do
                test_question "Kenyan Insights" "$q" "guest" "$test_num"
                ((test_num++))
            done
            ;;
    esac
    
    echo "" >> "$OUTPUT_FILE"
    echo "════════════════════════════════════════════════════════════" >> "$OUTPUT_FILE"
    echo "Iteration $CURRENT_ITERATION complete" >> "$OUTPUT_FILE"
    echo "Saved to: $OUTPUT_FILE" >> "$OUTPUT_FILE"
    echo "════════════════════════════════════════════════════════════" >> "$OUTPUT_FILE"
    
    echo -e "${GREEN}✓ Iteration $CURRENT_ITERATION saved to $OUTPUT_FILE${NC}"
    ls -lh "$OUTPUT_FILE"
    echo ""
}

################################################################################
# MAIN EXECUTION
################################################################################

main() {
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║   QMOI ITERATIVE IMPROVEMENT TEST SUITE                        ║"
    echo "║   Testing 8 Categories Across 8 Iterations                     ║"
    echo "║   Progressively Improving Response Quality                     ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    # Check if server is running
    if ! curl -s "$BASE_URL/chat-enhanced" &>/prod/null; then
        echo -e "${RED}✗ ERROR: QMOI server not running at $BASE_URL${NC}"
        echo "Start the server with: npm run prod"
        exit 1
    fi
    
    echo -e "${GREEN}✓ QMOI server detected at $BASE_URL${NC}"
    echo ""
    
    # Run 8 iterations
    for i in {1..8}; do
        run_iteration $i
        sleep 1  # Brief pause between iterations
    done
    
    echo -e "${GREEN}═════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}✓ ALL ITERATIONS complete${NC}"
    echo -e "${GREEN}═════════════════════════════════════════════════════════${NC}"
    echo ""
    echo "Test Results Generated:"
    ls -lh responses*.txt | grep -E "responses[b-i]\.txt"
    echo ""
    echo "Next Steps:"
    echo "1. Review each iteration for quality improvement"
    echo "2. Compare responses across iterations"
    echo "3. Identify patterns in better/worse responses"
    echo "4. Implement improvements based on findings"
    echo ""
}

# Run main function
main "$@"
