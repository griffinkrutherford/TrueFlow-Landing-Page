#!/usr/bin/env npx tsx

/**
 * Test the working solution with actual TrueFlow data
 */

import { config } from 'dotenv'
import { fetchGHLCustomFields } from '../lib/ghl/custom-fields-v3'

// Load environment variables
config({ path: '.env.local' })

const GHL_API_BASE = 'https://services.leadconnectorhq.com'
const GHL_API_VERSION = '2021-07-28'

async function testWorkingSolution() {
  console.log('🧪 Testing Working Solution for TrueFlow Custom Fields')
  console.log('===================================================')
  
  if (!process.env.GHL_ACCESS_TOKEN || !process.env.GHL_LOCATION_ID) {
    console.error('❌ Missing GHL_ACCESS_TOKEN or GHL_LOCATION_ID')
    process.exit(1)
  }
  
  // Fetch GHL fields
  const ghlFields = await fetchGHLCustomFields(
    process.env.GHL_ACCESS_TOKEN,
    process.env.GHL_LOCATION_ID
  )
  
  // Find our TrueFlow fields
  const businessNameField = ghlFields.find(f => f.fieldKey === 'contact.trueflow_business_name')
  const leadScoreField = ghlFields.find(f => f.fieldKey === 'contact.trueflow_lead_score')
  const businessTypeField = ghlFields.find(f => f.fieldKey === 'contact.trueflow_business_type')
  const formTypeField = ghlFields.find(f => f.fieldKey === 'contact.form_type')
  
  if (!businessNameField || !leadScoreField) {
    console.error('❌ Required TrueFlow fields not found')
    console.log('Available TrueFlow fields:')
    ghlFields
      .filter(f => f.fieldKey?.includes('trueflow_') || f.name?.toLowerCase().includes('trueflow'))
      .forEach(f => console.log(`  - ${f.name} (${f.fieldKey})`))
    return
  }
  
  console.log('✅ Found required TrueFlow fields')
  console.log(`  - Business Name: ${businessNameField.name} (${businessNameField.fieldKey})`)
  console.log(`  - Lead Score: ${leadScoreField.name} (${leadScoreField.fieldKey})`)
  
  // Test with realistic data (mimicking Michael Chen)
  const testPayload = {
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen.test@techcorp.com',
    locationId: process.env.GHL_LOCATION_ID,
    tags: ['web-lead', 'lead-quality-high', 'get-started-form'],
    customFields: [
      {
        key: 'trueflow_business_name', // WITHOUT contact. prefix
        field_value: 'Tech Solutions Corp'
      },
      {
        key: 'trueflow_lead_score', // WITHOUT contact. prefix
        field_value: '85'
      },
      {
        key: 'trueflow_business_type', // WITHOUT contact. prefix  
        field_value: 'Technology'
      },
      {
        key: 'form_type', // WITHOUT contact. prefix
        field_value: 'get-started'
      },
      {
        key: 'trueflow_submission_date', // WITHOUT contact. prefix
        field_value: new Date().toISOString()
      }
    ]
  }
  
  console.log('\n🚀 Creating test contact with corrected format...')
  console.log('Payload:', JSON.stringify(testPayload, null, 2))
  
  try {
    const response = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Version': GHL_API_VERSION
      },
      body: JSON.stringify(testPayload)
    })
    
    const responseText = await response.text()
    console.log(`\nResponse Status: ${response.status}`)
    
    if (response.ok) {
      const result = JSON.parse(responseText)
      console.log('✅ SUCCESS! Contact created/updated')
      console.log('Response:', JSON.stringify(result, null, 2))
      
      const contactId = result.contact?.id || result.id
      if (contactId) {
        console.log(`\n🔍 Retrieving contact ${contactId} to verify custom fields...`)
        
        // Wait a moment for the data to be processed
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const getResponse = await fetch(`${GHL_API_BASE}/contacts/${contactId}`, {
          headers: {
            'Authorization': `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
            'Accept': 'application/json',
            'Version': GHL_API_VERSION
          }
        })
        
        if (getResponse.ok) {
          const contactData = await getResponse.json()
          const customFields = contactData.contact?.customFields || contactData.customFields || []
          
          console.log('\n🎉 VERIFICATION RESULTS:')
          console.log(`Found ${customFields.length} custom fields:`)
          
          if (customFields.length > 0) {
            customFields.forEach(cf => {
              const field = ghlFields.find(f => f.id === cf.id)
              const fieldName = field?.name || 'Unknown'
              console.log(`  ✅ ${fieldName}: "${cf.value || cf.fieldValue}"`)
            })
            
            console.log('\n🎯 SOLUTION CONFIRMED: Custom fields are now appearing in GHL!')
            console.log('The issue was using the wrong key format.')
            console.log('✅ Correct format: key without "contact." prefix + field_value')
            console.log('❌ Wrong format: key with "contact." prefix + field_value')
            
          } else {
            console.log('❌ No custom fields found - still an issue')
          }
        } else {
          console.log('❌ Failed to retrieve contact:', await getResponse.text())
        }
      }
      
    } else {
      console.log('❌ FAILED!')
      console.log('Error:', responseText)
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// Run the test
testWorkingSolution().catch(console.error)