/**
 * Simple endpoint to check environment setup in production
 * Access at: https://your-railway-app.railway.app/api/check-env
 */

import { NextResponse } from 'next/server'

export async function GET() {
  const hasResendKey = !!process.env.RESEND_API_KEY
  const keyPreview = process.env.RESEND_API_KEY 
    ? `${process.env.RESEND_API_KEY.substring(0, 7)}...${process.env.RESEND_API_KEY.substring(process.env.RESEND_API_KEY.length - 4)}`
    : 'NOT SET'
  
  const isPlaceholder = process.env.RESEND_API_KEY?.includes('your_') || false
  
  return NextResponse.json({
    status: 'Environment Check',
    environment: process.env.NODE_ENV || 'not set',
    resendApiKey: {
      exists: hasResendKey,
      preview: keyPreview,
      isPlaceholder: isPlaceholder,
      isValid: hasResendKey && !isPlaceholder && process.env.RESEND_API_KEY?.startsWith('re_') || false
    },
    timestamp: new Date().toISOString(),
    instructions: !hasResendKey ? 
      'Add RESEND_API_KEY to Railway Dashboard > Your Service > Variables' : 
      isPlaceholder ? 
        'Replace placeholder with actual API key from https://resend.com/api-keys' : 
        'API key appears to be configured correctly'
  })
}