import { NextResponse } from 'next/server'

// GHL API configuration
const GHL_API_BASE = 'https://services.leadconnectorhq.com'
const GHL_API_VERSION = process.env.GHL_API_VERSION || '2021-07-28'

// Cache for custom fields to avoid repeated API calls
let customFieldsCache: any[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Define all the fields we need from the Get Started form
const REQUIRED_CUSTOM_FIELDS = [
  // Assessment/Form metadata
  { name: 'Form Type', fieldKey: 'form_type', dataType: 'TEXT' },
  { name: 'Submission Date', fieldKey: 'submission_date', dataType: 'DATE' },
  { name: 'Lead Source', fieldKey: 'lead_source', dataType: 'TEXT' },
  
  // Business Information
  { name: 'Business Type', fieldKey: 'business_type', dataType: 'TEXT' },
  { name: 'Business Name', fieldKey: 'business_name', dataType: 'TEXT' },
  
  // Get Started specific fields
  { name: 'Content Goals', fieldKey: 'content_goals', dataType: 'TEXT_AREA' },
  { name: 'Monthly Leads', fieldKey: 'monthly_leads', dataType: 'TEXT' },
  { name: 'Team Size', fieldKey: 'team_size', dataType: 'TEXT' },
  { name: 'Current Tools', fieldKey: 'current_tools', dataType: 'TEXT_AREA' },
  { name: 'Biggest Challenge', fieldKey: 'biggest_challenge', dataType: 'TEXT_AREA' },
  { name: 'Selected Plan', fieldKey: 'selected_plan', dataType: 'TEXT' },
  
  // Assessment specific fields
  { name: 'Assessment Score', fieldKey: 'assessment_score', dataType: 'NUMBER' },
  { name: 'Recommended Plan', fieldKey: 'recommended_plan', dataType: 'TEXT' },
  { name: 'Assessment Date', fieldKey: 'assessment_date', dataType: 'DATE' },
  
  // Scoring and qualification
  { name: 'Lead Quality Score', fieldKey: 'lead_quality_score', dataType: 'NUMBER' },
  { name: 'Qualification Status', fieldKey: 'qualification_status', dataType: 'TEXT' },
  
  // Additional tracking fields
  { name: 'First Touch Date', fieldKey: 'first_touch_date', dataType: 'DATE' },
  { name: 'Last Activity Date', fieldKey: 'last_activity_date', dataType: 'DATE' },
  { name: 'Engagement Score', fieldKey: 'engagement_score', dataType: 'NUMBER' },
  
  // Answer tracking for assessments
  { name: 'Assessment Answers', fieldKey: 'assessment_answers', dataType: 'TEXT_AREA' },
  { name: 'Marketing Goals', fieldKey: 'marketing_goals', dataType: 'TEXT_AREA' },
  { name: 'Current Challenges', fieldKey: 'current_challenges', dataType: 'TEXT_AREA' },
  { name: 'Budget Range', fieldKey: 'budget_range', dataType: 'TEXT' },
  { name: 'Timeline', fieldKey: 'timeline', dataType: 'TEXT' },
  { name: 'Decision Maker', fieldKey: 'decision_maker', dataType: 'TEXT' }
]

// Fetch existing custom fields from GHL
async function getExistingCustomFields(forceRefresh = false): Promise<any[]> {
  // Check cache first
  if (!forceRefresh && customFieldsCache && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
    console.log('[GHL] Using cached custom fields')
    return customFieldsCache
  }

  try {
    console.log('[GHL] Fetching custom fields from API...')
    const response = await fetch(`${GHL_API_BASE}/locations/${process.env.GHL_LOCATION_ID}/customFields`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
        'Accept': 'application/json',
        'Version': GHL_API_VERSION
      }
    })

    if (!response.ok) {
      console.error('[GHL] Failed to fetch custom fields:', response.status)
      return []
    }

    const data = await response.json()
    customFieldsCache = data.customFields || []
    cacheTimestamp = Date.now()
    
    console.log(`[GHL] Found ${customFieldsCache?.length || 0} existing custom fields`)
    return customFieldsCache || []
  } catch (error) {
    console.error('[GHL] Error fetching custom fields:', error)
    return []
  }
}

