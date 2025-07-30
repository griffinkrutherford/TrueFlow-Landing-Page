#!/usr/bin/env node

/**
 * Test script to verify array formatting fix in GoHighLevel integration
 * This creates a contact with multiple array fields to ensure proper formatting
 */

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const GHL_API_BASE = 'https://services.leadconnectorhq.com'
const GHL_ACCESS_TOKEN = process.env.GHL_ACCESS_TOKEN
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID

if (!GHL_ACCESS_TOKEN || !GHL_LOCATION_ID) {
  console.error('❌ Missing required environment variables')
  process.exit(1)
}

async function createTestContact() {
  console.log('🧪 Testing array formatting fix for GoHighLevel fields...\n')
  
  // Test data with multiple array fields
  const testData = {
    firstName: 'Array',
    lastName: 'Format Test',
    email: `array.format.test.${Date.now()}@example.com`,
    phone: '+15555550123',
    businessName: 'Array Formatting Test Company',
    businessType: 'Agency',
    
    // Array fields that should be cleanly formatted
    contentGoals: [
      'Email Newsletters',
      'Blog Posts', 
      'Social Media Content',
      'Video Scripts',
      'Sales Materials'
    ],
    integrations: [
      'GoHighLevel',
      'Mailchimp',
      'HubSpot',
      'Zapier'
    ],
    currentTools: [
      'HubSpot',
      'Salesforce', 
      'Mailchimp',
      'Hootsuite',
      'Buffer'
    ],
    leadSources: [
      'Website',
      'Social Media',
      'Referrals',
      'Paid Ads'
    ],
    currentSystems: [
      'CRM',
      'Email Marketing',
      'Social Media Management', 
      'Analytics'
    ],
    
    // Single value fields
    monthlyLeads: '101-500',
    teamSize: '11-25',
    biggestChallenge: 'Scaling Operations',
    businessGoals: 'Streamline operations and scale content creation efficiently',
    selectedPlan: 'content-engine',
    
    // Assessment data
    answers: {
      'current-content': 'team',
      'content-volume': 'high',
      'crm-usage': 'advanced-crm',
      'lead-response': 'quick',
      'time-spent': 'moderate',
      'budget': 'high'
    },
    
    leadScore: 85,
    leadQuality: 'hot',
    totalScore: 85,
    scorePercentage: 85,
    readinessLevel: 'High',
    recommendation: 'Your business shows strong AI readiness',
    assessmentVersion: '1.0',
    source: 'test-array-formatting'
  }
  
  try {
    console.log('📤 Sending test data to create-lead-complete endpoint...')
    
    const response = await fetch('http://localhost:3001/api/ghl/create-lead-complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    })
    
    const result = await response.json()
    
    if (result.success) {
      console.log('\n✅ Contact created successfully!')
      console.log(`📋 Contact ID: ${result.ghlContactId}`)
      console.log(`🔗 View in GHL: https://app.gohighlevel.com/v2/location/${GHL_LOCATION_ID}/contacts/detail/${result.ghlContactId}`)
      console.log(`📊 Fields mapped: ${result.customFieldsUsed}`)
      console.log(`🏷️  Tags used: ${result.tagsUsed}`)
      
      console.log('\n🔍 Key array fields to verify:')
      console.log('1. Content Goals - Should show: "Email Newsletters, Blog Posts, Social Media Content, Video Scripts, Sales Materials"')
      console.log('2. Integration Preferences - Should show: "GoHighLevel, Mailchimp, HubSpot, Zapier"')
      console.log('3. Current Tools - Should show: "HubSpot, Salesforce, Mailchimp, Hootsuite, Buffer"')
      console.log('4. Lead Sources - Should show: "Website, Social Media, Referrals, Paid Ads"')
      console.log('5. Current Systems - Should show: "CRM, Email Marketing, Social Media Management, Analytics"')
      
      console.log('\n⚠️  IMPORTANT: Check these fields in GoHighLevel:')
      console.log('- NO brackets [ ] should appear')
      console.log('- NO quotes around individual items')
      console.log('- Clean comma-separated values only')
      
    } else {
      console.error('\n❌ Failed to create contact:', result.message)
      if (result.error) {
        console.error('Error details:', result.error)
      }
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : error)
  }
}

// Run the test
createTestContact().catch(console.error)