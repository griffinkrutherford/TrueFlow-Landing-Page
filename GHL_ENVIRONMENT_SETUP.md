# GoHighLevel Environment Variables Setup

This document outlines all the environment variables needed for the GoHighLevel (GHL) integration in the TrueFlow landing page.

## Required Environment Variables

Add these to your Railway service variables:

### Core GHL Configuration

```env
# GoHighLevel API Access
GHL_ACCESS_TOKEN=your_ghl_access_token_here
GHL_LOCATION_ID=your_ghl_location_id_here
GHL_API_VERSION=2021-07-28

# Enable/Disable GHL Integration
GHL_ENABLED=true
```

### Pipeline Configuration (Optional)

If you want form submissions to create opportunities in specific pipelines:

```env
# Enable opportunity creation
GHL_CREATE_OPPORTUNITIES=true

# Pipeline IDs (get these from your GHL account)
GHL_PIPELINE_ID=your_default_pipeline_id
GHL_ASSESSMENT_PIPELINE_ID=your_assessment_pipeline_id
GHL_GETSTARTED_PIPELINE_ID=your_get_started_pipeline_id

# Pipeline Stage IDs for Assessment Form
GHL_ASSESSMENT_STAGE_NEW=stage_id_for_new_assessment_leads
GHL_ASSESSMENT_STAGE_CONTACTED=stage_id_for_contacted
GHL_ASSESSMENT_STAGE_QUALIFIED=stage_id_for_qualified
GHL_ASSESSMENT_STAGE_PROPOSAL=stage_id_for_proposal
GHL_ASSESSMENT_STAGE_WON=stage_id_for_won
GHL_ASSESSMENT_STAGE_LOST=stage_id_for_lost

# Pipeline Stage IDs for Get Started Form
GHL_GETSTARTED_STAGE_NEW=stage_id_for_new_leads
GHL_GETSTARTED_STAGE_EXPLORING=stage_id_for_exploring
GHL_GETSTARTED_STAGE_DEMO=stage_id_for_demo
GHL_GETSTARTED_STAGE_TRIAL=stage_id_for_trial
GHL_GETSTARTED_STAGE_WON=stage_id_for_won
GHL_GETSTARTED_STAGE_LOST=stage_id_for_lost
```

## Custom Fields Created in GHL

The integration will populate these custom fields automatically:

### General Fields
- `form_type` - Whether submission came from "assessment" or "get-started"
- `submission_date` - Timestamp of form submission

### Assessment Form Fields
- `assessment_score` - Score from readiness assessment (0-100)
- `recommended_plan` - Recommended pricing plan based on assessment
- `assessment_date` - Date of assessment completion
- `assessment_[question_id]` - Individual assessment answers

### Get Started Form Fields
- `business_type` - Type of business (Creator, Podcaster, etc.)
- `content_goals` - Selected content goals (comma-separated)
- `monthly_leads` - Expected monthly lead volume
- `team_size` - Size of their team
- `current_tools` - Tools they currently use (comma-separated)
- `biggest_challenge` - Their biggest content challenge
- `selected_plan` - The plan they selected

## Tags Applied

The integration automatically applies these tags:

### Common Tags
- `trueflow-[form_type]` - Either "trueflow-assessment" or "trueflow-get-started"
- `web-lead` - Indicates lead came from website
- `[date]` - Current date in YYYY-MM-DD format

### Assessment-Specific Tags
- `score-[number]` - Assessment score (e.g., "score-85")
- `[plan_name]` - Recommended plan (e.g., "professional")

### Get Started-Specific Tags
- `plan-[plan_name]` - Selected plan (e.g., "plan-growth")
- `business-[type]` - Business type (e.g., "business-content-creator")

## Setting Up in Railway

1. Go to your Railway dashboard
2. Click on your TrueFlow-Landing-Page service
3. Navigate to the "Variables" tab
4. Add each environment variable listed above
5. Railway will automatically redeploy

## Testing the Integration

After setting up the variables:

1. Submit a test form on your website
2. Check your GoHighLevel contacts for the new lead
3. Verify custom fields are populated correctly
4. Check that tags are applied
5. If using pipelines, verify opportunity creation

## Troubleshooting

If leads aren't appearing in GHL:

1. Check Railway logs for error messages
2. Verify GHL_ACCESS_TOKEN and GHL_LOCATION_ID are correct
3. Ensure the access token has proper permissions
4. Check that GHL_ENABLED is set to "true"
5. Look for rate limiting errors (429 status codes)

## Fallback Behavior

If GHL integration fails:
- Email notifications will still be sent via Resend
- Form submissions will still be logged
- Users won't see any errors (graceful degradation)