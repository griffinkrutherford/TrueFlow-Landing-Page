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

// Enhanced custom field mapping with proper GHL field keys
const CUSTOM_FIELD_MAPPING = {
  // Assessment fields
  assessment_score: 'assessment_score',
  recommended_plan: 'recommended_plan',
  assessment_date: 'assessment_date',
  assessment_readiness_level: 'assessment_readiness_level',
  
  // Getting Started fields
  business_type: 'business_type',
  content_goals: 'content_goals',
  monthly_leads: 'monthly_leads',
  team_size: 'team_size',
  current_tools: 'current_tools',
  biggest_challenge: 'biggest_challenge',
  selected_plan: 'selected_plan',
  
  // Common fields
  form_type: 'form_type',
  submission_date: 'submission_date',
  lead_source: 'lead_source',
  lead_quality_score: 'lead_quality_score',
  
  // Business information
  company_website: 'company_website',
  industry: 'industry',
  annual_revenue: 'annual_revenue',
  
  // Engagement tracking
  last_activity_date: 'last_activity_date',
  engagement_score: 'engagement_score',
  nurture_stage: 'nurture_stage'
}

// Enhanced pipeline configuration with score-based stage placement
const PIPELINE_CONFIG = {
  assessmentPipelineId: process.env.GHL_ASSESSMENT_PIPELINE_ID || process.env.GHL_PIPELINE_ID,
  getStartedPipelineId: process.env.GHL_GETSTARTED_PIPELINE_ID || process.env.GHL_PIPELINE_ID,
  
  // Pipeline stages with score thresholds
  assessmentStages: {
    new: process.env.GHL_ASSESSMENT_STAGE_NEW || 'new_assessment',
    nurture: process.env.GHL_ASSESSMENT_STAGE_NURTURE || 'needs_nurturing', // Score < 40
    contacted: process.env.GHL_ASSESSMENT_STAGE_CONTACTED || 'contacted', // Score 40-60
    qualified: process.env.GHL_ASSESSMENT_STAGE_QUALIFIED || 'qualified', // Score 60-80
    hot_lead: process.env.GHL_ASSESSMENT_STAGE_HOT || 'hot_lead', // Score > 80
    proposal: process.env.GHL_ASSESSMENT_STAGE_PROPOSAL || 'proposal_sent',
    won: process.env.GHL_ASSESSMENT_STAGE_WON || 'customer',
    lost: process.env.GHL_ASSESSMENT_STAGE_LOST || 'lost'
  },
  
  getStartedStages: {
    new: process.env.GHL_GETSTARTED_STAGE_NEW || 'new_lead',
    exploring: process.env.GHL_GETSTARTED_STAGE_EXPLORING || 'exploring_options',
    engaged: process.env.GHL_GETSTARTED_STAGE_ENGAGED || 'engaged', // For high-value plans
    demo: process.env.GHL_GETSTARTED_STAGE_DEMO || 'demo_scheduled',
    trial: process.env.GHL_GETSTARTED_STAGE_TRIAL || 'trial_started',
    negotiation: process.env.GHL_GETSTARTED_STAGE_NEGOTIATION || 'negotiation',
    won: process.env.GHL_GETSTARTED_STAGE_WON || 'customer',
    lost: process.env.GHL_GETSTARTED_STAGE_LOST || 'lost'
  }
}

// Plan pricing mapping for opportunity values
const PLAN_PRICING: Record<string, { monthly: number, annual: number, ltv: number }> = {
  starter: { monthly: 97, annual: 970, ltv: 2910 },
  professional: { monthly: 297, annual: 2970, ltv: 8910 },
  growth: { monthly: 497, annual: 4970, ltv: 14910 },
  enterprise: { monthly: 997, annual: 9970, ltv: 29910 }
}

// Calculate lead quality score based on form data
function calculateLeadQualityScore(data: any, formType: string): number {
  let score = 0
  
  if (formType === 'assessment') {
    // Base score from assessment
    score = data.score || 0
    
    // Boost for immediate action indicators
    if (data.answers?.['budget'] === 'high') score += 10
    if (data.answers?.['timeline'] === 'immediate') score += 15
    if (data.answers?.['decision-maker'] === 'yes') score += 10
  } else {
    // Get Started form scoring
    const planScore: Record<string, number> = {
      starter: 25,
      professional: 50,
      growth: 75,
      enterprise: 100
    }
    const planKey = data.pricingPlan?.toLowerCase() || ''
    score = planScore[planKey] || 25
    
    // Adjust based on business indicators
    if (data.monthlyLeads === '100+' || data.monthlyLeads === '50-100') score += 10
    if (data.teamSize === '10+' || data.teamSize === '5-10') score += 10
    if (data.currentTools?.length > 2) score += 5
    if (data.businessType === 'Marketing Agency' || data.businessType === 'SaaS') score += 5
  }
  
  return Math.min(100, score)
}

