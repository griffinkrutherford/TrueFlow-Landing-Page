#!/usr/bin/env node

/**
 * Comprehensive email diagnostics for TrueFlow production issues
 * This script helps identify why emails work locally but not on Railway
 */

const https = require('https');
const { URL } = require('url');

// Configuration
const PROD_URL = process.argv[2] || 'https://trueflow.ai';
const AUTH_TOKEN = process.argv[3] || 'test-trueflow-2025';

console.log('🔍 TrueFlow Email Production Diagnostics');
console.log('========================================');
console.log(`Production URL: ${PROD_URL}`);
console.log(`Auth Token: ${AUTH_TOKEN.substring(0, 5)}...`);
console.log('');

// Helper function to make HTTPS requests
function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
        }
      });
    });
    
    req.on('error', (e) => reject(e));
    
    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

// Test 1: Check if the API is accessible
async function testApiAccessibility() {
  console.log('📡 Test 1: Checking API accessibility...');
  
  try {
    const url = new URL('/api/email-test', PROD_URL);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    };
    
    const result = await makeRequest(options);
    
    if (result.status === 200) {
      console.log('✅ API is accessible');
      console.log('');
      return result.data;
    } else {
      console.log(`❌ API returned status ${result.status}`);
      console.log('Response:', result.data);
      console.log('');
      return null;
    }
  } catch (error) {
    console.log('❌ Failed to connect to API');
    console.log('Error:', error.message);
    console.log('');
    return null;
  }
}

// Test 2: Analyze the diagnostic response
function analyzeDiagnostics(diagnostics) {
  if (!diagnostics) return;
  
  console.log('🔧 Test 2: Analyzing configuration...');
  
  // Check environment
  console.log('\n📋 Environment:');
  console.log(`  - NODE_ENV: ${diagnostics.environment?.NODE_ENV || 'NOT SET'}`);
  console.log(`  - RAILWAY_ENVIRONMENT: ${diagnostics.environment?.RAILWAY_ENVIRONMENT || 'NOT SET'}`);
  console.log(`  - Is Production: ${diagnostics.environment?.isProduction ? 'YES' : 'NO'}`);
  
  // Check Resend configuration
  console.log('\n🔑 Resend Configuration:');
  console.log(`  - API Key Present: ${diagnostics.resendConfig?.hasApiKey ? 'YES' : 'NO'}`);
  console.log(`  - Key Length: ${diagnostics.resendConfig?.keyLength || 0}`);
  console.log(`  - Key Prefix: ${diagnostics.resendConfig?.keyPrefix || 'NOT SET'}`);
  
  // Check domain test
  if (diagnostics.domainTest) {
    console.log('\n🌐 Domain Test:');
    console.log(`  - Success: ${diagnostics.domainTest.success ? 'YES' : 'NO'}`);
    if (!diagnostics.domainTest.success) {
      console.log(`  - Error: ${diagnostics.domainTest.error}`);
      console.log(`  - Note: ${diagnostics.domainTest.note || ''}`);
    }
  }
  
  // Check email test
  if (diagnostics.emailTest) {
    console.log('\n📧 Email Test:');
    console.log(`  - Success: ${diagnostics.emailTest.success ? 'YES' : 'NO'}`);
    if (diagnostics.emailTest.success) {
      console.log(`  - Email ID: ${diagnostics.emailTest.emailId}`);
    } else {
      console.log(`  - Error: ${diagnostics.emailTest.error}`);
      console.log(`  - Status Code: ${diagnostics.emailTest.statusCode || 'N/A'}`);
      console.log(`  - Error Type: ${diagnostics.emailTest.type || 'N/A'}`);
    }
  }
  
  console.log('');
}

// Test 3: Send a custom test email
async function sendTestEmail() {
  console.log('📮 Test 3: Sending custom test email...');
  
  try {
    const url = new URL('/api/email-test', PROD_URL);
    const postData = JSON.stringify({
      testEmail: 'griffin@trueflow.ai',
      testSubject: `Production Test - ${new Date().toISOString()}`
    });
    
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      }
    };
    
    const result = await makeRequest(options, postData);
    
    if (result.status === 200 && result.data.success) {
      console.log('✅ Test email sent successfully');
      console.log(`  - Email ID: ${result.data.emailId}`);
      console.log(`  - Recipient: ${result.data.recipient}`);
    } else {
      console.log('❌ Failed to send test email');
      console.log('Response:', result.data);
    }
  } catch (error) {
    console.log('❌ Error sending test email');
    console.log('Error:', error.message);
  }
  
  console.log('');
}

