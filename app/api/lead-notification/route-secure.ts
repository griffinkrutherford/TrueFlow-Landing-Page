/**
 * API endpoint for sending lead notification emails to Griffin and Matt
 * Enhanced with security improvements
 */

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Simple in-memory rate limiting (consider Redis for production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS = 5 // 5 requests per minute

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
    // Rate limiting check
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const now = Date.now()
    const clientRateLimit = rateLimitMap.get(clientIp)
    
    if (clientRateLimit) {
      if (now < clientRateLimit.resetTime) {
        if (clientRateLimit.count >= MAX_REQUESTS) {
          return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            { status: 429 }
          )
        }
        clientRateLimit.count++
      } else {
        rateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
      }
    } else {
      rateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    }
    
    const leadData: LeadData = await request.json()

    // Validate required fields
    if (!leadData.firstName || !leadData.lastName || !leadData.email || !leadData.businessName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Validate email format
    if (!EMAIL_REGEX.test(leadData.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }
    
    // Sanitize input data (basic XSS prevention)
    const sanitize = (str: string) => str.replace(/[<>"'&]/g, '')
    leadData.firstName = sanitize(leadData.firstName)
    leadData.lastName = sanitize(leadData.lastName)
    leadData.businessName = sanitize(leadData.businessName)
    leadData.businessType = leadData.businessType ? sanitize(leadData.businessType) : ''

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
        { error: 'Email service is temporarily unavailable' },
        { status: 503 }
      )
    }

    const resend = new Resend(resendApiKey)

    // Test API key validity by attempting to get domains
    try {
      console.log('Testing Resend API connection...')
      const testResponse = await resend.domains.list()
      console.log('Resend API test successful:', testResponse)
    } catch (testError) {
      console.error('Resend API test failed:', testError)
      return NextResponse.json(
        { 
          error: 'Email service is temporarily unavailable'
        },
        { status: 503 }
      )
    }

    try {
      // Send email using Resend
      const emailResult = await resend.emails.send({
        from: 'TrueFlow Leads <onboarding@resend.dev>',
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
      
      return NextResponse.json(
        { 
          error: 'Failed to send notification. Please try again later.'
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error processing lead notification:', error)
    return NextResponse.json(
      { 
        error: 'An error occurred processing your request'
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
  
  const corsHeaders = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  } as Record<string, string>
  
  if (origin && allowedOrigins.includes(origin)) {
    corsHeaders['Access-Control-Allow-Origin'] = origin
  }
  
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  })
}