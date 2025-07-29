#!/usr/bin/env node

/**
 * Enhanced test script for custom fields functionality
 * Tests the non-blocking implementation thoroughly
 */

const baseUrl = process.argv[2] || 'http://localhost:3001';
const testMode = process.argv[3] || 'full'; // full, quick, stress

console.log('🧪 Enhanced Custom Fields Test Suite');
console.log('Base URL:', baseUrl);
console.log('Test Mode:', testMode);
console.log('=====================================\n');

// Test scenarios
const testScenarios = [
  {
    name: 'High-Value Get Started Lead',
    data: {
      firstName: "HighValue",
      lastName: "Lead",
      email: `highvalue-${Date.now()}@test.com`,
      phone: "555-9999",
      businessName: "Enterprise Corp",
      businessType: "SaaS",
      contentGoals: ["Blog posts", "Whitepapers", "Case studies", "Email campaigns"],
      monthlyLeads: "100+",
      teamSize: "10+",
      currentTools: ["HubSpot", "Salesforce", "Marketo", "WordPress", "Canva"],
      biggestChallenge: "Scaling content production while maintaining quality and brand consistency",
      pricingPlan: "enterprise",
      timestamp: new Date().toISOString()
    },
    expectedScore: { min: 85, max: 100 },
    expectedStatus: 'hot'
  },
  {
    name: 'Medium-Value Assessment Lead',
    data: {
      firstName: "MediumValue",
      lastName: "Assessment",
      email: `medium-${Date.now()}@test.com`,
      phone: "555-5555",
      businessName: "Growing Business LLC",
      score: 65,
      recommendation: "Professional",
      answers: {
        "marketing_goals": "Increase brand awareness",
        "current_challenges": "Limited resources",
        "budget": "medium",
        "timeline": "3-6 months",
        "decision_maker": "no"
      },
      timestamp: new Date().toISOString()
    },
    expectedScore: { min: 60, max: 75 },
    expectedStatus: 'warm'
  },
  {
    name: 'Low-Value Get Started Lead',
    data: {
      firstName: "LowValue",
      lastName: "Startup",
      email: `lowvalue-${Date.now()}@test.com`,
      businessName: "Solo Entrepreneur",
      businessType: "Other",
      contentGoals: ["Blog posts"],
      monthlyLeads: "0-10",
      teamSize: "1",
      currentTools: [],
      biggestChallenge: "Just getting started",
      pricingPlan: "starter",
      timestamp: new Date().toISOString()
    },
    expectedScore: { min: 30, max: 60 },
    expectedStatus: 'cold'
  },
  {
    name: 'Edge Case - Missing Optional Fields',
    data: {
      firstName: "EdgeCase",
      lastName: "Minimal",
      email: `edge-${Date.now()}@test.com`,
      // Minimal data to test robustness
      timestamp: new Date().toISOString()
    },
    expectedScore: { min: 0, max: 100 },
    expectedStatus: 'cold'
  }
];

