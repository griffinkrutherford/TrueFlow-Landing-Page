#!/bin/bash

# Test email functionality in production
# Usage: ./test-production-email.sh [production-url]

PROD_URL=${1:-"https://trueflow.ai"}
AUTH_TOKEN=${2:-"test-trueflow-2025"}

echo "🔍 Testing email configuration at: $PROD_URL"
echo "================================================"

# Test 1: Basic diagnostic test
echo -e "\n📊 Running email diagnostics..."
curl -s -H "Authorization: Bearer $AUTH_TOKEN" \
  "$PROD_URL/api/email-test" | jq '.'

# Test 2: Send a custom test email
echo -e "\n📧 Sending test email to griffin@trueflow.ai..."
curl -s -X POST \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"testEmail": "griffin@trueflow.ai", "testSubject": "Production Email Test"}' \
  "$PROD_URL/api/email-test" | jq '.'

echo -e "\n✅ Tests complete. Check the output above for any errors."