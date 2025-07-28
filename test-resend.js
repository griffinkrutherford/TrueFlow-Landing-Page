const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

async function testResend() {
  console.log('Testing Resend Email Configuration...\n');
  
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.error('❌ ERROR: RESEND_API_KEY not found in .env.local');
    return;
  }
  
  if (apiKey.includes('your_') || apiKey === 'your_resend_api_key_here') {
    console.error('❌ ERROR: RESEND_API_KEY is still a placeholder!');
    console.log('\nPlease update your .env.local file with your actual Resend API key.');
    console.log('Get your API key from: https://resend.com/api-keys');
    return;
  }
  
  console.log('✓ API Key found (masked):', apiKey.substring(0, 10) + '...');
  
  const resend = new Resend(apiKey);
  
  try {
    console.log('\nTesting API connection...');
    const domains = await resend.domains.list();
    console.log('✓ API connection successful!');
    
    console.log('\nSending test email...');
    const result = await resend.emails.send({
      from: 'TrueFlow Test <onboarding@resend.dev>',
      to: ['griffin@trueflow.ai'],
      subject: 'TrueFlow Landing Page - Email Test',
      text: 'This is a test email from your TrueFlow landing page setup. If you receive this, your email configuration is working correctly!',
      html: '<p>This is a test email from your TrueFlow landing page setup.</p><p>If you receive this, your email configuration is working correctly!</p>'
    });
    
    console.log('✓ Test email sent successfully!');
    console.log('Email ID:', result.data?.id);
    console.log('\nCheck your inbox at griffin@trueflow.ai');
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    
    if (error.message.includes('API key')) {
      console.log('\nYour API key appears to be invalid.');
      console.log('Please check that you copied the complete key from Resend.');
    }
  }
}

testResend();