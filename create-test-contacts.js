/**
 * Create test contacts in GoHighLevel with custom fields
 * This will create various test scenarios to demonstrate the system
 */

const API_URL = 'http://localhost:3001/api/ghl/create-lead-v3';

// Test scenarios with different profiles
const testContacts = [
  {
    // High-value agency lead
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@digitalgrowthagency.com',
    phone: '+1 (555) 123-4567',
    businessName: 'Digital Growth Agency',
    businessType: 'agency',
    contentGoals: ['newsletters', 'blogs', 'social', 'sales'],
    integrations: ['gohighlevel', 'hubspot', 'zapier'],
    selectedPlan: 'custom_enterprise',
    timestamp: new Date().toISOString()
  },
  {
    // Content creator with moderate needs
    firstName: 'Mike',
    lastName: 'Chen',
    email: 'mike@contentcreatorsunited.com',
    phone: '+1 (555) 234-5678',
    businessName: 'Content Creators United',
    businessType: 'content_creator',
    contentGoals: ['blogs', 'social'],
    integrations: ['mailchimp'],
    selectedPlan: 'content_engine',
    timestamp: new Date().toISOString()
  },
  {
    // Podcast host ready for automation
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily@thegrowthpodcast.com',
    phone: '+1 (555) 345-6789',
    businessName: 'The Growth Podcast Network',
    businessType: 'podcaster',
    contentGoals: ['newsletters', 'blogs', 'social', 'courses'],
    integrations: ['convertkit', 'zapier'],
    selectedPlan: 'complete_system',
    timestamp: new Date().toISOString()
  },
  {
    // Small business owner just starting
    firstName: 'David',
    lastName: 'Williams',
    email: 'david@localfitnessstudio.com',
    phone: '+1 (555) 456-7890',
    businessName: 'Local Fitness Studio',
    businessType: 'business_owner',
    contentGoals: ['newsletters', 'social'],
    integrations: [],
    selectedPlan: 'content_engine',
    timestamp: new Date().toISOString()
  },
  {
    // Coach with full automation needs
    firstName: 'Lisa',
    lastName: 'Thompson',
    email: 'lisa@executivecoachingpro.com',
    phone: '+1 (555) 567-8901',
    businessName: 'Executive Coaching Pro',
    businessType: 'coach',
    contentGoals: ['newsletters', 'blogs', 'courses', 'support'],
    integrations: ['gohighlevel', 'activecampaign', 'zapier'],
    selectedPlan: 'complete_system',
    timestamp: new Date().toISOString()
  },
  {
    // Undecided lead needing consultation
    firstName: 'Robert',
    lastName: 'Davis',
    email: 'robert@techstartupventures.com',
    phone: '+1 (555) 678-9012',
    businessName: 'Tech Startup Ventures',
    businessType: 'other',
    contentGoals: ['blogs'],
    integrations: ['hubspot'],
    selectedPlan: 'not_sure',
    timestamp: new Date().toISOString()
  }
];

// Function to create a single contact
async function createContact(contactData, index) {
  console.log(`\n📤 Creating contact ${index + 1}/${testContacts.length}: ${contactData.firstName} ${contactData.lastName}`);
  console.log(`   Business: ${contactData.businessName} (${contactData.businessType})`);
  console.log(`   Plan: ${contactData.selectedPlan}`);
  
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

// Main function to create all test contacts
async function createAllTestContacts() {
  console.log('🚀 Creating Test Contacts in GoHighLevel');
  console.log('=====================================\n');
  console.log('This will create 6 different test contacts with various:');
  console.log('- Business types (agency, creator, podcaster, etc.)');
  console.log('- Content goals and integration preferences');
  console.log('- Selected plans (from unsure to enterprise)');
  console.log('- Lead scores (calculated automatically)\n');
  
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
    console.log('1. Go to your GoHighLevel contacts');
    console.log('2. Look for these new contacts:');
    testContacts.forEach((contact, i) => {
      if (results[i]?.success) {
        console.log(`   - ${contact.firstName} ${contact.lastName} (${contact.businessName})`);
      }
    });
    console.log('\n3. Click on any contact to see:');
    console.log('   - Custom fields populated with form data');
    console.log('   - Only 4 tags (not 20+)');
    console.log('   - Lead score and quality in custom fields');
    console.log('   - Business type, content goals, integrations, etc.');
  }
  
  console.log('\n✨ Test completed!');
}

// Run the test
createAllTestContacts().catch(console.error);