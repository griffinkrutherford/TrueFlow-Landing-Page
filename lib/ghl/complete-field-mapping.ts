/**
 * Complete Field Mapping System for GoHighLevel Integration
 * Handles creation of missing custom fields and proper data mapping
 */

export interface GHLCustomField {
  id: string
  name: string
  fieldKey?: string
  dataType: string
  placeholder?: string
  position?: number
  picklistOptions?: string[]
  locationId?: string
  model: 'contact' | 'opportunity'
}

export interface FormFieldDefinition {
  name: string
  dataType: 'TEXT' | 'LARGE_TEXT' | 'NUMBER' | 'SINGLE_OPTIONS' | 'MULTIPLE_OPTIONS' | 'DATE' | 'CHECKBOX'
  placeholder?: string
  picklistOptions?: string[]
  description?: string
}

/**
 * Complete mapping of Get Started form fields to EXISTING GHL custom field names
 * These map to the fields that actually appear in the GoHighLevel interface
 */
export const GET_STARTED_FORM_FIELDS: Record<string, FormFieldDefinition> = {
  // Assessment Question Fields - Individual answers stored separately
  'currentcontent': {
    name: 'Current Content Creation Method',
    dataType: 'SINGLE_OPTIONS',
    placeholder: 'How do you currently create content?',
    picklistOptions: ['manual', 'outsource', 'team', 'mixed'],
    description: 'Current content creation method from assessment'
  },
  'contentvolume': {
    name: 'Monthly Content Volume',
    dataType: 'SINGLE_OPTIONS', 
    placeholder: 'Content volume needed',
    picklistOptions: ['minimal', 'moderate', 'high', 'very-high'],
    description: 'Monthly content production needs'
  },
  'crmusage': {
    name: 'CRM Usage Level',
    dataType: 'SINGLE_OPTIONS',
    placeholder: 'Current CRM usage',
    picklistOptions: ['spreadsheets', 'basic-crm', 'advanced-crm', 'integrated'],
    description: 'Current customer relationship management'
  },
  'leadresponse': {
    name: 'Lead Response Time',
    dataType: 'SINGLE_OPTIONS',
    placeholder: 'Response time to leads',
    picklistOptions: ['days', 'hours', 'quick', 'instant'],
    description: 'How quickly they respond to new leads'
  },
  'timespent': {
    name: 'Weekly Time on Repetitive Tasks',
    dataType: 'SINGLE_OPTIONS',
    placeholder: 'Time spent on repetitive tasks',
    picklistOptions: ['minimal', 'moderate', 'high', 'very-high'],
    description: 'Weekly hours spent on repetitive tasks'
  },
  'budget': {
    name: 'Monthly Budget Range',
    dataType: 'SINGLE_OPTIONS',
    placeholder: 'Monthly budget',
    picklistOptions: ['low', 'moderate', 'high', 'enterprise'],
    description: 'Monthly budget for content and customer management'
  },
  
  // Form-specific fields from Get Started page
  'teamSize': {
    name: 'How many team/staff members do you have?',
    dataType: 'SINGLE_OPTIONS',
    placeholder: 'Select team size',
    picklistOptions: ['1-5', '6-10', '11-25', '26-50', '51-100', '100+'],
    description: 'Number of team members in the business'
  },
  'monthlyLeads': {
    name: 'Estimated total number of new leads per month',
    dataType: 'SINGLE_OPTIONS', 
    placeholder: 'Select monthly lead volume',
    picklistOptions: ['0-50', '51-100', '101-500', '501-1000', '1000+'],
    description: 'Number of leads generated per month'
  },
  'currentTools': {
    name: 'Which of the following do you currently use?',
    dataType: 'MULTIPLE_OPTIONS',
    placeholder: 'Select current tools',
    picklistOptions: ['HubSpot', 'Salesforce', 'Mailchimp', 'Hootsuite', 'Zapier', 'ActiveCampaign', 'ConvertKit', 'Buffer', 'Asana', 'Monday.com', 'Other'],
    description: 'Tools currently being used by the business'
  },
  'biggestChallenge': {
    name: 'Where are you still experiencing friction? (Choose your biggest challenge or type your own.)',
    dataType: 'SINGLE_OPTIONS',
    placeholder: 'Select biggest challenge',
    picklistOptions: ['Lead Generation', 'Lead Nurturing', 'Scaling Operations', 'Team Management', 'Content Creation', 'Time Management', 'Revenue Growth', 'Other'],
    description: 'Primary business challenge'
  },
  
  // Business context fields - map to existing visible fields
  'revenueRange': {
    name: 'Current revenue range? (We don\'t need exact numbers—just a ballpark.)',
    dataType: 'SINGLE_OPTIONS',
    placeholder: 'Select revenue range',
    picklistOptions: ['Under $50k', '$50k-$100k', '$100k-$250k', '$250k-$500k', '$500k-$1M', '$1M+'],
    description: 'Annual revenue range'
  },
  'businessGoals': {
    name: 'What are your goals?',
    dataType: 'LARGE_TEXT',
    placeholder: 'Describe your primary business goals',
    description: 'Primary business objectives and goals'
  },
  'currentSystems': {
    name: 'Current Systems',
    dataType: 'MULTIPLE_OPTIONS',
    placeholder: 'Select current systems',
    picklistOptions: ['CRM', 'Email Marketing', 'Social Media Management', 'Project Management', 'Accounting', 'Customer Support', 'Analytics', 'Other'],
    description: 'Systems currently in place'
  },
  'leadSources': {
    name: 'Lead Sources',
    dataType: 'MULTIPLE_OPTIONS',
    placeholder: 'Select lead sources',
    picklistOptions: ['Website', 'Social Media', 'Referrals', 'Paid Ads', 'Content Marketing', 'Email Marketing', 'Networking', 'Cold Outreach', 'Other'],
    description: 'Current lead generation sources'
  },
  
  // Integration preferences
  'integrations': {
    name: 'Integration Preferences',
    dataType: 'MULTIPLE_OPTIONS',
    placeholder: 'Select integrations',
    picklistOptions: ['GoHighLevel', 'Mailchimp', 'ConvertKit', 'HubSpot', 'ActiveCampaign', 'Zapier'],
    description: 'Integration preferences from form'
  },
  
  // Additional form fields
  'additionalNotes': {
    name: 'Additional Notes',
    dataType: 'LARGE_TEXT',
    placeholder: 'Any additional information',
    description: 'Additional notes or information from the form'
  },
  'hearAboutUs': {
    name: 'How Did You Hear About Us',
    dataType: 'SINGLE_OPTIONS',
    placeholder: 'Select how you heard about us',
    picklistOptions: ['Google Search', 'Social Media', 'Referral', 'Blog/Content', 'Advertisement', 'Event/Conference', 'Other'],
    description: 'How the lead discovered TrueFlow'
  },
  'urgencyLevel': {
    name: 'Urgency Level',
    dataType: 'SINGLE_OPTIONS',
    placeholder: 'Select urgency level',
    picklistOptions: ['Immediate', 'Within 30 days', 'Within 90 days', 'Just exploring', 'No rush'],
    description: 'Timeline for implementation'
  },
  
  // Scoring and recommendation fields
  'totalScore': {
    name: 'Assessment Total Score',
    dataType: 'TEXT',
    placeholder: 'Total score',
    description: 'Total assessment score'
  },
  'scorePercentage': {
    name: 'Assessment Score Percentage',
    dataType: 'TEXT',
    placeholder: 'Score percentage',
    description: 'Assessment score as percentage'
  },
  'readinessLevel': {
    name: 'AI Readiness Level',
    dataType: 'TEXT',
    placeholder: 'Readiness level',
    description: 'AI readiness level based on assessment'
  },
  'recommendation': {
    name: 'AI Recommendation',
    dataType: 'TEXT',
    placeholder: 'Recommendation',
    description: 'AI-generated recommendation'
  }
}

