import { NextResponse } from 'next/server'
import { sendAssessmentNotification, sendGetStartedNotification } from '@/lib/email/resend-notifications'
import { calculateLeadScore, getLeadQuality } from '@/lib/ghl/custom-fields-v3'
import { 
  ensureFormFieldsExist, 
  buildCompleteCustomFields,
  GET_STARTED_FORM_FIELDS 
} from '@/lib/ghl/complete-field-mapping'

// GHL API configuration
const GHL_API_BASE = 'https://services.leadconnectorhq.com'
const GHL_API_VERSION = process.env.GHL_API_VERSION || '2021-07-28'

/**
 * Enhanced form type detection
 */
function detectFormType(data: any): 'assessment' | 'get-started' {
  if (data.source === 'readiness-assessment') return 'assessment'
  if (data.assessmentVersion || data.recommendation || data.scorePercentage) return 'assessment'
  if (data.answers && typeof data.answers === 'object') {
    const assessmentKeys = ['current-content', 'content-volume', 'crm-usage', 'lead-response', 'time-spent', 'budget']
    if (assessmentKeys.some(key => data.answers[key])) return 'assessment'
  }
  if (data.assessmentAnswers && Array.isArray(data.assessmentAnswers) && data.assessmentAnswers.length > 0) {
    return 'assessment'
  }
  return 'get-started'
}

export async function POST(request: Request) {
  console.log('[API Complete] ===== NEW COMPLETE FIELD MAPPING REQUEST =====')
  console.log('[API Complete] Starting comprehensive field mapping process...')
  
  try {
    // Parse request body
    const data = await request.json()
    console.log('[API Complete] Form data received:', {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      businessName: data.businessName,
      businessType: data.businessType,
      teamSize: data.teamSize,
      monthlyLeads: data.monthlyLeads,
      currentTools: data.currentTools,
      biggestChallenge: data.biggestChallenge,
      contentGoals: data.contentGoals,
      selectedPlan: data.selectedPlan,
      additionalNotes: data.additionalNotes,
      formFieldCount: Object.keys(data).length
    })
    
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email) {
      console.error('[API Complete] Missing required fields')
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields: firstName, lastName, or email' 
      }, { status: 400 })
    }
    
    // Determine form type
    const formType = detectFormType(data)
    console.log(`[API Complete] Detected form type: ${formType}`)
    
    // Calculate lead score and quality
    const leadScore = calculateLeadScore(data, formType)
    const leadQuality = getLeadQuality(leadScore)
    
    console.log(`[API Complete] Lead score: ${leadScore}, quality: ${leadQuality}`)
    
    // Add calculated values to data
    data.leadScore = leadScore
    data.leadQuality = leadQuality
    data.submissionDate = new Date().toISOString()
    
    // Check if GHL integration is enabled
    if (!process.env.GHL_ACCESS_TOKEN || !process.env.GHL_LOCATION_ID ||
        process.env.GHL_ACCESS_TOKEN.includes('your_') || 
        process.env.GHL_LOCATION_ID.includes('your_')) {
      console.log('[API Complete] GHL integration not configured, using email fallback')
      
      try {
        if (formType === 'assessment') {
          await sendAssessmentNotification(data)
        } else {
          await sendGetStartedNotification(data)
        }
        return NextResponse.json({ 
          success: true, 
          message: 'Submission received successfully (email sent)',
          leadScore,
          leadQuality,
          formType
        })
      } catch (emailError) {
        console.error('[API Complete] Email notification failed:', emailError)
        return NextResponse.json({ 
          success: true, 
          message: 'Submission received successfully',
          warning: 'Email notification pending',
          leadScore,
          leadQuality,
          formType
        })
      }
    }
    
    // Ensure all form fields exist in GHL (create missing ones)
    console.log('[API Complete] Ensuring all form fields exist in GoHighLevel...')
    const fieldMap = await ensureFormFieldsExist(
      process.env.GHL_LOCATION_ID!,
      process.env.GHL_ACCESS_TOKEN!
    )
    
    console.log(`[API Complete] Field mapping complete. Available fields: ${fieldMap.size}`)
    
    // Build complete custom fields payload
    console.log('[API Complete] Building comprehensive custom fields payload...')
    const customFields = buildCompleteCustomFields(data, fieldMap, formType)
    
    console.log(`[API Complete] Built ${customFields.length} custom field mappings`)
    
    // Log the custom fields being sent
    console.log('[API Complete] Custom fields being sent to GHL:')
    customFields.forEach((cf, index) => {
      const preview = cf.field_value.length > 100 ? cf.field_value.substring(0, 100) + '...' : cf.field_value
      console.log(`[API Complete]   ${index + 1}. Field ID ${cf.id}: "${preview}"`)
    })
    
    // Minimal tags - most data should be in fields, not tags
    const tags = ['web-lead']
    
    // Only add the form type as a tag, everything else goes in fields
    if (formType === 'assessment') {
      tags.push('assessment-form')
    } else if (formType === 'get-started') {
      tags.push('get-started-form')
    }
    
    console.log('[API Complete] Using minimal tags:', tags)
    
    // Prepare comprehensive GHL payload
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
      source: formType === 'assessment' ? 'TrueFlow Assessment Form (Complete)' : 'TrueFlow Get Started Form (Complete)',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
    
    console.log('[API Complete] Sending comprehensive payload to GHL:', {
      name: ghlPayload.name,
      email: ghlPayload.email,
      companyName: ghlPayload.companyName,
      source: ghlPayload.source,
      tagsCount: tags.length,
      customFieldsCount: customFields.length,
      payloadSize: JSON.stringify(ghlPayload).length
    })
    
    // Create/update contact in GHL
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
      console.error('[API Complete] GHL API Error:', {
        status: ghlResponse.status,
        statusText: ghlResponse.statusText,
        error: errorData
      })
      
      // Still try to send email as backup
      try {
        if (formType === 'assessment') {
          await sendAssessmentNotification(data)
        } else {
          await sendGetStartedNotification(data)
        }
      } catch (emailError) {
        console.error('[API Complete] Backup email also failed:', emailError)
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Submission received successfully',
        warning: 'CRM sync pending - we will process your submission manually',
        leadScore,
        leadQuality,
        formType,
        ghlError: process.env.NODE_ENV === 'development' ? errorData : undefined
      })
    }
    
    const ghlResult = await ghlResponse.json()
    console.log('[API Complete] Contact created/updated successfully:', {
      contactId: ghlResult.contact?.id || ghlResult.id,
      hasContact: !!ghlResult.contact,
      hasId: !!ghlResult.id
    })
    
    // Send backup email notification
    try {
      console.log('[API Complete] Sending backup email notification...')
      if (formType === 'assessment') {
        await sendAssessmentNotification(data)
      } else {
        await sendGetStartedNotification(data)
      }
      console.log('[API Complete] Backup email sent successfully')
    } catch (emailError) {
      console.error('[API Complete] Backup email failed:', emailError)
    }
    
    console.log('[API Complete] ===== COMPLETE FIELD MAPPING SUCCESSFUL =====')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Lead processed with complete field mapping',
      ghlContactId: ghlResult.contact?.id || ghlResult.id,
      leadScore,
      leadQuality,
      formType,
      customFieldsUsed: customFields.length,
      tagsUsed: tags.length,
      fieldsEnsured: Array.from(fieldMap.keys()).length,
      mappingType: 'complete'
    })
    
  } catch (error) {
    console.error('[API Complete] ===== ERROR IN COMPLETE FIELD MAPPING =====')
    console.error('[API Complete] Error processing lead:', error)
    console.error('[API Complete] Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error in complete field mapping',
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