const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

async function testMinimalEmail() {
  console.log('Testing Minimal Email Content...\n');
  
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  try {
    // Test with absolutely minimal content
    console.log('Sending minimal email to both recipients...');
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',  // Even simpler format
      to: ['griffin@trueflow.ai', 'matt@trueflow.ai'],
      subject: 'TrueFlow Lead',
      text: 'New lead received'
    });
    
    console.log('✓ Minimal email sent successfully!');
    console.log('Email ID:', result.data?.id);
    console.log('\nFull response:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('\n❌ ERROR:', error);
  }
}

testMinimalEmail();