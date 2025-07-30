/**
 * GoHighLevel Custom Field Definitions
 * This file defines all custom fields that need to exist in GHL for TrueFlow leads
 */

export interface CustomFieldDefinition {
  name: string
  fieldKey: string
  dataType: 'TEXT' | 'LARGE_TEXT' | 'NUMERICAL' | 'DATE' | 'CHECKBOX' | 'SINGLE_OPTIONS' | 'MULTIPLE_OPTIONS'
  placeholder?: string
  position?: number
  options?: string[] // For SINGLE_OPTIONS and MULTIPLE_OPTIONS
  description?: string
}

/**
 * All custom fields required for TrueFlow
 * These need to be created in GHL before leads can be properly tracked
 */
export const TRUEFLOW_CUSTOM_FIELDS: CustomFieldDefinition[] = [
  // Business Information
  {
    name: 'Business Name',
    fieldKey: 'business_name',
    dataType: 'TEXT',
    placeholder: 'Enter business name',
    position: 0,
    description: 'The name of the business or organization'
  },
  {
    name: 'Business Type',
    fieldKey: 'business_type',
    dataType: 'SINGLE_OPTIONS',
    position: 1,
    options: [
      'Content Creator',
      'Podcast Host',
      'Business Owner',
      'Coach or Consultant',
      'Marketing Agency',
      'Other Professional'
    ],
    description: 'Type of business the lead operates'
  },

  // Goals and Preferences
  {
    name: 'Content Goals',
    fieldKey: 'content_goals',
    dataType: 'LARGE_TEXT',
    position: 2,
    description: 'What content goals the lead wants to achieve (newsletters, blogs, social, etc.)'
  },
  {
    name: 'Integration Preferences',
    fieldKey: 'integration_preferences',
    dataType: 'LARGE_TEXT',
    position: 3,
    description: 'Which integrations the lead is interested in (GoHighLevel, Mailchimp, etc.)'
  },

  // Assessment Fields (for assessment form)
  {
    name: 'Current Content Creation',
    fieldKey: 'current_content_creation',
    dataType: 'SINGLE_OPTIONS',
    position: 4,
    options: [
      'Manually write everything',
      'Outsource to freelancers/agencies',
      'Have an in-house content team',
      'Mix of manual and automated tools'
    ],
    description: 'How they currently create content'
  },
  {
    name: 'Content Volume',
    fieldKey: 'content_volume',
    dataType: 'SINGLE_OPTIONS',
    position: 5,
    options: [
      '1-5 pieces',
      '6-20 pieces',
      '21-50 pieces',
      '50+ pieces'
    ],
    description: 'Monthly content volume'
  },
  {
    name: 'CRM Usage',
    fieldKey: 'crm_usage',
    dataType: 'SINGLE_OPTIONS',
    position: 6,
    options: [
      'Spreadsheets or manual tracking',
      'Basic CRM system',
      'Advanced CRM with automation',
      'Fully integrated systems'
    ],
    description: 'Current CRM usage level'
  },
  {
    name: 'Lead Response Time',
    fieldKey: 'lead_response_time',
    dataType: 'SINGLE_OPTIONS',
    position: 7,
    options: [
      'Within a few days',
      'Within 24 hours',
      'Within a few hours',
      'Almost instantly'
    ],
    description: 'How quickly they respond to leads'
  },
  {
    name: 'Time on Repetitive Tasks',
    fieldKey: 'time_on_repetitive_tasks',
    dataType: 'SINGLE_OPTIONS',
    position: 8,
    options: [
      'Less than 5 hours',
      '5-15 hours',
      '15-30 hours',
      'More than 30 hours'
    ],
    description: 'Weekly time spent on repetitive tasks'
  },
  {
    name: 'Revenue Range',
    fieldKey: 'revenue_range',
    dataType: 'SINGLE_OPTIONS',
    position: 9,
    options: [
      'Less than $500',
      '$500 - $2,000',
      '$2,000 - $5,000',
      'More than $5,000'
    ],
    description: 'Current monthly revenue range'
  },

  // Scoring and Quality
  {
    name: 'Assessment Score',
    fieldKey: 'assessment_score',
    dataType: 'NUMERICAL',
    position: 10,
    description: 'Score from readiness assessment (0-100)'
  },
  {
    name: 'Lead Score',
    fieldKey: 'lead_score',
    dataType: 'NUMERICAL',
    position: 11,
    description: 'Calculated lead score (0-100)'
  },
  {
    name: 'Lead Quality',
    fieldKey: 'lead_quality',
    dataType: 'TEXT',
    position: 12,
    description: 'Lead quality rating (hot, warm, cold)'
  },
  {
    name: 'Readiness Level',
    fieldKey: 'readiness_level',
    dataType: 'TEXT',
    position: 13,
    description: 'AI readiness level from assessment'
  },

  // Plan Selection
  {
    name: 'Selected Plan',
    fieldKey: 'selected_plan',
    dataType: 'TEXT',
    position: 14,
    description: 'Which TrueFlow plan they selected'
  },

  // Metadata
  {
    name: 'Submission Date',
    fieldKey: 'submission_date',
    dataType: 'DATE',
    position: 15,
    description: 'When the form was submitted'
  },
  {
    name: 'Form Type',
    fieldKey: 'form_type',
    dataType: 'TEXT',
    position: 16,
    description: 'Which form was submitted (get-started or assessment)'
  },
  {
    name: 'Assessment Answers',
    fieldKey: 'assessment_answers',
    dataType: 'LARGE_TEXT',
    position: 17,
    description: 'Detailed assessment answers in JSON format'
  },

  // Get Started Specific Fields
  {
    name: 'Monthly Leads',
    fieldKey: 'monthly_leads',
    dataType: 'TEXT',
    position: 18,
    description: 'Number of leads per month'
  },
  {
    name: 'Team Size',
    fieldKey: 'team_size',
    dataType: 'TEXT',
    position: 19,
    description: 'Size of their team'
  },
  {
    name: 'Current Tools',
    fieldKey: 'current_tools',
    dataType: 'LARGE_TEXT',
    position: 20,
    description: 'Tools they currently use'
  },
  {
    name: 'Biggest Challenge',
    fieldKey: 'biggest_challenge',
    dataType: 'LARGE_TEXT',
    position: 21,
    description: 'Their biggest business challenge'
  }
]

