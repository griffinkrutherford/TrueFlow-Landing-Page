import { NextResponse } from 'next/server'

export async function GET() {
  // Direct check for Railway shared variables
  const railwayServiceId = process.env.RAILWAY_SERVICE_ID
  const railwayProjectId = process.env.RAILWAY_PROJECT_ID
  
  // Check all possible ways the variable might be accessed
  const checks = {
    direct: process.env.RESEND_API_KEY,
    bracketed: process.env['RESEND_API_KEY'],
    fromProcessEnv: Object.keys(process.env).includes('RESEND_API_KEY'),
    ghlToken: process.env.GHL_ACCESS_TOKEN,
    ghlLocation: process.env.GHL_LOCATION_ID
  }
  
  // List all env vars (without values) to debug
  const allEnvKeys = Object.keys(process.env).sort()
  
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    railway: {
      serviceId: railwayServiceId || 'NOT_SET',
      projectId: railwayProjectId || 'NOT_SET',
      environment: process.env.RAILWAY_ENVIRONMENT_NAME || 'NOT_SET'
    },
    sharedVarsChecks: {
      resendApiKey: {
        found: !!checks.direct,
        inEnvKeys: checks.fromProcessEnv,
        startsWithRe: checks.direct?.startsWith('re_') || false
      },
      ghlAccessToken: {
        found: !!checks.ghlToken,
        length: checks.ghlToken?.length || 0
      },
      ghlLocationId: {
        found: !!checks.ghlLocation,
        value: checks.ghlLocation || 'NOT_SET'
      }
    },
    allEnvKeys: allEnvKeys.filter(key => 
      key.includes('RAILWAY') || 
      key.includes('RESEND') || 
      key.includes('GHL') ||
      key === 'NODE_ENV'
    ),
    totalEnvVars: allEnvKeys.length,
    instructions: !checks.direct ? {
      steps: [
        '1. Go to Railway Dashboard',
        '2. Click on "TrueFlow-Landing-Page" service',
        '3. Navigate to "Variables" tab',
        '4. Click "New Variable" or the chain link icon',
        '5. Select "Reference Variable"',
        '6. Choose RESEND_API_KEY from Shared Variables',
        '7. Repeat for GHL_ACCESS_TOKEN and GHL_LOCATION_ID',
        '8. Railway will redeploy automatically'
      ],
      note: 'Shared variables must be explicitly linked to each service'
    } : null
  }, { 
    status: 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache'
    }
  })
}