import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function GET(request: NextRequest) {
  console.log('[Test Email] Starting email test...')
  
  try {
    // Check if API key exists
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY not found in environment'
      }, { status: 500 })
    }
    
    // Initialize Resend
    const resend = new Resend(apiKey)
    
    // Send test email
    const result = await resend.emails.send({
      from: 'TrueFlow AI <onboarding@resend.dev>',
      to: ['griffin@trueflow.ai'],
      subject: '🧪 Test Email Notification - Landing Page Forms Working',
      html: `
        <h1>Test Email from TrueFlow Landing Page</h1>
        <p>This is a test to verify email notifications are working.</p>
        <p>If you receive this, the email system is functioning correctly.</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `,
      text: `Test Email from TrueFlow Landing Page\n\nThis is a test to verify email notifications are working.\n\nTimestamp: ${new Date().toISOString()}`
    })
    
    console.log('[Test Email] Email sent successfully:', result)
    
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      emailId: result.data?.id,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('[Test Email] Failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 })
  }
}