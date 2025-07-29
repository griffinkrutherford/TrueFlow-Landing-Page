#!/usr/bin/env node

const http = require('http')

console.log('\n🧪 Testing TrueFlow V2 API with Custom Fields\n')
console.log('============================================\n')

// Test data for assessment form
const assessmentData = {
  firstName: 'Test',
  lastName: 'Assessment',
  email: 'test-assessment@example.com',
  phone: '555-0123',
  businessName: 'Test Business Inc',
  score: 85,
  recommendation: 'Professional',
  answers: {
    'marketing_goals': 'Increase brand awareness',
    'current_challenges': 'Limited resources',
    'budget': 'high',
    'timeline': 'immediate',
    'decision-maker': 'yes'
  },
  timestamp: new Date().toISOString()
}

// Test data for get-started form
const getStartedData = {
  firstName: 'Test',
  lastName: 'GetStarted',
  email: 'test-getstarted@example.com',
  phone: '555-0124',
  businessName: 'Growth Company LLC',
  businessType: 'SaaS',
  contentGoals: ['Blog posts', 'Social media', 'Email campaigns'],
  monthlyLeads: '100+',
  teamSize: '10+',
  currentTools: ['HubSpot', 'Slack', 'Google Analytics'],
  biggestChallenge: 'Scaling content production efficiently',
  pricingPlan: 'growth',
  timestamp: new Date().toISOString()
}

function testAPI(path, data, testName) {
  return new Promise((resolve) => {
    console.log(`📋 ${testName}`)
    console.log('─'.repeat(40))
    
    const postData = JSON.stringify(data)
    
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }
    
    const req = http.request(options, (res) => {
      let responseData = ''
      
      res.on('data', (chunk) => {
        responseData += chunk
      })
      
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`)
        
        try {
          const result = JSON.parse(responseData)
          
          if (result.success) {
            console.log('✅ SUCCESS')
            console.log('Message:', result.message)
            if (result.ghlContactId) {
              console.log('GHL Contact ID:', result.ghlContactId)
            }
            if (result.warning) {
              console.log('⚠️  Warning:', result.warning)
            }
          } else {
            console.log('❌ FAILED')
            console.log('Error:', result.message)
            if (result.error) {
              console.log('Details:', JSON.stringify(result.error, null, 2))
            }
          }
        } catch (e) {
          console.log('Raw response:', responseData)
          console.log('❌ FAILED - Invalid JSON response')
        }
        
        console.log('\n')
        resolve()
      })
    })
    
    req.on('error', (e) => {
      console.error('❌ Request error:', e.message)
      console.log('\n')
      resolve()
    })
    
    req.setTimeout(30000, () => {
      console.error('❌ Request timeout after 30 seconds')
      req.destroy()
      resolve()
    })
    
    req.write(postData)
    req.end()
  })
}

async function runTests() {
  // Test assessment form
  await testAPI('/api/ghl/create-lead-v2', assessmentData, 'Test 1: Assessment Form Submission')
  
  // Wait a bit between tests
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Test get-started form
  await testAPI('/api/ghl/create-lead-v2', getStartedData, 'Test 2: Get Started Form Submission')
  
  console.log('✅ All tests completed!\n')
  console.log('Check your email at griffin@trueflow.ai for notifications')
  console.log('If GHL is configured, check for custom fields in your contacts')
}

// Check if server is running
const healthCheck = () => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3001/', (res) => {
      resolve(res.statusCode === 200)
    })
    req.on('error', () => resolve(false))
    req.setTimeout(5000, () => {
      req.destroy()
      resolve(false)
    })
  })
}

// Main execution
;(async () => {
  console.log('Checking if server is running on port 3001...')
  const isRunning = await healthCheck()
  
  if (isRunning) {
    console.log('✅ Server is running\n')
    await runTests()
  } else {
    console.error('❌ Server is not running on port 3001')
    console.log('Please start the landing page server first:')
    console.log('  cd trueflow-landing-repo && npm run dev\n')
  }
})()