# GoHighLevel Custom Fields Setup for TrueFlow

## Overview

This document explains how TrueFlow integrates with GoHighLevel (GHL) using custom fields instead of tags to store form submission data. The new implementation provides better data organization and enables more sophisticated CRM workflows.

## What Changed

### Previous Implementation (Tags Only)
- Used tags for basic categorization
- Limited data storage capabilities
- No structured data for form responses

### New Implementation (Custom Fields)
- 17 custom fields for comprehensive data storage
- Lead scoring and qualification
- Full form response tracking
- Better reporting and automation capabilities

## Custom Fields Created

### Core Tracking Fields
1. **TrueFlow Form Type** - Identifies whether submission is from assessment or get-started form
2. **TrueFlow Submission Date** - Timestamp of form submission
3. **TrueFlow Lead Score** - Calculated lead quality score (0-100)
4. **TrueFlow Qualification Status** - Lead temperature (hot/warm/cold)

### Business Information
5. **TrueFlow Business Type** - Type/category of business
6. **TrueFlow Content Goals** - Content creation objectives
7. **TrueFlow Monthly Leads** - Expected monthly lead volume
8. **TrueFlow Team Size** - Size of the team
9. **TrueFlow Current Tools** - Tools currently in use
10. **TrueFlow Biggest Challenge** - Primary business challenge
11. **TrueFlow Selected Plan** - Chosen pricing plan

### Assessment Specific
12. **TrueFlow Assessment Score** - Quiz score percentage
13. **TrueFlow Recommended Plan** - AI-recommended plan
14. **TrueFlow Assessment Answers** - All quiz answers (JSON)
15. **TrueFlow Budget Range** - Budget expectations
16. **TrueFlow Timeline** - Implementation timeline
17. **TrueFlow Decision Maker** - Whether contact is decision maker

## Setup Instructions

### 1. Initial Setup (One-Time)

Run the setup script to create all custom fields in your GHL location:

```bash
cd trueflow-landing-repo
chmod +x setup-ghl-custom-fields.js
node setup-ghl-custom-fields.js
```

You'll need:
- Your GHL Access Token
- Your GHL Location ID

### 2. Environment Configuration

Update your `.env.local` file:

```env
# GoHighLevel Configuration
GHL_ACCESS_TOKEN=your_access_token_here
GHL_LOCATION_ID=your_location_id_here
GHL_API_VERSION=2021-07-28
GHL_ENABLED=true

# Resend Email Configuration (backup)
RESEND_API_KEY=your_resend_api_key_here
```

### 3. API Endpoints

The forms now use the enhanced V2 API endpoint:
- **Endpoint**: `/api/ghl/create-lead-v2`
- **Features**:
  - Automatic custom field creation
  - Lead scoring algorithm
  - Fallback email notifications
  - Comprehensive error handling

## Lead Scoring Algorithm

### Assessment Form Scoring
- Base score: Assessment quiz result (0-100)
- +10 points for immediate timeline
- +10 points for being decision maker
- +10 points for high budget
- Maximum: 100 points

### Get Started Form Scoring
- Base score: 50 points
- Monthly leads: 0-20 points
- Team size: 0-15 points
- Plan selection: 0-15 points
- Current tools: 0-5 points
- Business type: 0-10 points
- Maximum: 100 points

### Qualification Thresholds
- **Hot Lead**: 70+ points 🔥
- **Warm Lead**: 40-69 points 🌡️
- **Cold Lead**: <40 points ❄️

## Testing

### Test the API
```bash
node test-v2-api.js
```

This will:
1. Submit a test assessment form
2. Submit a test get-started form
3. Verify email notifications
4. Check GHL integration

### Verify in GoHighLevel
1. Log into your GHL account
2. Navigate to Contacts
3. Find the test contacts
4. Check that all custom fields are populated

## Troubleshooting

### "Custom fields not found" error
- Run the setup script to create fields
- Verify your GHL credentials are correct
- Check that you have permissions to create custom fields

### "Unable to connect to Resend API" error
- Verify your Resend API key is valid
- Check that it's not a placeholder value
- Test with: `node test-resend.js`

### Form submission fails
1. Check browser console for errors
2. Verify server is running on port 3001
3. Check server logs: `tail -f dev-server.log`
4. Test API directly: `node test-v2-api.js`

## Email Notifications

Even with GHL configured, the system sends backup email notifications to:
- griffin@trueflow.ai
- matt@trueflow.ai

Emails include:
- Lead quality score and qualification
- All form responses
- Recommended actions based on lead temperature
- Direct link to view in GHL

## Best Practices

1. **Always run the setup script** when connecting to a new GHL location
2. **Monitor both GHL and email** for the first few submissions
3. **Use the lead score** for prioritizing follow-ups
4. **Set up GHL workflows** based on the qualification status field
5. **Keep the field definitions** consistent across all locations

## Advanced Usage

### Creating GHL Workflows
You can create workflows triggered by:
- `TrueFlow Qualification Status = hot` - Immediate follow-up
- `TrueFlow Lead Score > 80` - High priority leads
- `TrueFlow Selected Plan = enterprise` - Enterprise leads
- `TrueFlow Form Type = assessment` - Assessment completions

### Custom Reporting
Use the custom fields for:
- Lead quality dashboards
- Conversion tracking by plan
- Assessment score analysis
- Business type segmentation

## Support

For issues or questions:
- Email: griffin@trueflow.ai
- Check logs: `dev-server.log`
- Run diagnostics: `node test-v2-api.js`

---

Last Updated: 2025-07-29
Version: 2.0