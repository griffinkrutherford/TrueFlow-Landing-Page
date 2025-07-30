# GoHighLevel Custom Fields Setup Guide

This guide explains how to set up and use custom fields for the TrueFlow landing page forms.

## Overview

The TrueFlow landing page has two main forms:
1. **Get Started Form** - Quick onboarding for new users
2. **Assessment Form** - Detailed readiness assessment

Both forms send data to GoHighLevel (GHL) using custom fields that must be created in GHL before use.

## Setup Instructions

### 1. Prerequisites

Ensure you have the following environment variables in your `.env.local`:
```env
GHL_ACCESS_TOKEN=your_access_token_here
GHL_LOCATION_ID=your_location_id_here
```

### 2. Create Custom Fields

Run the setup script to automatically create all required custom fields in GHL:

```bash
# Install dependencies if needed
npm install

# Run the setup script
npx ts-node scripts/setup-ghl-fields.ts
```

This script will:
- Check for existing custom fields
- Create any missing fields
- Skip fields that already exist
- Provide a summary of actions taken

### 3. Verify Setup

After running the setup script, you can verify the fields were created:

1. Log into your GoHighLevel account
2. Navigate to Settings > Custom Fields
3. Check the "Contact" custom fields section
4. You should see all the TrueFlow custom fields listed

## Custom Fields Reference

### Common Fields (Both Forms)
- **Business Name** (`business_name`) - TEXT
- **Business Type** (`business_type`) - SINGLE_OPTIONS
- **Content Goals** (`content_goals`) - LARGE_TEXT
- **Integration Preferences** (`integration_preferences`) - LARGE_TEXT
- **Selected Plan** (`selected_plan`) - TEXT
- **Lead Score** (`lead_score`) - NUMERICAL
- **Lead Quality** (`lead_quality`) - TEXT
- **Submission Date** (`submission_date`) - DATE
- **Form Type** (`form_type`) - TEXT

### Get Started Form Specific
- **Monthly Leads** (`monthly_leads`) - TEXT
- **Team Size** (`team_size`) - TEXT
- **Current Tools** (`current_tools`) - LARGE_TEXT
- **Biggest Challenge** (`biggest_challenge`) - LARGE_TEXT

### Assessment Form Specific
- **Current Content Creation** (`current_content_creation`) - SINGLE_OPTIONS
- **Content Volume** (`content_volume`) - SINGLE_OPTIONS
- **CRM Usage** (`crm_usage`) - SINGLE_OPTIONS
- **Lead Response Time** (`lead_response_time`) - SINGLE_OPTIONS
- **Time on Repetitive Tasks** (`time_on_repetitive_tasks`) - SINGLE_OPTIONS
- **Revenue Range** (`revenue_range`) - SINGLE_OPTIONS
- **Assessment Score** (`assessment_score`) - NUMERICAL
- **Readiness Level** (`readiness_level`) - TEXT
- **Assessment Answers** (`assessment_answers`) - LARGE_TEXT

## Testing

### Test Form Submissions

Use the test script to verify everything is working:

```bash
# Start the landing page server first
npm run dev

# In another terminal, run the test
node scripts/test-ghl-v5.js
```

### Manual Testing

1. **Get Started Form**: Visit http://localhost:3001/get-started
2. **Assessment Form**: Visit http://localhost:3001/readiness-assessment

## Troubleshooting

### Fields Not Populating

1. Check the console logs in your server terminal
2. Look for "[API V5] Custom fields detail:" to see what fields are being mapped
3. Verify the fields exist in GHL with matching field keys

### Form Type Detection Issues

The API uses these indicators to detect form type:
- **Assessment**: Has `source: 'readiness-assessment'` or assessment-specific fields
- **Get Started**: Has fields like `monthlyLeads`, `teamSize`, etc.

### Missing Fields Warning

If you see warnings about missing fields:
1. Run the setup script again
2. Check if the field names in GHL match exactly (case-sensitive)
3. Verify the field keys match those in `field-definitions.ts`

## API Endpoints

- **Primary**: `/api/ghl/create-lead-v5` - Latest version with improved field mapping
- **Legacy**: `/api/ghl/create-lead` - Original version (deprecated)

## Development Notes

### Adding New Fields

1. Add the field definition to `/lib/ghl/field-definitions.ts`
2. Update the field mapping in `/lib/ghl/field-mapping-v3.ts`
3. Run the setup script to create the field in GHL
4. Test with the test script

### Field Naming Conventions

- Use descriptive names that match the UI labels
- Field keys should use snake_case (e.g., `business_name`)
- Field names can use natural language (e.g., "Business Name")

## Support

If you encounter issues:
1. Check the server logs for detailed error messages
2. Verify your GHL API credentials are correct
3. Ensure all required fields exist in GHL
4. Test with the provided test scripts before production use