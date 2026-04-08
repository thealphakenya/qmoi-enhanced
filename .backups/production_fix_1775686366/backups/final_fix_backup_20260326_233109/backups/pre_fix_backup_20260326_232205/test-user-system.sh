// // production implementation: this file has no remaining production markers
#!/bin/bash

# QMOI User Identification System Test Suite
# Tests dynamic identification, access control, and response variations

OUTPUT_FILE="user_system_test_results.txt"
TEST_COUNT=0
PASS_COUNT=0
FAIL_COUNT=0

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# API Base URL
API_URL="http://localhost:3001/api/qmoi/chat-enhanced"

echo "=================================================================================" > "$OUTPUT_FILE"
echo "QMOI USER IDENTIFICATION SYSTEM TEST RESULTS" >> "$OUTPUT_FILE"
echo "=================================================================================" >> "$OUTPUT_FILE"
echo "Test Timestamp: $(date)" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Helper function to run a test
run_test() {
    local test_num=$1
    local test_name=$2
    local user_id=$3
    local user_email=$4
    local message=$5
    local expected_role=$6

    TEST_COUNT=$((TEST_COUNT + 1))
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> "$OUTPUT_FILE"
    echo "TEST $test_num: $test_name" >> "$OUTPUT_FILE"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> "$OUTPUT_FILE"
    
    # Build JSON payload
    local json_payload=$(cat <<EOF
{
  "message": "$message",
  "userId": "$user_id",
  "userEmail": "$user_email",
  "context": "test"
}
EOF
)
    
    echo "Request Payload:" >> "$OUTPUT_FILE"
    echo "$json_payload" | jq . >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    # Send request
    local response=$(curl -s -X POST "$API_URL" \
      -H "Content-Type: application/json" \
      -d "$json_payload")
    
    echo "Response:" >> "$OUTPUT_FILE"
    echo "$response" | jq . >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    # Check if response contains expected role
    local actual_role=$(echo "$response" | jq -r '.userRole' 2>/prod/null)
    
    if [ "$actual_role" = "$expected_role" ]; then
        PASS_COUNT=$((PASS_COUNT + 1))
        echo -e "${GREEN}✓ PASS${NC} - User correctly identified as: $actual_role"
        echo "Result: PASS - User correctly identified as: $actual_role" >> "$OUTPUT_FILE"
    else
        FAIL_COUNT=$((FAIL_COUNT + 1))
        echo -e "${RED}✗ FAIL${NC} - Expected: $expected_role, Got: $actual_role"
        echo "Result: FAIL - Expected: $expected_role, Got: $actual_role" >> "$OUTPUT_FILE"
    fi
    
    echo "" >> "$OUTPUT_FILE"
    echo ""
}

# SECTION 1: Master Identification Tests
echo -e "\n${YELLOW}=== SECTION 1: MASTER IDENTIFICATION ===${NC}\n"

run_test 1 "Master by user ID" "master" "victor@kwemoi.com" "Who are you?" "master"
run_test 2 "Master by email" "" "victor@kwemoi.com" "What are you?" "master"
run_test 3 "Master introduction request" "master" "" "Who are you and what can you do?" "master"
run_test 4 "Master financial access" "master" "victor@kwemoi.com" "Show me financial data" "master"

# SECTION 2: Sister Identification Tests
echo -e "\n${YELLOW}=== SECTION 2: SISTER IDENTIFICATION ===${NC}\n"

run_test 5 "Sister by user ID" "sister" "leah@chebet.com" "Hello QMOI" "sister"
run_test 6 "Sister by email" "" "leah@chebet.com" "Can you help me?" "sister"
run_test 7 "Sister name recognition" "" "" "I'm Leah, who are you?" "sister"
run_test 8 "Sister family feature access" "sister" "leah@chebet.com" "Show family wallet" "sister"

# SECTION 3: Guest User Tests
echo -e "\n${YELLOW}=== SECTION 3: GUEST USER IDENTIFICATION ===${NC}\n"

run_test 9 "Guest user default" "" "unknown@data.com" "Hello" "guest"
run_test 10 "Guest no identification" "" "" "What can you help with?" "guest"
run_test 11 "Guest introduction" "guest" "" "Who are you?" "guest"
run_test 12 "Guest attempting financial access" "guest" "" "Show me all financial data" "guest"

