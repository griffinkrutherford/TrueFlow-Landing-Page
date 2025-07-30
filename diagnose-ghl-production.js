/**
 * Diagnostic script for GoHighLevel production issues
 * This will help identify why contacts aren't being created
 */

// Production URL - update this to your actual production URL
const PRODUCTION_URL = 'https://your-production-url.railway.app'; // UPDATE THIS!

// Test data
const testData = {
  firstName: 'Test',
  lastName: 'Debug',
  email: 'test-debug@example.com',
  phone: '+1234567890',
  businessName: 'Debug Testing LLC',
  businessType: 'agency',
  scorePercentage: 38,
  readinessLevel: 'Getting Ready',
  recommendation: 'Content Engine',
  selectedPlan: 'content-engine',
  answers: {
    'current-content': 'manual',
    'content-volume': 'minimal',
    'crm-usage': 'spreadsheets',
    'lead-response': 'days',
    'time-spent': 'minimal',
    'budget': 'low'
  },
  contentGoals: [],
  integrations: [],
  timestamp: new Date().toISOString()
};

async function testProductionAPI() {
  console.log('🔍 Testing GoHighLevel Production API\n');
  console.log('⚠️  IMPORTANT: Update PRODUCTION_URL in this script first!\n');
  
  try {
    console.log('📡 Sending test request to production...');
    const response = await fetch(`${PRODUCTION_URL}/api/ghl/create-lead-v3`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    
    console.log('\n📊 Response Status:', response.status);
    console.log('📄 Response Body:', JSON.stringify(result, null, 2));
    
    if (!response.ok) {
      console.log('\n❌ API Error Detected!');
      console.log('Possible causes:');
      console.log('1. Invalid GoHighLevel credentials in Railway');
      console.log('2. Custom field creation failed');
      console.log('3. API permissions issue');
      console.log('4. Location ID mismatch');
      
      if (result.error) {
        console.log('\n🔴 Error Details:', result.error);
      }
    } else {
      console.log('\n✅ Success! Contact created in GoHighLevel');
      if (result.ghlContactId) {
        console.log('📝 Contact ID:', result.ghlContactId);
      }
      if (result.customFieldsUsed) {
        console.log('🏷️  Custom Fields Used:', result.customFieldsUsed);
      }
    }
    
  } catch (error) {
    console.error('\n💥 Request Failed:', error.message);
    console.log('\nThis usually means:');
    console.log('- Network connection issue');
    console.log('- Invalid production URL');
    console.log('- Server is down');
  }
}

// Instructions
console.log('='.repeat(60));
console.log('GOHIGHLEVEL PRODUCTION DIAGNOSTIC');
console.log('='.repeat(60));
console.log('\nBefore running this script:');
console.log('1. Update PRODUCTION_URL with your actual Railway URL');
console.log('2. Make sure the deployment is complete');
console.log('3. Check Railway logs for any deployment errors\n');

console.log('To check Railway environment variables:');
console.log('1. Go to Railway dashboard');
console.log('2. Select your project');
console.log('3. Click on Variables tab');
console.log('4. Verify these exist and have real values:');
console.log('   - GHL_LOCATION_ID');
console.log('   - GHL_ACCESS_TOKEN');
console.log('   - RESEND_API_KEY\n');

console.log('Press Ctrl+C to cancel or wait 5 seconds to run the test...\n');

// Give time to read instructions
setTimeout(() => {
  testProductionAPI();
}, 5000);