/**
 * Custom Fields Management for GoHighLevel
 * This module handles custom field definitions, caching, and scoring
 */

export interface CustomFieldDefinition {
  name: string
  fieldKey: string
  dataType: 'TEXT' | 'LARGE_TEXT' | 'NUMERICAL' | 'DATE' | 'CHECKBOX' | 'SINGLE_OPTIONS' | 'MULTIPLE_OPTIONS'
  description?: string
  showInForms?: boolean
  options?: Array<{ key: string; label: string }>
}

// Define all TrueFlow custom fields
export const TRUEFLOW_CUSTOM_FIELDS: CustomFieldDefinition[] = [
  // Core tracking fields
  {
    name: 'TrueFlow Form Type',
    fieldKey: 'trueflow_form_type',
    dataType: 'TEXT',
    description: 'Type of form submitted (assessment or get-started)',
    showInForms: false
  },
  {
    name: 'TrueFlow Submission Date',
    fieldKey: 'trueflow_submission_date',
    dataType: 'DATE',
    description: 'Date and time of form submission',
    showInForms: false
  },
  {
    name: 'TrueFlow Lead Quality Score',
    fieldKey: 'trueflow_lead_quality_score',
    dataType: 'NUMERICAL',
    description: 'Calculated lead quality score (0-100)',
    showInForms: false
  },
  {
    name: 'TrueFlow Qualification Status',
    fieldKey: 'trueflow_qualification_status',
    dataType: 'SINGLE_OPTIONS',
    description: 'Lead qualification status',
    showInForms: false,
    options: [
      { key: 'hot', label: 'Hot Lead' },
      { key: 'warm', label: 'Warm Lead' },
      { key: 'cold', label: 'Cold Lead' }
    ]
  },
  
  // Business information
  {
    name: 'Business Type',
    fieldKey: 'trueflow_business_type',
    dataType: 'TEXT',
    description: 'Type of business',
    showInForms: true
  },
  {
    name: 'Business Name',
    fieldKey: 'trueflow_business_name',
    dataType: 'TEXT',
    description: 'Name of the business',
    showInForms: true
  },
  
  // Get Started specific fields
  {
    name: 'Content Goals',
    fieldKey: 'trueflow_content_goals',
    dataType: 'LARGE_TEXT',
    description: 'Content creation goals',
    showInForms: true
  },
  {
    name: 'Monthly Leads',
    fieldKey: 'trueflow_monthly_leads',
    dataType: 'TEXT',
    description: 'Expected monthly lead volume',
    showInForms: true
  },
  {
    name: 'Team Size',
    fieldKey: 'trueflow_team_size',
    dataType: 'TEXT',
    description: 'Size of the team',
    showInForms: true
  },
  {
    name: 'Current Tools',
    fieldKey: 'trueflow_current_tools',
    dataType: 'LARGE_TEXT',
    description: 'Tools currently being used',
    showInForms: true
  },
  {
    name: 'Biggest Challenge',
    fieldKey: 'trueflow_biggest_challenge',
    dataType: 'LARGE_TEXT',
    description: 'Primary business challenge',
    showInForms: true
  },
  {
    name: 'Selected Plan',
    fieldKey: 'trueflow_selected_plan',
    dataType: 'TEXT',
    description: 'Pricing plan selected',
    showInForms: true
  },
  
  // Assessment specific fields
  {
    name: 'Assessment Score',
    fieldKey: 'trueflow_assessment_score',
    dataType: 'NUMERICAL',
    description: 'Assessment quiz score',
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
    name: 'Assessment Answers',
    fieldKey: 'trueflow_assessment_answers',
    dataType: 'LARGE_TEXT',
    description: 'All assessment question answers (JSON)',
    showInForms: false
  },
  
  // Additional qualification fields
  {
    name: 'Budget Range',
    fieldKey: 'trueflow_budget_range',
    dataType: 'TEXT',
    description: 'Expected budget range',
    showInForms: true
  },
  {
    name: 'Timeline',
    fieldKey: 'trueflow_timeline',
    dataType: 'TEXT',
    description: 'Implementation timeline',
    showInForms: true
  },
  {
    name: 'Decision Maker',
    fieldKey: 'trueflow_decision_maker',
    dataType: 'TEXT',
    description: 'Is this person the decision maker',
    showInForms: true
  }
]

// Cache for field IDs (field key -> GHL field ID mapping)
interface FieldCache {
  [fieldKey: string]: {
    id: string
    expiresAt: number
  }
}

let fieldIdCache: FieldCache = {}
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

/**
 * Get cached field ID or return null if expired/not found
 */
export function getCachedFieldId(fieldKey: string): string | null {
  const cached = fieldIdCache[fieldKey]
  if (!cached) return null
  
  if (Date.now() > cached.expiresAt) {
    delete fieldIdCache[fieldKey]
    return null
  }
  
  return cached.id
}

/**
 * Cache a field ID
 */
