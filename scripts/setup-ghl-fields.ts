#!/usr/bin/env node

/**
 * Setup script to create all required custom fields in GoHighLevel
 * Run this once to ensure all fields exist before using the API
 * 
 * Usage: npx ts-node scripts/setup-ghl-fields.ts
 */

import { TRUEFLOW_CUSTOM_FIELDS, CustomFieldDefinition } from '../lib/ghl/field-definitions'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const GHL_API_BASE = 'https://services.leadconnectorhq.com'
const GHL_API_VERSION = '2021-07-28'

interface ExistingField {
  id: string
  name: string
  fieldKey?: string
  dataType: string
}

/**
 * Fetch existing custom fields from GHL
 */
async function fetchExistingFields(): Promise<ExistingField[]> {
  const accessToken = process.env.GHL_ACCESS_TOKEN
  const locationId = process.env.GHL_LOCATION_ID
  
  if (!accessToken || !locationId) {
    throw new Error('Missing GHL_ACCESS_TOKEN or GHL_LOCATION_ID in environment variables')
  }
  
  console.log('Fetching existing custom fields...')
  
  const response = await fetch(
    `${GHL_API_BASE}/locations/${locationId}/customFields?model=contact`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Version': GHL_API_VERSION,
        'Accept': 'application/json'
      }
    }
  )
  
  if (!response.ok) {
    throw new Error(`Failed to fetch fields: ${response.status} ${response.statusText}`)
  }
  
  const data = await response.json()
  return data.customFields || []
}

/**
 * Create a custom field in GHL
 */
async function createCustomField(field: CustomFieldDefinition): Promise<void> {
  const accessToken = process.env.GHL_ACCESS_TOKEN
  const locationId = process.env.GHL_LOCATION_ID
  
  if (!accessToken || !locationId) {
    throw new Error('Missing GHL_ACCESS_TOKEN or GHL_LOCATION_ID in environment variables')
  }
  
  console.log(`Creating field: ${field.name}...`)
  
  const payload = {
    name: field.name,
    dataType: field.dataType,
    fieldKey: field.fieldKey,
    placeholder: field.placeholder,
    position: field.position,
    model: 'contact',
    ...(field.options && field.dataType.includes('OPTIONS') ? {
      options: field.options
    } : {})
  }
  
  const response = await fetch(
    `${GHL_API_BASE}/locations/${locationId}/customFields`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Version': GHL_API_VERSION,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    }
  )
  
  if (!response.ok) {
    const errorData = await response.text()
    console.error(`Failed to create field ${field.name}:`, errorData)
    throw new Error(`Failed to create field ${field.name}: ${response.status}`)
  }
  
  console.log(`✅ Created field: ${field.name}`)
}

/**
 * Main setup function
 */
async function setupCustomFields() {
  try {
    console.log('🚀 Starting GHL custom fields setup...\n')
    
    // Check environment variables
    if (!process.env.GHL_ACCESS_TOKEN || !process.env.GHL_LOCATION_ID) {
      console.error('❌ Error: Missing required environment variables')
      console.error('Please ensure GHL_ACCESS_TOKEN and GHL_LOCATION_ID are set in .env.local')
      process.exit(1)
    }
    
    // Fetch existing fields
    const existingFields = await fetchExistingFields()
    console.log(`Found ${existingFields.length} existing custom fields\n`)
    
    // Create a map of existing fields by fieldKey and name
    const existingFieldMap = new Map<string, ExistingField>()
    existingFields.forEach(field => {
      if (field.fieldKey) {
        existingFieldMap.set(field.fieldKey, field)
      }
      existingFieldMap.set(field.name.toLowerCase(), field)
    })
    
    // Process each field definition
    let created = 0
    let skipped = 0
    let failed = 0
    
    for (const fieldDef of TRUEFLOW_CUSTOM_FIELDS) {
      // Check if field already exists
      const exists = existingFieldMap.has(fieldDef.fieldKey) || 
                     existingFieldMap.has(fieldDef.name.toLowerCase())
      
      if (exists) {
        console.log(`⏭️  Skipping existing field: ${fieldDef.name}`)
        skipped++
        continue
      }
      
      // Create the field
      try {
        await createCustomField(fieldDef)
        created++
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error) {
        console.error(`❌ Failed to create field: ${fieldDef.name}`)
        failed++
      }
    }
    
    // Summary
    console.log('\n📊 Setup Summary:')
    console.log(`✅ Created: ${created} fields`)
    console.log(`⏭️  Skipped: ${skipped} fields (already exist)`)
    if (failed > 0) {
      console.log(`❌ Failed: ${failed} fields`)
    }
    
    console.log('\n✨ Setup complete!')
    
    if (created > 0) {
      console.log('\n💡 Next steps:')
      console.log('1. Test the form submission with: npm run test:ghl')
      console.log('2. Check the GHL dashboard to verify fields were created')
    }
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error)
    process.exit(1)
  }
}

// Run the setup
setupCustomFields()