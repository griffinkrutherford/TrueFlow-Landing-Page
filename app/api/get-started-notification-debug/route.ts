/**
 * Debug version of the get-started notification endpoint with extensive logging
 */

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  const debugInfo: any = {
    timestamp: new Date().toISOString(),
    headers: {},
    env: {},
    steps: []
  }

  // Capture request headers
  debugInfo.headers = {
    origin: request.headers.get('origin'),
    host: request.headers.get('host'),
    contentType: request.headers.get('content-type'),
    userAgent: request.headers.get('user-agent')
  }

  // Capture environment info
  debugInfo.env = {
    hasResendKey: !!process.env.RESEND_API_KEY,
    keyLength: process.env.RESEND_API_KEY?.length || 0,
    keyPrefix: process.env.RESEND_API_KEY?.substring(0, 10) + '...' || 'N/A',
    nodeEnv: process.env.NODE_ENV
  }

  try {
    // Step 1: Parse request body
    debugInfo.steps.push({ step: 'parse_body', status: 'starting' })
    const leadData = await request.json()
    debugInfo.steps.push({ 
      step: 'parse_body', 
      status: 'success',
      data: {
        hasFirstName: !!leadData.firstName,
        hasLastName: !!leadData.lastName,
        hasEmail: !!leadData.email,
        hasBusinessName: !!leadData.businessName,
        selectedPlan: leadData.selectedPlan
      }
    })

    // Step 2: Initialize Resend
    debugInfo.steps.push({ step: 'init_resend', status: 'starting' })
    const resend = new Resend(process.env.RESEND_API_KEY!)
    debugInfo.steps.push({ step: 'init_resend', status: 'success' })

    // Step 3: Prepare email data
    debugInfo.steps.push({ step: 'prepare_email', status: 'starting' })
    const emailData = {
      from: 'TrueFlow Leads <onboarding@resend.dev>',
      to: ['griffin@trueflow.ai', 'matt@trueflow.ai'],
      subject: `DEBUG: Get Started Lead - ${leadData.firstName} ${leadData.lastName}`,
      text: `DEBUG EMAIL\n\nName: ${leadData.firstName} ${leadData.lastName}\nEmail: ${leadData.email}\nBusiness: ${leadData.businessName}\nPlan: ${leadData.selectedPlan}`,
      html: `<h1>DEBUG EMAIL</h1><p>Name: ${leadData.firstName} ${leadData.lastName}<br>Email: ${leadData.email}<br>Business: ${leadData.businessName}<br>Plan: ${leadData.selectedPlan}</p>`
    }
    debugInfo.steps.push({ 
      step: 'prepare_email', 
      status: 'success',
      emailData: {
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject
      }
    })

    // Step 4: Send email
    debugInfo.steps.push({ step: 'send_email', status: 'starting' })
    const result = await resend.emails.send(emailData)
    debugInfo.steps.push({ 
      step: 'send_email', 
      status: 'success',
      result: {
        id: result.data?.id,
        hasData: !!result.data
      }
    })

    // Return debug info with success
    return NextResponse.json({
      success: true,
      emailId: result.data?.id,
      debug: debugInfo,
      message: 'Debug email sent successfully'
    })

  } catch (error: any) {
    debugInfo.error = {
      message: error?.message || 'Unknown error',
      name: error?.name,
      stack: error?.stack?.split('\n').slice(0, 3).join('\n'),
      statusCode: error?.statusCode,
      type: error?.type
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to send debug email',
      debug: debugInfo
    }, { status: 500 })
  }
}