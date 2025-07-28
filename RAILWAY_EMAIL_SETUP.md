# Railway Email Setup Guide

## Quick Fix Steps

### 1. Add RESEND_API_KEY to Railway

1. Go to your Railway project dashboard
2. Click on your service (trueflow-landing)
3. Go to the "Variables" tab
4. Click "New Variable"
5. Add:
   - **Key**: `RESEND_API_KEY`
   - **Value**: Your actual Resend API key (starts with `re_`)
   
   ⚠️ **IMPORTANT**: Do NOT include quotes around the value

### 2. Verify Other Environment Variables

Make sure these are also set in Railway:
- `NODE_ENV` = `production`
- `PORT` = `3001` (or your preferred port)
- `EMAIL_TEST_TOKEN` = `test-trueflow-2025` (optional, for testing)

### 3. Redeploy the Application

After adding/updating environment variables:
1. Railway should automatically redeploy
2. If not, click "Redeploy" in the Railway dashboard

### 4. Test the Configuration

Run the diagnostic script from your local machine:

```bash
# Basic test
node diagnose-email-production.js https://your-railway-app.railway.app

# With custom auth token
node diagnose-email-production.js https://your-railway-app.railway.app your-custom-token
```

## Common Railway-Specific Issues

### Issue: Environment Variables Not Loading

Railway doesn't read `.env.local` files. All environment variables MUST be set in the Railway dashboard.

**Solution**: 
- Never rely on `.env.local` in production
- Set all variables through Railway's UI or CLI

### Issue: Variable Format Problems

Railway sometimes has issues with certain variable formats.

**Solution**:
- Don't use quotes around values in Railway
- Don't use escape characters
- Ensure no trailing spaces

### Issue: Build vs Runtime Variables

Some variables might be needed at build time.

**Solution**:
- Add critical variables before deploying
- Check Railway logs for "undefined" errors during build

## Debugging Steps

### 1. Check Railway Logs

```bash
# Using Railway CLI
railway logs

# Or in the dashboard
# Go to your service > Logs
```

Look for:
- "RESEND_API_KEY is not set"
- "Environment validation failed"
- "Resend connection test failed"

### 2. Use the Email Test Endpoint

```bash
# Test if API key is loaded
curl -H "Authorization: Bearer test-trueflow-2025" \
  https://your-app.railway.app/api/email-test

# Send a test email
curl -X POST \
  -H "Authorization: Bearer test-trueflow-2025" \
  -H "Content-Type: application/json" \
  -d '{"testEmail": "your-email@example.com"}' \
  https://your-app.railway.app/api/email-test
```

### 3. Check Variable Loading

The enhanced route now logs environment validation. Check logs for:
```
Environment validation: {
  NODE_ENV: "production",
  hasResendKey: true,
  keyLength: 51,
  keyPrefix: "re_a1b2c3...",
  errors: 0,
  warnings: 0
}
```

## Enhanced Route Features

The new `route-enhanced.ts` includes:

1. **Environment Validation**: Checks API key before attempting to send
2. **Connection Testing**: Verifies Resend API is accessible
3. **Retry Logic**: Attempts to send email up to 3 times
4. **Fallback Handling**: Always saves lead data even if email fails
5. **Better Logging**: Detailed logs for debugging

To use the enhanced route:
1. Rename current `route.ts` to `route-original.ts`
2. Rename `route-enhanced.ts` to `route.ts`
3. Redeploy

## Quick Checklist

- [ ] RESEND_API_KEY is set in Railway (not .env.local)
- [ ] API key starts with `re_` and is complete
- [ ] No quotes around the API key value
- [ ] NODE_ENV is set to "production"
- [ ] Application redeployed after adding variables
- [ ] Checked Railway logs for errors
- [ ] Ran diagnostic script successfully
- [ ] Test email received

## Still Not Working?

1. **Verify API Key**: Log into Resend and check if the API key is active
2. **Check Permissions**: Ensure the API key has "Send email" permission
3. **Try a New Key**: Generate a fresh API key in Resend
4. **Check Recipients**: Ensure griffin@trueflow.ai and matt@trueflow.ai are valid
5. **Use Test Endpoint**: The `/api/email-test` endpoint helps isolate issues

## Contact Support

If emails still aren't working after following this guide:
1. Check Resend status: https://status.resend.com/
2. Railway support: https://railway.app/help
3. Review logs and share with support team