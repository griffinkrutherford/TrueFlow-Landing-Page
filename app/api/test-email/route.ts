import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 })
    }
    
    console.log('[Test Email] Attempting to send test email to:', email)
    
    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes('your_')) {
      return NextResponse.json({ 
        error: 'Resend API key not configured',
        details: 'The RESEND_API_KEY environment variable is not properly set'
      }, { status: 500 })
    }
    
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    // Send test email
    const result = await resend.emails.send({
      from: 'TrueFlow Test <onboarding@resend.dev>',
      to: [email],
      subject: 'TrueFlow Email Test - Your submission was received!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3b82f6;">Email Test Successful!</h1>
          <p>This is a test email from TrueFlow's Getting Started form.</p>
          <p><strong>What this means:</strong></p>
          <ul>
            <li>✅ Resend API is properly configured</li>
            <li>✅ Emails can be sent successfully</li>
            <li>✅ Your email address (${email}) is receiving notifications</li>
          </ul>
          <hr style="margin: 20px 0;">
          <p><strong>Note:</strong> In production, form submissions are sent to:</p>
          <ul>
            <li>griffin@trueflow.ai</li>
            <li>matt@trueflow.ai</li>
          </ul>
          <p>To receive notifications at your email address, the code would need to be updated to include your email in the recipient list.</p>
        </div>
      `
    })
    
    console.log('[Test Email] Email sent successfully:', result)
    
    return NextResponse.json({ 
      success: true,
      message: `Test email sent to ${email}`,
      emailId: result.data?.id,
      note: 'Check your inbox (and spam folder) for the test email'
    })
    
  } catch (error: any) {
    console.error('[Test Email] Error:', error)
    return NextResponse.json({ 
      error: 'Failed to send test email',
      details: error.message
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST method with { "email": "your-email@example.com" } to test' 
  })
}