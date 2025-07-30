/**
 * Create CLEARLY TEST contacts in GoHighLevel
 * All names and emails are obviously for testing
 */

const API_URL = 'http://localhost:3001/api/ghl/create-lead-v3';

// Test scenarios with OBVIOUSLY FAKE names
const testContacts = [
  {
    // TEST 1 - High value test
    firstName: 'TEST',
    lastName: 'USER ONE',
    email: 'test1@testingonly.com',
    phone: '+1 (555) 000-0001',
    businessName: 'TEST COMPANY ONE - DELETE ME',
    businessType: 'agency',
    contentGoals: ['newsletters', 'blogs', 'social', 'sales'],
    integrations: ['gohighlevel', 'hubspot', 'zapier'],
    selectedPlan: 'custom_enterprise'
  },
  {
    // TEST 2 - Medium value test
    firstName: 'FAKE',
    lastName: 'PERSON TWO',
    email: 'test2@deletemelater.com',
    phone: '+1 (555) 000-0002',
    businessName: 'FAKE BUSINESS TWO - TESTING',
    businessType: 'content_creator',
    contentGoals: ['blogs', 'social'],
    integrations: ['mailchimp'],
    selectedPlan: 'content_engine'
  },
  {
    // TEST 3 - Different business type
    firstName: 'DEMO',
    lastName: 'CONTACT THREE',
    email: 'demo3@notreal.com',
    phone: '+1 (555) 000-0003',
    businessName: 'DEMO PODCAST NETWORK - TEST DATA',
    businessType: 'podcaster',
    contentGoals: ['newsletters', 'blogs', 'social', 'courses'],
    integrations: ['convertkit', 'zapier'],
    selectedPlan: 'complete_system'
  },
  {
    // TEST 4 - Minimal data test
    firstName: 'SAMPLE',
    lastName: 'DATA FOUR',
    email: 'sample4@testdata.com',
    phone: '+1 (555) 000-0004',
    businessName: 'SAMPLE FITNESS STUDIO - NOT REAL',
    businessType: 'business_owner',
    contentGoals: ['newsletters'],
    integrations: [],
    selectedPlan: 'content_engine'
  },
  {
    // TEST 5 - Coach test
    firstName: 'EXAMPLE',
    lastName: 'COACH FIVE',
    email: 'example5@fakedata.com',
    phone: '+1 (555) 000-0005',
    businessName: 'EXAMPLE COACHING - TEST ACCOUNT',
    businessType: 'coach',
    contentGoals: ['newsletters', 'blogs', 'courses', 'support'],
    integrations: ['gohighlevel', 'activecampaign'],
    selectedPlan: 'complete_system'
  },
  {
    // TEST 6 - Undecided test
    firstName: 'DUMMY',
    lastName: 'LEAD SIX',
    email: 'dummy6@testlead.com',
    phone: '+1 (555) 000-0006',
    businessName: 'DUMMY STARTUP - DELETE THIS',
    businessType: 'other',
    contentGoals: ['blogs'],
    integrations: [],
    selectedPlan: 'not_sure'
  }
];

// Function to create a single contact
async function createContact(contactData, index) {
  console.log(`\n📤 Creating TEST contact ${index + 1}/${testContacts.length}: ${contactData.firstName} ${contactData.lastName}`);
  console.log(`   Business: ${contactData.businessName}`);
  console.log(`   Type: ${contactData.businessType}`);
  console.log(`   Plan: ${contactData.selectedPlan}`);
  console.log(`   Goals: ${contactData.contentGoals.join(', ')}`);
  console.log(`   Integrations: ${contactData.integrations.length > 0 ? contactData.integrations.join(', ') : 'none'}`);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contactData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ SUCCESS: Contact created with ID: ${result.ghlContactId}`);
      console.log(`   Lead Score: ${result.leadScore} (${result.leadQuality})`);
      console.log(`   Custom Fields Used: ${result.customFieldsUsed}`);
      console.log(`   Tags Used: ${result.tagsUsed} (no date tags)`);
    } else {
      console.log(`❌ FAILED: ${result.message}`);
    }
    
    return result;
  } catch (error) {
    console.error(`💥 ERROR: ${error.message}`);
    return null;
  }
}

// Main function to create all test contacts
async function createAllTestContacts() {
  console.log('🧪 Creating OBVIOUSLY TEST Contacts in GoHighLevel');
  console.log('================================================\n');
  console.log('⚠️  All contacts have FAKE/TEST/DEMO/DUMMY names');
  console.log('⚠️  All businesses say "DELETE ME" or "TEST DATA"');
  console.log('⚠️  Emails use domains like @testingonly.com\n');
  
  console.log('📝 Custom Fields that will be populated:');
  console.log('- trueflow_business_name');
  console.log('- trueflow_business_type');
  console.log('- trueflow_content_goals');
  console.log('- trueflow_integrations');
  console.log('- trueflow_selected_plan');
  console.log('- trueflow_lead_score');
  console.log('- trueflow_lead_quality');
  console.log('- trueflow_submission_date\n');
  
  const results = [];
  
  for (let i = 0; i < testContacts.length; i++) {
    const result = await createContact(testContacts[i], i);
    results.push(result);
    
    // Small delay between contacts
    if (i < testContacts.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Summary
  console.log('\n\n📊 SUMMARY');
  console.log('==========');
  const successful = results.filter(r => r?.success).length;
  console.log(`✅ Successful: ${successful}/${testContacts.length}`);
  
  if (successful > 0) {
    console.log('\n🎯 What to check in GoHighLevel:');
    console.log('1. Go to Contacts in GoHighLevel');
    console.log('2. Look for contacts with names like:');
    console.log('   - TEST USER ONE');
    console.log('   - FAKE PERSON TWO');
    console.log('   - DEMO CONTACT THREE');
    console.log('   - etc.');
    console.log('\n3. Click any TEST contact and check the CUSTOM FIELDS section:');
    console.log('   - Should see all TrueFlow custom fields populated');
    console.log('   - Business name, type, goals, integrations, etc.');
    console.log('   - Lead score and quality');
    console.log('   - Submission date (in custom field, NOT as a tag)');
    console.log('\n4. Check TAGS - should only have 3 tags:');
    console.log('   - web-lead');
    console.log('   - lead-quality-{hot/warm/cold}');
    console.log('   - get-started-form');
    console.log('   - NO date tags anymore!');
  }
  
  console.log('\n🧹 These are TEST contacts - safe to delete anytime!');
  console.log('✨ Test completed!');
}

// Run the test
createAllTestContacts().catch(console.error);