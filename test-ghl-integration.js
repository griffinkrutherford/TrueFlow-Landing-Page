// Test script for GHL integration
// Run with: node test-ghl-integration.js

const testData = {
  firstName: "Test",
  lastName: "User",
  email: "test@example.com",
  phone: "+1234567890",
  businessName: "Test Business",
  answers: {
    "current-content": "manual",
    "content-volume": "moderate",
    "crm-usage": "spreadsheets",
    "lead-response": "hours",
    "time-spent": "high",
    "budget": "moderate"
  },
  score: 65,
  recommendation: "Complete System",
  timestamp: new Date().toISOString()
};

async function testGHLIntegration() {
  console.log('Testing GHL Integration...\n');
  console.log('Test Data:', JSON.stringify(testData, null, 2));
  console.log('\nSending request to http://localhost:3001/api/ghl/create-lead...\n');

  try {
    const response = await fetch('http://localhost:3001/api/ghl/create-lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    console.log('Response Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('\n✅ Test passed! Lead created successfully.');
      if (result.ghlContactId) {
        console.log(`GHL Contact ID: ${result.ghlContactId}`);
      }
    } else {
      console.log('\n❌ Test failed:', result.message);
      if (result.error) {
        console.log('Error details:', result.error);
      }
    }
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
  }
}

// Run the test
testGHLIntegration();