/**
 * Create custom field in GoHighLevel
 */
export async function createCustomField(
  locationId: string,
  accessToken: string,
  fieldKey: string,
  fieldDef: FormFieldDefinition
): Promise<GHLCustomField | null> {
  try {
    console.log(`[Field Creation] Creating custom field: ${fieldDef.name}`)
    
    const payload = {
      name: fieldDef.name,
      dataType: fieldDef.dataType,
      placeholder: fieldDef.placeholder || fieldDef.name,
      position: 0,
      model: 'contact' as const,
      ...(fieldDef.picklistOptions && fieldDef.dataType.includes('OPTIONS') && {
        textBoxListOptions: fieldDef.picklistOptions.map(option => ({
          label: option,
          prefillValue: ''
        }))
      })
    }

    const response = await fetch(`https://services.leadconnectorhq.com/locations/${locationId}/customFields`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[Field Creation] Failed to create field ${fieldDef.name}:`, errorText)
      return null
    }

    const result = await response.json()
    console.log(`[Field Creation] ✅ Created field: ${fieldDef.name} (${result.customField?.fieldKey})`)
    return result.customField
  } catch (error) {
    console.error(`[Field Creation] Error creating field ${fieldDef.name}:`, error)
    return null
  }
}

/**
 * Get all existing custom fields from GHL
 */
export async function getAllCustomFields(
  locationId: string,
  accessToken: string
): Promise<GHLCustomField[]> {
  try {
    const response = await fetch(`https://services.leadconnectorhq.com/locations/${locationId}/customFields?model=contact`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      }
    })

    if (!response.ok) {
      console.error('[Field Fetch] Failed to fetch custom fields:', response.statusText)
      return []
    }

    const result = await response.json()
    return result.customFields || []
  } catch (error) {
    console.error('[Field Fetch] Error fetching custom fields:', error)
    return []
  }
}

