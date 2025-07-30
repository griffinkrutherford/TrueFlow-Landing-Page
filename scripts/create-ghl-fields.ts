#!/usr/bin/env node

/**
 * Script to create missing custom fields in GoHighLevel
 * Run this script to ensure all required fields exist in your GHL location
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { TRUEFLOW_CUSTOM_FIELDS } from '../lib/ghl/field-definitions'

const GHL_API_BASE = 'https://services.leadconnectorhq.com'
const GHL_API_VERSION = '2021-07-28'

// Check environment variables
const ACCESS_TOKEN = process.env.GHL_ACCESS_TOKEN
const LOCATION_ID = process.env.GHL_LOCATION_ID

if (!ACCESS_TOKEN || !LOCATION_ID) {
  console.error('❌ Missing required environment variables:')
  console.error('   GHL_ACCESS_TOKEN:', ACCESS_TOKEN ? '✓' : '✗')
  console.error('   GHL_LOCATION_ID:', LOCATION_ID ? '✓' : '✗')
  process.exit(1)
}

interface GHLField {
  id: string
  name: string
  fieldKey?: string
  dataType: string
}

/**
 * Fetch existing custom fields from GHL
 */
async function fetchExistingFields(): Promise<GHLField[]> {
  try {
    console.log('📋 Fetching existing custom fields...')
    
    const response = await fetch(
      `${GHL_API_BASE}/locations/${LOCATION_ID}/customFields?model=contact`,
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Version': GHL_API_VERSION,
          'Accept': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch fields: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const fields = data.customFields || []
    
    console.log(`✓ Found ${fields.length} existing custom fields`)
    return fields
  } catch (error) {
    console.error('❌ Error fetching fields:', error)
    return []
  }
}

/**
 * Create a custom field in GHL
 */
async function createCustomField(fieldDef: typeof TRUEFLOW_CUSTOM_FIELDS[0]): Promise<boolean> {
  try {
    console.log(`  Creating field: ${fieldDef.name}...`)
    
    const payload: any = {
      locationId: LOCATION_ID,
      name: fieldDef.name,
      dataType: fieldDef.dataType,
      fieldKey: `contact.${fieldDef.fieldKey}`,
      model: 'contact',
      showInForms: true
    }
    
    // Add options for select fields
    if (fieldDef.options && (fieldDef.dataType === 'SINGLE_OPTIONS' || fieldDef.dataType === 'MULTIPLE_OPTIONS')) {
      payload.options = fieldDef.options.map((option, index) => ({
        key: `option_${index}`,
        label: option
      }))
    }
    
    // Add description if provided
    if (fieldDef.description) {
      payload.description = fieldDef.description
    }
    
    // Add placeholder if provided
    if (fieldDef.placeholder) {
      payload.placeholder = fieldDef.placeholder
    }
    
    const response = await fetch(`${GHL_API_BASE}/custom-fields/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Version': GHL_API_VERSION,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`  ❌ Failed to create field: ${response.status}`)
      console.error(`     Error: ${errorText}`)
      return false
    }
    
    const result = await response.json()
    console.log(`  ✓ Created field: ${fieldDef.name} (ID: ${result.field?.id})`)
    return true
  } catch (error) {
    console.error(`  ❌ Error creating field ${fieldDef.name}:`, error)
    return false
  }
}

/**
 * Main function to sync fields
 */
async function syncCustomFields() {
  console.log('🚀 TrueFlow GHL Custom Fields Sync')
  console.log('==================================')
  console.log(`Location ID: ${LOCATION_ID}`)
  console.log('')
  
  // Fetch existing fields
  const existingFields = await fetchExistingFields()
  
  // Create a map of existing fields by name and fieldKey
  const existingFieldMap = new Map<string, GHLField>()
  existingFields.forEach(field => {
    existingFieldMap.set(field.name.toLowerCase(), field)
    if (field.fieldKey) {
      existingFieldMap.set(field.fieldKey.toLowerCase(), field)
    }
  })
  
  // Check which fields need to be created
  const fieldsToCreate = TRUEFLOW_CUSTOM_FIELDS.filter(fieldDef => {
    const exists = existingFieldMap.has(fieldDef.name.toLowerCase()) || 
                   existingFieldMap.has(`contact.${fieldDef.fieldKey}`.toLowerCase())
    
    if (exists) {
      const existing = existingFieldMap.get(fieldDef.name.toLowerCase()) || 
                      existingFieldMap.get(`contact.${fieldDef.fieldKey}`.toLowerCase())
      console.log(`✓ Field exists: ${fieldDef.name} (ID: ${existing?.id})`)
    }
    
    return !exists
  })
  
  if (fieldsToCreate.length === 0) {
    console.log('\n✅ All required fields already exist!')
    return
  }
  
  console.log(`\n📝 Need to create ${fieldsToCreate.length} fields:`)
  fieldsToCreate.forEach(field => {
    console.log(`   - ${field.name} (${field.fieldKey})`)
  })
  
  console.log('\n🔨 Creating missing fields...')
  
  let successCount = 0
  for (const fieldDef of fieldsToCreate) {
    const success = await createCustomField(fieldDef)
    if (success) successCount++
    
    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  console.log('\n📊 Summary:')
  console.log(`   Total fields required: ${TRUEFLOW_CUSTOM_FIELDS.length}`)
  console.log(`   Already existed: ${TRUEFLOW_CUSTOM_FIELDS.length - fieldsToCreate.length}`)
  console.log(`   Created successfully: ${successCount}`)
  console.log(`   Failed to create: ${fieldsToCreate.length - successCount}`)
  
  if (successCount === fieldsToCreate.length) {
    console.log('\n✅ All fields synced successfully!')
  } else {
    console.log('\n⚠️  Some fields failed to create. Please check the errors above.')
  }
}

// Run the sync
syncCustomFields().catch(console.error)