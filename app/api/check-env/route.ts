/**
 * Simple endpoint to check environment setup in production
 * Access at: https://your-railway-app.railway.app/api/check-env
 */

import { NextResponse } from 'next/server'

export async function GET() {
  // Show all environment variables that start with common prefixes
  const envVars: Record<string, string> = {}
  const prefixes = ['RESEND', 'GHL', 'NODE', 'RAILWAY', 'PORT', 'HOST']
  
  // Also check for Railway-specific variables
  const railwayVars = [
    'RAILWAY_SERVICE_NAME',
    'RAILWAY_PROJECT_ID',
    'RAILWAY_ENVIRONMENT_NAME',
    'RAILWAY_REPLICA_ID'
  ]
  
  Object.keys(process.env).forEach(key => {
    if (prefixes.some(prefix => key.startsWith(prefix)) || railwayVars.includes(key)) {
      // Show partial values for sensitive keys
      if (key.includes('KEY') || key.includes('TOKEN')) {
        const value = process.env[key] || ''
        envVars[key] = value.length > 10 
          ? `${value.substring(0, 7)}...${value.substring(value.length - 4)}`
          : 'TOO_SHORT'
      } else {
        envVars[key] = process.env[key] || 'NOT_SET'
      }
    }
  })

  const hasResendKey = !!process.env.RESEND_API_KEY
  const keyPreview = process.env.RESEND_API_KEY 
    ? `${process.env.RESEND_API_KEY.substring(0, 7)}...${process.env.RESEND_API_KEY.substring(process.env.RESEND_API_KEY.length - 4)}`
    : 'NOT SET'
  
  const isPlaceholder = process.env.RESEND_API_KEY?.includes('your_') || false
  
  return NextResponse.json({
    status: 'Environment Check',
    environment: process.env.NODE_ENV || 'not set',
    detectedEnvVars: envVars,
    totalEnvVars: Object.keys(process.env).length,
    resendApiKey: {
      exists: hasResendKey,
      preview: keyPreview,
      isPlaceholder: isPlaceholder,
      isValid: hasResendKey && !isPlaceholder && process.env.RESEND_API_KEY?.startsWith('re_') || false
    },
    timestamp: new Date().toISOString(),
    railwayInstructions: !hasResendKey ? [
      '1. In Railway Dashboard, click on your service (TrueFlow-Landing-Page)',
      '2. Go to the "Variables" tab',
      '3. Look for the "Reference Variable" button (chain link icon)',
      '4. Click it and select RESEND_API_KEY from Shared Variables',
      '5. Also link GHL_ACCESS_TOKEN and GHL_LOCATION_ID if needed',
      '6. Railway will automatically redeploy after linking',
      '7. Variables should appear with a purple "shared" badge'
    ] : null,
    currentInstructions: !hasResendKey ? 
      'RESEND_API_KEY not found in service environment. It may be in Shared Variables but not linked to this service.' : 
      isPlaceholder ? 
        'Replace placeholder with actual API key from https://resend.com/api-keys' : 
        'API key appears to be configured correctly'
  })
}