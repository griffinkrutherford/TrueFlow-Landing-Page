/**
 * Verbatim Field Mapping System for GoHighLevel Integration
 * Creates custom fields with EXACT form question text and preserves data types as strings
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

export interface VerbatimFieldDefinition {
  name: string // Exact question text from the form
  dataType: 'TEXT' | 'LARGE_TEXT' | 'NUMBER' | 'SINGLE_OPTIONS' | 'MULTIPLE_OPTIONS' | 'DATE' | 'CHECKBOX'
  placeholder?: string
  picklistOptions?: string[]
  description?: string
  preserveAsString: boolean // Always preserve as string, don't transform
}

/**
 * VERBATIM mapping of Get Started form fields using EXACT question text
 * This preserves the exact form questions and data types as strings
 */
export const VERBATIM_GET_STARTED_FIELDS: Record<string, VerbatimFieldDefinition> = {
  // Contact Information Fields (exact as they appear in the form)
  'firstName': {
    name: 'First Name',
    dataType: 'TEXT',
    placeholder: 'Enter your first name',
    description: 'Contact first name from Get Started form',
    preserveAsString: true
  },
  'lastName': {
    name: 'Last Name', 
    dataType: 'TEXT',
    placeholder: 'Enter your last name',
    description: 'Contact last name from Get Started form',
    preserveAsString: true
  },
  'email': {
    name: 'Email Address',
    dataType: 'TEXT',
    placeholder: 'Enter your email address',
    description: 'Contact email from Get Started form',
    preserveAsString: true
  },
  'phone': {
    name: 'Phone Number',
    dataType: 'TEXT',
    placeholder: '+1 (555) 555-5555',
    description: 'Contact phone from Get Started form',
    preserveAsString: true
  },
  'businessName': {
    name: 'Business Name',
    dataType: 'TEXT',
    placeholder: 'Enter your business name',
    description: 'Business name from Get Started form',
    preserveAsString: true
  },

  // Business Type Selection (exact as in form)
  'businessType': {
    name: 'Select Your Business Type',
    dataType: 'SINGLE_OPTIONS',
    placeholder: 'Select business type',
    picklistOptions: [
      'Content Creator',
      'Podcast Host', 
      'Business Owner',
      'Coach or Consultant',
      'Marketing Agency',
      'Other Professional'
    ],
    description: 'Business type selection from Get Started form',
    preserveAsString: true
  },

  // Content Goals (exact as in form - multiple selection)
  'contentGoals': {
    name: 'What Content Do You Want to Create?',
    dataType: 'MULTIPLE_OPTIONS',
    placeholder: 'Select content types',
    picklistOptions: [
      'Email Newsletters',
      'Blog Posts',
      'Social Media Content',
      'Course Content',
      'Sales Materials',
      'Customer Support'
    ],
    description: 'Content creation goals from Get Started form',
    preserveAsString: true
  },

  // Assessment Questions (exact text from questions array)
  'currentContent': {
    name: 'How do you currently create content for your business?',
    dataType: 'SINGLE_OPTIONS',
    placeholder: 'Select current method',
    picklistOptions: [
      'Manually write everything',
      'Outsource to freelancers/agencies',
      'Have an in-house content team',
      'Mix of manual and automated tools'
    ],
    description: 'Current content creation method from assessment',
    preserveAsString: true
  },

  'contentVolume': {
    name: 'How much content do you need to produce monthly?',
    dataType: 'SINGLE_OPTIONS',
    placeholder: 'Select content volume',
    picklistOptions: [
      '1-5 pieces',
      '6-20 pieces', 
      '21-50 pieces',
      '50+ pieces'
    ],
    description: 'Monthly content volume from assessment',
    preserveAsString: true
  },

  'crmUsage': {
    name: 'How do you currently manage customer relationships?',
    dataType: 'SINGLE_OPTIONS',
    placeholder: 'Select CRM method',
    picklistOptions: [
      'Spreadsheets or manual tracking',
      'Basic CRM system',
      'Advanced CRM with automation',
      'Fully integrated systems'
    ],
    description: 'Current CRM usage from assessment',
    preserveAsString: true
  },

  'leadResponse': {
    name: 'How quickly do you typically respond to new leads?',
    dataType: 'SINGLE_OPTIONS',
    placeholder: 'Select response time',
    picklistOptions: [
      'Within a few days',
      'Within 24 hours',
      'Within a few hours',
      'Almost instantly'
    ],
    description: 'Lead response time from assessment',
    preserveAsString: true
  },

  'timeSpent': {
    name: 'How much time do you spend on repetitive tasks weekly?',
    dataType: 'SINGLE_OPTIONS',
    placeholder: 'Select time spent',
    picklistOptions: [
      'Less than 5 hours',
      '5-15 hours',
      '15-30 hours', 
      'More than 30 hours'
    ],
    description: 'Weekly time spent on repetitive tasks from assessment',
    preserveAsString: true
  },

  'budget': {
    name: 'What\'s your monthly budget for content and customer management?',
    dataType: 'SINGLE_OPTIONS',
    placeholder: 'Select budget range',
    picklistOptions: [
      'Less than $500',
      '$500 - $2,000',
      '$2,000 - $5,000',
      'More than $5,000'
    ],
    description: 'Monthly budget from assessment',
    preserveAsString: true
  },

  // Integration Preferences (exact as in form)
  'integrations': {
    name: 'Integration Preferences (Optional)',
    dataType: 'MULTIPLE_OPTIONS',
    placeholder: 'Select integrations',
    picklistOptions: [
      'GoHighLevel',
      'Mailchimp',
      'ConvertKit',
      'HubSpot',
      'ActiveCampaign',
      'Zapier'
    ],
    description: 'Integration preferences from Get Started form',
    preserveAsString: true
  },

  // Plan Selection (exact as in form)
  'selectedPlan': {
    name: 'Choose Your Plan',
    dataType: 'SINGLE_OPTIONS',
    placeholder: 'Select plan',
    picklistOptions: [
      'Content Engine',
      'Complete System',
      'Custom Enterprise',
      'Not Sure Yet'
    ],
    description: 'Selected plan from Get Started form',
    preserveAsString: true
  },

  // Assessment Results (calculated values, preserved as strings)
  'assessmentAnswers': {
    name: 'Assessment Answers (Full Details)',
    dataType: 'LARGE_TEXT',
    placeholder: 'Assessment responses',
    description: 'Complete assessment answers with questions and scores',
    preserveAsString: true
  },

  'totalScore': {
    name: 'Assessment Total Score',
    dataType: 'TEXT', // Preserve as string, not number
    placeholder: 'Score',
    description: 'Total raw score from assessment (as string)',
    preserveAsString: true
  },

  'scorePercentage': {
    name: 'Assessment Score Percentage', 
    dataType: 'TEXT', // Preserve as string, not number
    placeholder: 'Percentage',
    description: 'Score percentage from assessment (as string)',
    preserveAsString: true
  },

  'readinessLevel': {
    name: 'AI Readiness Level',
    dataType: 'SINGLE_OPTIONS',
    placeholder: 'Readiness level',
    picklistOptions: [
      'Highly Ready',
      'Ready',
      'Getting Ready',
      'Building Foundation'
    ],
    description: 'AI readiness level based on assessment',
    preserveAsString: true
  },

  'recommendation': {
    name: 'AI Recommendation',
    dataType: 'TEXT',
    placeholder: 'Recommended plan',
    description: 'AI-generated plan recommendation',
    preserveAsString: true
  },

  // Metadata (preserved as strings)
  'submissionDate': {
    name: 'Form Submission Date',
    dataType: 'TEXT', // Store as string, not date
    placeholder: 'Submission date',
    description: 'Date form was submitted (as string)',
    preserveAsString: true
  },

  'formSource': {
    name: 'Form Source',
    dataType: 'TEXT',
    placeholder: 'Source',
    description: 'Source of the form submission',
    preserveAsString: true
  },

  'assessmentVersion': {
    name: 'Assessment Version',
    dataType: 'TEXT',
    placeholder: 'Version',
    description: 'Version of the assessment form',
    preserveAsString: true
  }
}

