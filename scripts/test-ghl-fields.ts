/**
 * Test script to verify GHL field mapping
 * Run with: npx tsx scripts/test-ghl-fields.ts
 */

import { config } from 'dotenv'
import { fetchGHLCustomFields, buildCustomFieldsPayloadV3 } from '../lib/ghl/custom-fields-v3'

// Load environment variables
config({ path: '.env.local' })

async function testFieldMapping() {
  console.log('=== Testing GHL Field Mapping ===\n')
  
  // Check if GHL is configured
  const accessToken = process.env.GHL_ACCESS_TOKEN
  const locationId = process.env.GHL_LOCATION_ID
  
  if (!accessToken || !locationId || accessToken.includes('your_') || locationId.includes('your_')) {
    console.error('❌ GHL not properly configured in .env.local')
    console.log('Please set GHL_ACCESS_TOKEN and GHL_LOCATION_ID')
    return
  }
  
  console.log('✅ GHL configuration found')
  console.log(`Location ID: ${locationId.substring(0, 8)}...`)
  console.log('')
  
  // Fetch actual fields from GHL
  console.log('Fetching custom fields from GoHighLevel...')
  const fields = await fetchGHLCustomFields(accessToken, locationId)
  
  if (fields.length === 0) {
    console.error('❌ No custom fields found in GHL')
    return
  }
  
  console.log(`\n✅ Found ${fields.length} custom fields:\n`)
  fields.forEach(field => {
    console.log(`  📋 "${field.name}"`)
    console.log(`     ID: ${field.id}`)
    console.log(`     Type: ${field.dataType}`)
    console.log('')
  })
  
  // Test with sample form data
  console.log('=== Testing Field Mapping ===\n')
  
  const sampleFormData = {
    // Contact info
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    businessName: 'Acme Corp',
    
    // Get Started form fields
    businessType: 'agency',
    contentGoals: ['newsletters', 'blogs', 'social'],
    integrations: ['gohighlevel', 'mailchimp'],
    selectedPlan: 'complete-system',
    
    // Assessment answers
    answers: {
      'current-content': 'manual',
      'content-volume': 'moderate',
      'crm-usage': 'basic-crm',
      'lead-response': 'hours',
      'time-spent': 'high',
      'budget': 'moderate'
    },
    
    // Scores
    scorePercentage: 65,
    readinessLevel: 'Ready',
    leadScore: 75,
    leadQuality: 'hot'
  }
  
  console.log('Testing with sample data:')
  console.log(JSON.stringify(sampleFormData, null, 2))
  console.log('')
  
  // Build custom fields payload
  const customFields = buildCustomFieldsPayloadV3(sampleFormData, fields)
  
  console.log(`\n✅ Generated ${customFields.length} field mappings:\n`)
  customFields.forEach(cf => {
    const field = fields.find(f => f.id === cf.id)
    console.log(`  📝 ${field?.name || 'Unknown Field'}`)
    console.log(`     Value: ${cf.value}`)
    console.log('')
  })
  
  // Check for missing expected fields
  console.log('=== Checking for Expected Fields ===\n')
  const expectedFields = [
    'Business Name',
    'What type of business do you run?',
    'What are your goals?',
    'What systems do you already have in place?',
    'Lead Score',
    'Lead Quality'
  ]
  
  expectedFields.forEach(fieldName => {
    const found = fields.some(f => f.name.toLowerCase() === fieldName.toLowerCase())
    if (found) {
      console.log(`✅ Found: "${fieldName}"`)
    } else {
      console.log(`❌ Missing: "${fieldName}"`)
    }
  })
  
  console.log('\n=== Test Complete ===')
}

// Run the test
testFieldMapping().catch(console.error)