// Test 4: Common issues analysis
function analyzeCommonIssues(diagnostics) {
  console.log('🚨 Common Issues Analysis:');
  console.log('');
  
  const issues = [];
  
  // Check if API key is missing
  if (!diagnostics?.resendConfig?.hasApiKey) {
    issues.push({
      severity: 'CRITICAL',
      issue: 'RESEND_API_KEY is not set',
      solution: 'Add RESEND_API_KEY to Railway environment variables'
    });
  }
  
  // Check if API key might be a placeholder
  if (diagnostics?.resendConfig?.keyPrefix === 'your_re') {
    issues.push({
      severity: 'CRITICAL',
      issue: 'RESEND_API_KEY appears to be a placeholder',
      solution: 'Replace with actual API key from https://resend.com/api-keys'
    });
  }
  
  // Check if API key is too short
  if (diagnostics?.resendConfig?.keyLength && diagnostics.resendConfig.keyLength < 20) {
    issues.push({
      severity: 'CRITICAL',
      issue: 'RESEND_API_KEY seems too short',
      solution: 'Ensure you copied the complete API key'
    });
  }
  
  // Check email test results
  if (diagnostics?.emailTest && !diagnostics.emailTest.success) {
    const error = diagnostics.emailTest.error || '';
    
    if (error.includes('API key')) {
      issues.push({
        severity: 'HIGH',
        issue: 'API key authentication failed',
        solution: 'Verify the API key is valid and has correct permissions'
      });
    } else if (error.includes('domain')) {
      issues.push({
        severity: 'MEDIUM',
        issue: 'Domain verification issue',
        solution: 'Using onboarding@resend.dev should work without domain verification'
      });
    }
  }
  
  // Check environment
  if (diagnostics?.environment?.NODE_ENV !== 'production') {
    issues.push({
      severity: 'LOW',
      issue: 'NODE_ENV is not set to production',
      solution: 'Set NODE_ENV=production in Railway environment variables'
    });
  }
  
  // Display issues
  if (issues.length === 0) {
    console.log('✅ No obvious issues detected');
    console.log('');
    console.log('If emails still aren\'t working:');
    console.log('1. Check Railway logs for error messages');
    console.log('2. Verify recipients aren\'t marking emails as spam');
    console.log('3. Check Resend dashboard for email status');
  } else {
    issues.forEach((issue, index) => {
      console.log(`${index + 1}. [${issue.severity}] ${issue.issue}`);
      console.log(`   Solution: ${issue.solution}`);
      console.log('');
    });
  }
}

// Main diagnostic flow
async function runDiagnostics() {
  // Test 1: Check API accessibility and get diagnostics
  const diagnostics = await testApiAccessibility();
  
  if (!diagnostics) {
    console.log('⚠️  Cannot proceed without API access');
    console.log('');
    console.log('Possible causes:');
    console.log('1. The production URL is incorrect');
    console.log('2. The API is not deployed or running');
    console.log('3. The auth token is incorrect');
    console.log('');
    process.exit(1);
  }
  
  // Test 2: Analyze diagnostics
  analyzeDiagnostics(diagnostics);
  
  // Test 3: Send test email (only if API key is present)
  if (diagnostics.resendConfig?.hasApiKey) {
    await sendTestEmail();
  }
  
  // Test 4: Analyze common issues
  analyzeCommonIssues(diagnostics);
  
  console.log('\n📝 Next Steps:');
  console.log('1. If RESEND_API_KEY is missing, add it in Railway dashboard');
  console.log('2. After adding/updating env vars, redeploy the application');
  console.log('3. Run this diagnostic again to verify the fix');
  console.log('4. Check Railway logs during form submission for detailed errors');
  console.log('');
  console.log('Need the auth token? Check EMAIL_TEST_TOKEN in Railway env vars');
  console.log('Default token: test-trueflow-2025');
}

// Run diagnostics
runDiagnostics().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});