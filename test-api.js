#!/usr/bin/env node

const https = require('https');

const API_URL = 'https://trueflow-landing-page-production.up.railway.app/api/ghl/create-lead';

// Test 1: Minimal required fields
async function testMinimalFields() {
  console.log('\n=== TEST 1: Minimal Required Fields ===');
  const data = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com'
  };
  
  return makeRequest(data, 'Minimal fields test');
}

// Test 2: Full assessment data
async function testFullAssessment() {
  console.log('\n=== TEST 2: Full Assessment Data ===');
  const data = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    businessName: 'Test Business LLC',
    businessType: 'Content Creator',
    score: 75,
    recommendation: 'Complete System',
    answers: {
      'current-content': 'manual',
      'content-volume': 'moderate',
      'crm-usage': 'basic-crm',
      'lead-response': 'hours',
      'time-spent': 'moderate',
      'budget': 'high'
    },
    selectedPlan: 'complete-system',
    contentGoals: ['newsletters', 'blogs', 'social'],
    integrations: ['gohighlevel', 'mailchimp'],
    timestamp: new Date().toISOString()
  };
  
  return makeRequest(data, 'Full assessment test');
}

// Test 3: Empty strings
async function testEmptyStrings() {
  console.log('\n=== TEST 3: Empty String Fields ===');
  const data = {
    firstName: '',
    lastName: '',
    email: 'test@example.com'
  };
  
  return makeRequest(data, 'Empty strings test');
}

// Test 4: Missing required fields
async function testMissingFields() {
  console.log('\n=== TEST 4: Missing Required Fields ===');
  const data = {
    email: 'test@example.com'
  };
  
  return makeRequest(data, 'Missing fields test');
}

// Test 5: Large payload
async function testLargePayload() {
  console.log('\n=== TEST 5: Large Payload ===');
  const data = {
    firstName: 'A'.repeat(100),
    lastName: 'B'.repeat(100),
    email: 'test@example.com',
    businessName: 'C'.repeat(500),
    biggestChallenge: 'D'.repeat(1000),
    answers: {}
  };
  
  // Add 100 answers
  for (let i = 0; i < 100; i++) {
    data.answers[`question-${i}`] = `Answer ${i} `.repeat(50);
  }
  
  return makeRequest(data, 'Large payload test');
}

// Test 6: Invalid data types
async function testInvalidTypes() {
  console.log('\n=== TEST 6: Invalid Data Types ===');
  const data = {
    firstName: 123,
    lastName: true,
    email: 'test@example.com',
    score: 'not-a-number',
    contentGoals: 'not-an-array',
    answers: 'not-an-object'
  };
  
  return makeRequest(data, 'Invalid types test');
}

// Test 7: Special characters
async function testSpecialCharacters() {
  console.log('\n=== TEST 7: Special Characters ===');
  const data = {
    firstName: "Test<script>alert('xss')</script>",
    lastName: "O'Brien & Sons",
    email: 'test+special@example.com',
    businessName: 'Test & Co. "The Best" <LLC>',
    answers: {
      'test-question': "Line 1\nLine 2\rLine 3\tTabbed"
    }
  };
  
  return makeRequest(data, 'Special characters test');
}

// Test 8: Actual form structure from the assessment
async function testActualFormStructure() {
  console.log('\n=== TEST 8: Actual Form Structure ===');
  const data = {
    firstName: "Griffin",
    lastName: "Test",
    email: "griffin.test@example.com",
    phone: "",
    businessName: "TrueFlow Test Company",
    businessType: "Content Creator",
    score: 65,
    recommendation: "Complete System",
    answers: {
      "current-content": "mixed",
      "content-volume": "high",
      "crm-usage": "advanced-crm",
      "lead-response": "instant",
      "time-spent": "moderate",
      "budget": "high"
    },
    selectedPlan: "Complete System",
    contentGoals: ["newsletters", "blogs"],
    integrations: ["gohighlevel"],
    timestamp: "2025-07-29T18:30:00.000Z"
  };
  
  return makeRequest(data, 'Actual form structure test');
}

// Helper function to make requests
function makeRequest(data, testName) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    console.log(`\nTest: ${testName}`);
    console.log('Request data:', JSON.stringify(data, null, 2));
    console.log('Request size:', Buffer.byteLength(postData), 'bytes');
    
    const url = new URL(API_URL);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'TrueFlow-API-Test/1.0'
      }
    };
    
    const startTime = Date.now();
    const req = https.request(options, (res) => {
      let responseData = '';
      
      console.log('Status:', res.statusCode);
      console.log('Headers:', res.headers);
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        const endTime = Date.now();
        console.log('Response time:', endTime - startTime, 'ms');
        
        try {
          const parsed = JSON.parse(responseData);
          console.log('Response:', JSON.stringify(parsed, null, 2));
          
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log('✅ SUCCESS');
          } else {
            console.log('❌ FAILED');
          }
        } catch (e) {
          console.log('Raw response:', responseData);
          console.log('❌ FAILED - Invalid JSON response');
        }
        
        resolve();
      });
    });
    
    req.on('error', (e) => {
      console.error('❌ Request error:', e.message);
      resolve();
    });
    
    // Set timeout
    req.setTimeout(30000, () => {
      console.error('❌ Request timeout after 30 seconds');
      req.destroy();
      resolve();
    });
    
    req.write(postData);
    req.end();
  });
}

// Run all tests
async function runAllTests() {
  console.log('Testing API endpoint:', API_URL);
  console.log('Starting tests at:', new Date().toISOString());
  console.log('='.repeat(80));
  
  await testMinimalFields();
  await testFullAssessment();
  await testEmptyStrings();
  await testMissingFields();
  await testLargePayload();
  await testInvalidTypes();
  await testSpecialCharacters();
  await testActualFormStructure();
  
  console.log('\n' + '='.repeat(80));
  console.log('All tests completed at:', new Date().toISOString());
}

// Check if API is reachable first
function checkAPIHealth() {
  return new Promise((resolve) => {
    const url = new URL(API_URL);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'OPTIONS',
      timeout: 10000
    };
    
    console.log('Checking API health...');
    const req = https.request(options, (res) => {
      console.log('API Health Check - Status:', res.statusCode);
      console.log('API Health Check - Headers:', res.headers);
      resolve(true);
    });
    
    req.on('error', (e) => {
      console.error('API Health Check - Error:', e.message);
      resolve(false);
    });
    
    req.end();
  });
}

// Main execution
(async () => {
  const isHealthy = await checkAPIHealth();
  if (isHealthy) {
    await runAllTests();
  } else {
    console.error('API endpoint appears to be unreachable. Please check the deployment.');
  }
})();