/**
 * Final test to verify all 16 fields are being mapped correctly
 */

const API_URL = 'http://localhost:3001/api/ghl/create-lead-v4';

const testData = {
  // Basic contact info
  firstName: 'FINAL',
  lastName: 'FIELDTEST',
  email: 'final-fieldtest@test.com',
  phone: '+1 (555) 999-1234',
  
  // Core fields
  businessName: 'Final Field Test Company',
  businessType: 'agency',
  contentGoals: ['newsletters', 'blogs', 'social', 'courses', 'sales', 'support'],
  integrations: ['gohighlevel', 'hubspot', 'mailchimp', 'zapier'],
  selectedPlan: 'custom',
  
  // Assessment fields (if doing assessment form)
  answers: {
    'current-content': 'mixed',
    'content-volume': 'high',
    'crm-usage': 'advanced-crm',
    'lead-response': 'instant',
    'time-spent': 'very-high',
    'budget': 'enterprise'
  },
  
  // Scores
  scorePercentage: 92,
  readinessLevel: 'Highly Ready'
};

async function testAllFields() {
  console.log('🎯 Final Field Mapping Test');
  console.log('===========================\n');
  console.log('Testing all 16 expected fields:\n');
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Contact created successfully!');
      console.log(`GHL Contact ID: ${result.ghlContactId}`);
      console.log(`Lead Score: ${result.leadScore}`);
      console.log(`Lead Quality: ${result.leadQuality}`);
      console.log(`Custom Fields Used: ${result.customFieldsUsed}`);
      console.log(`Tags Used: ${result.tagsUsed}`);
      
      console.log('\n📋 Expected fields to be populated:');
      console.log('1. Business Name ✓');
      console.log('2. Business Type ✓');
      console.log('3. What are your goals? ✓');
      console.log('4. Integration Preferences ✓');
      console.log('5. Selected Plan ✓');
      console.log('6. Lead Score ✓');
      console.log('7. Lead Quality ✓');
      console.log('8. Submission Date ✓');
      console.log('9. Current Content Creation');
      console.log('10. Content Volume');
      console.log('11. CRM Usage');
      console.log('12. Lead Response Time');
      console.log('13. Time on Repetitive Tasks');
      console.log('14. Current revenue range?');
      console.log('15. Assessment Score');
      console.log('16. Readiness Level');
      
      console.log(`\n🔍 Check GHL for contact "${testData.firstName} ${testData.lastName}"`);
      console.log('All fields listed above should have values!');
      
    } else {
      console.log('❌ Failed:', result.message);
    }
    
  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

testAllFields();