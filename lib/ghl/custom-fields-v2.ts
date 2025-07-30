/**
 * Enhanced Custom Fields Management for GoHighLevel
 * This module handles custom field definitions, creation, and management
 */

export interface CustomFieldDefinition {
  name: string
  fieldKey: string
  dataType: 'TEXT' | 'LARGE_TEXT' | 'NUMERICAL' | 'DATE' | 'CHECKBOX' | 'SINGLE_OPTIONS' | 'MULTIPLE_OPTIONS'
  description?: string
  placeholder?: string
  showInForms?: boolean
  options?: Array<{ key: string; label: string }>
}

// GHL API configuration
const GHL_API_BASE = 'https://services.leadconnectorhq.com'
const GHL_API_VERSION = '2021-07-28' // Fixed version for consistency

// Define all TrueFlow custom fields for the Get Started form
export const getStartedCustomFields: CustomFieldDefinition[] = [
  // Contact Information
  {
    name: 'Business Name',
    fieldKey: 'trueflow_business_name',
    dataType: 'TEXT',
    description: 'Name of the business',
    placeholder: 'Enter business name',
    showInForms: true
  },
  {
    name: 'Business Type',
    fieldKey: 'trueflow_business_type',
    dataType: 'SINGLE_OPTIONS',
    description: 'Type of business',
    showInForms: true,
    options: [
      { key: 'content_creator', label: 'Content Creator' },
      { key: 'podcaster', label: 'Podcast Host' },
      { key: 'business_owner', label: 'Business Owner' },
      { key: 'coach', label: 'Coach or Consultant' },
      { key: 'agency', label: 'Marketing Agency' },
      { key: 'other', label: 'Other Professional' }
    ]
  },
  
  // Get Started Form Specific Fields
  {
    name: 'Content Goals',
    fieldKey: 'trueflow_content_goals',
    dataType: 'MULTIPLE_OPTIONS',
    description: 'Content creation goals',
    showInForms: true,
    options: [
      { key: 'newsletters', label: 'Email Newsletters' },
      { key: 'blogs', label: 'Blog Posts' },
      { key: 'social', label: 'Social Media Content' },
      { key: 'courses', label: 'Course Content' },
      { key: 'sales', label: 'Sales Materials' },
      { key: 'support', label: 'Customer Support' }
    ]
  },
  {
    name: 'Integration Preferences',
    fieldKey: 'trueflow_integrations',
    dataType: 'MULTIPLE_OPTIONS',
    description: 'Preferred integrations',
    showInForms: true,
    options: [
      { key: 'gohighlevel', label: 'GoHighLevel' },
      { key: 'mailchimp', label: 'Mailchimp' },
      { key: 'convertkit', label: 'ConvertKit' },
      { key: 'hubspot', label: 'HubSpot' },
      { key: 'activecampaign', label: 'ActiveCampaign' },
      { key: 'zapier', label: 'Zapier' }
    ]
  },
  {
    name: 'Selected Plan',
    fieldKey: 'trueflow_selected_plan',
    dataType: 'SINGLE_OPTIONS',
    description: 'Selected pricing plan',
    showInForms: true,
    options: [
      { key: 'content_engine', label: 'Content Engine' },
      { key: 'complete_system', label: 'Complete System' },
      { key: 'custom_enterprise', label: 'Custom Enterprise' },
      { key: 'not_sure', label: 'Not Sure Yet' }
    ]
  },
  
  // Metadata fields
  {
    name: 'Submission Date',
    fieldKey: 'trueflow_submission_date',
    dataType: 'DATE',
    description: 'Date of form submission',
    showInForms: false
  },
  {
    name: 'Lead Score',
    fieldKey: 'trueflow_lead_score',
    dataType: 'NUMERICAL',
    description: 'Calculated lead quality score (0-100)',
    showInForms: false
  },
  {
    name: 'Lead Quality',
    fieldKey: 'trueflow_lead_quality',
    dataType: 'SINGLE_OPTIONS',
    description: 'Lead qualification status',
    showInForms: false,
    options: [
      { key: 'hot', label: 'Hot Lead' },
      { key: 'warm', label: 'Warm Lead' },
      { key: 'cold', label: 'Cold Lead' }
    ]
  }
]

