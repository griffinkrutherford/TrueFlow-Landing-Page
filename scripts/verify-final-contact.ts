#!/usr/bin/env npx tsx

/**
 * Verify the final contact shows custom fields in GHL
 */

import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const GHL_API_BASE = 'https://services.leadconnectorhq.com'
const GHL_API_VERSION = '2021-07-28'

async function verifyFinalContact() {
  console.log('🔍 Verifying Final Contact in GoHighLevel')
  console.log('========================================')
  
  const contactId = 'fsjIEVYr8owHloi9VMP1' // From the previous test
  
  console.log(`Retrieving contact: ${contactId}`)
  
  try {
    const response = await fetch(`${GHL_API_BASE}/contacts/${contactId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
        'Accept': 'application/json',
        'Version': GHL_API_VERSION
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      const contact = data.contact
      const customFields = contact.customFields || []
      
      console.log('\n📋 CONTACT SUMMARY:')
      console.log(`Name: ${contact.firstName} ${contact.lastName}`)
      console.log(`Email: ${contact.email}`)
      console.log(`Company: ${contact.companyName || 'N/A'}`)
      console.log(`Tags: ${contact.tags.join(', ')}`)
      console.log(`Custom Fields: ${customFields.length}`)
      
      console.log('\n🏷️  CUSTOM FIELDS DETAILS:')
      if (customFields.length > 0) {
        // Get field definitions to show names
        const fieldResponse = await fetch(`${GHL_API_BASE}/locations/${process.env.GHL_LOCATION_ID}/customFields`, {
          headers: {
            'Authorization': `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
            'Accept': 'application/json',
            'Version': GHL_API_VERSION
          }
        })
        
        let fieldNames: Record<string, string> = {}
        if (fieldResponse.ok) {
          const fieldsData = await fieldResponse.json()
          fieldsData.customFields.forEach((field: any) => {
            fieldNames[field.id] = field.name
          })
        }
        
        customFields.forEach((cf: any, index: number) => {
          const fieldName = fieldNames[cf.id] || 'Unknown Field'
          console.log(`  ${index + 1}. ${fieldName}`)
          console.log(`     ID: ${cf.id}`)
          console.log(`     Value: "${cf.value}"`)
          console.log('')
        })
        
        console.log('🎉 SUCCESS! Custom fields are now visible in GoHighLevel!')
        console.log('✅ The issue has been resolved - custom fields appear in the GHL contact interface.')
        
      } else {
        console.log('❌ No custom fields found')
      }
      
    } else {
      console.log('❌ Failed to retrieve contact:', await response.text())
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// Run the verification
verifyFinalContact().catch(console.error)