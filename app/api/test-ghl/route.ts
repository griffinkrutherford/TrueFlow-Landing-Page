import { NextRequest, NextResponse } from 'next/server'

// Test endpoint for GHL API
// Access via: http://localhost:3001/api/test-ghl?scenario=assessment
// or http://localhost:3001/api/test-ghl?scenario=simple

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const scenario = searchParams.get('scenario') || 'assessment'
  
  // Test data for different scenarios
  const testData: Record<string, any> = {
    assessment: {
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      phone: "1234567890",
      businessName: "Test Business",
      businessType: "Marketing Agency",
      contentGoals: ["newsletters", "sales"],
      assessmentAnswers: [
        {
          questionId: "crm-usage",
          category: "Customer Management",
          question: "How do you currently manage customer relationships?",
          answer: "Spreadsheets or manual tracking",
          score: 1
        },
        {
          questionId: "lead-response",
          category: "Customer Management",
          question: "How quickly do you typically respond to new leads?",
          answer: "Within 24 hours",
          score: 2
        }
      ],
      answers: {
        "crm-usage": "spreadsheets",
        "lead-response": "hours"
      },
      totalScore: 14,
      maxPossibleScore: 24,
      scorePercentage: 58,
      recommendation: "Complete System",
      readinessLevel: "Ready",
      integrations: ["activecampaign", "hubspot"],
      selectedPlan: "Complete System",
      timestamp: new Date().toISOString(),
      assessmentVersion: "2.0",
      source: "readiness-assessment"
    },
    simple: {
      firstName: "Simple",
      lastName: "Test",
      email: "simple@example.com",
      phone: "9876543210",
      businessName: "Simple Business",
      businessType: "E-commerce",
      contentGoals: ["blog", "social"],
      integrations: ["mailchimp"],
      pricingPlan: "growth",
      timestamp: new Date().toISOString(),
      source: "get-started"
    },
    getstarted: {
      firstName: "GetStarted",
      lastName: "Test",
      email: "getstarted@example.com",
      phone: "5555551234",
      businessName: "Test Agency",
      businessType: "Marketing Agency",
      contentGoals: ["newsletters", "blog", "social"],
      monthlyLeads: "50-100",
      teamSize: "5-10",
      currentTools: ["mailchimp", "hubspot", "wordpress"],
      biggestChallenge: "Scaling content creation while maintaining quality",
      pricingPlan: "professional",
      timestamp: new Date().toISOString(),
      source: "get-started-form"
    },
    minimal: {
      firstName: "Minimal",
      lastName: "Test",
      email: "minimal@example.com",
      timestamp: new Date().toISOString(),
      source: "test"
    },
    broken: {
      // Intentionally broken data to test error handling
      firstName: "Broken",
      // Missing required fields
      businessType: null,
      pricingPlan: undefined,
      recommendation: null,
      timestamp: new Date().toISOString(),
      source: "test"
    },
    edgecase: {
      // Test edge cases with undefined/null arrays
      firstName: "Edge",
      lastName: "Case",
      email: "edge@example.com",
      businessName: "Edge Business",
      businessType: "Other",
      contentGoals: undefined, // This should trigger the error
      currentTools: null, // This should also be handled
      monthlyLeads: "1-10",
      teamSize: "1",
      biggestChallenge: "Just starting out",
      pricingPlan: "starter",
      timestamp: new Date().toISOString()
    }
  }
  
  const selectedData = testData[scenario] || testData.assessment
  
  try {
    // Call the GHL API endpoint
    const response = await fetch(`${request.nextUrl.origin}/api/ghl/create-lead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedData)
    })
    
    const result = await response.json()
    
    return NextResponse.json({
      test: {
        scenario,
        timestamp: new Date().toISOString(),
        dataUsed: selectedData
      },
      apiResponse: {
        status: response.status,
        statusText: response.statusText,
        result
      }
    }, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  } catch (error) {
    return NextResponse.json({
      test: {
        scenario,
        timestamp: new Date().toISOString(),
        dataUsed: selectedData
      },
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }
    }, { status: 500 })
  }
}

// POST endpoint to test with custom data
export async function POST(request: NextRequest) {
  try {
    const customData = await request.json()
    
    // Call the GHL API endpoint with custom data
    const response = await fetch(`${request.nextUrl.origin}/api/ghl/create-lead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customData)
    })
    
    const result = await response.json()
    
    return NextResponse.json({
      test: {
        method: 'POST',
        timestamp: new Date().toISOString(),
        dataUsed: customData
      },
      apiResponse: {
        status: response.status,
        statusText: response.statusText,
        result
      }
    }, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  } catch (error) {
    return NextResponse.json({
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }
    }, { status: 500 })
  }
}