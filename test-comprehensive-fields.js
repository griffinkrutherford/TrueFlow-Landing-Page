/**
 * Comprehensive Form Fields Test Script
 * 
 * This script tests all possible field combinations for TrueFlow's get-started form
 * to ensure proper custom field population in GoHighLevel
 * 
 * Run with: node test-comprehensive-fields.js
 */

// Using built-in fetch (Node.js 18+)
const fetch = globalThis.fetch;

// Configuration
const BASE_URL = 'http://localhost:3001'; // Landing page URL
const API_ENDPOINT = '/api/ghl/create-lead';

// Test data generators
const businessTypes = ['agency', 'business', 'coach', 'podcaster', 'creator', 'other'];

const contentGoalsOptions = [
  ['newsletters'],
  ['blogs'],
  ['social'],
  ['courses'],
  ['sales'],
  ['support'],
  ['newsletters', 'blogs'],
  ['social', 'courses', 'sales'],
  ['newsletters', 'blogs', 'social', 'courses', 'sales', 'support']
];

const selectedPlanOptions = ['content-engine', 'complete-system', 'custom', 'not-sure'];

const integrationOptions = [
  [],
  ['gohighlevel'],
  ['mailchimp'],
  ['hubspot'],
  ['zapier'],
  ['gohighlevel', 'mailchimp'],
  ['hubspot', 'zapier', 'activecampaign'],
  ['gohighlevel', 'mailchimp', 'convertkit', 'hubspot', 'activecampaign', 'zapier']
];

const monthlyLeadsOptions = ['1-10', '11-25', '26-50', '51-100', '100+'];

const teamSizeOptions = ['just-me', '2-5', '6-10', '10+'];

const currentToolsOptions = [
  [],
  ['WordPress'],
  ['Mailchimp'],
  ['Canva'],
  ['WordPress', 'Mailchimp'],
  ['Canva', 'Hootsuite', 'Buffer'],
  ['WordPress', 'Mailchimp', 'Canva', 'Hootsuite', 'Buffer', 'Google Analytics']
];

const biggestChallengeOptions = [
  'Creating consistent, engaging content that converts',
  'Managing multiple client campaigns efficiently',
  'Finding time to create quality content regularly',
  'Maintaining brand consistency across all platforms',
  'Converting followers into paying customers',
  'Staying ahead of content trends and best practices',
  'Scaling content production without losing quality'
];

