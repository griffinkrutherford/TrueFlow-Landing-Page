#!/usr/bin/env tsx

/**
 * Verify Form Fields Script
 * Shows exactly which Get Started form questions are mapped to custom fields
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

const contactId = process.argv[2]

if (!contactId) {
  console.log('Usage: npx tsx scripts/verify-form-fields.ts <contactId>')
  process.exit(1)
}

// Form field mapping to show what each field represents
const FORM_FIELD_MAPPING = {
  'Business Name': 'businessName (from form)',
  'Business Type': 'businessType (from form)', 
  'Team Size': 'teamSize (from form) - "How many team members do you have?"',
  'Monthly Leads': 'monthlyLeads (from form) - "How many leads do you generate monthly?"',
  'Current Tools': 'currentTools (from form) - "What tools are you currently using?"',
  'Biggest Challenge': 'biggestChallenge (from form) - "What is your biggest business challenge?"',
  'Content Goals': 'contentGoals (from form) - "What content do you want to create?"',
  'Selected Plan': 'selectedPlan (from form) - "Which plan interests you?"',
  'Revenue Range': 'revenueRange (from form) - "What is your revenue range?"',
  'Business Goals': 'businessGoals (from form) - "What are your business goals?"',
  'Additional Notes': 'additionalNotes (from form) - "Any additional information?"',
  'Lead Score': 'Calculated based on form responses',
  'Lead Quality': 'Calculated based on lead score',
  'Submission Date': 'Auto-generated submission timestamp'
}

async function verifyFormFields() {
  try {
    console.log('🔍 Get Started Form Field Verification')
    console.log('=====================================\n')
    
    // Get contact data
    const contactResponse = await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      }
    })
    
    const contactData = await contactResponse.json()
    const contact = contactData.contact
    
    console.log(`📋 Contact: ${contact.firstName} ${contact.lastName}`)
    console.log(`📧 Email: ${contact.email}`)
    console.log(`🏢 Company: ${contact.companyName}`)
    console.log(`📅 Created: ${new Date(contact.dateAdded).toLocaleString()}`)
    console.log(`🏷️  Tags: ${contact.tags.join(', ')}\n`)
    
    // Get custom field definitions
    const fieldsResponse = await fetch(`https://services.leadconnectorhq.com/locations/${process.env.GHL_LOCATION_ID}/customFields?model=contact`, {
      headers: {
        'Authorization': `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      }
    })
    
    const fieldsData = await fieldsResponse.json()
    const fieldMap = new Map()
    fieldsData.customFields.forEach((field: any) => {
      fieldMap.set(field.id, field)
    })
    
    console.log('📊 GET STARTED FORM FIELDS → GOHIGHLEVEL CUSTOM FIELDS')
    console.log('========================================================\n')
    
    let populatedCount = 0
    let totalRelevantFields = 0
    
    // Check each custom field value
    if (contact.customFields && contact.customFields.length > 0) {
      contact.customFields.forEach((cf: any) => {
        const field = fieldMap.get(cf.id)
        if (field) {
          const formMapping = FORM_FIELD_MAPPING[field.name as keyof typeof FORM_FIELD_MAPPING]
          if (formMapping) {
            totalRelevantFields++
            let value = cf.value
            
            // Format array values
            if (Array.isArray(value)) {
              value = value.join(', ')
            }
            
            // Format JSON strings
            if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
              try {
                const parsed = JSON.parse(value)
                value = Array.isArray(parsed) ? parsed.join(', ') : value
              } catch (e) {
                // Keep original value if parsing fails
              }
            }
            
            console.log(`✅ ${field.name}`)
            console.log(`   Form Question: ${formMapping}`)
            console.log(`   Value: "${value}"`)
            console.log('')
            populatedCount++
          }
        }
      })
    }
    
    console.log('📈 SUMMARY')
    console.log('==========')
    console.log(`✅ Form Fields Populated: ${populatedCount}`)
    console.log(`📋 Total Custom Fields: ${contact.customFields?.length || 0}`)
    console.log(`🎯 Get Started Form Coverage: ${populatedCount}/${Object.keys(FORM_FIELD_MAPPING).length} (${Math.round(populatedCount/Object.keys(FORM_FIELD_MAPPING).length*100)}%)`)
    
    if (populatedCount === 0) {
      console.log('\n❌ No Get Started form fields found in custom fields!')
      console.log('This indicates the form data is not being properly mapped.')
    } else if (populatedCount < Object.keys(FORM_FIELD_MAPPING).length) {
      console.log(`\n⚠️  Some form fields are missing. This could be due to:`)
      console.log('   • Fields not submitted in the form')
      console.log('   • Custom fields not created in GoHighLevel')
      console.log('   • Field mapping configuration issues')
    } else {
      console.log('\n🎉 All expected Get Started form fields are populated!')
    }
    
  } catch (error) {
    console.error('❌ Error verifying form fields:', error)
  }
}

verifyFormFields()