/**
 * API endpoint for sending partial lead notification emails when user completes contact info
 */

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

interface PartialLeadData {
  firstName: string
  lastName: string
  email: string
  phone: string
  timestamp: string
  isPartialLead: boolean
}

export async function POST(request: NextRequest) {
  try {
    const leadData: PartialLeadData = await request.json()

    // Validate required fields
    if (!leadData.email || !leadData.phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Format the email content
    const emailSubject = `🔔 New Partial Lead Captured: ${leadData.firstName} ${leadData.lastName || ''}`
    
    const emailContent = `
🔔 PARTIAL LEAD CAPTURED - CONTACT INFO RECEIVED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 CONTACT INFORMATION CAPTURED:
• Name: ${leadData.firstName} ${leadData.lastName || ''}
• Email: ${leadData.email}
• Phone: ${leadData.phone}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 STATUS:
• Lead Type: PARTIAL (Contact info only)
• Form Progress: Step 1 of 5 completed
• Next Steps: User is continuing through form

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 SUBMISSION DETAILS:
• Timestamp: ${leadData.timestamp}
• Source: get-started-form (partial)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔄 FOLLOW-UP STRATEGY:
This lead has provided contact info but hasn't completed the full form yet.
• Wait 24 hours before initial follow-up
• If they complete the form, you'll receive another notification
• Consider sending a helpful email if they don't complete within 48 hours
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
      // Create HTML version with better formatting
      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f8f9fa; padding: 30px; border: 1px solid #e9ecef; }
    .section { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .section-title { color: #495057; font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #e9ecef; padding-bottom: 10px; }
    .status-partial { background: #fff3cd; color: #856404; padding: 15px; border-radius: 8px; border: 1px solid #ffeaa7; }
    .info-box { background: #d1ecf1; color: #0c5460; padding: 15px; border-radius: 8px; border: 1px solid #bee5eb; }
    ul { padding-left: 20px; }
    li { margin: 5px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔔 Partial Lead Captured</h1>
      <p style="margin: 0; font-size: 20px;">${leadData.firstName} ${leadData.lastName || ''}</p>
    </div>
    
    <div class="content">
      <div class="section">
        <div class="section-title">👤 Contact Information Captured</div>
        <p><strong>Name:</strong> ${leadData.firstName} ${leadData.lastName || ''}<br>
        <strong>Email:</strong> <a href="mailto:${leadData.email}">${leadData.email}</a><br>
        <strong>Phone:</strong> ${leadData.phone}</p>
      </div>
      
      <div class="status-partial">
        <strong>📋 PARTIAL LEAD STATUS:</strong><br>
        • Lead Type: <strong>PARTIAL</strong> (Contact info only)<br>
        • Form Progress: <strong>Step 1 of 5</strong> completed<br>
        • User is currently continuing through the form
      </div>
      
      <div class="info-box" style="margin-top: 20px;">
        <strong>🔄 Recommended Follow-up Strategy:</strong><br>
        • Wait 24 hours before initial follow-up<br>
        • If they complete the form, you'll receive a full lead notification<br>
        • Consider sending a helpful email if they don't complete within 48 hours<br>
        • Keep any outreach friendly and value-focused
      </div>
      
      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #6c757d; font-size: 12px;">
        <p>Submitted: ${leadData.timestamp}<br>
        Source: get-started-form (partial capture)</p>
      </div>
    </div>
  </div>
</body>
</html>
      `.trim()

      // Send email using Resend
      const emailResult = await resend.emails.send({
        from: 'TrueFlow Leads <onboarding@resend.dev>',
        to: ['griffin@trueflow.ai', 'matt@trueflow.ai'],
        subject: emailSubject,
        text: emailContent,
        html: emailHtml
      })

      console.log('Partial lead email sent successfully:', emailResult)

      const response = {
        success: true,
        message: 'Partial lead notification email sent successfully',
        recipients: ['griffin@trueflow.ai', 'matt@trueflow.ai'],
        leadId: `partial_lead_${Date.now()}`,
        emailId: emailResult.data?.id || 'unknown'
      }

      return NextResponse.json(response, { status: 200 })

    } catch (emailError) {
      console.error('Failed to send partial lead email via Resend:', emailError)
      
      const errorMessage = emailError instanceof Error ? emailError.message : 'Unknown email service error'
      
      return NextResponse.json(
        { 
          error: 'Failed to send partial lead notification email',
          details: errorMessage,
          leadData: {
            name: `${leadData.firstName} ${leadData.lastName || ''}`,
            email: leadData.email,
            phone: leadData.phone
          }
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error processing partial lead notification:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process partial lead notification',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Handle CORS for API calls with secure configuration
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  const allowedOrigins = [
    'https://trueflow.ai',
    'https://www.trueflow.ai',
    'http://localhost:3000',
    'http://localhost:3001'
  ]
  
  const corsHeaders: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }
  
  if (origin && allowedOrigins.includes(origin)) {
    corsHeaders['Access-Control-Allow-Origin'] = origin
  }
  
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  })
}