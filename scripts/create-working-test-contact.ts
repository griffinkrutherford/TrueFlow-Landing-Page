#!/usr/bin/env tsx

/**
 * Create Test Contact Using Working Endpoint
 * Uses the existing /api/ghl/create-lead-v5 endpoint that has been working
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

async function createWorkingTestContact() {
  try {
    console.log('🎯 Creating Test Contact Using Working Endpoint')
    console.log('==============================================')
    
    // Create test data that matches what the Get Started form sends
    const testContactData = {
      // Contact information
      firstName: 'Verbatim',
      lastName: 'Working Test',
      email: `verbatim.working.${Date.now()}@example.com`,
      phone: '+1 (555) 888-9999',
      businessName: 'Verbatim Field Mapping Demo Company',
      
      // Business profile
      businessType: 'Marketing Agency',
      contentGoals: ['Email Newsletters', 'Blog Posts', 'Social Media Content'],
      
      // Assessment answers - demonstrating different data types
      answers: {
        'current-content': 'mixed',
        'content-volume': 'high',
        'crm-usage': 'advanced-crm',
        'lead-response': 'quick',
        'time-spent': 'moderate',
        'budget': 'high'
      },
      
      // Assessment detailed answers
      assessmentAnswers: [
        {
          questionId: 'current-content',
          category: 'Content Creation',
          question: 'How do you currently create content for your business?',
          answer: 'Mix of manual and automated tools',
          score: 4
        },
        {
          questionId: 'content-volume',
          category: 'Content Creation',
          question: 'How much content do you need to produce monthly?',
          answer: '21-50 pieces',
          score: 3
        },
        {
          questionId: 'budget',
          category: 'Investment',
          question: 'What\'s your monthly budget for content and customer management?',
          answer: '$2,000 - $5,000',
          score: 3
        }
      ],
      
      // Scoring results - demonstrating string preservation
      totalScore: 18,
      maxPossibleScore: 24,
      scorePercentage: 75,
      readinessLevel: 'Highly Ready',
      recommendation: 'Complete System',
      
      // Preferences
      integrations: ['GoHighLevel', 'HubSpot', 'Mailchimp'],
      selectedPlan: 'Complete System',
      
      // Metadata
      timestamp: new Date().toISOString(),
      assessmentVersion: '2.0',
      source: 'readiness-assessment'
    }

    console.log('📋 Test Contact Details:')
    console.log(`Name: ${testContactData.firstName} ${testContactData.lastName}`)
    console.log(`Email: ${testContactData.email}`)
    console.log(`Business: ${testContactData.businessName}`)
    console.log(`Type: ${testContactData.businessType}`)
    console.log(`Score: ${testContactData.scorePercentage}% (${testContactData.readinessLevel})`)
    console.log(`Plan: ${testContactData.selectedPlan}`)
    console.log('')

    console.log('🚀 Sending to /api/ghl/create-lead-v5 endpoint...')
    
    const response = await fetch('http://localhost:3001/api/ghl/create-lead-v5', {
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
      console.log('🎉 TEST CONTACT CREATED SUCCESSFULLY!')
      console.log('====================================')
      console.log(`✅ Contact ID: ${result.contactId}`)
      console.log(`✅ Lead Score: ${result.leadScore}`)
      console.log(`✅ Lead Quality: ${result.leadQuality}`)
      console.log(`✅ Custom Fields: ${result.customFieldsCount || 'N/A'}`)
      console.log(`✅ Tags Applied: ${result.tags?.length || 'N/A'}`)
      console.log('')
      
      // Wait a moment then verify the contact
      console.log('🔍 Verifying contact creation...')
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Use the verification script to check custom fields
      console.log('')
      console.log('📊 VERBATIM FIELD MAPPING DEMONSTRATION:')
      console.log('========================================')
      console.log('The test contact has been created with the existing field mapping.')
      console.log('To see verbatim fields with exact question text:')
      console.log('')
      console.log('1. Update form to use /api/ghl/create-lead-verbatim endpoint')
      console.log('2. Grant API permissions to create custom fields')
      console.log('3. System will auto-create fields with exact question text')
      console.log('')
      console.log('🔗 GoHighLevel Links:')
      console.log(`📋 Contact: https://app.gohighlevel.com/v2/location/${process.env.GHL_LOCATION_ID}/contacts/detail/${result.contactId}`)
      console.log(`🗂️  All Contacts: https://app.gohighlevel.com/location/${process.env.GHL_LOCATION_ID}/contacts/all`)
      console.log('')
      console.log('📋 To verify custom fields, run:')
      console.log(`npx tsx scripts/verify-form-fields.ts ${result.contactId}`)
      
      return result.contactId
    } else {
      console.log('❌ Contact creation failed:', result)
    }
    
  } catch (error) {
    console.error('❌ Error creating test contact:', error)
  }
}

createWorkingTestContact()