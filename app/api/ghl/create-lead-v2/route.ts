import { NextResponse } from 'next/server'
import { sendAssessmentNotification, sendGetStartedNotification } from '@/lib/email/resend-notifications'
import { 
  calculateLeadScore, 
  getQualificationStatus,
  ensureCustomFieldsExist,
  customFieldDefinitions 
} from '@/lib/ghl/custom-fields'

// GHL API configuration
const GHL_API_BASE = 'https://services.leadconnectorhq.com'
const GHL_API_VERSION = process.env.GHL_API_VERSION || '2021-07-28'

interface GHLCustomField {
  id?: string
  key?: string
  field_value: string
}

interface GHLLeadData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  locationId: string
  name?: string
  address1?: string
  city?: string
  state?: string
  postalCode?: string
  website?: string
  timezone?: string
  tags?: string[]
  customFields?: GHLCustomField[]
  source?: string
  companyName?: string
}

interface CustomFieldMapping {
  [key: string]: string
}

// Cache for custom field IDs to reduce API calls
let customFieldIdCache: CustomFieldMapping = {}
let cacheExpiry = 0

export async function POST(request: Request) {
  console.log('[API V2] Received POST request to /api/ghl/create-lead-v2')
  
  try {
    // Parse request body
    const data = await request.json()
    console.log('[API V2] Request data:', JSON.stringify(data, null, 2))
    
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email) {
      console.error('[API V2] Missing required fields')
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields: firstName, lastName, or email' 
      }, { status: 400 })
    }
    
    // Determine form type
    const isAssessment = 'score' in data && 'recommendation' in data
    const formType = isAssessment ? 'assessment' : 'get-started'
    
    console.log(`[API V2] Processing ${formType} form submission`)
    
    // Normalize array fields for get-started form
    if (!isAssessment) {
      data.contentGoals = Array.isArray(data.contentGoals) ? data.contentGoals : []
      data.currentTools = Array.isArray(data.currentTools) ? data.currentTools : []
    }

    // Check if GHL integration is enabled and configured
    if (!process.env.GHL_ACCESS_TOKEN || !process.env.GHL_LOCATION_ID ||
        process.env.GHL_ACCESS_TOKEN.includes('your_') || 
        process.env.GHL_LOCATION_ID.includes('your_')) {
      console.log('[API V2] GHL integration not configured, using email fallback')
      
      // Try to send email notification as fallback
      try {
        if (isAssessment) {
          await sendAssessmentNotification(data)
        } else {
          await sendGetStartedNotification(data)
        }
        return NextResponse.json({ 
          success: true, 
          message: 'Submission received successfully (email sent)' 
        })
      } catch (emailError) {
        console.error('[API V2] Email notification failed:', emailError)
        console.log('[API V2] Lead data saved to logs:', JSON.stringify(data, null, 2))
        
        // Still return success to prevent form error
        return NextResponse.json({ 
          success: true, 
          message: 'Submission received successfully',
          warning: 'Email notification pending, but your submission has been received.',
          leadId: `log-${Date.now()}`
        })
      }
    }

    // Ensure custom fields exist in GHL
    try {
      console.log('[API V2] Ensuring custom fields exist in GHL...')
      await ensureCustomFieldsExist()
      console.log('[API V2] Custom fields verified/created')
    } catch (error) {
      console.error('[API V2] Failed to ensure custom fields exist:', error)
      // Continue anyway - fields might already exist
    }

    // Get fresh custom field mappings
    const fieldMappings = await getCustomFieldMappings()
    console.log('[API V2] Field mappings:', fieldMappings)

    // Create or update contact in GHL
    const contactResult = await createOrUpdateGHLContact(data, formType, fieldMappings)
    
    if (!contactResult.success) {
      throw new Error(contactResult.error || 'Failed to create/update contact')
    }

    // Also send email notification (as backup)
    try {
      console.log('[API V2] Sending backup email notification...')
      if (isAssessment) {
        await sendAssessmentNotification(data)
      } else {
        await sendGetStartedNotification(data)
      }
      console.log('[API V2] Backup email sent successfully')
    } catch (emailError) {
      console.error('[API V2] Backup email notification failed:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Lead processed successfully',
      ghlContactId: contactResult.contactId
    })

  } catch (error) {
    console.error('[API V2] Error processing lead:', error)
    console.error('[API V2] Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' 
        ? {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
          }
        : undefined
    }, { status: 500 })
  }
}

// Get custom field mappings from GHL
async function getCustomFieldMappings(): Promise<CustomFieldMapping> {
  // Check cache first
  if (customFieldIdCache && Object.keys(customFieldIdCache).length > 0 && Date.now() < cacheExpiry) {
    return customFieldIdCache
  }

  try {
    console.log('[API V2] Fetching custom field mappings from GHL...')
    
    const response = await fetch(
      `${GHL_API_BASE}/locations/${process.env.GHL_LOCATION_ID}/customFields?model=contact`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
          'Version': GHL_API_VERSION,
          'Accept': 'application/json'
        }
      }
    )

    if (!response.ok) {
      console.error('[API V2] Failed to fetch custom fields:', response.status, response.statusText)
      return {}
    }

    const result = await response.json()
    const fields = result.customFields || []
    
    // Build mapping of field keys to field IDs
    const mapping: CustomFieldMapping = {}
    
    fields.forEach((field: any) => {
      // Map our field definitions to GHL field IDs
      const ourField = customFieldDefinitions.find(f => 
        f.name === field.name || f.fieldKey === field.fieldKey
      )
      
      if (ourField) {
        mapping[ourField.fieldKey] = field.id
        console.log(`[API V2] Mapped ${ourField.fieldKey} to ${field.id}`)
      }
    })

    // Cache for 1 hour
    customFieldIdCache = mapping
    cacheExpiry = Date.now() + 3600000

    return mapping
  } catch (error) {
    console.error('[API V2] Error fetching custom field mappings:', error)
    return {}
  }
}

