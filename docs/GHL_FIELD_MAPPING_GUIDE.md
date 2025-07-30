# GoHighLevel Custom Field Mapping Guide

## Overview

This guide explains how the TrueFlow Getting Started form data is mapped to GoHighLevel custom fields.

## Implementation Details

### 1. Field Mapping Configuration

The field mapping is defined in `/lib/ghl/field-mapping.ts`. This file contains:

- **Field Mappings**: Maps our internal form field names to actual GHL field names
- **Transform Functions**: Converts form values to the format expected by GHL
- **Dynamic Mapping**: Automatically finds field IDs based on field names

### 2. API Endpoint

The form submission is handled by `/api/ghl/create-lead-v4/route.ts` which:

1. Fetches all custom fields from GHL
2. Maps form data to the appropriate fields
3. Creates/updates the contact in GHL
4. Sends backup email notifications

### 3. Field Mappings

Here are the key field mappings currently implemented:

| Form Field | GHL Field Name | Type | Notes |
|------------|----------------|------|-------|
| businessName | Business Name | TEXT | Direct mapping |
| businessType | Business Type | SINGLE_OPTIONS | Transforms internal values to display names |
| contentGoals | What are your goals? | LARGE_TEXT | Array converted to comma-separated text |
| integrations | Integration Preferences | MULTIPLE_OPTIONS | Array converted to comma-separated text |
| selectedPlan | Selected Plan | TEXT | Plan ID converted to plan name |
| leadScore | Lead Score | NUMERICAL | Calculated based on form responses |
| leadQuality | Lead Quality | SINGLE_OPTIONS | hot/warm/cold based on score |
| assessmentScore | Assessment Score | NUMERICAL | Percentage score from assessment |
| readinessLevel | Readiness Level | TEXT | e.g., "Highly Ready", "Ready", etc. |

### 4. Assessment Answer Mappings

Assessment answers are mapped to their respective fields:

| Answer Key | GHL Field Name | Type |
|------------|----------------|------|
| current-content | Current Content Creation | SINGLE_OPTIONS |
| content-volume | Content Volume | SINGLE_OPTIONS |
| crm-usage | CRM Usage | SINGLE_OPTIONS |
| lead-response | Lead Response Time | SINGLE_OPTIONS |
| time-spent | Time on Repetitive Tasks | SINGLE_OPTIONS |
| budget | Current revenue range? | SINGLE_OPTIONS |

## How It Works

1. **Form Submission**: User completes the Getting Started form
2. **Data Preparation**: Form data is prepared with calculated scores and transformed values
3. **Field Fetching**: API fetches all custom fields from GHL
4. **Field Mapping**: Form data is mapped to GHL field IDs using field names
5. **Contact Creation**: Contact is created/updated in GHL with all mapped fields
6. **Email Backup**: Notification email is sent as backup

## Testing

### Run Field Mapping Test
```bash
npx tsx scripts/test-ghl-fields.ts
```

This will:
- Fetch all GHL custom fields
- Show field mapping results
- Identify any missing fields

### Run Form Submission Test
```bash
npx tsx scripts/test-form-submission.ts
```

This will:
- Submit a test form to the API
- Show which fields were successfully mapped
- Verify the contact was created in GHL

## Troubleshooting

### Missing Fields

If a field is not being populated:

1. Check if the field exists in GHL with the exact name
2. Verify the field name in `/lib/ghl/field-mapping.ts`
3. Check the console logs for mapping warnings

### Field Type Mismatches

Ensure the field types match:
- TEXT fields accept any string
- SINGLE_OPTIONS need exact option values
- MULTIPLE_OPTIONS are sent as comma-separated strings
- NUMERICAL fields must be numbers

### Adding New Fields

To add a new field mapping:

1. Add the field definition to `/lib/ghl/field-mapping.ts`
2. Include any necessary transform function
3. Test with the field mapping script

## Field Naming Conventions

- GHL field names should be descriptive questions or labels
- Use consistent naming for similar fields
- Avoid special characters that might cause issues

## Best Practices

1. **Always Test**: Run tests after adding new fields
2. **Transform Data**: Use transform functions to convert internal values to user-friendly text
3. **Handle Missing Fields**: The system gracefully handles missing fields without failing
4. **Backup with Email**: Always send email notifications as backup

## Example Field Creation in GHL

When creating new custom fields in GoHighLevel:

1. Go to Settings > Custom Fields
2. Click "Add Field"
3. Set the field properties:
   - Name: Use a clear, descriptive name
   - Type: Match the data type (TEXT, SINGLE_OPTIONS, etc.)
   - Model: Contact
4. For option fields, add all possible values
5. Save the field

The system will automatically detect and use new fields on the next form submission.