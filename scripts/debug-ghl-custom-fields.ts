#!/usr/bin/env npx tsx

/**
 * Debug script to test GHL custom fields format
 * This will help us understand exactly what format GHL expects
 */

import { config } from 'dotenv'
import { fetchGHLCustomFields } from '../lib/ghl/custom-fields-v3'

// Load environment variables
config({ path: '.env.local' })

const GHL_API_BASE = 'https://services.leadconnectorhq.com'
const GHL_API_VERSION = '2021-07-28'

interface TestContact {
  firstName: string
  lastName: string
  email: string
  businessName: string
  customFields: Array<{
    key?: string
    id?: string
    field_value?: string
    value?: string
  }>
}

async function testCustomFieldsFormat() {
  console.log('🔍 Testing GHL Custom Fields Format...')
  console.log('=====================================')
  
  if (!process.env.GHL_ACCESS_TOKEN || !process.env.GHL_LOCATION_ID) {
    console.error('❌ Missing GHL_ACCESS_TOKEN or GHL_LOCATION_ID')
    process.exit(1)
  }
  
  // First, fetch all custom fields to see what exists
  console.log('\n1. Fetching existing custom fields from GHL...')
  try {
    const ghlFields = await fetchGHLCustomFields(
      process.env.GHL_ACCESS_TOKEN,
      process.env.GHL_LOCATION_ID
    )
    
    console.log(`Found ${ghlFields.length} custom fields:`)
    ghlFields.forEach(field => {
      console.log(`  - ${field.name}`)
      console.log(`    ID: ${field.id}`)
      console.log(`    Key: ${field.fieldKey || 'N/A'}`)
      console.log(`    Type: ${field.dataType || 'N/A'}`)
      console.log('')
    })
    
    if (ghlFields.length === 0) {
      console.log('❌ No custom fields found. Creating some test fields first...')
      return
    }
    
    // Find a simple text field to test with
    const testField = ghlFields.find(f => 
      f.dataType === 'TEXT' || 
      f.name.toLowerCase().includes('business') ||
      f.name.toLowerCase().includes('name')
    ) || ghlFields[0]
    
    console.log(`\n2. Testing with field: ${testField.name}`)
    console.log(`   ID: ${testField.id}`)
    console.log(`   Key: ${testField.fieldKey}`)
    
    // Test different payload formats
    const testFormats = [
      // Format 1: Using field key
      {
        name: 'Format 1: Using field key',
        payload: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test.custom.fields@example.com',
          locationId: process.env.GHL_LOCATION_ID,
          customFields: [
            {
              key: testField.fieldKey?.replace(/^contact\./, '') || testField.id,
              field_value: 'Test Value - Format 1'
            }
          ]
        }
      },
      // Format 2: Using field ID
      {
        name: 'Format 2: Using field ID',
        payload: {
          firstName: 'Test',
          lastName: 'User2',
          email: 'test.custom.fields2@example.com',
          locationId: process.env.GHL_LOCATION_ID,
          customFields: [
            {
              id: testField.id,
              value: 'Test Value - Format 2'
            }
          ]
        }
      },
      // Format 3: Using both key and field_value
      {
        name: 'Format 3: Using key with field_value',
        payload: {
          firstName: 'Test',
          lastName: 'User3',
          email: 'test.custom.fields3@example.com',
          locationId: process.env.GHL_LOCATION_ID,
          customFields: [
            {
              key: testField.fieldKey,
              field_value: 'Test Value - Format 3'
            }
          ]
        }
      }
    ]
    
    // Test each format
    for (const format of testFormats) {
      console.log(`\n3. Testing ${format.name}...`)
      console.log('Payload:', JSON.stringify(format.payload, null, 2))
      
      try {
        const response = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Version': GHL_API_VERSION
          },
          body: JSON.stringify(format.payload)
        })
        
        const responseText = await response.text()
        console.log(`Response Status: ${response.status}`)
        console.log(`Response Headers:`, Object.fromEntries(response.headers.entries()))
        
        if (response.ok) {
          const result = JSON.parse(responseText)
          console.log('✅ Success!')
          console.log('Response:', JSON.stringify(result, null, 2))
          
          // Try to retrieve the contact to see if custom fields were saved
          const contactId = result.contact?.id || result.id
          if (contactId) {
            console.log(`\n4. Retrieving contact ${contactId} to verify custom fields...`)
            const getResponse = await fetch(`${GHL_API_BASE}/contacts/${contactId}`, {
              headers: {
                'Authorization': `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
                'Accept': 'application/json',
                'Version': GHL_API_VERSION
              }
            })
            
            if (getResponse.ok) {
              const contactData = await getResponse.json()
              console.log('Retrieved contact data:')
              console.log('Custom Fields:', JSON.stringify(contactData.contact?.customFields || contactData.customFields, null, 2))
            } else {
              console.log('Failed to retrieve contact:', await getResponse.text())
            }
          }
          
        } else {
          console.log('❌ Failed!')
          console.log('Error:', responseText)
        }
        
        console.log('\n' + '='.repeat(50))
        
      } catch (error) {
        console.error(`❌ Error testing ${format.name}:`, error)
      }
    }
    
  } catch (error) {
    console.error('❌ Error fetching custom fields:', error)
  }
}

// Run the test
testCustomFieldsFormat().catch(console.error)