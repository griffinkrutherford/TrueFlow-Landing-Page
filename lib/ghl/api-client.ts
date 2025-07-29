/**
 * GoHighLevel API Client with retry logic and error handling
 * This module provides a robust API client for GHL integration
 */

import { TRUEFLOW_CUSTOM_FIELDS, CustomFieldDefinition, cacheFieldId } from './custom-fields'

const GHL_API_BASE = 'https://services.leadconnectorhq.com'
const GHL_API_VERSION = process.env.GHL_API_VERSION || '2021-07-28'

// Retry configuration
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // Start with 1 second
const BACKOFF_FACTOR = 2

interface GHLApiConfig {
  accessToken: string
  locationId: string
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Make an API request with retry logic
 */
async function makeApiRequest(
  url: string,
  options: RequestInit,
  config: GHLApiConfig,
  retries = MAX_RETRIES
): Promise<Response> {
  const headers = {
    'Authorization': `Bearer ${config.accessToken}`,
    'Accept': 'application/json',
    'Version': GHL_API_VERSION,
    ...options.headers
  }

  try {
    const response = await fetch(url, { ...options, headers })
    
    // If rate limited, retry with backoff
    if (response.status === 429 && retries > 0) {
      const delay = RETRY_DELAY * Math.pow(BACKOFF_FACTOR, MAX_RETRIES - retries)
      console.log(`[GHL API] Rate limited, retrying in ${delay}ms...`)
      await sleep(delay)
      return makeApiRequest(url, options, config, retries - 1)
    }
    
    // If server error, retry
    if (response.status >= 500 && retries > 0) {
      const delay = RETRY_DELAY * Math.pow(BACKOFF_FACTOR, MAX_RETRIES - retries)
      console.log(`[GHL API] Server error ${response.status}, retrying in ${delay}ms...`)
      await sleep(delay)
      return makeApiRequest(url, options, config, retries - 1)
    }
    
    return response
  } catch (error) {
    // Network error, retry if we have retries left
    if (retries > 0) {
      const delay = RETRY_DELAY * Math.pow(BACKOFF_FACTOR, MAX_RETRIES - retries)
      console.log(`[GHL API] Network error, retrying in ${delay}ms...`, error)
      await sleep(delay)
      return makeApiRequest(url, options, config, retries - 1)
    }
    throw error
  }
}

/**
 * Fetch existing custom fields from GHL
 */
export async function fetchCustomFields(config: GHLApiConfig): Promise<any[]> {
  try {
    console.log('[GHL API] Fetching custom fields...')
    
    const response = await makeApiRequest(
      `${GHL_API_BASE}/locations/${config.locationId}/customFields`,
      { method: 'GET' },
      config
    )
    
    if (!response.ok) {
      console.error('[GHL API] Failed to fetch custom fields:', response.status)
      return []
    }
    
    const data = await response.json()
    const fields = data.customFields || []
    
    console.log(`[GHL API] Found ${fields.length} existing custom fields`)
    
    // Cache field IDs
    fields.forEach((field: any) => {
      if (field.fieldKey && field.id) {
        cacheFieldId(field.fieldKey, field.id)
      }
    })
    
    return fields
  } catch (error) {
    console.error('[GHL API] Error fetching custom fields:', error)
    return []
  }
}

/**
 * Create a custom field in GHL
 * Returns the field ID if successful, null if failed
 */
export async function createCustomField(
  field: CustomFieldDefinition,
  config: GHLApiConfig
): Promise<string | null> {
  try {
    console.log(`[GHL API] Creating custom field: ${field.name}`)
    
    const payload = {
      locationId: config.locationId,
      name: field.name,
      fieldKey: field.fieldKey,
      dataType: field.dataType,
      objectType: 'contact', // Standard object for contacts
      description: field.description,
      showInForms: field.showInForms ?? true,
      ...(field.options && { options: field.options })
    }
    
    const response = await makeApiRequest(
      `${GHL_API_BASE}/custom-fields/`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      },
      config
    )
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[GHL API] Failed to create field ${field.name}:`, errorText)
      return null
    }
    
    const result = await response.json()
    const fieldId = result.field?.id
    
    if (fieldId) {
      console.log(`[GHL API] Created field ${field.name} with ID: ${fieldId}`)
      cacheFieldId(field.fieldKey, fieldId)
      return fieldId
    }
    
    return null
  } catch (error) {
    console.error(`[GHL API] Error creating field ${field.name}:`, error)
    return null
  }
}

/**
 * Ensure all TrueFlow custom fields exist
 * This is non-blocking - failures don't stop the process
 */
export async function ensureCustomFieldsExist(config: GHLApiConfig): Promise<any[]> {
  try {
    // First, fetch existing fields
    const existingFields = await fetchCustomFields(config)
    const existingFieldKeys = new Set(existingFields.map(f => f.fieldKey))
    
    // Create missing fields
    const createPromises = TRUEFLOW_CUSTOM_FIELDS
      .filter(field => !existingFieldKeys.has(field.fieldKey))
      .map(field => createCustomField(field, config))
    
    // Wait for all creations (but don't fail if some fail)
    await Promise.allSettled(createPromises)
    
    // Fetch fields again to get updated list
    return await fetchCustomFields(config)
  } catch (error) {
    console.error('[GHL API] Error ensuring custom fields exist:', error)
    return []
  }
}

/**
 * Create or update a contact in GHL
 */
export async function upsertContact(
  contactData: any,
  config: GHLApiConfig
): Promise<{ success: boolean; contactId?: string; error?: string }> {
  try {
    console.log('[GHL API] Upserting contact...')
    
    const response = await makeApiRequest(
      `${GHL_API_BASE}/contacts/upsert`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      },
      config
    )
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('[GHL API] Failed to upsert contact:', errorText)
      return { success: false, error: `API error: ${response.status}` }
    }
    
    const result = await response.json()
    const contactId = result.contact?.id || result.id
    
    console.log('[GHL API] Contact upserted successfully:', contactId)
    return { success: true, contactId }
  } catch (error) {
    console.error('[GHL API] Error upserting contact:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Check if GHL is properly configured
 */
export function isGHLConfigured(): { configured: boolean; config?: GHLApiConfig } {
  const accessToken = process.env.GHL_ACCESS_TOKEN
  const locationId = process.env.GHL_LOCATION_ID
  
  const configured = !!(
    accessToken && 
    locationId && 
    !accessToken.includes('your_') &&
    !locationId.includes('your_') &&
    process.env.GHL_ENABLED === 'true'
  )
  
  if (configured) {
    return {
      configured: true,
      config: { accessToken, locationId }
    }
  }
  
  return { configured: false }
}