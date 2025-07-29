#!/bin/bash

API_URL="https://trueflow-landing-page-production.up.railway.app/api/ghl/create-lead"

echo "Testing Assessment Form API Endpoint"
echo "===================================="

# Test 1: Exact form structure from the assessment
echo -e "\nTest 1: Real Assessment Form Data"
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "",
    "businessName": "Test Company",
    "businessType": "Content Creator",
    "score": 75,
    "recommendation": "Complete System",
    "answers": {
      "current-content": "manual",
      "content-volume": "moderate",
      "crm-usage": "basic-crm",
      "lead-response": "hours",
      "time-spent": "moderate",
      "budget": "high"
    },
    "selectedPlan": "complete-system",
    "contentGoals": ["newsletters", "blogs"],
    "integrations": ["gohighlevel"],
    "timestamp": "2025-07-29T18:30:00.000Z"
  }' \
  -w "\nHTTP Status: %{http_code}\nTotal Time: %{time_total}s\n" \
  -v 2>&1 | grep -E "(HTTP Status:|Total Time:|{|}|<|>)"

# Test 2: Empty strings (should fail)
echo -e "\n\nTest 2: Empty String Fields (should fail)"
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "",
    "lastName": "",
    "email": "test@example.com"
  }' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

# Test 3: Check server health
echo -e "\n\nTest 3: Server Health Check"
curl -I "$API_URL" -s | head -n 5