// Assessment form specific fields
export const assessmentCustomFields: CustomFieldDefinition[] = [
  {
    name: 'Assessment Score',
    fieldKey: 'trueflow_assessment_score',
    dataType: 'NUMERICAL',
    description: 'Overall assessment score percentage',
    showInForms: false
  },
  {
    name: 'Readiness Level',
    fieldKey: 'trueflow_readiness_level',
    dataType: 'TEXT',
    description: 'AI readiness level based on assessment',
    showInForms: false
  },
  {
    name: 'Recommended Plan',
    fieldKey: 'trueflow_recommended_plan',
    dataType: 'TEXT',
    description: 'AI-recommended plan based on assessment',
    showInForms: false
  },
  {
    name: 'Current Content Creation',
    fieldKey: 'trueflow_current_content',
    dataType: 'SINGLE_OPTIONS',
    description: 'How they currently create content',
    showInForms: false,
    options: [
      { key: 'manual', label: 'Manually write everything' },
      { key: 'outsource', label: 'Outsource to freelancers/agencies' },
      { key: 'team', label: 'Have an in-house content team' },
      { key: 'mixed', label: 'Mix of manual and automated tools' }
    ]
  },
  {
    name: 'Content Volume',
    fieldKey: 'trueflow_content_volume',
    dataType: 'SINGLE_OPTIONS',
    description: 'Monthly content production needs',
    showInForms: false,
    options: [
      { key: 'minimal', label: '1-5 pieces' },
      { key: 'moderate', label: '6-20 pieces' },
      { key: 'high', label: '21-50 pieces' },
      { key: 'very_high', label: '50+ pieces' }
    ]
  },
  {
    name: 'CRM Usage',
    fieldKey: 'trueflow_crm_usage',
    dataType: 'SINGLE_OPTIONS',
    description: 'Current CRM usage',
    showInForms: false,
    options: [
      { key: 'spreadsheets', label: 'Spreadsheets or manual tracking' },
      { key: 'basic_crm', label: 'Basic CRM system' },
      { key: 'advanced_crm', label: 'Advanced CRM with automation' },
      { key: 'integrated', label: 'Fully integrated systems' }
    ]
  },
  {
    name: 'Lead Response Time',
    fieldKey: 'trueflow_lead_response',
    dataType: 'SINGLE_OPTIONS',
    description: 'Typical lead response time',
    showInForms: false,
    options: [
      { key: 'days', label: 'Within a few days' },
      { key: 'hours', label: 'Within 24 hours' },
      { key: 'quick', label: 'Within a few hours' },
      { key: 'instant', label: 'Almost instantly' }
    ]
  },
  {
    name: 'Time on Repetitive Tasks',
    fieldKey: 'trueflow_time_spent',
    dataType: 'SINGLE_OPTIONS',
    description: 'Weekly time spent on repetitive tasks',
    showInForms: false,
    options: [
      { key: 'minimal', label: 'Less than 5 hours' },
      { key: 'moderate', label: '5-15 hours' },
      { key: 'high', label: '15-30 hours' },
      { key: 'very_high', label: 'More than 30 hours' }
    ]
  },
  {
    name: 'Monthly Budget',
    fieldKey: 'trueflow_budget',
    dataType: 'SINGLE_OPTIONS',
    description: 'Budget for content and customer management',
    showInForms: false,
    options: [
      { key: 'low', label: 'Less than $500' },
      { key: 'moderate', label: '$500 - $2,000' },
      { key: 'high', label: '$2,000 - $5,000' },
      { key: 'enterprise', label: 'More than $5,000' }
    ]
  }
]

// Combine all custom fields
export const allCustomFields = [...getStartedCustomFields, ...assessmentCustomFields]

/**
 * Check if custom fields exist in GoHighLevel
 */
export async function checkExistingCustomFields(
  accessToken: string,
  locationId: string
): Promise<Map<string, string>> {
  try {
    const response = await fetch(
      `${GHL_API_BASE}/locations/${locationId}/customFields?model=contact`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Version': GHL_API_VERSION,
          'Accept': 'application/json'
        }
      }
    )

    if (!response.ok) {
      console.error('[CustomFields] Failed to fetch existing fields:', response.status)
      return new Map()
    }

    const data = await response.json()
    const fieldMap = new Map<string, string>()
    
    // Map fieldKey to field ID
    if (data.customFields && Array.isArray(data.customFields)) {
      data.customFields.forEach((field: any) => {
        if (field.fieldKey) {
          fieldMap.set(field.fieldKey, field.id)
          console.log(`[CustomFields] Found existing field: ${field.fieldKey} -> ${field.id}`)
        }
      })
    }
    
    return fieldMap
  } catch (error) {
    console.error('[CustomFields] Error checking existing fields:', error)
    return new Map()
  }
}

/**
 * Create a custom field in GoHighLevel
 */
export async function createCustomField(
  field: CustomFieldDefinition,
  accessToken: string,
  locationId: string
): Promise<string | null> {
  try {
    const payload: any = {
      name: field.name,
      fieldKey: field.fieldKey,
      dataType: field.dataType,
      model: 'contact', // Changed from objectKey to model
      position: 0 // Add position field
    }
    
    if (field.description) {
      payload.description = field.description
    }
    
    if (field.placeholder) {
      payload.placeholder = field.placeholder
    }
    
    // Add options for select fields
    if (field.options && ['SINGLE_OPTIONS', 'MULTIPLE_OPTIONS'].includes(field.dataType)) {
      payload.options = field.options
    }
    
    console.log(`[CustomFields] Creating field: ${field.fieldKey}`)
    
    const response = await fetch(`${GHL_API_BASE}/locations/${locationId}/customFields`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Version': GHL_API_VERSION,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[CustomFields] Failed to create field ${field.fieldKey}:`, errorText)
      return null
    }
    
    const result = await response.json()
    console.log(`[CustomFields] Created field ${field.fieldKey} with ID: ${result.field?.id}`)
    return result.field?.id || null
    
  } catch (error) {
    console.error(`[CustomFields] Error creating field ${field.fieldKey}:`, error)
    return null
  }
}

