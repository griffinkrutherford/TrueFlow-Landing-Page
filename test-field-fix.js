/**
 * Test script to verify the custom fields fix
 */

const testFormData = {
  firstName: 'Test',
  lastName: 'Customer',
  email: 'test-fix@trueflow.ai',
  businessName: 'Test Fix Company',
  businessType: 'agency',
  contentGoals: ['blog-posts', 'social-media'],
  integrations: ['facebook', 'instagram'],
  selectedPlan: 'growth',
  monthlyLeads: '50-100',
  teamSize: '2-5',
  currentTools: 'Buffer, Canva',
  biggestChallenge: 'Creating content consistently'
}

async function testFieldFix() {
  console.log('🧪 Testing Custom Fields Fix')
  console.log('=============================\n')
  
  console.log('📝 Test Data:')
  console.log('  Business Name:', testFormData.businessName)
  console.log('  Business Type:', testFormData.businessType) 
  console.log('  Content Goals:', testFormData.contentGoals.join(', '))
  console.log('  Selected Plan:', testFormData.selectedPlan)
  console.log('')
  
  try {
    const response = await fetch('http://localhost:3001/api/ghl/create-lead-v5', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testFormData)
    })
    
    const result = await response.json()
    
    if (result.success) {
      console.log('✅ API Call Successful!')
      console.log('  GHL Contact ID:', result.ghlContactId)
      console.log('  Custom Fields Used:', result.customFieldsUsed)
      console.log('  Lead Score:', result.leadScore)
      console.log('  Lead Quality:', result.leadQuality)
      console.log('')
      console.log('🔍 Next Steps:')
      console.log('  1. Check server logs for field mapping details')
      console.log('  2. Verify custom fields in GoHighLevel contact')
      console.log('  3. Look for any error messages in the logs')
    } else {
      console.log('❌ API Call Failed:', result.message)
    }
    
  } catch (error) {
    console.error('🚨 Test Error:', error.message)
  }
}

testFieldFix()