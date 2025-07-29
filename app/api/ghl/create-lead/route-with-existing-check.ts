import { NextResponse } from 'next/server'

// GHL API configuration
const GHL_API_BASE = 'https://services.leadconnectorhq.com'
const GHL_API_VERSION = process.env.GHL_API_VERSION || '2021-07-28'

// Helper function to get existing tags from GHL
async function getExistingTags() {
  try {
    const response = await fetch(`${GHL_API_BASE}/locations/${process.env.GHL_LOCATION_ID}/tags`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
        'Accept': 'application/json',
        'Version': GHL_API_VERSION
      }
    })

    if (!response.ok) {
      console.error('[GHL] Failed to fetch tags:', response.status)
      return []
    }

    const data = await response.json()
    return data.tags || []
  } catch (error) {
    console.error('[GHL] Error fetching tags:', error)
    return []
  }
}

// Helper function to get existing pipelines and stages
async function getPipelinesAndStages() {
  try {
    const response = await fetch(`${GHL_API_BASE}/opportunities/pipelines`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
        'Accept': 'application/json',
        'Version': GHL_API_VERSION
      }
    })

    if (!response.ok) {
      console.error('[GHL] Failed to fetch pipelines:', response.status)
      return []
    }

    const data = await response.json()
    return data.pipelines || []
  } catch (error) {
    console.error('[GHL] Error fetching pipelines:', error)
    return []
  }
}

// Helper function to check if contact already exists
async function findExistingContact(email: string) {
  try {
    const response = await fetch(`${GHL_API_BASE}/contacts/lookup?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
        'Accept': 'application/json',
        'Version': GHL_API_VERSION
      }
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.contact || null
  } catch (error) {
    console.error('[GHL] Error looking up contact:', error)
    return null
  }
}

// Helper function to get contact's existing opportunities
async function getContactOpportunities(contactId: string) {
  try {
    const response = await fetch(`${GHL_API_BASE}/opportunities/search?contact_id=${contactId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
        'Accept': 'application/json',
        'Version': GHL_API_VERSION
      }
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.opportunities || []
  } catch (error) {
    console.error('[GHL] Error fetching opportunities:', error)
    return []
  }
}

// Create or update contact with existing tag check
async function createOrUpdateGHLContactWithCheck(data: any, formType: string) {
  try {
    // Get existing tags to reuse
    const existingTags = await getExistingTags()
    console.log('[GHL] Existing tags in system:', existingTags.map((t: any) => t.name))
    
    // Build tag list, preferring existing tags
    const desiredTags = [
      `trueflow-${formType}`,
      'web-lead',
      new Date().toISOString().split('T')[0]
    ]
    
    if (formType === 'assessment') {
      desiredTags.push(
        `score-${data.score || 0}`,
        data.recommendation?.toLowerCase().replace(' ', '-') || 'assessment-completed'
      )
    } else {
      desiredTags.push(
        `plan-${data.pricingPlan?.toLowerCase() || 'unknown'}`,
        `business-${data.businessType?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}`
      )
    }
    
    // Use existing tag names if they match (case-insensitive)
    const finalTags = desiredTags.map(desiredTag => {
      const existing = existingTags.find((t: any) => 
        t.name.toLowerCase() === desiredTag.toLowerCase()
      )
      return existing ? existing.name : desiredTag
    })
    
    console.log('[GHL] Final tags to apply:', finalTags)
    
    // Check if contact already exists
    const existingContact = await findExistingContact(data.email)
    
    if (existingContact) {
      console.log('[GHL] Found existing contact:', existingContact.id)
      
      // Update existing contact with new tags and data
      const updatePayload = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || existingContact.phone,
        companyName: data.businessName || existingContact.companyName,
        tags: [...new Set([...(existingContact.tags || []), ...finalTags])], // Merge tags
        customFields: data.customFields || []
      }
      
      const updateResponse = await fetch(`${GHL_API_BASE}/contacts/${existingContact.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Version': GHL_API_VERSION
        },
        body: JSON.stringify(updatePayload)
      })
      
      if (!updateResponse.ok) {
        throw new Error(`Failed to update contact: ${updateResponse.status}`)
      }
      
      const updatedContact = await updateResponse.json()
      return {
        success: true,
        contactId: updatedContact.contact?.id || existingContact.id,
        isNew: false,
        existingOpportunities: await getContactOpportunities(existingContact.id)
      }
    } else {
      // Create new contact (use existing upsert logic)
      console.log('[GHL] Creating new contact')
      // ... existing create logic with finalTags
    }
    
  } catch (error) {
    console.error('[GHL] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Create opportunity with duplicate check
async function createGHLOpportunityWithCheck(contactId: string, data: any, formType: string, existingOpportunities: any[]) {
  try {
    // Get all pipelines to find the right one
    const pipelines = await getPipelinesAndStages()
    console.log('[GHL] Available pipelines:', pipelines.map((p: any) => ({ id: p.id, name: p.name })))
    
    // Find pipeline by name if IDs not set
    let pipelineId = formType === 'assessment' 
      ? process.env.GHL_ASSESSMENT_PIPELINE_ID 
      : process.env.GHL_GETSTARTED_PIPELINE_ID
      
    if (!pipelineId) {
      // Try to find by name
      const pipelineName = formType === 'assessment' ? 'Assessment' : 'Get Started'
      const pipeline = pipelines.find((p: any) => 
        p.name.toLowerCase().includes(pipelineName.toLowerCase())
      )
      pipelineId = pipeline?.id
    }
    
    if (!pipelineId && pipelines.length > 0) {
      // Use first available pipeline as fallback
      pipelineId = pipelines[0].id
      console.log('[GHL] Using default pipeline:', pipelines[0].name)
    }
    
    // Check if similar opportunity already exists
    const recentOpp = existingOpportunities.find((opp: any) => {
      const hoursSinceCreated = (Date.now() - new Date(opp.createdAt).getTime()) / (1000 * 60 * 60)
      return hoursSinceCreated < 24 && opp.pipelineId === pipelineId
    })
    
    if (recentOpp) {
      console.log('[GHL] Recent opportunity already exists, updating instead:', recentOpp.id)
      
      // Update existing opportunity
      const updatePayload = {
        name: formType === 'assessment' 
          ? `Assessment - ${data.firstName} ${data.lastName} (Updated)` 
          : `Get Started - ${data.firstName} ${data.lastName} (Updated)`,
        monetaryValue: calculateMonetaryValue(data, formType)
      }
      
      const updateResponse = await fetch(`${GHL_API_BASE}/opportunities/${recentOpp.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Version': GHL_API_VERSION
        },
        body: JSON.stringify(updatePayload)
      })
      
      return updateResponse.json()
    } else {
      // Create new opportunity (use existing logic)
      console.log('[GHL] Creating new opportunity')
      // ... existing create logic
    }
    
  } catch (error) {
    console.error('[GHL] Error managing opportunity:', error)
    throw error
  }
}

function calculateMonetaryValue(data: any, formType: string): number {
  const planValues: Record<string, number> = {
    'starter': 970,
    'professional': 2970,
    'growth': 4970,
    'enterprise': 9970
  }
  
  const plan = (data.pricingPlan || data.recommendation || 'starter').toLowerCase()
  return planValues[plan] || 970
}

// Note: This is a simplified version showing the concept
// You would integrate these functions into your existing route.ts file