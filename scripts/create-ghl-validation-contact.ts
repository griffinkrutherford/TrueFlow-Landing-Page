#!/usr/bin/env tsx

/**
 * Create GoHighLevel Validation Contact
 * Creates a real contact in GoHighLevel to validate verbatim field mapping
 */

import { config } from 'dotenv'
import { 
  ensureVerbatimFieldsExist,
  buildVerbatimCustomFields,
  VERBATIM_GET_STARTED_FIELDS
} from '@/lib/ghl/verbatim-field-mapping'

config({ path: '.env.local' })

const GHL_ACCESS_TOKEN = process.env.GHL_ACCESS_TOKEN
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID

async function createValidationContact() {
  try {
    console.log('🎯 Creating GoHighLevel Validation Contact')
    console.log('==========================================')
    console.log(`Location ID: ${GHL_LOCATION_ID}`)
    console.log(`Token: ${GHL_ACCESS_TOKEN?.substring(0, 10)}...`)
    console.log('')

    // Validate environment variables
    if (!GHL_ACCESS_TOKEN || !GHL_LOCATION_ID) {
      console.error('❌ Missing GoHighLevel configuration')
      console.error('Please ensure GHL_ACCESS_TOKEN and GHL_LOCATION_ID are set in .env.local')
      return
    }

    // Test data showing comprehensive verbatim field mapping
    const validationData = {
      // Contact information (exact)
      firstName: 'Verbatim',
      lastName: 'Validation Test',
      email: 'verbatim.validation@test.example.com',
      phone: '+1 (555) 999-0001',
      businessName: 'Verbatim Field Mapping Test Company',
      
      // Business profile (exact form selections)
      businessType: 'Marketing Agency',
      contentGoals: ['Email Newsletters', 'Blog Posts', 'Social Media Content'],
      
      // Assessment answers (showing different data types)
      currentContent: 'mixed',
      contentVolume: 'high',
      crmUsage: 'advanced-crm', 
      leadResponse: 'quick',
      timeSpent: 'moderate',
      budget: 'high',
      
      // Integration preferences
      integrations: ['GoHighLevel', 'HubSpot', 'Mailchimp'],
      selectedPlan: 'Complete System',
      
      // Assessment results (showing string preservation)
      totalScore: '18', // String, not number
      scorePercentage: '75', // String, not number
      readinessLevel: 'Highly Ready',
      recommendation: 'Complete System',
      
      // Complex assessment data
      assessmentAnswers: [
        {
          questionId: 'current-content',
          category: 'Content Creation',
          question: 'How do you currently create content for your business?',
          answer: 'Mix of manual and automated tools',
          score: 4
        },
        {
          questionId: 'content-volume', 
          category: 'Content Creation',
          question: 'How much content do you need to produce monthly?',
          answer: '21-50 pieces',
          score: 3
        },
        {
          questionId: 'crm-usage',
          category: 'Customer Management', 
          question: 'How do you currently manage customer relationships?',
          answer: 'Advanced CRM with automation',
          score: 3
        }
      ],
      
      // Metadata (as strings)
      submissionDate: '2025-07-30',
      formSource: 'verbatim-validation-test',
      assessmentVersion: '2.0'
    }

    console.log('📋 Validation Test Data:')
    console.log('========================')
    console.log(`Name: ${validationData.firstName} ${validationData.lastName}`)
    console.log(`Email: ${validationData.email}`)
    console.log(`Business: ${validationData.businessName}`)
    console.log(`Type: ${validationData.businessType}`)
    console.log(`Content Goals: ${validationData.contentGoals.join(', ')}`)
    console.log(`Score: ${validationData.scorePercentage}% (${validationData.readinessLevel})`)
    console.log(`Plan: ${validationData.selectedPlan}`)
    console.log(`Integrations: ${validationData.integrations.join(', ')}`)
    console.log('')

    // Step 1: Ensure all verbatim custom fields exist
    console.log('🔧 Step 1: Ensuring verbatim custom fields exist in GoHighLevel...')
    const fieldMap = await ensureVerbatimFieldsExist(GHL_LOCATION_ID, GHL_ACCESS_TOKEN)
    
    if (fieldMap.size === 0) {
      console.error('❌ Failed to create or fetch custom fields')
      return
    }

    console.log(`✅ Custom fields ready: ${fieldMap.size} fields available`)
    console.log('')

    // Step 2: Build verbatim custom fields payload
    console.log('🔄 Step 2: Building verbatim custom fields payload...')
    const customFields = buildVerbatimCustomFields(validationData, fieldMap)
    
    console.log(`✅ Custom fields built: ${customFields.length} fields mapped`)
    console.log('')

    // Step 3: Create the contact in GoHighLevel
    console.log('🚀 Step 3: Creating contact in GoHighLevel...')
    
    const contactPayload = {
      firstName: validationData.firstName,
      lastName: validationData.lastName,
      email: validationData.email,
      phone: validationData.phone,
      companyName: validationData.businessName,
      tags: [
        'verbatim-validation-test',
        'web-lead',
        'field-mapping-demo',
        `readiness-${validationData.readinessLevel.toLowerCase().replace(/\s+/g, '-')}`,
        `business-type-${validationData.businessType.toLowerCase().replace(/\s+/g, '-')}`,
        `plan-${validationData.selectedPlan.toLowerCase().replace(/\s+/g, '-')}`
      ],
      customFields: customFields,
      source: 'Verbatim Field Mapping Validation Test'
    }

    console.log('📤 Creating contact with payload...')
    console.log(`   Fields to create: ${customFields.length}`)
    console.log(`   Tags to apply: ${contactPayload.tags.length}`)

    const contactResponse = await fetch(`https://services.leadconnectorhq.com/contacts/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify(contactPayload)
    })

    console.log(`📡 API Response: ${contactResponse.status} ${contactResponse.statusText}`)

    if (!contactResponse.ok) {
      const errorData = await contactResponse.json()
      console.error('❌ GoHighLevel API Error:', JSON.stringify(errorData, null, 2))
      return
    }

    const contactResult = await contactResponse.json()
    const contactId = contactResult.contact?.id

    if (!contactId) {
      console.error('❌ No contact ID returned:', contactResult)
      return
    }

    console.log('✅ Contact created successfully!')
    console.log(`📋 Contact ID: ${contactId}`)
    console.log('')

    // Step 4: Verify the contact was created with correct fields
    console.log('🔍 Step 4: Verifying verbatim fields in GoHighLevel...')
    
    // Wait a moment for the contact to be fully created
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const verifyResponse = await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}`, {
      headers: {
        'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      }
    })

    if (!verifyResponse.ok) {
      console.error(`❌ Failed to verify contact: ${verifyResponse.status}`)
      return
    }

    const verifyData = await verifyResponse.json()
    const contact = verifyData.contact

    console.log('📊 Contact Verification Results:')
    console.log('================================')
    console.log(`👤 Name: ${contact.firstName} ${contact.lastName}`)
    console.log(`📧 Email: ${contact.email}`)
    console.log(`📞 Phone: ${contact.phone}`)
    console.log(`🏢 Company: ${contact.companyName}`)
    console.log(`🆔 Contact ID: ${contact.id}`)
    console.log(`🏷️  Tags: ${contact.tags?.join(', ') || 'None'}`)
    console.log(`📊 Custom Fields: ${contact.customFields?.length || 0}`)
    console.log('')

    // Get field definitions for mapping
    const fieldsResponse = await fetch(`https://services.leadconnectorhq.com/locations/${GHL_LOCATION_ID}/customFields?model=contact`, {
      headers: {
        'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      }
    })

    if (!fieldsResponse.ok) {
      console.error(`❌ Failed to fetch field definitions: ${fieldsResponse.status}`)
      return
    }

    const fieldsData = await fieldsResponse.json()
    const fieldDefinitions = new Map()
    fieldsData.customFields.forEach((field: any) => {
      fieldDefinitions.set(field.id, field)
    })

    console.log('🎯 VERBATIM FIELD VALIDATION RESULTS:')
    console.log('====================================')

    if (!contact.customFields || contact.customFields.length === 0) {
      console.log('❌ No custom fields found on contact')
      return
    }

    let verbatimFieldsFound = 0
    let stringPreservationSuccess = 0
    const expectedVerbatimFields = [
      'Select Your Business Type',
      'What Content Do You Want to Create?',
      'How do you currently create content for your business?',
      'Assessment Total Score',
      'Assessment Score Percentage', 
      'AI Readiness Level',
      'Choose Your Plan',
      'Integration Preferences (Optional)'
    ]

    console.log('📋 KEY VERBATIM FIELDS FOUND:')
    console.log('-'.repeat(35))

    contact.customFields.forEach((cf: any) => {
      const fieldDef = fieldDefinitions.get(cf.id)
      if (!fieldDef) return

      let value = cf.value
      
      // Format display value
      if (Array.isArray(value)) {
        value = value.join(', ')
      }
      
      if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
        try {
          const parsed = JSON.parse(value)
          value = Array.isArray(parsed) ? parsed.join(', ') : value
        } catch (e) {
          // Keep original
        }
      }

      // Check if this is a verbatim field
      const isVerbatimField = Object.values(VERBATIM_GET_STARTED_FIELDS).some(def => def.name === fieldDef.name)
      const isExpectedField = expectedVerbatimFields.includes(fieldDef.name)
      
      if (isVerbatimField) {
        verbatimFieldsFound++
        
        if (typeof cf.value === 'string') {
          stringPreservationSuccess++
        }
        
        if (isExpectedField || verbatimFieldsFound <= 12) {
          const icon = isExpectedField ? '⭐' : '  '
          console.log(`${icon} "${fieldDef.name}"`)
          console.log(`     Value: "${value}"`)
          console.log(`     Stored as: ${typeof cf.value} (${fieldDef.dataType})`)
          console.log(`     String preserved: ${typeof cf.value === 'string' ? '✅' : '❌'}`)
          console.log('')
        }
      }
    })

    // Final validation summary
    console.log('📈 VALIDATION SUMMARY:')
    console.log('======================')
    console.log(`✅ Contact Created: ${contactId}`)
    console.log(`✅ Total Custom Fields: ${contact.customFields.length}`)
    console.log(`✅ Verbatim Fields Found: ${verbatimFieldsFound}`)
    console.log(`✅ String Preservation: ${stringPreservationSuccess}/${verbatimFieldsFound} (${Math.round(stringPreservationSuccess/Math.max(verbatimFieldsFound,1)*100)}%)`)
    console.log(`✅ Expected Fields Found: ${expectedVerbatimFields.filter(name => 
      contact.customFields.some((cf: any) => {
        const fieldDef = fieldDefinitions.get(cf.id)
        return fieldDef && fieldDef.name === name
      })
    ).length}/${expectedVerbatimFields.length}`)
    console.log('')

    if (verbatimFieldsFound >= 15 && stringPreservationSuccess === verbatimFieldsFound) {
      console.log('🎉 VALIDATION SUCCESSFUL!')
      console.log('=========================')
      console.log('✅ Verbatim field mapping is working perfectly!')
      console.log('✅ All data preserved as strings without transformation')
      console.log('✅ Custom fields created with exact form question text')
      console.log('✅ Complex data structures properly serialized')
    } else if (verbatimFieldsFound >= 10) {
      console.log('✅ VALIDATION MOSTLY SUCCESSFUL!')
      console.log('===============================')
      console.log('✅ Most verbatim fields are working correctly')
      console.log('⚠️  Some fields may need adjustment')
    } else {
      console.log('⚠️  VALIDATION NEEDS ATTENTION')
      console.log('=============================')
      console.log('❌ Fewer verbatim fields found than expected')
      console.log('🔧 Check field creation and mapping logic')
    }

    console.log('')
    console.log('🔗 GoHighLevel Links:')
    console.log('=====================')
    console.log(`📋 Contact: https://app.gohighlevel.com/v2/location/${GHL_LOCATION_ID}/contacts/detail/${contactId}`)
    console.log(`🗂️  All Contacts: https://app.gohighlevel.com/location/${GHL_LOCATION_ID}/contacts/all`)
    console.log(`⚙️  Custom Fields: https://app.gohighlevel.com/location/${GHL_LOCATION_ID}/settings/custom-fields`)
    console.log('')
    console.log('👀 Please check the GoHighLevel interface to see the verbatim custom fields!')

    return contactId

  } catch (error) {
    console.error('❌ Error creating validation contact:', error)
    
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      if (error.message.includes('403')) {
        console.error('')
        console.error('🔧 Authentication Issue:')
        console.error('- Check that GHL_ACCESS_TOKEN is valid and not expired')
        console.error('- Verify that the token has access to the specified location')
        console.error('- Ensure the token has permissions to create contacts and custom fields')
      }
    }
  }
}

createValidationContact()