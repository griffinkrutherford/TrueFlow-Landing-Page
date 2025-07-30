#!/usr/bin/env node

/**
 * Test script for GHL V5 API with both get-started and assessment forms
 * Usage: node scripts/test-ghl-v5.js
 */

const fetch = require('node-fetch')

const API_URL = 'http://localhost:3001/api/ghl/create-lead-v5'

// Test data for get-started form
const getStartedData = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  phone: '+1 555-123-4567',
  businessName: 'Test Business LLC',
  businessType: 'Business Owner',
  selectedPlan: 'Content Engine',
  pricingPlan: 'content-engine',
  contentGoals: ['Email Newsletters', 'Blog Posts', 'Social Media Content'],
  integrations: ['GoHighLevel', 'Mailchimp', 'Zapier'],
  monthlyLeads: '50-100',
  teamSize: '5-10',
  currentTools: ['GoHighLevel', 'Mailchimp'],
  biggestChallenge: 'Creating consistent content that converts',
  timestamp: new Date().toISOString()
}

// Test data for assessment form
const assessmentData = {
  firstName: 'Assessment',
  lastName: 'Tester',
  email: 'assessment@example.com',
  businessName: 'Assessment Business Inc',
  businessType: 'Content Creator',
  contentGoals: ['newsletters', 'blogs'],
  answers: {
    'current-content': 'manual',
    'content-volume': 'moderate',
    'crm-usage': 'basic-crm',
    'lead-response': 'hours',
    'time-spent': 'high',
    'budget': 'moderate'
  },
  assessmentAnswers: [
    {
      questionId: 'current-content',
      category: 'Content Creation',
      question: 'How do you currently create content?',
      answer: 'Manually write everything',
      score: 1
    }
  ],
  totalScore: 12,
  maxPossibleScore: 24,
  scorePercentage: 50,
  recommendation: 'You have good potential for automation',
  readinessLevel: 'Moderate',
  selectedPlan: 'Complete System',
  integrations: ['gohighlevel'],
  timestamp: new Date().toISOString(),
  assessmentVersion: '2.0',
  source: 'readiness-assessment'
}

async function testForm(formName, data) {
  console.log(`\n🧪 Testing ${formName} form submission...`)
  console.log('━'.repeat(50))
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    
    const result = await response.json()
    
    if (response.ok) {
      console.log('✅ Success!')
      console.log('Response:', JSON.stringify(result, null, 2))
      
      if (result.formType) {
        console.log(`\n📋 Form Type Detected: ${result.formType}`)
      }
      if (result.leadScore !== undefined) {
        console.log(`📊 Lead Score: ${result.leadScore}`)
      }
      if (result.leadQuality) {
        console.log(`🌡️  Lead Quality: ${result.leadQuality}`)
      }
      if (result.customFieldsUsed !== undefined) {
        console.log(`🔧 Custom Fields Used: ${result.customFieldsUsed}`)
      }
      if (result.tagsUsed !== undefined) {
        console.log(`🏷️  Tags Used: ${result.tagsUsed}`)
      }
    } else {
      console.error('❌ Error:', response.status, response.statusText)
      console.error('Response:', JSON.stringify(result, null, 2))
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message)
  }
}

async function runTests() {
  console.log('🚀 Starting GHL V5 API Tests')
  console.log('API URL:', API_URL)
  console.log('Make sure the landing page server is running on port 3001')
  
  // Test get-started form
  await testForm('Get Started', getStartedData)
  
  // Wait a bit between tests
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Test assessment form
  await testForm('Assessment', assessmentData)
  
  console.log('\n✨ Tests complete!')
}

// Run the tests
runTests().catch(console.error)