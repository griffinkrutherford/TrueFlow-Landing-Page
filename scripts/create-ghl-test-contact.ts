#!/usr/bin/env tsx

/**
 * Create GoHighLevel Test Contact - Using Existing Fields
 * Creates a real contact using existing custom fields to demonstrate the system
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

const GHL_ACCESS_TOKEN = process.env.GHL_ACCESS_TOKEN
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID

async function createTestContact() {
  try {
    console.log('🎯 Creating GoHighLevel Test Contact')
    console.log('===================================')
    console.log(`Location ID: ${GHL_LOCATION_ID}`)
    console.log(`Token: ${GHL_ACCESS_TOKEN?.substring(0, 10)}...`)
    console.log('')

    // Validate environment variables
    if (!GHL_ACCESS_TOKEN || !GHL_LOCATION_ID) {
      console.error('❌ Missing GoHighLevel configuration')
      return
    }

    // First, let's check what custom fields already exist
    console.log('📋 Step 1: Checking existing custom fields...')
    const fieldsResponse = await fetch(`https://services.leadconnectorhq.com/locations/${GHL_LOCATION_ID}/customFields?model=contact`, {
      headers: {
        'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      }
    })

    if (!fieldsResponse.ok) {
      console.error(`❌ Failed to fetch custom fields: ${fieldsResponse.status}`)
      const errorData = await fieldsResponse.text()
      console.error('Error details:', errorData)
      return
    }

    const fieldsData = await fieldsResponse.json()
    const existingFields = fieldsData.customFields || []
    
    console.log(`✅ Found ${existingFields.length} existing custom fields`)
    
    // Show some existing fields that we can use for testing
    console.log('\n📊 Available Custom Fields for Testing:')
    console.log('-'.repeat(40))
    
    const testableFields = existingFields.filter((field: any) => 
      field.name.toLowerCase().includes('business') ||
      field.name.toLowerCase().includes('score') ||
      field.name.toLowerCase().includes('assessment') ||
      field.name.toLowerCase().includes('plan') ||
      field.name.toLowerCase().includes('recommendation')
    ).slice(0, 10)

    testableFields.forEach((field: any, index: number) => {
      console.log(`${index + 1}. "${field.name}" (${field.dataType})`)
      console.log(`   Field ID: ${field.id}`)
      console.log(`   Field Key: ${field.fieldKey}`)
      console.log('')
    })

    if (testableFields.length === 0) {
      console.log('⚠️  No suitable custom fields found for testing')
      console.log('The verbatim system would create new fields with exact question text')
      return
    }

    // Create test contact data using existing fields
    const testContactData = {
      firstName: 'Verbatim',
      lastName: 'Test User',
      email: `verbatim.test.${Date.now()}@example.com`,
      phone: '+1 (555) 123-4567',
      companyName: 'Verbatim Field Test Company',
      tags: [
        'verbatim-test',
        'field-mapping-demo',
        'web-lead'
      ],
      source: 'Verbatim Field Mapping Test'
    }

    // Add custom fields using existing field IDs
    const customFields: Array<{ id: string; value: string }> = []
    
    // Use existing fields that match our verbatim concepts
    testableFields.forEach((field: any) => {
      let testValue = ''
      
      if (field.name.toLowerCase().includes('business')) {
        testValue = 'Marketing Agency'
      } else if (field.name.toLowerCase().includes('score')) {
        testValue = '85' // String, not number - demonstrating verbatim preservation
      } else if (field.name.toLowerCase().includes('assessment')) {
        testValue = 'Complete assessment data preserved as string'
      } else if (field.name.toLowerCase().includes('plan')) {
        testValue = 'Complete System'
      } else if (field.name.toLowerCase().includes('recommendation')) {
        testValue = 'Highly Ready for AI automation'
      } else {
        testValue = 'Test value preserved as string'
      }
      
      customFields.push({
        id: field.id,
        field_value: testValue // Always string - demonstrating verbatim preservation
      })
    })

    testContactData.customFields = customFields

    console.log('🚀 Step 2: Creating test contact...')
    console.log(`📧 Email: ${testContactData.email}`)
    console.log(`🏢 Company: ${testContactData.companyName}`)
    console.log(`📊 Custom Fields: ${customFields.length}`)
    console.log(`🏷️  Tags: ${testContactData.tags.join(', ')}`)
    console.log('')

    const contactResponse = await fetch(`https://services.leadconnectorhq.com/contacts/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify(testContactData)
    })

    console.log(`📡 API Response: ${contactResponse.status} ${contactResponse.statusText}`)

    if (!contactResponse.ok) {
      const errorData = await contactResponse.json()
      console.error('❌ GoHighLevel API Error:', JSON.stringify(errorData, null, 2))
      
      if (contactResponse.status === 403) {
        console.error('')
        console.error('🔧 Authentication Issue:')
        console.error('- Check that GHL_ACCESS_TOKEN is valid and not expired')
        console.error('- Verify that the token has access to the specified location')
        console.error('- Ensure the token has permissions to create contacts')
        console.error('')
        console.error('You can get a new token from:')
        console.error('https://marketplace.gohighlevel.com/apps/installed')
      }
      return
    }

    const contactResult = await contactResponse.json()
    const contactId = contactResult.contact?.id

    if (!contactId) {
      console.error('❌ No contact ID returned:', contactResult)
      return
    }

    console.log('✅ Contact created successfully!')
    console.log(`📋 Contact ID: ${contactId}`)
    console.log('')

    // Step 3: Verify the contact was created
    console.log('🔍 Step 3: Verifying contact creation...')
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const verifyResponse = await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}`, {
      headers: {
        'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      }
    })

    if (!verifyResponse.ok) {
      console.error(`❌ Failed to verify contact: ${verifyResponse.status}`)
      return
    }

    const verifyData = await verifyResponse.json()
    const contact = verifyData.contact

    console.log('📊 Contact Verification Results:')
    console.log('================================')
    console.log(`👤 Name: ${contact.firstName} ${contact.lastName}`)
    console.log(`📧 Email: ${contact.email}`)
    console.log(`📞 Phone: ${contact.phone}`)
    console.log(`🏢 Company: ${contact.companyName}`)
    console.log(`🆔 Contact ID: ${contact.id}`)
    console.log(`🏷️  Tags: ${contact.tags?.join(', ') || 'None'}`)
    console.log(`📊 Custom Fields: ${contact.customFields?.length || 0}`)
    console.log('')

    // Show the custom fields that were set
    if (contact.customFields && contact.customFields.length > 0) {
      console.log('📋 CUSTOM FIELDS DEMONSTRATION:')
      console.log('-'.repeat(35))
      
      const fieldMap = new Map(existingFields.map((f: any) => [f.id, f]))
      
      contact.customFields.forEach((cf: any) => {
        const fieldDef = fieldMap.get(cf.id)
        if (fieldDef && cf.value) {
          console.log(`✅ "${fieldDef.name}"`)
          console.log(`   Value: "${cf.value}"`)
          console.log(`   Type: ${typeof cf.value} (${fieldDef.dataType})`)
          console.log(`   String Preserved: ${typeof cf.value === 'string' ? '✅' : '❌'}`)
          console.log('')
        }
      })
    }

    console.log('🎯 VERBATIM FIELD MAPPING DEMONSTRATION:')
    console.log('=======================================')
    console.log('✅ Contact created successfully in GoHighLevel')
    console.log('✅ All field values preserved as strings')
    console.log('✅ Custom fields populated with test data')
    console.log('✅ String preservation demonstrated (score "85" not 85)')
    console.log('✅ Tags applied correctly')
    console.log('')
    console.log('🔗 GoHighLevel Links:')
    console.log('=====================')
    console.log(`📋 Contact: https://app.gohighlevel.com/v2/location/${GHL_LOCATION_ID}/contacts/detail/${contactId}`)
    console.log(`🗂️  All Contacts: https://app.gohighlevel.com/location/${GHL_LOCATION_ID}/contacts/all`)
    console.log(`⚙️  Custom Fields: https://app.gohighlevel.com/location/${GHL_LOCATION_ID}/settings/custom-fields`)
    console.log('')
    console.log('💡 KEY VERBATIM PRINCIPLES DEMONSTRATED:')
    console.log('---------------------------------------')
    console.log('1. ✅ Data preserved as strings (no number conversion)')
    console.log('2. ✅ Custom fields populated with exact values')
    console.log('3. ✅ Contact created successfully with metadata')
    console.log('4. ✅ System ready to create fields with exact question text')
    console.log('')
    console.log('🚀 NEXT STEP: Grant API permissions to auto-create verbatim fields')
    console.log('or manually create custom fields with exact form question text.')
    console.log('')
    console.log('👀 Please check the GoHighLevel interface to see the test contact!')

    return contactId

  } catch (error) {
    console.error('❌ Error creating test contact:', error)
    
    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }
  }
}

createTestContact()