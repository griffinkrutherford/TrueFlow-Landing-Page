// Quick test script to verify current GHL integration
// Run with: node test-ghl-current.js

const API_BASE = 'http://localhost:3001';

// Simple test cases to verify current functionality
const quickTests = [
  {
    name: "Assessment Form Test",
    endpoint: "/api/ghl/create-lead",
    data: {
      firstName: "Test",
      lastName: "Assessment",
      email: `test-assessment-${Date.now()}@example.com`,
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
      recommendation: "Professional",
      timestamp: new Date().toISOString()
    }
  },
  {
    name: "Get Started Form Test",
    endpoint: "/api/ghl/create-lead",
    data: {
      firstName: "Test",
      lastName: "GetStarted",
      email: `test-getstarted-${Date.now()}@example.com`,
      phone: "+1987654321",
      businessName: "Test Agency",
      businessType: "Marketing Agency",
      contentGoals: ["newsletters", "blog"],
      monthlyLeads: "50-100",
      teamSize: "5-10",
      currentTools: ["mailchimp", "wordpress"],
      biggestChallenge: "Scaling content creation",
      pricingPlan: "Professional",
      timestamp: new Date().toISOString()
    }
  }
];

async function runQuickTests() {
  console.log('🧪 Testing Current GHL Integration\n');
  console.log(`API Base: ${API_BASE}\n`);
  console.log('─'.repeat(50) + '\n');

  for (const test of quickTests) {
    console.log(`📋 Test: ${test.name}`);
    console.log(`Endpoint: ${test.endpoint}`);
    console.log(`Email: ${test.data.email}\n`);

    try {
      const startTime = Date.now();
      const response = await fetch(`${API_BASE}${test.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(test.data)
      });

      const result = await response.json();
      const duration = Date.now() - startTime;

      console.log(`Status: ${response.status} ${response.ok ? '✅' : '❌'}`);
      console.log(`Duration: ${duration}ms`);
      
      if (result.success) {
        console.log(`✅ Success: ${result.message}`);
        if (result.ghlContactId) {
          console.log(`📧 GHL Contact ID: ${result.ghlContactId}`);
        }
        if (result.leadQualityScore !== undefined) {
          console.log(`📊 Lead Quality Score: ${result.leadQualityScore}`);
        }
        if (result.ghlStatus) {
          console.log(`ℹ️  GHL Status: ${result.ghlStatus}`);
        }
      } else {
        console.log(`❌ Failed: ${result.message}`);
        if (result.error && process.env.DEBUG) {
          console.log('Error details:', result.error);
        }
      }

      if (process.env.VERBOSE) {
        console.log('\nFull Response:');
        console.log(JSON.stringify(result, null, 2));
      }

    } catch (error) {
      console.log(`❌ Request failed: ${error.message}`);
    }

    console.log('\n' + '─'.repeat(50) + '\n');
  }

  console.log('✨ All tests completed!\n');
  console.log('💡 Tips:');
  console.log('- Run with DEBUG=true for error details');
  console.log('- Run with VERBOSE=true for full responses');
  console.log('- Check Railway logs for server-side details');
}

// Run the tests
runQuickTests().catch(console.error);