#\!/usr/bin/env node

/**
 * Test script for GoHighLevel integration
 * This script tests the create-lead endpoint with real GHL credentials
 */

const baseUrl = process.argv[2] || 'http://localhost:3001';

console.log('🧪 Testing GoHighLevel Integration');
console.log('Base URL:', baseUrl);
console.log('-----------------------------------\n');

async function testEndpoint(name, endpoint, data) {
  console.log(`\n📍 Testing ${name}...`);
  
  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Success:', result);
      
      if (result.ghlContactId && result.ghlContactId.startsWith('demo-')) {
        console.log('⚠️  WARNING: GHL returned demo ID - check if credentials are configured');
      } else if (result.ghlContactId) {
        console.log('🎉 Real GHL Contact Created\! ID:', result.ghlContactId);
      }
    } else {
      console.log('❌ Error:', response.status, result);
    }
    
    return result;
  } catch (error) {
    console.log('❌ Request failed:', error.message);
    return null;
  }
}

async function runTests() {
  // Test 1: Assessment Form Submission
  const assessmentData = {
    firstName: "GHL",
    lastName: "Test Assessment",
    email: `ghl-test-assessment-${Date.now()}@example.com`,
    phone: "555-0001",
    businessName: "Test Business Assessment",
    score: 85,
    recommendation: "Professional",
    answers: {
      "marketing_goals": "Increase brand awareness",
      "current_challenges": "Lead generation",
      "budget": "high",
      "timeline": "immediate",
      "decision-maker": "yes"
    },
    timestamp: new Date().toISOString()
  };

  const assessmentResult = await testEndpoint(
    'Assessment Form', 
    '/api/ghl/create-lead',
    assessmentData
  );

  // Test 2: Get Started Form Submission
  const getStartedData = {
    firstName: "GHL",
    lastName: "Test GetStarted",
    email: `ghl-test-getstarted-${Date.now()}@example.com`,
    phone: "555-0002",
    businessName: "Test Business GetStarted",
    businessType: "E-commerce",
    contentGoals: ["Blog posts", "Social media", "Email campaigns"],
    monthlyLeads: "100+",
    teamSize: "10+",
    currentTools: ["WordPress", "Mailchimp", "Hootsuite"],
    biggestChallenge: "Maintaining consistent content across channels",
    pricingPlan: "growth",
    timestamp: new Date().toISOString()
  };

  const getStartedResult = await testEndpoint(
    'Get Started Form',
    '/api/ghl/create-lead',
    getStartedData
  );

  // Summary
  console.log('\n\n📊 TEST SUMMARY');
  console.log('================');
  
  if (assessmentResult?.ghlContactId && \!assessmentResult.ghlContactId.startsWith('demo-')) {
    console.log('✅ Assessment form is creating real GHL contacts');
    console.log(`   Contact ID: ${assessmentResult.ghlContactId}`);
  } else {
    console.log('⚠️  Assessment form is NOT creating real GHL contacts');
    console.log('   Check your GHL credentials in environment variables');
  }
  
  if (getStartedResult?.ghlContactId && \!getStartedResult.ghlContactId.startsWith('demo-')) {
    console.log('✅ Get Started form is creating real GHL contacts');
    console.log(`   Contact ID: ${getStartedResult.ghlContactId}`);
  } else {
    console.log('⚠️  Get Started form is NOT creating real GHL contacts');
    console.log('   Check your GHL credentials in environment variables');
  }

  console.log('\n\n🔍 Next Steps:');
  console.log('1. Check your GoHighLevel account for the new contacts');
  console.log('2. Verify they appear in the correct pipeline stages');
  console.log('3. Check if opportunities were created (if enabled)');
  console.log('4. Verify custom fields are populated correctly');
  console.log('5. Check that tags were applied');
}

// Run the tests
runTests().catch(console.error);
EOF < /dev/null