/**
 * Test script to debug GHL field mapping issues
 */

import { fieldMappings, buildMappedCustomFields } from './field-mapping'

// Mock GHL fields from your system
const mockGHLFields = [
  { id: 'field1', name: 'Business Name' },
  { id: 'field2', name: 'Business Type' },
  { id: 'field3', name: 'What are your goals?' },
  { id: 'field4', name: 'Integration Preferences' },
  { id: 'field5', name: 'Selected Plan' },
  { id: 'field6', name: 'Lead Score' },
  { id: 'field7', name: 'Lead Quality' },
  { id: 'field8', name: 'Current Content Creation' },
  { id: 'field9', name: 'Content Volume' },
  { id: 'field10', name: 'CRM Usage' },
  { id: 'field11', name: 'Lead Response Time' },
  { id: 'field12', name: 'Time on Repetitive Tasks' },
  { id: 'field13', name: 'Current revenue range? (We don\'t need exact numbers—just a ballpark.)' },
  { id: 'field14', name: 'Assessment Score' },
  { id: 'field15', name: 'Readiness Level' },
  { id: 'field16', name: 'Submission Date' }
]

// Test data from Getting Started form
const testFormData = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  businessName: 'Test Agency',
  businessType: 'agency',
  contentGoals: ['newsletters', 'blogs', 'social'],
  integrations: ['gohighlevel', 'mailchimp', 'zapier'],
  selectedPlan: 'complete-system',
  leadScore: 85,
  leadQuality: 'hot',
  submissionDate: new Date().toISOString()
}

console.log('=== Testing Field Mapping ===\n')

console.log('1. Available GHL Fields:')
mockGHLFields.forEach(field => {
  console.log(`   - "${field.name}" (ID: ${field.id})`)
})

console.log('\n2. Form Data:')
console.log(JSON.stringify(testFormData, null, 2))

console.log('\n3. Field Mappings Configuration:')
fieldMappings.forEach(mapping => {
  console.log(`   - ${mapping.formField} → "${mapping.ghlFieldName}" (${mapping.dataType})`)
})

console.log('\n4. Building Mapped Fields...')
const mappedFields = buildMappedCustomFields(testFormData, mockGHLFields)

console.log('\n5. Result:')
console.log(`   Total fields mapped: ${mappedFields.length}`)
mappedFields.forEach(field => {
  const ghlField = mockGHLFields.find(f => f.id === field.id)
  console.log(`   - ${ghlField?.name}: "${field.value}"`)
})

console.log('\n6. Missing Fields Analysis:')
fieldMappings.forEach(mapping => {
  const formValue = testFormData[mapping.formField as keyof typeof testFormData]
  const ghlField = mockGHLFields.find(f => f.name.toLowerCase() === mapping.ghlFieldName.toLowerCase())
  
  if (formValue && !ghlField) {
    console.log(`   ❌ Form field "${mapping.formField}" has value but no matching GHL field "${mapping.ghlFieldName}"`)
  } else if (!formValue && ghlField) {
    console.log(`   ⚠️  No value for "${mapping.formField}" to map to GHL field "${mapping.ghlFieldName}"`)
  }
})

// Export for use in other test files
export { mockGHLFields, testFormData }