/**
 * Ensure all required custom fields exist
 */
export async function ensureCustomFieldsExist(
  accessToken: string,
  locationId: string
): Promise<Map<string, string>> {
  console.log('[CustomFields] Ensuring all custom fields exist...')
  
  // Get existing fields
  const existingFields = await checkExistingCustomFields(accessToken, locationId)
  console.log(`[CustomFields] Found ${existingFields.size} existing custom fields`)
  
  // Create missing fields
  const fieldsToCreate = allCustomFields.filter(field => !existingFields.has(field.fieldKey))
  console.log(`[CustomFields] Need to create ${fieldsToCreate.length} fields`)
  
  for (const field of fieldsToCreate) {
    const fieldId = await createCustomField(field, accessToken, locationId)
    if (fieldId) {
      existingFields.set(field.fieldKey, fieldId)
    }
  }
  
  console.log(`[CustomFields] Total fields available: ${existingFields.size}`)
  return existingFields
}

/**
 * Build custom fields payload for contact creation/update
 */
export function buildCustomFieldsPayload(
  data: any,
  fieldMap: Map<string, string>,
  formType: 'get-started' | 'assessment'
): Array<{ id: string; field_value: string }> {
  const customFields: Array<{ id: string; field_value: string }> = []
  
  // Helper to add field if it exists in the map
  const addField = (fieldKey: string, value: any) => {
    const fieldId = fieldMap.get(fieldKey)
    if (fieldId && value !== undefined && value !== null && value !== '') {
      // Convert arrays to comma-separated strings for GHL
      const fieldValue = Array.isArray(value) ? value.join(', ') : String(value)
      customFields.push({ id: fieldId, field_value: fieldValue })
      console.log(`[CustomFields] Added ${fieldKey}: ${fieldValue}`)
    }
  }
  
  // Common fields
  addField('trueflow_business_name', data.businessName)
  addField('trueflow_submission_date', data.timestamp || new Date().toISOString())
  addField('trueflow_lead_score', data.leadScore || 0)
  addField('trueflow_lead_quality', data.leadQuality || 'warm')
  
  if (formType === 'get-started') {
    // Get Started specific fields
    addField('trueflow_business_type', data.businessType)
    addField('trueflow_content_goals', data.contentGoals)
    addField('trueflow_integrations', data.integrations)
    addField('trueflow_selected_plan', data.selectedPlan)
  } else {
    // Assessment specific fields
    addField('trueflow_assessment_score', data.scorePercentage || data.score)
    addField('trueflow_readiness_level', data.readinessLevel)
    addField('trueflow_recommended_plan', data.recommendation)
    
    // Add individual assessment answers
    if (data.answers) {
      addField('trueflow_current_content', data.answers['current-content'])
      addField('trueflow_content_volume', data.answers['content-volume'])
      addField('trueflow_crm_usage', data.answers['crm-usage'])
      addField('trueflow_lead_response', data.answers['lead-response'])
      addField('trueflow_time_spent', data.answers['time-spent'])
      addField('trueflow_budget', data.answers['budget'])
    }
  }
  
  return customFields
}

/**
 * Calculate lead score based on form data
 */
export function calculateLeadScore(data: any, formType: string): number {
  let score = 50 // Base score
  
  if (formType === 'assessment') {
    // Use assessment score as base
    score = Math.min(data.scorePercentage || data.score || 50, 100)
  } else {
    // Get Started form scoring based on business indicators
    if (data.businessType === 'agency' || data.businessType === 'business_owner') {
      score += 10
    }
    
    if (data.selectedPlan === 'complete_system' || data.selectedPlan === 'custom_enterprise') {
      score += 20
    } else if (data.selectedPlan === 'content_engine') {
      score += 10
    }
    
    // More content goals = higher engagement
    if (Array.isArray(data.contentGoals) && data.contentGoals.length > 3) {
      score += 10
    }
    
    // Multiple integrations = more serious
    if (Array.isArray(data.integrations) && data.integrations.length > 2) {
      score += 10
    }
  }
  
  return Math.min(Math.max(score, 0), 100)
}

/**
 * Get lead quality based on score
 */
export function getLeadQuality(score: number): string {
  if (score >= 70) return 'hot'
  if (score >= 40) return 'warm'
  return 'cold'
}