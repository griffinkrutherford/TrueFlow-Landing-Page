# GoHighLevel Custom Fields Implementation

## Overview
This document describes the implementation of GoHighLevel custom fields to replace excessive tag usage in the TrueFlow landing page forms.

## Changes Made

### 1. Created Custom Fields Management System
- **File**: `/lib/ghl/custom-fields-v2.ts`
- **Purpose**: Comprehensive custom field definitions and management
- **Features**:
  - Defines all form fields as structured custom fields
  - Automatic field creation in GoHighLevel
  - Field mapping and validation
  - Lead scoring and quality calculation

### 2. New API Endpoint (V3)
- **File**: `/app/api/ghl/create-lead-v3/route.ts`
- **Purpose**: Uses custom fields instead of excessive tags
- **Key Improvements**:
  - Only 4 essential tags (vs. 20+ before)
  - All form data stored in custom fields
  - Better data organization in GoHighLevel
  - Maintains backward compatibility with email notifications

### 3. Updated Forms
- **Get Started Form**: `/app/get-started/page.tsx`
- **Assessment Form**: `/app/readiness-assessment/page.tsx`
- Both forms now use the V3 endpoint

## Custom Fields Created

### Get Started Form Fields
- `trueflow_business_name` - Business name
- `trueflow_business_type` - Type of business (dropdown)
- `trueflow_content_goals` - Content creation goals (multi-select)
- `trueflow_integrations` - Integration preferences (multi-select)
- `trueflow_selected_plan` - Selected pricing plan
- `trueflow_submission_date` - Form submission date
- `trueflow_lead_score` - Calculated lead score (0-100)
- `trueflow_lead_quality` - Lead quality (hot/warm/cold)

### Assessment Form Fields
- `trueflow_assessment_score` - Assessment score percentage
- `trueflow_readiness_level` - AI readiness level
- `trueflow_recommended_plan` - Recommended plan based on assessment
- `trueflow_current_content` - Current content creation method
- `trueflow_content_volume` - Monthly content volume needs
- `trueflow_crm_usage` - Current CRM usage level
- `trueflow_lead_response` - Typical lead response time
- `trueflow_time_spent` - Time spent on repetitive tasks
- `trueflow_budget` - Monthly budget range

## Minimal Tag Usage
Only 4 essential tags are now used:
1. `web-lead` - Identifies leads from website
2. `lead-quality-{hot|warm|cold}` - Lead quality indicator
3. `assessment-form` or `get-started-form` - Form source
4. `submitted-YYYY-MM` - Submission month for reporting

## Testing

### Local Testing
```bash
# Run the test script
node test-custom-fields-local.js

# Test with curl
curl -X POST http://localhost:3001/api/ghl/create-lead-v3 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "businessName": "Test Business",
    "businessType": "agency",
    "contentGoals": ["newsletters", "blogs"],
    "integrations": ["gohighlevel"],
    "selectedPlan": "complete_system"
  }'
```

### Expected Response
```json
{
  "success": true,
  "message": "Lead processed successfully",
  "ghlContactId": "contact_id_here",
  "leadScore": 80,
  "leadQuality": "hot",
  "customFieldsUsed": 8,
  "tagsUsed": 4
}
```

## Configuration Required

### GoHighLevel Setup
1. Update `.env.local` with actual GoHighLevel credentials:
   ```
   GHL_LOCATION_ID=your_actual_location_id
   GHL_ACCESS_TOKEN=your_actual_access_token
   ```

2. The system will automatically create custom fields on first use

3. Custom fields will appear in GoHighLevel under:
   - Settings > Custom Fields > Contact Fields

## Benefits
1. **Cleaner Data**: Structured fields instead of tag soup
2. **Better Filtering**: Easy to search and segment contacts
3. **Scalability**: No more tag proliferation
4. **Reporting**: Better analytics with structured data
5. **Performance**: Faster lookups with indexed fields

## Rollback Plan
If needed, the previous V2 endpoint is still available at `/api/ghl/create-lead-v2`.

## Next Steps
1. Deploy to production after testing
2. Monitor custom field creation in GoHighLevel
3. Update any existing workflows to use custom fields
4. Create GoHighLevel reports using the new custom fields