// Test scenarios generator
function generateTestScenarios() {
  const scenarios = [];
  
  // Scenario 1: Full comprehensive form with all fields
  scenarios.push({
    name: 'Full Form - All Fields Populated',
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe.fullform@test.com',
      phone: '+1-555-123-4567',
      businessName: 'Comprehensive Test Business LLC',
      businessType: 'agency',
      contentGoals: ['newsletters', 'blogs', 'social', 'courses'],
      monthlyLeads: '51-100',
      teamSize: '6-10',
      currentTools: ['WordPress', 'Mailchimp', 'Canva', 'Hootsuite'],
      biggestChallenge: 'Managing multiple client campaigns efficiently',
      pricingPlan: 'complete-system',
      timestamp: new Date().toISOString()
    }
  });

  // Scenario 2: Minimal form with only required fields
  scenarios.push({
    name: 'Minimal Form - Required Fields Only',
    data: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith.minimal@test.com',
      businessName: 'Minimal Test Co',
      businessType: 'business',
      contentGoals: ['blogs'],
      monthlyLeads: '1-10',
      teamSize: 'just-me',
      currentTools: [],
      biggestChallenge: 'Creating consistent, engaging content that converts',
      pricingPlan: 'content-engine',
      timestamp: new Date().toISOString()
    }
  });

  // Scenario 3: Coach with multiple goals and tools
  scenarios.push({
    name: 'Coach - Multiple Goals and Tools',
    data: {
      firstName: 'Michael',
      lastName: 'Johnson',
      email: 'michael.johnson.coach@test.com',
      phone: '+1-555-234-5678',
      businessName: 'Elite Performance Coaching',
      businessType: 'coach',
      contentGoals: ['newsletters', 'courses', 'social'],
      monthlyLeads: '26-50',
      teamSize: '2-5',
      currentTools: ['Canva', 'Hootsuite', 'Buffer', 'Google Analytics'],
      biggestChallenge: 'Converting followers into paying customers',
      pricingPlan: 'complete-system',
      timestamp: new Date().toISOString()
    }
  });

  // Scenario 4: Podcaster with unique challenges
  scenarios.push({
    name: 'Podcaster - Content Repurposing Focus',
    data: {
      firstName: 'Sarah',
      lastName: 'Williams',
      email: 'sarah.williams.podcaster@test.com',
      phone: '+1-555-345-6789',
      businessName: 'Tech Talk Podcast Network',
      businessType: 'podcaster',
      contentGoals: ['blogs', 'social', 'newsletters'],
      monthlyLeads: '11-25',
      teamSize: '2-5',
      currentTools: ['WordPress', 'Mailchimp'],
      biggestChallenge: 'Staying ahead of content trends and best practices',
      pricingPlan: 'custom',
      timestamp: new Date().toISOString()
    }
  });

  // Scenario 5: Large agency with custom needs
  scenarios.push({
    name: 'Large Agency - Enterprise Requirements',
    data: {
      firstName: 'David',
      lastName: 'Chen',
      email: 'david.chen.agency@test.com',
      phone: '+1-555-456-7890',
      businessName: 'Digital Growth Agency Inc',
      businessType: 'agency',
      contentGoals: ['newsletters', 'blogs', 'social', 'courses', 'sales', 'support'],
      monthlyLeads: '100+',
      teamSize: '10+',
      currentTools: ['WordPress', 'Mailchimp', 'Canva', 'Hootsuite', 'Buffer', 'Google Analytics'],
      biggestChallenge: 'Scaling content production without losing quality',
      pricingPlan: 'custom',
      timestamp: new Date().toISOString()
    }
  });

  // Scenario 6: Edge case - Special characters and long text
  scenarios.push({
    name: 'Edge Case - Special Characters and Long Text',
    data: {
      firstName: 'María José',
      lastName: 'García-Rodríguez',
      email: 'maria.garcia+test@test-domain.co.uk',
      phone: '+44-20-7123-4567',
      businessName: 'Café & Restaurant Solutions™ (London) Ltd.',
      businessType: 'other',
      contentGoals: ['social', 'newsletters'],
      monthlyLeads: '26-50',
      teamSize: '2-5',
      currentTools: ['WordPress', 'Canva'],
      biggestChallenge: 'Creating consistent, engaging content that converts while maintaining our unique brand voice across multiple locations and languages in the European market',
      pricingPlan: 'not-sure',
      timestamp: new Date().toISOString()
    }
  });

  // Scenario 7: Empty arrays and edge cases
  scenarios.push({
    name: 'Edge Case - Empty Arrays',
    data: {
      firstName: 'Alex',
      lastName: 'Taylor',
      email: 'alex.taylor.empty@test.com',
      businessName: 'Startup Ventures',
      businessType: 'business',
      contentGoals: ['blogs'], // Minimum required
      monthlyLeads: '1-10',
      teamSize: 'just-me',
      currentTools: [], // Empty array
      biggestChallenge: 'Finding time to create quality content regularly',
      pricingPlan: 'content-engine',
      timestamp: new Date().toISOString()
    }
  });

  return scenarios;
}

// Field verification mappings
const FIELD_VERIFICATION_MAP = {
  'Business Type': 'business_type',
  'Content Goals': 'content_goals',
  'Monthly Leads': 'monthly_leads',
  'Team Size': 'team_size',
  'Current Tools': 'current_tools',
  'Biggest Challenge': 'biggest_challenge',
  'Selected Plan': 'selected_plan',
  'Form Type': 'form_type',
  'Submission Date': 'submission_date'
};

