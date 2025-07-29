const axios = require('axios');
const colors = require('colors');

// Test configuration
const API_URL = 'http://localhost:3001/api/ghl/create-lead-v2';

// Generate a unique test submission
const generateTestData = () => {
  const timestamp = Date.now();
  const testId = Math.random().toString(36).substring(7);
  
  return {
    // Contact Information
    firstName: 'Test',
    lastName: `User_${testId}`,
    email: `test_${timestamp}@example.com`,
    phone: '+1 (555) 123-4567',
    businessName: `Test Business ${testId}`,
    
    // Business Profile
    businessType: 'creator',
    contentGoals: ['newsletters', 'blogs', 'social'],
    integrations: ['gohighlevel', 'mailchimp'],
    
    // Assessment Answers
    answers: {
      'current-content': 'manual',
      'content-volume': 'moderate',
      'crm-usage': 'spreadsheets',
      'lead-response': 'hours',
      'time-spent': 'high',
      'budget': 'moderate'
    },
    
    // Detailed Assessment Data
    assessmentAnswers: [
      {
        questionId: 'current-content',
        category: 'Content Creation',
        question: 'How do you currently create content for your business?',
        answer: 'Manually write everything',
        score: 1
      },
      {
        questionId: 'content-volume',
        category: 'Content Creation',
        question: 'How much content do you need to produce monthly?',
        answer: '6-20 pieces',
        score: 2
      },
      {
        questionId: 'crm-usage',
        category: 'Customer Management',
        question: 'How do you currently manage customer relationships?',
        answer: 'Spreadsheets or manual tracking',
        score: 1
      },
      {
        questionId: 'lead-response',
        category: 'Customer Management',
        question: 'How quickly do you typically respond to new leads?',
        answer: 'Within 24 hours',
        score: 2
      },
      {
        questionId: 'time-spent',
        category: 'Time Management',
        question: 'How much time do you spend on repetitive tasks weekly?',
        answer: '15-30 hours',
        score: 2
      },
      {
        questionId: 'budget',
        category: 'Investment',
        question: "What's your monthly budget for content and customer management?",
        answer: '$500 - $2,000',
        score: 2
      }
    ],
    
    // Scoring
    totalScore: 10,
    maxPossibleScore: 24,
    scorePercentage: 42,
    recommendation: 'Content Engine',
    readinessLevel: 'Getting Ready',
    
    // Plan Selection
    selectedPlan: 'content-engine',
    
    // Metadata
    timestamp: new Date().toISOString(),
    assessmentVersion: '2.0',
    source: 'readiness-assessment'
  };
};

// Run detailed test
const runDetailedTest = async () => {
  console.log('🔬 Running detailed Getting Started form test...\n'.cyan);
  
  const testData = generateTestData();
  
  console.log('📤 Sending test data:'.blue);
  console.log(JSON.stringify(testData, null, 2).gray);
  console.log('');
  
  try {
    console.log('⏱️  Making API request...'.yellow);
    const startTime = Date.now();
    
    const response = await axios.post(API_URL, testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const duration = Date.now() - startTime;
    
    console.log(`✅ Request completed in ${duration}ms`.green);
    console.log('');
    console.log('📥 Response:'.blue);
    console.log(`Status: ${response.status}`.green);
    console.log(`Data: ${JSON.stringify(response.data, null, 2)}`.gray);
    console.log('');
    
    // Analyze response
    console.log('📊 Response Analysis:'.cyan);
    
    if (response.data.success) {
      console.log('✅ Success flag is true'.green);
    } else {
      console.log('❌ Success flag is false'.red);
    }
    
    if (response.data.message) {
      console.log(`📝 Message: ${response.data.message}`.yellow);
    }
    
    if (response.data.warning) {
      console.log(`⚠️  Warning: ${response.data.warning}`.yellow);
    }
    
    if (response.data.ghlContactId) {
      console.log(`🆔 GHL Contact ID: ${response.data.ghlContactId}`.green);
    } else if (response.data.leadId) {
      console.log(`🆔 Lead ID: ${response.data.leadId}`.green);
    }
    
    console.log('');
    console.log('🏷️  Expected Tags Generated:'.cyan);
    console.log('- Form type: get-started'.gray);
    console.log('- Source: web-lead'.gray);
    console.log('- Business type: content-creator'.gray);
    console.log('- Plan: plan-content-engine'.gray);
    console.log('- Lead quality: Based on score (42%)'.gray);
    console.log('- Score range: score-25-50'.gray);
    console.log(`- Time-based: submitted-${new Date().toISOString().substring(0, 7)}`.gray);
    
    console.log('');
    console.log('📧 Email Notification:'.cyan);
    if (response.data.warning && response.data.warning.includes('Email notification pending')) {
      console.log('⚠️  Email not sent (likely missing RESEND_API_KEY)'.yellow);
      console.log('   Recipients would be: Griffin and Matt'.gray);
    } else {
      console.log('✅ Email notification should be sent to Griffin and Matt'.green);
    }
    
    console.log('');
    console.log('🔌 GHL Integration:'.cyan);
    if (response.data.ghlContactId) {
      console.log('✅ GHL contact created successfully'.green);
    } else if (response.data.leadId && response.data.leadId.startsWith('log-')) {
      console.log('⚠️  GHL not configured - using fallback logging'.yellow);
      console.log('   Data logged with ID: ' + response.data.leadId.gray);
    }
    
  } catch (error) {
    console.log('❌ Request failed:'.red);
    console.log(`Error: ${error.message}`.red);
    if (error.response) {
      console.log(`Status: ${error.response.status}`.red);
      console.log(`Data: ${JSON.stringify(error.response.data, null, 2)}`.red);
    }
  }
  
  console.log('\n✨ Test completed!'.green);
};

// Check environment
const checkEnvironment = async () => {
  console.log('🔍 Checking environment configuration...\n'.cyan);
  
  try {
    // Check if server is running
    const healthCheck = await axios.get('http://localhost:3001', {
      validateStatus: () => true
    });
    console.log(`✅ Server is running on port 3001 (status: ${healthCheck.status})`.green);
  } catch (error) {
    console.log('❌ Server is not running on port 3001'.red);
    console.log('   Run: npm run dev'.gray);
    process.exit(1);
  }
  
  console.log('');
};

// Run tests
const main = async () => {
  await checkEnvironment();
  await runDetailedTest();
};

main().catch(error => {
  console.error('❌ Test failed:'.red, error);
  process.exit(1);
});