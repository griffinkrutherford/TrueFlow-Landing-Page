/**
 * Debug why GHL fields aren't being populated
 */

require('dotenv').config({ path: '.env.local' })

const API_URL = 'http://localhost:3001/api/ghl/create-lead-v4'

// Simulate Getting Started form submission
const getStartedData = {
  firstName: 'Debug',
  lastName: 'GetStarted',
  email: 'debug-getstarted@test.com',
  phone: '+1 (555) 999-8888',
  businessName: 'Debug GetStarted Business',
  businessType: 'agency',
  contentGoals: ['newsletters', 'blogs', 'social'],
  integrations: ['gohighlevel', 'mailchimp'],
  selectedPlan: 'complete-system'
}

// Simulate Assessment form submission  
const assessmentData = {
  firstName: 'Debug',
  lastName: 'Assessment',
  email: 'debug-assessment@test.com',
  phone: '+1 (555) 999-7777',
  businessName: 'Debug Assessment Business',
  businessType: 'coach',
  contentGoals: ['courses', 'support'],
  integrations: ['convertkit', 'zapier'],
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
  scorePercentage: 85,
  recommendation: {
    level: 'High',
    recommendation: 'Your business is ready for AI automation'
  }
}

async function testSubmission(data, testName) {
  console.log(`\n📤 Testing ${testName}...`)
  console.log('Data being sent:', JSON.stringify(data, null, 2))
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    
    const result = await response.json()
    
    console.log('\n📥 Response:')
    console.log(`Status: ${response.status}`)
    console.log(`Success: ${result.success}`)
    console.log(`Message: ${result.message}`)
    console.log(`Custom Fields Used: ${result.customFieldsUsed}`)
    console.log(`Lead Score: ${result.leadScore}`)
    console.log(`Lead Quality: ${result.leadQuality}`)
    
    if (result.ghlContactId) {
      console.log(`GHL Contact ID: ${result.ghlContactId}`)
    }
    
    if (result.warning) {
      console.log(`⚠️  Warning: ${result.warning}`)
    }
    
    return result
  } catch (error) {
    console.error(`❌ Error: ${error.message}`)
    return null
  }
}

async function fetchGHLFields() {
  console.log('\n🔍 Fetching actual GHL custom fields...')
  
  const GHL_API_BASE = 'https://services.leadconnectorhq.com'
  const GHL_API_VERSION = '2021-07-28'
  
  try {
    const response = await fetch(
      `${GHL_API_BASE}/locations/${process.env.GHL_LOCATION_ID}/customFields?model=contact`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
          'Version': GHL_API_VERSION,
          'Accept': 'application/json'
        }
      }
    )
    
    if (!response.ok) {
      console.error(`Failed to fetch fields: ${response.status}`)
      return []
    }
    
    const data = await response.json()
    const fields = data.customFields || []
    
    console.log(`\nFound ${fields.length} custom fields:`)
    fields.forEach(field => {
      console.log(`• ${field.name} (ID: ${field.id}, Type: ${field.dataType})`)
    })
    
    return fields
  } catch (error) {
    console.error('Error fetching fields:', error)
    return []
  }
}

async function runDebug() {
  console.log('🐛 GHL Field Population Debugger')
  console.log('================================\n')
  
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
  
  // First, fetch actual GHL fields
  const ghlFields = await fetchGHLFields()
  
  // Test both form types
  console.log('\n\n=== TESTING FORM SUBMISSIONS ===')
  
  await testSubmission(getStartedData, 'Getting Started Form')
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  await testSubmission(assessmentData, 'Assessment Form')
  
  console.log('\n\n📌 CHECK IN GOHIGHLEVEL:')
  console.log('1. Look for contacts with firstName "Debug"')
  console.log('2. Compare the "Contact Source" field')
  console.log('3. Check which custom fields are populated')
  console.log('4. Note any fields that are empty but should have data')
}

// Run the debug
runDebug().catch(console.error)