// Create or update contact in GHL
async function createOrUpdateGHLContact(data: any, formType: string, fieldMappings: CustomFieldMapping) {
  try {
    // Calculate lead score and qualification
    const leadScore = calculateLeadScore(data, formType)
    const qualificationStatus = getQualificationStatus(leadScore)
    
    console.log(`[API V2] Lead quality: ${leadScore}/100 (${qualificationStatus})`)
    
    // Build tags
    const tags = [
      `trueflow-${formType}`,
      'web-lead',
      `lead-quality-${qualificationStatus}`,
      `lead-score-${leadScore}`,
      new Date().toISOString().split('T')[0] // Add date tag
    ]
    
    if (formType === 'assessment') {
      tags.push(
        `score-${data.totalScore || data.score || 0}`,
        data.recommendation?.toLowerCase().replace(' ', '-') || 'assessment-completed'
      )
      if (data.selectedPlan) {
        tags.push(`plan-${data.selectedPlan.toLowerCase().replace(/\s+/g, '-')}`)
      }
    } else {
      tags.push(
        `plan-${data.pricingPlan?.toLowerCase() || 'unknown'}`,
        `business-${data.businessType?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}`
      )
    }

    // Build custom fields array with proper IDs
    const customFields: GHLCustomField[] = []
    
    // Helper function to add field if mapping exists
    const addCustomField = (fieldKey: string, value: string) => {
      const fieldId = fieldMappings[fieldKey]
      if (fieldId) {
        customFields.push({
          id: fieldId,
          field_value: value
        })
        console.log(`[API V2] Added custom field ${fieldKey} (${fieldId}): ${value}`)
      } else {
        console.warn(`[API V2] No mapping found for field: ${fieldKey}`)
      }
    }

    // Add common fields
    addCustomField('trueflow_form_type', formType)
    addCustomField('trueflow_submission_date', data.timestamp || new Date().toISOString())
    addCustomField('trueflow_lead_score', leadScore.toString())
    addCustomField('trueflow_qualification_status', qualificationStatus)

    if (formType === 'assessment') {
      // Assessment-specific fields
      addCustomField('trueflow_assessment_score', data.score.toString())
      addCustomField('trueflow_recommended_plan', data.recommendation)
      addCustomField('trueflow_assessment_date', data.timestamp || new Date().toISOString())
      
      // Add assessment answers as JSON
      if (data.answers) {
        addCustomField('trueflow_assessment_answers', JSON.stringify(data.answers))
      }
    } else {
      // Get Started form fields
      addCustomField('trueflow_business_type', data.businessType || '')
      addCustomField('trueflow_content_goals', Array.isArray(data.contentGoals) 
        ? data.contentGoals.join(', ') 
        : (data.contentGoals || ''))
      addCustomField('trueflow_monthly_leads', data.monthlyLeads || '')
      addCustomField('trueflow_team_size', data.teamSize || '')
      addCustomField('trueflow_current_tools', Array.isArray(data.currentTools) 
        ? data.currentTools.join(', ') 
        : (data.currentTools || ''))
      addCustomField('trueflow_biggest_challenge', data.biggestChallenge || '')
      addCustomField('trueflow_selected_plan', data.pricingPlan || '')
    }

    // Prepare GHL payload
    const ghlPayload: GHLLeadData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      locationId: process.env.GHL_LOCATION_ID!,
      name: `${data.firstName} ${data.lastName}`,
      companyName: data.businessName,
      tags,
      customFields,
      source: formType === 'assessment' ? 'TrueFlow AI Assessment' : 'TrueFlow Get Started Form',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }

    console.log('[API V2] Attempting to upsert contact with payload:', JSON.stringify(ghlPayload, null, 2))

    // Use upsert endpoint to create or update
    const ghlResponse = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Version': GHL_API_VERSION
      },
      body: JSON.stringify(ghlPayload)
    })

    if (!ghlResponse.ok) {
      const errorData = await ghlResponse.text()
      console.error('[API V2] GHL API Error:', {
        status: ghlResponse.status,
        statusText: ghlResponse.statusText,
        error: errorData
      })
      
      return {
        success: false,
        error: `GHL API error: ${ghlResponse.status}`
      }
    }

    const ghlResult = await ghlResponse.json()
    console.log('[API V2] Contact upserted successfully:', ghlResult)
    
    return {
      success: true,
      contactId: ghlResult.contact?.id || ghlResult.id,
      isNew: ghlResult.new || false
    }
    
  } catch (error) {
    console.error('[API V2] Error creating/updating contact:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// OPTIONS handler for CORS
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  })
}