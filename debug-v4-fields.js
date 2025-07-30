/**
 * Debug V4 field mapping to see what's actually happening
 */

const API_URL = 'http://localhost:3001/api/ghl/create-lead-v4';

// Test with minimal data first
const testData = {
  firstName: 'DEBUG',
  lastName: 'V4FIELDS',
  email: 'debug-v4fields@test.com',
  phone: '+1 (555) 999-8888',
  businessName: 'DEBUG V4 Field Test',
  businessType: 'coach',
  contentGoals: ['newsletters', 'courses', 'support'],
  integrations: ['gohighlevel', 'activecampaign'],
  selectedPlan: 'complete_system'
};

async function debugFieldMapping() {
  console.log('🔍 DEBUG: Testing V4 field mapping');
  console.log('================================\n');
  
  console.log('📤 Sending test data:');
  console.log(JSON.stringify(testData, null, 2));
  console.log('');
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    
    console.log('📥 API Response:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('\n✅ Contact created successfully');
      console.log(`Custom fields used: ${result.customFieldsUsed}`);
      console.log(`Tags used: ${result.tagsUsed}`);
      
      console.log('\n⚠️  CHECK THE SERVER LOGS for detailed field mapping info!');
      console.log('The server logs will show:');
      console.log('- Which fields were found in GHL');
      console.log('- Which field mappings succeeded');
      console.log('- Which field mappings failed');
    } else {
      console.log('\n❌ Failed:', result.message);
    }
    
  } catch (error) {
    console.error('💥 Error:', error.message);
  }
  
  console.log('\n🎯 Next steps:');
  console.log('1. Check the server terminal for "[Field Mapping]" logs');
  console.log('2. Look for "No field ID found for:" warnings');
  console.log('3. Compare the field names with what\'s actually in GHL');
}

debugFieldMapping();