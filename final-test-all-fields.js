/**
 * Final comprehensive test showing ALL custom fields
 */

const API_URL = 'http://localhost:3001/api/ghl/create-lead-v3';

async function createComprehensiveTestContact() {
  console.log('🎯 Creating COMPREHENSIVE Test Contact with ALL Fields\n');
  
  const testData = {
    // Basic contact info
    firstName: 'COMPLETE',
    lastName: 'FIELDS TEST',
    email: 'allfields@testexample.com',
    phone: '+1 (555) 999-8888',
    
    // All Get Started form fields
    businessName: 'ALL FIELDS TEST COMPANY - DELETE ME',
    businessType: 'agency', // Will show in custom field
    contentGoals: ['newsletters', 'blogs', 'social', 'courses', 'sales', 'support'], // All options
    integrations: ['gohighlevel', 'mailchimp', 'convertkit', 'hubspot', 'activecampaign', 'zapier'], // All options
    selectedPlan: 'complete_system', // Will show in custom field
    
    // This will trigger high lead score
    timestamp: new Date().toISOString()
  };
  
  console.log('📋 Data being sent:');
  console.log('- Business Name:', testData.businessName);
  console.log('- Business Type:', testData.businessType);
  console.log('- Content Goals:', testData.contentGoals.join(', '));
  console.log('- Integrations:', testData.integrations.join(', '));
  console.log('- Selected Plan:', testData.selectedPlan);
  console.log('- Submission Date:', testData.timestamp);
  
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
      console.log('\n✅ SUCCESS!');
      console.log('Contact ID:', result.ghlContactId);
      console.log('Lead Score:', result.leadScore);
      console.log('Lead Quality:', result.leadQuality);
      console.log('Custom Fields Used:', result.customFieldsUsed);
      console.log('Tags Used:', result.tagsUsed);
      
      console.log('\n📍 GO TO GOHIGHLEVEL AND CHECK:');
      console.log('1. Find contact: COMPLETE FIELDS TEST');
      console.log('2. Look for these CUSTOM FIELDS:');
      console.log('   ✓ TrueFlow Business Name: ALL FIELDS TEST COMPANY - DELETE ME');
      console.log('   ✓ TrueFlow Business Type: agency');
      console.log('   ✓ TrueFlow Content Goals: newsletters, blogs, social, courses, sales, support');
      console.log('   ✓ TrueFlow Integrations: gohighlevel, mailchimp, convertkit, hubspot, activecampaign, zapier');
      console.log('   ✓ TrueFlow Selected Plan: complete_system');
      console.log('   ✓ TrueFlow Lead Score:', result.leadScore);
      console.log('   ✓ TrueFlow Lead Quality:', result.leadQuality);
      console.log('   ✓ TrueFlow Submission Date:', testData.timestamp);
      console.log('\n3. TAGS should only be:');
      console.log('   ✓ web-lead');
      console.log('   ✓ lead-quality-hot');
      console.log('   ✓ get-started-form');
      console.log('   (NO date tags!)');
    } else {
      console.log('\n❌ Failed:', result.message);
    }
  } catch (error) {
    console.error('\n💥 Error:', error.message);
  }
}

// Run the test
createComprehensiveTestContact();