// Determine appropriate pipeline stage based on score and data
function determinePipelineStage(data: any, formType: string, leadScore: number): string {
  if (formType === 'assessment') {
    const stages = PIPELINE_CONFIG.assessmentStages
    
    if (leadScore >= 80) return stages.hot_lead
    if (leadScore >= 60) return stages.qualified
    if (leadScore >= 40) return stages.contacted
    return stages.nurture
  } else {
    const stages = PIPELINE_CONFIG.getStartedStages
    const plan = data.pricingPlan?.toLowerCase()
    
    // High-value plans go straight to engaged
    if (plan === 'enterprise' || plan === 'growth') return stages.engaged
    if (plan === 'professional' && leadScore >= 60) return stages.engaged
    
    return stages.exploring
  }
}

export async function POST(request: Request) {
  console.log('[API] Received POST request to /api/ghl/create-lead')
  console.log('[API] Headers:', Object.fromEntries(request.headers.entries()))
  
  try {
    // Parse request body
    const data = await request.json()
    console.log('[API] Request data:', JSON.stringify(data, null, 2))
    
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email) {
      console.error('[API] Missing required fields:', {
        firstName: !!data.firstName,
        lastName: !!data.lastName,
        email: !!data.email
      })
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
      // Ensure contentGoals is an array
      if (data.contentGoals && !Array.isArray(data.contentGoals)) {
        console.warn('[API] contentGoals is not an array, converting:', data.contentGoals)
        data.contentGoals = typeof data.contentGoals === 'string' 
          ? data.contentGoals.split(',').map((s: string) => s.trim())
          : []
      }
      
      // Ensure currentTools is an array
      if (data.currentTools && !Array.isArray(data.currentTools)) {
        console.warn('[API] currentTools is not an array, converting:', data.currentTools)
        data.currentTools = typeof data.currentTools === 'string'
          ? data.currentTools.split(',').map((s: string) => s.trim())
          : []
      }
      
      // Set default empty arrays if missing
      data.contentGoals = data.contentGoals || []
      data.currentTools = data.currentTools || []
    }

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

    // Calculate lead quality score
    const leadQualityScore = calculateLeadQualityScore(data, formType)
    console.log(`[API] Calculated lead quality score: ${leadQualityScore}`)

    // Create or update contact in GHL
    const contactResult = await createOrUpdateGHLContact(data, formType, leadQualityScore)
    
    if (!contactResult.success) {
      // If GHL is not configured, still return success
      if (contactResult.message && contactResult.message.includes('not configured')) {
        console.log('[API] GHL not configured, but form submission successful')
        return NextResponse.json({ 
          success: true, 
          message: 'Form submission received successfully',
          contactId: contactResult.contactId,
          ghlStatus: 'not_configured'
        })
      }
      throw new Error(contactResult.error || 'Failed to create/update contact')
    }

    // Create opportunity if configured
    if (process.env.GHL_CREATE_OPPORTUNITIES === 'true' && contactResult.contactId) {
      try {
        const opportunityResult = await createGHLOpportunity(
          contactResult.contactId, 
          data, 
          formType, 
          leadQualityScore
        )
        console.log('[API] Opportunity created:', opportunityResult)
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
      ghlContactId: contactResult.contactId,
      leadQualityScore,
      isNewContact: contactResult.isNew
    })

  } catch (error) {
    console.error('Error processing lead:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      type: typeof error
    })
    
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' 
        ? {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            details: error
          }
        : undefined
    }, { status: 500 })
  }
}

