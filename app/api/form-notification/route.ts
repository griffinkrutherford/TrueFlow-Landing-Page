import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    console.log('[Form Notification] Received submission:', data.firstName, data.lastName)
    
    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes('your_')) {
      console.error('[Form Notification] Resend not configured')
      // Return success anyway to not break the form
      return NextResponse.json({ success: true, message: 'Notification skipped - email not configured' })
    }
    
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    // Determine form type
    const isAssessment = 'assessmentAnswers' in data || 'scorePercentage' in data
    const formType = isAssessment ? 'Assessment' : 'Get Started'
    
    // Create email content
    const subject = `🚀 New TrueFlow ${formType} Lead: ${data.firstName} ${data.lastName}`
    
    let emailContent = `
      <h2>New ${formType} Form Submission</h2>
      <hr>
      <h3>Contact Information:</h3>
      <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
      <p><strong>Business:</strong> ${data.businessName}</p>
      <p><strong>Business Type:</strong> ${data.businessType || 'Not specified'}</p>
      <hr>
    `
    
    if (isAssessment && data.scorePercentage) {
      emailContent += `
        <h3>Assessment Results:</h3>
        <p><strong>Score:</strong> ${data.scorePercentage}%</p>
        <p><strong>Readiness Level:</strong> ${data.readinessLevel || 'Not specified'}</p>
        <p><strong>Recommendation:</strong> ${data.recommendation || 'Not specified'}</p>
        <p><strong>Selected Plan:</strong> ${data.selectedPlan || 'Not selected'}</p>
      `
    } else {
      emailContent += `
        <h3>Submission Details:</h3>
        <p><strong>Selected Plan:</strong> ${data.selectedPlan || data.pricingPlan || 'Not selected'}</p>
        <p><strong>Content Goals:</strong> ${Array.isArray(data.contentGoals) ? data.contentGoals.join(', ') : 'Not specified'}</p>
        <p><strong>Integrations:</strong> ${Array.isArray(data.integrations) ? data.integrations.join(', ') : 'None'}</p>
      `
    }
    
    emailContent += `
      <hr>
      <p><strong>Submitted:</strong> ${data.timestamp || new Date().toISOString()}</p>
      <p><strong>Source:</strong> ${data.source || formType}</p>
    `
    
    // Send email
    try {
      const result = await resend.emails.send({
        from: 'TrueFlow Forms <onboarding@resend.dev>',
        to: ['griffin@trueflow.ai', 'matt@trueflow.ai'],
        subject,
        html: emailContent
      })
      
      console.log('[Form Notification] Email sent successfully:', result.data?.id)
      
      return NextResponse.json({ 
        success: true, 
        message: 'Notification sent successfully',
        emailId: result.data?.id 
      })
    } catch (emailError: any) {
      console.error('[Form Notification] Email error:', emailError.message)
      // Don't fail the whole request if email fails
      return NextResponse.json({ 
        success: true, 
        message: 'Form received (email pending)',
        warning: 'Email notification failed but form was saved'
      })
    }
    
  } catch (error: any) {
    console.error('[Form Notification] Error:', error)
    // Return success to not break the form
    return NextResponse.json({ 
      success: true, 
      message: 'Form received',
      warning: 'Notification system temporarily unavailable'
    })
  }
}