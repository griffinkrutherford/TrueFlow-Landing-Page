# Email Troubleshooting Guide - TrueFlow Production

## Current Issue
Emails are working locally but not in production on Railway.

## Diagnostic Steps

### 1. Check Railway Environment Variables
Make sure these are set in Railway dashboard:
- `RESEND_API_KEY` - Must be a valid Resend API key
- `NODE_ENV` - Should be "production"
- `EMAIL_TEST_TOKEN` - Optional, for testing (default: "test-trueflow-2025")

### 2. Test Email Configuration
Run the diagnostic endpoint:

```bash
# Test from your local machine
curl -H "Authorization: Bearer test-trueflow-2025" https://your-railway-app.railway.app/api/email-test

# Or use the test script
./test-production-email.sh https://your-railway-app.railway.app
```

### 3. Common Issues and Solutions

#### A. RESEND_API_KEY Not Set
- Go to Railway dashboard > Variables
- Add `RESEND_API_KEY` with your actual key from https://resend.com/api-keys
- Redeploy the application

#### B. CORS Issues
The API routes are configured to accept requests from:
- https://trueflow.ai
- https://www.trueflow.ai
- http://localhost:3000
- http://localhost:3001

If your domain is different, update the allowed origins in the API routes.

#### C. From Address Issues
We're using `onboarding@resend.dev` which is Resend's default sender. This should work without domain verification.

#### D. API Key Permissions
Make sure your Resend API key has "Send email" permissions. Some keys are restricted to specific operations.

### 4. Debug Information Added
The updated API routes now log:
- Request origin and host
- API key presence and prefix
- Detailed error messages
- Email send attempts and results

### 5. Check Railway Logs
```bash
railway logs --service=your-service-name
```

Look for:
- "Lead notification request received"
- "Resend API configuration"
- "Attempting to send email"
- Any error messages

### 6. Verify Email Delivery
- Check spam folders for griffin@trueflow.ai and matt@trueflow.ai
- Check Resend dashboard for email status
- Use the test endpoint to send to a different email address

### 7. Alternative Solutions

If Resend continues to fail:
1. Try regenerating your API key
2. Use a different email service (SendGrid, Mailgun)
3. Implement a webhook to log email attempts

## Quick Fix Checklist

- [ ] RESEND_API_KEY is set in Railway environment variables
- [ ] API key starts with "re_" and is valid
- [ ] Railway app is redeployed after adding env vars
- [ ] No firewall blocking outbound HTTPS requests
- [ ] Recipients' email addresses are correct
- [ ] Emails are not going to spam

## Testing in Production

1. Deploy the changes with enhanced logging
2. Trigger a form submission
3. Check Railway logs immediately
4. Use the email test endpoint for isolated testing

## Need Help?

If issues persist after following this guide:
1. Check Resend status page: https://status.resend.com/
2. Contact Resend support with your API request logs
3. Consider implementing email queue with retry logic