/**
 * Create custom field in GoHighLevel with verbatim question text
 */
export async function createVerbatimCustomField(
  locationId: string,
  accessToken: string,
  fieldKey: string,
  fieldDef: VerbatimFieldDefinition
): Promise<GHLCustomField | null> {
  try {
    console.log(`[Verbatim Field Creation] Creating custom field with exact question: ${fieldDef.name}`)
    
    // Skip standard fields that conflict with GoHighLevel built-ins
    const standardFields = ['First Name', 'Last Name', 'Email Address', 'Phone Number']
    if (standardFields.includes(fieldDef.name)) {
      console.log(`[Verbatim Field Creation] ⚠️  Skipping standard field: ${fieldDef.name}`)
      return null
    }
    
    const payload = {
      name: fieldDef.name, // Use exact question text
      dataType: fieldDef.dataType,
      placeholder: fieldDef.placeholder || fieldDef.name,
      position: 0,
      model: 'contact' as const,
      ...(fieldDef.picklistOptions && fieldDef.dataType.includes('OPTIONS') && {
        options: fieldDef.picklistOptions.map(option => ({
          name: option,
          value: option
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
      console.error(`[Verbatim Field Creation] Failed to create field ${fieldDef.name}:`, errorText)
      return null
    }

    const result = await response.json()
    console.log(`[Verbatim Field Creation] ✅ Created verbatim field: ${fieldDef.name} (${result.customField?.fieldKey})`)
    return result.customField
  } catch (error) {
    console.error(`[Verbatim Field Creation] Error creating field ${fieldDef.name}:`, error)
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
      console.error('[Verbatim Field Fetch] Failed to fetch custom fields:', response.statusText)
      return []
    }

    const result = await response.json()
    return result.customFields || []
  } catch (error) {
    console.error('[Verbatim Field Fetch] Error fetching custom fields:', error)
    return []
  }
}

/**
 * Ensure all verbatim form fields exist in GHL, create missing ones
 */
export async function ensureVerbatimFieldsExist(
  locationId: string,
  accessToken: string
): Promise<Map<string, GHLCustomField>> {
  console.log('[Verbatim Field Setup] Ensuring all verbatim Get Started form fields exist in GHL...')
  
  // Get existing fields
  const existingFields = await getAllCustomFields(locationId, accessToken)
  const fieldMap = new Map<string, GHLCustomField>()
  
  // Build lookup of existing fields by name (exact match)
  const existingByName = new Map<string, GHLCustomField>()
  existingFields.forEach(field => {
    existingByName.set(field.name.trim(), field)
    fieldMap.set(field.fieldKey || field.id, field)
  })
  
  console.log(`[Verbatim Field Setup] Found ${existingFields.length} existing custom fields`)
  
  // Check each required verbatim form field
  for (const [formKey, fieldDef] of Object.entries(VERBATIM_GET_STARTED_FIELDS)) {
    const existingField = existingByName.get(fieldDef.name.trim())
    
    if (existingField) {
      console.log(`[Verbatim Field Setup] ✅ Verbatim field exists: ${fieldDef.name} (${existingField.fieldKey})`)
      fieldMap.set(formKey, existingField)
    } else {
      console.log(`[Verbatim Field Setup] ❌ Verbatim field missing: ${fieldDef.name}, creating...`)
      const newField = await createVerbatimCustomField(locationId, accessToken, formKey, fieldDef)
      
      if (newField) {
        fieldMap.set(formKey, newField)
        fieldMap.set(newField.fieldKey || newField.id, newField)
      }
    }
  }
  
  console.log(`[Verbatim Field Setup] Verbatim field setup complete. Total fields mapped: ${fieldMap.size}`)
  return fieldMap
}

/**
 * Build verbatim custom fields payload for contact creation
 * Preserves ALL data as strings exactly as submitted
 */
export function buildVerbatimCustomFields(
  formData: any,
  fieldMap: Map<string, GHLCustomField>
): Array<{ id: string; field_value: string }> {
  console.log('[Verbatim Mapping] Building verbatim custom fields payload...')
  
  const customFields: Array<{ id: string; field_value: string }> = []
  
  // Map each verbatim field, preserving exact data as strings
  for (const [formKey, fieldDef] of Object.entries(VERBATIM_GET_STARTED_FIELDS)) {
    const value = formData[formKey]
    if (value !== undefined && value !== null && value !== '') {
      const field = fieldMap.get(formKey) || Array.from(fieldMap.values()).find(f => f.name === fieldDef.name)
      
      if (field) {
        let fieldValue: string
        
        // PRESERVE EXACT DATA AS STRINGS - no transformation
        if (Array.isArray(value)) {
          // For arrays, preserve as comma-separated string or JSON based on verbatim requirement
          fieldValue = fieldDef.dataType === 'MULTIPLE_OPTIONS' 
            ? value.join(', ') // Human-readable format for multi-select
            : JSON.stringify(value) // Preserve full structure for complex data
        } else if (typeof value === 'object') {
          // For objects, preserve as JSON string
          fieldValue = JSON.stringify(value)
        } else {
          // For primitives, convert to string without transformation
          fieldValue = String(value)
        }
        
        customFields.push({
          id: field.id,
          field_value: fieldValue
        })
        console.log(`[Verbatim Mapping] ✅ Mapped ${formKey} (${fieldDef.name}): "${fieldValue.substring(0, 100)}${fieldValue.length > 100 ? '...' : ''}"`)
      } else {
        console.warn(`[Verbatim Mapping] ❌ Field not found for ${formKey} (${fieldDef.name})`)
      }
    }
  }
  
  // Add special handling for complex assessment data
  if (formData.assessmentAnswers) {
    const assessmentField = fieldMap.get('assessmentAnswers') || Array.from(fieldMap.values()).find(f => 
      f.name === 'Assessment Answers (Full Details)'
    )
    if (assessmentField) {
      // Convert assessment answers to readable string format
      const assessmentText = Array.isArray(formData.assessmentAnswers) 
        ? formData.assessmentAnswers.map((answer: any) => 
            `Q: ${answer.question}\nA: ${answer.answer} (Score: ${answer.score})\n`
          ).join('\n')
        : JSON.stringify(formData.assessmentAnswers)
      
      customFields.push({
        id: assessmentField.id,
        field_value: assessmentText
      })
      console.log(`[Verbatim Mapping] ✅ Mapped assessment answers: ${assessmentText.substring(0, 100)}...`)
    }
  }
  
  console.log(`[Verbatim Mapping] Total verbatim custom fields mapped: ${customFields.length}`)
  return customFields
}