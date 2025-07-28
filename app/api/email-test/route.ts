/**
 * Diagnostic endpoint to test email configuration in production
 */

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  
  // Basic auth check - only allow with secret token
  const expectedToken = process.env.EMAIL_TEST_TOKEN || 'test-trueflow-2025'
  if (authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const diagnostics: Record<string, any> = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
      isProduction: process.env.NODE_ENV === 'production'
    },
    resendConfig: {
      hasApiKey: !!process.env.RESEND_API_KEY,
      keyLength: process.env.RESEND_API_KEY?.length || 0,
      keyPrefix: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 7) + '...' : 'NOT_SET'
    }
  }

  // Test Resend API if key is present
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    // Test 1: Try to list domains (might fail for restricted keys)
    try {
      const domains = await resend.domains.list()
      diagnostics.domainTest = {
        success: true,
        domainCount: domains.data?.data?.length || 0,
        message: 'Full API access confirmed'
      }
    } catch (error: any) {
      diagnostics.domainTest = {
        success: false,
        error: error?.message || 'Unknown error',
        statusCode: error?.statusCode || error?.error?.statusCode,
        note: 'This is normal for restricted API keys'
      }
    }

    // Test 2: Try to send a test email
    try {
      const testEmail = await resend.emails.send({
        from: 'TrueFlow Test <onboarding@resend.dev>',
        to: ['griffin@trueflow.ai'],
        subject: `[TEST] TrueFlow Email Test - ${new Date().toISOString()}`,
        text: `This is a test email from the TrueFlow production environment.\n\nEnvironment: ${process.env.NODE_ENV}\nTimestamp: ${new Date().toISOString()}\n\nIf you receive this, email sending is working correctly.`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>TrueFlow Email Test</h2>
            <p>This is a test email from the TrueFlow production environment.</p>
            <ul>
              <li><strong>Environment:</strong> ${process.env.NODE_ENV}</li>
              <li><strong>Timestamp:</strong> ${new Date().toISOString()}</li>
            </ul>
            <p>If you receive this, email sending is working correctly.</p>
          </div>
        `
      })

      diagnostics.emailTest = {
        success: true,
        emailId: testEmail.data?.id,
        message: 'Test email sent successfully'
      }
    } catch (error: any) {
      diagnostics.emailTest = {
        success: false,
        error: error?.message || 'Unknown error',
        statusCode: error?.statusCode || error?.error?.statusCode,
        type: error?.type || error?.error?.type,
        name: error?.name || error?.error?.name
      }
    }
  } else {
    diagnostics.error = 'RESEND_API_KEY not found in environment variables'
  }

  // Add request info
  diagnostics.request = {
    host: request.headers.get('host'),
    origin: request.headers.get('origin'),
    userAgent: request.headers.get('user-agent'),
    url: request.url
  }

  return NextResponse.json(diagnostics, { 
    status: diagnostics.error ? 500 : 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  })
}

// Also support POST for testing with custom data
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  
  // Basic auth check
  const expectedToken = process.env.EMAIL_TEST_TOKEN || 'test-trueflow-2025'
  if (authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { testEmail, testSubject } = await request.json()
    
    if (!testEmail) {
      return NextResponse.json({ error: 'testEmail is required' }, { status: 400 })
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ 
        error: 'RESEND_API_KEY not configured',
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    
    const result = await resend.emails.send({
      from: 'TrueFlow Test <onboarding@resend.dev>',
      to: [testEmail],
      subject: testSubject || `[TEST] Custom Email Test - ${new Date().toISOString()}`,
      text: `This is a custom test email from TrueFlow.\n\nSent to: ${testEmail}\nTimestamp: ${new Date().toISOString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Custom Email Test</h2>
          <p>This test was sent to: <strong>${testEmail}</strong></p>
          <p>Timestamp: ${new Date().toISOString()}</p>
        </div>
      `
    })

    return NextResponse.json({
      success: true,
      emailId: result.data?.id,
      recipient: testEmail,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    return NextResponse.json({
      error: 'Failed to send test email',
      details: error?.message || 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}