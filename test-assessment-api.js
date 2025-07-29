#!/usr/bin/env node

// Test the assessment API with minimal data
async function testAssessmentAPI() {
  console.log('Testing assessment API...\n');
  
  const testData = {
    // Basic contact info
    firstName: "Test",
    lastName: "Assessment",
    email: `test-${Date.now()}@example.com`,
    phone: "555-1234",
    businessName: "Test Company",
    
    // Assessment data
    score: 75,
    recommendation: "Professional",
    
    // Minimal answers
    answers: {
      "marketing_goals": "Increase brand awareness",
      "current_challenges": "Limited resources",
      "budget": "medium",
      "timeline": "3-6 months",
      "decision_maker": "yes"
    },
    
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
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
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

testAssessmentAPI();