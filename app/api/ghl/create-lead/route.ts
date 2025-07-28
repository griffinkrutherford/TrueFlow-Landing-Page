import { NextResponse } from 'next/server'

// GHL API configuration
const GHL_API_BASE = 'https://services.leadconnectorhq.com'
const GHL_API_VERSION = process.env.GHL_API_VERSION || '2021-07-28'

interface GHLCustomField {
  key: string
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
}

interface AssessmentData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  businessName?: string
  answers: Record<string, string>
  score: number
  recommendation: string
  timestamp: string
}

export async function POST(request: Request) {
  console.log('[API] Received POST request to /api/ghl/create-lead')
  console.log('[API] Headers:', Object.fromEntries(request.headers.entries()))
  
  try {
    // Parse request body
    const data: AssessmentData = await request.json()
    console.log('[API] Request data:', JSON.stringify(data, null, 2))

    // Check if GHL integration is enabled and configured
    if (process.env.GHL_ENABLED !== 'true' || !process.env.GHL_ACCESS_TOKEN || !process.env.GHL_LOCATION_ID) {
      console.log('[API] GHL integration disabled or not configured, using email fallback')
      console.log('[API] GHL_ENABLED:', process.env.GHL_ENABLED)
      console.log('[API] GHL_ACCESS_TOKEN:', process.env.GHL_ACCESS_TOKEN ? 'Set' : 'Not set')
      console.log('[API] GHL_LOCATION_ID:', process.env.GHL_LOCATION_ID ? 'Set' : 'Not set')
      
      // Try to send email notification as fallback
      try {
        await sendEmailNotification(data)
        return NextResponse.json({ 
          success: true, 
          message: 'Assessment submitted successfully (email sent)' 
        })
      } catch (emailError) {
        console.error('[API] Email notification failed:', emailError)
        console.log('[API] Lead data saved to logs:', JSON.stringify(data, null, 2))
        
        // Still return success to prevent form error
        // The lead data is logged and can be retrieved from Railway logs
        return NextResponse.json({ 
          success: true, 
          message: 'Assessment submitted successfully',
          warning: 'Email notification pending, but your submission has been received.',
          leadId: `log-${Date.now()}`
        })
      }
    }

    // Build tags based on assessment results
    const tags = [
      'trueflow-assessment',
      `score-${data.score}`,
      data.recommendation.toLowerCase().replace(' ', '-'),
      'web-lead',
      new Date().toISOString().split('T')[0] // Add date tag
    ]

    // Build custom fields from assessment answers
    const customFields: GHLCustomField[] = [
      {
        key: 'assessment_score',
        field_value: data.score.toString()
      },
      {
        key: 'recommended_plan',
        field_value: data.recommendation
      },
      {
        key: 'business_name',
        field_value: data.businessName || ''
      },
      {
        key: 'assessment_date',
        field_value: data.timestamp
      }
    ]

    // Add assessment answers as custom fields
    Object.entries(data.answers).forEach(([questionId, answer]) => {
      customFields.push({
        key: `assessment_${questionId}`,
        field_value: answer
      })
    })

    // Prepare GHL lead data
    const ghlPayload: GHLLeadData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      locationId: process.env.GHL_LOCATION_ID,
      name: `${data.firstName} ${data.lastName}`,
      tags,
      customFields,
      source: 'TrueFlow AI Assessment',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }

    // Make API call to GHL
    const ghlResponse = await fetch(`${GHL_API_BASE}/contacts/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Version': GHL_API_VERSION
      },
      body: JSON.stringify(ghlPayload)
    })

    // Handle GHL response
    if (!ghlResponse.ok) {
      const errorData = await ghlResponse.text()
      console.error('GHL API Error:', {
        status: ghlResponse.status,
        statusText: ghlResponse.statusText,
        error: errorData
      })

      // Handle rate limiting
      if (ghlResponse.status === 429) {
        return NextResponse.json({ 
          success: false, 
          message: 'Rate limit exceeded. Please try again later.' 
        }, { status: 429 })
      }

      return NextResponse.json({ 
        success: false, 
        message: 'Failed to create lead in GHL',
        error: process.env.NODE_ENV === 'development' ? errorData : undefined
      }, { status: ghlResponse.status })
    }

    const ghlResult = await ghlResponse.json()

    // Also send email notification (as backup)
    try {
      console.log('[API] Sending backup email notification...')
      await sendEmailNotification(data)
      console.log('[API] Backup email sent successfully')
    } catch (emailError) {
      console.error('[API] Backup email notification failed:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Lead created successfully',
      ghlContactId: ghlResult.contact?.id || ghlResult.id
    })

  } catch (error) {
    console.error('Error creating GHL lead:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
}

// Helper function to send email notification
async function sendEmailNotification(data: AssessmentData) {
  console.log('[Email] Starting email notification process')
  
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes('your_')) {
    console.error('[Email] ERROR: Resend API key not configured or is placeholder')
    console.log('[Email] Resend API key status:', process.env.RESEND_API_KEY ? 'Set but invalid' : 'Not set')
    throw new Error('Email service not configured - please set RESEND_API_KEY in Railway')
  }

  console.log('[Email] Loading Resend library...')
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)

  const emailContent = `
    <h2>New Assessment Lead</h2>
    <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
    ${data.businessName ? `<p><strong>Business:</strong> ${data.businessName}</p>` : ''}
    <p><strong>Assessment Score:</strong> ${data.score}%</p>
    <p><strong>Recommended Plan:</strong> ${data.recommendation}</p>
    <p><strong>Date:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
    
    <h3>Assessment Answers:</h3>
    <ul>
      ${Object.entries(data.answers).map(([question, answer]) => 
        `<li><strong>${question}:</strong> ${answer}</li>`
      ).join('')}
    </ul>
  `

  // Use the resend.dev domain for reliable email delivery
  // (custom domains like @trueflow.ai require domain verification in Resend)
  const fromEmail = 'TrueFlow AI <onboarding@resend.dev>'
  const toEmails = ['griffin@trueflow.ai', 'matt@trueflow.ai']

  console.log('[Email] Sending email...')
  console.log('[Email] From:', fromEmail)
  console.log('[Email] To:', toEmails)
  console.log('[Email] Subject:', `New Assessment Lead: ${data.firstName} ${data.lastName} (Score: ${data.score}%)`)

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: toEmails,
      subject: `New Assessment Lead: ${data.firstName} ${data.lastName} (Score: ${data.score}%)`,
      html: emailContent
    })
    
    console.log('[Email] Email sent successfully:', result)
    return result
  } catch (error) {
    console.error('[Email] ERROR sending email:', error)
    console.error('[Email] Error details:', JSON.stringify(error, null, 2))
    throw error
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