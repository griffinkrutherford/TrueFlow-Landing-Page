const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

async function testSimpleEmail() {
  console.log('Testing Simple Email to Griffin and Matt...\n');
  
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.error('❌ ERROR: RESEND_API_KEY not found in .env.local');
    return;
  }
  
  const resend = new Resend(apiKey);
  
  try {
    // Test 1: Send to both recipients at once
    console.log('Test 1: Sending to both recipients in one email...');
    const result1 = await resend.emails.send({
      from: 'TrueFlow Leads <onboarding@resend.dev>',
      to: ['griffin@trueflow.ai', 'matt@trueflow.ai'],
      subject: 'Test: Both Recipients Together',
      text: 'This is a test email sent to both griffin@trueflow.ai and matt@trueflow.ai in a single email.',
      html: '<p>This is a test email sent to both griffin@trueflow.ai and matt@trueflow.ai in a single email.</p>'
    });
    
    console.log('✓ Email sent successfully!');
    console.log('Email ID:', result1.data?.id);
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 2: Send to each recipient separately
    console.log('\nTest 2: Sending to Griffin separately...');
    const result2 = await resend.emails.send({
      from: 'TrueFlow Leads <onboarding@resend.dev>',
      to: 'griffin@trueflow.ai',
      subject: 'Test: Griffin Only',
      text: 'This is a test email sent only to griffin@trueflow.ai.',
      html: '<p>This is a test email sent only to griffin@trueflow.ai.</p>'
    });
    
    console.log('✓ Email to Griffin sent successfully!');
    console.log('Email ID:', result2.data?.id);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('\nTest 3: Sending to Matt separately...');
    const result3 = await resend.emails.send({
      from: 'TrueFlow Leads <onboarding@resend.dev>',
      to: 'matt@trueflow.ai',
      subject: 'Test: Matt Only',
      text: 'This is a test email sent only to matt@trueflow.ai.',
      html: '<p>This is a test email sent only to matt@trueflow.ai.</p>'
    });
    
    console.log('✓ Email to Matt sent successfully!');
    console.log('Email ID:', result3.data?.id);
    
    console.log('\n✅ All tests completed successfully!');
    console.log('Check both griffin@trueflow.ai and matt@trueflow.ai inboxes');
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('Full error:', error);
  }
}

testSimpleEmail();