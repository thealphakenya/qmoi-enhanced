#!/bin/bash
# Integration test for /api/ai and /api/qmoi/chat endpoints
# Requires: local Next.js dev server running on http://localhost:3000

BASE_URL="${BASE_URL:-http://localhost:3000}"
ENDPOINT_AI="${BASE_URL}/api/ai"
ENDPOINT_CHAT="${BASE_URL}/api/qmoi/chat"

echo "=== QMOI AI Endpoint Integration Test ==="
echo "Base URL: $BASE_URL"
echo ""

# Test 1: GET /api/ai (info endpoint)
echo "Test 1: GET /api/ai"
RESPONSE=$(curl -s -X GET "$ENDPOINT_AI" -H "Content-Type: application/json")
echo "Response: $RESPONSE"
echo ""

# Test 2: POST /api/ai with simple message
echo "Test 2: POST /api/ai with message"
RESPONSE=$(curl -s -X POST "$ENDPOINT_AI" \
  -H "Content-Type: application/json" \
  -d '{"input":"Hello QMOI","sessionId":"test-session-1","userId":"test-user"}')
echo "Response: $RESPONSE" | head -c 300
echo ""
echo ""

# Test 3: POST /api/ai with visualization
echo "Test 3: POST /api/ai with visualization"
RESPONSE=$(curl -s -X POST "$ENDPOINT_AI" \
  -H "Content-Type: application/json" \
  -d '{"input":"visualize sales data","sessionId":"test-session-1","userId":"test-user"}')
if echo "$RESPONSE" | grep -q "visualizations"; then
  echo "✓ Visualization generated"
else
  echo "✗ No visualization"
fi
echo ""

echo "=== Tests Complete ==="
