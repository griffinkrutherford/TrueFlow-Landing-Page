# Quick Email Setup Instructions

## To Enable Auto-Email for Readiness Assessment

### Step 1: Get Resend API Key
1. Go to https://resend.com and sign up (free)
2. Navigate to API Keys section
3. Create a new API key
4. Copy the key (starts with `re_`)

### Step 2: Update Environment Variables
Add to your `.env.local` file:
```env
RESEND_API_KEY=re_your_actual_key_here
```

### Step 3: Test Email Sending
The assessment form will now auto-email to:
- griffin@trueflow.ai
- matt@trueflow.ai

### For Production Deployment
1. Add your domain to Resend dashboard
2. Verify domain via DNS records
3. Update sender email in `/app/api/lead-notification/route.ts`:
   ```typescript
   from: 'TrueFlow Leads <leads@trueflow.ai>', // Change from onboarding@resend.dev
   ```

### Testing Without External API
If you want to test without setting up Resend:
1. Emails are logged to console in development
2. Check your terminal after form submission
3. You'll see the full email content there

### Troubleshooting
- If emails fail, check console for error messages
- Ensure API key is correct (starts with `re_`)
- For production, ensure your domain is verified in Resend