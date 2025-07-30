#!/usr/bin/env node

/**
 * Comprehensive Test Suite for Custom Fields
 * Tests all form submissions with various data combinations
 */

const colors = require('colors');
const axios = require('axios');

const baseUrl = process.argv[2] || 'http://localhost:3001';
const verbose = process.argv.includes('--verbose') || process.argv.includes('-v');

console.log(colors.cyan.bold('\n🧪 TrueFlow Custom Fields Test Suite'));
console.log(colors.gray('================================'));
console.log(colors.gray(`Base URL: ${baseUrl}`));
console.log(colors.gray(`Verbose: ${verbose ? 'ON' : 'OFF'}`));
console.log(colors.gray('================================\n'));

// Test configurations
const testCases = {
  getStarted: {
    full: {
      name: 'Get Started - Full Data',
      data: {
        // Contact info
        firstName: 'CustomField',
        lastName: 'TestFull',
        email: `cf-full-${Date.now()}@example.com`,
        phone: '555-0123',
        
        // Business info
        businessName: 'Full Test Company LLC',
        businessType: 'agency',
        
        // Get Started specific fields
        contentGoals: ['newsletters', 'blogs', 'social', 'courses', 'sales'],
        monthlyLeads: '100+',
        teamSize: '10+',
        currentTools: ['WordPress', 'Mailchimp', 'HubSpot', 'GoHighLevel'],
        integrations: ['gohighlevel', 'mailchimp', 'hubspot', 'zapier'],
        biggestChallenge: 'Maintaining consistent content across all channels while scaling our business operations and managing multiple client accounts.',
        selectedPlan: 'complete-system',
        
        // Metadata
        formType: 'get-started',
        timestamp: new Date().toISOString()
      }
    },
    minimal: {
      name: 'Get Started - Minimal Data',
      data: {
        firstName: 'Minimal',
        lastName: 'Test',
        email: `cf-minimal-${Date.now()}@example.com`,
        phone: '555-0456',
        businessName: 'Minimal Corp',
        businessType: 'business',
        contentGoals: ['newsletters'],
        selectedPlan: 'content-engine',
        formType: 'get-started'
      }
    },
    edgeCases: {
      name: 'Get Started - Edge Cases',
      data: {
        firstName: "Test'Quote",
        lastName: 'Special-Chars!@#',
        email: `edge-case+test-${Date.now()}@example.com`,
        phone: '+1-555-123-4567',
        businessName: 'Company "With Quotes" & Special Chars!',
        businessType: 'other',
        contentGoals: [],  // Empty array
        currentTools: ['Other Tool', 'Custom CRM', 'In-house System'],
        integrations: [],  // Empty array
        biggestChallenge: '',  // Empty string
        selectedPlan: 'not-sure',
        formType: 'get-started'
      }
    }
  },
  assessment: {
    highScore: {
      name: 'Assessment - High Score',
      data: {
        firstName: 'Assessment',
        lastName: 'HighScore',
        email: `assessment-high-${Date.now()}@example.com`,
        phone: '555-0789',
        businessName: 'Advanced AI Company',
        
        // Assessment results
        score: 95,
        scorePercentage: 95,
        recommendation: 'complete-system',
        readinessLevel: 'Advanced',
        
        // Assessment answers
        answers: {
          currentContent: 'mixed',
          contentVolume: 'very-high',
          crmUsage: 'integrated',
          leadResponse: 'instant',
          timeSpent: 'very-high',
          budget: 'enterprise'
        },
        
        formType: 'assessment',
        timestamp: new Date().toISOString()
      }
    },
    lowScore: {
      name: 'Assessment - Low Score',
      data: {
        firstName: 'Beginner',
        lastName: 'User',
        email: `assessment-low-${Date.now()}@example.com`,
        phone: '555-0321',
        businessName: 'Startup Inc',
        
        score: 25,
        scorePercentage: 25,
        recommendation: 'content-engine',
        readinessLevel: 'Beginner',
        
        answers: {
          currentContent: 'manual',
          contentVolume: 'minimal',
          crmUsage: 'spreadsheets',
          leadResponse: 'days',
          timeSpent: 'minimal',
          budget: 'low'
        },
        
        formType: 'assessment',
        timestamp: new Date().toISOString()
      }
    },
    partialData: {
      name: 'Assessment - Partial Data',
      data: {
        firstName: 'Partial',
        lastName: 'Assessment',
        email: `assessment-partial-${Date.now()}@example.com`,
        businessName: 'Partial Data Co',
        
        score: 50,
        recommendation: 'content-engine',
        
        // Only some answers
        answers: {
          currentContent: 'team',
          budget: 'moderate'
        },
        
        formType: 'assessment'
      }
    }
  }
};

// Test results tracker
const testResults = {
  passed: 0,
  failed: 0,
  details: []
};

/**
 * Make API request and validate response
 */
