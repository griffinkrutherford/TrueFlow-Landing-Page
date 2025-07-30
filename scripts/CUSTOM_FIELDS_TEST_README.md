# Custom Fields Test Suite

This directory contains a comprehensive test suite for testing custom fields integration with GoHighLevel (GHL) in the TrueFlow landing page.

## Test Files

### 1. `test-custom-fields.js` - API Test Script
Comprehensive test suite that tests the API endpoints with various data combinations.

**Features:**
- Tests both Get Started and Assessment forms
- Tests with full data, minimal data, and edge cases
- Validates response format and custom field population
- Tests field validation and error handling
- Provides detailed pass/fail reporting

**Usage:**
```bash
# Run basic tests
npm run test:fields

# Run with verbose output
npm run test:fields:verbose

# Run against a different URL
npm run test:fields -- http://localhost:3000
```

### 2. `test-ghl-integration.ts` - Integration Test
End-to-end integration test that verifies data flow from form submission to GHL.

**Features:**
- Runs setup script to ensure custom fields exist
- Submits multiple test contacts with different data
- Fetches contacts from GHL API to verify field values
- Compares expected vs actual field values
- Tests both form types with various scoring scenarios

**Prerequisites:**
- Valid GHL_ACCESS_TOKEN in .env.local
- Valid GHL_LOCATION_ID in .env.local

**Usage:**
```bash
# Run integration tests
npm run test:integration

# Run with verbose output
npm run test:integration:verbose
```

### 3. `verify-ghl-fields.ts` - Field Verification Tool
Interactive tool to verify custom field values in GHL contacts.

**Features:**
- Fetches and displays all custom fields for a contact
- Shows recent contacts if no specific contact provided
- Groups fields by category (TrueFlow, Assessment, Other)
- Compares expected vs actual values for test contacts
- Color-coded output for easy reading

**Usage:**
```bash
# Show recent contacts
npm run verify:fields

# Verify specific contact by email
npm run verify:fields -- test@example.com

# Verify specific contact by ID
npm run verify:fields -- ghl_contact_id_here
```

## Test Scenarios Covered

### Get Started Form Tests
1. **Full Data** - All fields populated with valid data
   - Business type: agency
   - Multiple content goals and integrations
   - Expected high lead score (75+)

2. **Minimal Data** - Only required fields
   - Basic business type
   - Single content goal
   - Expected medium lead score (50+)

3. **Edge Cases** - Special characters and empty arrays
   - Names with quotes and special characters
   - Empty arrays for multi-select fields
   - Tests data sanitization

### Assessment Form Tests
1. **High Score** (90+)
   - Advanced readiness level
   - Enterprise recommendations
   - Expected "hot" lead quality

2. **Low Score** (25)
   - Beginner readiness level
   - Starter recommendations
   - Expected "cold" lead quality

3. **Partial Data**
   - Only some assessment answers
   - Tests default value handling

### Validation Tests
- Missing required fields
- Invalid email format
- Invalid form type
- Proper error responses

## Running All Tests

To run the complete test suite:

```bash
# Run all tests in sequence
npm run test:all

# Or run individually
npm run test:fields
npm run test:integration
npm run verify:fields
```

## Test Data Patterns

Test emails follow these patterns:
- Get Started: `cf-{type}-{timestamp}@example.com`
- Assessment: `assessment-{type}-{timestamp}@example.com`
- Integration: `int-{type}-{timestamp}@example.com`

This helps identify test data in GHL and during verification.

## Troubleshooting

### Common Issues

1. **"Port already in use"**
   - Ensure the landing page is running on port 3001
   - Run `npm run dev:kill-port` if needed

2. **"Missing GHL credentials"**
   - Ensure .env.local has valid GHL_ACCESS_TOKEN and GHL_LOCATION_ID
   - Run `npm run validate:env` to check

3. **"Custom fields not found"**
   - Run the setup script: `node setup-ghl-custom-fields.js`
   - Check GHL location has custom fields enabled

4. **"Contact not created"**
   - Check GHL API limits
   - Verify credentials are valid
   - Check for duplicate email addresses

### Debug Mode

For detailed debugging information:

1. Use `--verbose` flag with any test script
2. Check server logs: `npm run dev:logs`
3. Use the verify tool to inspect specific contacts

## Cleanup

Test contacts are created with identifiable email patterns. To clean up:

1. Search GHL for emails containing: `cf-test`, `assessment-`, `int-`
2. Bulk delete test contacts
3. Or use GHL's contact management tools

## CI/CD Integration

These tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Start landing page
  run: npm run dev:daemon
  
- name: Wait for server
  run: sleep 5
  
- name: Run field tests
  run: npm run test:fields
  
- name: Stop server
  run: npm run dev:stop
```

## Best Practices

1. **Rate Limiting**: Tests include delays to avoid hitting API limits
2. **Unique Emails**: Each test uses timestamps to ensure unique emails
3. **Cleanup**: Document which contacts were created for easy cleanup
4. **Validation**: Always validate environment before running tests
5. **Isolation**: Each test is independent and can run separately

## Contributing

When adding new tests:
1. Follow the existing test structure
2. Use descriptive test names
3. Include both positive and negative test cases
4. Document expected vs actual values
5. Add cleanup instructions if creating data