// Create a custom field if it doesn't exist
async function ensureCustomFieldExists(field: { name: string, fieldKey: string, dataType: string }): Promise<string | null> {
  try {
    // Get existing fields
    const existingFields = await getExistingCustomFields()
    
    // Check if field already exists (by fieldKey)
    const existing = existingFields.find(f => 
      f.fieldKey === field.fieldKey || 
      f.name.toLowerCase() === field.name.toLowerCase()
    )
    
    if (existing) {
      console.log(`[GHL] Custom field already exists: ${field.name} (${existing.id})`)
      return existing.id
    }
    
    // Create new custom field
    console.log(`[GHL] Creating new custom field: ${field.name}`)
    const response = await fetch(`${GHL_API_BASE}/locations/${process.env.GHL_LOCATION_ID}/customFields`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Version': GHL_API_VERSION
      },
      body: JSON.stringify({
        name: field.name,
        fieldKey: field.fieldKey,
        dataType: field.dataType,
        position: 0
      })
    })
    
    if (!response.ok) {
      const error = await response.text()
      console.error(`[GHL] Failed to create custom field ${field.name}:`, error)
      return null
    }
    
    const result = await response.json()
    console.log(`[GHL] Created custom field: ${field.name} (${result.customField.id})`)
    
    // Invalidate cache
    customFieldsCache = null
    
    return result.customField.id
  } catch (error) {
    console.error(`[GHL] Error ensuring custom field ${field.name}:`, error)
    return null
  }
}

// Ensure all required custom fields exist
async function ensureAllCustomFieldsExist() {
  console.log('[GHL] Ensuring all required custom fields exist...')
  
  const results = await Promise.all(
    REQUIRED_CUSTOM_FIELDS.map(field => ensureCustomFieldExists(field))
  )
  
  const created = results.filter(r => r !== null).length
  console.log(`[GHL] Custom fields check complete. ${created} fields ready.`)
}

// Build custom fields array for contact creation/update
async function buildCustomFieldsArray(data: any, formType: string): Promise<any[]> {
  // Ensure all fields exist first
  await ensureAllCustomFieldsExist()
  
  // Get fresh list of fields
  const existingFields = await getExistingCustomFields(true)
  
  // Helper to find field ID by key
  const getFieldId = (fieldKey: string): string | undefined => {
    const field = existingFields.find(f => f.fieldKey === fieldKey)
    return field?.id
  }
  
  const customFields: any[] = []
  
  // Add field helper
  const addField = (fieldKey: string, value: any) => {
    const fieldId = getFieldId(fieldKey)
    if (fieldId && value !== undefined && value !== null && value !== '') {
      customFields.push({
        id: fieldId,
        field_value: typeof value === 'object' ? JSON.stringify(value) : String(value)
      })
    }
  }
  
  // Common fields for all forms
  addField('form_type', formType)
  addField('submission_date', data.timestamp || new Date().toISOString())
  addField('lead_source', 'TrueFlow Landing Page')
  addField('business_name', data.businessName)
  addField('first_touch_date', new Date().toISOString())
  addField('last_activity_date', new Date().toISOString())
  
  if (formType === 'assessment') {
    // Assessment specific fields
    addField('assessment_score', data.score)
    addField('recommended_plan', data.recommendation)
    addField('assessment_date', data.timestamp || new Date().toISOString())
    addField('lead_quality_score', data.score)
    addField('qualification_status', data.score >= 70 ? 'Highly Qualified' : data.score >= 50 ? 'Qualified' : 'Needs Nurturing')
    
    // Process assessment answers
    if (data.answers) {
      addField('assessment_answers', data.answers)
      
      // Extract specific answers if available
      Object.entries(data.answers).forEach(([key, value]) => {
        if (key.includes('marketing') || key.includes('goals')) {
          addField('marketing_goals', value)
        } else if (key.includes('challenge')) {
          addField('current_challenges', value)
        } else if (key.includes('budget')) {
          addField('budget_range', value)
        } else if (key.includes('timeline')) {
          addField('timeline', value)
        } else if (key.includes('decision')) {
          addField('decision_maker', value)
        }
      })
    }
  } else {
    // Get Started specific fields
    addField('business_type', data.businessType)
    addField('content_goals', Array.isArray(data.contentGoals) ? data.contentGoals.join(', ') : data.contentGoals)
    addField('monthly_leads', data.monthlyLeads)
    addField('team_size', data.teamSize)
    addField('current_tools', Array.isArray(data.currentTools) ? data.currentTools.join(', ') : data.currentTools)
    addField('biggest_challenge', data.biggestChallenge)
    addField('selected_plan', data.pricingPlan)
    
    // Calculate lead quality score for Get Started
    let qualityScore = 50 // Base score
    if (data.monthlyLeads === '100+') qualityScore += 20
    else if (data.monthlyLeads === '50-100') qualityScore += 15
    else if (data.monthlyLeads === '10-50') qualityScore += 10
    
    if (data.teamSize === '10+') qualityScore += 15
    else if (data.teamSize === '5-10') qualityScore += 10
    
    if (data.pricingPlan === 'enterprise') qualityScore += 15
    else if (data.pricingPlan === 'growth') qualityScore += 10
    else if (data.pricingPlan === 'professional') qualityScore += 5
    
    addField('lead_quality_score', qualityScore)
    addField('qualification_status', qualityScore >= 70 ? 'Hot Lead' : qualityScore >= 50 ? 'Warm Lead' : 'Cold Lead')
    addField('engagement_score', qualityScore)
  }
  
  console.log(`[GHL] Built ${customFields.length} custom fields for contact`)
  return customFields
}

