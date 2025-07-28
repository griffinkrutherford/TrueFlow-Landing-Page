/**
 * Backup logger for email notifications
 * This ensures we don't lose lead information if email sending fails
 */

import { NextResponse } from 'next/server'

interface EmailBackupLog {
  timestamp: string
  type: 'lead-notification' | 'get-started' | 'partial-lead'
  recipient: string[]
  subject: string
  leadData: any
  error?: string
  emailId?: string
  success: boolean
}

export async function logEmailAttempt(log: EmailBackupLog) {
  // In production, you could send this to a logging service like LogDNA, Datadog, etc.
  // For now, we'll use console.error to ensure it appears in Railway logs
  
  const logEntry = {
    ...log,
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    service: 'trueflow-landing'
  }

  if (log.success) {
    console.log('📧 EMAIL_SENT:', JSON.stringify(logEntry, null, 2))
  } else {
    console.error('❌ EMAIL_FAILED:', JSON.stringify(logEntry, null, 2))
  }

  // You could also write to a file or database here
  // For Railway, logs are the most reliable option
  
  return logEntry
}

export function createFallbackResponse(leadData: any, error: any) {
  const errorDetails = {
    message: error?.message || 'Unknown error',
    type: error?.name || 'UnknownError',
    timestamp: new Date().toISOString()
  }

  // Log the failure
  logEmailAttempt({
    timestamp: new Date().toISOString(),
    type: 'lead-notification',
    recipient: ['griffin@trueflow.ai', 'matt@trueflow.ai'],
    subject: `Failed Lead: ${leadData.firstName} ${leadData.lastName}`,
    leadData,
    error: errorDetails.message,
    success: false
  })

  // Return a response that doesn't break the frontend
  // but includes debugging information
  return NextResponse.json({
    success: false,
    message: 'Email notification failed, but lead data was logged',
    leadInfo: {
      name: `${leadData.firstName} ${leadData.lastName}`,
      email: leadData.email,
      business: leadData.businessName,
      timestamp: leadData.timestamp
    },
    error: process.env.NODE_ENV === 'development' ? errorDetails : undefined,
    fallback: true
  }, { status: 200 }) // Return 200 to not break the form flow
}