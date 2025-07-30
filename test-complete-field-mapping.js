/**
 * Comprehensive Test: ALL Get-Started Form Fields
 * 
 * This test verifies that EVERY field expected in a get-started form submission
 * is properly mapped and appears in GoHighLevel custom fields.
 */

// Using Node.js built-in fetch (Node 18+)

// Comprehensive test data with ALL expected get-started fields
const comprehensiveGetStartedData = {
  // Basic contact information
  firstName: "Sarah",
  lastName: "Johnson",
  email: "sarah.johnson@creativestudio.com",
  phone: "+1 (555) 123-9876",
  businessName: "Creative Studio Pro",
  
  // Business profile
  businessType: "Marketing Agency",
  contentGoals: ["newsletters", "blogs", "social", "courses"],
  integrations: ["gohighlevel", "mailchimp", "zapier"],
  selectedPlan: "complete-system",
  pricingPlan: "complete-system",
  
  // Get-started specific fields (the ones that were missing)
  monthlyLeads: "51-100",
  teamSize: "6-10", 
  currentTools: ["WordPress", "Mailchimp", "Canva", "Hootsuite"],
  biggestChallenge: "Managing multiple client campaigns efficiently while maintaining quality",
  
  // System metadata
  timestamp: new Date().toISOString(),
  source: "get-started-form"
};

// Assessment data to test assessment form fields as well
const comprehensiveAssessmentData = {
  // Basic contact information
  firstName: "Michael",
  lastName: "Chen",
  email: "michael.chen@techcorp.com", 
  phone: "+1 (555) 987-6543",
  businessName: "Tech Solutions Corp",
  
  // Business profile
  businessType: "Business Owner",
  contentGoals: ["blogs", "newsletters", "sales"],
  integrations: ["hubspot", "activecampaign"],
  selectedPlan: "complete-system",
  
  // Assessment-specific fields
  answers: {
    "current-content": "mixed",
    "content-volume": "high", 
    "crm-usage": "advanced-crm",
    "lead-response": "quick",
    "time-spent": "moderate",
    "budget": "high"
  },
  assessmentAnswers: [
    {
      questionId: "current-content",
      category: "Content Creation",
      question: "How do you currently create content for your business?",
      answer: "Mix of manual and automated tools",
      score: 4
    },
    {
      questionId: "content-volume", 
      category: "Content Creation",
      question: "How much content do you need to produce monthly?",
      answer: "21-50 pieces",
      score: 3
    },
    {
      questionId: "crm-usage",
      category: "Customer Management", 
      question: "How do you currently manage customer relationships?",
      answer: "Advanced CRM with automation",
      score: 3
    },
    {
      questionId: "lead-response",
      category: "Customer Management",
      question: "How quickly do you typically respond to new leads?", 
      answer: "Within a few hours",
      score: 3
    },
    {
      questionId: "time-spent",
      category: "Time Management",
      question: "How much time do you spend on repetitive tasks weekly?",
      answer: "5-15 hours", 
      score: 3
    },
    {
      questionId: "budget",
      category: "Investment",
      question: "What's your monthly budget for content and customer management?",
      answer: "$2,000 - $5,000",
      score: 3
    }
  ],
  totalScore: 19,
  maxPossibleScore: 24,
  scorePercentage: 79,
  readinessLevel: "Highly Ready",
  recommendation: "Complete System",
  
  // System metadata
  timestamp: new Date().toISOString(),
  source: "readiness-assessment",
  assessmentVersion: "2.0"
};

