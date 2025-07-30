# GoHighLevel Custom Field Mapping Fix

## Issues Identified and Fixed

### 1. **Unicode Character Mismatch**
- **Problem**: Field names in GHL use special unicode characters (em dash —, curly apostrophes ') that don't match when using regular characters
- **Solution**: Created `normalizeFieldName()` function in `field-mapping-v2.ts` that converts all unicode variants to standard characters for matching

### 2. **Form Type Misdetection**
- **Problem**: Getting Started forms were being detected as Assessment forms because they included score/recommendation fields from the UI flow
- **Solution**: Enhanced `detectFormType()` in V5 API to check for actual assessment-specific answer fields, not just score fields

### 3. **Field Mapping Failures**
- **Problem**: Many fields weren't being mapped despite being present in both form data and GHL
- **Solution**: 
  - Added alternate field name matching
  - Improved field lookup with normalization
  - Added comprehensive logging to track mapping success/failure

### 4. **Missing Fields in Getting Started Form**
- **Problem**: Assessment-specific fields (like Content Volume, CRM Usage, etc.) were in the mapping but not in Getting Started form data
- **Solution**: These fields are now correctly only mapped when present (i.e., in assessment forms)

## Changes Made

### 1. Created Enhanced Field Mapping (`/lib/ghl/field-mapping-v2.ts`)
- Unicode normalization for field name matching
- Support for alternate field names
- Better error handling and logging
- Comprehensive field transformation

### 2. Created New API Endpoint (`/app/api/ghl/create-lead-v5/route.ts`)
- Enhanced form type detection based on actual content
- Uses V2 field mapping with unicode support
- Detailed logging for debugging
- Returns form type in response for verification

### 3. Updated Getting Started Form
- Changed API endpoint from `/api/ghl/create-lead-v4` to `/api/ghl/create-lead-v5`

## Testing

### Run the test script:
```bash
node test-v5-fix.js
```

This will:
1. Test both V4 (broken) and V5 (fixed) endpoints
2. Submit both Getting Started and Assessment forms
3. Show the detected form type and field mapping results

### Expected Results:

#### V4 Endpoint (broken):
- Getting Started forms incorrectly show as "TrueFlow Assessment Form"
- Some fields may not populate due to unicode issues

#### V5 Endpoint (fixed):
- Getting Started forms correctly show as "TrueFlow Get Started Form"
- Assessment forms show as "TrueFlow Assessment Form"
- All fields populate correctly with proper unicode handling

## Verification in GoHighLevel

1. Look for test contacts (firstName starting with "V5TEST")
2. Check the "Contact Source" field - should show correct form type
3. Verify these fields are populated:

### For Getting Started Forms:
- ✓ Business Name
- ✓ Business Type (with full name, e.g., "Marketing Agency")
- ✓ What are your goals? (content goals list)
- ✓ Integration Preferences
- ✓ Selected Plan
- ✓ Lead Score
- ✓ Lead Quality

### Additional for Assessment Forms:
- ✓ Current Content Creation
- ✓ Content Volume
- ✓ CRM Usage
- ✓ Lead Response Time
- ✓ Time on Repetitive Tasks
- ✓ Current revenue range?
- ✓ Assessment Score
- ✓ Readiness Level

## Implementation Notes

1. The V5 endpoint is backward compatible - it handles all the same data as V4
2. Unicode normalization handles em dashes, en dashes, curly quotes, etc.
3. Form type detection is based on actual content, not just presence of score fields
4. All logging is prefixed with [API V5] for easy filtering

## Next Steps

1. Monitor the V5 endpoint in production to ensure all fields map correctly
2. Once verified, the V4 endpoint can be deprecated
3. Consider adding field validation to ensure data types match GHL expectations