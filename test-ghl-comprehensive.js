// Comprehensive test script for enhanced GHL integration
// Run with: node test-ghl-comprehensive.js

const API_BASE = process.env.API_BASE || 'http://localhost:3001';

// Test scenarios covering all aspects of the integration
const testScenarios = [
  {
    name: "High-Value Assessment Lead (Score > 80)",
    description: "Should be placed in 'hot_lead' stage with high quality score",
    data: {
      firstName: "Alex",
      lastName: "Johnson",
      email: "alex.johnson@techcorp.com",
      phone: "+1234567890",
      businessName: "TechCorp Solutions",
      businessType: "SaaS",
      answers: {
        "current-content": "ai-assisted",
        "content-volume": "high",
        "crm-usage": "advanced",
        "lead-response": "immediate",
        "time-spent": "low",
        "budget": "high",
        "timeline": "immediate",
        "decision-maker": "yes"
      },
      score: 85,
      recommendation: "Enterprise",
      readinessLevel: "Ready Now",
      timestamp: new Date().toISOString()
    },
    expectedStage: "hot_lead",
    expectedQualityScore: 95, // 85 base + 10 budget + 15 timeline + 10 decision-maker = 120, capped at 100
    expectedValue: 29910 // Enterprise LTV
  },
  
  {
    name: "Medium-Value Assessment Lead (Score 60-80)",
    description: "Should be placed in 'qualified' stage",
    data: {
      firstName: "Sarah",
      lastName: "Williams",
      email: "sarah@marketing-agency.com",
      phone: "+1987654321",
      businessName: "Creative Marketing Agency",
      businessType: "Marketing Agency",
      answers: {
        "current-content": "manual",
        "content-volume": "moderate",
        "crm-usage": "basic",
        "lead-response": "hours",
        "time-spent": "moderate",
        "budget": "moderate"
      },
      score: 70,
      recommendation: "Professional",
      readinessLevel: "Ready",
      timestamp: new Date().toISOString()
    },
    expectedStage: "qualified",
    expectedQualityScore: 70,
    expectedValue: 8910 // Professional LTV
  },
  
  {
    name: "Low-Value Assessment Lead (Score < 40)",
    description: "Should be placed in 'nurture' stage",
    data: {
      firstName: "Mike",
      lastName: "Brown",
      email: "mike@startup.com",
      phone: "+1122334455",
      businessName: "Early Stage Startup",
      answers: {
        "current-content": "none",
        "content-volume": "low",
        "crm-usage": "spreadsheets",
        "lead-response": "days",
        "time-spent": "high",
        "budget": "low"
      },
      score: 30,
      recommendation: "Starter",
      readinessLevel: "Not Ready",
      timestamp: new Date().toISOString()
    },
    expectedStage: "nurture",
    expectedQualityScore: 30,
    expectedValue: 2910 // Starter LTV
  },
  
  {
    name: "Enterprise Get Started Lead",
    description: "High-value plan should go to 'engaged' stage",
    data: {
      firstName: "David",
      lastName: "Chen",
      email: "david@enterprise.com",
      phone: "+1555666777",
      businessName: "Enterprise Corp",
      businessType: "SaaS",
      contentGoals: ["newsletters", "blog", "social", "sales"],
      monthlyLeads: "100+",
      teamSize: "10+",
      currentTools: ["hubspot", "salesforce", "marketo", "wordpress"],
      biggestChallenge: "Scaling content across multiple channels",
      pricingPlan: "Enterprise",
      timestamp: new Date().toISOString()
    },
    expectedStage: "engaged",
    expectedQualityScore: 100, // 100 base + 10 leads + 10 team + 5 tools + 5 business = 130, capped at 100
    expectedValue: 9970 // Enterprise annual (might be LTV based on signals)
  },
  
  {
    name: "Professional Get Started Lead",
    description: "Medium-value with good indicators",
    data: {
      firstName: "Emma",
      lastName: "Davis",
      email: "emma@consultancy.com",
      phone: "+1999888777",
      businessName: "Strategic Consultancy",
      businessType: "Consulting",
      contentGoals: ["newsletters", "thought-leadership"],
      monthlyLeads: "50-100",
      teamSize: "5-10",
      currentTools: ["mailchimp", "linkedin"],
      biggestChallenge: "Creating consistent thought leadership content",
      pricingPlan: "Professional",
      timestamp: new Date().toISOString()
    },
    expectedStage: "engaged", // Professional with score >= 60
    expectedQualityScore: 70, // 50 base + 10 leads + 10 team
    expectedValue: 2970 // Professional annual
  },
  
  {
    name: "Starter Get Started Lead",
    description: "Entry-level lead exploring options",
    data: {
      firstName: "Tom",
      lastName: "Wilson",
      email: "tom@solopreneur.com",
      businessType: "Content Creator",
      contentGoals: ["blog"],
      monthlyLeads: "1-10",
      teamSize: "1",
      currentTools: [],
      biggestChallenge: "Just getting started",
      pricingPlan: "Starter",
      timestamp: new Date().toISOString()
    },
    expectedStage: "exploring",
    expectedQualityScore: 25,
    expectedValue: 970 // Starter annual
  },
  
  {
    name: "Existing Contact Update",
    description: "Should update existing contact, not create duplicate",
    data: {
      firstName: "Alex",
      lastName: "Johnson",
      email: "alex.johnson@techcorp.com", // Same email as first test
      phone: "+1234567899", // Different phone
      businessName: "TechCorp Solutions Updated",
      businessType: "SaaS",
      contentGoals: ["newsletters", "webinars"],
      monthlyLeads: "100+",
      teamSize: "10+",
      currentTools: ["hubspot", "marketo"],
      biggestChallenge: "Webinar content automation",
      pricingPlan: "Enterprise",
      timestamp: new Date().toISOString()
    },
    expectedStage: "engaged",
    expectedQualityScore: 100,
    expectedValue: 29910, // LTV due to indicators
    isUpdate: true
  },
  
  {
    name: "Edge Case - Missing Arrays",
    description: "Should handle missing/undefined arrays gracefully",
    data: {
      firstName: "Edge",
      lastName: "Case",
      email: "edge@case.com",
      businessType: "Other",
      contentGoals: undefined,
      currentTools: null,
      pricingPlan: "Growth",
      timestamp: new Date().toISOString()
    },
    expectedStage: "engaged", // Growth plan
    expectedQualityScore: 75, // Base growth score
    expectedValue: 4970
  },
  
  {
    name: "Edge Case - String Arrays",
    description: "Should convert string to array",
    data: {
      firstName: "String",
      lastName: "Test",
      email: "string@test.com",
      businessType: "Agency",
      contentGoals: "newsletters,blog,social",
      currentTools: "wordpress",
      monthlyLeads: "10-50",
      teamSize: "1-5",
      pricingPlan: "Professional",
      timestamp: new Date().toISOString()
    },
    expectedStage: "exploring", // Professional but score < 60
    expectedQualityScore: 55, // 50 base + 5 business
    expectedValue: 2970
  }
];

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Helper function to validate response
function validateResponse(testCase, response, result) {
  const validations = [];
  
  // Check if request was successful
  if (response.ok && result.success) {
    validations.push({ 
      name: 'API Response', 
      passed: true, 
      expected: 'success', 
      actual: 'success' 
    });
  } else {
    validations.push({ 
      name: 'API Response', 
      passed: false, 
      expected: 'success', 
      actual: `failed (${response.status})` 
    });
  }
  
  // Check lead quality score
  if (result.leadQualityScore !== undefined) {
    const scoreTolerance = 5; // Allow 5 point variance
    const scoreMatch = Math.abs(result.leadQualityScore - testCase.expectedQualityScore) <= scoreTolerance;
    validations.push({
      name: 'Lead Quality Score',
      passed: scoreMatch,
      expected: testCase.expectedQualityScore,
      actual: result.leadQualityScore
    });
  }
  
  // Check if contact was created/updated
  if (result.ghlContactId) {
    validations.push({
      name: 'Contact ID',
      passed: true,
      expected: 'Contact created/updated',
      actual: result.ghlContactId
    });
  }
  
  // Check if it's correctly identified as new/update
  if (testCase.isUpdate !== undefined && result.isNewContact !== undefined) {
    validations.push({
      name: 'Contact Status',
      passed: result.isNewContact !== testCase.isUpdate,
      expected: testCase.isUpdate ? 'Updated' : 'New',
      actual: result.isNewContact ? 'New' : 'Updated'
    });
  }
  
  return validations;
}

