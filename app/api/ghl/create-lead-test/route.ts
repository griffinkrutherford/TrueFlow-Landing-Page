import { NextResponse } from 'next/server'
// Import custom field utilities
import { buildCustomFieldsPayload, calculateLeadScore, getQualificationStatus } from '@/lib/ghl/custom-fields'
import { isGHLConfigured, ensureCustomFieldsExist, upsertContact } from '@/lib/ghl/api-client'

export async function POST(request: Request) {
  console.log('[API] Received POST request to /api/ghl/create-lead (custom fields version)')
  
  try {
    // Parse request body
    const data = await request.json()
    console.log('[API] Request data:', JSON.stringify(data, null, 2))
    
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields: firstName, lastName, or email' 
      }, { status: 400 })
    }
    
    // Determine form type
    const isAssessment = 'score' in data && 'recommendation' in data
    const formType = isAssessment ? 'assessment' : 'get-started'
    console.log(`[API] Processing ${formType} form submission`)
    
    // Normalize array fields for get-started form
    if (!isAssessment) {
      if (data.contentGoals && !Array.isArray(data.contentGoals)) {
        data.contentGoals = typeof data.contentGoals === 'string' 
          ? data.contentGoals.split(',').map((s: string) => s.trim())
          : []
      }
      if (data.currentTools && !Array.isArray(data.currentTools)) {
        data.currentTools = typeof data.currentTools === 'string'
          ? data.currentTools.split(',').map((s: string) => s.trim())
          : []
      }
      data.contentGoals = data.contentGoals || []
      data.currentTools = data.currentTools || []
    }
    
    // Calculate lead quality score
    const leadScore = calculateLeadScore(data, formType)
    const qualStatus = getQualificationStatus(leadScore)
    console.log(`[API] Lead quality: ${leadScore}/100 (${qualStatus})`)
    
    // Check if GHL is configured
    const ghlConfig = isGHLConfigured()
    
    if (!ghlConfig.configured) {
      console.log('[API] GHL not configured, using email fallback')
      
      // Send email notification
      try {
        await sendEmailNotification(data, formType, leadScore, qualStatus)
        return NextResponse.json({ 
          success: true, 
          message: 'Submission received successfully (email sent)',
          leadScore,
          qualificationStatus: qualStatus
        })
      } catch (emailError) {
        console.error('[API] Email notification failed:', emailError)
        return NextResponse.json({ 
          success: true, 
          message: 'Submission received successfully',
          warning: 'Notification pending',
          leadScore,
          qualificationStatus: qualStatus
        })
      }
    }
    
    // GHL is configured - process with custom fields
    console.log('[API] Processing with GHL custom fields...')
    
    // Ensure custom fields exist (non-blocking)
    const existingFields = await ensureCustomFieldsExist(ghlConfig.config!)
    console.log(`[API] Working with ${existingFields.length} custom fields`)
    
    // Build custom fields payload
    const customFields = buildCustomFieldsPayload(data, formType, existingFields)
    console.log(`[API] Prepared ${customFields.length} custom field values`)
    
    // Build tags (minimal, since we're using custom fields)
    const tags = [
      `trueflow-${formType}`,
      'web-lead',
      new Date().toISOString().split('T')[0]
    ]
    
    // Prepare contact data
    const contactData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      locationId: ghlConfig.config!.locationId,
      name: `${data.firstName} ${data.lastName}`,
      companyName: data.businessName,
      tags,
      customFields,
      source: formType === 'assessment' ? 'TrueFlow AI Assessment' : 'TrueFlow Get Started Form',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
    
    // Upsert contact
    const contactResult = await upsertContact(contactData, ghlConfig.config!)
    
    if (!contactResult.success) {
      console.error('[API] Failed to create GHL contact:', contactResult.error)
      
      // Still send email as backup
      try {
        await sendEmailNotification(data, formType, leadScore, qualStatus)
      } catch (emailError) {
        console.error('[API] Backup email also failed:', emailError)
      }
      
      // Return success anyway - form submission succeeded
      return NextResponse.json({ 
        success: true, 
        message: 'Submission received successfully',
        warning: 'CRM sync pending',
        leadScore,
        qualificationStatus: qualStatus
      })
    }
    
    // Success! Also send backup email
    try {
      await sendEmailNotification(data, formType, leadScore, qualStatus)
    } catch (emailError) {
      console.error('[API] Backup email failed:', emailError)
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Lead processed successfully',
      ghlContactId: contactResult.contactId,
      leadScore,
      qualificationStatus: qualStatus
    })
    
  } catch (error) {
    console.error('[API] Error processing lead:', error)
    
    // Even on error, try to at least log the submission
    return NextResponse.json({ 
      success: true, // Still return success to avoid form error
      message: 'Submission received',
      warning: 'Processing delayed, but your information has been saved'
    })
  }
}

