/**
 * Custom Fields Management V3 - Uses actual GHL field names
 * This version fetches real fields from GHL and maps our data to them
 */

import { buildMappedCustomFields } from './field-mapping'

// GHL API configuration
const GHL_API_BASE = 'https://services.leadconnectorhq.com'
const GHL_API_VERSION = '2021-07-28'

export interface GHLField {
  id: string
  name: string
  fieldKey?: string
  dataType: string
  model?: string
}

/**
 * Fetch all custom fields from GoHighLevel
 */
export async function fetchGHLCustomFields(
  accessToken: string,
  locationId: string
): Promise<GHLField[]> {
  try {
    console.log('[CustomFields V3] Fetching fields from GHL...')
    
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
      console.error('[CustomFields V3] Failed to fetch fields:', response.status)
      const errorText = await response.text()
      console.error('[CustomFields V3] Error response:', errorText)
      return []
    }

    const data = await response.json()
    const fields = data.customFields || []
    
    console.log(`[CustomFields V3] Found ${fields.length} custom fields:`)
    fields.forEach((field: GHLField) => {
      console.log(`  - ${field.name} (ID: ${field.id}, Type: ${field.dataType})`)
    })
    
    return fields
  } catch (error) {
    console.error('[CustomFields V3] Error fetching fields:', error)
    return []
  }
}

/**
 * Build custom fields payload using actual GHL field names
 */
export function buildCustomFieldsPayloadV3(
  formData: any,
  ghlFields: GHLField[]
): Array<{ id: string; value: string }> {
  console.log('[CustomFields V3] Building payload with mapped fields...')
  
  // First, let's log what fields we have to work with
  console.log('[CustomFields V3] Available GHL fields:')
  ghlFields.forEach(field => {
    console.log(`  - Name: "${field.name}", ID: ${field.id}`)
  })
  
  // Use our field mapping to build the payload
  const customFields = buildMappedCustomFields(formData, ghlFields)
  
  console.log(`[CustomFields V3] Built ${customFields.length} field values`)
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
    // Get Started form scoring
    const businessType = data.businessType
    const selectedPlan = data.selectedPlan
    const contentGoals = data.contentGoals || []
    const integrations = data.integrations || []
    
    // Business type scoring
    if (businessType === 'agency' || businessType === 'business') {
      score += 10
    } else if (businessType === 'coach' || businessType === 'podcaster') {
      score += 5
    }
    
    // Plan selection scoring
    if (selectedPlan === 'custom' || selectedPlan === 'complete-system') {
      score += 20
    } else if (selectedPlan === 'content-engine') {
      score += 10
    }
    
    // Content goals scoring
    if (contentGoals.length >= 4) {
      score += 15
    } else if (contentGoals.length >= 2) {
      score += 10
    } else if (contentGoals.length >= 1) {
      score += 5
    }
    
    // Integration scoring
    if (integrations.includes('gohighlevel')) {
      score += 10 // Bonus for already using GHL
    }
    if (integrations.length >= 3) {
      score += 10
    } else if (integrations.length >= 1) {
      score += 5
    }
  }
  
  return Math.min(Math.max(score, 0), 100)
}

/**
 * Get lead quality based on score
 */
export function getLeadQuality(score: number): string {
  if (score >= 75) return 'hot'
  if (score >= 50) return 'warm'
  return 'cold'
}

/**
 * Helper to check if a field exists by name (case-insensitive)
 */
export function findFieldByName(fields: GHLField[], name: string): GHLField | undefined {
  const normalizedName = name.toLowerCase().trim()
  return fields.find(field => 
    field.name.toLowerCase().trim() === normalizedName
  )
}

/**
 * Log missing fields for debugging
 */
export function logMissingFields(ghlFields: GHLField[]) {
  const expectedFields = [
    'Business Name',
    'What type of business do you run?',
    'What are your goals?',
    'What systems do you already have in place?',
    'Assessment Score',
    'AI Readiness Level',
    'Selected Plan',
    'Lead Score',
    'Lead Quality'
  ]
  
  console.log('[CustomFields V3] Checking for expected fields...')
  expectedFields.forEach(fieldName => {
    const field = findFieldByName(ghlFields, fieldName)
    if (!field) {
      console.warn(`[CustomFields V3] Missing expected field: "${fieldName}"`)
    }
  })
}