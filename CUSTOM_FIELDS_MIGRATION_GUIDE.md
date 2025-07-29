# Custom Fields Migration Guide

## Overview

This guide walks through migrating from the current working version to the enhanced custom fields implementation with GoHighLevel API v2021-07-28.

## What's New

### 1. Custom Fields System
- **16 custom fields** automatically created in GoHighLevel
- Fields are created only once (no duplicates)
- All form data stored in structured custom fields (not just tags)

### 2. Lead Quality Scoring
- Automatic scoring algorithm (0-100)
- Based on:
  - Business size and type
  - Monthly lead volume
  - Team size
  - Selected pricing plan
  - Assessment scores
  - Timeline urgency

### 3. Lead Qualification
- Automatic categorization:
  - **Hot** (70-100): High-value, ready to buy
  - **Warm** (40-69): Interested, needs nurturing
  - **Cold** (0-39): Early stage, long-term prospect

### 4. Non-Blocking Design
- Forms always succeed (better user experience)
- GHL failures don't block submissions
- Email notifications as mandatory backup

## Pre-Migration Checklist

### 1. Verify Environment Variables
```bash
# Check your Railway environment has:
GHL_ACCESS_TOKEN=your_actual_token  # Not a placeholder
GHL_LOCATION_ID=your_actual_location_id
GHL_ENABLED=true
GHL_CREATE_OPPORTUNITIES=true
RESEND_API_KEY=your_resend_key
```

### 2. Test Current Production
```bash
# Ensure forms are working
curl -X POST https://your-domain.com/api/ghl/create-lead \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com"}'
```

### 3. Backup Current Version
```bash
cp app/api/ghl/create-lead/route.ts app/api/ghl/create-lead/route-backup-$(date +%Y%m%d).ts
```

## Migration Steps

### Step 1: Deploy Custom Fields Version

```bash
# 1. Navigate to the repo
cd trueflow-landing-repo

# 2. Activate custom fields version
cp app/api/ghl/create-lead/route-custom-fields.ts app/api/ghl/create-lead/route.ts

# 3. Commit and push
git add -A
git commit -m "feat: migrate to custom fields implementation with lead scoring"
git push origin main
```

### Step 2: Monitor Deployment

Railway will automatically deploy. Monitor the deployment:
- Check Railway dashboard for build status
- Watch for any build errors
- Deployment usually takes 1-2 minutes

### Step 3: Verify in Production

```bash
# Run the test suite
node scripts/test-custom-fields-enhanced.js https://your-domain.com full
```

### Step 4: Check GoHighLevel

1. Log into GoHighLevel
2. Navigate to Settings > Custom Fields
3. You should see these new fields:
   - TrueFlow Form Type
   - TrueFlow Lead Quality Score
   - TrueFlow Qualification Status
   - TrueFlow Submission Date
   - Business Type
   - Content Goals
   - Monthly Leads
   - Team Size
   - Current Tools
   - Biggest Challenge
   - Selected Plan
   - Assessment Score
   - Recommended Plan
   - Assessment Answers
   - Budget Range
   - Timeline

### Step 5: Test Real Submissions

1. Submit a test form on your landing page
2. Check:
   - Email notification received
   - Contact appears in GoHighLevel
   - Custom fields are populated
   - Lead score is calculated
   - Qualification status is set

## Rollback Procedure

If issues occur:

```bash
# 1. Revert immediately
cp app/api/ghl/create-lead/route-backup-[date].ts app/api/ghl/create-lead/route.ts

# 2. Push the revert
git add -A
git commit -m "revert: rollback to previous version"
git push origin main
```

## Post-Migration

### Using Lead Scores

In GoHighLevel:
1. Create workflows based on qualification status
2. Set up automations for hot leads (immediate follow-up)
3. Create nurture campaigns for warm leads
4. Long-term drip campaigns for cold leads

### Custom Field Mapping

| Form Field | Custom Field Name | Field Key |
|------------|------------------|-----------|
| Form Type | TrueFlow Form Type | trueflow_form_type |
| Lead Score | TrueFlow Lead Quality Score | trueflow_lead_quality_score |
| Status | TrueFlow Qualification Status | trueflow_qualification_status |
| Business | Business Name | trueflow_business_name |
| Industry | Business Type | trueflow_business_type |
| Goals | Content Goals | trueflow_content_goals |
| Volume | Monthly Leads | trueflow_monthly_leads |
| Team | Team Size | trueflow_team_size |
| Tools | Current Tools | trueflow_current_tools |
| Challenge | Biggest Challenge | trueflow_biggest_challenge |
| Plan | Selected Plan | trueflow_selected_plan |

## Troubleshooting

### Custom Fields Not Created
- Check GHL_ACCESS_TOKEN has correct permissions
- Verify GHL_LOCATION_ID is correct
- Check Railway logs for API errors

### Contacts Not Appearing
- Verify GHL_ENABLED=true in Railway
- Check email notifications are arriving (backup working)
- Review API response in Railway logs

### Lead Scores Incorrect
- Scores are calculated based on form data
- Check the scoring algorithm in `/lib/ghl/custom-fields.ts`
- Verify all form fields are being passed correctly

## Support

If you encounter issues:
1. Check Railway logs for detailed error messages
2. Run the test script to diagnose
3. Verify environment variables
4. Use the rollback procedure if needed

## API Changes

The implementation now uses GoHighLevel API v2021-07-28 with:
- Correct `objectKey` parameter for contact fields
- Updated endpoints for custom field operations
- Proper error handling and retry logic
- Non-blocking architecture

## Next Steps

After successful migration:
1. Monitor form submissions for 24 hours
2. Review lead quality scores for accuracy
3. Set up GoHighLevel automations based on custom fields
4. Train team on using the new lead scoring system