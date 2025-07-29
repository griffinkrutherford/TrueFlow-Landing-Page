// Test script for GHL integration edge cases
// Run with: node test-ghl-edge-cases.js

const testCases = [
  {
    name: "Valid Get Started Form",
    data: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "1234567890",
      businessName: "Test Business",
      businessType: "Marketing Agency",
      contentGoals: ["newsletters", "blog"],
      monthlyLeads: "10-50",
      teamSize: "1-5",
      currentTools: ["mailchimp", "wordpress"],
      biggestChallenge: "Content creation",
      pricingPlan: "professional",
      timestamp: new Date().toISOString()
    }
  },
  {
    name: "Edge Case - Undefined Arrays",
    data: {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      businessType: "E-commerce",
      contentGoals: undefined,
      currentTools: undefined,
      pricingPlan: "starter",
      timestamp: new Date().toISOString()
    }
  },
  {
    name: "Edge Case - Null Arrays",
    data: {
      firstName: "Bob",
      lastName: "Wilson",
      email: "bob@example.com",
      businessType: "SaaS",
      contentGoals: null,
      currentTools: null,
      pricingPlan: "growth",
      timestamp: new Date().toISOString()
    }
  },
  {
    name: "Edge Case - String Instead of Array",
    data: {
      firstName: "Alice",
      lastName: "Brown",
      email: "alice@example.com",
      businessType: "Consulting",
      contentGoals: "newsletters,blog",
      currentTools: "hubspot",
      pricingPlan: "professional",
      timestamp: new Date().toISOString()
    }
  },
  {
    name: "Edge Case - Empty Arrays",
    data: {
      firstName: "Charlie",
      lastName: "Davis",
      email: "charlie@example.com",
      businessType: "Agency",
      contentGoals: [],
      currentTools: [],
      monthlyLeads: "50-100",
      teamSize: "10+",
      pricingPlan: "enterprise",
      timestamp: new Date().toISOString()
    }
  }
];

async function runTests() {
  console.log('Testing GHL Integration Edge Cases...\n');
  console.log('=====================================\n');

  for (const testCase of testCases) {
    console.log(`\nTest: ${testCase.name}`);
    console.log('Data:', JSON.stringify(testCase.data, null, 2));
    
    try {
      const response = await fetch('http://localhost:3001/api/ghl/create-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testCase.data)
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ PASSED - Status:', response.status);
        console.log('Response:', JSON.stringify(result, null, 2));
      } else {
        console.log('❌ FAILED - Status:', response.status);
        console.log('Error:', JSON.stringify(result, null, 2));
      }
    } catch (error) {
      console.error('❌ FAILED with exception:', error.message);
    }
    
    console.log('\n-----------------------------------');
  }
  
  console.log('\n\nAll tests completed!');
}

// Run the tests
runTests();