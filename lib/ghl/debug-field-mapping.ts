/**
 * Enhanced debugging for GHL field mapping issues
 */

import { fetchGHLCustomFields, buildCustomFieldsPayloadV3 } from './custom-fields-v3'
import { fieldMappings } from './field-mapping'

// Test environment variables
if (!process.env.GHL_ACCESS_TOKEN || !process.env.GHL_LOCATION_ID) {
  console.error('❌ Missing GHL environment variables')
  process.exit(1)
}

console.log('🔍 GHL Field Mapping Debugger')
console.log('=============================\n')

// Test data that mimics Getting Started form
const getStartedFormData = {
  firstName: 'Debug',
  lastName: 'Test',
  email: 'debug@test.com',
  businessName: 'Debug Test Agency',
  businessType: 'agency',
  contentGoals: ['newsletters', 'blogs', 'social'],
  integrations: ['gohighlevel', 'mailchimp', 'zapier'],
  selectedPlan: 'complete-system',
  
  // These fields might be causing the "assessment" detection
  scorePercentage: 75,
  score: 75,
  recommendation: { level: 'high', recommendation: 'Ready for AI' },
  
  // Calculated fields
  leadScore: 85,
  leadQuality: 'hot',
  submissionDate: new Date().toISOString()
}

// Test data for assessment form with answers
const assessmentFormData = {
  ...getStartedFormData,
  answers: {
    'current-content': 'mixed',
    'content-volume': 'moderate',
    'crm-usage': 'advanced-crm',
    'lead-response': 'quick',
    'time-spent': 'high',
    'budget': 'high'
  }
}

async function debugFieldMapping() {
  try {
    // 1. Fetch actual GHL fields
    console.log('1️⃣ Fetching actual GHL custom fields...\n')
    const ghlFields = await fetchGHLCustomFields(
      process.env.GHL_ACCESS_TOKEN!,
      process.env.GHL_LOCATION_ID!
    )
    
    console.log(`Found ${ghlFields.length} custom fields in GHL:\n`)
    
    // 2. Show field mapping configuration
    console.log('\n2️⃣ Field Mapping Configuration:')
    console.log('================================\n')
    
    fieldMappings.forEach(mapping => {
      const ghlField = ghlFields.find(f => 
        f.name.toLowerCase() === mapping.ghlFieldName.toLowerCase()
      )
      
      if (ghlField) {
        console.log(`✅ ${mapping.formField} → "${mapping.ghlFieldName}" (ID: ${ghlField.id})`)
      } else {
        console.log(`❌ ${mapping.formField} → "${mapping.ghlFieldName}" (NOT FOUND IN GHL)`)
      }
    })
    
    // 3. Test Getting Started form mapping
    console.log('\n\n3️⃣ Testing Getting Started Form Mapping:')
    console.log('=========================================\n')
    
    const getStartedFields = buildCustomFieldsPayloadV3(getStartedFormData, ghlFields)
    console.log(`Mapped ${getStartedFields.length} fields:\n`)
    
    getStartedFields.forEach(field => {
      const ghlField = ghlFields.find(f => f.id === field.id)
      console.log(`• ${ghlField?.name}: "${field.value}"`)
    })
    
    // 4. Test Assessment form mapping
    console.log('\n\n4️⃣ Testing Assessment Form Mapping:')
    console.log('====================================\n')
    
    const assessmentFields = buildCustomFieldsPayloadV3(assessmentFormData, ghlFields)
    console.log(`Mapped ${assessmentFields.length} fields:\n`)
    
    assessmentFields.forEach(field => {
      const ghlField = ghlFields.find(f => f.id === field.id)
      console.log(`• ${ghlField?.name}: "${field.value}"`)
    })
    
    // 5. Check for missing critical fields
    console.log('\n\n5️⃣ Missing Critical Fields Analysis:')
    console.log('====================================\n')
    
    const criticalFields = [
      'Business Type',
      'Integration Preferences',
      'Selected Plan',
      'Lead Score',
      'Lead Quality'
    ]
    
    criticalFields.forEach(fieldName => {
      const exists = ghlFields.some(f => f.name === fieldName)
      if (!exists) {
        console.log(`⚠️  Critical field missing in GHL: "${fieldName}"`)
      }
    })
    
    // 6. Form type detection
    console.log('\n\n6️⃣ Form Type Detection:')
    console.log('======================\n')
    
    const checkFormType = (data: any) => {
      const isAssessment = 'scorePercentage' in data || ('score' in data && 'recommendation' in data)
      return isAssessment ? 'assessment' : 'get-started'
    }
    
    console.log(`Getting Started form detected as: ${checkFormType(getStartedFormData)}`)
    console.log(`Assessment form detected as: ${checkFormType(assessmentFormData)}`)
    
    // Clean form data without assessment fields
    const cleanGetStartedData = { ...getStartedFormData }
    delete cleanGetStartedData.scorePercentage
    delete cleanGetStartedData.score
    delete cleanGetStartedData.recommendation
    
    console.log(`\nClean Getting Started form detected as: ${checkFormType(cleanGetStartedData)}`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// Run the debugger
debugFieldMapping()