/**
 * Enhanced API endpoint for sending lead notification emails
 * Includes comprehensive error handling and environment validation
 */

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { logEmailAttempt, createFallbackResponse } from './backup-logger'

interface AssessmentAnswer {
  questionId: string
  category: string
  question: string
  answer: string
  score: number
}

interface LeadData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  businessName: string
  businessType: string
  selectedPlan: string
  contentGoals: string[]
  integrations: string[]
  timestamp: string
  assessmentAnswers?: AssessmentAnswer[]
  totalScore?: number
  maxPossibleScore?: number
  scorePercentage?: number
  recommendation?: string
  readinessLevel?: string
  assessmentVersion?: string
  source?: string
}

// Environment validation helper
function validateEnvironment() {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Critical: Check RESEND_API_KEY
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    errors.push('RESEND_API_KEY is not set in environment variables')
  } else if (apiKey.includes('your_') || apiKey === 'your_resend_api_key_here' || apiKey.length < 20) {
    errors.push('RESEND_API_KEY appears to be a placeholder or invalid')
  }
  
  // Check NODE_ENV
  if (process.env.NODE_ENV !== 'production') {
    warnings.push(`NODE_ENV is '${process.env.NODE_ENV}', expected 'production'`)
  }
  
  // Log environment info for debugging
  console.log('Environment validation:', {
    NODE_ENV: process.env.NODE_ENV,
    RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
    hasResendKey: !!apiKey,
    keyLength: apiKey?.length || 0,
    keyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'NOT_SET',
    errors: errors.length,
    warnings: warnings.length
  })
  
  return { errors, warnings, apiKey }
}

