# GoHighLevel Pipeline Structure & Custom Field Documentation

## Overview

This document details the enhanced GoHighLevel integration pipeline structure, custom field mappings, and scoring logic implemented for TrueFlow AI's lead management system.

## Pipeline Structure

### 1. Assessment Pipeline

**Purpose**: Manages leads from the Readiness Assessment form

**Pipeline Stages**:

| Stage | Internal Key | Description | Score Range | Actions |
|-------|-------------|-------------|-------------|---------|
| Nurture | `nurture` | Needs education | < 40 | - Send educational content<br>- Schedule for nurture campaign<br>- Quarterly check-ins |
| Contacted | `contacted` | Initial outreach | 40-60 | - Personal outreach within 24h<br>- Schedule discovery call<br>- Send relevant case studies |
| Qualified | `qualified` | Good fit, ready to engage | 60-80 | - Priority follow-up<br>- Demo scheduling<br>- Custom proposal prep |
| Hot Lead | `hot_lead` | High intent, immediate need | > 80 | - Immediate call (same day)<br>- Fast-track demo<br>- Executive involvement |
| Proposal | `proposal` | Proposal sent | Manual move | - Proposal tracking<br>- Follow-up sequences |
| Won | `customer` | Closed deal | Manual move | - Onboarding trigger<br>- Success team handoff |
| Lost | `lost` | Deal lost | Manual move | - Loss reason tracking<br>- Re-engagement campaign |

### 2. Get Started Pipeline

**Purpose**: Manages leads from the Get Started form

**Pipeline Stages**:

| Stage | Internal Key | Description | Trigger | Actions |
|-------|-------------|-------------|---------|---------|
| New Lead | `new` | Fresh submission | Default | - Welcome email<br>- Assign to rep |
| Exploring | `exploring` | Evaluating options | Starter/Professional plans | - Product education<br>- Feature comparison<br>- Trial offer |
| Engaged | `engaged` | High-value prospect | Growth/Enterprise plans OR high score | - Priority assignment<br>- Custom demo prep<br>- Executive briefing |
| Demo Scheduled | `demo` | Demo booked | Manual move | - Demo confirmation<br>- Prep materials<br>- Reminder sequence |
| Trial | `trial` | Using trial | Manual move | - Trial support<br>- Usage tracking<br>- Success metrics |
| Negotiation | `negotiation` | Price/terms discussion | Manual move | - Pricing flexibility<br>- Contract prep |
| Won | `customer` | Closed deal | Manual move | - Onboarding<br>- Implementation |
| Lost | `lost` | Deal lost | Manual move | - Feedback collection<br>- Future follow-up |

## Lead Quality Scoring System

### Score Calculation

The system calculates a lead quality score (0-100) based on multiple factors:

#### Assessment Form Scoring

Base score = Assessment score (0-100)

**Bonus Points**:
- Budget = "high": +10 points
- Timeline = "immediate": +15 points
- Decision maker = "yes": +10 points

#### Get Started Form Scoring

**Base scores by plan**:
- Starter: 25 points
- Professional: 50 points
- Growth: 75 points
- Enterprise: 100 points

**Bonus Points**:
- Monthly leads 50+ : +10 points
- Team size 5+: +10 points
- 3+ current tools: +5 points
- Business type (Agency/SaaS): +5 points

### Score Interpretation

| Score Range | Lead Quality | Recommended Action |
|-------------|--------------|-------------------|
| 0-25 | Cold | Long-term nurture |
| 26-50 | Warm | Standard follow-up |
| 51-75 | Qualified | Priority attention |
| 76-100 | Hot | Immediate action |

## Custom Field Mappings

### Common Fields (All Forms)

