/**
 * Assessment Form Test Script
 * 
 * This script tests the readiness assessment form to ensure
 * it also properly populates custom fields in GoHighLevel
 * 
 * Run with: node test-assessment-form.js
 */

// Using built-in fetch (Node.js 18+)
const fetch = globalThis.fetch;

// Configuration
const BASE_URL = 'http://localhost:3001';
const API_ENDPOINT = '/api/ghl/create-lead';

// Assessment form test data
const ASSESSMENT_TEST_DATA = {
  firstName: 'Assessment',
  lastName: 'Tester',
  email: 'assessment.tester@test.com',
  phone: '+1-555-888-9999',
  businessName: 'Assessment Test Company',
  businessType: 'Content Creator',
  contentGoals: ['newsletters', 'blogs'],
  integrations: ['gohighlevel', 'mailchimp'],
  
  // Assessment-specific fields
  answers: {
    'current-content': 'manual',
    'content-volume': 'moderate',
    'crm-usage': 'basic-crm',
    'lead-response': 'hours',
    'time-spent': 'high',
    'budget': 'moderate'
  },
  score: 67,
  recommendation: 'Complete System',
  selectedPlan: 'complete-system',
  timestamp: new Date().toISOString()
};

async function testAssessmentForm() {
  console.log('🧪 Testing Assessment Form Integration\n');
  
  console.log('📊 Assessment Test Data:');
  console.log(JSON.stringify(ASSESSMENT_TEST_DATA, null, 2));
  
  try {
    const response = await fetch(`${BASE_URL}${API_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ASSESSMENT_TEST_DATA)
    });

    const responseData = await response.json();
    
    if (response.ok) {
      console.log('\n✅ Assessment form test passed - Contact created successfully');
      console.log('📋 Response:', responseData);
      console.log(`🆔 Contact ID: ${responseData.ghlContactId}`);
      
      console.log('\n🔍 Expected Custom Fields in GoHighLevel:');
      console.log(`   assessment_score = "${ASSESSMENT_TEST_DATA.score}"`);
      console.log(`   recommended_plan = "${ASSESSMENT_TEST_DATA.recommendation}"`);
      console.log(`   form_type = "assessment"`);
      console.log(`   submission_date = "${ASSESSMENT_TEST_DATA.timestamp}"`);
      
      console.log('\n🔍 Assessment Answers Should Be Mapped To:');
      Object.entries(ASSESSMENT_TEST_DATA.answers).forEach(([questionId, answer]) => {
        const fieldKey = `assessment_${questionId.toLowerCase().replace(/\s+/g, '_')}`;
        console.log(`   ${fieldKey} = "${answer}"`);
      });
      
      console.log('\n🏷️  Expected Tags:');
      console.log(`   • trueflow-assessment`);
      console.log(`   • web-lead`);
      console.log(`   • score-${ASSESSMENT_TEST_DATA.score}`);
      console.log(`   • ${ASSESSMENT_TEST_DATA.recommendation.toLowerCase().replace(' ', '-')}`);
      
      return { success: true, contactId: responseData.ghlContactId };
    } else {
      console.error('❌ Assessment form test failed');
      console.error('Error:', responseData);
      return { success: false, error: responseData };
    }
  } catch (error) {
    console.error('❌ Assessment form test error:', error.message);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🌟 TrueFlow AI - Assessment Form Test');
  console.log('📋 Testing readiness assessment → GoHighLevel integration\n');
  
  const result = await testAssessmentForm();
  
  if (result.success) {
    console.log('\n🎉 Assessment form test completed successfully!');
    console.log(`📞 Please check contact ID ${result.contactId} in GoHighLevel`);
    console.log('👀 Verify that assessment-specific custom fields are populated');
  } else {
    console.log('\n❌ Assessment form test failed');
    console.log('🔧 Please check the configuration and try again');
  }
}

// Run if called directly
if (require.main === module) {
  main();
}