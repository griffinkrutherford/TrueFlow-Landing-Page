/**
 * Test script to submit a form to the new API endpoint
 * Run with: npx tsx scripts/test-form-submission.ts
 */

async function testFormSubmission() {
  console.log('=== Testing Form Submission to GHL ===\n')
  
  // Prepare test data that simulates a real form submission
  const testData = {
    // Contact information
    firstName: 'Test',
    lastName: 'User',
    email: `test-${Date.now()}@example.com`, // Unique email to avoid duplicates
    phone: '+1 (555) 123-4567',
    businessName: 'Test Business Inc',
    
    // Business profile
    businessType: 'agency',
    contentGoals: ['newsletters', 'blogs', 'social', 'sales'],
    integrations: ['gohighlevel', 'mailchimp', 'zapier'],
    
    // Assessment answers
    answers: {
      'current-content': 'mixed',
      'content-volume': 'high',
      'crm-usage': 'advanced-crm',
      'lead-response': 'quick',
      'time-spent': 'moderate',
      'budget': 'high'
    },
    
    // Plan selection
    selectedPlan: 'complete-system',
    
    // Scores (calculated by the form)
    scorePercentage: 85,
    readinessLevel: 'Highly Ready',
    
    // Metadata
    timestamp: new Date().toISOString(),
    source: 'test-script'
  }
  
  console.log('Submitting test data:')
  console.log(JSON.stringify(testData, null, 2))
  console.log('')
  
  try {
    // Make the API call
    const response = await fetch('http://localhost:3001/api/ghl/create-lead-v4', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    })
    
    console.log(`Response Status: ${response.status}`)
    console.log(`Response OK: ${response.ok}`)
    
    const result = await response.json()
    console.log('\nAPI Response:')
    console.log(JSON.stringify(result, null, 2))
    
    if (result.success) {
      console.log('\n✅ Form submission successful!')
      console.log(`Lead Score: ${result.leadScore}`)
      console.log(`Lead Quality: ${result.leadQuality}`)
      console.log(`Custom Fields Used: ${result.customFieldsUsed}`)
      if (result.ghlContactId) {
        console.log(`GHL Contact ID: ${result.ghlContactId}`)
      }
    } else {
      console.log('\n❌ Form submission failed!')
      console.log(`Error: ${result.message}`)
    }
    
  } catch (error) {
    console.error('\n❌ Request failed:')
    console.error(error)
  }
  
  console.log('\n=== Test Complete ===')
}

// Run the test
testFormSubmission().catch(console.error)