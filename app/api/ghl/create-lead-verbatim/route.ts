/**
 * GoHighLevel Lead Creation API - Verbatim Field Mapping
 * Creates custom fields with EXACT form question text and preserves all data as strings
 */

import { NextRequest, NextResponse } from 'next/server'
import { 
  ensureVerbatimFieldsExist,
  buildVerbatimCustomFields,
  VERBATIM_GET_STARTED_FIELDS
} from '@/lib/ghl/verbatim-field-mapping'

const GHL_ACCESS_TOKEN = process.env.GHL_ACCESS_TOKEN
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID

interface LeadData {
  // Contact information
  firstName: string
  lastName: string
  email: string
  phone?: string
  businessName?: string
  
  // Business profile
  businessType: string
  contentGoals: string[]
  
  // Assessment data
  answers: Record<string, string>
  assessmentAnswers?: Array<{
    questionId: string
    category: string
    question: string
    answer: string
    score: number
  }>
  
  // Scoring and recommendations
  totalScore: number
  scorePercentage: number
  readinessLevel: string
  recommendation: string
  
  // Preferences and metadata
  integrations: string[]
  selectedPlan: string
  timestamp: string
  assessmentVersion: string
  source: string
}

export async function POST(request: NextRequest) {
  try {
    console.log('[Verbatim API] Starting verbatim lead creation process...')
    
    // Validate required environment variables
    if (!GHL_ACCESS_TOKEN || !GHL_LOCATION_ID) {
      console.error('[Verbatim API] Missing required environment variables')
      return NextResponse.json(
        { error: 'Missing GoHighLevel configuration' },
        { status: 500 }
      )
    }

    const leadData: LeadData = await request.json()
    console.log('[Verbatim API] Received lead data:', JSON.stringify(leadData, null, 2))

    // Validate required fields
    if (!leadData.firstName || !leadData.lastName || !leadData.email) {
      return NextResponse.json(
        { error: 'Missing required contact information' },
        { status: 400 }
      )
    }

    // Step 1: Ensure all verbatim custom fields exist in GoHighLevel
    console.log('[Verbatim API] Step 1: Ensuring verbatim custom fields exist...')
    const fieldMap = await ensureVerbatimFieldsExist(GHL_LOCATION_ID, GHL_ACCESS_TOKEN)
    
    if (fieldMap.size === 0) {
      console.error('[Verbatim API] Failed to create or fetch custom fields')
      return NextResponse.json(
        { error: 'Failed to setup custom fields' },
        { status: 500 }
      )
    }

    // Step 2: Prepare verbatim form data (preserve all data as strings)
    console.log('[Verbatim API] Step 2: Preparing verbatim form data...')
    const verbatimFormData = {
      // Contact information (exact)
      firstName: leadData.firstName,
      lastName: leadData.lastName,
      email: leadData.email,
      phone: leadData.phone || '',
      businessName: leadData.businessName || '',
      
      // Business profile (exact)
      businessType: leadData.businessType,
      contentGoals: leadData.contentGoals,
      
      // Assessment answers (individual questions, exact)
      currentContent: leadData.answers?.['current-content'],
      contentVolume: leadData.answers?.['content-volume'],
      crmUsage: leadData.answers?.['crm-usage'],
      leadResponse: leadData.answers?.['lead-response'],
      timeSpent: leadData.answers?.['time-spent'],
      budget: leadData.answers?.['budget'],
      
      // Integration preferences (exact)
      integrations: leadData.integrations,
      
      // Plan selection (exact)
      selectedPlan: leadData.selectedPlan,
      
      // Assessment results (preserved as strings)
      assessmentAnswers: leadData.assessmentAnswers,
      totalScore: String(leadData.totalScore), // Convert to string
      scorePercentage: String(leadData.scorePercentage), // Convert to string  
      readinessLevel: leadData.readinessLevel,
      recommendation: leadData.recommendation,
      
      // Metadata (as strings)
      submissionDate: new Date().toISOString().split('T')[0], // Date as string
      formSource: leadData.source || 'readiness-assessment',
      assessmentVersion: leadData.assessmentVersion || '2.0'
    }

    // Step 3: Build verbatim custom fields payload
    console.log('[Verbatim API] Step 3: Building verbatim custom fields payload...')
    const customFields = buildVerbatimCustomFields(verbatimFormData, fieldMap)
    
    if (customFields.length === 0) {
      console.warn('[Verbatim API] No custom fields were mapped')
    }

    // Step 4: Calculate lead quality and scoring (preserved as strings)
    const leadScore = typeof leadData.scorePercentage === 'number' ? leadData.scorePercentage : parseInt(String(leadData.scorePercentage)) || 0
    const leadQuality = leadScore >= 75 ? 'hot' : leadScore >= 50 ? 'warm' : 'cold'

    // Step 5: Generate verbatim tags based on exact form responses
    const tags = ['web-lead', 'get-started-form', 'verbatim-field-mapping']
    
    // Add readiness level tag (exact)
    if (leadData.readinessLevel) {
      tags.push(`readiness-${leadData.readinessLevel.toLowerCase().replace(/\s+/g, '-')}`)
    }
    
    // Add business type tag (exact)
    if (leadData.businessType) {
      tags.push(`business-type-${leadData.businessType.toLowerCase().replace(/\s+/g, '-')}`)
    }
    
    // Add plan selection tag (exact)
    if (leadData.selectedPlan && leadData.selectedPlan !== 'Not Sure Yet') {
      tags.push(`plan-${leadData.selectedPlan.toLowerCase().replace(/\s+/g, '-')}`)
    }

    // Step 6: Create contact in GoHighLevel with verbatim fields
    console.log('[Verbatim API] Step 6: Creating contact in GoHighLevel...')
    const contactPayload = {
      firstName: leadData.firstName,
      lastName: leadData.lastName,
      email: leadData.email,
      phone: leadData.phone || '',
      companyName: leadData.businessName || '',
      tags: tags,
      customFields: customFields, // Use field IDs for reliable mapping
      source: 'TrueFlow Get Started Form (Verbatim)'
    }

    console.log('[Verbatim API] Contact payload:', JSON.stringify(contactPayload, null, 2))

    const contactResponse = await fetch(`https://services.leadconnectorhq.com/contacts/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify(contactPayload)
    })

    if (!contactResponse.ok) {
      const errorData = await contactResponse.json()
      console.error('[Verbatim API] GoHighLevel API error:', errorData)
      throw new Error(`GoHighLevel API error: ${JSON.stringify(errorData)}`)
    }

    const contactResult = await contactResponse.json()
    console.log('[Verbatim API] ✅ Contact created successfully:', contactResult.contact?.id)

    // Step 7: Send notification email with verbatim data
    console.log('[Verbatim API] Step 7: Sending notification email...')
    try {
      const emailResponse = await fetch(`${request.nextUrl.origin}/api/form-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...leadData,
          contactId: contactResult.contact?.id,
          fieldMappingVersion: 'verbatim'
        })
      })
      
      if (emailResponse.ok) {
        console.log('[Verbatim API] ✅ Email notification sent successfully')
      } else {
        console.error('[Verbatim API] Email notification failed:', emailResponse.status)
      }
    } catch (emailError) {
      console.error('[Verbatim API] Email notification error:', emailError)
    }

    // Return success response with verbatim mapping summary
    return NextResponse.json({
      success: true,
      contactId: contactResult.contact?.id,
      message: 'Lead created successfully with verbatim field mapping',
      summary: {
        customFieldsCreated: customFields.length,
        verbatimFieldsTotal: Object.keys(VERBATIM_GET_STARTED_FIELDS).length,
        leadScore: String(leadScore), // Return as string
        leadQuality,
        tags: tags.length,
        fieldMappingVersion: 'verbatim'
      }
    })

  } catch (error) {
    console.error('[Verbatim API] Error creating contact:', error)
    
    return NextResponse.json(
      {
        error: 'Failed to create contact',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}