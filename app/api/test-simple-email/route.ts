import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function GET() {
  console.log('Test simple email endpoint called')
  
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ 
      error: 'RESEND_API_KEY not set',
      instructions: 'Set RESEND_API_KEY in Railway environment variables'
    }, { status: 500 })
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    // Send a very simple test email
    const { data, error } = await resend.emails.send({
      from: 'TrueFlow <onboarding@resend.dev>',
      to: ['griffin@trueflow.ai', 'matt@trueflow.ai'],
      subject: 'Test Email - TrueFlow System Check',
      html: '<p>This is a simple test email to verify delivery. If you receive this, the email system is working.</p>',
      text: 'This is a simple test email to verify delivery. If you receive this, the email system is working.'
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ 
        error: 'Failed to send email',
        details: error 
      }, { status: 500 })
    }

    console.log('Email sent successfully:', data)
    
    return NextResponse.json({ 
      success: true,
      message: 'Test email sent successfully',
      emailId: data?.id,
      recipients: ['griffin@trueflow.ai', 'matt@trueflow.ai'],
      checkInstructions: [
        '1. Check your inbox',
        '2. Check spam/junk folder', 
        '3. Check "All Mail" in Gmail',
        '4. Check Promotions/Updates tabs',
        '5. Search for "TrueFlow System Check"'
      ],
      resendDashboard: 'Check delivery status at https://resend.com/emails'
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ 
      error: 'Unexpected error occurred',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}