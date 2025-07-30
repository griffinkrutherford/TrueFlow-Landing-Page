/**
 * Enhanced Field Mapping for GoHighLevel Custom Fields V2
 * Fixes unicode character issues and improves field matching
 */

export interface FieldMapping {
  formField: string           // Our internal field name
  ghlFieldName: string       // The actual field name in GHL
  ghlFieldKey?: string       // The field key if different from name
  dataType: 'TEXT' | 'LARGE_TEXT' | 'NUMERICAL' | 'DATE' | 'CHECKBOX' | 'SINGLE_OPTIONS' | 'MULTIPLE_OPTIONS'
  transform?: (value: any) => string  // Optional transform function
  alternateNames?: string[]   // Alternative field names to try
}

/**
 * Normalize strings for comparison - handles unicode issues
 */
function normalizeFieldName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    // Replace various dash types with standard dash
    .replace(/[\u2014\u2013\u2012]/g, '-') // em dash, en dash, figure dash
    .replace(/—/g, '-') // em dash
    .replace(/–/g, '-') // en dash
    // Replace various apostrophe types with standard apostrophe
    .replace(/[\u2019\u2018]/g, "'") // curly quotes
    .replace(/'/g, "'") // right single quotation mark
    .replace(/'/g, "'") // left single quotation mark
    // Remove extra spaces
    .replace(/\s+/g, ' ')
}

/**
 * Enhanced field mappings with alternate names for better matching
 */
export const fieldMappings: FieldMapping[] = [
  // Business Information
  {
    formField: 'businessName',
    ghlFieldName: 'Business Name',
    dataType: 'TEXT'
  },
  {
    formField: 'businessType',
    ghlFieldName: 'Business Type',
    dataType: 'SINGLE_OPTIONS',
    transform: (value: string) => {
      const typeMap: Record<string, string> = {
        'creator': 'Content Creator',
        'podcaster': 'Podcast Host',
        'business': 'Business Owner',
        'coach': 'Coach or Consultant',
        'agency': 'Marketing Agency',
        'other': 'Other Professional'
      }
      return typeMap[value] || value
    }
  },
  
  // Content Goals
  {
    formField: 'contentGoals',
    ghlFieldName: 'What are your goals?',
    dataType: 'LARGE_TEXT',
    transform: (value: string[]) => {
      if (!Array.isArray(value)) return String(value)
      const goalMap: Record<string, string> = {
        'newsletters': 'Email Newsletters',
        'blogs': 'Blog Posts',
        'social': 'Social Media Content',
        'courses': 'Course Content',
        'sales': 'Sales Materials',
        'support': 'Customer Support'
      }
      return value.map(goal => goalMap[goal] || goal).join(', ')
    }
  },
  
  // Integrations
  {
    formField: 'integrations',
    ghlFieldName: 'Integration Preferences',
    dataType: 'MULTIPLE_OPTIONS',
    transform: (value: string[]) => {
      if (!Array.isArray(value)) return String(value)
      const integrationMap: Record<string, string> = {
        'gohighlevel': 'GoHighLevel',
        'mailchimp': 'Mailchimp',
        'convertkit': 'ConvertKit',
        'hubspot': 'HubSpot',
        'activecampaign': 'ActiveCampaign',
        'zapier': 'Zapier'
      }
      return value.map(int => integrationMap[int] || int).join(', ')
    }
  },
  
  // Assessment specific fields
  {
    formField: 'currentContent',
    ghlFieldName: 'Current Content Creation',
    dataType: 'SINGLE_OPTIONS',
    transform: (value: string) => {
      const contentMap: Record<string, string> = {
        'manual': 'Manually write everything',
        'outsource': 'Outsource to freelancers/agencies',
        'team': 'Have an in-house content team',
        'mixed': 'Mix of manual and automated tools'
      }
      return contentMap[value] || value
    }
  },
  {
    formField: 'contentVolume',
    ghlFieldName: 'Content Volume',
    dataType: 'SINGLE_OPTIONS',
    transform: (value: string) => {
      const volumeMap: Record<string, string> = {
        'minimal': '1-5 pieces',
        'moderate': '6-20 pieces',
        'high': '21-50 pieces',
        'very-high': '50+ pieces'
      }
      return volumeMap[value] || value
    }
  },
  {
    formField: 'crmUsage',
    ghlFieldName: 'CRM Usage',
    dataType: 'SINGLE_OPTIONS',
    transform: (value: string) => {
      const crmMap: Record<string, string> = {
        'spreadsheets': 'Spreadsheets or manual tracking',
        'basic-crm': 'Basic CRM system',
        'advanced-crm': 'Advanced CRM with automation',
        'integrated': 'Fully integrated systems'
      }
      return crmMap[value] || value
    }
  },
  {
    formField: 'leadResponse',
    ghlFieldName: 'Lead Response Time',
    dataType: 'SINGLE_OPTIONS',
    transform: (value: string) => {
      const responseMap: Record<string, string> = {
        'days': 'Within a few days',
        'hours': 'Within 24 hours',
        'quick': 'Within a few hours',
        'instant': 'Almost instantly'
      }
      return responseMap[value] || value
    }
  },
  {
    formField: 'timeSpent',
    ghlFieldName: 'Time on Repetitive Tasks',
    dataType: 'SINGLE_OPTIONS',
    transform: (value: string) => {
      const timeMap: Record<string, string> = {
        'minimal': 'Less than 5 hours',
        'moderate': '5-15 hours',
        'high': '15-30 hours',
        'very-high': 'More than 30 hours'
      }
      return timeMap[value] || value
    }
  },
  {
    formField: 'budget',
    ghlFieldName: 'Current revenue range? (We don\'t need exact numbers—just a ballpark.)',
    alternateNames: [
      'Current revenue range? (We don\'t need exact numbers-just a ballpark.)',
      'Current revenue range?',
      'Revenue Range',
      'Budget'
    ],
    dataType: 'SINGLE_OPTIONS',
    transform: (value: string) => {
      const budgetMap: Record<string, string> = {
        'low': 'Less than $500',
        'moderate': '$500 - $2,000',
        'high': '$2,000 - $5,000',
        'enterprise': 'More than $5,000'
      }
      return budgetMap[value] || value
    }
  },
  
  // Score and metadata
  {
    formField: 'assessmentScore',
    ghlFieldName: 'Assessment Score',
    dataType: 'NUMERICAL',
    transform: (value: any) => String(Math.round(Number(value) || 0))
  },
  {
    formField: 'readinessLevel',
    ghlFieldName: 'Readiness Level',
    alternateNames: ['AI Readiness Level'],
    dataType: 'TEXT'
  },
  {
    formField: 'selectedPlan',
    ghlFieldName: 'Selected Plan',
    dataType: 'TEXT',
    transform: (value: string) => {
      const planMap: Record<string, string> = {
        'content-engine': 'Content Engine',
        'complete-system': 'Complete System',
        'custom': 'Custom Enterprise',
        'custom_enterprise': 'Custom Enterprise',
        'not-sure': 'Not Sure Yet'
      }
      return planMap[value] || value
    }
  },
  {
    formField: 'submissionDate',
    ghlFieldName: 'Submission Date',
    dataType: 'DATE',
    transform: (value: any) => {
      const date = new Date(value)
      return date.toISOString()
    }
  },
  {
    formField: 'leadScore',
    ghlFieldName: 'Lead Score',
    dataType: 'NUMERICAL',
    transform: (value: any) => String(Math.round(Number(value) || 0))
  },
  {
    formField: 'leadQuality',
    ghlFieldName: 'Lead Quality',
    dataType: 'TEXT',
    transform: (value: string) => value.charAt(0).toUpperCase() + value.slice(1)
  }
]

/**
 * Enhanced field matching with fuzzy matching and alternate names
 */
export function findFieldMapping(
  formField: string,
  ghlFields: Array<{ name: string; id: string; fieldKey?: string }>
): { mapping: FieldMapping; fieldId: string } | null {
  const mapping = fieldMappings.find(m => m.formField === formField)
  if (!mapping) return null
  
  // Normalize the primary field name
  const normalizedPrimary = normalizeFieldName(mapping.ghlFieldName)
  
  // Try to find the field by exact match first
  for (const ghlField of ghlFields) {
    const normalizedGHL = normalizeFieldName(ghlField.name)
    
    if (normalizedGHL === normalizedPrimary) {
      return { mapping, fieldId: ghlField.id }
    }
  }
  
  // Try alternate names
  if (mapping.alternateNames) {
    for (const altName of mapping.alternateNames) {
      const normalizedAlt = normalizeFieldName(altName)
      for (const ghlField of ghlFields) {
        const normalizedGHL = normalizeFieldName(ghlField.name)
        if (normalizedGHL === normalizedAlt) {
          return { mapping, fieldId: ghlField.id }
        }
      }
    }
  }
  
  // Try field key match
  for (const ghlField of ghlFields) {
    if (ghlField.fieldKey) {
      const normalizedKey = normalizeFieldName(ghlField.fieldKey)
      if (normalizedKey === normalizedPrimary) {
        return { mapping, fieldId: ghlField.id }
      }
    }
  }
  
  return null
}

/**
 * Enhanced payload builder with better error handling and logging
 */
export function buildMappedCustomFieldsV2(
  formData: any,
  existingFields: Array<{ name: string; id: string; fieldKey?: string }>
): Array<{ id: string; value: string }> {
  const customFields: Array<{ id: string; value: string }> = []
  const mappingResults: Array<{ field: string; status: string; value?: string }> = []
  
  // Process each field mapping
  fieldMappings.forEach(mapping => {
    // Get the value from form data
    let value = formData[mapping.formField]
    
    // Special handling for nested assessment answers
    if (!value && formData.answers) {
      // Try different answer key formats
      const answerKey = mapping.formField.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')
      if (formData.answers[answerKey]) {
        value = formData.answers[answerKey]
      } else if (formData.answers[mapping.formField]) {
        value = formData.answers[mapping.formField]
      }
    }
    
    // Skip if no value
    if (value === undefined || value === null || value === '') {
      mappingResults.push({ field: mapping.formField, status: 'no-value' })
      return
    }
    
    // Find the field mapping
    const result = findFieldMapping(mapping.formField, existingFields)
    
    if (result) {
      // Transform the value
      const transformedValue = mapping.transform ? mapping.transform(value) : String(value)
      
      customFields.push({
        id: result.fieldId,
        value: transformedValue
      })
      
      mappingResults.push({
        field: mapping.formField,
        status: 'mapped',
        value: transformedValue
      })
      
      console.log(`[Field Mapping V2] ✅ Mapped ${mapping.formField} -> ${mapping.ghlFieldName}: ${transformedValue}`)
    } else {
      mappingResults.push({
        field: mapping.formField,
        status: 'field-not-found',
        value: String(value)
      })
      
      console.warn(`[Field Mapping V2] ❌ No GHL field found for: ${mapping.ghlFieldName}`)
    }
  })
  
  // Log summary
  const mapped = mappingResults.filter(r => r.status === 'mapped').length
  const noValue = mappingResults.filter(r => r.status === 'no-value').length
  const notFound = mappingResults.filter(r => r.status === 'field-not-found').length
  
  console.log(`[Field Mapping V2] Summary: ${mapped} mapped, ${noValue} empty, ${notFound} not found`)
  
  return customFields
}

// Export the normalizer for testing
export { normalizeFieldName }