/**
 * Get field definition by field key
 */
export function getFieldByKey(fieldKey: string): CustomFieldDefinition | undefined {
  return TRUEFLOW_CUSTOM_FIELDS.find(field => field.fieldKey === fieldKey)
}

/**
 * Get field definition by name (case-insensitive)
 */
export function getFieldByName(name: string): CustomFieldDefinition | undefined {
  const normalizedName = name.toLowerCase().trim()
  return TRUEFLOW_CUSTOM_FIELDS.find(field => 
    field.name.toLowerCase().trim() === normalizedName
  )
}

/**
 * Get all field keys
 */
export function getAllFieldKeys(): string[] {
  return TRUEFLOW_CUSTOM_FIELDS.map(field => field.fieldKey)
}

/**
 * Field mapping for form data to GHL fields
 */
export const FIELD_MAPPINGS: Record<string, string> = {
  // Get Started form mappings
  'businessType': 'business_type',
  'businessName': 'business_name',
  'contentGoals': 'content_goals',
  'integrations': 'integration_preferences',
  'selectedPlan': 'selected_plan',
  'monthlyLeads': 'monthly_leads',
  'teamSize': 'team_size',
  'currentTools': 'current_tools',
  'biggestChallenge': 'biggest_challenge',
  
  // Assessment form mappings
  'current-content': 'current_content_creation',
  'content-volume': 'content_volume',
  'crm-usage': 'crm_usage',
  'lead-response': 'lead_response_time',
  'time-spent': 'time_on_repetitive_tasks',
  'budget': 'revenue_range',
  'assessmentScore': 'assessment_score',
  'readinessLevel': 'readiness_level',
  
  // Common mappings
  'leadScore': 'lead_score',
  'leadQuality': 'lead_quality',
  'submissionDate': 'submission_date',
  'formType': 'form_type',
  'assessmentAnswers': 'assessment_answers'
}