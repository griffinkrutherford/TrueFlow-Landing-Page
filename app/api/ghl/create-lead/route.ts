import { NextResponse } from 'next/server'

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

interface GetStartedData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  businessName?: string
  businessType: string
  contentGoals: string[]
  monthlyLeads: string
  teamSize: string
  currentTools: string[]
  biggestChallenge: string
  pricingPlan: string
  timestamp: string
}

// Map form fields to custom field keys
const CUSTOM_FIELD_MAPPING = {
  // Assessment fields
  assessment_score: 'assessment_score',
  recommended_plan: 'recommended_plan',
  assessment_date: 'assessment_date',
  
  // Getting Started fields
  business_type: 'business_type',
  content_goals: 'content_goals',
  monthly_leads: 'monthly_leads',
  team_size: 'team_size',
  current_tools: 'current_tools',
  biggest_challenge: 'biggest_challenge',
  selected_plan: 'selected_plan',
  form_type: 'form_type',
  submission_date: 'submission_date'
}

// Pipeline configuration
const PIPELINE_CONFIG = {
  assessmentPipelineId: process.env.GHL_ASSESSMENT_PIPELINE_ID || process.env.GHL_PIPELINE_ID,
  getStartedPipelineId: process.env.GHL_GETSTARTED_PIPELINE_ID || process.env.GHL_PIPELINE_ID,
  
  // Pipeline stages - you'll need to set these in environment variables
  assessmentStages: {
    new: process.env.GHL_ASSESSMENT_STAGE_NEW || 'new_assessment',
    contacted: process.env.GHL_ASSESSMENT_STAGE_CONTACTED || 'contacted',
    qualified: process.env.GHL_ASSESSMENT_STAGE_QUALIFIED || 'qualified',
    proposal: process.env.GHL_ASSESSMENT_STAGE_PROPOSAL || 'proposal_sent',
    won: process.env.GHL_ASSESSMENT_STAGE_WON || 'customer',
    lost: process.env.GHL_ASSESSMENT_STAGE_LOST || 'lost'
  },
  
  getStartedStages: {
    new: process.env.GHL_GETSTARTED_STAGE_NEW || 'new_lead',
    exploring: process.env.GHL_GETSTARTED_STAGE_EXPLORING || 'exploring_options',
    demo: process.env.GHL_GETSTARTED_STAGE_DEMO || 'demo_scheduled',
    trial: process.env.GHL_GETSTARTED_STAGE_TRIAL || 'trial_started',
    won: process.env.GHL_GETSTARTED_STAGE_WON || 'customer',
    lost: process.env.GHL_GETSTARTED_STAGE_LOST || 'lost'
  }
}

