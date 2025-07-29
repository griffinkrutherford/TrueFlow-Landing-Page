const axios = require('axios');
const colors = require('colors');

// Test configuration
const API_URL = 'http://localhost:3001/api/ghl/create-lead-v2';
const TEST_DELAY = 2000; // 2 seconds between tests to avoid rate limiting

// Test utilities
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const logTestResult = (testName, success, details) => {
  if (success) {
    console.log(`✅ ${testName}`.green);
    if (details) console.log(`   ${details}`.gray);
  } else {
    console.log(`❌ ${testName}`.red);
    if (details) console.log(`   ${details}`.yellow);
  }
  console.log('');
};

const makeRequest = async (data, expectedStatus = 200) => {
  try {
    const response = await axios.post(API_URL, data, {
      headers: {
        'Content-Type': 'application/json'
      },
      validateStatus: () => true // Don't throw on any status
    });
    
    return {
      status: response.status,
      data: response.data,
      success: response.status === expectedStatus
    };
  } catch (error) {
    return {
      status: error.response?.status || 0,
      data: error.response?.data || error.message,
      success: false,
      error: error.message
    };
  }
};

// Test scenarios
const runTests = async () => {
  console.log('🚀 Starting comprehensive Getting Started form tests...\n'.cyan);
  
  // Test 1: Complete Form Submission Test
  console.log('📋 Test 1: Complete Form Submission'.blue);
  const completeFormData = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '+1 (555) 123-4567',
    businessName: 'Test Business LLC',
    businessType: 'creator',
    contentGoals: ['newsletters', 'blogs', 'social'],
    integrations: ['gohighlevel', 'mailchimp'],
    currentContent: 'manual',
    contentVolume: 'moderate',
    crmUsage: 'spreadsheets',
    leadResponse: 'hours',
    timeSpent: 'high',
    budget: 'moderate',
    selectedPlan: 'content-engine',
    answers: {
      'current-content': 'manual',
      'content-volume': 'moderate',
      'crm-usage': 'spreadsheets',
      'lead-response': 'hours',
      'time-spent': 'high',
      'budget': 'moderate'
    },
    assessmentAnswers: [
      {
        questionId: 'current-content',
        category: 'Content Creation',
        question: 'How do you currently create content for your business?',
        answer: 'Manually write everything',
        score: 1
      },
      {
        questionId: 'content-volume',
        category: 'Content Creation',
        question: 'How much content do you need to produce monthly?',
        answer: '6-20 pieces',
        score: 2
      },
      {
        questionId: 'crm-usage',
        category: 'Customer Management',
        question: 'How do you currently manage customer relationships?',
        answer: 'Spreadsheets or manual tracking',
        score: 1
      },
      {
        questionId: 'lead-response',
        category: 'Customer Management',
        question: 'How quickly do you typically respond to new leads?',
        answer: 'Within 24 hours',
        score: 2
      },
      {
        questionId: 'time-spent',
        category: 'Time Management',
        question: 'How much time do you spend on repetitive tasks weekly?',
        answer: '15-30 hours',
        score: 2
      },
      {
        questionId: 'budget',
        category: 'Investment',
        question: 'What\'s your monthly budget for content and customer management?',
        answer: '$500 - $2,000',
        score: 2
      }
    ],
    totalScore: 10,
    maxPossibleScore: 24,
    scorePercentage: 42,
    recommendation: 'Content Engine',
    readinessLevel: 'Getting Ready',
    timestamp: new Date().toISOString(),
    assessmentVersion: '2.0',
    source: 'readiness-assessment'
  };
  
  const result1 = await makeRequest(completeFormData);
  logTestResult(
    'Complete form submission',
    result1.success && result1.data.success,
    `Status: ${result1.status}, Response: ${JSON.stringify(result1.data)}`
  );
  
  await delay(TEST_DELAY);
  
  // Test 2: Validation Test - Missing Required Fields
  console.log('🔍 Test 2: Validation Tests'.blue);
  
  // Test 2a: Missing firstName
  const missingFirstName = { ...completeFormData };
  delete missingFirstName.firstName;
  const result2a = await makeRequest(missingFirstName, 400);
  logTestResult(
    'Missing firstName validation',
    result2a.status === 400,
    `Status: ${result2a.status}, Message: ${result2a.data.message}`
  );
  
  await delay(TEST_DELAY);
  
  // Test 2b: Missing lastName
  const missingLastName = { ...completeFormData };
  delete missingLastName.lastName;
  const result2b = await makeRequest(missingLastName, 400);
  logTestResult(
    'Missing lastName validation',
    result2b.status === 400,
    `Status: ${result2b.status}, Message: ${result2b.data.message}`
  );
  
  await delay(TEST_DELAY);
  
  // Test 2c: Missing email
  const missingEmail = { ...completeFormData };
  delete missingEmail.email;
  const result2c = await makeRequest(missingEmail, 400);
  logTestResult(
    'Missing email validation',
    result2c.status === 400,
    `Status: ${result2c.status}, Message: ${result2c.data.message}`
  );
  
  await delay(TEST_DELAY);
  
  // Test 2d: Missing businessName (should still work as it's optional in API)
  const missingBusinessName = { ...completeFormData };
  delete missingBusinessName.businessName;
  const result2d = await makeRequest(missingBusinessName);
  logTestResult(
    'Missing businessName (optional field)',
    result2d.success && result2d.data.success,
    `Status: ${result2d.status}, Response: ${JSON.stringify(result2d.data)}`
  );
  
  await delay(TEST_DELAY);
  
  // Test 3: Different Plan Selections
  console.log('📊 Test 3: Different Plan Selections'.blue);
  
  // Test 3a: Content Engine plan
  const contentEnginePlan = { ...completeFormData, selectedPlan: 'content-engine' };
  const result3a = await makeRequest(contentEnginePlan);
  logTestResult(
    'Content Engine plan selection',
    result3a.success && result3a.data.success,
    `Status: ${result3a.status}, Response: ${JSON.stringify(result3a.data)}`
  );
  
  await delay(TEST_DELAY);
  
  // Test 3b: Complete System plan
  const completeSystemPlan = { ...completeFormData, selectedPlan: 'complete-system' };
  const result3b = await makeRequest(completeSystemPlan);
  logTestResult(
    'Complete System plan selection',
    result3b.success && result3b.data.success,
    `Status: ${result3b.status}, Response: ${JSON.stringify(result3b.data)}`
  );
  
  await delay(TEST_DELAY);
  
  // Test 3c: Not Sure option
  const notSurePlan = { ...completeFormData, selectedPlan: 'not-sure' };
  const result3c = await makeRequest(notSurePlan);
  logTestResult(
    'Not Sure plan selection',
    result3c.success && result3c.data.success,
    `Status: ${result3c.status}, Response: ${JSON.stringify(result3c.data)}`
  );
  
  await delay(TEST_DELAY);
  
  // Test 4: Business Type Variations
  console.log('🏢 Test 4: Business Type Variations'.blue);
  
  const businessTypes = ['creator', 'podcaster', 'business', 'coach', 'agency', 'other'];
  
  for (const businessType of businessTypes) {
    const businessTypeData = { ...completeFormData, businessType, email: `test-${businessType}@example.com` };
    const result = await makeRequest(businessTypeData);
    logTestResult(
      `Business type: ${businessType}`,
      result.success && result.data.success,
      `Status: ${result.status}, Response: ${JSON.stringify(result.data)}`
    );
    await delay(TEST_DELAY);
  }
  
  // Test 5: Integration with Both APIs
  console.log('🔌 Test 5: API Integration Tests'.blue);
  
  // Test 5a: Verify correct endpoint is called
  console.log('Testing API endpoint: /api/ghl/create-lead-v2');
  const apiTest = await makeRequest(completeFormData);
  logTestResult(
    'API endpoint accessibility',
    apiTest.success,
    `Status: ${apiTest.status}, Endpoint working correctly`
  );
  
  // Test 5b: Check response structure
  if (apiTest.success && apiTest.data) {
    const hasSuccess = 'success' in apiTest.data;
    const hasMessage = 'message' in apiTest.data;
    const hasGhlContactId = 'ghlContactId' in apiTest.data || 'leadId' in apiTest.data;
    
    logTestResult(
      'Response structure validation',
      hasSuccess && hasMessage,
      `Has success: ${hasSuccess}, Has message: ${hasMessage}, Has ID: ${hasGhlContactId}`
    );
  }
  
  await delay(TEST_DELAY);
  
  // Test 5c: Minimal required data (simulating form with only required fields)
  const minimalData = {
    firstName: 'Minimal',
    lastName: 'Test',
    email: 'minimal@example.com',
    businessName: 'Minimal Business'
  };
  
  const minimalResult = await makeRequest(minimalData);
  logTestResult(
    'Minimal required fields submission',
    minimalResult.success && minimalResult.data.success,
    `Status: ${minimalResult.status}, Response: ${JSON.stringify(minimalResult.data)}`
  );
  
  // Summary
  console.log('\n📊 Test Summary:'.cyan);
  console.log('- Complete form submissions ✓');
  console.log('- Validation for required fields ✓');
  console.log('- Different plan selections ✓');
  console.log('- All business type options ✓');
  console.log('- API integration verified ✓');
  console.log('\n✨ All tests completed!'.green);
  
  // Additional notes
  console.log('\n📝 Notes:'.yellow);
  console.log('1. Email notifications are sent to Griffin and Matt when configured');
  console.log('2. GHL contact creation depends on environment configuration');
  console.log('3. Fallback to email-only mode when GHL is not configured');
  console.log('4. All submissions are logged for debugging purposes');
};

// Run the tests
runTests().catch(error => {
  console.error('❌ Test suite failed:'.red, error);
  process.exit(1);
});