async function testEndpoint(testName, testData) {
  console.log(colors.blue(`\n📍 Testing: ${testName}`));
  
  if (verbose) {
    console.log(colors.gray('Request data:'));
    console.log(JSON.stringify(testData, null, 2));
  }
  
  const startTime = Date.now();
  
  try {
    const response = await axios.post(`${baseUrl}/api/ghl/create-lead`, testData, {
      headers: {
        'Content-Type': 'application/json',
      },
      validateStatus: false // Don't throw on non-2xx
    });
    
    const duration = Date.now() - startTime;
    const result = response.data;
    
    // Validate response
    const validations = {
      statusOk: response.status === 200 || response.status === 201,
      hasContactId: !!result.ghlContactId,
      hasSuccess: result.success === true,
      responseTime: duration < 5000, // Should respond within 5 seconds
      customFieldsPopulated: result.customFieldsPopulated > 0
    };
    
    const allPassed = Object.values(validations).every(v => v);
    
    if (allPassed) {
      console.log(colors.green(`✅ PASSED (${duration}ms)`));
      testResults.passed++;
      
      // Log success details
      if (result.ghlContactId && !result.ghlContactId.startsWith('demo-')) {
        console.log(colors.green(`   Contact ID: ${result.ghlContactId}`));
        console.log(colors.green(`   Custom Fields: ${result.customFieldsPopulated || 0}`));
        
        if (verbose && result.debugInfo) {
          console.log(colors.gray('\n   Debug Info:'));
          console.log(colors.gray(JSON.stringify(result.debugInfo, null, 2)));
        }
      }
    } else {
      console.log(colors.red(`❌ FAILED (${duration}ms)`));
      testResults.failed++;
      
      // Log failure details
      Object.entries(validations).forEach(([check, passed]) => {
        console.log(colors[passed ? 'green' : 'red'](`   ${passed ? '✓' : '✗'} ${check}`));
      });
      
      if (!validations.statusOk) {
        console.log(colors.red(`   Status: ${response.status}`));
        console.log(colors.red(`   Error: ${result.error || 'Unknown error'}`));
      }
    }
    
    // Store result
    testResults.details.push({
      testName,
      passed: allPassed,
      duration,
      contactId: result.ghlContactId,
      customFields: result.customFieldsPopulated,
      validations
    });
    
    return result;
    
  } catch (error) {
    console.log(colors.red(`❌ ERROR: ${error.message}`));
    testResults.failed++;
    
    testResults.details.push({
      testName,
      passed: false,
      error: error.message
    });
    
    return null;
  }
}

/**
 * Test field validation
 */
async function testFieldValidation() {
  console.log(colors.yellow('\n\n🔍 Testing Field Validation'));
  console.log(colors.gray('=========================='));
  
  const invalidCases = [
    {
      name: 'Missing required fields',
      data: {
        email: 'test@example.com'
        // Missing firstName, lastName, etc.
      }
    },
    {
      name: 'Invalid email format',
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: 'not-an-email',
        businessName: 'Test Co'
      }
    },
    {
      name: 'Invalid form type',
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        businessName: 'Test Co',
        formType: 'invalid-type'
      }
    }
  ];
  
  for (const testCase of invalidCases) {
    const response = await testEndpoint(`Validation - ${testCase.name}`, testCase.data);
    
    // These should fail validation
    if (response && !response.success) {
      console.log(colors.green('   ✓ Correctly rejected invalid data'));
    } else {
      console.log(colors.red('   ✗ Should have rejected invalid data'));
    }
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  // Test Get Started forms
  console.log(colors.yellow('\n📝 Get Started Form Tests'));
  console.log(colors.gray('========================'));
  
  for (const [key, test] of Object.entries(testCases.getStarted)) {
    await testEndpoint(test.name, test.data);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
  }
  
  // Test Assessment forms
  console.log(colors.yellow('\n\n📊 Assessment Form Tests'));
  console.log(colors.gray('======================='));
  
  for (const [key, test] of Object.entries(testCases.assessment)) {
    await testEndpoint(test.name, test.data);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
  }
  
  // Test validation
  await testFieldValidation();
  
  // Print summary
  console.log(colors.cyan('\n\n📈 Test Summary'));
  console.log(colors.gray('=============='));
  console.log(colors.green(`✅ Passed: ${testResults.passed}`));
  console.log(colors.red(`❌ Failed: ${testResults.failed}`));
  console.log(colors.blue(`📊 Total: ${testResults.passed + testResults.failed}`));
  
  // Detailed results
  if (verbose) {
    console.log(colors.cyan('\n\n📋 Detailed Results'));
    console.log(colors.gray('=================='));
    
    testResults.details.forEach(result => {
      console.log(`\n${result.passed ? '✅' : '❌'} ${result.testName}`);
      if (result.duration) {
        console.log(`   Duration: ${result.duration}ms`);
      }
      if (result.contactId) {
        console.log(`   Contact ID: ${result.contactId}`);
      }
      if (result.customFields) {
        console.log(`   Custom Fields: ${result.customFields}`);
      }
      if (result.error) {
        console.log(colors.red(`   Error: ${result.error}`));
      }
    });
  }
  
  // Exit with appropriate code
  process.exit(testResults.failed > 0 ? 1 : 0);
}

// Handle interruption
process.on('SIGINT', () => {
  console.log(colors.yellow('\n\n⚠️  Test interrupted'));
  process.exit(1);
});

// Run tests
console.log(colors.cyan('Starting tests in 2 seconds...'));
setTimeout(runAllTests, 2000);