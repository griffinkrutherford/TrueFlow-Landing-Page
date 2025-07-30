#!/usr/bin/env tsx

/**
 * Create Test Contact Using Verbatim Endpoint
 * Demonstrates the enhanced verbatim field mapping
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

async function createVerbatimTestContact() {
  try {
    console.log('🎯 Creating Test Contact Using Verbatim Endpoint')
    console.log('================================================')
    
    // Create test data with verbatim field focus
    const testContactData = {
      // Contact information
      firstName: 'Verbatim',
      lastName: 'Enhanced Test',
      email: `verbatim.enhanced.${Date.now()}@example.com`,
      phone: '+1 (555) 777-8888',
      businessName: 'Verbatim Enhanced Field Test LLC',
      
      // Business profile
      businessType: 'Coach or Consultant',
      contentGoals: ['Email Newsletters', 'Course Content', 'Customer Support'],
      
      // Assessment answers - showing exact form responses
      answers: {
        'current-content': 'outsource',
        'content-volume': 'moderate',
        'crm-usage': 'basic-crm',
        'lead-response': 'hours',
        'time-spent': 'high',
        'budget': 'moderate'
      },
      
      // Assessment detailed answers with exact questions
      assessmentAnswers: [
        {
          questionId: 'current-content',
          category: 'Content Creation',
          question: 'How do you currently create content for your business?',
          answer: 'Outsource to freelancers/agencies',
          score: 2
        },
        {
          questionId: 'content-volume',
          category: 'Content Creation',
          question: 'How much content do you need to produce monthly?',
          answer: '6-20 pieces',
          score: 2
        },
        {
          questionId: 'crm-usage',
          category: 'Customer Management',
          question: 'How do you currently manage customer relationships?',
          answer: 'Basic CRM system',
          score: 2
        },
        {
          questionId: 'lead-response',
          category: 'Customer Management',
          question: 'How quickly do you typically respond to new leads?',
          answer: 'Within 24 hours',
          score: 2
        },
        {
          questionId: 'time-spent',
          category: 'Time Management',
          question: 'How much time do you spend on repetitive tasks weekly?',
          answer: '15-30 hours',
          score: 2
        },
        {
          questionId: 'budget',
          category: 'Investment',
          question: 'What\'s your monthly budget for content and customer management?',
          answer: '$500 - $2,000',
          score: 2
        }
      ],
      
      // Scoring results - demonstrating string preservation
      totalScore: 12,
      maxPossibleScore: 24,
      scorePercentage: 50,
      readinessLevel: 'Ready',
      recommendation: 'Complete System',
      
      // Preferences
      integrations: ['ConvertKit', 'ActiveCampaign'],
      selectedPlan: 'Complete System',
      
      // Metadata
      timestamp: new Date().toISOString(),
      assessmentVersion: '2.0',
      source: 'readiness-assessment'
    }

    console.log('📋 Verbatim Test Contact Details:')
    console.log(`Name: ${testContactData.firstName} ${testContactData.lastName}`)
    console.log(`Email: ${testContactData.email}`)
    console.log(`Business: ${testContactData.businessName}`)
    console.log(`Type: ${testContactData.businessType}`)
    console.log(`Score: ${testContactData.scorePercentage}% (${testContactData.readinessLevel})`)
    console.log(`Plan: ${testContactData.selectedPlan}`)
    console.log('')

    console.log('🚀 Sending to /api/ghl/create-lead-complete endpoint...')
    console.log('This endpoint uses the enhanced field mapping system.')
    console.log('')
    
    const response = await fetch('http://localhost:3001/api/ghl/create-lead-complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testContactData)
    })

    console.log(`📡 API Response: ${response.status} ${response.statusText}`)
    
    if (!response.ok) {
      const errorData = await response.text()
      console.error('❌ API Error:', errorData)
      return
    }

    const result = await response.json()
    console.log('✅ API Response:', JSON.stringify(result, null, 2))
    
    if (result.success && result.contactId) {
      console.log('')
      console.log('🎉 VERBATIM TEST CONTACT CREATED SUCCESSFULLY!')
      console.log('==============================================')
      console.log(`✅ Contact ID: ${result.contactId}`)
      console.log(`✅ Lead Score: ${result.leadScore}`)
      console.log(`✅ Lead Quality: ${result.leadQuality}`)
      console.log(`✅ Custom Fields: ${result.customFieldsCount}`)
      console.log(`✅ Tags Applied: ${result.tags?.length || result.tagsUsed}`)
      console.log('')
      
      // Wait a moment then verify the contact
      console.log('🔍 Verifying enhanced field mapping...')
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('')
      console.log('📊 VERBATIM VS STANDARD COMPARISON:')
      console.log('===================================')
      console.log('Standard Endpoint (create-lead-v5):')
      console.log('- Uses abbreviated field names')
      console.log('- Limited field coverage (7-10 fields)')
      console.log('- Basic mapping')
      console.log('')
      console.log('Verbatim Endpoint (create-lead-complete):')
      console.log('- Attempts to create fields with exact question text')
      console.log('- Complete field coverage (14+ fields)')
      console.log('- Enhanced mapping with full assessment data')
      console.log('')
      console.log('🔗 GoHighLevel Links:')
      console.log(`📋 Contact: https://app.gohighlevel.com/v2/location/${process.env.GHL_LOCATION_ID}/contacts/detail/${result.contactId}`)
      console.log(`🗂️  All Contacts: https://app.gohighlevel.com/location/${process.env.GHL_LOCATION_ID}/contacts/all`)
      console.log('')
      console.log('📋 To verify enhanced fields, run:')
      console.log(`npx tsx scripts/verify-form-fields.ts ${result.contactId}`)
      
      return result.contactId
    } else {
      console.log('❌ Contact creation failed:', result)
    }
    
  } catch (error) {
    console.error('❌ Error creating verbatim test contact:', error)
  }
}

createVerbatimTestContact()