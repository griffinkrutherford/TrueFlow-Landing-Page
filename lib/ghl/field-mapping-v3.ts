/**
 * Enhanced Field Mapping for GoHighLevel Custom Fields V3
 * Handles both get-started and assessment forms with robust field mapping
 */

import { FIELD_MAPPINGS, TRUEFLOW_CUSTOM_FIELDS, CustomFieldDefinition } from './field-definitions'

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
 * Normalize field names for comparison
 */
function normalizeFieldName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[\u2014\u2013\u2012—–]/g, '-') // Various dashes
    .replace(/[\u2019\u2018'']/g, "'") // Various apostrophes
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9\s\-_]/g, '') // Remove special chars
}

/**
 * Transform array values to string
 */
function arrayToString(value: any[], separator: string = ', '): string {
  if (!Array.isArray(value)) return String(value)
  return value.filter(v => v).join(separator)
}

/**
 * Build custom fields payload with enhanced mapping
 */
export function buildCustomFieldsPayloadV3(
  formData: any,
  ghlFields: GHLField[],
  formType: 'assessment' | 'get-started'
): MappedField[] {
  console.log('[Field Mapping V3] Starting field mapping...')
  console.log('[Field Mapping V3] Form type:', formType)
  console.log('[Field Mapping V3] Available GHL fields:', ghlFields.length)
  
  const mappedFields: MappedField[] = []
  const fieldMap = new Map<string, GHLField>()
  
  // Build a map of GHL fields by fieldKey and normalized name
  console.log('[Field Mapping V3] Building field map from GHL fields...')
  ghlFields.forEach(field => {
    console.log(`[Field Mapping V3] Processing GHL field: name="${field.name}", key="${field.fieldKey || 'none'}", id="${field.id}"`)
    if (field.fieldKey) {
      fieldMap.set(field.fieldKey, field)
      console.log(`[Field Mapping V3] Added to map by key: ${field.fieldKey}`)
    }
    const normalizedName = normalizeFieldName(field.name)
    fieldMap.set(normalizedName, field)
    console.log(`[Field Mapping V3] Added to map by normalized name: ${normalizedName}`)
  })
  console.log(`[Field Mapping V3] Field map size: ${fieldMap.size}`)
  
  // Add form type field
  const formTypeField = findFieldInGHL('form_type', 'Form Type', fieldMap, ghlFields)
  if (formTypeField) {
    const fieldKey = (formTypeField.fieldKey || '').replace(/^contact\./, '')
    mappedFields.push({
      key: fieldKey,
      field_value: formType
    })
  }
  
  // Process based on form type
  if (formType === 'get-started') {
    mapGetStartedFields(formData, fieldMap, ghlFields, mappedFields)
  } else {
    mapAssessmentFields(formData, fieldMap, ghlFields, mappedFields)
  }
  
  // Add common fields
  mapCommonFields(formData, fieldMap, ghlFields, mappedFields)
  
  // If very few fields were mapped, add a comprehensive summary field
  if (mappedFields.length < 3 && formType === 'get-started') {
    console.warn('[Field Mapping V3] WARNING: Very few fields mapped. Adding summary field...')
    
    // Try to find a notes or description field
    const summaryField = findFieldInGHL('notes', 'Notes', fieldMap, ghlFields) ||
                        findFieldInGHL('description', 'Description', fieldMap, ghlFields) ||
                        findFieldInGHL('additional_info', 'Additional Info', fieldMap, ghlFields)
    
    if (summaryField) {
      const summaryData = {
        'Form Type': formType,
        'Business Name': formData.businessName || 'Not provided',
        'Business Type': formData.businessType || 'Not provided',
        'Content Goals': Array.isArray(formData.contentGoals) ? formData.contentGoals.join(', ') : formData.contentGoals || 'Not provided',
        'Integrations': Array.isArray(formData.integrations) ? formData.integrations.join(', ') : formData.integrations || 'Not provided',
        'Selected Plan': formData.selectedPlan || 'Not provided',
        'Monthly Leads': formData.monthlyLeads || 'Not provided',
        'Team Size': formData.teamSize || 'Not provided',
        'Current Tools': formData.currentTools || 'Not provided',
        'Biggest Challenge': formData.biggestChallenge || 'Not provided',
        'Lead Score': formData.leadScore || 'Not calculated',
        'Lead Quality': formData.leadQuality || 'Not calculated'
      }
      
      const summaryText = Object.entries(summaryData)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n')
      
      const fieldKey = (summaryField.fieldKey || '').replace(/^contact\./, '')
      mappedFields.push({
        key: fieldKey,
        field_value: summaryText
      })
      
      console.log('[Field Mapping V3] Added summary field with all form data')
    }
  }
  
  console.log(`[Field Mapping V3] Final mapped fields count: ${mappedFields.length}`)
  return mappedFields
}

