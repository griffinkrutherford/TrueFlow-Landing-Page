const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

async function debugEmailIssue() {
  console.log('=== TrueFlow Email Debugging Tool ===\n');
  
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.error('❌ ERROR: RESEND_API_KEY not found in .env.local');
    return;
  }
  
  console.log('✓ API Key found:', apiKey.substring(0, 7) + '...');
  
  const resend = new Resend(apiKey);
  
  try {
    // First, let's check if we can access the Resend API
    console.log('\n1. Testing API Access...');
    try {
      // Try to get domain info - this might fail with restricted keys
      const domains = await resend.domains.list();
      console.log('✓ API access successful');
      console.log('Domains configured:', domains.data?.data?.length || 0);
      
      // Check if trueflow.ai is verified
      const trueflowDomain = domains.data?.data?.find(d => d.name === 'trueflow.ai');
      if (trueflowDomain) {
        console.log('\ntrueflow.ai domain status:');
        console.log('- Status:', trueflowDomain.status);
        console.log('- Verified:', trueflowDomain.status === 'verified' ? 'Yes' : 'No');
        console.log('- Records:', trueflowDomain.records);
      } else {
        console.log('\n⚠️  trueflow.ai domain not found in Resend account');
      }
    } catch (domainError) {
      console.log('⚠️  Cannot access domain info (restricted API key or no domains permission)');
      console.log('   This is normal for send-only API keys');
    }
    
    // Test different email scenarios
    console.log('\n2. Testing Email Sending...\n');
    
    const testScenarios = [
      {
        name: 'Direct to griffin@trueflow.ai',
        config: {
          from: 'TrueFlow Leads <onboarding@resend.dev>',
          to: 'griffin@trueflow.ai',
          subject: 'DEBUG: Direct Email Test',
          html: '<p>This is a direct test to griffin@trueflow.ai sent at ' + new Date().toISOString() + '</p>'
        }
      },
      {
        name: 'Using reply-to header',
        config: {
          from: 'TrueFlow Leads <onboarding@resend.dev>',
          to: 'griffin@trueflow.ai',
          replyTo: 'noreply@trueflow.ai',
          subject: 'DEBUG: Reply-To Header Test',
          html: '<p>Testing with reply-to header at ' + new Date().toISOString() + '</p>'
        }
      },
      {
        name: 'Multiple recipients including griffin',
        config: {
          from: 'TrueFlow Leads <onboarding@resend.dev>',
          to: ['griffin@trueflow.ai', 'test@resend.dev'],
          subject: 'DEBUG: Multiple Recipients Test',
          html: '<p>Testing multiple recipients at ' + new Date().toISOString() + '</p>'
        }
      }
    ];
    
    for (const scenario of testScenarios) {
      console.log(`Testing: ${scenario.name}...`);
      try {
        const result = await resend.emails.send(scenario.config);
        console.log('✓ Email sent successfully!');
        console.log('  Email ID:', result.data?.id);
        console.log('  Status:', result.data ? 'Success' : 'Unknown');
        
        // Wait between tests
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error('✗ Failed:', error.message);
        if (error.response) {
          console.error('  Response:', error.response.data);
        }
      }
      console.log('');
    }
    
    // Check for common issues
    console.log('\n3. Common Issues Check:\n');
    
    console.log('Potential issues to investigate:');
    console.log('□ Emails might be in spam/junk folder');
    console.log('□ Email provider (for griffin@trueflow.ai) might be blocking');
    console.log('□ Domain verification might be incomplete');
    console.log('□ SPF/DKIM records might not be properly configured');
    console.log('□ Rate limiting from Resend');
    
    console.log('\n4. Recommendations:\n');
    console.log('1. Check the Resend dashboard (https://resend.com/emails) to verify:');
    console.log('   - Email delivery status');
    console.log('   - Any bounce or complaint notifications');
    console.log('   - Domain verification status');
    console.log('\n2. Check griffin@trueflow.ai email settings:');
    console.log('   - Spam/Junk folder');
    console.log('   - Email filters/rules');
    console.log('   - Blocked senders list');
    console.log('\n3. Try sending to a different email address to isolate the issue');
    console.log('\n4. Consider adding SPF and DKIM records for trueflow.ai domain');
    
  } catch (error) {
    console.error('\n❌ CRITICAL ERROR:', error.message);
    console.error('Full error:', error);
  }
}

debugEmailIssue();