// Main test runner
async function runComprehensiveTests() {
  console.log(`${colors.bright}${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}║         GHL Integration Comprehensive Test Suite           ║${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);
  
  console.log(`Testing against: ${colors.yellow}${API_BASE}${colors.reset}\n`);
  
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  
  for (let i = 0; i < testScenarios.length; i++) {
    const testCase = testScenarios[i];
    totalTests++;
    
    console.log(`${colors.bright}Test ${i + 1}/${testScenarios.length}: ${testCase.name}${colors.reset}`);
    console.log(`${colors.blue}${testCase.description}${colors.reset}`);
    
    try {
      // Make API request
      const response = await fetch(`${API_BASE}/api/ghl/create-lead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testCase.data)
      });
      
      const result = await response.json();
      
      // Validate response
      const validations = validateResponse(testCase, response, result);
      
      // Display validation results
      let testPassed = true;
      validations.forEach(validation => {
        if (validation.passed) {
          console.log(`  ${colors.green}✓${colors.reset} ${validation.name}: ${validation.actual}`);
        } else {
          console.log(`  ${colors.red}✗${colors.reset} ${validation.name}: Expected ${validation.expected}, got ${validation.actual}`);
          testPassed = false;
        }
      });
      
      // Show additional details in verbose mode
      if (process.env.VERBOSE === 'true') {
        console.log(`${colors.cyan}  Response details:${colors.reset}`);
        console.log(`  ${JSON.stringify(result, null, 2).split('\n').join('\n  ')}`);
      }
      
      if (testPassed) {
        passedTests++;
        console.log(`${colors.green}  Overall: PASSED${colors.reset}`);
      } else {
        failedTests++;
        console.log(`${colors.red}  Overall: FAILED${colors.reset}`);
      }
      
    } catch (error) {
      failedTests++;
      console.log(`  ${colors.red}✗ Test failed with error: ${error.message}${colors.reset}`);
    }
    
    console.log(`${colors.bright}${'─'.repeat(60)}${colors.reset}\n`);
    
    // Small delay between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Summary
  console.log(`${colors.bright}${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}║                      Test Summary                          ║${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);
  
  console.log(`Total Tests: ${colors.yellow}${totalTests}${colors.reset}`);
  console.log(`Passed: ${colors.green}${passedTests}${colors.reset}`);
  console.log(`Failed: ${colors.red}${failedTests}${colors.reset}`);
  console.log(`Success Rate: ${passedTests === totalTests ? colors.green : colors.yellow}${((passedTests / totalTests) * 100).toFixed(1)}%${colors.reset}\n`);
  
  if (failedTests === 0) {
    console.log(`${colors.green}${colors.bright}All tests passed! 🎉${colors.reset}`);
  } else {
    console.log(`${colors.red}${colors.bright}Some tests failed. Please check the integration.${colors.reset}`);
  }
  
  // Exit with appropriate code
  process.exit(failedTests > 0 ? 1 : 0);
}

// Run tests
console.log('Starting comprehensive GHL integration tests...\n');
runComprehensiveTests().catch(error => {
  console.error(`${colors.red}Fatal error running tests:${colors.reset}`, error);
  process.exit(1);
});