/**
 * Map get-started form fields
 */
function mapGetStartedFields(
  formData: any,
  fieldMap: Map<string, GHLField>,
  ghlFields: GHLField[],
  mappedFields: MappedField[]
): void {
  console.log('[Field Mapping V3] Mapping get-started fields...')
  console.log('[Field Mapping V3] Available form data:', {
    businessType: formData.businessType,
    businessName: formData.businessName,
    contentGoals: formData.contentGoals,
    integrations: formData.integrations,
    selectedPlan: formData.selectedPlan,
    monthlyLeads: formData.monthlyLeads,
    teamSize: formData.teamSize,
    currentTools: formData.currentTools,
    biggestChallenge: formData.biggestChallenge
  })
  
  // Business Type
  if (formData.businessType) {
    console.log('[Field Mapping V3] Processing businessType:', formData.businessType)
    const field = findFieldInGHL('business_type', 'Business Type', fieldMap, ghlFields)
    if (field) {
      const fieldKey = (field.fieldKey || '').replace(/^contact\./, '')
      mappedFields.push({
        key: fieldKey,
        field_value: formData.businessType
      })
      console.log('[Field Mapping V3] Successfully mapped businessType')
    } else {
      console.warn('[Field Mapping V3] Failed to find field for businessType')
    }
  }
  
  // Business Name
  if (formData.businessName) {
    console.log('[Field Mapping V3] Processing businessName:', formData.businessName)
    const field = findFieldInGHL('business_name', 'Business Name', fieldMap, ghlFields)
    if (field) {
      const fieldKey = (field.fieldKey || '').replace(/^contact\./, '')
      mappedFields.push({
        key: fieldKey,
        field_value: formData.businessName
      })
      console.log('[Field Mapping V3] Successfully mapped businessName')
    } else {
      console.warn('[Field Mapping V3] Failed to find field for businessName')
    }
  }
  
  // Content Goals
  if (formData.contentGoals) {
    console.log('[Field Mapping V3] Processing contentGoals:', formData.contentGoals)
    const field = findFieldInGHL('content_goals', 'Content Goals', fieldMap, ghlFields)
    if (field) {
      const value = Array.isArray(formData.contentGoals) 
        ? arrayToString(formData.contentGoals)
        : String(formData.contentGoals)
      const fieldKey = (field.fieldKey || '').replace(/^contact\./, '')
      mappedFields.push({
        key: fieldKey,
        field_value: value
      })
      console.log('[Field Mapping V3] Successfully mapped contentGoals:', value)
    } else {
      console.warn('[Field Mapping V3] Failed to find field for contentGoals')
    }
  }
  
  // Integrations
  if (formData.integrations) {
    console.log('[Field Mapping V3] Processing integrations:', formData.integrations)
    const field = findFieldInGHL('integration_preferences', 'Integration Preferences', fieldMap, ghlFields)
    if (field) {
      const value = Array.isArray(formData.integrations)
        ? arrayToString(formData.integrations)
        : String(formData.integrations)
      const fieldKey = (field.fieldKey || '').replace(/^contact\./, '')
      mappedFields.push({
        key: fieldKey,
        field_value: value
      })
      console.log('[Field Mapping V3] Successfully mapped integrations:', value)
    } else {
      console.warn('[Field Mapping V3] Failed to find field for integrations')
    }
  }
  
  // Selected Plan
  if (formData.selectedPlan) {
    console.log('[Field Mapping V3] Processing selectedPlan:', formData.selectedPlan)
    const field = findFieldInGHL('selected_plan', 'Selected Plan', fieldMap, ghlFields)
    if (field) {
      const fieldKey = (field.fieldKey || '').replace(/^contact\./, '')
      mappedFields.push({
        key: fieldKey,
        field_value: formData.selectedPlan
      })
      console.log('[Field Mapping V3] Successfully mapped selectedPlan')
    } else {
      console.warn('[Field Mapping V3] Failed to find field for selectedPlan')
    }
  }
  
  // Additional get-started fields
  const additionalFields = [
    { key: 'monthlyLeads', fieldKey: 'monthly_leads', name: 'Monthly Leads' },
    { key: 'teamSize', fieldKey: 'team_size', name: 'Team Size' },
    { key: 'currentTools', fieldKey: 'current_tools', name: 'Current Tools' },
    { key: 'biggestChallenge', fieldKey: 'biggest_challenge', name: 'Biggest Challenge' }
  ]
  
  additionalFields.forEach(({ key, fieldKey, name }) => {
    if (formData[key]) {
      console.log(`[Field Mapping V3] Processing ${key}:`, formData[key])
      const field = findFieldInGHL(fieldKey, name, fieldMap, ghlFields)
      if (field) {
        const value = Array.isArray(formData[key])
          ? arrayToString(formData[key])
          : String(formData[key])
        const fieldKey = (field.fieldKey || '').replace(/^contact\./, '')
        mappedFields.push({
          key: fieldKey,
          field_value: value
        })
        console.log(`[Field Mapping V3] Successfully mapped ${key}:`, value)
      } else {
        console.warn(`[Field Mapping V3] Failed to find field for ${key}`)
      }
    } else {
      console.log(`[Field Mapping V3] Skipping ${key} - no value provided`)
    }
  })
}

