#!/usr/bin/env node

/**
 * Test script to verify empty fields are omitted in GoHighLevel integration
 * This creates a contact with minimal data to ensure only filled fields appear
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

async function createMinimalContact() {
  console.log('🧪 Testing empty field omission for GoHighLevel...\n')
  
  // Minimal test data - only required fields and a few optional ones
  const testData = {
    // Required fields
    firstName: 'Minimal',
    lastName: 'Fields Test',
    email: `minimal.fields.${Date.now()}@example.com`,
    
    // Only include a few fields with actual values
    businessName: 'Minimal Fields Test Co',
    businessType: 'Agency',
    
    // These arrays have values
    contentGoals: ['Email Newsletters', 'Blog Posts'],
    integrations: ['GoHighLevel', 'Zapier'],
    
    // These fields are intentionally empty or missing
    phone: '', // Empty string
    currentTools: [], // Empty array
    leadSources: [], // Empty array
    currentSystems: [], // Empty array
    monthlyLeads: '', // Empty string
    teamSize: '', // Empty string
    biggestChallenge: '', // Empty string
    businessGoals: '', // Empty string
    selectedPlan: '', // Empty string
    additionalNotes: '', // Empty string
    hearAboutUs: '', // Empty string
    urgencyLevel: '', // Empty string
    
    // No assessment data
    // No scores
    // No recommendations
    
    source: 'test-empty-fields'
  }
  
  try {
    console.log('📤 Sending minimal test data to create-lead-complete endpoint...')
    console.log('📝 Fields with values:')
    console.log('  - firstName: Minimal')
    console.log('  - lastName: Fields Test')
    console.log('  - email: minimal.fields.*@example.com')
    console.log('  - businessName: Minimal Fields Test Co')
    console.log('  - businessType: Agency')
    console.log('  - contentGoals: [2 items]')
    console.log('  - integrations: [2 items]')
    console.log('\n❌ Fields that should NOT appear (empty/missing):')
    console.log('  - phone, currentTools, leadSources, currentSystems')
    console.log('  - monthlyLeads, teamSize, biggestChallenge, businessGoals')
    console.log('  - selectedPlan, additionalNotes, hearAboutUs, urgencyLevel')
    console.log('  - All assessment fields')
    console.log('  - All scoring fields\n')
    
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
      
      console.log('\n🔍 IMPORTANT: Verify in GoHighLevel:')
      console.log('1. ✅ Only fields with actual values should appear')
      console.log('2. ❌ NO empty fields should be visible')
      console.log('3. ✅ Content Goals should show: "Email Newsletters, Blog Posts"')
      console.log('4. ✅ Integration Preferences should show: "GoHighLevel, Zapier"')
      console.log('5. ❌ Fields like Team Size, Monthly Leads should NOT appear at all')
      console.log('\n📌 Expected field count: ~7-9 fields (not 17-18)')
      
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
createMinimalContact().catch(console.error)