export async function POST(request: Request) {
  console.log('[API] Received POST request to /api/ghl/create-lead')
  console.log('[API] Headers:', Object.fromEntries(request.headers.entries()))
  
  try {
    // Parse request body
    const data = await request.json()
    console.log('[API] Request data:', JSON.stringify(data, null, 2))
    
    // Determine form type
    const isAssessment = 'score' in data && 'recommendation' in data
    const formType = isAssessment ? 'assessment' : 'get-started'
    
    console.log(`[API] Processing ${formType} form submission`)

    // Check if GHL integration is enabled and configured
    if (!process.env.GHL_ACCESS_TOKEN || !process.env.GHL_LOCATION_ID) {
      console.log('[API] GHL integration not configured, using email fallback')
      
      // Try to send email notification as fallback
      try {
        await sendEmailNotification(data, formType)
        return NextResponse.json({ 
          success: true, 
          message: 'Submission received successfully (email sent)' 
        })
      } catch (emailError) {
        console.error('[API] Email notification failed:', emailError)
        console.log('[API] Lead data saved to logs:', JSON.stringify(data, null, 2))
        
        // Still return success to prevent form error
        return NextResponse.json({ 
          success: true, 
          message: 'Submission received successfully',
          warning: 'Email notification pending, but your submission has been received.',
          leadId: `log-${Date.now()}`
        })
      }
    }

    // Create or update contact in GHL
    const contactResult = await createOrUpdateGHLContact(data, formType)
    
    if (!contactResult.success) {
      throw new Error(contactResult.error || 'Failed to create/update contact')
    }

    // Create opportunity if configured
    if (process.env.GHL_CREATE_OPPORTUNITIES === 'true' && contactResult.contactId) {
      try {
        await createGHLOpportunity(contactResult.contactId, data, formType)
      } catch (oppError) {
        console.error('[API] Failed to create opportunity:', oppError)
        // Don't fail the request if opportunity creation fails
      }
    }

    // Also send email notification (as backup)
    try {
      console.log('[API] Sending backup email notification...')
      await sendEmailNotification(data, formType)
      console.log('[API] Backup email sent successfully')
    } catch (emailError) {
      console.error('[API] Backup email notification failed:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Lead processed successfully',
      ghlContactId: contactResult.contactId
    })

  } catch (error) {
    console.error('Error processing lead:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
}

// Create or update contact in GHL
async function createOrUpdateGHLContact(data: any, formType: string) {
  try {
    // Build tags
    const tags = [
      `trueflow-${formType}`,
      'web-lead',
      new Date().toISOString().split('T')[0] // Add date tag
    ]
    
    if (formType === 'assessment') {
      tags.push(
        `score-${data.totalScore || data.score || 0}`,
        data.recommendation?.toLowerCase().replace(' ', '-') || 'assessment-completed'
      )
      // Also add the selected plan if available
      if (data.selectedPlan) {
        tags.push(`plan-${data.selectedPlan.toLowerCase().replace(/\s+/g, '-')}`)
      }
    } else {
      tags.push(
        `plan-${data.pricingPlan?.toLowerCase() || 'unknown'}`,
        `business-${data.businessType?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}`
      )
    }

    // Build custom fields
    const customFields: GHLCustomField[] = [
      {
        key: CUSTOM_FIELD_MAPPING.form_type,
        field_value: formType
      },
      {
        key: CUSTOM_FIELD_MAPPING.submission_date,
        field_value: data.timestamp || new Date().toISOString()
      }
    ]

    if (formType === 'assessment') {
      const assessmentData = data as AssessmentData
      customFields.push(
        {
          key: CUSTOM_FIELD_MAPPING.assessment_score,
          field_value: assessmentData.score.toString()
        },
        {
          key: CUSTOM_FIELD_MAPPING.recommended_plan,
          field_value: assessmentData.recommendation
        }
      )
      
      // Add assessment answers
      Object.entries(assessmentData.answers || {}).forEach(([questionId, answer]) => {
        customFields.push({
          key: `assessment_${questionId?.toLowerCase().replace(/\s+/g, '_') || 'unknown'}`,
          field_value: answer || ''
        })
      })
    } else {
      const getStartedData = data as GetStartedData
      customFields.push(
        {
          key: CUSTOM_FIELD_MAPPING.business_type,
          field_value: getStartedData.businessType
        },
        {
          key: CUSTOM_FIELD_MAPPING.content_goals,
          field_value: getStartedData.contentGoals.join(', ')
        },
        {
          key: CUSTOM_FIELD_MAPPING.monthly_leads,
          field_value: getStartedData.monthlyLeads
        },
        {
          key: CUSTOM_FIELD_MAPPING.team_size,
          field_value: getStartedData.teamSize
        },
        {
          key: CUSTOM_FIELD_MAPPING.current_tools,
          field_value: getStartedData.currentTools.join(', ')
        },
        {
          key: CUSTOM_FIELD_MAPPING.biggest_challenge,
          field_value: getStartedData.biggestChallenge
        },
        {
          key: CUSTOM_FIELD_MAPPING.selected_plan,
          field_value: getStartedData.pricingPlan
        }
      )
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

    console.log('[GHL] Attempting to upsert contact with payload:', JSON.stringify(ghlPayload, null, 2))

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
      console.error('[GHL] API Error:', {
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
    console.log('[GHL] Contact upserted successfully:', ghlResult)
    
    return {
      success: true,
      contactId: ghlResult.contact?.id || ghlResult.id,
      isNew: ghlResult.new || false
    }
    
  } catch (error) {
    console.error('[GHL] Error creating/updating contact:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Create opportunity in GHL
async function createGHLOpportunity(contactId: string, data: any, formType: string) {
  try {
    const pipelineId = formType === 'assessment' 
      ? PIPELINE_CONFIG.assessmentPipelineId 
      : PIPELINE_CONFIG.getStartedPipelineId
      
    const stages = formType === 'assessment'
      ? PIPELINE_CONFIG.assessmentStages
      : PIPELINE_CONFIG.getStartedStages
      
    if (!pipelineId) {
      console.log('[GHL] No pipeline configured for', formType)
      return
    }

    // Calculate monetary value based on plan
    let monetaryValue = 0
    if (formType === 'get-started' && data.pricingPlan) {
      const planValues: Record<string, number> = {
        'starter': 97,
        'professional': 297,
        'growth': 497,
        'enterprise': 997
      }
      monetaryValue = planValues[data.pricingPlan?.toLowerCase() || 'unknown'] || 0
    } else if (formType === 'assessment' && data.recommendation) {
      const recommendationValues: Record<string, number> = {
        'starter': 97,
        'professional': 297,
        'growth': 497,
        'enterprise': 997
      }
      monetaryValue = recommendationValues[data.recommendation?.toLowerCase() || 'unknown'] || 0
    }

    const opportunityPayload = {
      pipelineId,
      locationId: process.env.GHL_LOCATION_ID!,
      contactId,
      name: formType === 'assessment' 
        ? `Assessment - ${data.firstName} ${data.lastName}` 
        : `Get Started - ${data.firstName} ${data.lastName}`,
      pipelineStageId: stages.new,
      status: 'open',
      monetaryValue,
      source: formType === 'assessment' ? 'Assessment Form' : 'Get Started Form'
    }

    console.log('[GHL] Creating opportunity:', opportunityPayload)

    const oppResponse = await fetch(`${GHL_API_BASE}/opportunities/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Version': GHL_API_VERSION
      },
      body: JSON.stringify(opportunityPayload)
    })

    if (!oppResponse.ok) {
      const errorData = await oppResponse.text()
      console.error('[GHL] Failed to create opportunity:', errorData)
      throw new Error(`Failed to create opportunity: ${oppResponse.status}`)
    }

    const oppResult = await oppResponse.json()
    console.log('[GHL] Opportunity created successfully:', oppResult)
    
    return oppResult
    
  } catch (error) {
    console.error('[GHL] Error creating opportunity:', error)
    throw error
  }
}

// Helper function to send email notification
async function sendEmailNotification(data: any, formType: string) {
  console.log('[Email] Starting email notification process')
  
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes('your_')) {
    console.error('[Email] ERROR: Resend API key not configured or is placeholder')
    throw new Error('Email service not configured - please set RESEND_API_KEY in Railway')
  }

  console.log('[Email] Loading Resend library...')
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)

  let emailContent = ''
  let subject = ''
  
  if (formType === 'assessment') {
    const assessmentData = data as AssessmentData
    subject = `New Assessment Lead: ${assessmentData.firstName} ${assessmentData.lastName} (Score: ${assessmentData.score}%)`
    emailContent = `
      <h2>New Assessment Lead</h2>
      <p><strong>Name:</strong> ${assessmentData.firstName} ${assessmentData.lastName}</p>
      <p><strong>Email:</strong> ${assessmentData.email}</p>
      ${assessmentData.phone ? `<p><strong>Phone:</strong> ${assessmentData.phone}</p>` : ''}
      ${assessmentData.businessName ? `<p><strong>Business:</strong> ${assessmentData.businessName}</p>` : ''}
      <p><strong>Assessment Score:</strong> ${assessmentData.score}%</p>
      <p><strong>Recommended Plan:</strong> ${assessmentData.recommendation}</p>
      <p><strong>Date:</strong> ${new Date(assessmentData.timestamp).toLocaleString()}</p>
      
      <h3>Assessment Answers:</h3>
      <ul>
        ${Object.entries(assessmentData.answers).map(([question, answer]) => 
          `<li><strong>${question}:</strong> ${answer}</li>`
        ).join('')}
      </ul>
    `
  } else {
    const getStartedData = data as GetStartedData
    subject = `New Get Started Lead: ${getStartedData.firstName} ${getStartedData.lastName} (${getStartedData.pricingPlan} Plan)`
    emailContent = `
      <h2>New Get Started Form Submission</h2>
      <p><strong>Name:</strong> ${getStartedData.firstName} ${getStartedData.lastName}</p>
      <p><strong>Email:</strong> ${getStartedData.email}</p>
      ${getStartedData.phone ? `<p><strong>Phone:</strong> ${getStartedData.phone}</p>` : ''}
      ${getStartedData.businessName ? `<p><strong>Business:</strong> ${getStartedData.businessName}</p>` : ''}
      <p><strong>Business Type:</strong> ${getStartedData.businessType}</p>
      <p><strong>Selected Plan:</strong> ${getStartedData.pricingPlan}</p>
      <p><strong>Date:</strong> ${new Date(getStartedData.timestamp).toLocaleString()}</p>
      
      <h3>Business Details:</h3>
      <ul>
        <li><strong>Content Goals:</strong> ${getStartedData.contentGoals.join(', ')}</li>
        <li><strong>Monthly Leads:</strong> ${getStartedData.monthlyLeads}</li>
        <li><strong>Team Size:</strong> ${getStartedData.teamSize}</li>
        <li><strong>Current Tools:</strong> ${getStartedData.currentTools.join(', ')}</li>
        <li><strong>Biggest Challenge:</strong> ${getStartedData.biggestChallenge}</li>
      </ul>
    `
  }

  const fromEmail = 'TrueFlow AI <onboarding@resend.dev>'
  const toEmails = ['griffin@trueflow.ai', 'matt@trueflow.ai']

  console.log('[Email] Sending email...')
  console.log('[Email] From:', fromEmail)
  console.log('[Email] To:', toEmails)
  console.log('[Email] Subject:', subject)

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: toEmails,
      subject,
      html: emailContent
    })
    
    console.log('[Email] Email sent successfully:', result)
    return result
  } catch (error) {
    console.error('[Email] ERROR sending email:', error)
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