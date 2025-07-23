# Go High Level Integration Guide

## Setup Instructions

### 1. Environment Variables Setup

Create a `.env.local` file in the root directory with your GHL credentials:

```env
# Resend API Key (for email backup)
RESEND_API_KEY=your_resend_api_key_here

# Go High Level Configuration
GHL_CLIENT_ID=your_ghl_client_id
GHL_CLIENT_SECRET=your_ghl_client_secret
GHL_LOCATION_ID=your_ghl_location_id
GHL_ACCESS_TOKEN=your_ghl_access_token
GHL_API_VERSION=2021-07-28
GHL_ENABLED=true
```

### 2. Getting Your GHL Credentials

1. **Access Token**: 
   - Log into your GHL account
   - Go to Settings → Integrations → API
   - Generate a new API token or use OAuth flow

2. **Location ID**:
   - Found in your GHL location settings
   - This is your sub-account ID

3. **OAuth Credentials** (if using OAuth):
   - Create a marketplace app in GHL
   - Get Client ID and Secret from app settings

### 3. Testing the Integration

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test the assessment flow**:
   - Navigate to http://localhost:3001/readiness-assessment
   - Complete the assessment questions
   - Fill out the contact form
   - Submit and check console for API responses

3. **Verify in GHL**:
   - Check your GHL contacts for the new lead
   - Verify custom fields are populated
   - Check tags are applied correctly

### 4. API Endpoint Details

**Endpoint**: `/api/ghl/create-lead`

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "businessName": "Acme Corp",
  "answers": {
    "current-content": "manual",
    "content-volume": "moderate",
    // ... other assessment answers
  },
  "score": 75,
  "recommendation": "Complete System",
  "timestamp": "2025-07-23T00:00:00Z"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Lead created successfully",
  "ghlContactId": "contact_id_from_ghl"
}
```

### 5. Custom Fields in GHL

The integration creates the following custom fields:
- `assessment_score` - Numeric score (0-100)
- `recommended_plan` - Text (Content Engine or Complete System)
- `business_name` - Text
- `assessment_date` - Date/time
- `assessment_[question_id]` - Each assessment answer

### 6. Tags Applied

- `trueflow-assessment` - All assessment leads
- `score-XX` - Score range (e.g., score-75)
- `content-engine` or `complete-system` - Based on recommendation
- `web-lead` - Source identifier
- Date tag (YYYY-MM-DD format)

### 7. Troubleshooting

**If leads aren't appearing in GHL**:
1. Check browser console for errors
2. Verify environment variables are set
3. Check GHL API token is valid
4. Ensure Location ID is correct
5. Check rate limits (100 requests per 10 seconds)

**Common Errors**:
- `401 Unauthorized` - Invalid API token
- `400 Bad Request` - Missing required fields
- `429 Rate Limited` - Too many requests
- `503 Service Unavailable` - GHL integration disabled

### 8. Production Deployment

Before deploying:
1. Set environment variables in your hosting platform
2. Test with a staging GHL location first
3. Enable proper error logging
4. Consider implementing webhook for updates
5. Set up monitoring for failed API calls

### 9. Security Notes

- Never commit `.env.local` file
- Use environment variables for all credentials
- Implement rate limiting on your endpoint
- Consider adding CAPTCHA for bot protection
- Log errors but not sensitive data

## Testing Without GHL Credentials

To test without real GHL credentials, set:
```env
GHL_ENABLED=false
```

This will:
- Skip the GHL API call
- Still send email notifications
- Log the would-be API payload to console
- Return success response

## Support

For issues with:
- **This integration**: Check console logs and this guide
- **GHL API**: Refer to [GHL API Documentation](https://highlevel.stoplight.io/)
- **OAuth Setup**: See [GHL OAuth Guide](https://highlevel.stoplight.io/docs/integrations/oauth)