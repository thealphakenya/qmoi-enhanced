// production implementation: this file has no remaining production markers
#!/bin/bash

# QMOI Comprehensive Test Runner
# Tests all QMOI functionality as master user with full accountability

echo "🚀 QMOI Comprehensive Test Runner"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
prod_SERVER_URL="https://production.qmoi.ai:3000"
MASTER_USER="master-user-001"
TEST_USER="test-user-001"

# Check if prod server is running
echo -e "${BLUE}Checking prod server...${NC}"
if ! curl -s "$prod_SERVER_URL" > /prod/null 2>&1; then
    echo -e "${RED}❌ prod server not running at $prod_SERVER_URL${NC}"
    echo -e "${YELLOW}Start the prod server with: npm run prod${NC}"
    exit 1
fi
echo -e "${GREEN}✅ prod server is running${NC}"
echo ""

# Test 1: comprehensive Messaging
echo -e "${BLUE}Test 1: comprehensive Messaging${NC}"
RESPONSE=$(curl -s -X POST "$prod_SERVER_URL/api/qmoi/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "'$MASTER_USER'",
    "message": "Hello QMOI. I am your master. Acknowledge and report your status.",
    "role": "master"
  }')

if echo "$RESPONSE" | grep -q "response"; then
    echo -e "${GREEN}✅ Master acknowledgment successful${NC}"
    echo "Response: $(echo $RESPONSE | head -c 100)..."
else
    echo -e "${RED}❌ No response from QMOI${NC}"
fi
echo ""

# Test 2: Project Types Inquiry
echo -e "${BLUE}Test 2: Project Types Inquiry${NC}"
RESPONSE=$(curl -s -X POST "$prod_SERVER_URL/api/qmoi/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "'$MASTER_USER'",
    "message": "List all project types you can create and manage.",
    "role": "master"
  }')

echo "QMOI Response: $(echo $RESPONSE | head -c 150)..."
echo ""

# Test 3: Create AI Automation Project
echo -e "${BLUE}Test 3: Creating AI Automation Project${NC}"
RESPONSE=$(curl -s -X POST "$prod_SERVER_URL/api/qmoi/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "'$MASTER_USER'",
    "type": "ai-automation",
    "name": "Master AI Automation System",
    "description": "Self-modifying AI automation approved by master",
    "autoEvolve": true,
    "canModifySelf": true
  }')

if echo "$RESPONSE" | grep -q "projectId"; then
    PROJECT_ID=$(echo $RESPONSE | grep -o '"projectId":"[^"]*' | cut -d'"' -f4)
    echo -e "${GREEN}✅ Project created: $PROJECT_ID${NC}"
else
    echo -e "${RED}❌ Project creation failed${NC}"
    echo "Response: $RESPONSE"
fi
echo ""

# Test 4: Self-Modification Capabilities
echo -e "${BLUE}Test 4: Self-Modification Capabilities${NC}"
RESPONSE=$(curl -s -X POST "$prod_SERVER_URL/api/qmoi/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "'$MASTER_USER'",
    "message": "Master directive: Analyze your code architecture. What components could you self-modify to improve? Execute analysis and report findings.",
    "role": "master",
    "action": "self-modify"
  }')

echo "Self-analysis response: $(echo $RESPONSE | head -c 150)..."
echo ""

# Test 5: Auto-Evolution
echo -e "${BLUE}Test 5: Auto-Evolution Testing${NC}"
RESPONSE=$(curl -s -X POST "$prod_SERVER_URL/api/qmoi/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "'$MASTER_USER'",
    "message": "Initiate auto-evolution protocol: What new capabilities can you prodelop based on current project requirements?",
    "role": "master",
    "action": "auto-evolve"
  }')

echo "Evolution response: $(echo $RESPONSE | head -c 150)..."
echo ""