// Test functions
async function testEndpoint(scenario) {
  console.log(`\n📍 Testing: ${scenario.name}`);
  console.log('Data:', JSON.stringify(scenario.data, null, 2).substring(0, 200) + '...');
  
  const startTime = Date.now();
  
  try {
    const response = await fetch(`${baseUrl}/api/ghl/create-lead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scenario.data)
    });

    const responseTime = Date.now() - startTime;
    const result = await response.json();
    
    console.log(`⏱️  Response time: ${responseTime}ms`);
    
    if (!response.ok) {
      console.log('❌ HTTP Error:', response.status);
      console.log('Response:', result);
      return { success: false, error: 'HTTP error', responseTime };
    }
    
    if (!result.success) {
      console.log('❌ API Error:', result);
      return { success: false, error: result.message, responseTime };
    }
    
    console.log('✅ Success:', result);
    
    // Validate lead scoring
    if (result.leadScore !== undefined) {
      const scoreInRange = result.leadScore >= scenario.expectedScore.min && 
                          result.leadScore <= scenario.expectedScore.max;
      console.log(`📊 Lead Score: ${result.leadScore} (expected ${scenario.expectedScore.min}-${scenario.expectedScore.max}) ${scoreInRange ? '✅' : '❌'}`);
      
      if (result.qualificationStatus) {
        const statusMatch = result.qualificationStatus === scenario.expectedStatus;
        console.log(`🎯 Qualification: ${result.qualificationStatus} (expected ${scenario.expectedStatus}) ${statusMatch ? '✅' : '❌'}`);
      }
    }
    
    return { 
      success: true, 
      responseTime,
      ghlContactId: result.ghlContactId,
      leadScore: result.leadScore,
      qualificationStatus: result.qualificationStatus
    };
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.log('❌ Request failed:', error.message);
    return { success: false, error: error.message, responseTime };
  }
}

async function stressTest() {
  console.log('\n🔥 STRESS TEST - Concurrent Submissions');
  console.log('Testing API resilience with 10 concurrent requests...\n');
  
  const promises = [];
  for (let i = 0; i < 10; i++) {
    const data = {
      firstName: `Stress`,
      lastName: `Test${i}`,
      email: `stress-${Date.now()}-${i}@test.com`,
      businessName: `Stress Test Company ${i}`,
      businessType: 'E-commerce',
      contentGoals: ['Testing', 'Performance'],
      monthlyLeads: '50-100',
      teamSize: '5-10',
      currentTools: ['Tool1', 'Tool2'],
      biggestChallenge: 'Testing system limits',
      pricingPlan: 'professional',
      timestamp: new Date().toISOString()
    };
    
    promises.push(
      fetch(`${baseUrl}/api/ghl/create-lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(r => r.json()).catch(e => ({ error: e.message }))
    );
  }
  
  const startTime = Date.now();
  const results = await Promise.allSettled(promises);
  const totalTime = Date.now() - startTime;
  
  let successes = 0;
  let failures = 0;
  
  results.forEach((result, i) => {
    if (result.status === 'fulfilled' && result.value.success) {
      successes++;
    } else {
      failures++;
      console.log(`Request ${i} failed:`, result);
    }
  });
  
  console.log(`\n📊 Stress Test Results:`);
  console.log(`✅ Successful: ${successes}/10`);
  console.log(`❌ Failed: ${failures}/10`);
  console.log(`⏱️  Total time: ${totalTime}ms`);
  console.log(`⚡ Avg time per request: ${Math.round(totalTime / 10)}ms`);
}

async function runTests() {
  const results = {
    total: 0,
    successful: 0,
    failed: 0,
    totalResponseTime: 0,
    errors: []
  };
  
  // Run scenario tests
  if (testMode === 'full' || testMode === 'quick') {
    const scenarios = testMode === 'quick' ? testScenarios.slice(0, 2) : testScenarios;
    
    for (const scenario of scenarios) {
      const result = await testEndpoint(scenario);
      results.total++;
      results.totalResponseTime += result.responseTime;
      
      if (result.success) {
        results.successful++;
      } else {
        results.failed++;
        results.errors.push({ scenario: scenario.name, error: result.error });
      }
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Run stress test
  if (testMode === 'full' || testMode === 'stress') {
    await stressTest();
  }
  
  // Summary
  console.log('\n\n📊 TEST SUMMARY');
  console.log('================');
  console.log(`Total Tests: ${results.total}`);
  console.log(`✅ Successful: ${results.successful}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⏱️  Avg Response Time: ${Math.round(results.totalResponseTime / results.total)}ms`);
  
  if (results.errors.length > 0) {
    console.log('\n⚠️  Errors:');
    results.errors.forEach(err => {
      console.log(`  - ${err.scenario}: ${err.error}`);
    });
  }
  
  console.log('\n\n🔍 What to Check in GoHighLevel:');
  console.log('1. Navigate to Contacts');
  console.log('2. Look for test contacts created in the last few minutes');
  console.log('3. Click on a contact and check the Custom Fields section');
  console.log('4. Verify these custom fields exist:');
  console.log('   - TrueFlow Form Type');
  console.log('   - TrueFlow Lead Quality Score');
  console.log('   - TrueFlow Qualification Status');
  console.log('   - All form-specific fields (business type, goals, etc.)');
  console.log('5. Check that no duplicate custom fields were created');
  console.log('6. Verify lead scores match expected ranges');
  
  console.log('\n✅ Test suite complete!');
}

// Run the tests
runTests().catch(console.error);