export function cacheFieldId(fieldKey: string, fieldId: string) {
  fieldIdCache[fieldKey] = {
    id: fieldId,
    expiresAt: Date.now() + CACHE_DURATION
  }
}

/**
 * Clear the field cache (useful for testing)
 */
export function clearFieldCache() {
  fieldIdCache = {}
}

/**
 * Calculate lead quality score based on form data
 */
export function calculateLeadQualityScore(data: any, formType: string): number {
  let score = 0
  
  if (formType === 'assessment') {
    // Base score from assessment result
    score = Math.min(data.score || 0, 100)
    
    // Boost for immediate timeline
    if (data.answers?.timeline === 'immediate') score = Math.min(score + 10, 100)
    
    // Boost for being decision maker
    if (data.answers?.['decision-maker'] === 'yes') score = Math.min(score + 10, 100)
    
    // Boost for high budget
    if (data.answers?.budget === 'high') score = Math.min(score + 10, 100)
  } else {
    // Get Started form scoring
    score = 50 // Base score
    
    // Monthly leads scoring
    if (data.monthlyLeads === '100+') score += 20
    else if (data.monthlyLeads === '50-100') score += 15
    else if (data.monthlyLeads === '10-50') score += 10
    else if (data.monthlyLeads === '0-10') score += 5
    
    // Team size scoring
    if (data.teamSize === '10+') score += 15
    else if (data.teamSize === '5-10') score += 10
    else if (data.teamSize === '2-5') score += 5
    
    // Plan selection scoring
    const planScores: Record<string, number> = {
      'enterprise': 15,
      'growth': 10,
      'professional': 5,
      'starter': 0
    }
    score += planScores[data.pricingPlan?.toLowerCase()] || 0
    
    // Current tools (more tools = more sophisticated)
    if (Array.isArray(data.currentTools) && data.currentTools.length > 3) score += 5
    
    // Business type scoring
    const businessTypeScores: Record<string, number> = {
      'agency': 10,
      'saas': 10,
      'ecommerce': 5,
      'consultant': 5
    }
    const businessType = data.businessType?.toLowerCase().replace(/[^a-z]/g, '')
    score += businessTypeScores[businessType] || 0
  }
  
  return Math.min(Math.max(score, 0), 100) // Ensure 0-100 range
}

/**
 * Get qualification status based on score
 */
export function getQualificationStatus(score: number): string {
  if (score >= 70) return 'hot'
  if (score >= 40) return 'warm'
  return 'cold'
}

/**
 * Build custom fields array for contact creation
 * This creates the array format expected by GHL's contact API
 */
export function buildCustomFieldsPayload(
  data: any,
  formType: string,
  existingFields: any[]
): Array<{ id: string; field_value: string }> {
  const fields: Array<{ id: string; field_value: string }> = []
  
  // Helper to add field if it exists
  const addField = (fieldKey: string, value: any) => {
    if (value === undefined || value === null || value === '') return
    
    // Try cache first
    let fieldId = getCachedFieldId(fieldKey)
    
    // If not in cache, look in existing fields
    if (!fieldId) {
      const field = existingFields.find(f => f.fieldKey === fieldKey)
      if (field) {
        fieldId = field.id
        cacheFieldId(fieldKey, fieldId)
      }
    }
    
    if (fieldId) {
      fields.push({
        id: fieldId,
        field_value: typeof value === 'object' ? JSON.stringify(value) : String(value)
      })
    }
  }
  
  // Calculate lead quality score
  const leadScore = calculateLeadQualityScore(data, formType)
  const qualStatus = getQualificationStatus(leadScore)
  
  // Add common fields
  addField('trueflow_form_type', formType)
  addField('trueflow_submission_date', data.timestamp || new Date().toISOString())
  addField('trueflow_lead_quality_score', leadScore)
  addField('trueflow_qualification_status', qualStatus)
  addField('trueflow_business_name', data.businessName)
  
  if (formType === 'assessment') {
    // Assessment specific
    addField('trueflow_assessment_score', data.score)
    addField('trueflow_recommended_plan', data.recommendation)
    addField('trueflow_assessment_answers', data.answers)
    
    // Extract specific answers
    if (data.answers) {
      addField('trueflow_budget_range', data.answers.budget)
      addField('trueflow_timeline', data.answers.timeline)
      addField('trueflow_decision_maker', data.answers['decision-maker'])
    }
  } else {
    // Get Started specific
    addField('trueflow_business_type', data.businessType)
    addField('trueflow_content_goals', 
      Array.isArray(data.contentGoals) ? data.contentGoals.join(', ') : data.contentGoals
    )
    addField('trueflow_monthly_leads', data.monthlyLeads)
    addField('trueflow_team_size', data.teamSize)
    addField('trueflow_current_tools', 
      Array.isArray(data.currentTools) ? data.currentTools.join(', ') : data.currentTools
    )
    addField('trueflow_biggest_challenge', data.biggestChallenge)
    addField('trueflow_selected_plan', data.pricingPlan)
  }
  
  return fields
}