/**
 * Ensure all required form fields exist in GHL, create missing ones
 */
export async function ensureFormFieldsExist(
  locationId: string,
  accessToken: string
): Promise<Map<string, GHLCustomField>> {
  console.log('[Field Setup] Ensuring all Get Started form fields exist in GHL...')
  
  // Get existing fields
  const existingFields = await getAllCustomFields(locationId, accessToken)
  const fieldMap = new Map<string, GHLCustomField>()
  
  // Build lookup of existing fields by name (case-insensitive)
  const existingByName = new Map<string, GHLCustomField>()
  existingFields.forEach(field => {
    existingByName.set(field.name.toLowerCase().trim(), field)
    fieldMap.set(field.fieldKey || field.id, field)
  })
  
  console.log(`[Field Setup] Found ${existingFields.length} existing custom fields`)
  
  // Check each required form field
  for (const [formKey, fieldDef] of Object.entries(GET_STARTED_FORM_FIELDS)) {
    const existingField = existingByName.get(fieldDef.name.toLowerCase().trim())
    
    if (existingField) {
      console.log(`[Field Setup] ✅ Field exists: ${fieldDef.name} (${existingField.fieldKey})`)
      fieldMap.set(formKey, existingField)
    } else {
      console.log(`[Field Setup] ❌ Field missing: ${fieldDef.name}, creating...`)
      const newField = await createCustomField(locationId, accessToken, formKey, fieldDef)
      
      if (newField) {
        fieldMap.set(formKey, newField)
        fieldMap.set(newField.fieldKey || newField.id, newField)
      }
    }
  }
  
  console.log(`[Field Setup] Field setup complete. Total fields mapped: ${fieldMap.size}`)
  return fieldMap
}

/**
 * Build complete custom fields payload for contact creation
 * GoHighLevel expects custom fields as { id: fieldId, field_value: value }
 */
