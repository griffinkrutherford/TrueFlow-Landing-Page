/**
 * API endpoint for sending lead notification emails to Griffin and Matt
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

export async function POST(request: NextRequest) {
  // Log the request origin for debugging
  const origin = request.headers.get('origin')
  const host = request.headers.get('host')
  console.log('Lead notification request received:', {
    origin,
    host,
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV
  })
  
  // CRITICAL: Check if RESEND_API_KEY exists in Railway environment
  if (!process.env.RESEND_API_KEY) {
    console.error('🚨 CRITICAL ERROR: RESEND_API_KEY is not set in environment variables!')
    console.error('To fix: Go to Railway Dashboard > Your Service > Variables > Add RESEND_API_KEY')
    console.error('The key should start with "re_" and be your actual Resend API key from https://resend.com/api-keys')
  } else if (process.env.RESEND_API_KEY.includes('your_')) {
    console.error('🚨 CRITICAL ERROR: RESEND_API_KEY contains placeholder value!')
    console.error('Current value starts with:', process.env.RESEND_API_KEY.substring(0, 10) + '...')
  } else {
    console.log('✅ RESEND_API_KEY is present, starting with:', process.env.RESEND_API_KEY.substring(0, 7) + '...')
  }

  try {
    const leadData: LeadData = await request.json()
    console.log('Lead data received:', {
      name: `${leadData.firstName} ${leadData.lastName}`,
      email: leadData.email,
      business: leadData.businessName
    })

    // Validate required fields
    if (!leadData.firstName || !leadData.lastName || !leadData.email || !leadData.businessName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Format the email content with comprehensive data
    const readinessEmoji = leadData.scorePercentage && leadData.scorePercentage >= 75 ? '🟢' : 
                           leadData.scorePercentage && leadData.scorePercentage >= 50 ? '🟡' : '🔴'
    
    const emailSubject = `🚀 New TrueFlow Lead: ${leadData.firstName} ${leadData.lastName} - ${leadData.businessName} ${readinessEmoji}`
    
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

    // Test API key validity by attempting to get domains
    try {
      console.log('Testing Resend API connection...')
      const testResponse = await resend.domains.list()
      console.log('Resend API test successful:', testResponse)
    } catch (testError: any) {
      // For restricted API keys, domain listing might fail but sending emails could still work
      console.log('Domain test failed (this is normal for restricted API keys):', {
        error: testError?.message || 'Unknown error',
        statusCode: testError?.statusCode || testError?.error?.statusCode
      })
      
      // If it's not a 401 error, it might just be a restricted key
      const is401Error = testError?.statusCode === 401 || testError?.error?.statusCode === 401
      if (!is401Error) {
        console.log('Proceeding with email send despite domain test failure (likely restricted key)')
      } else {
        console.error('Resend API test failed with 401:', testError)
        
        // Check if it's an API key error
        if (testError?.message?.includes('API key') || testError?.error?.message?.includes('API key')) {
          return NextResponse.json(
            { 
              error: 'Invalid Resend API key',
              details: 'Please check that RESEND_API_KEY in production contains a valid API key from https://resend.com/api-keys',
              statusCode: 401,
              timestamp: new Date().toISOString()
            },
            { status: 401 }
          )
        }
        
        return NextResponse.json(
          { 
            error: 'Email service authentication failed',
            details: testError instanceof Error ? testError.message : 'API key may be invalid',
            timestamp: new Date().toISOString()
          },
          { status: 500 }
        )
      }
    }

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
    .score-box { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
    .score-big { font-size: 48px; font-weight: bold; color: #667eea; }
    .priority-high { background: #d4edda; color: #155724; padding: 15px; border-radius: 8px; border: 1px solid #c3e6cb; }
    .priority-medium { background: #fff3cd; color: #856404; padding: 15px; border-radius: 8px; border: 1px solid #ffeeba; }
    .priority-low { background: #f8d7da; color: #721c24; padding: 15px; border-radius: 8px; border: 1px solid #f5c6cb; }
    .assessment-item { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 6px; }
    .assessment-question { font-weight: bold; color: #495057; }
    .assessment-answer { color: #667eea; margin-top: 5px; }
    ul { padding-left: 20px; }
    li { margin: 5px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 New TrueFlow AI Lead ${readinessEmoji}</h1>
      <p style="margin: 0; font-size: 20px;">${leadData.firstName} ${leadData.lastName} - ${leadData.businessName}</p>
    </div>
    
    <div class="content">
      <div class="section">
        <div class="section-title">👤 Contact Information</div>
        <p><strong>Name:</strong> ${leadData.firstName} ${leadData.lastName}<br>
        <strong>Email:</strong> <a href="mailto:${leadData.email}">${leadData.email}</a><br>
        <strong>Phone:</strong> ${leadData.phone || 'Not provided'}<br>
        <strong>Business:</strong> ${leadData.businessName}<br>
        <strong>Business Type:</strong> ${leadData.businessType || 'Not specified'}</p>
      </div>
      
      <div class="section">
        <div class="section-title">📊 Readiness Score</div>
        <div class="score-box">
          <div class="score-big">${leadData.scorePercentage || 0}%</div>
          <p><strong>${leadData.readinessLevel || 'Not calculated'}</strong><br>
          Score: ${leadData.totalScore || 0} / ${leadData.maxPossibleScore || 24}</p>
        </div>
        <p><strong>Recommendation:</strong> ${leadData.recommendation || 'Not available'}</p>
      </div>
      
      <div class="section">
        <div class="section-title">📝 Assessment Responses</div>
        ${leadData.assessmentAnswers && leadData.assessmentAnswers.length > 0
          ? leadData.assessmentAnswers.map((qa, index) => `
            <div class="assessment-item">
              <div class="assessment-question">${index + 1}. ${qa.question}</div>
              <div class="assessment-answer">→ ${qa.answer} (Score: ${qa.score}/4)</div>
              <small style="color: #6c757d;">Category: ${qa.category}</small>
            </div>
          `).join('')
          : '<p>No assessment answers recorded</p>'
        }
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
      
      <div class="section">
        <div class="section-title">💰 Plan Selection</div>
        <p><strong>Selected Plan:</strong> ${leadData.selectedPlan || 'Not specified'}</p>
      </div>
      
      <div class="${leadData.scorePercentage && leadData.scorePercentage >= 75 ? 'priority-high' : 
                   leadData.scorePercentage && leadData.scorePercentage >= 50 ? 'priority-medium' : 'priority-low'}">
        <strong>🚨 ACTION REQUIRED:</strong><br>
        ${leadData.scorePercentage && leadData.scorePercentage >= 75 
          ? '✅ HIGH PRIORITY - This lead is highly qualified and ready for TrueFlow!'
          : leadData.scorePercentage && leadData.scorePercentage >= 50
          ? '⚠️ MEDIUM PRIORITY - This lead shows good potential but may need education.'
          : '📋 NURTURE LEAD - This lead needs more education before they\'re ready.'
        }<br><br>
        <strong>Follow up within 24 hours for best results!</strong>
      </div>
      
      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #6c757d; font-size: 12px;">
        <p>Submitted: ${leadData.timestamp}<br>
        Assessment Version: ${leadData.assessmentVersion || '1.0'}<br>
        Source: ${leadData.source || 'readiness-assessment'}</p>
      </div>
    </div>
  </div>
</body>
</html>
      `.trim()

      // Log email attempt
      console.log('Attempting to send email:', {
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

      console.log('Email sent successfully:', {
        emailId: emailResult.data?.id,
        timestamp: new Date().toISOString(),
        recipients: ['griffin@trueflow.ai', 'matt@trueflow.ai']
      })

      // Log successful email
      await logEmailAttempt({
        timestamp: new Date().toISOString(),
        type: 'lead-notification',
        recipient: ['griffin@trueflow.ai', 'matt@trueflow.ai'],
        subject: emailSubject,
        leadData,
        emailId: emailResult.data?.id,
        success: true
      })

      const response = {
        success: true,
        message: 'Lead notification emails sent successfully',
        recipients: ['griffin@trueflow.ai', 'matt@trueflow.ai'],
        leadId: `lead_${Date.now()}`,
        emailId: emailResult.data?.id || 'unknown'
      }

      return NextResponse.json(response, { status: 200 })

    } catch (emailError: any) {
      console.error('Failed to send email via Resend:', emailError)
      console.error('Error details:', {
        message: emailError?.message || 'Unknown error',
        statusCode: emailError?.statusCode || emailError?.error?.statusCode,
        type: emailError?.type || emailError?.error?.type,
        name: emailError?.name || emailError?.error?.name,
        apiKey: resendApiKey ? 'Present (masked)' : 'Missing',
        fromAddress: 'TrueFlow Leads <onboarding@resend.dev>',
        toAddresses: ['griffin@trueflow.ai', 'matt@trueflow.ai'],
        timestamp: new Date().toISOString(),
        nodeEnv: process.env.NODE_ENV
      })
      
      // Return a more specific error message
      const errorMessage = emailError instanceof Error ? emailError.message : 'Unknown email service error'
      
      // Use fallback response to ensure we don't lose the lead
      return createFallbackResponse(leadData, emailError)
    }

  } catch (error: any) {
    console.error('Error processing lead notification:', error)
    console.error('Full error details:', {
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
  
  console.log('CORS preflight request:', {
    origin,
    timestamp: new Date().toISOString()
  })
  
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