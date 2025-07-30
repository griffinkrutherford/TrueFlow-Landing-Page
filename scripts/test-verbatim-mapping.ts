#!/usr/bin/env tsx

/**
 * Test Verbatim Field Mapping System
 * Tests the new verbatim field creation with exact form questions
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

async function testVerbatimMapping() {
  try {
    console.log('🧪 Testing Verbatim Field Mapping System')
    console.log('=======================================\n')
    
    // Test data that matches EXACTLY what the Get Started form sends
    const testLeadData = {
      // Contact information (exact form fields)
      firstName: 'Verbatim',
      lastName: 'Test User',
      email: 'verbatim.test@example.com',
      phone: '+1 (555) 123-4567',
      businessName: 'Verbatim Test Company LLC',
      
      // Business profile (exact selections from form)
      businessType: 'Marketing Agency',
      contentGoals: ['Email Newsletters', 'Blog Posts', 'Social Media Content'],
      
      // Assessment answers (exact question IDs and responses from form)
      answers: {
        'current-content': 'manual',
        'content-volume': 'moderate', 
        'crm-usage': 'basic-crm',
        'lead-response': 'hours',
        'time-spent': 'high',
        'budget': 'high'
      },
      
      // Assessment detailed answers (exact structure from form)
      assessmentAnswers: [
        {
          questionId: 'current-content',
          category: 'Content Creation',
          question: 'How do you currently create content for your business?',
          answer: 'Manually write everything',
          score: 1
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
          answer: '$2,000 - $5,000',
          score: 3
        }
      ],
      
      // Scoring results (preserved as exact values)
      totalScore: 12,
      maxPossibleScore: 24,
      scorePercentage: 50,
      readinessLevel: 'Ready',
      recommendation: 'Complete System',
      
      // Preferences (exact from form)
      integrations: ['GoHighLevel', 'Mailchimp', 'HubSpot'],
      selectedPlan: 'Complete System',
      
      // Metadata (exact structure)
      timestamp: new Date().toISOString(),
      assessmentVersion: '2.0',
      source: 'readiness-assessment'
    }

    console.log('📋 Test Lead Data:')
    console.log('==================')
    console.log(`Name: ${testLeadData.firstName} ${testLeadData.lastName}`)
    console.log(`Email: ${testLeadData.email}`)
    console.log(`Business: ${testLeadData.businessName}`)
    console.log(`Type: ${testLeadData.businessType}`)
    console.log(`Content Goals: ${testLeadData.contentGoals.join(', ')}`)
    console.log(`Assessment Score: ${testLeadData.scorePercentage}% (${testLeadData.totalScore}/${testLeadData.maxPossibleScore})`)
    console.log(`Readiness: ${testLeadData.readinessLevel}`)
    console.log(`Plan: ${testLeadData.selectedPlan}`)
    console.log(`Integrations: ${testLeadData.integrations.join(', ')}`)
    console.log('')

    // Test the verbatim API endpoint
    console.log('🚀 Testing Verbatim API Endpoint...')
    console.log('===================================')
    
    const apiUrl = 'http://localhost:3001/api/ghl/create-lead-verbatim'
    console.log(`API URL: ${apiUrl}`)
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testLeadData)
    })

    console.log(`Response Status: ${response.status}`)
    console.log(`Response OK: ${response.ok}`)
    
    if (!response.ok) {
      const errorData = await response.text()
      console.error('❌ API Error Response:', errorData)
      return
    }

    const result = await response.json()
    console.log('✅ API Response:', JSON.stringify(result, null, 2))
    
    if (result.success && result.contactId) {
      console.log('')
      console.log('🎉 VERBATIM MAPPING TEST SUCCESSFUL!')
      console.log('====================================')
      console.log(`✅ Contact ID: ${result.contactId}`)
      console.log(`✅ Custom Fields Mapped: ${result.summary.customFieldsCreated}`)
      console.log(`✅ Total Verbatim Fields: ${result.summary.verbatimFieldsTotal}`)
      console.log(`✅ Lead Score: ${result.summary.leadScore}`)
      console.log(`✅ Lead Quality: ${result.summary.leadQuality}`)
      console.log(`✅ Tags Applied: ${result.summary.tags}`)
      console.log(`✅ Field Mapping Version: ${result.summary.fieldMappingVersion}`)
      
      // Verify the contact was created with verbatim fields
      console.log('')
      console.log('🔍 Verifying Verbatim Fields in GoHighLevel...')
      console.log('===============================================')
      
      const contactResponse = await fetch(`https://services.leadconnectorhq.com/contacts/${result.contactId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'Version': '2021-07-28'
        }
      })
      
      if (contactResponse.ok) {
        const contactData = await contactResponse.json()
        const contact = contactData.contact
        
        console.log(`📋 Contact: ${contact.firstName} ${contact.lastName}`)
        console.log(`📧 Email: ${contact.email}`)
        console.log(`🏢 Company: ${contact.companyName}`)
        console.log(`🏷️  Tags: ${contact.tags.join(', ')}`)
        console.log(`📊 Custom Fields: ${contact.customFields?.length || 0}`)
        
        if (contact.customFields && contact.customFields.length > 0) {
          console.log('')
          console.log('📊 VERBATIM CUSTOM FIELDS VERIFICATION:')
          console.log('======================================')
          
          // Get field definitions for mapping
          const fieldsResponse = await fetch(`https://services.leadconnectorhq.com/locations/${process.env.GHL_LOCATION_ID}/customFields?model=contact`, {
            headers: {
              'Authorization': `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
              'Content-Type': 'application/json',
              'Version': '2021-07-28'
            }
          })
          
          const fieldsData = await fieldsResponse.json()
          const fieldMap = new Map()
          fieldsData.customFields.forEach((field: any) => {
            fieldMap.set(field.id, field)
          })
          
          let verbatimFieldsFound = 0
          
          contact.customFields.forEach((cf: any) => {
            const field = fieldMap.get(cf.id)
            if (field) {
              let value = cf.value
              
              // Format array values for display
              if (Array.isArray(value)) {
                value = value.join(', ')
              }
              
              // Format JSON strings
              if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
                try {
                  const parsed = JSON.parse(value)
                  value = Array.isArray(parsed) ? parsed.join(', ') : value
                } catch (e) {
                  // Keep original value if parsing fails
                }
              }
              
              console.log(`✅ ${field.name}`)
              console.log(`   Value: "${value}"`)
              console.log(`   Type: ${field.dataType}`)
              console.log('')
              verbatimFieldsFound++
            }
          })
          
          console.log('📈 VERBATIM MAPPING SUMMARY:')
          console.log('============================')
          console.log(`✅ Verbatim Fields Found: ${verbatimFieldsFound}`)
          console.log(`📋 Total Custom Fields: ${contact.customFields.length}`)
          console.log(`🎯 Success Rate: ${Math.round(verbatimFieldsFound/contact.customFields.length*100)}%`)
          
          if (verbatimFieldsFound >= 15) {
            console.log('🎉 EXCELLENT! Verbatim field mapping is working perfectly!')
          } else if (verbatimFieldsFound >= 10) {
            console.log('✅ GOOD! Most verbatim fields are mapped correctly.')
          } else {
            console.log('⚠️  Some verbatim fields may be missing. Check the field creation process.')
          }
        }
      }
      
    } else {
      console.log('❌ Test failed - no contact ID returned')
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error)
  }
}

testVerbatimMapping()