/**
 * Direct test of GHL API with corrected custom fields format
 */

// Use environment variables or update these
const GHL_ACCESS_TOKEN = process.env.GHL_ACCESS_TOKEN || 'pit-8f017e02-dd2d-4360-81d3-89f18aec470c'
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || 'GVFoSfHpPaXzRXCJbym0'
const GHL_API_BASE = 'https://services.leadconnectorhq.com'

async function testDirectGHLAPI() {
  console.log('🎯 Direct GHL API Test with New Format')
  console.log('======================================\n')
  
  // Test payload using the new format
  const testPayload = {
    firstName: 'API',
    lastName: 'Test',
    email: 'api-test@trueflow.ai',
    locationId: GHL_LOCATION_ID,
    name: 'API Test',
    companyName: 'Direct API Test Co',
    tags: ['api-test', 'format-verification'],
    customFields: [
      {
        key: 'trueflow_business_type',
        field_value: 'agency'
      },
      {
        key: 'trueflow_business_name', 
        field_value: 'Direct API Test Company'
      },
      {
        key: 'trueflow_lead_score',
        field_value: '85'
      },
      {
        key: 'trueflow_lead_quality',
        field_value: 'high'
      }
    ],
    source: 'Direct API Format Test'
  }
  
  console.log('📤 Test Payload Structure:')
  console.log('  customFields format: array of {key, field_value}')
  console.log('  Number of custom fields:', testPayload.customFields.length)
  console.log('')
  
  testPayload.customFields.forEach(cf => {
    console.log(`  - ${cf.key}: "${cf.field_value}"`)
  })
  console.log('')
  
  try {
    console.log('🚀 Making direct API call to GHL...')
    
    const response = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify(testPayload)
    })
    
    console.log('📊 Response Status:', response.status, response.statusText)
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ SUCCESS! Contact created/updated')
      console.log('  Contact ID:', result.contact?.id || result.id)
      console.log('')
      console.log('🔍 Next Steps:')
      console.log('  1. Check GoHighLevel for the contact "API Test"')
      console.log('  2. Verify custom fields are populated')
      console.log('  3. Business Type should show: "agency"')
      console.log('  4. Business Name should show: "Direct API Test Company"')
    } else {
      const errorData = await response.text()
      console.log('❌ API Error:')
      console.log('  Status:', response.status)
      console.log('  Error:', errorData)
    }
    
  } catch (error) {
    console.error('🚨 Network Error:', error.message)
  }
}

testDirectGHLAPI()