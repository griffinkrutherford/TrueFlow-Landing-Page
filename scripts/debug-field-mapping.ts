#!/usr/bin/env node

/**
 * Script to debug field mapping issues
 * This will show you exactly what fields GHL has and how they map to our form data
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { fetchGHLCustomFields } from '../lib/ghl/custom-fields-v3'
import { buildCustomFieldsPayloadV3 } from '../lib/ghl/field-mapping-v3'
import { TRUEFLOW_CUSTOM_FIELDS, FIELD_MAPPINGS } from '../lib/ghl/field-definitions'

// Check environment variables
const ACCESS_TOKEN = process.env.GHL_ACCESS_TOKEN
const LOCATION_ID = process.env.GHL_LOCATION_ID

if (!ACCESS_TOKEN || !LOCATION_ID) {
  console.error('❌ Missing required environment variables:')
  console.error('   GHL_ACCESS_TOKEN:', ACCESS_TOKEN ? '✓' : '✗')
  console.error('   GHL_LOCATION_ID:', LOCATION_ID ? '✓' : '✗')
  process.exit(1)
}

// Sample form data to test with
const sampleGetStartedData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  businessName: 'Test Business Inc',
  businessType: 'agency',
  contentGoals: ['newsletters', 'blogs', 'social'],
  integrations: ['gohighlevel', 'mailchimp'],
  selectedPlan: 'content-engine',
  monthlyLeads: '100-500',
  teamSize: '5-10',
  currentTools: 'HubSpot, Mailchimp, WordPress',
  biggestChallenge: 'Spending too much time on content creation and not enough on strategy'
}

async function debugFieldMapping() {
  console.log('🔍 TrueFlow Field Mapping Debugger')
  console.log('==================================\n')
  
  // Fetch GHL fields
  console.log('1️⃣  Fetching GHL custom fields...')
  const ghlFields = await fetchGHLCustomFields(ACCESS_TOKEN!, LOCATION_ID!)
  
  console.log(`\n✓ Found ${ghlFields.length} custom fields in GHL:\n`)
  
  // Group fields by presence of fieldKey
  const fieldsWithKey = ghlFields.filter(f => f.fieldKey)
  const fieldsWithoutKey = ghlFields.filter(f => !f.fieldKey)
  
  console.log('Fields WITH fieldKey:')
  fieldsWithKey.forEach(field => {
    console.log(`  - ${field.name}`)
    console.log(`    Key: ${field.fieldKey}`)
    console.log(`    ID: ${field.id}`)
    console.log(`    Type: ${field.dataType}`)
  })
  
  if (fieldsWithoutKey.length > 0) {
    console.log('\nFields WITHOUT fieldKey:')
    fieldsWithoutKey.forEach(field => {
      console.log(`  - ${field.name}`)
      console.log(`    ID: ${field.id}`)
      console.log(`    Type: ${field.dataType}`)
    })
  }
  
  // Check for expected fields
  console.log('\n2️⃣  Checking for expected TrueFlow fields...\n')
  
  const missingFields: string[] = []
  const foundFields: string[] = []
  
  TRUEFLOW_CUSTOM_FIELDS.forEach(expectedField => {
    const found = ghlFields.find(ghlField => 
      ghlField.fieldKey === expectedField.fieldKey ||
      ghlField.fieldKey === `contact.${expectedField.fieldKey}` ||
      ghlField.name === expectedField.name ||
      ghlField.name.toLowerCase() === expectedField.name.toLowerCase()
    )
    
    if (found) {
      foundFields.push(`✓ ${expectedField.name} → ${found.name} (${found.id})`)
    } else {
      missingFields.push(`✗ ${expectedField.name} (${expectedField.fieldKey})`)
    }
  })
  
  console.log('Found fields:')
  foundFields.forEach(f => console.log(`  ${f}`))
  
  if (missingFields.length > 0) {
    console.log('\nMissing fields:')
    missingFields.forEach(f => console.log(`  ${f}`))
  }
  
  // Test field mapping
  console.log('\n3️⃣  Testing field mapping with sample data...\n')
  
  const mappedFields = buildCustomFieldsPayloadV3(sampleGetStartedData, ghlFields, 'get-started')
  
  console.log(`\nMapped ${mappedFields.length} fields:`)
  mappedFields.forEach(field => {
    const ghlField = ghlFields.find(f => f.fieldKey === field.key || f.id === field.key)
    console.log(`  - ${ghlField?.name || 'Unknown'}: "${field.field_value.substring(0, 50)}${field.field_value.length > 50 ? '...' : ''}"`)
  })
  
  // Show unmapped data
  console.log('\n4️⃣  Checking for unmapped form data...\n')
  
  const formDataKeys = Object.keys(sampleGetStartedData).filter(key => 
    !['firstName', 'lastName', 'email', 'phone'].includes(key)
  )
  
  const mappedDataKeys = new Set<string>()
  
  // Try to reverse engineer which form fields were mapped
  Object.entries(FIELD_MAPPINGS).forEach(([formKey, fieldKey]) => {
    if (mappedFields.some(mf => {
      const ghlField = ghlFields.find(f => f.fieldKey === mf.key || f.id === mf.key)
      return ghlField?.fieldKey === fieldKey || 
             ghlField?.fieldKey === `contact.${fieldKey}` ||
             ghlField?.name.toLowerCase().includes(fieldKey.replace(/_/g, ' '))
    })) {
      mappedDataKeys.add(formKey)
    }
  })
  
  const unmappedKeys = formDataKeys.filter(key => !mappedDataKeys.has(key))
  
  if (unmappedKeys.length > 0) {
    console.log('Unmapped form data:')
    unmappedKeys.forEach(key => {
      console.log(`  - ${key}: ${JSON.stringify(sampleGetStartedData[key as keyof typeof sampleGetStartedData])}`)
    })
  } else {
    console.log('✓ All form data was mapped!')
  }
  
  // Recommendations
  console.log('\n5️⃣  Recommendations:\n')
  
  if (missingFields.length > 0) {
    console.log('⚠️  Missing fields need to be created in GHL:')
    console.log('   Run: npm run sync-ghl-fields')
  }
  
  if (mappedFields.length < 5) {
    console.log('⚠️  Very few fields were mapped. Check that:')
    console.log('   - Custom fields exist in GHL')
    console.log('   - Field names/keys match between our definitions and GHL')
    console.log('   - The form is sending data with the expected keys')
  }
  
  console.log('\n✅ Debug complete!')
}

// Run the debug
debugFieldMapping().catch(console.error)