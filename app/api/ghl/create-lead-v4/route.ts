import { NextResponse } from 'next/server'
import { sendAssessmentNotification, sendGetStartedNotification } from '@/lib/email/resend-notifications'
import { 
  fetchGHLCustomFields,
  buildCustomFieldsPayloadV3,
  calculateLeadScore,
  getLeadQuality,
  logMissingFields
} from '@/lib/ghl/custom-fields-v3'

// GHL API configuration
const GHL_API_BASE = 'https://services.leadconnectorhq.com'
const GHL_API_VERSION = process.env.GHL_API_VERSION || '2021-07-28'

export async function POST(request: Request) {
  console.log('[API V4] ===== NEW REQUEST =====')
  console.log('[API V4] Received POST request to /api/ghl/create-lead-v4')
  
  try {
    // Parse request body
    const data = await request.json()
    console.log('[API V4] Processing form submission...')
    console.log('[API V4] Form data received:', {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      businessName: data.businessName,
      businessType: data.businessType,
      contentGoals: data.contentGoals,
      integrations: data.integrations,
      hasAnswers: !!data.answers,
      answerCount: data.answers ? Object.keys(data.answers).length : 0
    })
    
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email) {
      console.error('[API V4] Missing required fields')
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields: firstName, lastName, or email' 
      }, { status: 400 })
    }
    
    // Determine form type
    const isAssessment = 'scorePercentage' in data || ('score' in data && 'recommendation' in data)
    const formType = isAssessment ? 'assessment' : 'get-started'
    
    console.log(`[API V4] Form type: ${formType}`)
    
    // Calculate lead score and quality
    const leadScore = calculateLeadScore(data, formType)
    const leadQuality = getLeadQuality(leadScore)
    
    console.log(`[API V4] Lead score: ${leadScore}, quality: ${leadQuality}`)
    
    // Add calculated values to data
    data.leadScore = leadScore
    data.leadQuality = leadQuality
    data.submissionDate = new Date().toISOString()
    
    // Check if GHL integration is enabled
    if (!process.env.GHL_ACCESS_TOKEN || !process.env.GHL_LOCATION_ID ||
        process.env.GHL_ACCESS_TOKEN.includes('your_') || 
        process.env.GHL_LOCATION_ID.includes('your_')) {
      console.log('[API V4] GHL integration not configured, using email fallback')
      
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
        console.error('[API V4] Email notification failed:', emailError)
        return NextResponse.json({ 
          success: true, 
          message: 'Submission received successfully',
          warning: 'Email notification pending',
          leadScore,
          leadQuality
        })
      }
    }
    
    // Fetch actual custom fields from GHL
    console.log('[API V4] Fetching custom fields from GHL...')
    const ghlFields = await fetchGHLCustomFields(
      process.env.GHL_ACCESS_TOKEN,
      process.env.GHL_LOCATION_ID
    )
    
    if (ghlFields.length === 0) {
      console.warn('[API V4] No custom fields found in GHL')
    } else {
      // Log missing fields for debugging
      logMissingFields(ghlFields)
    }
    
    // Build custom fields payload using actual field names
    const customFields = buildCustomFieldsPayloadV3(data, ghlFields)
    console.log(`[API V4] Built ${customFields.length} custom field values`)
    
    // Build tags
    const tags = [
      'web-lead',
      `lead-quality-${leadQuality}`,
      formType === 'assessment' ? 'assessment-form' : 'get-started-form'
    ]
    
    if (data.businessType) {
      tags.push(`business-type-${data.businessType}`)
    }
    
    console.log('[API V4] Using tags:', tags)
    
    // Prepare GHL payload
    const ghlPayload = {
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
    
    console.log('[API V4] Sending to GHL with payload:', {
      name: ghlPayload.name,
      email: ghlPayload.email,
      companyName: ghlPayload.companyName,
      tagsCount: tags.length,
      customFieldsCount: customFields.length,
      customFieldsSample: customFields.slice(0, 5).map(cf => ({
        id: cf.id.substring(0, 8) + '...',
        value: cf.value.substring(0, 50) + (cf.value.length > 50 ? '...' : '')
      }))
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
      console.error('[API V4] GHL API Error:', {
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
        console.error('[API V4] Backup email also failed:', emailError)
      }
      
      // Don't fail the entire request if GHL fails
      return NextResponse.json({ 
        success: true, 
        message: 'Submission received successfully',
        warning: 'CRM sync pending - we will process your submission manually',
        leadScore,
        leadQuality,
        ghlError: process.env.NODE_ENV === 'development' ? errorData : undefined
      })
    }
    
    const ghlResult = await ghlResponse.json()
    console.log('[API V4] Contact created/updated successfully:', {
      contactId: ghlResult.contact?.id || ghlResult.id,
      hasContact: !!ghlResult.contact,
      hasId: !!ghlResult.id
    })
    
    // Send backup email notification
    try {
      console.log('[API V4] Sending backup email notification...')
      if (isAssessment) {
        await sendAssessmentNotification(data)
      } else {
        await sendGetStartedNotification(data)
      }
      console.log('[API V4] Backup email sent successfully')
    } catch (emailError) {
      console.error('[API V4] Backup email failed:', emailError)
      // Don't fail the request if backup email fails
    }
    
    console.log('[API V4] ===== REQUEST COMPLETED SUCCESSFULLY =====')
    
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
    console.error('[API V4] ===== ERROR IN REQUEST =====')
    console.error('[API V4] Error processing lead:', error)
    console.error('[API V4] Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
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