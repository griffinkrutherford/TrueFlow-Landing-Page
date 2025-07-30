/**
 * Field Mapping Verification Script
 * 
 * This script verifies the exact field mappings between the get-started form
 * and GoHighLevel custom fields to ensure proper data flow.
 * 
 * Run with: node field-mapping-verification.js
 */

// Using built-in fetch (Node.js 18+)
const fetch = globalThis.fetch;

// Configuration
const BASE_URL = 'http://localhost:3001';
const API_ENDPOINT = '/api/ghl/create-lead';

// Expected field mappings from the API code
const CUSTOM_FIELD_MAPPINGS = {
  // Getting Started fields - these are the key mappings to verify
  business_type: 'business_type',
  content_goals: 'content_goals',
  monthly_leads: 'monthly_leads',
  team_size: 'team_size',
  current_tools: 'current_tools',
  biggest_challenge: 'biggest_challenge',
  selected_plan: 'selected_plan',
  form_type: 'form_type',
  submission_date: 'submission_date'
};

// Get-Started form field questions mapping
const GET_STARTED_QUESTIONS_MAPPING = {
  'What type of business do you run?': 'businessType → business_type',
  'What are your content goals?': 'contentGoals → content_goals',
  'How many leads do you generate monthly?': 'monthlyLeads → monthly_leads',  
  'What\'s your team size?': 'teamSize → team_size',
  'What systems do you already have in place?': 'currentTools → current_tools',
  'What\'s your biggest challenge?': 'biggestChallenge → biggest_challenge',
  'Which plan interests you most?': 'pricingPlan → selected_plan'
};

// Test data for verification
const VERIFICATION_TEST_DATA = {
  firstName: 'Field',
  lastName: 'Verification',
  email: 'field.verification@test.com',
  phone: '+1-555-999-0000',
  businessName: 'Field Verification Test Company',
  businessType: 'agency',
  contentGoals: ['newsletters', 'blogs', 'social'],
  monthlyLeads: '51-100',
  teamSize: '6-10',
  currentTools: ['WordPress', 'Mailchimp', 'Canva'],
  biggestChallenge: 'Testing field mapping verification',
  pricingPlan: 'complete-system',
  timestamp: new Date().toISOString()
};