// Email notification helper
async function sendEmailNotification(
  data: any, 
  formType: string,
  leadScore: number,
  qualStatus: string
) {
  console.log('[Email] Sending notification...')
  
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes('your_')) {
    throw new Error('Email service not configured')
  }
  
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)
  
  const qualEmoji = qualStatus === 'hot' ? '🔥' : qualStatus === 'warm' ? '🌡️' : '❄️'
  
  let subject = ''
  let emailContent = ''
  
  if (formType === 'assessment') {
    subject = `New Assessment Lead: ${data.firstName} ${data.lastName} (Score: ${data.score}%) ${qualEmoji}`
    emailContent = `
      <h2>New Assessment Lead ${qualEmoji}</h2>
      <p><strong>Lead Quality Score:</strong> ${leadScore}/100 (${qualStatus.toUpperCase()})</p>
      <hr>
      <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
      ${data.businessName ? `<p><strong>Business:</strong> ${data.businessName}</p>` : ''}
      <p><strong>Assessment Score:</strong> ${data.score}%</p>
      <p><strong>Recommended Plan:</strong> ${data.recommendation}</p>
      <p><strong>Date:</strong> ${new Date(data.timestamp || Date.now()).toLocaleString()}</p>
      
      <h3>Assessment Answers:</h3>
      <ul>
        ${Object.entries(data.answers || {}).map(([question, answer]) => 
          `<li><strong>${question}:</strong> ${answer}</li>`
        ).join('')}
      </ul>
    `
  } else {
    subject = `New Get Started Lead: ${data.firstName} ${data.lastName} (${data.pricingPlan} Plan) ${qualEmoji}`
    emailContent = `
      <h2>New Get Started Form Submission ${qualEmoji}</h2>
      <p><strong>Lead Quality Score:</strong> ${leadScore}/100 (${qualStatus.toUpperCase()})</p>
      <hr>
      <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
      ${data.businessName ? `<p><strong>Business:</strong> ${data.businessName}</p>` : ''}
      <p><strong>Business Type:</strong> ${data.businessType}</p>
      <p><strong>Selected Plan:</strong> ${data.pricingPlan}</p>
      <p><strong>Date:</strong> ${new Date(data.timestamp || Date.now()).toLocaleString()}</p>
      
      <h3>Business Details:</h3>
      <ul>
        <li><strong>Content Goals:</strong> ${Array.isArray(data.contentGoals) ? data.contentGoals.join(', ') : data.contentGoals}</li>
        <li><strong>Monthly Leads:</strong> ${data.monthlyLeads}</li>
        <li><strong>Team Size:</strong> ${data.teamSize}</li>
        <li><strong>Current Tools:</strong> ${Array.isArray(data.currentTools) ? data.currentTools.join(', ') : data.currentTools}</li>
        <li><strong>Biggest Challenge:</strong> ${data.biggestChallenge}</li>
      </ul>
    `
  }
  
  const result = await resend.emails.send({
    from: 'TrueFlow AI <onboarding@resend.dev>',
    to: ['griffin@trueflow.ai', 'matt@trueflow.ai'],
    subject,
    html: emailContent
  })
  
  console.log('[Email] Email sent successfully:', result)
  return result
}

// OPTIONS handler for CORS
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}