| Field Key | Field Name | Description | Data Type |
|-----------|------------|-------------|-----------|
| `form_type` | Form Type | Source form (assessment/get-started) | Text |
| `submission_date` | Submission Date | ISO timestamp of submission | DateTime |
| `lead_quality_score` | Lead Quality Score | Calculated score (0-100) | Number |
| `lead_source` | Lead Source | Always "TrueFlow Website" | Text |
| `last_activity_date` | Last Activity | Last interaction timestamp | DateTime |
| `engagement_score` | Engagement Score | Behavioral score | Number |
| `nurture_stage` | Nurture Stage | Current nurture status | Text |

### Assessment-Specific Fields

| Field Key | Field Name | Description | Data Type |
|-----------|------------|-------------|-----------|
| `assessment_score` | Assessment Score | Raw assessment score (0-100) | Number |
| `recommended_plan` | Recommended Plan | AI-recommended pricing plan | Text |
| `assessment_date` | Assessment Date | When assessment was taken | DateTime |
| `assessment_readiness_level` | Readiness Level | Ready/Not Ready/Ready Now | Text |
| `assessment_[question_id]` | Individual Answers | Each assessment answer | Text |

### Get Started Form Fields

| Field Key | Field Name | Description | Data Type |
|-----------|------------|-------------|-----------|
| `business_type` | Business Type | Type of business | Select |
| `content_goals` | Content Goals | Selected goals (comma-separated) | Text |
| `monthly_leads` | Monthly Leads | Expected lead volume | Select |
| `team_size` | Team Size | Company size | Select |
| `current_tools` | Current Tools | Tools in use (comma-separated) | Text |
| `biggest_challenge` | Biggest Challenge | Primary pain point | LongText |
| `selected_plan` | Selected Plan | Chosen pricing plan | Select |
| `industry` | Industry | Derived from business type | Text |
| `annual_revenue` | Annual Revenue | Estimated from signals | Number |

## Tag Structure

### Tag Categories

1. **Source Tags**
   - `trueflow-assessment`
   - `trueflow-get-started`
   - `web-lead`

2. **Date Tags**
   - Format: `YYYY-MM-DD`
   - Example: `2025-07-29`

3. **Score Tags**
   - `quality-score-[0-100]` (in increments of 10)
   - `score-[exact]` (assessment score)
   - Temperature: `hot-lead`, `qualified-lead`, `warm-lead`, `cold-lead`

4. **Plan Tags**
   - `plan-starter`
   - `plan-professional`
   - `plan-growth`
   - `plan-enterprise`

5. **Business Tags**
   - `business-[type]` (e.g., `business-marketing-agency`)
   - `team-size-[range]`
   - `monthly-leads-[range]`

6. **Value Tags**
   - `high-value` (Enterprise/Growth)
   - `medium-value` (Professional)
   - `entry-level` (Starter)

## Opportunity Creation

### Opportunity Details

**Naming Convention**:
- Assessment: `[First] [Last] - Assessment ([Plan])`
- Get Started: `[First] [Last] - [Plan] Plan`

**Monetary Values**:

| Plan | Monthly | Annual | LTV (3-year) |
|------|---------|---------|--------------|
| Starter | $97 | $970 | $2,910 |
| Professional | $297 | $2,970 | $8,910 |
| Growth | $497 | $4,970 | $14,910 |
| Enterprise | $997 | $9,970 | $29,910 |

**Value Assignment Logic**:
- Default: Annual value
- If team 10+ or leads 100+: Use LTV
- If enterprise indicators present: Use LTV

### Opportunity Notes

Each opportunity automatically receives a note with:
- Lead quality score
- Form type and submission details
- Business information
- Goals and challenges
- Assessment results (if applicable)

## Implementation Requirements

### Environment Variables

