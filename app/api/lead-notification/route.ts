/**
 * API endpoint for sending lead notification emails to Griffin and Matt
 */

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

interface LeadData {
  firstName: string
  lastName: string
  email: string
  businessName: string
  businessType: string
  selectedPlan: string
  contentGoals: string[]
  integrations: string[]
  timestamp: string
}

export async function POST(request: NextRequest) {
  try {
    const leadData: LeadData = await request.json()

    // Validate required fields
    if (!leadData.firstName || !leadData.lastName || !leadData.email || !leadData.businessName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Format the email content
    const emailSubject = `🚀 New TrueFlow Lead: ${leadData.firstName} ${leadData.lastName} - ${leadData.businessName}`
    
    const emailContent = `
New TrueFlow AI Lead Submission

👤 CONTACT INFORMATION:
• Name: ${leadData.firstName} ${leadData.lastName}
• Email: ${leadData.email}
• Business: ${leadData.businessName}
• Business Type: ${leadData.businessType || 'Not specified'}

💰 PLAN SELECTION:
• Selected Plan: ${leadData.selectedPlan || 'Not specified'}

🎯 CONTENT GOALS:
${leadData.contentGoals && leadData.contentGoals.length > 0 
  ? leadData.contentGoals.map(goal => `• ${goal}`).join('\n')
  : '• Not specified'
}

🔗 INTEGRATIONS REQUESTED:
${leadData.integrations && leadData.integrations.length > 0 
  ? leadData.integrations.map(integration => `• ${integration}`).join('\n')
  : '• None selected'
}

⏰ SUBMISSION TIME:
${leadData.timestamp}

---
Follow up with this lead as soon as possible!
    `.trim()


    // Initialize Resend with API key from environment variables
    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      console.error('RESEND_API_KEY environment variable is not set')
      return NextResponse.json(
        { error: 'Email service configuration error' },
        { status: 500 }
      )
    }

    const resend = new Resend(resendApiKey)

    try {
      // Send email using Resend
      const emailResult = await resend.emails.send({
        from: 'TrueFlow Leads <leads@trueflow.ai>',
        to: ['griffin@trueflow.ai', 'matt@trueflow.ai'],
        subject: emailSubject,
        text: emailContent,
        html: emailContent.replace(/\n/g, '<br>')
      })

      console.log('Email sent successfully:', emailResult)

      const response = {
        success: true,
        message: 'Lead notification emails sent successfully',
        recipients: ['griffin@trueflow.ai', 'matt@trueflow.ai'],
        leadId: `lead_${Date.now()}`,
        emailId: emailResult.data?.id || 'unknown'
      }

      return NextResponse.json(response, { status: 200 })

    } catch (emailError) {
      console.error('Failed to send email via Resend:', emailError)
      
      // Return a more specific error message
      const errorMessage = emailError instanceof Error ? emailError.message : 'Unknown email service error'
      
      return NextResponse.json(
        { 
          error: 'Failed to send lead notification emails',
          details: errorMessage,
          leadData: {
            name: `${leadData.firstName} ${leadData.lastName}`,
            email: leadData.email,
            business: leadData.businessName
          }
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error processing lead notification:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process lead notification',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Handle CORS for API calls
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}