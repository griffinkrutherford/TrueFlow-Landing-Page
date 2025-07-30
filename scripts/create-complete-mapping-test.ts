#!/usr/bin/env tsx

/**
 * Create Test Contact with Complete Field Mapping
 * Demonstrates ALL fields being mapped with minimal tagging
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

async function createCompleteTestContact() {
  try {
    console.log('🎯 Creating Test Contact with Complete Field Mapping')
    console.log('===================================================')
    console.log('This test will ensure ALL form fields are mapped to custom fields')
    console.log('and uses minimal tags as requested.')
    console.log('')
    
    // Create comprehensive test data with ALL fields
    const testContactData = {
      // Contact information
      firstName: 'Complete',
      lastName: 'Field Test',
      email: `complete.fields.${Date.now()}@example.com`,
      phone: '+1 (555) 444-5555',
      businessName: 'Complete Field Mapping Test Company',
      
      // Business profile
      businessType: 'Marketing Agency',
      contentGoals: ['Email Newsletters', 'Blog Posts', 'Social Media Content', 'Sales Materials'],
      
      // All assessment answers - COMPLETE coverage
      answers: {
        'current-content': 'mixed',
        'content-volume': 'high',
        'crm-usage': 'advanced-crm',
        'lead-response': 'quick',
        'time-spent': 'moderate',
        'budget': 'high'
      },
      
      // Get Started specific fields
      teamSize: '11-25',
      monthlyLeads: '101-500',
      currentTools: ['HubSpot', 'Salesforce', 'Mailchimp', 'Zapier'],
      biggestChallenge: 'Scaling Operations',
      
      // Additional fields
      integrations: ['GoHighLevel', 'HubSpot', 'Mailchimp', 'Zapier'],
      additionalNotes: 'This is a test contact demonstrating complete field mapping with all assessment questions, business data, and metadata preserved as custom fields instead of tags.',
      
      // Detailed assessment answers for context
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
          questionId: 'crm-usage',
          category: 'Customer Management',
          question: 'How do you currently manage customer relationships?',
          answer: 'Advanced CRM with automation',
          score: 3
        },
        {
          questionId: 'lead-response',
          category: 'Customer Management',
          question: 'How quickly do you typically respond to new leads?',
          answer: 'Within a few hours',
          score: 3
        },
        {
          questionId: 'time-spent',
          category: 'Time Management',
          question: 'How much time do you spend on repetitive tasks weekly?',
          answer: '5-15 hours',
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
      
      // Scoring results
      totalScore: 19,
      maxPossibleScore: 24,
      scorePercentage: 79,
      readinessLevel: 'Highly Ready',
      recommendation: 'Complete System',
      
      // Plan selection
      selectedPlan: 'Complete System',
      
      // Metadata
      timestamp: new Date().toISOString(),
      assessmentVersion: '2.0',
      source: 'readiness-assessment'
    }

    console.log('📋 Complete Test Contact Details:')
    console.log(`Name: ${testContactData.firstName} ${testContactData.lastName}`)
    console.log(`Email: ${testContactData.email}`)
    console.log(`Business: ${testContactData.businessName}`)
    console.log(`Type: ${testContactData.businessType}`)
    console.log(`Score: ${testContactData.scorePercentage}% (${testContactData.readinessLevel})`)
    console.log(`Plan: ${testContactData.selectedPlan}`)
    console.log('')
    console.log('📊 Fields to be mapped:')
    console.log('- All 6 assessment questions ✅')
    console.log('- Business profile fields ✅')
    console.log('- Get Started form fields ✅')
    console.log('- Integration preferences ✅')
    console.log('- Scoring and recommendations ✅')
    console.log('- Metadata and notes ✅')
    console.log('')

    console.log('🚀 Sending to enhanced /api/ghl/create-lead-complete endpoint...')
    
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
    
    if (result.success && result.ghlContactId) {
      console.log('')
      console.log('🎉 COMPLETE MAPPING TEST CONTACT CREATED!')
      console.log('=========================================')
      console.log(`✅ Contact ID: ${result.ghlContactId}`)
      console.log(`✅ Lead Score: ${result.leadScore}`)
      console.log(`✅ Lead Quality: ${result.leadQuality}`)
      console.log(`✅ Custom Fields Used: ${result.customFieldsUsed}`)
      console.log(`✅ Tags Used: ${result.tagsUsed} (minimal as requested)`)
      console.log(`✅ Fields Available: ${result.fieldsEnsured}`)
      console.log('')
      
      // Wait and verify
      console.log('🔍 Waiting to verify complete field mapping...')
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      console.log('')
      console.log('📊 EXPECTED IMPROVEMENTS:')
      console.log('========================')
      console.log('✅ ALL assessment questions mapped as individual fields')
      console.log('✅ Business data preserved in fields (not tags)')
      console.log('✅ Integration preferences stored as field')
      console.log('✅ Complete scoring data in fields')
      console.log('✅ Minimal tags (only "web-lead" and form type)')
      console.log('')
      console.log('🔍 CHECK THE CONTACT IN GOHIGHLEVEL:')
      console.log('====================================')
      console.log(`📋 Contact URL: https://app.gohighlevel.com/v2/location/${process.env.GHL_LOCATION_ID}/contacts/detail/${result.ghlContactId}`)
      console.log('')
      console.log('You should see:')
      console.log('- Current Content Creation Method: mixed')
      console.log('- Monthly Content Volume: high')
      console.log('- CRM Usage Level: advanced-crm')
      console.log('- Lead Response Time: quick')
      console.log('- Weekly Time on Repetitive Tasks: moderate')
      console.log('- Monthly Budget Range: high')
      console.log('- Integration Preferences: GoHighLevel, HubSpot, Mailchimp, Zapier')
      console.log('- And many more fields with complete data!')
      console.log('')
      console.log('📋 To verify all fields, run:')
      console.log(`npx tsx scripts/verify-form-fields.ts ${result.ghlContactId}`)
      
      return result.ghlContactId
    } else {
      console.log('❌ Contact creation failed:', result)
    }
    
  } catch (error) {
    console.error('❌ Error creating complete test contact:', error)
  }
}

createCompleteTestContact()