import { NextResponse } from 'next/server'
import { sendAssessmentNotification, sendGetStartedNotification } from '@/lib/email/resend-notifications'
import { 
  ensureCustomFieldsExist,
  buildCustomFieldsPayload,
  calculateLeadScore,
  getLeadQuality
} from '@/lib/ghl/custom-fields-v2'

// GHL API configuration
const GHL_API_BASE = 'https://services.leadconnectorhq.com'
const GHL_API_VERSION = process.env.GHL_API_VERSION || '2021-07-28'

interface GHLCustomField {
  id: string
  field_value: string
}

interface GHLLeadData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  locationId: string
  name?: string
  companyName?: string
  tags?: string[]
  customFields?: GHLCustomField[]
  source?: string
  timezone?: string
}

export async function POST(request: Request) {
  console.log('[API V3] Received POST request to /api/ghl/create-lead-v3')
  
  try {
    // Parse request body
    const data = await request.json()
    console.log('[API V3] Processing form submission...')
    
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email) {
      console.error('[API V3] Missing required fields')
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields: firstName, lastName, or email' 
      }, { status: 400 })
    }
    
    // Determine form type
    const isAssessment = 'scorePercentage' in data || ('score' in data && 'recommendation' in data)
    const formType = isAssessment ? 'assessment' : 'get-started'
    
    console.log(`[API V3] Form type: ${formType}`)
    
    // Calculate lead score and quality
    const leadScore = calculateLeadScore(data, formType)
    const leadQuality = getLeadQuality(leadScore)
    
    console.log(`[API V3] Lead score: ${leadScore}, quality: ${leadQuality}`)
    
    // Add calculated values to data
    data.leadScore = leadScore
    data.leadQuality = leadQuality
    
    // Check if GHL integration is enabled
    if (!process.env.GHL_ACCESS_TOKEN || !process.env.GHL_LOCATION_ID ||
        process.env.GHL_ACCESS_TOKEN.includes('your_') || 
        process.env.GHL_LOCATION_ID.includes('your_')) {
      console.log('[API V3] GHL integration not configured, using email fallback')
      
      // Send email notification
      try {
        if (isAssessment) {
          await sendAssessmentNotification(data)
        } else {
          await sendGetStartedNotification(data)
        }
        return NextResponse.json({ 
          success: true, 
          message: 'Submission received successfully (email sent)',
          leadScore,
          leadQuality
        })
      } catch (emailError) {
        console.error('[API V3] Email notification failed:', emailError)
        return NextResponse.json({ 
          success: true, 
          message: 'Submission received successfully',
          warning: 'Email notification pending',
          leadScore,
          leadQuality
        })
      }
    }
    
    // GHL is configured - ensure custom fields exist
    console.log('[API V3] Ensuring custom fields exist in GHL...')
    const fieldMap = await ensureCustomFieldsExist(
      process.env.GHL_ACCESS_TOKEN,
      process.env.GHL_LOCATION_ID
    )
    
    console.log(`[API V3] Field map has ${fieldMap.size} fields`)
    
    // Build custom fields payload
    const customFields = buildCustomFieldsPayload(data, fieldMap, formType)
    console.log(`[API V3] Built ${customFields.length} custom field values`)
    
    // Build minimal tags (only essential ones)
    const tags = [
      'web-lead',
      `lead-quality-${leadQuality}`,
      formType === 'assessment' ? 'assessment-form' : 'get-started-form'
    ]
    
    // Add submission month for reporting
    const now = new Date()
    const monthYear = now.toISOString().substring(0, 7) // YYYY-MM
    tags.push(`submitted-${monthYear}`)
    
    console.log('[API V3] Using minimal tags:', tags)
    
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
      source: formType === 'assessment' ? 'TrueFlow Assessment Form' : 'TrueFlow Get Started Form',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
    
    console.log('[API V3] Sending to GHL:', {
      name: ghlPayload.name,
      email: ghlPayload.email,
      tagsCount: tags.length,
      customFieldsCount: customFields.length
    })
    
    // Create or update contact in GHL
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
      console.error('[API V3] GHL API Error:', {
        status: ghlResponse.status,
        statusText: ghlResponse.statusText,
        error: errorData
      })
      
      // Still try to send email as backup
      try {
        if (isAssessment) {
          await sendAssessmentNotification(data)
        } else {
          await sendGetStartedNotification(data)
        }
      } catch (emailError) {
        console.error('[API V3] Backup email also failed:', emailError)
      }
      
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to create contact in CRM',
        warning: 'Your submission was received but CRM sync failed. We will process it manually.',
        leadScore,
        leadQuality
      }, { status: 500 })
    }
    
    const ghlResult = await ghlResponse.json()
    console.log('[API V3] Contact created/updated successfully:', ghlResult.contact?.id)
    
    // Send backup email notification
    try {
      console.log('[API V3] Sending backup email notification...')
      if (isAssessment) {
        await sendAssessmentNotification(data)
      } else {
        await sendGetStartedNotification(data)
      }
      console.log('[API V3] Backup email sent successfully')
    } catch (emailError) {
      console.error('[API V3] Backup email failed:', emailError)
      // Don't fail the request if backup email fails
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Lead processed successfully',
      ghlContactId: ghlResult.contact?.id || ghlResult.id,
      leadScore,
      leadQuality,
      customFieldsUsed: customFields.length,
      tagsUsed: tags.length
    })
    
  } catch (error) {
    console.error('[API V3] Error processing lead:', error)
    console.error('[API V3] Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' 
        ? error instanceof Error ? error.message : String(error)
        : undefined
    }, { status: 500 })
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