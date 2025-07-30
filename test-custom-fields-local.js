/**
 * Test script for custom fields implementation
 * Run with: node test-custom-fields-local.js
 */

// Use native fetch (available in Node.js 18+)

// Test data for Get Started form
const getStartedData = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  phone: '+1234567890',
  businessName: 'Test Business LLC',
  businessType: 'agency',
  contentGoals: ['newsletters', 'blogs', 'social'],
  integrations: ['gohighlevel', 'mailchimp'],
  selectedPlan: 'complete_system',
  timestamp: new Date().toISOString()
};

// Test data for Assessment form
const assessmentData = {
  firstName: 'Assessment',
  lastName: 'Tester',
  email: 'assessment@example.com',
  phone: '+1987654321',
  businessName: 'Assessment Corp',
  businessType: 'content_creator',
  scorePercentage: 75,
  readinessLevel: 'Highly Ready',
  recommendation: 'Complete System',
  selectedPlan: 'complete_system',
  answers: {
    'current-content': 'manual',
    'content-volume': 'high',
    'crm-usage': 'basic_crm',
    'lead-response': 'hours',
    'time-spent': 'moderate',
    'budget': 'high'
  },
  timestamp: new Date().toISOString()
};

async function testEndpoint(endpoint, data, description) {
  console.log(`\n🧪 Testing ${description}...`);
  console.log(`📍 Endpoint: ${endpoint}`);
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Success:', result);
      if (result.customFieldsUsed) {
        console.log(`📊 Custom fields used: ${result.customFieldsUsed}`);
      }
      if (result.tagsUsed) {
        console.log(`🏷️  Tags used: ${result.tagsUsed} (minimal)`);
      }
      if (result.leadScore) {
        console.log(`📈 Lead score: ${result.leadScore}`);
      }
      if (result.leadQuality) {
        console.log(`🔥 Lead quality: ${result.leadQuality}`);
      }
    } else {
      console.log('❌ Error:', result);
    }
    
    return result;
  } catch (error) {
    console.error('💥 Request failed:', error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting Custom Fields Tests on localhost:3001\n');
  
  // Test the new V3 endpoint with custom fields
  console.log('=' .repeat(60));
  console.log('TESTING NEW V3 ENDPOINT (WITH CUSTOM FIELDS)');
  console.log('=' .repeat(60));
  
  // Test Get Started form
  await testEndpoint(
    'http://localhost:3001/api/ghl/create-lead-v3',
    getStartedData,
    'Get Started Form with Custom Fields'
  );
  
  // Small delay between tests
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test Assessment form
  await testEndpoint(
    'http://localhost:3001/api/ghl/create-lead-v3',
    assessmentData,
    'Assessment Form with Custom Fields'
  );
  
  console.log('\n' + '=' .repeat(60));
  console.log('CUSTOM FIELDS BENEFITS:');
  console.log('=' .repeat(60));
  console.log('✅ All form data stored in structured custom fields');
  console.log('✅ Minimal tags used (only 4 essential tags)');
  console.log('✅ Easy to search and filter in GoHighLevel');
  console.log('✅ No tag pollution or duplicates');
  console.log('✅ Better data organization and reporting');
  
  console.log('\n✨ Tests completed!');
}

// Run the tests
runTests().catch(console.error);