// Enhanced create or update contact in GHL
async function createOrUpdateGHLContact(data: any, formType: string, leadQualityScore: number) {
  try {
    // Check if GHL is properly configured
    const isGHLConfigured = 
      process.env.GHL_ACCESS_TOKEN && 
      !process.env.GHL_ACCESS_TOKEN.includes('your_') &&
      process.env.GHL_LOCATION_ID &&
      !process.env.GHL_LOCATION_ID.includes('your_')
    
    if (!isGHLConfigured) {
      console.log('[GHL] GoHighLevel is not configured. Skipping CRM integration.')
      return {
        success: true,
        contactId: `demo-${Date.now()}`,
        message: 'GHL not configured - data logged only'
      }
    }
    
    // Build comprehensive tags
    const tags = [
      `trueflow-${formType}`,
      'web-lead',
      new Date().toISOString().split('T')[0], // Date tag
      `quality-score-${Math.floor(leadQualityScore / 10) * 10}` // Score bucket (0, 10, 20, etc.)
    ]
    
    if (formType === 'assessment') {
      tags.push(
        `score-${data.totalScore || data.score || 0}`,
        data.recommendation?.toLowerCase().replace(' ', '-') || 'assessment-completed',
        `readiness-${data.readinessLevel?.toLowerCase() || 'unknown'}`
      )
      
      // Add score range tags
      const score = data.totalScore || data.score || 0
      if (score >= 80) tags.push('hot-lead')
      else if (score >= 60) tags.push('qualified-lead')
      else if (score >= 40) tags.push('warm-lead')
      else tags.push('cold-lead')
      
      // Add recommendation-based tags
      if (data.recommendation) {
        tags.push(`plan-${data.recommendation.toLowerCase().replace(/\s+/g, '-')}`)
      }
    } else {
      tags.push(
        `plan-${data.pricingPlan?.toLowerCase() || 'unknown'}`,
        `business-${data.businessType?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}`,
        `team-size-${data.teamSize?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}`,
        `monthly-leads-${data.monthlyLeads?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}`
      )
      
      // Add value-based tags
      const plan = data.pricingPlan?.toLowerCase()
      if (plan === 'enterprise' || plan === 'growth') tags.push('high-value')
      else if (plan === 'professional') tags.push('medium-value')
      else tags.push('entry-level')
    }

    // Build comprehensive custom fields
    const customFields: GHLCustomField[] = [
      {
        key: CUSTOM_FIELD_MAPPING.form_type,
        field_value: formType
      },
      {
        key: CUSTOM_FIELD_MAPPING.submission_date,
        field_value: data.timestamp || new Date().toISOString()
      },
      {
        key: CUSTOM_FIELD_MAPPING.lead_quality_score,
        field_value: leadQualityScore.toString()
      },
      {
        key: CUSTOM_FIELD_MAPPING.lead_source,
        field_value: 'TrueFlow Website'
      }
    ]

    if (formType === 'assessment') {
      const assessmentData = data as AssessmentData
      customFields.push(
        {
          key: CUSTOM_FIELD_MAPPING.assessment_score,
          field_value: (assessmentData.score || 0).toString()
        },
        {
          key: CUSTOM_FIELD_MAPPING.recommended_plan,
          field_value: assessmentData.recommendation || ''
        },
        {
          key: CUSTOM_FIELD_MAPPING.assessment_date,
          field_value: assessmentData.timestamp || new Date().toISOString()
        },
        {
          key: CUSTOM_FIELD_MAPPING.assessment_readiness_level,
          field_value: data.readinessLevel || 'Unknown'
        }
      )
      
      // Add all assessment answers as custom fields
      Object.entries(assessmentData.answers || {}).forEach(([questionId, answer]) => {
        customFields.push({
          key: `assessment_${questionId?.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') || 'unknown'}`,
          field_value: String(answer || '')
        })
      })
    } else {
      const getStartedData = data as GetStartedData
      
      customFields.push(
        {
          key: CUSTOM_FIELD_MAPPING.business_type,
          field_value: getStartedData.businessType || ''
        },
        {
          key: CUSTOM_FIELD_MAPPING.content_goals,
          field_value: Array.isArray(getStartedData.contentGoals) 
            ? getStartedData.contentGoals.join(', ') 
            : (getStartedData.contentGoals || '')
        },
        {
          key: CUSTOM_FIELD_MAPPING.monthly_leads,
          field_value: getStartedData.monthlyLeads || ''
        },
        {
          key: CUSTOM_FIELD_MAPPING.team_size,
          field_value: getStartedData.teamSize || ''
        },
        {
          key: CUSTOM_FIELD_MAPPING.current_tools,
          field_value: Array.isArray(getStartedData.currentTools) 
            ? getStartedData.currentTools.join(', ') 
            : (getStartedData.currentTools || '')
        },
        {
          key: CUSTOM_FIELD_MAPPING.biggest_challenge,
          field_value: getStartedData.biggestChallenge || ''
        },
        {
          key: CUSTOM_FIELD_MAPPING.selected_plan,
          field_value: getStartedData.pricingPlan || ''
        }
      )
      
      // Add industry classification
      const industryMap: Record<string, string> = {
        'Marketing Agency': 'Agency',
        'E-commerce': 'Retail',
        'SaaS': 'Technology',
        'Consulting': 'Professional Services',
        'Content Creator': 'Media',
        'Podcaster': 'Media',
        'Coach/Consultant': 'Professional Services'
      }
      
      customFields.push({
        key: CUSTOM_FIELD_MAPPING.industry,
        field_value: industryMap[getStartedData.businessType] || 'Other'
      })
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

    // First, try to find existing contact by email
    const searchResponse = await fetch(
      `${GHL_API_BASE}/contacts/search?locationId=${process.env.GHL_LOCATION_ID}&email=${encodeURIComponent(data.email)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
          'Accept': 'application/json',
          'Version': GHL_API_VERSION
        }
      }
    )

    let existingContactId = null
    if (searchResponse.ok) {
      const searchResult = await searchResponse.json()
      if (searchResult.contacts && searchResult.contacts.length > 0) {
        existingContactId = searchResult.contacts[0].id
        console.log('[GHL] Found existing contact:', existingContactId)
      }
    }

    // Use create or update based on whether contact exists
    const endpoint = existingContactId 
      ? `${GHL_API_BASE}/contacts/${existingContactId}`
      : `${GHL_API_BASE}/contacts/`
    
    const method = existingContactId ? 'PUT' : 'POST'

    const ghlResponse = await fetch(endpoint, {
      method,
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
    console.log('[GHL] Contact processed successfully:', ghlResult)
    
    return {
      success: true,
      contactId: ghlResult.contact?.id || ghlResult.id || existingContactId,
      isNew: !existingContactId
    }
    
  } catch (error) {
    console.error('[GHL] Error creating/updating contact:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Enhanced create opportunity in GHL
async function createGHLOpportunity(
  contactId: string, 
  data: any, 
  formType: string, 
  leadQualityScore: number
) {
  try {
    const pipelineId = formType === 'assessment' 
      ? PIPELINE_CONFIG.assessmentPipelineId 
      : PIPELINE_CONFIG.getStartedPipelineId
      
    if (!pipelineId) {
      console.log('[GHL] No pipeline configured for', formType)
      return
    }

    // Calculate monetary value based on plan and billing period
    let monetaryValue = 0
    let opportunityName = ''
    const planKey = (data.pricingPlan || data.recommendation || 'starter').toLowerCase().replace(/\s+/g, '')
    
    if (PLAN_PRICING[planKey]) {
      // Use annual value as default opportunity value
      monetaryValue = PLAN_PRICING[planKey].annual
      
      // Adjust based on signals
      if (data.teamSize === '10+' || data.monthlyLeads === '100+') {
        // Likely to need multiple seats or higher tier
        monetaryValue = PLAN_PRICING[planKey].ltv
      }
    }

    // Determine pipeline stage based on score and data
    const pipelineStageId = determinePipelineStage(data, formType, leadQualityScore)

    // Create descriptive opportunity name
    if (formType === 'assessment') {
      opportunityName = `${data.firstName} ${data.lastName} - Assessment (${data.recommendation || 'TBD'})`
    } else {
      opportunityName = `${data.firstName} ${data.lastName} - ${data.pricingPlan} Plan`
    }

    const opportunityPayload = {
      pipelineId,
      locationId: process.env.GHL_LOCATION_ID!,
      contactId,
      name: opportunityName,
      pipelineStageId,
      status: 'open',
      monetaryValue,
      source: formType === 'assessment' ? 'Assessment Form' : 'Get Started Form',
      assignedTo: process.env.GHL_DEFAULT_USER_ID // Optional: auto-assign to specific user
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
    
    // Add a note to the opportunity with form details
    if (oppResult.id) {
      try {
        await addOpportunityNote(oppResult.id, data, formType, leadQualityScore)
      } catch (noteError) {
        console.error('[GHL] Failed to add note to opportunity:', noteError)
      }
    }
    
    return oppResult
    
  } catch (error) {
    console.error('[GHL] Error creating opportunity:', error)
    throw error
  }
}

// Add detailed note to opportunity
async function addOpportunityNote(opportunityId: string, data: any, formType: string, leadQualityScore: number) {
  let noteContent = `**Lead Quality Score:** ${leadQualityScore}/100\n\n`
  
  if (formType === 'assessment') {
    noteContent += `**Assessment Results:**\n`
    noteContent += `- Score: ${data.score}%\n`
    noteContent += `- Recommended Plan: ${data.recommendation}\n`
    noteContent += `- Readiness Level: ${data.readinessLevel || 'N/A'}\n\n`
    noteContent += `**Assessment Answers:**\n`
    Object.entries(data.answers || {}).forEach(([question, answer]) => {
      noteContent += `- ${question}: ${answer}\n`
    })
  } else {
    noteContent += `**Business Information:**\n`
    noteContent += `- Business Type: ${data.businessType}\n`
    noteContent += `- Team Size: ${data.teamSize}\n`
    noteContent += `- Monthly Leads: ${data.monthlyLeads}\n`
    noteContent += `- Selected Plan: ${data.pricingPlan}\n\n`
    noteContent += `**Goals & Challenges:**\n`
    noteContent += `- Content Goals: ${data.contentGoals?.join(', ') || 'N/A'}\n`
    noteContent += `- Current Tools: ${data.currentTools?.join(', ') || 'N/A'}\n`
    noteContent += `- Biggest Challenge: ${data.biggestChallenge || 'N/A'}\n`
  }
  
  const notePayload = {
    body: noteContent,
    contactId: opportunityId,
    userId: process.env.GHL_DEFAULT_USER_ID
  }
  
  await fetch(`${GHL_API_BASE}/notes/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Version': GHL_API_VERSION
    },
    body: JSON.stringify(notePayload)
  })
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
  
  const leadQualityScore = calculateLeadQualityScore(data, formType)
  
  if (formType === 'assessment') {
    const assessmentData = data as AssessmentData
    subject = `New Assessment Lead: ${assessmentData.firstName} ${assessmentData.lastName} (Score: ${assessmentData.score}% | Quality: ${leadQualityScore})`
    emailContent = `
      <h2>New Assessment Lead</h2>
      <p><strong>Lead Quality Score:</strong> ${leadQualityScore}/100</p>
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
    subject = `New Get Started Lead: ${getStartedData.firstName} ${getStartedData.lastName} (${getStartedData.pricingPlan} Plan | Quality: ${leadQualityScore})`
    emailContent = `
      <h2>New Get Started Form Submission</h2>
      <p><strong>Lead Quality Score:</strong> ${leadQualityScore}/100</p>
      <p><strong>Name:</strong> ${getStartedData.firstName} ${getStartedData.lastName}</p>
      <p><strong>Email:</strong> ${getStartedData.email}</p>
      ${getStartedData.phone ? `<p><strong>Phone:</strong> ${getStartedData.phone}</p>` : ''}
      ${getStartedData.businessName ? `<p><strong>Business:</strong> ${getStartedData.businessName}</p>` : ''}
      <p><strong>Business Type:</strong> ${getStartedData.businessType}</p>
      <p><strong>Selected Plan:</strong> ${getStartedData.pricingPlan}</p>
      <p><strong>Estimated Value:</strong> $${PLAN_PRICING[getStartedData.pricingPlan?.toLowerCase() || '']?.annual || 0}/year</p>
      <p><strong>Date:</strong> ${new Date(getStartedData.timestamp).toLocaleString()}</p>
      
      <h3>Business Details:</h3>
      <ul>
        <li><strong>Content Goals:</strong> ${Array.isArray(getStartedData.contentGoals) ? getStartedData.contentGoals.join(', ') : (getStartedData.contentGoals || 'Not specified')}</li>
        <li><strong>Monthly Leads:</strong> ${getStartedData.monthlyLeads || 'Not specified'}</li>
        <li><strong>Team Size:</strong> ${getStartedData.teamSize || 'Not specified'}</li>
        <li><strong>Current Tools:</strong> ${Array.isArray(getStartedData.currentTools) ? getStartedData.currentTools.join(', ') : (getStartedData.currentTools || 'Not specified')}</li>
        <li><strong>Biggest Challenge:</strong> ${getStartedData.biggestChallenge || 'Not specified'}</li>
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