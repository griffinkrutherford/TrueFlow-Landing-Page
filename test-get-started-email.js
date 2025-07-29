const fetch = require('node-fetch');

async function testGetStartedEmail() {
  console.log('Testing Get Started Email Notification...\n');
  
  // Simulate the exact data the form would send
  const testData = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '555-1234',
    businessName: 'Test Business Inc',
    businessType: 'Service Business',
    selectedPlan: 'Professional',
    contentGoals: ['Increase brand awareness', 'Generate leads'],
    integrations: ['Google Business Profile', 'Facebook'],
    timestamp: new Date().toISOString()
  };
  
  console.log('Sending test lead data:', testData);
  
  try {
    const response = await fetch('http://localhost:3001/api/get-started-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('\n✓ Email sent successfully!');
      console.log('Response:', result);
    } else {
      console.error('\n❌ Error sending email:');
      console.error('Status:', response.status);
      console.error('Response:', result);
    }
  } catch (error) {
    console.error('\n❌ Network error:', error.message);
    console.log('\nMake sure your landing page is running on port 3001');
  }
}

testGetStartedEmail();