```env
# Core Configuration
GHL_ACCESS_TOKEN=your_token
GHL_LOCATION_ID=your_location_id
GHL_API_VERSION=2021-07-28
GHL_CREATE_OPPORTUNITIES=true

# Pipeline IDs
GHL_ASSESSMENT_PIPELINE_ID=assessment_pipeline_id
GHL_GETSTARTED_PIPELINE_ID=getstarted_pipeline_id

# Assessment Pipeline Stages
GHL_ASSESSMENT_STAGE_NEW=stage_id
GHL_ASSESSMENT_STAGE_NURTURE=stage_id
GHL_ASSESSMENT_STAGE_CONTACTED=stage_id
GHL_ASSESSMENT_STAGE_QUALIFIED=stage_id
GHL_ASSESSMENT_STAGE_HOT=stage_id
GHL_ASSESSMENT_STAGE_PROPOSAL=stage_id
GHL_ASSESSMENT_STAGE_WON=stage_id
GHL_ASSESSMENT_STAGE_LOST=stage_id

# Get Started Pipeline Stages
GHL_GETSTARTED_STAGE_NEW=stage_id
GHL_GETSTARTED_STAGE_EXPLORING=stage_id
GHL_GETSTARTED_STAGE_ENGAGED=stage_id
GHL_GETSTARTED_STAGE_DEMO=stage_id
GHL_GETSTARTED_STAGE_TRIAL=stage_id
GHL_GETSTARTED_STAGE_NEGOTIATION=stage_id
GHL_GETSTARTED_STAGE_WON=stage_id
GHL_GETSTARTED_STAGE_LOST=stage_id

# Optional
GHL_DEFAULT_USER_ID=user_id_for_assignment
```

### Custom Fields Setup in GHL

1. Navigate to Settings > Custom Fields in your GHL location
2. Create all fields listed in the Custom Field Mappings section
3. Note the field keys (they should match our mapping)
4. Set appropriate field types (Text, Number, DateTime, etc.)

### Pipeline Setup in GHL

1. Create two pipelines: "Assessment Leads" and "Get Started Leads"
2. Add all stages listed in the Pipeline Structure section
3. Note the pipeline IDs and stage IDs
4. Configure stage automation as needed

## Testing the Integration

### Test Commands

```bash
# Test comprehensive integration
node test-ghl-comprehensive.js

# Test with verbose output
VERBOSE=true node test-ghl-comprehensive.js

# Test against production
API_BASE=https://your-domain.com node test-ghl-comprehensive.js

# Test specific scenarios
node test-ghl-integration.js
node test-ghl-edge-cases.js
```

### Validation Checklist

- [ ] Contacts created without duplicates
- [ ] All custom fields populated correctly
- [ ] Tags applied appropriately
- [ ] Lead quality scores calculated accurately
- [ ] Pipeline stages assigned based on scores
- [ ] Opportunities created with correct values
- [ ] Notes added to opportunities
- [ ] Email notifications sent as backup
- [ ] Existing contacts updated (not duplicated)

## Troubleshooting

### Common Issues

1. **"GHL not configured" message**
   - Verify environment variables are set
   - Check that values don't contain "your_" placeholder

2. **Contacts not appearing in pipeline**
   - Verify pipeline IDs are correct
   - Check stage IDs match your GHL setup
   - Ensure opportunities are enabled

3. **Custom fields not showing**
   - Confirm field keys match exactly
   - Check field types in GHL
   - Verify field permissions

4. **Score calculations seem wrong**
   - Review scoring logic in code
   - Check all bonus conditions
   - Verify data is being passed correctly

### Debug Mode

Enable detailed logging by setting:
```env
NODE_ENV=development
```

This will include full error details in API responses.

## Best Practices

1. **Lead Response Time**
   - Hot leads (80+): Contact within 1 hour
   - Qualified (60-80): Contact within 4 hours
   - Warm (40-60): Contact within 24 hours
   - Cold (<40): Add to nurture campaign

2. **Data Quality**
   - Regularly audit custom field data
   - Monitor tag usage for consistency
   - Review opportunity values monthly

3. **Pipeline Management**
   - Weekly pipeline reviews
   - Stage velocity tracking
   - Conversion rate monitoring

4. **Integration Health**
   - Monitor API response times
   - Check email backup delivery
   - Review error logs weekly