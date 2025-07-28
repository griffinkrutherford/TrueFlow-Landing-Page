/**
 * API endpoint for sending getting started lead notification emails to Griffin and Matt
 */

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

interface GetStartedLeadData {
  firstName: string
  lastName: string
  email: string
  phone: string
  businessName: string
  businessType: string
  selectedPlan: string
  contentGoals: string[]
  integrations: string[]
  timestamp: string
}

export async function POST(request: NextRequest) {
  // Log the request origin for debugging
  const origin = request.headers.get('origin')
  const host = request.headers.get('host')
  console.log('Get Started notification request received from:', origin || 'unknown')

  try {
    const leadData: GetStartedLeadData = await request.json()
    console.log('Get Started lead data received:', {
      name: `${leadData.firstName} ${leadData.lastName}`,
      email: leadData.email,
      business: leadData.businessName,
      plan: leadData.selectedPlan
    })

    // Validate required fields
    if (!leadData.firstName || !leadData.lastName || !leadData.email || !leadData.businessName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Format the email content
    const emailSubject = `🚀 New TrueFlow Get Started Lead: ${leadData.firstName} ${leadData.lastName} - ${leadData.businessName}`
    
    const emailContent = `
🎯 NEW TRUEFLOW AI GET STARTED LEAD

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 CONTACT INFORMATION:
• Name: ${leadData.firstName} ${leadData.lastName}
• Email: ${leadData.email}
• Phone: ${leadData.phone}
• Business: ${leadData.businessName}
• Business Type: ${leadData.businessType}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 PLAN SELECTION:
• Selected Plan: ${leadData.selectedPlan}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 CONTENT GOALS:
${leadData.contentGoals && leadData.contentGoals.length > 0 
  ? leadData.contentGoals.map(goal => `• ${goal}`).join('\n')
  : '• Not specified'
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 INTEGRATIONS REQUESTED:
${leadData.integrations && leadData.integrations.length > 0 
  ? leadData.integrations.map(integration => `• ${integration}`).join('\n')
  : '• None selected'
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 SUBMISSION DETAILS:
• Timestamp: ${leadData.timestamp}
• Source: get-started-form

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 ACTION REQUIRED:
✅ HIGH PRIORITY - This lead has completed the get started process and selected a plan!

Follow up within 24 hours to schedule onboarding.
    `.trim()

    // Initialize Resend with API key from environment variables
    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      console.error('RESEND_API_KEY environment variable is not set')
      return NextResponse.json(
        { 
          error: 'Email service configuration error',
          details: 'RESEND_API_KEY is missing in production environment',
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      )
    }

    // Log API key presence (not the actual key)
    console.log('Resend API configuration:', {
      hasApiKey: !!resendApiKey,
      keyLength: resendApiKey.length,
      keyPrefix: resendApiKey.substring(0, 7) + '...',
      nodeEnv: process.env.NODE_ENV
    })

    const resend = new Resend(resendApiKey)

    // Skip the domain test since the API key is restricted to sending emails only
    // This is expected behavior for restricted API keys
    console.log('Using Resend API key for email sending only (restricted key mode)')

    try {
      // Create HTML version with better formatting
      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f8f9fa; padding: 30px; border: 1px solid #e9ecef; }
    .section { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .section-title { color: #495057; font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #e9ecef; padding-bottom: 10px; }
    .plan-box { background: #667eea; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
    .plan-name { font-size: 24px; font-weight: bold; }
    .priority-high { background: #d4edda; color: #155724; padding: 15px; border-radius: 8px; border: 1px solid #c3e6cb; }
    ul { padding-left: 20px; }
    li { margin: 5px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 New TrueFlow Get Started Lead</h1>
      <p style="margin: 0; font-size: 20px;">${leadData.firstName} ${leadData.lastName} - ${leadData.businessName}</p>
    </div>
    
    <div class="content">
      <div class="section">
        <div class="section-title">👤 Contact Information</div>
        <p><strong>Name:</strong> ${leadData.firstName} ${leadData.lastName}<br>
        <strong>Email:</strong> <a href="mailto:${leadData.email}">${leadData.email}</a><br>
        <strong>Phone:</strong> ${leadData.phone}<br>
        <strong>Business:</strong> ${leadData.businessName}<br>
        <strong>Business Type:</strong> ${leadData.businessType}</p>
      </div>
      
      <div class="section">
        <div class="section-title">💰 Plan Selection</div>
        <div class="plan-box">
          <div class="plan-name">${leadData.selectedPlan}</div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">🎯 Content Goals</div>
        ${leadData.contentGoals && leadData.contentGoals.length > 0 
          ? '<ul>' + leadData.contentGoals.map(goal => `<li>${goal}</li>`).join('') + '</ul>'
          : '<p>Not specified</p>'
        }
      </div>
      
      <div class="section">
        <div class="section-title">🔗 Integrations Requested</div>
        ${leadData.integrations && leadData.integrations.length > 0 
          ? '<ul>' + leadData.integrations.map(integration => `<li>${integration}</li>`).join('') + '</ul>'
          : '<p>None selected</p>'
        }
      </div>
      
      <div class="priority-high">
        <strong>🚨 ACTION REQUIRED:</strong><br>
        ✅ HIGH PRIORITY - This lead has completed the get started process and selected a plan!<br><br>
        <strong>Follow up within 24 hours to schedule onboarding.</strong>
      </div>
      
      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #6c757d; font-size: 12px;">
        <p>Submitted: ${leadData.timestamp}<br>
        Source: get-started-form</p>
      </div>
    </div>
  </div>
</body>
</html>
      `.trim()

      // Log email attempt
      console.log('Attempting to send Get Started email:', {
        from: 'TrueFlow Leads <onboarding@resend.dev>',
        to: ['griffin@trueflow.ai', 'matt@trueflow.ai'],
        subject: emailSubject,
        timestamp: new Date().toISOString()
      })

      // Send email using Resend
      const emailResult = await resend.emails.send({
        from: 'TrueFlow Leads <onboarding@resend.dev>',
        to: ['griffin@trueflow.ai', 'matt@trueflow.ai'],
        subject: emailSubject,
        text: emailContent,
        html: emailHtml
      })

      console.log('Get Started email sent successfully:', {
        emailId: emailResult.data?.id,
        timestamp: new Date().toISOString(),
        recipients: ['griffin@trueflow.ai', 'matt@trueflow.ai']
      })

      const response = {
        success: true,
        message: 'Get started lead notification emails sent successfully',
        recipients: ['griffin@trueflow.ai', 'matt@trueflow.ai'],
        leadId: `lead_${Date.now()}`,
        emailId: emailResult.data?.id || 'unknown'
      }

      return NextResponse.json(response, { status: 200 })

    } catch (emailError: any) {
      console.error('Failed to send Get Started email via Resend:', emailError)
      console.error('Get Started error details:', {
        message: emailError?.message || 'Unknown error',
        statusCode: emailError?.statusCode || emailError?.error?.statusCode,
        type: emailError?.type || emailError?.error?.type,
        name: emailError?.name || emailError?.error?.name,
        apiKey: resendApiKey ? 'Present (masked)' : 'Missing',
        keyPrefix: resendApiKey ? resendApiKey.substring(0, 7) + '...' : 'N/A',
        fromAddress: 'TrueFlow Leads <onboarding@resend.dev>',
        toAddresses: ['griffin@trueflow.ai', 'matt@trueflow.ai'],
        timestamp: new Date().toISOString(),
        nodeEnv: process.env.NODE_ENV
      })
      
      // Return a more specific error message
      const errorMessage = emailError instanceof Error ? emailError.message : 'Unknown email service error'
      
      return NextResponse.json(
        { 
          error: 'Failed to send lead notification emails',
          details: errorMessage,
          debug: {
            hasApiKey: !!resendApiKey,
            fromAddress: 'TrueFlow Leads <onboarding@resend.dev>',
            timestamp: new Date().toISOString()
          },
          leadData: {
            name: `${leadData.firstName} ${leadData.lastName}`,
            email: leadData.email,
            business: leadData.businessName
          }
        },
        { status: 500 }
      )
    }

  } catch (error: any) {
    console.error('Error processing get started lead notification:', error)
    console.error('Get Started full error details:', {
      message: error?.message,
      stack: error?.stack,
      timestamp: new Date().toISOString()
    })
    return NextResponse.json(
      { 
        error: 'Failed to process lead notification',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
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