# Custom Fields Testing Guide

## Current Status

✅ **Production is stable** - Using the working backup version that creates contacts and sends emails
📦 **Custom fields version ready** - New implementation is complete and ready for testing

## Testing Steps

### 1. First, Verify Current Production Works

```bash
# Test that forms are submitting successfully
curl -X POST https://trueflow-landing-page-production.up.railway.app/api/ghl/create-lead \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "score": 75,
    "recommendation": "Professional"
  }'
```

You should:
- Receive a success response
- Get an email notification
- See the contact in GoHighLevel (if configured)

### 2. Test Custom Fields Implementation Locally

```bash
# Clone and navigate to the repo
cd trueflow-landing-repo

# Create a test endpoint (temporary)
cp app/api/ghl/create-lead/route-custom-fields.ts app/api/ghl/create-lead-test/route.ts

# Run the test suite against local
npm run dev
# In another terminal:
node scripts/test-custom-fields-enhanced.js http://localhost:3001 quick
```

### 3. Deploy Custom Fields Version

To activate the custom fields implementation:

```bash
# Backup current working version
cp app/api/ghl/create-lead/route.ts app/api/ghl/create-lead/route-working-backup.ts

# Activate custom fields version
cp app/api/ghl/create-lead/route-custom-fields.ts app/api/ghl/create-lead/route.ts

# Commit and push
git add -A
git commit -m "feat: activate custom fields implementation"
git push origin main
```

### 4. Verify in Production

After Railway deploys (1-2 minutes):

```bash
# Run comprehensive tests
node scripts/test-custom-fields-enhanced.js https://trueflow-landing-page-production.up.railway.app full
```

### 5. Check GoHighLevel

1. Log into your GoHighLevel account
2. Navigate to Contacts
3. Find the test contacts (look for recent submissions)
4. Check the Custom Fields section
5. You should see:
   - TrueFlow Form Type
   - TrueFlow Lead Quality Score (0-100)
   - TrueFlow Qualification Status (hot/warm/cold)
   - All form data in custom fields (not just tags)

### 6. If Something Goes Wrong

Immediately revert to the working version:

```bash
# Revert to working backup
cp app/api/ghl/create-lead/route-working-backup.ts app/api/ghl/create-lead/route.ts

# Push the revert
git add -A
git commit -m "revert: back to working version"
git push origin main
```

## Key Differences

### Current Version (Working)
- ✅ Creates contacts in GHL
- ✅ Sends email notifications
- ✅ Uses basic custom field mapping
- ❌ No automatic field creation
- ❌ No lead scoring

### Custom Fields Version (New)
- ✅ Creates contacts in GHL
- ✅ Sends email notifications
- ✅ Automatically creates custom fields if missing
- ✅ Lead quality scoring (0-100)
- ✅ Hot/Warm/Cold qualification
- ✅ Non-blocking - always succeeds
- ✅ Better error handling
- ✅ Performance optimized with caching

## Environment Variables Required

Make sure these are set in Railway:

```
GHL_ACCESS_TOKEN=your_actual_token
GHL_LOCATION_ID=your_actual_location_id
GHL_ENABLED=true
GHL_CREATE_OPPORTUNITIES=true
RESEND_API_KEY=your_resend_key
```

## Support

If you encounter issues:
1. Check Railway logs for detailed error messages
2. Run the test script to diagnose
3. Verify environment variables are set correctly
4. Revert to working version if needed