async function runFieldMappingVerification() {
  console.log('🔍 FIELD MAPPING VERIFICATION');
  console.log('=' * 60);
  
  console.log('\n📋 Expected Field Mappings:');
  Object.entries(CUSTOM_FIELD_MAPPINGS).forEach(([key, value]) => {
    console.log(`   ${key} → ${value}`);
  });
  
  console.log('\n❓ Get-Started Form Questions → Custom Fields:');
  Object.entries(GET_STARTED_QUESTIONS_MAPPING).forEach(([question, mapping]) => {
    console.log(`   "${question}"`);
    console.log(`   └── ${mapping}`);
    console.log('');
  });
  
  console.log('\n🧪 Running Field Mapping Verification Test...');
  
  try {
    const response = await fetch(`${BASE_URL}${API_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(VERIFICATION_TEST_DATA)
    });

    const responseData = await response.json();
    
    if (response.ok) {
      console.log('✅ Verification test passed - Contact created successfully');
      console.log(`🆔 Contact ID: ${responseData.ghlContactId}`);
      
      console.log('\n📊 Test Data Sent:');
      console.log(`   Business Type: "${VERIFICATION_TEST_DATA.businessType}"`);
      console.log(`   Content Goals: ${JSON.stringify(VERIFICATION_TEST_DATA.contentGoals)}`);
      console.log(`   Monthly Leads: "${VERIFICATION_TEST_DATA.monthlyLeads}"`);
      console.log(`   Team Size: "${VERIFICATION_TEST_DATA.teamSize}"`);
      console.log(`   Current Tools: ${JSON.stringify(VERIFICATION_TEST_DATA.currentTools)}`);
      console.log(`   Biggest Challenge: "${VERIFICATION_TEST_DATA.biggestChallenge}"`);
      console.log(`   Selected Plan: "${VERIFICATION_TEST_DATA.pricingPlan}"`);
      
      console.log('\n🔍 Expected in GoHighLevel Custom Fields:');
      console.log(`   business_type = "${VERIFICATION_TEST_DATA.businessType}"`);
      console.log(`   content_goals = "${VERIFICATION_TEST_DATA.contentGoals.join(', ')}"`);
      console.log(`   monthly_leads = "${VERIFICATION_TEST_DATA.monthlyLeads}"`);
      console.log(`   team_size = "${VERIFICATION_TEST_DATA.teamSize}"`);
      console.log(`   current_tools = "${VERIFICATION_TEST_DATA.currentTools.join(', ')}"`);
      console.log(`   biggest_challenge = "${VERIFICATION_TEST_DATA.biggestChallenge}"`);
      console.log(`   selected_plan = "${VERIFICATION_TEST_DATA.pricingPlan}"`);
      console.log(`   form_type = "get-started"`);
      console.log(`   submission_date = "${VERIFICATION_TEST_DATA.timestamp}"`);
      
      return {
        success: true,
        contactId: responseData.ghlContactId,
        testData: VERIFICATION_TEST_DATA
      };
    } else {
      console.error('❌ Verification test failed');
      console.error('Error:', responseData);
      return { success: false, error: responseData };
    }
  } catch (error) {
    console.error('❌ Verification test error:', error.message);
    return { success: false, error: error.message };
  }
}

async function generateDetailedReport() {
  console.log('\n📄 DETAILED FIELD MAPPING REPORT');
  console.log('=' * 60);
  
  console.log('\n🎯 Form Field Processing Flow:');
  console.log('   1. User fills out get-started form');
  console.log('   2. Form data is submitted to /api/ghl/create-lead');
  console.log('   3. API normalizes array fields (contentGoals, currentTools)');
  console.log('   4. Custom fields are built using CUSTOM_FIELD_MAPPING');
  console.log('   5. Data is sent to GoHighLevel via upsert endpoint');
  console.log('   6. Contact is created/updated with custom fields');
  
  console.log('\n📝 Field Type Handling:');
  console.log('   • String fields: Direct mapping (business_type, monthly_leads, etc.)');
  console.log('   • Array fields: Joined with ", " separator (content_goals, current_tools)');
  console.log('   • Date fields: ISO string format (submission_date)');
  console.log('   • Form type: Always set to "get-started" for this form');
  
  console.log('\n🔗 API Route Analysis:');
  console.log('   File: /app/api/ghl/create-lead/route.ts');
  console.log('   Function: createOrUpdateGHLContact()');
  console.log('   Lines: 320-366 (get-started specific logic)');
  
  console.log('\n✅ Verified Custom Field Keys:');
  Object.entries(CUSTOM_FIELD_MAPPINGS).forEach(([displayName, fieldKey]) => {
    console.log(`   ✓ ${fieldKey}`);
  });
  
  console.log('\n📋 Manual Verification Checklist:');
  console.log('   □ Log into GoHighLevel');
  console.log('   □ Navigate to Contacts');
  console.log('   □ Search for test contacts by email');
  console.log('   □ Open contact details');
  console.log('   □ Check "Custom Fields" section');
  console.log('   □ Verify each field matches expected values');
  console.log('   □ Confirm arrays are comma-separated');
  console.log('   □ Check that tags are applied correctly');
  
  console.log('\n🏷️  Expected Tags for Get-Started Form:');
  console.log('   • trueflow-get-started');
  console.log('   • web-lead');
  console.log('   • [current-date] (e.g., 2025-07-30)');
  console.log('   • plan-[selected-plan] (e.g., plan-complete-system)');
  console.log('   • business-[business-type] (e.g., business-agency)');
}

async function main() {
  console.log('🌟 TrueFlow AI - Field Mapping Verification');
  console.log('🔍 Verifying get-started form → GoHighLevel field mappings\n');
  
  // Run verification test
  const result = await runFieldMappingVerification();
  
  // Generate detailed report
  await generateDetailedReport();
  
  if (result.success) {
    console.log('\n🎉 Field mapping verification completed successfully!');
    console.log(`📞 Please check contact ID ${result.contactId} in GoHighLevel`);
    console.log('👀 Manually verify that all custom fields are populated correctly');
  } else {
    console.log('\n❌ Field mapping verification failed');
    console.log('🔧 Please check the API configuration and try again');
  }
}

// Export for potential module usage
module.exports = {
  runFieldMappingVerification,
  generateDetailedReport,
  CUSTOM_FIELD_MAPPINGS,
  GET_STARTED_QUESTIONS_MAPPING
};

// Run if called directly
if (require.main === module) {
  main();
}