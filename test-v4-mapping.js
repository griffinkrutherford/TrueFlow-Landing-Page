/**
 * Test V4 endpoint with proper field mapping
 * Creates test contacts with all Getting Started form fields
 */

const API_URL = 'http://localhost:3001/api/ghl/create-lead-v4';

const testContacts = [
  {
    // Test 1: Full agency profile
    firstName: 'V4TEST',
    lastName: 'AGENCY',
    email: 'v4test-agency@deletetest.com',
    phone: '+1 (555) 111-0001',
    businessName: 'V4 TEST AGENCY - DELETE ME',
    businessType: 'agency',
    contentGoals: ['newsletters', 'blogs', 'social', 'sales', 'courses'],
    integrations: ['gohighlevel', 'hubspot', 'zapier'],
    selectedPlan: 'custom_enterprise'
  },
  {
    // Test 2: Content creator
    firstName: 'V4TEST',
    lastName: 'CREATOR',
    email: 'v4test-creator@deletetest.com',
    phone: '+1 (555) 111-0002',
    businessName: 'V4 TEST CREATOR - DELETE ME',
    businessType: 'content_creator',
    contentGoals: ['blogs', 'social'],
    integrations: ['mailchimp'],
    selectedPlan: 'content_engine'
  },
  {
    // Test 3: Coach with full data
    firstName: 'V4TEST',
    lastName: 'COACH',
    email: 'v4test-coach@deletetest.com',
    phone: '+1 (555) 111-0003',
    businessName: 'V4 TEST COACHING - DELETE ME',
    businessType: 'coach',
    contentGoals: ['newsletters', 'courses', 'support'],
    integrations: ['gohighlevel', 'activecampaign', 'convertkit'],
    selectedPlan: 'complete_system'
  }
];

async function createTestContact(contact, index) {
  console.log(`\n📤 Creating V4 test contact ${index + 1}/${testContacts.length}: ${contact.firstName} ${contact.lastName}`);
  console.log(`   Business: ${contact.businessName}`);
  console.log(`   Type: ${contact.businessType}`);
  console.log(`   Goals: ${contact.contentGoals.join(', ')}`);
  console.log(`   Integrations: ${contact.integrations.join(', ')}`);
  console.log(`   Plan: ${contact.selectedPlan}`);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contact)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ SUCCESS: Contact created`);
      console.log(`   GHL ID: ${result.ghlContactId}`);
      console.log(`   Lead Score: ${result.leadScore}`);
      console.log(`   Lead Quality: ${result.leadQuality}`);
      console.log(`   Custom Fields Used: ${result.customFieldsUsed}`);
      console.log(`   Tags Used: ${result.tagsUsed}`);
    } else {
      console.log(`❌ FAILED: ${result.message}`);
    }
    
    return result;
  } catch (error) {
    console.error(`💥 ERROR: ${error.message}`);
    return null;
  }
}

async function runTests() {
  console.log('🎯 Testing V4 Endpoint with Proper Field Mapping');
  console.log('==============================================\n');
  console.log('This will create test contacts with ALL form fields mapped to existing GHL fields.');
  console.log('The V4 endpoint uses dynamic field mapping to match your actual GHL custom fields.\n');
  
  for (let i = 0; i < testContacts.length; i++) {
    await createTestContact(testContacts[i], i);
    if (i < testContacts.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log('\n\n📍 CHECK IN GOHIGHLEVEL:');
  console.log('1. Look for contacts starting with "V4TEST"');
  console.log('2. Check these fields should be populated:');
  console.log('   - Business Name');
  console.log('   - Business Type (with full name, e.g., "Marketing Agency")');
  console.log('   - What are your goals? (content goals)');
  console.log('   - Integration Preferences');
  console.log('   - Selected Plan');
  console.log('   - Lead Score');
  console.log('   - Lead Quality');
  console.log('   - And more assessment-related fields if applicable');
  console.log('\n3. Only 4 tags should be present (no date tag)');
  console.log('\n✨ V4 mapping uses your ACTUAL GHL field names!');
}

runTests();