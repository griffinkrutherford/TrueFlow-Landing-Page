#!/usr/bin/env node

/**
 * Test script for custom fields functionality
 * This script tests that custom fields are created and populated correctly
 */

const baseUrl = process.argv[2] || 'http://localhost:3001';

console.log('🧪 Testing Custom Fields Integration');
console.log('Base URL:', baseUrl);
console.log('-----------------------------------\n');

// Test data for Get Started form with all fields
const getStartedData = {
  // Contact info
  firstName: "CustomField",
  lastName: "Test",
  email: `cf-test-${Date.now()}@example.com`,
  phone: "555-0123",
  
  // Business info
  businessName: "Custom Fields Test Company",
  businessType: "E-commerce",
  
  // Get Started specific fields
  contentGoals: ["Blog posts", "Social media content", "Email newsletters"],
  monthlyLeads: "100+",
  teamSize: "10+",
  currentTools: ["WordPress", "Mailchimp", "Hootsuite", "Canva"],
  biggestChallenge: "Maintaining consistent content across all channels while scaling our business",
  pricingPlan: "growth",
  
  // Metadata
  timestamp: new Date().toISOString()
};

// Test data for Assessment form
const assessmentData = {
  // Contact info
  firstName: "Assessment",
  lastName: "CustomFields",
  email: `assessment-cf-${Date.now()}@example.com`,
  phone: "555-0456",
  businessName: "Assessment Test Business",
  
  // Assessment specific
  score: 85,
  recommendation: "Professional",
  answers: {
    "marketing_goals": "Increase brand awareness and lead generation",
    "current_challenges": "Content creation and consistency",
    "budget": "high",
    "timeline": "immediate",
    "decision_maker": "yes"
  },
  
  timestamp: new Date().toISOString()
};

async function testEndpoint(name, data) {
  console.log(`\n📍 Testing ${name}...`);
  console.log('Sending data with fields:', Object.keys(data).join(', '));
  
  try {
    const response = await fetch(`${baseUrl}/api/ghl/create-lead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Success:', result);
      
      if (result.ghlContactId && !result.ghlContactId.startsWith('demo-') && !result.ghlContactId.startsWith('email-only-')) {
        console.log('🎉 Real GHL Contact Created with custom fields!');
        console.log('\n📋 What to check in GoHighLevel:');
        console.log('1. Go to Contacts > ' + data.email);
        console.log('2. Check the Custom Fields section');
        console.log('3. Verify these fields are populated:');
        
        if (name.includes('Get Started')) {
          console.log('   - Business Type: ' + data.businessType);
          console.log('   - Content Goals: ' + data.contentGoals.join(', '));
          console.log('   - Monthly Leads: ' + data.monthlyLeads);
          console.log('   - Team Size: ' + data.teamSize);
          console.log('   - Current Tools: ' + data.currentTools.join(', '));
          console.log('   - Biggest Challenge: ' + data.biggestChallenge);
          console.log('   - Selected Plan: ' + data.pricingPlan);
        } else {
          console.log('   - Assessment Score: ' + data.score);
          console.log('   - Recommended Plan: ' + data.recommendation);
          console.log('   - Marketing Goals: ' + data.answers.marketing_goals);
          console.log('   - Budget Range: ' + data.answers.budget);
          console.log('   - Timeline: ' + data.answers.timeline);
        }
        
        console.log('   - Lead Quality Score (calculated)');
        console.log('   - Qualification Status (calculated)');
      }
    } else {
      console.log('❌ Error:', response.status, result);
    }
    
    return result;
  } catch (error) {
    console.log('❌ Request failed:', error.message);
    return null;
  }
}

async function checkCustomFieldsInGHL() {
  console.log('\n📊 Checking Custom Fields in GoHighLevel...');
  
  if (!process.env.GHL_ACCESS_TOKEN || !process.env.GHL_LOCATION_ID) {
    console.log('⚠️  Set GHL_ACCESS_TOKEN and GHL_LOCATION_ID environment variables to check fields directly');
    return;
  }
  
  try {
    const response = await fetch(`https://services.leadconnectorhq.com/locations/${process.env.GHL_LOCATION_ID}/customFields`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
        'Accept': 'application/json',
        'Version': '2021-07-28'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      const trueflowFields = data.customFields.filter(f => 
        f.fieldKey.includes('_') || 
        f.name.includes('TrueFlow') ||
        f.name.includes('Assessment') ||
        f.name.includes('Lead')
      );
      
      console.log(`\nFound ${trueflowFields.length} TrueFlow-related custom fields:`);
      trueflowFields.forEach(field => {
        console.log(`- ${field.name} (${field.fieldKey}) - ${field.dataType}`);
      });
    }
  } catch (error) {
    console.log('Could not fetch custom fields:', error.message);
  }
}

async function runTests() {
  // Test Get Started form
  await testEndpoint('Get Started Form', getStartedData);
  
  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test Assessment form
  await testEndpoint('Assessment Form', assessmentData);
  
  // Check custom fields if credentials are available
  await checkCustomFieldsInGHL();
  
  console.log('\n\n✅ Test Complete!');
  console.log('\n🔍 Next Steps:');
  console.log('1. Check GoHighLevel for the new contacts');
  console.log('2. Verify all custom fields were created (only once)');
  console.log('3. Verify field values are properly stored');
  console.log('4. Run this test again to ensure no duplicate fields are created');
}

// Run tests
runTests().catch(console.error);