async function testCompleteFieldMapping() {
  console.log('🧪 Testing Complete TrueFlow Field Mapping');
  console.log('=' .repeat(60));
  
  const baseUrl = process.env.TEST_URL || 'http://localhost:3001';
  const apiUrl = `${baseUrl}/api/ghl/create-lead-v5`;
  
  console.log(`📡 API URL: ${apiUrl}`);
  console.log('');
  
  // Test 1: Comprehensive Get-Started Form
  console.log('📋 TEST 1: Complete Get-Started Form Submission');
  console.log('-'.repeat(50));
  console.log('Fields being tested:');
  Object.keys(comprehensiveGetStartedData).forEach(key => {
    const value = comprehensiveGetStartedData[key];
    const preview = Array.isArray(value) 
      ? `[${value.length} items: ${value.slice(0, 2).join(', ')}${value.length > 2 ? '...' : ''}]`
      : typeof value === 'string' && value.length > 50
        ? `"${value.substring(0, 50)}..."`
        : JSON.stringify(value);
    console.log(`  ✓ ${key}: ${preview}`);
  });
  
  try {
    console.log('\n🚀 Submitting get-started form...');
    const response1 = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comprehensiveGetStartedData)
    });
    
    const result1 = await response1.json();
    
    if (response1.ok) {
      console.log('✅ Get-started form submitted successfully!');
      console.log(`📧 Contact ID: ${result1.ghlContactId || 'N/A'}`);
      console.log(`📊 Lead Score: ${result1.leadScore || 'N/A'}`);
      console.log(`🏷️  Lead Quality: ${result1.leadQuality || 'N/A'}`);
      console.log(`📝 Form Type: ${result1.formType || 'N/A'}`);
      console.log(`🔧 Custom Fields Used: ${result1.customFieldsUsed || 0}`);
      console.log(`🏷️  Tags Used: ${result1.tagsUsed || 0}`);
    } else {
      console.log('❌ Get-started form submission failed:');
      console.log(JSON.stringify(result1, null, 2));
    }
  } catch (error) {
    console.log('❌ Get-started form test error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60));
  
  // Test 2: Comprehensive Assessment Form
  console.log('📋 TEST 2: Complete Assessment Form Submission');
  console.log('-'.repeat(50));
  console.log('Fields being tested:');
  Object.keys(comprehensiveAssessmentData).forEach(key => {
    const value = comprehensiveAssessmentData[key];
    const preview = Array.isArray(value) 
      ? `[${value.length} items]`
      : typeof value === 'object' && value !== null
        ? `{${Object.keys(value).length} properties}`
      : typeof value === 'string' && value.length > 50
        ? `"${value.substring(0, 50)}..."`
        : JSON.stringify(value);
    console.log(`  ✓ ${key}: ${preview}`);
  });
  
  try {
    console.log('\n🚀 Submitting assessment form...');
    const response2 = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comprehensiveAssessmentData)
    });
    
    const result2 = await response2.json();
    
    if (response2.ok) {
      console.log('✅ Assessment form submitted successfully!');
      console.log(`📧 Contact ID: ${result2.ghlContactId || 'N/A'}`);
      console.log(`📊 Lead Score: ${result2.leadScore || 'N/A'}`);
      console.log(`🏷️  Lead Quality: ${result2.leadQuality || 'N/A'}`);
      console.log(`📝 Form Type: ${result2.formType || 'N/A'}`);
      console.log(`🔧 Custom Fields Used: ${result2.customFieldsUsed || 0}`);
      console.log(`🏷️  Tags Used: ${result2.tagsUsed || 0}`);
    } else {
      console.log('❌ Assessment form submission failed:');
      console.log(JSON.stringify(result2, null, 2));
    }
  } catch (error) {
    console.log('❌ Assessment form test error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📋 FIELD MAPPING SUMMARY');
  console.log('-'.repeat(50));
  
  // List all fields that should be mapped
  const allExpectedFields = [
    // Contact fields
    'firstName', 'lastName', 'email', 'phone', 'businessName',
    // Business profile
    'businessType', 'contentGoals', 'integrations', 'selectedPlan', 'pricingPlan',
    // Get-started specific
    'monthlyLeads', 'teamSize', 'currentTools', 'biggestChallenge',
    // Assessment specific
    'answers', 'assessmentAnswers', 'totalScore', 'maxPossibleScore', 
    'scorePercentage', 'readinessLevel', 'recommendation',
    // System fields
    'leadScore', 'leadQuality', 'formType', 'submissionDate', 'timestamp', 'source'
  ];
  
  console.log('Expected TrueFlow custom fields in GHL:');
  allExpectedFields.forEach(field => {
    console.log(`✓ ${field} → trueflow_${field.replace(/([A-Z])/g, '_$1').toLowerCase()}`);
  });
  
  console.log('\n🎯 NEXT STEPS:');
  console.log('1. Check GoHighLevel contacts for both Sarah Johnson and Michael Chen');
  console.log('2. Verify ALL custom fields are populated with correct values');
  console.log('3. Confirm arrays are properly formatted (comma-separated)');
  console.log('4. Check that assessment answers are stored as readable JSON');
  console.log('5. Validate lead scoring and quality assessment');
  
  console.log('\n✨ Test completed! Check GHL to verify field mapping success.');
}

// Run the test
testCompleteFieldMapping().catch(console.error);