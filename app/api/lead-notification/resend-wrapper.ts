/**
 * Wrapper for Resend API with Railway-specific fixes
 */

import { Resend } from 'resend'

export function createResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured')
  }

  // Create Resend client with custom configuration for Railway
  const resend = new Resend(apiKey)
  
  // Override the default fetch if needed for Railway environment
  if (process.env.RAILWAY_ENVIRONMENT) {
    console.log('Running in Railway environment, using custom fetch configuration')
    
    // Railway should handle HTTPS properly, but we'll add extra logging
    const originalSend = resend.emails.send.bind(resend.emails)
    
    resend.emails.send = async function(payload: any) {
      console.log('Resend email attempt in Railway:', {
        to: payload.to,
        from: payload.from,
        subject: payload.subject,
        timestamp: new Date().toISOString(),
        railwayEnv: process.env.RAILWAY_ENVIRONMENT
      })
      
      try {
        const result = await originalSend(payload)
        console.log('Resend email success in Railway:', {
          emailId: result.data?.id,
          timestamp: new Date().toISOString()
        })
        return result
      } catch (error: any) {
        console.error('Resend email failed in Railway:', {
          error: error?.message,
          statusCode: error?.statusCode,
          type: error?.type,
          timestamp: new Date().toISOString()
        })
        throw error
      }
    }
  }

  return resend
}

// Helper to validate email configuration
export function validateEmailConfig() {
  const issues: string[] = []
  
  if (!process.env.RESEND_API_KEY) {
    issues.push('RESEND_API_KEY is not set')
  } else if (!process.env.RESEND_API_KEY.startsWith('re_')) {
    issues.push('RESEND_API_KEY does not appear to be valid (should start with "re_")')
  }
  
  if (process.env.NODE_ENV === 'production' && !process.env.RAILWAY_ENVIRONMENT && !process.env.VERCEL_ENV) {
    issues.push('Running in production but no deployment platform detected')
  }
  
  return {
    valid: issues.length === 0,
    issues
  }
}