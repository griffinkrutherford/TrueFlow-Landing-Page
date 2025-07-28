import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  console.log('[Test Email] Testing email configuration...')
  
  const config = {
    RESEND_API_KEY: process.env.RESEND_API_KEY ? 
      (process.env.RESEND_API_KEY === 'your_resend_api_key_here' ? 'PLACEHOLDER' : 'SET') : 
      'NOT SET',
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL || 'NOT SET',
    NOTIFICATION_EMAILS: process.env.NOTIFICATION_EMAILS || 'NOT SET',
    NODE_ENV: process.env.NODE_ENV || 'NOT SET'
  }
  
  console.log('[Test Email] Configuration:', config)
  
  // Try to send a test email
  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your_resend_api_key_here') {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
      const toEmails = (process.env.NOTIFICATION_EMAILS || 'griffin@trueflow.ai').split(',')
      
      const result = await resend.emails.send({
        from: fromEmail,
        to: toEmails,
        subject: 'TrueFlow Email Test',
        html: `
          <h2>Email Configuration Test</h2>
          <p>This is a test email from your TrueFlow deployment.</p>
          <p>If you receive this, your email configuration is working correctly!</p>
          <p><strong>Sent at:</strong> ${new Date().toISOString()}</p>
          <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'unknown'}</p>
        `
      })
      
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        config,
        result
      })
    } catch (error) {
      console.error('[Test Email] Error:', error)
      return NextResponse.json({
        success: false,
        message: 'Failed to send test email',
        config,
        error: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 })
    }
  }
  
  return NextResponse.json({
    success: false,
    message: 'Email not configured properly',
    config
  })
}