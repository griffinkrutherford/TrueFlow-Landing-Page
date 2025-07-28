/**
 * Debug endpoint to check headers and environment in production
 */

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const headers: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    headers[key] = value
  })

  const debugInfo = {
    timestamp: new Date().toISOString(),
    url: request.url,
    method: request.method,
    headers,
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
      RAILWAY_PROJECT_ID: process.env.RAILWAY_PROJECT_ID,
      RAILWAY_SERVICE_ID: process.env.RAILWAY_SERVICE_ID,
      RAILWAY_REPLICA_ID: process.env.RAILWAY_REPLICA_ID,
      PORT: process.env.PORT,
      // Check for any proxy-related vars
      HTTP_PROXY: process.env.HTTP_PROXY,
      HTTPS_PROXY: process.env.HTTPS_PROXY,
      NO_PROXY: process.env.NO_PROXY,
    },
    resendCheck: {
      hasApiKey: !!process.env.RESEND_API_KEY,
      keyLength: process.env.RESEND_API_KEY?.length || 0,
      keyPrefix: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 7) : 'NOT_SET'
    }
  }

  return NextResponse.json(debugInfo, {
    headers: {
      'Cache-Control': 'no-store'
    }
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  
  return NextResponse.json({
    received: true,
    body,
    contentType: request.headers.get('content-type'),
    contentLength: request.headers.get('content-length'),
    timestamp: new Date().toISOString()
  })
}