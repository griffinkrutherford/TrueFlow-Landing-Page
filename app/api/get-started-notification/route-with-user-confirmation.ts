/**
 * Enhanced API endpoint that sends:
 * 1. Lead notification emails to Griffin and Matt
 * 2. Confirmation email to the user who submitted the form
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

    const resend = new Resend(resendApiKey)

    // === PART 1: Send notification to Griffin and Matt ===
    const internalEmailSubject = `🚀 New TrueFlow Get Started Lead: ${leadData.firstName} ${leadData.lastName} - ${leadData.businessName}`
    
    const internalEmailContent = `
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

    const internalEmailHtml = `
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

    // === PART 2: Send confirmation email to the user ===
    const userEmailSubject = `Welcome to TrueFlow AI, ${leadData.firstName}! 🚀`
    
    const userEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: white; padding: 40px; border: 1px solid #e9ecef; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .plan-highlight { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
    .footer { text-align: center; color: #6c757d; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e9ecef; }
    h2 { color: #495057; }
    ul { padding-left: 20px; }
    li { margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">Welcome to TrueFlow AI!</h1>
      <p style="margin: 10px 0 0 0; font-size: 18px;">Your AI-powered content creation journey starts here</p>
    </div>
    
    <div class="content">
      <h2>Hi ${leadData.firstName},</h2>
      
      <p>Thank you for getting started with TrueFlow AI! We're thrilled to have you join our community of forward-thinking businesses leveraging AI to transform their content creation and management.</p>
      
      <div class="plan-highlight">
        <h3 style="margin-top: 0;">Your Selected Plan: ${leadData.selectedPlan}</h3>
        <p>Great choice! This plan is perfect for ${leadData.businessType} businesses looking to scale their content operations.</p>
      </div>
      
      <h3>What Happens Next?</h3>
      <p>Our team will reach out within the next 24 hours to:</p>
      <ul>
        <li>Schedule your personalized onboarding session</li>
        <li>Help you set up your integrations${leadData.integrations.length > 0 ? ` (including ${leadData.integrations.join(', ')})` : ''}</li>
        <li>Create a content strategy tailored to your goals</li>
        <li>Get you up and running with TrueFlow AI</li>
      </ul>
      
      ${leadData.contentGoals && leadData.contentGoals.length > 0 ? `
      <h3>Your Content Goals:</h3>
      <p>We understand you want to:</p>
      <ul>
        ${leadData.contentGoals.map(goal => `<li>${goal}</li>`).join('')}
      </ul>
      <p>Our platform is designed to help you achieve these goals efficiently with AI-powered automation.</p>
      ` : ''}
      
      <div style="text-align: center; margin: 40px 0;">
        <p><strong>Have questions in the meantime?</strong></p>
        <p>Feel free to reply to this email or reach out to our team at support@trueflow.ai</p>
      </div>
      
      <div class="footer">
        <p>Best regards,<br>
        The TrueFlow AI Team</p>
        <p style="color: #999; font-size: 12px;">
          ${leadData.businessName}<br>
          This email was sent to ${leadData.email}
        </p>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim()

    try {
      // Send both emails
      console.log('Sending emails...')
      
      // 1. Send internal notification
      const internalEmailResult = await resend.emails.send({
        from: 'TrueFlow Leads <onboarding@resend.dev>',
        to: ['griffin@trueflow.ai', 'matt@trueflow.ai'],
        subject: internalEmailSubject,
        text: internalEmailContent,
        html: internalEmailHtml
      })

      console.log('Internal notification sent:', {
        emailId: internalEmailResult.data?.id,
        recipients: ['griffin@trueflow.ai', 'matt@trueflow.ai']
      })

      // 2. Send user confirmation
      const userEmailResult = await resend.emails.send({
        from: 'TrueFlow AI <onboarding@resend.dev>',
        to: [leadData.email],
        subject: userEmailSubject,
        html: userEmailHtml,
        replyTo: 'support@trueflow.ai'
      })

      console.log('User confirmation sent:', {
        emailId: userEmailResult.data?.id,
        recipient: leadData.email
      })

      const response = {
        success: true,
        message: 'Lead notifications sent successfully',
        notifications: {
          internal: {
            sent: true,
            recipients: ['griffin@trueflow.ai', 'matt@trueflow.ai'],
            emailId: internalEmailResult.data?.id || 'unknown'
          },
          userConfirmation: {
            sent: true,
            recipient: leadData.email,
            emailId: userEmailResult.data?.id || 'unknown'
          }
        },
        leadId: `lead_${Date.now()}`
      }

      return NextResponse.json(response, { status: 200 })

    } catch (emailError: any) {
      console.error('Failed to send emails:', emailError)
      
      return NextResponse.json(
        { 
          error: 'Failed to send notification emails',
          details: emailError instanceof Error ? emailError.message : 'Unknown email service error',
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      )
    }

  } catch (error: any) {
    console.error('Error processing get started lead notification:', error)
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