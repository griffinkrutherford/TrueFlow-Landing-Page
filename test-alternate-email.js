const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

async function testAlternateEmail() {
  console.log('=== Testing with Alternate Email Address ===\n');
  
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.error('❌ ERROR: RESEND_API_KEY not found in .env.local');
    return;
  }
  
  const resend = new Resend(apiKey);
  
  // Get alternate email from command line or use a default test email
  const alternateEmail = process.argv[2] || 'delivered@resend.dev';
  
  console.log('Testing email delivery to:', alternateEmail);
  console.log('(Note: delivered@resend.dev is a Resend test address that always accepts emails)\n');
  
  try {
    // Test 1: Send the same format as the getting started form
    console.log('1. Sending Getting Started format email...');
    const result1 = await resend.emails.send({
      from: 'TrueFlow Leads <onboarding@resend.dev>',
      to: [alternateEmail],
      subject: '🚀 TEST: New TrueFlow Get Started Lead',
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 Test Email - Get Started Lead Format</h1>
    </div>
    <div style="padding: 20px; background: #f8f9fa;">
      <p>This is a test email using the exact same format as the Getting Started form.</p>
      <p>If you receive this email but not emails to griffin@trueflow.ai, then the issue is likely:</p>
      <ul>
        <li>Email filtering at the trueflow.ai domain level</li>
        <li>Spam filters specific to griffin@trueflow.ai</li>
        <li>Domain verification issues with trueflow.ai</li>
      </ul>
      <p><strong>Sent at:</strong> ${new Date().toISOString()}</p>
    </div>
  </div>
</body>
</html>
      `
    });
    
    console.log('✓ Email sent successfully!');
    console.log('  Email ID:', result1.data?.id);
    
    // Test 2: Send to both the alternate email and griffin@trueflow.ai
    console.log('\n2. Sending to both addresses simultaneously...');
    const result2 = await resend.emails.send({
      from: 'TrueFlow Leads <onboarding@resend.dev>',
      to: [alternateEmail, 'griffin@trueflow.ai'],
      subject: 'TEST: Dual Recipient Test',
      text: 'This email was sent to both ' + alternateEmail + ' and griffin@trueflow.ai. Check if both receive it.',
      html: '<p>This email was sent to both <strong>' + alternateEmail + '</strong> and <strong>griffin@trueflow.ai</strong>. Check if both receive it.</p><p>Sent at: ' + new Date().toISOString() + '</p>'
    });
    
    console.log('✓ Email sent successfully!');
    console.log('  Email ID:', result2.data?.id);
    
    console.log('\n✅ Tests completed!');
    console.log('\nNext steps:');
    console.log('1. Check if the email arrived at:', alternateEmail);
    console.log('2. Check if griffin@trueflow.ai received the dual recipient email');
    console.log('3. If ' + alternateEmail + ' receives emails but griffin@trueflow.ai doesn\'t:');
    console.log('   - The issue is specific to the trueflow.ai domain or griffin\'s mailbox');
    console.log('   - Check spam folders, email filters, and domain settings');
    console.log('4. Check Resend dashboard for delivery status: https://resend.com/emails');
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('Full error:', error);
  }
}

console.log('Usage: node test-alternate-email.js [email-address]');
console.log('Example: node test-alternate-email.js yourtest@gmail.com\n');

testAlternateEmail();