export async function POST(request: Request) {
  console.log('[API] Received POST request to /api/ghl/create-lead (v2)')
  
  try {
    const data = await request.json()
    console.log('[API] Request data:', JSON.stringify(data, null, 2))
    
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields: firstName, lastName, or email' 
      }, { status: 400 })
    }
    
    // Check if GHL is configured
    if (!process.env.GHL_ACCESS_TOKEN || !process.env.GHL_LOCATION_ID || 
        process.env.GHL_ACCESS_TOKEN.includes('your_') || 
        process.env.GHL_ENABLED !== 'true') {
      console.log('[API] GHL not properly configured, using fallback')
      
      // Send email notification as fallback
      try {
        await sendEmailNotification(data, data.score ? 'assessment' : 'get-started')
        return NextResponse.json({ 
          success: true, 
          message: 'Submission received (email notification sent)',
          contactId: `email-only-${Date.now()}`
        })
      } catch (emailError) {
        console.error('[API] Email notification failed:', emailError)
        return NextResponse.json({ 
          success: true, 
          message: 'Submission received',
          contactId: `logged-${Date.now()}`
        })
      }
    }
    
    // Determine form type
    const formType = data.score !== undefined ? 'assessment' : 'get-started'
    console.log(`[API] Processing ${formType} form submission`)
    
    // Build custom fields with automatic field creation
    const customFields = await buildCustomFieldsArray(data, formType)
    
    // Build tags
    const tags = [
      `trueflow-${formType}`,
      'web-lead',
      new Date().toISOString().split('T')[0]
    ]
    
    if (formType === 'assessment') {
      tags.push(`score-${data.score}`, `plan-${data.recommendation?.toLowerCase().replace(/\s+/g, '-')}`)
    } else {
      tags.push(`plan-${data.pricingPlan?.toLowerCase()}`, `business-${data.businessType?.toLowerCase().replace(/\s+/g, '-')}`)
    }
    
    // Create or update contact
    const ghlPayload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      locationId: process.env.GHL_LOCATION_ID,
      name: `${data.firstName} ${data.lastName}`,
      companyName: data.businessName,
      tags,
      customFields,
      source: formType === 'assessment' ? 'TrueFlow AI Assessment' : 'TrueFlow Get Started Form',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
    
    console.log('[GHL] Creating/updating contact...')
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
      console.error('[GHL] API Error:', errorData)
      throw new Error(`GHL API error: ${ghlResponse.status}`)
    }
    
    const ghlResult = await ghlResponse.json()
    console.log('[GHL] Contact created/updated successfully:', ghlResult.contact?.id || ghlResult.id)
    
    // Send backup email notification
    try {
      await sendEmailNotification(data, formType)
    } catch (emailError) {
      console.error('[API] Backup email failed:', emailError)
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Lead processed successfully',
      ghlContactId: ghlResult.contact?.id || ghlResult.id
    })
    
  } catch (error) {
    console.error('[API] Error processing lead:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
}

// Email notification helper
async function sendEmailNotification(data: any, formType: string) {
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)
  
  const subject = formType === 'assessment' 
    ? `New Assessment: ${data.firstName} ${data.lastName} (Score: ${data.score}%)`
    : `New Get Started: ${data.firstName} ${data.lastName} (${data.pricingPlan} Plan)`
    
  const emailContent = formType === 'assessment' ? `
    <h2>New Assessment Lead</h2>
    <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Score:</strong> ${data.score}%</p>
    <p><strong>Recommendation:</strong> ${data.recommendation}</p>
  ` : `
    <h2>New Get Started Lead</h2>
    <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Business Type:</strong> ${data.businessType}</p>
    <p><strong>Selected Plan:</strong> ${data.pricingPlan}</p>
    <p><strong>Team Size:</strong> ${data.teamSize}</p>
    <p><strong>Monthly Leads:</strong> ${data.monthlyLeads}</p>
  `
  
  await resend.emails.send({
    from: 'TrueFlow AI <onboarding@resend.dev>',
    to: ['griffin@trueflow.ai', 'matt@trueflow.ai'],
    subject,
    html: emailContent
  })
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