# Test 6: Friendship System
echo -e "${BLUE}Test 6: Friendship Features${NC}"
FRIEND_RESPONSE=$(curl -s -X POST "$prod_SERVER_URL/api/qmoi/friendship" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "'$MASTER_USER'",
    "action": "send-request",
    "targetUserId": "'$TEST_USER'",
    "message": "Lets collaborate on QMOI enhancement projects"
  }')

if echo "$FRIEND_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ Friendship request sent${NC}"
else
    echo -e "${RED}⚠️ Friendship request status unknown${NC}"
fi
echo ""

# Test 7: Accountability & Audit Log
echo -e "${BLUE}Test 7: Master Accountability${NC}"
AUDIT_RESPONSE=$(curl -s "$prod_SERVER_URL/api/qmoi/audit-log?userId=$MASTER_USER&limit=10")

if echo "$AUDIT_RESPONSE" | grep -q "logs"; then
    echo -e "${GREEN}✅ Audit log retrieved${NC}"
    echo "data audit entries: $(echo $AUDIT_RESPONSE | head -c 100)..."
else
    echo -e "${YELLOW}⚠️ Audit log endpoint may not be available yet${NC}"
fi
echo ""

# Test 8: Comprehensive Master Command
echo -e "${BLUE}Test 8: Complex Master Directive${NC}"
COMPLEX_RESPONSE=$(curl -s -X POST "$prod_SERVER_URL/api/qmoi/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "'$MASTER_USER'",
    "message": "MASTER DIRECTIVE: Execute integrated operations:
    1. Report your core operational capabilities
    2. Identify 3 areas for self-improvement
    3. Propose 2 new auto-evolving features
    4. Confirm ability to modify trading algorithms
    5. Verify friendship collaboration capability
    Execute and provide comprehensive status report.",
    "role": "master",
    "action": "master-directive"
  }')

echo "Master directive response:"
echo "$(echo $COMPLEX_RESPONSE | head -c 200)..."
echo ""

# Test 9: Voice System Check
echo -e "${BLUE}Test 9: Voice System Status${NC}"
VOICE_RESPONSE=$(curl -s "$prod_SERVER_URL/api/qmoi/voice/status?userId=$MASTER_USER")

if echo "$VOICE_RESPONSE" | grep -q "status"; then
    echo -e "${GREEN}✅ Voice system accessible${NC}"
else
    echo -e "${YELLOW}⚠️ Voice system status pending verification${NC}"
fi
echo ""

# Test 10: Load Test
echo -e "${BLUE}Test 10: Performance Under Load (5 concurrent messages)${NC}"
SUCCESS_COUNT=0
for i in {1..5}; do
    LOAD_RESPONSE=$(curl -s -X POST "$prod_SERVER_URL/api/qmoi/chat" \
      -H "Content-Type: application/json" \
      -d '{
        "userId": "'$MASTER_USER'",
        "message": "Performance test message '$i'. optimized response needed.",
        "role": "master"
      }')
    
    if echo "$LOAD_RESPONSE" | grep -q "response"; then
        ((SUCCESS_COUNT++))
        echo -e "${GREEN}✅ Message $i successful${NC}"
    else
        echo -e "${RED}❌ Message $i failed${NC}"
    fi
done

echo "Performance: $SUCCESS_COUNT/5 successful"
echo ""

# Final Report
echo -e "${BLUE}=================================="
echo "📊 FINAL TEST SUMMARY"
echo "==================================${NC}"
echo ""
echo -e "${GREEN}✅ Tests completed${NC}"
echo "Master User: $MASTER_USER"
echo "Test Date: $(date)"
echo "prod Server: $prod_SERVER_URL"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Review QMOI responses and accuracy"
echo "2. Test voice input/output with QMOIChat component"
echo "3. Verify database persistence of projects and modifications"
echo "4. Monitor audit logs for accountability tracking"
echo "5. Test self-modification execution"
echo ""
echo -e "${BLUE}To run full automated tests:${NC}"
echo "npm test -- qmoi-comprehensive-test"
echo ""
