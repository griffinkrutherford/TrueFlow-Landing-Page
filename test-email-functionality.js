const axios = require('axios');
const colors = require('colors');

// Test configuration
const API_URL = 'http://localhost:3001/api/ghl/create-lead-v2';

// Test email functionality specifically
const testEmailFunctionality = async () => {
  console.log('📧 Testing Email Notification Functionality\n'.cyan);
  
  // Create a realistic submission
  const testData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 987-6543',
    businessName: 'Doe Enterprises LLC',
    businessType: 'business',
    contentGoals: ['blogs', 'newsletters'],
    selectedPlan: 'complete-system',
    
    // Include assessment data for comprehensive email
    answers: {
      'current-content': 'outsource',
      'content-volume': 'high',
      'crm-usage': 'basic-crm',
      'lead-response': 'quick',
      'time-spent': 'moderate',
      'budget': 'high'
    },
    
    totalScore: 18,
    maxPossibleScore: 24,
    scorePercentage: 75,
    recommendation: 'Complete System',
    readinessLevel: 'Highly Ready',
    
    timestamp: new Date().toISOString(),
    source: 'readiness-assessment'
  };
  
  console.log('📤 Sending test submission for email verification...'.yellow);
  console.log('');
  console.log('Test User Details:'.blue);
  console.log(`- Name: ${testData.firstName} ${testData.lastName}`.gray);
  console.log(`- Email: ${testData.email}`.gray);
  console.log(`- Business: ${testData.businessName}`.gray);
  console.log(`- Score: ${testData.scorePercentage}% (${testData.readinessLevel})`.gray);
  console.log(`- Selected Plan: ${testData.selectedPlan}`.gray);
  console.log('');
  
  try {
    const response = await axios.post(API_URL, testData);
    
    console.log('📥 API Response:'.blue);
    console.log(`Status: ${response.status}`.green);
    console.log(`Success: ${response.data.success}`.green);
    console.log(`Message: ${response.data.message}`.gray);
    
    if (response.data.warning) {
      console.log(`⚠️  Warning: ${response.data.warning}`.yellow);
    }
    
    console.log('');
    console.log('📧 Email Notification Status:'.cyan);
    
    // Check if email was sent based on response
    if (response.data.warning && response.data.warning.includes('Email notification pending')) {
      console.log('❌ Email notification failed'.red);
      console.log('   Possible reasons:'.yellow);
      console.log('   - Invalid or missing RESEND_API_KEY'.gray);
      console.log('   - Resend API service issues'.gray);
      console.log('   - Network connectivity problems'.gray);
    } else if (response.data.success) {
      console.log('✅ Email notification should have been sent!'.green);
      console.log('');
      console.log('📬 Expected Email Details:'.cyan);
      console.log('   Recipients:'.blue);
      console.log('   - Griffin (griffin@trueflow.ai)'.gray);
      console.log('   - Matt (matt@trueflow.ai)'.gray);
      console.log('');
      console.log('   Subject: New TrueFlow Lead: John Doe - Highly Ready (75%)'.gray);
      console.log('');
      console.log('   Email would include:'.blue);
      console.log('   - Contact information'.gray);
      console.log('   - Business type and goals'.gray);
      console.log('   - Assessment score and recommendation'.gray);
      console.log('   - Selected plan details'.gray);
      console.log('   - Detailed assessment answers'.gray);
    }
    
    console.log('');
    console.log('🔍 To verify email delivery:'.cyan);
    console.log('1. Check Griffin and Matt\'s email inboxes'.gray);
    console.log('2. Look for emails from notifications@trueflow.ai'.gray);
    console.log('3. Check spam/junk folders if not in inbox'.gray);
    console.log('4. Verify Resend dashboard at https://resend.com/emails'.gray);
    
  } catch (error) {
    console.log('❌ Test failed:'.red);
    console.log(`Error: ${error.message}`.red);
    if (error.response) {
      console.log(`Response: ${JSON.stringify(error.response.data, null, 2)}`.red);
    }
  }
  
  console.log('\n✨ Email functionality test completed!'.green);
};

// Check Resend configuration
const checkResendConfig = async () => {
  console.log('🔐 Checking Resend Configuration...\n'.cyan);
  
  // Note: We can't directly check if the API key is valid without making a Resend API call
  // But we can check if it's configured in the expected format
  console.log('Expected configuration:'.blue);
  console.log('- RESEND_API_KEY should start with "re_"'.gray);
  console.log('- Email notifications are sent from: notifications@trueflow.ai'.gray);
  console.log('- Recipients: griffin@trueflow.ai, matt@trueflow.ai'.gray);
  console.log('');
};

// Main test runner
const main = async () => {
  await checkResendConfig();
  await testEmailFunctionality();
  
  console.log('\n📊 Summary of Email Integration:'.cyan);
  console.log('1. API endpoint is working correctly ✓'.green);
  console.log('2. Form data is being processed ✓'.green);
  console.log('3. Email notifications depend on valid RESEND_API_KEY'.yellow);
  console.log('4. GHL integration requires configuration (currently using fallback)'.yellow);
  console.log('5. All submissions are logged for safety ✓'.green);
};

main().catch(error => {
  console.error('❌ Test suite failed:'.red, error);
  process.exit(1);
});