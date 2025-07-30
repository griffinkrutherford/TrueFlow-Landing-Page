/**
 * TrueFlow-specific Field Mapping for GoHighLevel
 * Maps form data to the actual TrueFlow custom fields that exist in GHL
 */

export interface GHLField {
  id: string
  name: string
  fieldKey?: string
  dataType?: string
}

export interface MappedField {
  key: string
  field_value: string
}

/**
 * Mapping of TrueFlow form fields to actual GHL custom field keys
 * These are the ACTUAL field keys that exist in GoHighLevel
 */
export const TRUEFLOW_FIELD_MAPPING: Record<string, string> = {
  // Basic contact information
  'businessName': 'trueflow_business_name',
  'firstName': 'trueflow_first_name',
  'lastName': 'trueflow_last_name',
  'email': 'trueflow_email',
  'phone': 'trueflow_phone',
  
  // Business profile fields
  'businessType': 'trueflow_business_type',
  'contentGoals': 'trueflow_content_goals',
  'integrations': 'trueflow_integration_preferences',
  'selectedPlan': 'trueflow_selected_plan',
  'pricingPlan': 'trueflow_pricing_plan',
  
  // Get-started specific fields
  'monthlyLeads': 'trueflow_monthly_leads',
  'teamSize': 'trueflow_team_size',
  'currentTools': 'trueflow_current_tools',
  'biggestChallenge': 'trueflow_biggest_challenge',
  
  // Assessment-specific fields
  'leadScore': 'trueflow_lead_score',
  'assessmentScore': 'trueflow_assessment_score',
  'readinessLevel': 'trueflow_readiness_level',
  'recommendedPlan': 'trueflow_recommended_plan',
  'assessmentAnswers': 'trueflow_assessment_answers',
  'answers': 'trueflow_raw_answers',
  'scorePercentage': 'trueflow_score_percentage',
  'totalScore': 'trueflow_total_score',
  'maxPossibleScore': 'trueflow_max_score',
  'recommendation': 'trueflow_recommendation',
  
  // System fields
  'leadQuality': 'trueflow_lead_quality',
  'formType': 'trueflow_form_type',
  'submissionDate': 'trueflow_submission_date',
  'timestamp': 'trueflow_timestamp',
  'source': 'trueflow_source',
  'assessmentVersion': 'trueflow_assessment_version'
}

/**
 * Build custom fields payload using actual TrueFlow field keys
 */
export function buildTrueFlowCustomFields(
  formData: any,
  ghlFields: GHLField[],
  formType: 'assessment' | 'get-started'
): MappedField[] {
  console.log('[TrueFlow Fields] Building custom fields with actual GHL keys...')
  console.log('[TrueFlow Fields] Form type:', formType)
  
  const mappedFields: MappedField[] = []
  
  // Create a lookup map of GHL fields by fieldKey (without contact. prefix)
  const ghlFieldMap = new Map<string, GHLField>()
  ghlFields.forEach(field => {
    if (field.fieldKey) {
      // Store both with and without contact. prefix
      const keyWithoutPrefix = field.fieldKey.replace(/^contact\./, '')
      ghlFieldMap.set(keyWithoutPrefix, field)
      ghlFieldMap.set(field.fieldKey, field)
    }
  })
  
  // Map form data to TrueFlow custom fields
  Object.entries(TRUEFLOW_FIELD_MAPPING).forEach(([formKey, ghlKey]) => {
    const value = formData[formKey]
    if (value !== undefined && value !== null && value !== '') {
      // Check if this field exists in GHL
      const ghlField = ghlFieldMap.get(ghlKey)
      if (ghlField) {
        let fieldValue: string
        
        // Handle different data types
        if (Array.isArray(value)) {
          fieldValue = value.join(', ')
        } else if (typeof value === 'object') {
          fieldValue = JSON.stringify(value)
        } else {
          fieldValue = String(value)
        }
        
        mappedFields.push({
          key: ghlKey,
          field_value: fieldValue
        })
        
        console.log(`[TrueFlow Fields] ✓ Mapped ${formKey} -> ${ghlKey}: "${fieldValue.substring(0, 50)}${fieldValue.length > 50 ? '...' : ''}"`)
      } else {
        console.warn(`[TrueFlow Fields] ✗ Field not found in GHL: ${ghlKey} (for ${formKey})`)
      }
    }
  })
  
  // Add form type if field exists
  const formTypeField = ghlFieldMap.get('form_type') || ghlFieldMap.get('trueflow_form_type')
  if (formTypeField) {
    const key = formTypeField.fieldKey?.replace(/^contact\./, '') || 'form_type'
    mappedFields.push({
      key,
      field_value: formType
    })
  }
  
  // Add submission date if field exists
  const submissionDateField = ghlFieldMap.get('trueflow_submission_date')
  if (submissionDateField) {
    const key = submissionDateField.fieldKey?.replace(/^contact\./, '') || 'trueflow_submission_date'
    mappedFields.push({
      key,
      field_value: new Date().toISOString()
    })
  }
  
  // Handle assessment-specific fields
  if (formType === 'assessment' && formData.answers) {
    // Store full assessment answers as JSON
    const assessmentField = ghlFields.find(f => 
      f.fieldKey?.includes('trueflow_assessment_answers') || 
      f.name?.toLowerCase().includes('assessment answers')
    )
    
    if (assessmentField) {
      const answersJson = JSON.stringify(formData.answers, null, 2)
      const key = assessmentField.fieldKey?.replace(/^contact\./, '') || 'trueflow_assessment_answers'
      
      mappedFields.push({
        key,
        field_value: answersJson.substring(0, 5000) // Limit to 5000 chars
      })
      
      console.log(`[TrueFlow Fields] ✓ Added assessment answers (${answersJson.length} chars)`)
    }
  }
  
  console.log(`[TrueFlow Fields] Total mapped fields: ${mappedFields.length}`)
  return mappedFields
}

/**
 * Get all available TrueFlow fields from GHL
 */
export function getTrueFlowFields(ghlFields: GHLField[]): GHLField[] {
  return ghlFields.filter(field => 
    field.fieldKey?.includes('trueflow_') || 
    field.name?.toLowerCase().includes('trueflow')
  )
}

/**
 * Log which TrueFlow fields are missing from GHL
 */
export function logMissingTrueFlowFields(ghlFields: GHLField[]): void {
  console.log('[TrueFlow Fields] Checking for missing TrueFlow fields...')
  
  const ghlKeys = new Set(
    ghlFields
      .map(f => f.fieldKey?.replace(/^contact\./, ''))
      .filter(Boolean)
  )
  
  const requiredFields = Object.values(TRUEFLOW_FIELD_MAPPING)
  const missingFields = requiredFields.filter(key => !ghlKeys.has(key))
  
  if (missingFields.length > 0) {
    console.warn(`[TrueFlow Fields] Missing ${missingFields.length} TrueFlow fields:`)
    missingFields.forEach(field => {
      console.warn(`[TrueFlow Fields]   - ${field}`)
    })
  } else {
    console.log('[TrueFlow Fields] ✅ All required TrueFlow fields are present in GHL')
  }
  
  // Log available TrueFlow fields
  const trueFlowFields = getTrueFlowFields(ghlFields)
  console.log(`[TrueFlow Fields] Found ${trueFlowFields.length} TrueFlow fields in GHL:`)
  trueFlowFields.forEach(field => {
    const key = field.fieldKey?.replace(/^contact\./, '') || 'N/A'
    console.log(`[TrueFlow Fields]   - ${field.name} (${key})`)
  })
}