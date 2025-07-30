#!/usr/bin/env node

/**
 * Test script to verify all fields are mapped in GoHighLevel, even when empty
 * This ensures consistent field structure across all contacts
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

async function createContactWithAllFields() {
  console.log('🧪 Testing complete field mapping with empty values...\n')
  
  // Test data with mix of filled and empty fields
  const testData = {
    // Required fields
    firstName: 'Complete',
    lastName: 'Field Structure',
    email: `complete.fields.${Date.now()}@example.com`,
    phone: '+15555550456', // This one has a value
    
    // Some fields with values
    businessName: 'Complete Field Test Company',
    businessType: 'Coach/Consultant',
    contentGoals: ['Email Newsletters', 'Blog Posts', 'Social Media Content'],
    integrations: ['GoHighLevel', 'Mailchimp'],
    
    // These fields are intentionally empty/missing
    monthlyLeads: '', // Empty string
    teamSize: '', // Empty string
    currentTools: [], // Empty array
    biggestChallenge: '', // Empty string
    businessGoals: '', // Empty string
    selectedPlan: '', // Empty string
    additionalNotes: '', // Empty string
    hearAboutUs: '', // Empty string
    urgencyLevel: '', // Empty string
    leadSources: [], // Empty array
    currentSystems: [], // Empty array
    revenueRange: '', // Empty string
    
    // Partial assessment data
    answers: {
      'current-content': 'manual',
      'content-volume': 'moderate',
      // Other assessment answers missing
    },
    
    // Some scoring data
    leadScore: 70,
    leadQuality: 'warm',
    
    source: 'test-all-fields-structure'
  }
  
  try {
    console.log('📤 Sending test data to create-lead-complete endpoint...')
    console.log('\n📊 Expected behavior:')
    console.log('  - Should map 17-18 fields total')
    console.log('  - Fields WITH values should show their data')
    console.log('  - Fields WITHOUT values should still be mapped (empty string)')
    console.log('  - In GHL, with "Hide empty fields" checked, empty fields won\'t show')
    console.log('  - In GHL, with "Hide empty fields" unchecked, all fields visible\n')
    
    const response = await fetch('http://localhost:3001/api/ghl/create-lead-complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    })
    
    const result = await response.json()
    
    if (result.success) {
      console.log('✅ Contact created successfully!')
      console.log(`📋 Contact ID: ${result.ghlContactId}`)
      console.log(`🔗 View in GHL: https://app.gohighlevel.com/v2/location/${GHL_LOCATION_ID}/contacts/detail/${result.ghlContactId}`)
      console.log(`📊 Fields mapped: ${result.customFieldsUsed}`)
      console.log(`🏷️  Tags used: ${result.tagsUsed}`)
      
      console.log('\n🔍 Fields with values:')
      console.log('  ✅ Business Name: "Complete Field Test Company"')
      console.log('  ✅ Business Type: "Coach/Consultant"')
      console.log('  ✅ Content Goals: "Email Newsletters, Blog Posts, Social Media Content"')
      console.log('  ✅ Integration Preferences: "GoHighLevel, Mailchimp"')
      console.log('  ✅ Phone: "+15555550456"')
      console.log('  ✅ Lead Score: "70"')
      console.log('  ✅ Lead Quality: "warm"')
      
      console.log('\n📋 Fields that should be mapped but empty:')
      console.log('  ⚪ Monthly Leads (empty)')
      console.log('  ⚪ Team Size (empty)')
      console.log('  ⚪ Current Tools (empty)')
      console.log('  ⚪ Biggest Challenge (empty)')
      console.log('  ⚪ Business Goals (empty)')
      console.log('  ⚪ Selected Plan (empty)')
      console.log('  ⚪ And more...')
      
      console.log('\n✅ IMPORTANT: Check in GoHighLevel:')
      console.log('1. Toggle "Hide empty fields" ON/OFF to see all fields')
      console.log('2. With it ON: Only fields with values visible')
      console.log('3. With it OFF: All 17-18 fields should be present')
      console.log(`4. Expected total fields: ${result.customFieldsUsed} (should be 17-18)`)
      
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
createContactWithAllFields().catch(console.error)