// Test execution functions
async function runSingleTest(scenario) {
  console.log(`\n🧪 Testing: ${scenario.name}`);
  console.log('📊 Test Data:', JSON.stringify(scenario.data, null, 2));
  
  try {
    const response = await fetch(`${BASE_URL}${API_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scenario.data)
    });

    const responseData = await response.json();
    
    if (response.ok) {
      console.log('✅ Test passed - Contact created/updated successfully');
      console.log('📋 Response:', responseData);
      
      if (responseData.ghlContactId) {
        console.log(`🆔 GHL Contact ID: ${responseData.ghlContactId}`);
      }
      
      return {
        success: true,
        scenario: scenario.name,
        contactId: responseData.ghlContactId,
        response: responseData,
        testData: scenario.data
      };
    } else {
      console.error('❌ Test failed - API error');
      console.error('📄 Error response:', responseData);
      
      return {
        success: false,
        scenario: scenario.name,
        error: responseData,
        testData: scenario.data
      };
    }
  } catch (error) {
    console.error('❌ Test failed - Network/parsing error:', error.message);
    
    return {
      success: false,
      scenario: scenario.name,
      error: error.message,
      testData: scenario.data
    };
  }
}

async function runAllTests() {
  console.log('🚀 Starting Comprehensive Form Fields Test Suite');
  console.log('📍 Target URL:', `${BASE_URL}${API_ENDPOINT}`);
  console.log('⏰ Test started at:', new Date().toISOString());
  
  const scenarios = generateTestScenarios();
  const results = [];
  
  console.log(`\n📝 Running ${scenarios.length} test scenarios...\n`);
  
  for (const scenario of scenarios) {
    const result = await runSingleTest(scenario);
    results.push(result);
    
    // Add delay between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Generate test report
  generateTestReport(results);
}

function generateTestReport(results) {
  console.log('\n' + '='.repeat(80));
  console.log('📊 COMPREHENSIVE FORM FIELDS TEST REPORT');
  console.log('='.repeat(80));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`\n📈 Test Summary:`);
  console.log(`   ✅ Successful tests: ${successful.length}/${results.length}`);
  console.log(`   ❌ Failed tests: ${failed.length}/${results.length}`);
  console.log(`   📊 Success rate: ${Math.round((successful.length / results.length) * 100)}%`);
  
  if (successful.length > 0) {
    console.log(`\n✅ Successful Tests:`);
    successful.forEach((result, index) => {
      console.log(`   ${index + 1}. ${result.scenario}`);
      if (result.contactId) {
        console.log(`      🆔 Contact ID: ${result.contactId}`);
      }
    });
  }
  
  if (failed.length > 0) {
    console.log(`\n❌ Failed Tests:`);
    failed.forEach((result, index) => {
      console.log(`   ${index + 1}. ${result.scenario}`);
      console.log(`      🚫 Error: ${typeof result.error === 'string' ? result.error : JSON.stringify(result.error)}`);
    });
  }
  
  console.log(`\n🔍 Field Coverage Analysis:`);
  console.log(`   📝 Business Types tested: ${new Set(results.map(r => r.testData.businessType)).size}`);
  console.log(`   🎯 Content Goals combinations: ${new Set(results.map(r => JSON.stringify(r.testData.contentGoals))).size}`);
  console.log(`   👥 Team Size options: ${new Set(results.map(r => r.testData.teamSize)).size}`);
  console.log(`   🔧 Current Tools combinations: ${new Set(results.map(r => JSON.stringify(r.testData.currentTools))).size}`);
  console.log(`   💰 Pricing Plans: ${new Set(results.map(r => r.testData.pricingPlan)).size}`);
  
  console.log(`\n📋 Next Steps for Manual Verification:`);
  if (successful.length > 0) {
    console.log(`   1. Log into GoHighLevel and verify the following contacts were created:`);
    successful.forEach((result, index) => {
      if (result.contactId) {
        console.log(`      • ${result.testData.firstName} ${result.testData.lastName} (${result.testData.email}) - ID: ${result.contactId}`);
      }
    });
    console.log(`   2. Check that custom fields are properly populated:`);
    Object.entries(FIELD_VERIFICATION_MAP).forEach(([displayName, fieldKey]) => {
      console.log(`      • ${displayName} → ${fieldKey}`);
    });
    console.log(`   3. Verify field values match the test data sent`);
    console.log(`   4. Confirm arrays are properly formatted (comma-separated)`);
    console.log(`   5. Check that tags are correctly applied`);
  }
  
  console.log(`\n⏰ Test completed at: ${new Date().toISOString()}`);
  console.log('='.repeat(80));
}

// Additional utility functions for specific field testing
async function testSpecificFieldCombinations() {
  console.log('\n🔬 Running Specific Field Combination Tests...\n');
  
  const specificTests = [
    {
      name: 'All Business Types Test',
      tests: businessTypes.map(type => ({
        firstName: 'Test',
        lastName: `User-${type}`,
        email: `test.${type}@fieldtest.com`,
        businessName: `${type.charAt(0).toUpperCase() + type.slice(1)} Test Business`,
        businessType: type,
        contentGoals: ['blogs'],
        monthlyLeads: '1-10',
        teamSize: 'just-me',
        currentTools: [],
        biggestChallenge: 'Testing business type field',
        pricingPlan: 'content-engine',
        timestamp: new Date().toISOString()
      }))
    },
    {
      name: 'All Plan Options Test',
      tests: selectedPlanOptions.map(plan => ({
        firstName: 'Plan',
        lastName: `Test-${plan}`,
        email: `plan.${plan}@fieldtest.com`,
        businessName: `${plan} Plan Test Co`,
        businessType: 'business',
        contentGoals: ['blogs'],
        monthlyLeads: '1-10',
        teamSize: 'just-me',
        currentTools: [],
        biggestChallenge: 'Testing plan selection field',
        pricingPlan: plan,
        timestamp: new Date().toISOString()
      }))
    }
  ];
  
  for (const testGroup of specificTests) {
    console.log(`\n📋 ${testGroup.name}:`);
    for (const testData of testGroup.tests) {
      const result = await runSingleTest({ name: `${testGroup.name} - ${testData.businessType || testData.pricingPlan}`, data: testData });
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}

// Main execution
async function main() {
  try {
    console.log('🌟 TrueFlow AI - Comprehensive Form Fields Test Suite');
    console.log('📧 Testing custom field population in GoHighLevel\n');
    
    // Check if server is running
    try {
      const healthCheck = await fetch(`${BASE_URL}/api/check-env`);
      if (!healthCheck.ok) {
        throw new Error('Health check failed');
      }
      console.log('✅ Server is running and accessible\n');
    } catch (error) {
      console.error('❌ Server is not accessible. Please ensure the landing page is running on port 3001');
      console.error('💡 Run: cd trueflow-landing-repo && npm run dev');
      return;
    }
    
    // Run main test suite
    await runAllTests();
    
    // Run specific field combination tests
    await testSpecificFieldCombinations();
    
    console.log('\n🎉 All tests completed! Check the report above for results.');
    console.log('🔍 Please manually verify the contacts in GoHighLevel to ensure custom fields are populated correctly.');
    
  } catch (error) {
    console.error('💥 Test suite failed:', error.message);
    process.exit(1);
  }
}

// Export for potential module usage
module.exports = {
  runAllTests,
  generateTestScenarios,
  runSingleTest,
  testSpecificFieldCombinations
};

// Run if called directly
if (require.main === module) {
  main();
}