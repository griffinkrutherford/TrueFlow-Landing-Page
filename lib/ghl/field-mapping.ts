/**
 * Field Mapping for GoHighLevel Custom Fields
 * Maps our form fields to actual GHL custom field names
 */

export interface FieldMapping {
  formField: string           // Our internal field name
  ghlFieldName: string       // The actual field name in GHL
  ghlFieldKey?: string       // The field key if different from name
  dataType: 'TEXT' | 'LARGE_TEXT' | 'NUMERICAL' | 'DATE' | 'CHECKBOX' | 'SINGLE_OPTIONS' | 'MULTIPLE_OPTIONS'
  transform?: (value: any) => string  // Optional transform function
}

/**
 * Map our form fields to the ACTUAL GoHighLevel field names
 * Based on the fields visible in the GHL UI
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
    ghlFieldName: 'Business Type',  // This field already exists in GHL
    dataType: 'SINGLE_OPTIONS',
    transform: (value: string) => {
      // Transform our internal values to display names
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
  
  // Content Goals - map to "What are your goals?"
  {
    formField: 'contentGoals',
    ghlFieldName: 'What are your goals?',
    dataType: 'LARGE_TEXT',
    transform: (value: string[]) => {
      // Convert array to readable text
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
  
  // Integrations - map to existing field in GHL
  {
    formField: 'integrations',
    ghlFieldName: 'Integration Preferences',  // This field already exists
    dataType: 'MULTIPLE_OPTIONS',
    transform: (value: string[]) => {
      // Convert array to readable text
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
  
  // Assessment specific fields - using existing GHL fields
  {
    formField: 'currentContent',
    ghlFieldName: 'Current Content Creation',  // This field exists
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
    ghlFieldName: 'Content Volume',  // This field exists
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
    ghlFieldName: 'CRM Usage',  // This field exists
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
    ghlFieldName: 'Lead Response Time',  // This field exists
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
    ghlFieldName: 'Time on Repetitive Tasks',  // This field exists
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
    ghlFieldName: 'Current revenue range? (We don\'t need exact numbers—just a ballpark.)',  // Use existing field
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
    dataType: 'NUMERICAL'
  },
  {
    formField: 'readinessLevel',
    ghlFieldName: 'Readiness Level',  // This field exists
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
        'not-sure': 'Not Sure Yet'
      }
      return planMap[value] || value
    }
  },
  {
    formField: 'submissionDate',
    ghlFieldName: 'Form Submission Date',
    dataType: 'DATE'
  },
  {
    formField: 'leadScore',
    ghlFieldName: 'Lead Score',
    dataType: 'NUMERICAL'
  },
  {
    formField: 'leadQuality',
    ghlFieldName: 'Lead Quality',
    dataType: 'TEXT'
  }
]

/**
 * Get the GHL field name for a form field
 */
export function getGHLFieldName(formField: string): string | undefined {
  const mapping = fieldMappings.find(m => m.formField === formField)
  return mapping?.ghlFieldName
}

/**
 * Transform a form value for GHL
 */
export function transformFieldValue(formField: string, value: any): string {
  const mapping = fieldMappings.find(m => m.formField === formField)
  if (mapping?.transform) {
    return mapping.transform(value)
  }
  
  // Default transformations
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  if (value instanceof Date) {
    return value.toISOString()
  }
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value)
  }
  
  return String(value)
}

/**
 * Build a mapped payload for GHL custom fields
 * This takes our form data and maps it to the actual GHL field names
 */
export function buildMappedCustomFields(
  formData: any,
  existingFields: Array<{ name: string; id: string; fieldKey?: string }>
): Array<{ id: string; value: string }> {
  const customFields: Array<{ id: string; value: string }> = []
  
  // Create a map of field names to IDs for quick lookup
  const fieldNameToId = new Map<string, string>()
  existingFields.forEach(field => {
    fieldNameToId.set(field.name.toLowerCase(), field.id)
    if (field.fieldKey) {
      fieldNameToId.set(field.fieldKey.toLowerCase(), field.id)
    }
  })
  
  // Process each mapping
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
      return
    }
    
    // Transform the value
    const transformedValue = transformFieldValue(mapping.formField, value)
    
    // Find the field ID
    const fieldId = fieldNameToId.get(mapping.ghlFieldName.toLowerCase())
    
    if (fieldId) {
      customFields.push({
        id: fieldId,
        value: transformedValue
      })
      console.log(`[Field Mapping] Mapped ${mapping.formField} -> ${mapping.ghlFieldName}: ${transformedValue}`)
    } else {
      console.warn(`[Field Mapping] No field ID found for: ${mapping.ghlFieldName}`)
    }
  })
  
  return customFields
}