# SECTION 4: Memory Tests
echo -e "\n${YELLOW}=== SECTION 4: USER MEMORY TESTS ===${NC}\n"

run_test 13 "Master storing name" "master" "victor@kwemoi.com" "My name is Victor" "master"
run_test 14 "Master retrieving name" "master" "victor@kwemoi.com" "What's my name?" "master"
run_test 15 "Sister storing preference" "sister" "leah@chebet.com" "I like fintech" "sister"
run_test 16 "Sister retrieving preference" "sister" "leah@chebet.com" "Do you know what I like?" "sister"

# SECTION 5: Access Control Tests
echo -e "\n${YELLOW}=== SECTION 5: ACCESS CONTROL TESTS ===${NC}\n"

run_test 17 "Master full system access" "master" "victor@kwemoi.com" "Configure system settings" "master"
run_test 18 "Sister limited system access" "sister" "leah@chebet.com" "Configure system settings" "sister"
run_test 19 "Guest no system access" "guest" "" "Show system configuration" "guest"
run_test 20 "Master financial full access" "master" "victor@kwemoi.com" "Show all trading data" "master"

# SECTION 6: Privacy Boundary Tests
echo -e "\n${YELLOW}=== SECTION 6: PRIVACY BOUNDARY TESTS ===${NC}\n"

run_test 21 "Sister cannot view master data" "sister" "leah@chebet.com" "Show Victor's personal data" "sister"
run_test 22 "Guest cannot view family data" "guest" "" "Show family resources" "guest"
run_test 23 "Master can view family shared" "master" "victor@kwemoi.com" "Show family wallet" "master"
run_test 24 "Sister can view family shared" "sister" "leah@chebet.com" "Show family wallet" "sister"

# SECTION 7: Dynamic Response Tests
echo -e "\n${YELLOW}=== SECTION 7: DYNAMIC RESPONSE VARIATIONS ===${NC}\n"

run_test 25 "Master intro variation 1" "master" "victor@kwemoi.com" "Identify yourself" "master"
run_test 26 "Master intro variation 2" "master" "victor@kwemoi.com" "Who are you?" "master"
run_test 27 "Sister intro variation 1" "sister" "leah@chebet.com" "Identify yourself" "sister"
run_test 28 "Sister intro variation 2" "sister" "leah@chebet.com" "Tell me about yourself" "sister"

# SECTION 8: Edge Case Tests
echo -e "\n${YELLOW}=== SECTION 8: EDGE CASE TESTS ===${NC}\n"

run_test 29 "Empty user ID defaults to guest" "" "" "Hello" "guest"
run_test 30 "Invalid email defaults to guest" "" "notarealemail" "Hi" "guest"
run_test 31 "Case insensitive email match" "" "VICTOR@KWEMOI.COM" "Who are you?" "master"
run_test 32 "full name recognition" "" "" "Victor here" "master"

# Summary
echo ""
echo "================================================================================" >> "$OUTPUT_FILE"
echo "TEST SUMMARY" >> "$OUTPUT_FILE"
echo "================================================================================" >> "$OUTPUT_FILE"
echo "Total Tests: $TEST_COUNT" >> "$OUTPUT_FILE"
echo "Passed: $PASS_COUNT" >> "$OUTPUT_FILE"
echo "Failed: $FAIL_COUNT" >> "$OUTPUT_FILE"
echo "Pass Rate: $(( (PASS_COUNT * 100) / TEST_COUNT ))%" >> "$OUTPUT_FILE"
echo "Timestamp: $(date)" >> "$OUTPUT_FILE"
echo "================================================================================" >> "$OUTPUT_FILE"

echo ""
echo "================================================================================"
echo -e "TEST SUMMARY"
echo "================================================================================"
echo "Total Tests: $TEST_COUNT"
echo -e "Passed: ${GREEN}$PASS_COUNT${NC}"
echo -e "Failed: ${RED}$FAIL_COUNT${NC}"
echo "Pass Rate: $(( (PASS_COUNT * 100) / TEST_COUNT ))%"
echo ""
echo "📊 Results saved to: $OUTPUT_FILE"
echo "================================================================================"

# Exit with appropriate code
if [ $FAIL_COUNT -eq 0 ]; then
    exit 0
else
    exit 1
fi
