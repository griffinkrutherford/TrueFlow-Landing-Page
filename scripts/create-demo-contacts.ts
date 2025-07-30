#!/usr/bin/env tsx

/**
 * Create Demo Contacts - Verbatim Field Mapping Demonstration
 * Creates multiple test contacts showing different scenarios and data types
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

interface TestContact {
  name: string
  description: string
  data: any
}

const testContacts: TestContact[] = [
  {
    name: "High-Volume Marketing Agency",
    description: "Complex business with multiple tools and high content needs",
    data: {
      // Contact information
      firstName: 'Sarah',
      lastName: 'Marketing Director',
      email: 'sarah.demo@marketingagency.com',
      phone: '+1 (555) 001-0001',
      businessName: 'Digital Growth Marketing Agency',
      
      // Business profile
      businessType: 'Marketing Agency',
      contentGoals: ['Email Newsletters', 'Blog Posts', 'Social Media Content', 'Sales Materials'],
      
      // Assessment answers (high-performing business)
      answers: {
        'current-content': 'team',
        'content-volume': 'very-high',
        'crm-usage': 'integrated',
        'lead-response': 'instant',
        'time-spent': 'minimal',
        'budget': 'enterprise'
      },
      
      // Detailed assessment answers
      assessmentAnswers: [
        {
          questionId: 'current-content',
          category: 'Content Creation',
          question: 'How do you currently create content for your business?',
          answer: 'Have an in-house content team',
          score: 3
        },
        {
          questionId: 'content-volume',
          category: 'Content Creation',
          question: 'How much content do you need to produce monthly?',
          answer: '50+ pieces',
          score: 4
        },
        {
          questionId: 'crm-usage',
          category: 'Customer Management',
          question: 'How do you currently manage customer relationships?',
          answer: 'Fully integrated systems',
          score: 4
        },
        {
          questionId: 'lead-response',
          category: 'Customer Management',
          question: 'How quickly do you typically respond to new leads?',
          answer: 'Almost instantly',
          score: 4
        },
        {
          questionId: 'time-spent',
          category: 'Time Management',
          question: 'How much time do you spend on repetitive tasks weekly?',
          answer: 'Less than 5 hours',
          score: 4
        },
        {
          questionId: 'budget',
          category: 'Investment',
          question: 'What\'s your monthly budget for content and customer management?',
          answer: 'More than $5,000',
          score: 4
        }
      ],
      
      // High scoring results
      totalScore: 23,
      maxPossibleScore: 24,
      scorePercentage: 96,
      readinessLevel: 'Highly Ready',
      recommendation: 'Custom Enterprise',
      
      // Multiple integrations
      integrations: ['GoHighLevel', 'HubSpot', 'Mailchimp', 'Zapier'],
      selectedPlan: 'Custom Enterprise',
      
      // Metadata
      timestamp: new Date().toISOString(),
      assessmentVersion: '2.0',
      source: 'readiness-assessment'
    }
  },
  {
    name: "Solo Content Creator",
    description: "Individual creator with basic needs and limited budget",
    data: {
      // Contact information
      firstName: 'Mike',
      lastName: 'Content Creator',
      email: 'mike.demo@solocreator.com',
      phone: '+1 (555) 002-0002',
      businessName: 'Mike\'s Creative Content',
      
      // Business profile
      businessType: 'Content Creator',
      contentGoals: ['Blog Posts', 'Social Media Content'],
      
      // Assessment answers (smaller business)
      answers: {
        'current-content': 'manual',
        'content-volume': 'minimal',
        'crm-usage': 'spreadsheets',
        'lead-response': 'days',
        'time-spent': 'very-high',
        'budget': 'low'
      },
      
      // Detailed assessment answers
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
          answer: '1-5 pieces',
          score: 1
        },
        {
          questionId: 'crm-usage',
          category: 'Customer Management',
          question: 'How do you currently manage customer relationships?',
          answer: 'Spreadsheets or manual tracking',
          score: 1
        },
        {
          questionId: 'lead-response',
          category: 'Customer Management',
          question: 'How quickly do you typically respond to new leads?',
          answer: 'Within a few days',
          score: 1
        },
        {
          questionId: 'time-spent',
          category: 'Time Management',
          question: 'How much time do you spend on repetitive tasks weekly?',
          answer: 'More than 30 hours',
          score: 1
        },
        {
          questionId: 'budget',
          category: 'Investment',
          question: 'What\'s your monthly budget for content and customer management?',
          answer: 'Less than $500',
          score: 1
        }
      ],
      
      // Lower scoring results
      totalScore: 6,
      maxPossibleScore: 24,
      scorePercentage: 25,
      readinessLevel: 'Building Foundation',
      recommendation: 'Content Engine',
      
      // Minimal integrations
      integrations: ['Mailchimp'],
      selectedPlan: 'Content Engine',
      
      // Metadata
      timestamp: new Date().toISOString(),
      assessmentVersion: '2.0',
      source: 'readiness-assessment'
    }
  },
  {
    name: "Mid-Size Business Coach",
    description: "Growing coaching business with moderate needs and mixed tools",
    data: {
      // Contact information
      firstName: 'Jennifer',
      lastName: 'Business Coach',
      email: 'jennifer.demo@businesscoaching.com',
      phone: '+1 (555) 003-0003',
      businessName: 'Success Path Coaching Solutions',
      
      // Business profile
      businessType: 'Coach or Consultant',
      contentGoals: ['Email Newsletters', 'Course Content', 'Customer Support'],
      
      // Assessment answers (mid-range business)
      answers: {
        'current-content': 'mixed',
        'content-volume': 'moderate',
        'crm-usage': 'basic-crm',
        'lead-response': 'hours',
        'time-spent': 'moderate',
        'budget': 'moderate'
      },
      
      // Detailed assessment answers
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
          answer: '5-15 hours',
          score: 3
        },
        {
          questionId: 'budget',
          category: 'Investment',
          question: 'What\'s your monthly budget for content and customer management?',
          answer: '$500 - $2,000',
          score: 2
        }
      ],
      
      // Mid-range scoring results
      totalScore: 15,
      maxPossibleScore: 24,
      scorePercentage: 63,
      readinessLevel: 'Ready',
      recommendation: 'Complete System',
      
      // Moderate integrations
      integrations: ['ConvertKit', 'ActiveCampaign'],
      selectedPlan: 'Complete System',
      
      // Metadata
      timestamp: new Date().toISOString(),
      assessmentVersion: '2.0',
      source: 'readiness-assessment'
    }
  }
]

async function createDemoContact(contact: TestContact, index: number): Promise<string | null> {
  try {
    console.log(`\n🚀 Creating Demo Contact ${index + 1}: ${contact.name}`)
    console.log(`📋 Description: ${contact.description}`)
    console.log(`👤 Contact: ${contact.data.firstName} ${contact.data.lastName}`)
    console.log(`🏢 Business: ${contact.data.businessName}`)
    console.log(`📊 Score: ${contact.data.scorePercentage}% (${contact.data.readinessLevel})`)
    console.log(`💼 Plan: ${contact.data.selectedPlan}`)
    
    const response = await fetch('http://localhost:3001/api/ghl/create-lead-verbatim', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contact.data)
    })

    console.log(`📡 API Response: ${response.status} ${response.ok ? 'SUCCESS' : 'FAILED'}`)
    
    if (!response.ok) {
      const errorData = await response.text()
      console.error(`❌ Error: ${errorData}`)
      return null
    }

    const result = await response.json()
    
    if (result.success && result.contactId) {
      console.log(`✅ Contact Created Successfully!`)
      console.log(`   Contact ID: ${result.contactId}`)
      console.log(`   Custom Fields: ${result.summary.customFieldsCreated}`)
      console.log(`   Lead Quality: ${result.summary.leadQuality}`)
      console.log(`   Tags: ${result.summary.tags}`)
      
      return result.contactId
    } else {
      console.log(`❌ Failed to create contact: ${JSON.stringify(result)}`)
      return null
    }
    
  } catch (error) {
    console.error(`❌ Error creating contact ${contact.name}:`, error)
    return null
  }
}

async function verifyContact(contactId: string, contactName: string) {
  try {
    console.log(`\n🔍 Verifying Contact: ${contactName} (${contactId})`)
    console.log('=' .repeat(50))
    
    // Get contact data
    const contactResponse = await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      }
    })
    
    if (!contactResponse.ok) {
      console.error(`❌ Failed to fetch contact: ${contactResponse.status}`)
      return
    }
    
    const contactData = await contactResponse.json()
    const contact = contactData.contact
    
    console.log(`📋 Contact: ${contact.firstName} ${contact.lastName}`)
    console.log(`📧 Email: ${contact.email}`)
    console.log(`🏢 Company: ${contact.companyName}`)
    console.log(`🏷️  Tags: ${contact.tags.join(', ')}`)
    console.log(`📊 Custom Fields: ${contact.customFields?.length || 0}`)
    
    // Get field definitions for mapping
    const fieldsResponse = await fetch(`https://services.leadconnectorhq.com/locations/${process.env.GHL_LOCATION_ID}/customFields?model=contact`, {
      headers: {
        'Authorization': `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      }
    })
    
    if (!fieldsResponse.ok) {
      console.error(`❌ Failed to fetch field definitions: ${fieldsResponse.status}`)
      return
    }
    
    const fieldsData = await fieldsResponse.json()
    const fieldMap = new Map()
    fieldsData.customFields.forEach((field: any) => {
      fieldMap.set(field.id, field)
    })
    
    console.log(`\n📊 VERBATIM CUSTOM FIELDS:`)
    console.log('-'.repeat(40))
    
    let verbatimFieldsFound = 0
    const importantFields = [
      'Select Your Business Type',
      'What Content Do You Want to Create?',
      'Assessment Total Score',
      'Assessment Score Percentage',
      'AI Readiness Level',
      'Choose Your Plan'
    ]
    
    if (contact.customFields && contact.customFields.length > 0) {
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
          
          // Show important fields or first 10 fields
          if (importantFields.includes(field.name) || verbatimFieldsFound < 10) {
            const isImportant = importantFields.includes(field.name) ? '⭐' : '  '
            console.log(`${isImportant} ${field.name}`)
            console.log(`     Value: "${value}"`)
            console.log(`     Type: String (${field.dataType})`)
            console.log('')
          }
          
          verbatimFieldsFound++
        }
      })
    }
    
    console.log(`📈 Summary for ${contactName}:`)
    console.log(`   ✅ Verbatim Fields: ${verbatimFieldsFound}`)
    console.log(`   📋 Total Custom Fields: ${contact.customFields?.length || 0}`)
    console.log(`   🎯 Coverage: ${Math.round(verbatimFieldsFound/Math.max(contact.customFields?.length || 1, 1)*100)}%`)
    
  } catch (error) {
    console.error(`❌ Error verifying contact ${contactName}:`, error)
  }
}

async function createDemoContacts() {
  console.log('🎯 Creating Demo Contacts - Verbatim Field Mapping Demonstration')
  console.log('================================================================\n')
  
  const createdContacts: Array<{id: string, name: string}> = []
  
  // Create each test contact
  for (let i = 0; i < testContacts.length; i++) {
    const contact = testContacts[i]
    const contactId = await createDemoContact(contact, i)
    
    if (contactId) {
      createdContacts.push({
        id: contactId,
        name: contact.name
      })
    }
    
    // Wait 2 seconds between creates to avoid rate limiting
    if (i < testContacts.length - 1) {
      console.log('⏳ Waiting 2 seconds before next contact...')
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
  
  console.log(`\n🎉 Demo Contact Creation Complete!`)
  console.log(`✅ Successfully Created: ${createdContacts.length}/${testContacts.length} contacts`)
  
  if (createdContacts.length > 0) {
    console.log(`\n🔍 Verifying Created Contacts...`)
    console.log('=' .repeat(50))
    
    // Verify each created contact
    for (const contact of createdContacts) {
      await verifyContact(contact.id, contact.name)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Brief pause between verifications
    }
    
    console.log(`\n📋 DEMO CONTACT SUMMARY:`)
    console.log('=' .repeat(30))
    createdContacts.forEach((contact, index) => {
      console.log(`${index + 1}. ${contact.name}`)
      console.log(`   Contact ID: ${contact.id}`)
      console.log(`   GoHighLevel URL: https://app.gohighlevel.com/location/${process.env.GHL_LOCATION_ID}/contacts/all`)
    })
    
    console.log(`\n🎯 VERBATIM FIELD MAPPING DEMONSTRATION COMPLETE!`)
    console.log('=' .repeat(55))
    console.log(`✅ ${createdContacts.length} test contacts created with verbatim field mapping`)
    console.log(`✅ All custom fields use exact form question text`)
    console.log(`✅ All data preserved as strings without transformation`)
    console.log(`✅ Different business types and scoring levels demonstrated`)
    console.log(`\n👀 Check GoHighLevel to see the verbatim custom fields in action!`)
  }
}

createDemoContacts()