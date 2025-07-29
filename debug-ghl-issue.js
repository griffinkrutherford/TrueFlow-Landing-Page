// Debug script to test GHL integration
// Run with: node debug-ghl-issue.js

const API_BASE = 'http://localhost:3001';

async function testGHLEndpoint() {
  console.log('\n=== Testing GHL Integration ===\n');
  
  // Test data matching what a real form would send
  const testData = {
    firstName: "Debug",
    lastName: "Test",
    email: `debug-test-${Date.now()}@example.com`,
    phone: "+1234567890",
    businessName: "Debug Test Business",
    businessType: "Marketing Agency",
    contentGoals: ["newsletters", "blog"],
    monthlyLeads: "50-100",
    teamSize: "5-10",
    currentTools: ["mailchimp", "wordpress"],
    biggestChallenge: "Testing GHL integration",
    pricingPlan: "Professional",
    timestamp: new Date().toISOString()
  };

  console.log('Sending test data to:', `${API_BASE}/api/ghl/create-lead`);
  console.log('Test data:', JSON.stringify(testData, null, 2));

  try {
    const response = await fetch(`${API_BASE}/api/ghl/create-lead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const responseText = await response.text();
    console.log('\nResponse status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    try {
      const result = JSON.parse(responseText);
      console.log('Response body:', JSON.stringify(result, null, 2));
      
      if (result.success) {
        console.log('\n✅ Test passed! Lead processed successfully.');
        if (result.ghlContactId) {
          console.log('GHL Contact ID:', result.ghlContactId);
        }
      } else {
        console.log('\n❌ Test failed! Error:', result.message);
      }
    } catch (e) {
      console.log('Response body (raw):', responseText);
    }

  } catch (error) {
    console.error('\n❌ Request failed:', error.message);
    console.error('Full error:', error);
  }
}

// Check environment
console.log('Checking environment variables...');
console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');

// Run the test
testGHLEndpoint().then(() => {
  console.log('\n=== Test Complete ===');
}).catch(error => {
  console.error('Test error:', error);
});