// Helper to safely test Resend connection
async function testResendConnection(resend: Resend) {
  try {
    // First try a simple API call that should work with any valid key
    const testEmail = await resend.emails.send({
      from: 'TrueFlow <onboarding@resend.dev>',
      to: ['test@resend.dev'], // Resend's test email that doesn't actually send
      subject: 'Connection Test',
      text: 'Testing API connection'
    })
    
    console.log('Resend connection test successful:', {
      success: true,
      testId: testEmail.data?.id
    })
    
    return { success: true, error: null }
  } catch (error: any) {
    console.error('Resend connection test failed:', {
      error: error?.message || 'Unknown error',
      statusCode: error?.statusCode,
      type: error?.name
    })
    
    return {
      success: false,
      error: error?.message || 'Failed to connect to Resend'
    }
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  // Log request details
  const requestInfo = {
    origin: request.headers.get('origin'),
    host: request.headers.get('host'),
    userAgent: request.headers.get('user-agent'),
    timestamp: new Date().toISOString(),
    path: request.url
  }
  
  console.log('=== LEAD NOTIFICATION REQUEST ===', requestInfo)
  
  try {
    // Validate environment first
    const { errors, warnings, apiKey } = validateEnvironment()
    
    if (errors.length > 0) {
      console.error('Environment validation failed:', errors)
      return NextResponse.json(
        {
          error: 'Email service configuration error',
          details: errors.join('; '),
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      )
    }
    
    // Log warnings but continue
    if (warnings.length > 0) {
      console.warn('Environment warnings:', warnings)
    }
    
    // Parse request body
    const leadData: LeadData = await request.json()
    console.log('Lead data received:', {
      name: `${leadData.firstName} ${leadData.lastName}`,
      email: leadData.email,
      business: leadData.businessName,
      score: leadData.scorePercentage
    })
    
    // Validate required fields
    if (!leadData.firstName || !leadData.lastName || !leadData.email || !leadData.businessName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Initialize Resend
    const resend = new Resend(apiKey!)
    
    // Test connection before sending actual email
    const connectionTest = await testResendConnection(resend)
    if (!connectionTest.success) {
      console.error('Resend connection failed, using fallback')
      
      // Log the attempt but don't fail the request
      await logEmailAttempt({
        timestamp: new Date().toISOString(),
        type: 'lead-notification',
        recipient: ['griffin@trueflow.ai', 'matt@trueflow.ai'],
        subject: `Failed Lead: ${leadData.firstName} ${leadData.lastName}`,
        leadData,
        error: connectionTest.error || 'Connection test failed',
        success: false
      })
      
      // Return success to frontend but log the failure
      return NextResponse.json({
        success: true,
        message: 'Lead captured successfully (email pending)',
        leadId: `lead_${Date.now()}`,
        emailStatus: 'pending',
        debug: process.env.NODE_ENV === 'development' ? {
          error: connectionTest.error,
          timestamp: new Date().toISOString()
        } : undefined
      }, { status: 200 })
    }
    
    // Format email content
    const readinessEmoji = leadData.scorePercentage && leadData.scorePercentage >= 75 ? '🟢' : 
                           leadData.scorePercentage && leadData.scorePercentage >= 50 ? '🟡' : '🔴'
    
    const emailSubject = `🚀 New TrueFlow Lead: ${leadData.firstName} ${leadData.lastName} - ${leadData.businessName} ${readinessEmoji}`
    
    // [Email content formatting - same as original]
    const emailContent = `
🎯 NEW TRUEFLOW AI READINESS ASSESSMENT LEAD

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 CONTACT INFORMATION:
• Name: ${leadData.firstName} ${leadData.lastName}
• Email: ${leadData.email}
• Phone: ${leadData.phone || 'Not provided'}
• Business: ${leadData.businessName}
• Business Type: ${leadData.businessType || 'Not specified'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 READINESS SCORE:
• Total Score: ${leadData.totalScore || 0} / ${leadData.maxPossibleScore || 24}
• Percentage: ${leadData.scorePercentage || 0}% ${readinessEmoji}
• Readiness Level: ${leadData.readinessLevel || 'Not calculated'}
• Recommendation: ${leadData.recommendation || 'Not available'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 ASSESSMENT RESPONSES:
${leadData.assessmentAnswers && leadData.assessmentAnswers.length > 0
  ? leadData.assessmentAnswers.map((qa, index) => `
${index + 1}. ${qa.category.toUpperCase()}
   Q: ${qa.question}
   A: ${qa.answer} (Score: ${qa.score}/4)
`).join('\n')
  : 'No assessment answers recorded'
}

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

💰 PLAN SELECTION:
• Selected Plan: ${leadData.selectedPlan || 'Not specified'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 SUBMISSION DETAILS:
• Timestamp: ${leadData.timestamp}
• Assessment Version: ${leadData.assessmentVersion || '1.0'}
• Source: ${leadData.source || 'readiness-assessment'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 ACTION REQUIRED:
${leadData.scorePercentage && leadData.scorePercentage >= 75 
  ? '✅ HIGH PRIORITY - This lead is highly qualified and ready for TrueFlow!'
  : leadData.scorePercentage && leadData.scorePercentage >= 50
  ? '⚠️ MEDIUM PRIORITY - This lead shows good potential but may need education.'
  : '📋 NURTURE LEAD - This lead needs more education before they\'re ready.'
}

Follow up within 24 hours for best results!
    `.trim()
    
    // HTML version (simplified for brevity - use same as original)
    const emailHtml = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f8f9fa; padding: 30px; }
    .section { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 New TrueFlow AI Lead ${readinessEmoji}</h1>
      <p style="margin: 0;">${leadData.firstName} ${leadData.lastName} - ${leadData.businessName}</p>
    </div>
    <div class="content">
      <div class="section">
        <h3>Contact Information</h3>
        <p>
          <strong>Name:</strong> ${leadData.firstName} ${leadData.lastName}<br>
          <strong>Email:</strong> <a href="mailto:${leadData.email}">${leadData.email}</a><br>
          <strong>Phone:</strong> ${leadData.phone || 'Not provided'}<br>
          <strong>Business:</strong> ${leadData.businessName}
        </p>
      </div>
      <div class="section">
        <h3>Readiness Score</h3>
        <p style="font-size: 48px; text-align: center; color: #667eea; margin: 20px 0;">
          ${leadData.scorePercentage || 0}%
        </p>
        <p><strong>Level:</strong> ${leadData.readinessLevel || 'Not calculated'}</p>
      </div>
    </div>
  </div>
</body>
</html>`
    
    // Attempt to send email with retry logic
    let emailResult
    let attempts = 0
    const maxAttempts = 3
    
    while (attempts < maxAttempts) {
      attempts++
      
      try {
        console.log(`Email send attempt ${attempts}/${maxAttempts}`)
        
        emailResult = await resend.emails.send({
          from: 'TrueFlow Leads <onboarding@resend.dev>',
          to: ['griffin@trueflow.ai', 'matt@trueflow.ai'],
          subject: emailSubject,
          text: emailContent,
          html: emailHtml
        })
        
        console.log('Email sent successfully:', {
          emailId: emailResult.data?.id,
          attempt: attempts,
          duration: Date.now() - startTime
        })
        
        break // Success, exit retry loop
        
      } catch (error: any) {
        console.error(`Email send attempt ${attempts} failed:`, {
          error: error?.message,
          statusCode: error?.statusCode
        })
        
        if (attempts === maxAttempts) {
          // Final attempt failed, use fallback
          await logEmailAttempt({
            timestamp: new Date().toISOString(),
            type: 'lead-notification',
            recipient: ['griffin@trueflow.ai', 'matt@trueflow.ai'],
            subject: emailSubject,
            leadData,
            error: error?.message || 'All retry attempts failed',
            success: false
          })
          
          // Still return success to frontend
          return NextResponse.json({
            success: true,
            message: 'Lead captured successfully (email delivery pending)',
            leadId: `lead_${Date.now()}`,
            emailStatus: 'failed',
            retryAttempts: attempts,
            debug: process.env.NODE_ENV === 'development' ? {
              error: error?.message,
              attempts: attempts
            } : undefined
          }, { status: 200 })
        }
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts))
      }
    }
    
    // Log successful email
    await logEmailAttempt({
      timestamp: new Date().toISOString(),
      type: 'lead-notification',
      recipient: ['griffin@trueflow.ai', 'matt@trueflow.ai'],
      subject: emailSubject,
      leadData,
      emailId: emailResult?.data?.id,
      success: true
    })
    
    return NextResponse.json({
      success: true,
      message: 'Lead notification emails sent successfully',
      recipients: ['griffin@trueflow.ai', 'matt@trueflow.ai'],
      leadId: `lead_${Date.now()}`,
      emailId: emailResult?.data?.id || 'unknown',
      duration: Date.now() - startTime
    }, { status: 200 })
    
  } catch (error: any) {
    console.error('Fatal error in lead notification:', {
      error: error?.message,
      stack: error?.stack,
      duration: Date.now() - startTime
    })
    
    // Always try to save the lead data even if everything fails
    try {
      await logEmailAttempt({
        timestamp: new Date().toISOString(),
        type: 'lead-notification',
        recipient: ['griffin@trueflow.ai', 'matt@trueflow.ai'],
        subject: 'ERROR: Lead capture failed',
        leadData: request.body,
        error: error?.message || 'Fatal error',
        success: false
      })
    } catch (logError) {
      console.error('Failed to log error:', logError)
    }
    
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

// CORS handler remains the same
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