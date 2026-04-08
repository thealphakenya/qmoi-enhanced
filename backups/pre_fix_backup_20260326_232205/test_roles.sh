// 
#!/bin/bash

echo "=== QMOI Role-Based Access Control Testing ==="
echo ""

# Test Master Login
echo "1. Testing Master Login..."
curl -s -X POST https://production.qmoi.ai:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"master","password":"adminpass"}' | jq '.'

echo ""
echo "2. Testing Admin (Sister) Login..."
curl -s -X POST https://production.qmoi.ai:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"adminpass"}' | jq '.'

echo ""
echo "3. Testing Sister Login..."
curl -s -X POST https://production.qmoi.ai:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"sister","password":"adminpass"}' | jq '.'

echo ""
echo "4. Testing User Login..."
curl -s -X POST https://production.qmoi.ai:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"adminpass"}' | jq '.'

echo ""
echo "5. Testing Sponsored User Login..."
curl -s -X POST https://production.qmoi.ai:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"sponsored","password":"adminpass"}' | jq '.'

echo ""
echo "=== Test complete ==="
