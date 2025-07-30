const https = require('https');
const http = require('http');

async function checkRailwayEmails() {
  console.log('=== Railway Email Diagnostic Tool ===\n');
  
  // Get the Railway URL from command line or use default
  const railwayUrl = process.argv[2] || 'https://trueflow-landing-production.up.railway.app';
  console.log('Checking Railway deployment at:', railwayUrl);
  
  try {
    // 1. Check if the app is running
    console.log('\n1. Checking if app is accessible...');
    const healthCheck = await makeRequest(railwayUrl, 'GET');
    console.log('✓ App is running');
    
    // 2. Check environment endpoint
    console.log('\n2. Checking environment configuration...');
    try {
      const envCheck = await makeRequest(railwayUrl + '/api/check-env', 'GET');
      const envData = JSON.parse(envCheck);
      console.log('Environment check response:', envData);
      
      if (envData.hasResendKey) {
        console.log('✓ RESEND_API_KEY is configured');
        console.log('  Key prefix:', envData.keyPrefix || 'Unknown');
      } else {
        console.log('✗ RESEND_API_KEY is NOT configured');
      }
    } catch (error) {
      console.log('⚠️  Cannot access /api/check-env endpoint');
    }
    
    // 3. Test email sending to griffin@trueflow.ai
    console.log('\n3. Testing email delivery to griffin@trueflow.ai...');
    
    const testPayload = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '555-1234',
      businessName: 'Railway Debug Test',
      businessType: 'Testing',
      selectedPlan: 'Growth',
      contentGoals: ['Testing email delivery'],
      integrations: ['None'],
      timestamp: new Date().toISOString()
    };
    
    try {
      const response = await makeRequest(
        railwayUrl + '/api/get-started-notification',
        'POST',
        testPayload
      );
      
      const result = JSON.parse(response);
      console.log('Response:', result);
      
      if (result.success) {
        console.log('✓ API reports email sent successfully');
        console.log('  Email ID:', result.emailId);
        console.log('  Recipients:', result.recipients);
      } else {
        console.log('✗ Email sending failed');
        console.log('  Error:', result.error);
        console.log('  Details:', result.details);
      }
    } catch (error) {
      console.error('✗ Failed to send test email:', error.message);
    }
    
    // 4. Recommendations
    console.log('\n4. Diagnostic Summary:\n');
    
    console.log('Based on the tests, here are the findings:');
    console.log('\n📋 CHECKLIST:');
    console.log('□ Railway app is accessible');
    console.log('□ RESEND_API_KEY is set in Railway environment variables');
    console.log('□ API calls are returning success responses');
    console.log('□ Check griffin@trueflow.ai inbox (including spam)');
    console.log('□ Check Resend dashboard for delivery status');
    
    console.log('\n🔍 MOST LIKELY ISSUES:');
    console.log('\n1. Domain Verification Issue:');
    console.log('   - trueflow.ai might not be verified in Resend');
    console.log('   - SPF/DKIM records might be missing');
    console.log('   - Solution: Check Resend dashboard > Domains');
    
    console.log('\n2. Email Provider Blocking:');
    console.log('   - griffin@trueflow.ai provider might be blocking');
    console.log('   - Emails might be in quarantine');
    console.log('   - Solution: Check email provider settings');
    
    console.log('\n3. Resend Account Issue:');
    console.log('   - API key might have limited permissions');
    console.log('   - Account might be in sandbox mode');
    console.log('   - Solution: Check Resend account settings');
    
    console.log('\n📊 NEXT STEPS:');
    console.log('\n1. Log into Resend Dashboard (https://resend.com):');
    console.log('   - Go to Emails tab');
    console.log('   - Look for emails to griffin@trueflow.ai');
    console.log('   - Check delivery status (delivered, bounced, etc.)');
    
    console.log('\n2. Check Domain Configuration:');
    console.log('   - Go to Domains tab in Resend');
    console.log('   - Verify trueflow.ai is listed and verified');
    console.log('   - Check SPF, DKIM, and DMARC records');
    
    console.log('\n3. Test with Personal Email:');
    console.log('   - Try sending to a personal Gmail/Outlook');
    console.log('   - This will help isolate if it\'s specific to trueflow.ai');
    
    console.log('\n4. Review Railway Logs:');
    console.log('   - railway logs --tail 100');
    console.log('   - Look for any email-related errors');
    
  } catch (error) {
    console.error('\n❌ Error during diagnostic:', error.message);
  }
}

function makeRequest(url, method, data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'TrueFlow-Email-Diagnostic'
      }
    };
    
    if (data) {
      const jsonData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(jsonData);
    }
    
    const req = protocol.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Run the diagnostic
console.log('Usage: node check-railway-emails.js [railway-url]');
console.log('Default URL: https://trueflow-landing-production.up.railway.app\n');

checkRailwayEmails();