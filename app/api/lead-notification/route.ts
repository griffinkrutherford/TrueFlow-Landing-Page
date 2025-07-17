/**
 * API endpoint for sending lead notification emails to Griffin and Matt
 */

import { NextRequest, NextResponse } from 'next/server'

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

    // Create the email payload for a service like Resend, SendGrid, etc.
    const emailPayload = {
      to: ['griffin@trueflow.ai', 'matt@trueflow.ai'],
      from: 'leads@trueflow.ai', // You'll need to configure this sender domain
      subject: emailSubject,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>')
    }

    // For now, we'll use a webhook approach since we don't have email service configured
    // In production, you would integrate with an email service like:
    // - Resend
    // - SendGrid
    // - AWS SES
    // - Mailgun

    console.log('New Lead Notification:', emailPayload)

    // You can also send to a webhook service like Zapier or Make.com
    // const webhookUrl = process.env.LEAD_NOTIFICATION_WEBHOOK
    // if (webhookUrl) {
    //   await fetch(webhookUrl, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       ...leadData,
    //       notification_emails: ['griffin@trueflow.ai', 'matt@trueflow.ai']
    //     })
    //   })
    // }

    // For demonstration, we'll simulate sending the email
    // Replace this with actual email service integration
    const simulatedEmailResponse = {
      success: true,
      message: 'Lead notification emails sent successfully',
      recipients: ['griffin@trueflow.ai', 'matt@trueflow.ai'],
      leadId: `lead_${Date.now()}`,
      emailContent: emailContent
    }

    return NextResponse.json(simulatedEmailResponse, { status: 200 })

  } catch (error) {
    console.error('Error sending lead notification:', error)
    return NextResponse.json(
      { error: 'Failed to send lead notification' },
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