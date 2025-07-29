#!/usr/bin/env node

// Test the get-started API
async function testGetStartedAPI() {
  console.log('Testing get-started API...\n');
  
  const testData = {
    // Basic contact info
    firstName: "Test",
    lastName: "GetStarted",
    email: `test-gs-${Date.now()}@example.com`,
    phone: "555-9999",
    businessName: "Test Company",
    businessType: "SaaS",
    
    // Get Started specific fields
    contentGoals: ["Blog posts", "Email campaigns"],
    monthlyLeads: "50-100",
    teamSize: "5-10",
    currentTools: ["HubSpot", "WordPress"],
    biggestChallenge: "Scaling content production",
    pricingPlan: "professional",
    
    // Metadata
    timestamp: new Date().toISOString()
  };
  
  console.log('Sending data:', JSON.stringify(testData, null, 2));
  
  try {
    const response = await fetch('https://trueflow-landing-page-production.up.railway.app/api/ghl/create-lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    const responseText = await response.text();
    console.log('\nResponse status:', response.status);
    console.log('Response body:', responseText);
    
    if (response.ok) {
      const result = JSON.parse(responseText);
      console.log('\n✅ SUCCESS! Contact ID:', result.ghlContactId);
    } else {
      console.log('\n❌ FAILED! Error:', responseText);
    }
  } catch (error) {
    console.error('\n❌ Request failed:', error.message);
  }
}

testGetStartedAPI();