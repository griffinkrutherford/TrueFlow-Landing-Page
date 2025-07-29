import { Resend } from 'resend'
import { calculateLeadScore, getQualificationStatus } from '@/lib/ghl/custom-fields'

const resend = new Resend(process.env.RESEND_API_KEY)

interface AssessmentData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  businessName?: string
  score: number
  recommendation: string
  answers: Record<string, string>
  timestamp: string
}

interface GetStartedData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  businessName?: string
  businessType: string
  contentGoals: string[]
  monthlyLeads: string
  teamSize: string
  currentTools: string[]
  biggestChallenge: string
  pricingPlan: string
  timestamp: string
}

// Helper function to test Resend connection
async function testResendConnection(): Promise<boolean> {
  try {
    // Try a simple API call to verify the key works
    const testResult = await fetch('https://api.resend.com/emails', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })
    
    return testResult.ok
  } catch (error) {
    console.error('[Resend] Connection test failed:', error)
    return false
  }
}

export async function sendAssessmentNotification(data: AssessmentData) {
  console.log('[Email] Sending assessment notification...')
  
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes('your_')) {
    throw new Error('Resend API key not configured')
  }

  // Test connection first
  const isConnected = await testResendConnection()
  if (!isConnected) {
    throw new Error('Unable to connect to Resend API')
  }

  // Calculate lead quality
  const leadScore = calculateLeadScore(data, 'assessment')
  const qualificationStatus = getQualificationStatus(leadScore)
  
  // Lead quality emoji
  const qualityEmoji = {
    hot: '🔥',
    warm: '🌡️',
    cold: '❄️'
  }[qualificationStatus] || '📊'

  const subject = `${qualityEmoji} New Assessment Lead: ${data.firstName} ${data.lastName} (Score: ${data.score}%)`
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .score-badge { display: inline-block; background: #3b82f6; color: white; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
        .quality-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; margin-left: 10px; }
        .quality-hot { background: #ef4444; color: white; }
        .quality-warm { background: #f59e0b; color: white; }
        .quality-cold { background: #3b82f6; color: white; }
        .info-row { margin: 10px 0; padding: 10px; background: white; border-radius: 5px; }
        .label { font-weight: bold; color: #6b7280; }
        .answer-list { background: white; padding: 15px; border-radius: 5px; margin-top: 15px; }
        .answer-item { margin: 8px 0; padding-left: 20px; }
        .cta { background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
        .recommendation { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 5px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Assessment Lead</h1>
          <p style="margin: 0; opacity: 0.9;">AI Content Marketing Readiness Assessment</p>
        </div>
        
        <div class="content">
          <div style="text-align: center; margin-bottom: 25px;">
            <span class="score-badge">${data.score}% Score</span>
            <span class="quality-badge quality-${qualificationStatus}">${qualityEmoji} ${qualificationStatus.toUpperCase()} Lead (${leadScore}/100)</span>
          </div>
          
          <div class="info-row">
            <span class="label">Name:</span> ${data.firstName} ${data.lastName}
          </div>
          
          <div class="info-row">
            <span class="label">Email:</span> <a href="mailto:${data.email}">${data.email}</a>
          </div>
          
          ${data.phone ? `
          <div class="info-row">
            <span class="label">Phone:</span> <a href="tel:${data.phone}">${data.phone}</a>
          </div>
          ` : ''}
          
          ${data.businessName ? `
          <div class="info-row">
            <span class="label">Business:</span> ${data.businessName}
          </div>
          ` : ''}
          
          <div class="recommendation">
            <strong>Recommended Plan:</strong> ${data.recommendation}
          </div>
          
          <h3>Assessment Answers:</h3>
          <div class="answer-list">
            ${Object.entries(data.answers).map(([question, answer]) => `
              <div class="answer-item">
                <strong>${question}:</strong> ${answer}
              </div>
            `).join('')}
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://app.gohighlevel.com" class="cta">View in CRM →</a>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <h4>Lead Scoring Details:</h4>
          <ul style="color: #6b7280; font-size: 14px;">
            <li>Base Assessment Score: ${data.score}%</li>
            <li>Lead Quality Score: ${leadScore}/100</li>
            <li>Qualification: ${qualificationStatus}</li>
          </ul>
          
          <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 30px;">
            Timestamp: ${new Date(data.timestamp).toLocaleString()}<br>
            Source: TrueFlow AI Assessment Form
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  const textContent = `
New Assessment Lead

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}
${data.businessName ? `Business: ${data.businessName}` : ''}

Assessment Score: ${data.score}%
Lead Quality: ${qualificationStatus} (${leadScore}/100)
Recommended Plan: ${data.recommendation}

Assessment Answers:
${Object.entries(data.answers).map(([q, a]) => `- ${q}: ${a}`).join('\n')}

Timestamp: ${new Date(data.timestamp).toLocaleString()}
Source: TrueFlow AI Assessment Form
  `.trim()

  // Retry logic for resilience
  let lastError
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const result = await resend.emails.send({
        from: 'TrueFlow AI <onboarding@resend.dev>',
        to: ['griffin@trueflow.ai', 'matt@trueflow.ai'],
        subject,
        html: htmlContent,
        text: textContent
      })
      
      console.log('[Email] Assessment email sent successfully:', result)
      return result
    } catch (error) {
      lastError = error
      console.error(`[Email] Attempt ${attempt} failed:`, error)
      
      if (attempt < 3) {
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
      }
    }
  }
  
  throw lastError
}

export async function sendGetStartedNotification(data: GetStartedData) {
  console.log('[Email] Sending get-started notification...')
  
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes('your_')) {
    throw new Error('Resend API key not configured')
  }

  // Test connection first
  const isConnected = await testResendConnection()
  if (!isConnected) {
    throw new Error('Unable to connect to Resend API')
  }

  // Calculate lead quality
  const leadScore = calculateLeadScore(data, 'get-started')
  const qualificationStatus = getQualificationStatus(leadScore)
  
  // Lead quality emoji
  const qualityEmoji = {
    hot: '🔥',
    warm: '🌡️',
    cold: '❄️'
  }[qualificationStatus] || '📊'

  const subject = `${qualityEmoji} New Get Started Lead: ${data.firstName} ${data.lastName} (${data.pricingPlan} Plan)`
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .plan-badge { display: inline-block; background: #8b5cf6; color: white; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
        .quality-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; margin-left: 10px; }
        .quality-hot { background: #ef4444; color: white; }
        .quality-warm { background: #f59e0b; color: white; }
        .quality-cold { background: #3b82f6; color: white; }
        .info-row { margin: 10px 0; padding: 10px; background: white; border-radius: 5px; }
        .label { font-weight: bold; color: #6b7280; }
        .detail-list { background: white; padding: 15px; border-radius: 5px; margin-top: 15px; }
        .detail-item { margin: 8px 0; }
        .cta { background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
        .chip { display: inline-block; background: #e5e7eb; padding: 3px 10px; border-radius: 15px; margin: 2px; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Get Started Lead</h1>
          <p style="margin: 0; opacity: 0.9;">Ready to implement TrueFlow AI</p>
        </div>
        
        <div class="content">
          <div style="text-align: center; margin-bottom: 25px;">
            <span class="plan-badge">${data.pricingPlan} Plan</span>
            <span class="quality-badge quality-${qualificationStatus}">${qualityEmoji} ${qualificationStatus.toUpperCase()} Lead (${leadScore}/100)</span>
          </div>
          
          <div class="info-row">
            <span class="label">Name:</span> ${data.firstName} ${data.lastName}
          </div>
          
          <div class="info-row">
            <span class="label">Email:</span> <a href="mailto:${data.email}">${data.email}</a>
          </div>
          
          ${data.phone ? `
          <div class="info-row">
            <span class="label">Phone:</span> <a href="tel:${data.phone}">${data.phone}</a>
          </div>
          ` : ''}
          
          ${data.businessName ? `
          <div class="info-row">
            <span class="label">Business:</span> ${data.businessName}
          </div>
          ` : ''}
          
          <div class="info-row">
            <span class="label">Business Type:</span> ${data.businessType}
          </div>
          
          <h3>Business Details:</h3>
          <div class="detail-list">
            <div class="detail-item">
              <strong>Content Goals:</strong><br>
              ${Array.isArray(data.contentGoals) ? 
                data.contentGoals.map(goal => `<span class="chip">${goal}</span>`).join(' ') : 
                (data.contentGoals || 'Not specified')}
            </div>
            
            <div class="detail-item">
              <strong>Monthly Leads:</strong> ${data.monthlyLeads || 'Not specified'}
            </div>
            
            <div class="detail-item">
              <strong>Team Size:</strong> ${data.teamSize || 'Not specified'}
            </div>
            
            <div class="detail-item">
              <strong>Current Tools:</strong><br>
              ${Array.isArray(data.currentTools) ? 
                data.currentTools.map(tool => `<span class="chip">${tool}</span>`).join(' ') : 
                (data.currentTools || 'Not specified')}
            </div>
            
            <div class="detail-item">
              <strong>Biggest Challenge:</strong><br>
              <em>${data.biggestChallenge || 'Not specified'}</em>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://app.gohighlevel.com" class="cta">View in CRM →</a>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <h4>Lead Scoring Details:</h4>
          <ul style="color: #6b7280; font-size: 14px;">
            <li>Lead Quality Score: ${leadScore}/100</li>
            <li>Qualification: ${qualificationStatus}</li>
            <li>Selected Plan: ${data.pricingPlan}</li>
          </ul>
          
          <h4>Recommended Actions:</h4>
          <ol style="color: #6b7280; font-size: 14px;">
            ${qualificationStatus === 'hot' ? 
              `<li>🔥 Contact within 1 hour - High-value lead!</li>
               <li>Schedule demo immediately</li>
               <li>Prepare custom proposal</li>` :
              qualificationStatus === 'warm' ?
              `<li>Contact within 24 hours</li>
               <li>Send personalized follow-up email</li>
               <li>Schedule discovery call</li>` :
              `<li>Add to nurture sequence</li>
               <li>Send educational content</li>
               <li>Follow up in 3-5 days</li>`
            }
          </ol>
          
          <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 30px;">
            Timestamp: ${new Date(data.timestamp).toLocaleString()}<br>
            Source: TrueFlow Get Started Form
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  const textContent = `
New Get Started Lead

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}
${data.businessName ? `Business: ${data.businessName}` : ''}
Business Type: ${data.businessType}
Selected Plan: ${data.pricingPlan}

Lead Quality: ${qualificationStatus} (${leadScore}/100)

Business Details:
- Content Goals: ${Array.isArray(data.contentGoals) ? data.contentGoals.join(', ') : (data.contentGoals || 'Not specified')}
- Monthly Leads: ${data.monthlyLeads || 'Not specified'}
- Team Size: ${data.teamSize || 'Not specified'}
- Current Tools: ${Array.isArray(data.currentTools) ? data.currentTools.join(', ') : (data.currentTools || 'Not specified')}
- Biggest Challenge: ${data.biggestChallenge || 'Not specified'}

Timestamp: ${new Date(data.timestamp).toLocaleString()}
Source: TrueFlow Get Started Form
  `.trim()

  // Retry logic for resilience
  let lastError
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const result = await resend.emails.send({
        from: 'TrueFlow AI <onboarding@resend.dev>',
        to: ['griffin@trueflow.ai', 'matt@trueflow.ai'],
        subject,
        html: htmlContent,
        text: textContent
      })
      
      console.log('[Email] Get Started email sent successfully:', result)
      return result
    } catch (error) {
      lastError = error
      console.error(`[Email] Attempt ${attempt} failed:`, error)
      
      if (attempt < 3) {
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
      }
    }
  }
  
  throw lastError
}