/**
 * Map assessment form fields
 */
function mapAssessmentFields(
  formData: any,
  fieldMap: Map<string, GHLField>,
  ghlFields: GHLField[],
  mappedFields: MappedField[]
): void {
  // Map assessment answers
  if (formData.answers) {
    const answerMappings = [
      { key: 'current-content', fieldKey: 'current_content_creation', name: 'Current Content Creation' },
      { key: 'content-volume', fieldKey: 'content_volume', name: 'Content Volume' },
      { key: 'crm-usage', fieldKey: 'crm_usage', name: 'CRM Usage' },
      { key: 'lead-response', fieldKey: 'lead_response_time', name: 'Lead Response Time' },
      { key: 'time-spent', fieldKey: 'time_on_repetitive_tasks', name: 'Time on Repetitive Tasks' },
      { key: 'budget', fieldKey: 'revenue_range', name: 'Revenue Range' }
    ]
    
    answerMappings.forEach(({ key, fieldKey, name }) => {
      if (formData.answers[key]) {
        const field = findFieldInGHL(fieldKey, name, fieldMap, ghlFields)
        if (field) {
          const ghlFieldKey = (field.fieldKey || '').replace(/^contact\./, '')
          mappedFields.push({
            key: ghlFieldKey,
            field_value: formData.answers[key]
          })
        }
      }
    })
  }
  
  // Assessment Score
  if (formData.assessmentScore || formData.scorePercentage) {
    const field = findFieldInGHL('assessment_score', 'Assessment Score', fieldMap, ghlFields)
    if (field) {
      const score = formData.assessmentScore || formData.scorePercentage || 0
      const fieldKey = (field.fieldKey || '').replace(/^contact\./, '')
      mappedFields.push({
        key: fieldKey,
        field_value: String(Math.round(score))
      })
    }
  }
  
  // Readiness Level
  if (formData.readinessLevel) {
    const field = findFieldInGHL('readiness_level', 'Readiness Level', fieldMap, ghlFields)
    if (field) {
      const fieldKey = (field.fieldKey || '').replace(/^contact\./, '')
      mappedFields.push({
        key: fieldKey,
        field_value: formData.readinessLevel
      })
    }
  }
  
  // Store full assessment answers as JSON
  if (formData.assessmentAnswers) {
    const field = findFieldInGHL('assessment_answers', 'Assessment Answers', fieldMap, ghlFields)
    if (field) {
      const value = typeof formData.assessmentAnswers === 'string'
        ? formData.assessmentAnswers
        : JSON.stringify(formData.assessmentAnswers)
      const fieldKey = (field.fieldKey || '').replace(/^contact\./, '')
      mappedFields.push({
        key: fieldKey,
        field_value: value.substring(0, 5000) // Limit to 5000 chars
      })
    }
  }
}

