#!/usr/bin/env npx tsx

/**
 * Test the production fix by calling our actual API endpoint
 */

import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

async function testProductionFix() {
  console.log('🔧 Testing Production Fix - Full API Integration')
  console.log('===============================================')
  
  // Test data mimicking Michael Chen
  const testData = {
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen.production.test@techcorp.com',
    businessName: 'Tech Solutions Corp',
    businessType: 'Technology',
    contentGoals: ['SEO Content', 'Social Media'],
    integrations: ['CRM Integration', 'Email Marketing'],
    monthlyLeads: '50-100',
    teamSize: '5-10',
    currentTools: 'HubSpot, Mailchimp',
    biggestChallenge: 'Content consistency',
    pricingPlan: 'professional',
    source: 'get-started-form'
  }
  
  console.log('📤 Sending test data to /api/ghl/create-lead-v5...')
  console.log('Test contact:', {
    name: `${testData.firstName} ${testData.lastName}`,
    email: testData.email,
    businessName: testData.businessName
  })
  
  try {
    const response = await fetch('http://localhost:3001/api/ghl/create-lead-v5', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    })
    
    const result = await response.json()
    
    console.log(`\nResponse Status: ${response.status}`)
    console.log('Response:', JSON.stringify(result, null, 2))
    
    if (result.success) {
      console.log('\n✅ SUCCESS!')
      console.log(`Contact ID: ${result.ghlContactId}`)
      console.log(`Lead Score: ${result.leadScore}`)
      console.log(`Lead Quality: ${result.leadQuality}`)
      console.log(`Form Type: ${result.formType}`)
      console.log(`Custom Fields Used: ${result.customFieldsUsed}`)
      console.log(`Tags Used: ${result.tagsUsed}`)
      
      if (result.customFieldsUsed > 0) {
        console.log('\n🎯 CUSTOM FIELDS FIX CONFIRMED!')
        console.log('The production API is now successfully sending custom fields to GHL.')
        console.log('Check the GoHighLevel contact interface to verify they appear there.')
      } else {
        console.log('\n⚠️  No custom fields were sent - may need further investigation.')
      }
    } else {
      console.log('\n❌ API call failed')
      console.log('Error:', result.message)
    }
    
  } catch (error) {
    console.error('\n❌ Error calling API:', error)
    console.log('\nNote: Make sure the landing page server is running on port 3001')
    console.log('Run: cd trueflow-landing-repo && npm run dev')
  }
}

// Run the test
testProductionFix().catch(console.error)