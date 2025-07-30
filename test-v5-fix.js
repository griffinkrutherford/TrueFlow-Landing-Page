/**
 * Test V5 endpoint with enhanced field mapping and form detection
 */

const API_URL_V4 = 'http://localhost:3001/api/ghl/create-lead-v4'
const API_URL_V5 = 'http://localhost:3001/api/ghl/create-lead-v5'

// Test data for Getting Started form (without assessment fields)
const getStartedData = {
  firstName: 'V5TEST',
  lastName: 'GETSTARTED',
  email: 'v5test-getstarted@deletetest.com',
  phone: '+1 (555) 555-1111',
  businessName: 'V5 Test GetStarted Agency',
  businessType: 'agency',
  contentGoals: ['newsletters', 'blogs', 'social', 'sales'],
  integrations: ['gohighlevel', 'mailchimp', 'zapier'],
  selectedPlan: 'complete-system'
}

// Test data for Assessment form (with answers)
const assessmentData = {
  firstName: 'V5TEST',
  lastName: 'ASSESSMENT',
  email: 'v5test-assessment@deletetest.com',
  phone: '+1 (555) 555-2222',
  businessName: 'V5 Test Assessment Business',
  businessType: 'coach',
  contentGoals: ['courses', 'support'],
  integrations: ['convertkit', 'activecampaign'],
  selectedPlan: 'content-engine',
  
  // Assessment specific fields
  answers: {
    'current-content': 'mixed',
    'content-volume': 'high',
    'crm-usage': 'advanced-crm',
    'lead-response': 'instant',
    'time-spent': 'very-high',
    'budget': 'enterprise'
  },
  
  // Assessment results
  assessmentAnswers: [
    {
      questionId: 'current-content',
      category: 'Content Creation',
      question: 'How do you currently create content?',
      answer: 'Mix of manual and automated tools',
      score: 3
    },
    {
      questionId: 'content-volume',
      category: 'Content Creation',
      question: 'How much content do you produce monthly?',
      answer: '21-50 pieces',
      score: 3
    },
    {
      questionId: 'crm-usage',
      category: 'Lead Management',
      question: 'How do you manage leads?',
      answer: 'Advanced CRM with automation',
      score: 4
    },
    {
      questionId: 'lead-response',
      category: 'Lead Management',
      question: 'How quickly do you respond to leads?',
      answer: 'Almost instantly',
      score: 4
    },
    {
      questionId: 'time-spent',
      category: 'Time Management',
      question: 'Time spent on repetitive tasks weekly?',
      answer: 'More than 30 hours',
      score: 4
    },
    {
      questionId: 'budget',
      category: 'Investment',
      question: 'Monthly budget for content and marketing tools?',
      answer: 'More than $5,000',
      score: 4
    }
  ],
  
  totalScore: 22,
  maxPossibleScore: 24,
  scorePercentage: 92,
  recommendation: 'Your business is highly ready for AI automation',
  readinessLevel: 'High'
}

async function testEndpoint(url, data, testName) {
  console.log(`\n📤 Testing ${testName} on ${url.includes('v5') ? 'V5' : 'V4'} endpoint...`)
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    
    const result = await response.json()
    
    console.log(`✅ Response received:`)
    console.log(`   Status: ${response.status}`)
    console.log(`   Success: ${result.success}`)
    console.log(`   Form Type: ${result.formType || 'not specified'}`)
    console.log(`   Custom Fields Used: ${result.customFieldsUsed}`)
    console.log(`   Lead Score: ${result.leadScore}`)
    console.log(`   Lead Quality: ${result.leadQuality}`)
    
    if (result.ghlContactId) {
      console.log(`   GHL Contact ID: ${result.ghlContactId}`)
    }
    
    return result
  } catch (error) {
    console.error(`❌ Error: ${error.message}`)
    return null
  }
}

async function runTests() {
  console.log('🧪 Testing V5 Field Mapping and Form Detection Fix')
  console.log('================================================\n')
  
  // Check if server is running
  try {
    const healthCheck = await fetch('http://localhost:3001')
    if (!healthCheck.ok) {
      console.error('❌ Server not responding on port 3001')
      console.log('Please start the server with: npm run dev')
      return
    }
  } catch (error) {
    console.error('❌ Cannot connect to server on port 3001')
    console.log('Please start the server with: npm run dev')
    return
  }
  
  console.log('Testing both V4 (broken) and V5 (fixed) endpoints for comparison...\n')
  
  // Test Getting Started form on both endpoints
  console.log('=== GETTING STARTED FORM TESTS ===')
  await testEndpoint(API_URL_V4, getStartedData, 'Getting Started Form')
  await new Promise(resolve => setTimeout(resolve, 1000))
  await testEndpoint(API_URL_V5, getStartedData, 'Getting Started Form')
  
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Test Assessment form on both endpoints
  console.log('\n\n=== ASSESSMENT FORM TESTS ===')
  await testEndpoint(API_URL_V4, assessmentData, 'Assessment Form')
  await new Promise(resolve => setTimeout(resolve, 1000))
  await testEndpoint(API_URL_V5, assessmentData, 'Assessment Form')
  
  console.log('\n\n📊 EXPECTED RESULTS:')
  console.log('==================')
  console.log('\nV4 Endpoint (broken):')
  console.log('- Getting Started form incorrectly detected as "assessment"')
  console.log('- Contact Source shows "TrueFlow Assessment Form" for both')
  console.log('- Some fields may not populate due to unicode issues')
  
  console.log('\nV5 Endpoint (fixed):')
  console.log('- Getting Started form correctly detected as "get-started"')
  console.log('- Contact Source shows correct form type')
  console.log('- All fields should populate correctly')
  
  console.log('\n\n📍 CHECK IN GOHIGHLEVEL:')
  console.log('========================')
  console.log('1. Look for contacts with firstName starting with "V5TEST"')
  console.log('2. Compare the Contact Source field between V4 and V5 submissions')
  console.log('3. Check these fields are populated for Getting Started:')
  console.log('   ✓ Business Name')
  console.log('   ✓ Business Type (e.g., "Marketing Agency")')
  console.log('   ✓ What are your goals? (content goals)')
  console.log('   ✓ Integration Preferences')
  console.log('   ✓ Selected Plan')
  console.log('   ✓ Lead Score')
  console.log('   ✓ Lead Quality')
  console.log('\n4. Additional fields for Assessment form:')
  console.log('   ✓ Current Content Creation')
  console.log('   ✓ Content Volume')
  console.log('   ✓ CRM Usage')
  console.log('   ✓ Lead Response Time')
  console.log('   ✓ Time on Repetitive Tasks')
  console.log('   ✓ Current revenue range?')
  console.log('   ✓ Assessment Score')
  console.log('   ✓ Readiness Level')
}

// Run the tests
runTests().catch(console.error)