export function buildCompleteCustomFields(
  formData: any,
  fieldMap: Map<string, GHLCustomField>,
  formType: 'assessment' | 'get-started'
): Array<{ id: string; field_value: string }> {
  console.log('[Complete Mapping] Building complete custom fields payload...')
  
  const customFields: Array<{ id: string; field_value: string }> = []
  
  // Core TrueFlow fields (these should already exist)
  const coreFieldMappings = {
    'businessName': 'Business Name',
    'businessType': 'Business Type', 
    'contentGoals': 'Content Goals',
    'selectedPlan': 'Selected Plan',
    'leadScore': 'Lead Score',
    'leadQuality': 'Lead Quality',
    'formType': 'Form Type',
    'submissionDate': 'Submission Date'
  }
  
  // Map core fields - always map them even if empty
  for (const [formKey, fieldName] of Object.entries(coreFieldMappings)) {
    const value = formData[formKey]
    // Find field by name
    const field = Array.from(fieldMap.values()).find(f => f.name === fieldName)
    if (field) {
      let fieldValue: string
      if (Array.isArray(value)) {
        // Clean array values - no quotes or brackets
        const filteredArray = (value || []).filter(v => v)
        fieldValue = filteredArray.join(', ') // Empty string if array is empty
      } else {
        fieldValue = String(value || '') // Convert null/undefined to empty string
      }
      customFields.push({
        id: field.id,
        field_value: fieldValue
      })
      console.log(`[Complete Mapping] ✅ Mapped ${formKey}: ${fieldValue.substring(0, 50) || '(empty)'}`)
    }
  }
  
  // Map ALL form fields - ensure complete coverage
  
  // 1. Map all assessment question answers individually
  const assessmentQuestions = [
    'current-content', 'content-volume', 'crm-usage', 
    'lead-response', 'time-spent', 'budget'
  ]
  
  assessmentQuestions.forEach(questionId => {
    const answer = formData.answers?.[questionId]
    if (answer) {
      // Map the answer value
      const fieldKey = questionId.replace(/-/g, '')
      const fieldDef = GET_STARTED_FORM_FIELDS[fieldKey]
      if (fieldDef) {
        const field = fieldMap.get(fieldKey) || Array.from(fieldMap.values()).find(f => f.name === fieldDef.name)
        if (field) {
          customFields.push({
            id: field.id,
            field_value: String(answer)
          })
          console.log(`[Complete Mapping] ✅ Mapped assessment ${questionId}: ${answer}`)
        }
      }
    }
  })
  
  // 2. Map all other form fields - always map them even if empty
  for (const [formKey, fieldDef] of Object.entries(GET_STARTED_FORM_FIELDS)) {
    // Skip if already mapped from answers
    if (assessmentQuestions.some(q => q.replace(/-/g, '') === formKey)) {
      continue
    }
    
    const field = fieldMap.get(formKey) || Array.from(fieldMap.values()).find(f => f.name === fieldDef.name)
    
    if (field) {
      const value = formData[formKey]
      let fieldValue: string
      
      if (Array.isArray(value)) {
        // Clean array values - no quotes or brackets
        const filteredArray = (value || []).filter(v => v)
        fieldValue = filteredArray.join(', ') // Empty string if array is empty
      } else if (typeof value === 'object' && value !== null) {
        fieldValue = JSON.stringify(value)
      } else {
        fieldValue = String(value || '') // Convert null/undefined to empty string
      }
      
      customFields.push({
        id: field.id,
        field_value: fieldValue
      })
      console.log(`[Complete Mapping] ✅ Mapped ${formKey} (${fieldDef.name}): ${fieldValue.substring(0, 50) || '(empty)'}`)
    } else {
      console.warn(`[Complete Mapping] ❌ Field not found for ${formKey} (${fieldDef.name})`)
    }
  }
  
  // Add calculated/meta fields - always add them
  const metaFields: Record<string, any> = {
    'submissionDate': new Date().toISOString().split('T')[0],
    'formType': formType || '',
    'leadScore': formData.leadScore || 0,
    'leadQuality': formData.leadQuality || ''
  }
  
  for (const [key, value] of Object.entries(metaFields)) {
    if (!customFields.find(cf => cf.id.includes(key))) {
      const field = Array.from(fieldMap.values()).find(f => 
        f.name.toLowerCase().includes(key.toLowerCase())
      )
      if (field) {
        customFields.push({
          id: field.id,
          field_value: String(value)
        })
      }
    }
  }
  
  console.log(`[Complete Mapping] Total custom fields mapped: ${customFields.length}`)
  return customFields
}