/**
 * Map common fields that apply to both forms
 */
function mapCommonFields(
  formData: any,
  fieldMap: Map<string, GHLField>,
  ghlFields: GHLField[],
  mappedFields: MappedField[]
): void {
  // Lead Score
  if (formData.leadScore !== undefined) {
    const field = findFieldInGHL('lead_score', 'Lead Score', fieldMap, ghlFields)
    if (field) {
      const fieldKey = (field.fieldKey || '').replace(/^contact\./, '')
      mappedFields.push({
        key: fieldKey,
        field_value: String(Math.round(formData.leadScore))
      })
    }
  }
  
  // Lead Quality
  if (formData.leadQuality) {
    const field = findFieldInGHL('lead_quality', 'Lead Quality', fieldMap, ghlFields)
    if (field) {
      const fieldKey = (field.fieldKey || '').replace(/^contact\./, '')
      mappedFields.push({
        key: fieldKey,
        field_value: formData.leadQuality
      })
    }
  }
  
  // Submission Date
  if (formData.submissionDate || formData.timestamp) {
    const field = findFieldInGHL('submission_date', 'Submission Date', fieldMap, ghlFields)
    if (field) {
      const date = new Date(formData.submissionDate || formData.timestamp)
      const fieldKey = (field.fieldKey || '').replace(/^contact\./, '')
      mappedFields.push({
        key: fieldKey,
        field_value: date.toISOString()
      })
    }
  }
}

/**
 * Find a field in GHL by fieldKey or name
 */
function findFieldInGHL(
  fieldKey: string,
  fieldName: string,
  fieldMap: Map<string, GHLField>,
  ghlFields: GHLField[]
): GHLField | null {
  console.log(`[Field Mapping V3] Looking for field: key="${fieldKey}", name="${fieldName}"`)
  
  // Try fieldKey first
  let field = fieldMap.get(fieldKey)
  if (field) {
    console.log(`[Field Mapping V3] ✓ Found field by key: ${fieldKey} -> ${field.name} (id: ${field.id})`)
    return field
  }
  
  // Try normalized name
  const normalizedFieldName = normalizeFieldName(fieldName)
  field = fieldMap.get(normalizedFieldName)
  if (field) {
    console.log(`[Field Mapping V3] ✓ Found field by normalized name: ${fieldName} -> ${field.name} (id: ${field.id})`)
    return field
  }
  
  // Try exact name match
  field = ghlFields.find(f => f.name === fieldName)
  if (field) {
    console.log(`[Field Mapping V3] ✓ Found field by exact name: ${fieldName} (id: ${field.id})`)
    return field
  }
  
  // Try case-insensitive match
  field = ghlFields.find(f => f.name.toLowerCase() === fieldName.toLowerCase())
  if (field) {
    console.log(`[Field Mapping V3] ✓ Found field by case-insensitive match: ${fieldName} -> ${field.name} (id: ${field.id})`)
    return field
  }
  
  // Log available keys for debugging
  console.warn(`[Field Mapping V3] ✗ Field not found: ${fieldName} (key: ${fieldKey})`)
  console.warn(`[Field Mapping V3] Available field keys in map: ${Array.from(fieldMap.keys()).slice(0, 5).join(', ')}...`)
  
  return null
}

/**
 * Log missing fields for debugging
 */
export function logMissingFields(ghlFields: GHLField[]): void {
  console.log('[Field Mapping V3] Checking for missing fields...')
  
  const ghlFieldKeys = new Set(ghlFields.map(f => f.fieldKey).filter(Boolean))
  const ghlFieldNames = new Set(ghlFields.map(f => normalizeFieldName(f.name)))
  
  TRUEFLOW_CUSTOM_FIELDS.forEach(fieldDef => {
    const hasField = ghlFieldKeys.has(fieldDef.fieldKey) || 
                     ghlFieldNames.has(normalizeFieldName(fieldDef.name))
    
    if (!hasField) {
      console.warn(`[Field Mapping V3] Missing field: ${fieldDef.name} (key: ${fieldDef.fieldKey})`)
    }
  })
}