# TrueFlow Dual-System Transition Plan
*From GoHighLevel Agency to Proprietary System*

## Phase 1: Parallel Data Capture (Current → 2 weeks)
Keep existing flow while adding your own database storage.

### Implementation:
```typescript
// In /app/api/lead-notification/route.ts, add after email send:

// Save to your own database (Supabase example)
const { data: leadRecord, error: dbError } = await supabase
  .from('leads')
  .insert({
    ...leadData,
    source: 'readiness_assessment',
    ghl_sync_status: 'pending'
  })
  .select()
  .single()

// Continue with GHL submission
if (process.env.GHL_ENABLED === 'true') {
  await fetch('/api/ghl/create-lead', {
    method: 'POST',
    body: JSON.stringify({
      ...leadData,
      internal_lead_id: leadRecord.id
    })
  })
}
```

## Phase 2: Add GHL Form Webhook (2-4 weeks)
Capture leads from embedded GHL forms into your system.

### 1. Create Webhook Endpoint:
```typescript
// /app/api/webhooks/ghl/form-submission/route.ts
export async function POST(request: Request) {
  const payload = await request.json()
  
  // Verify webhook signature
  if (!verifyGHLWebhook(request)) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  // Extract lead data from GHL form submission
  const leadData = {
    firstName: payload.contact.firstName,
    lastName: payload.contact.lastName,
    email: payload.contact.email,
    phone: payload.contact.phone,
    // Map GHL custom fields to your schema
    businessName: payload.customFields?.business_name,
    // ... other fields
  }
  
  // Save to your database
  await saveLeadToDatabase(leadData)
  
  // Send email notification
  await sendLeadNotification(leadData)
  
  return new Response('OK', { status: 200 })
}
```

### 2. Configure GHL Webhook:
1. In GHL, go to Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/webhooks/ghl/form-submission`
3. Select events: "Contact Created", "Form Submitted"
4. Save webhook secret for verification

## Phase 3: Dual Form Submission (4-6 weeks)
Submit to both GHL and your system simultaneously.

### Option A: Client-Side Dual Submission
```typescript
const handleSubmit = async () => {
  const leadData = collectFormData()
  
  // Submit to your system
  const internalResponse = await fetch('/api/leads/create', {
    method: 'POST',
    body: JSON.stringify(leadData)
  })
  
  // Submit to GHL (if enabled)
  if (window.GHL_FORMS_ENABLED) {
    // Trigger GHL form submission via their JS SDK
    window.ghl.forms.submit('form_id', leadData)
  }
  
  // Or submit to GHL via your API
  await fetch('/api/ghl/create-lead', {
    method: 'POST',
    body: JSON.stringify(leadData)
  })
}
```

### Option B: Server-Side Fan-Out
```typescript
// /app/api/leads/create/route.ts
export async function POST(request: Request) {
  const leadData = await request.json()
  
  // Save to your database first
  const lead = await db.leads.create({ data: leadData })
  
  // Fan out to integrations
  const integrations = [
    ghlIntegration.createLead(leadData),
    emailService.sendNotification(leadData),
    // Future: other CRMs, marketing tools
  ]
  
  // Execute in parallel, don't fail if one fails
  await Promise.allSettled(integrations)
  
  return Response.json({ success: true, leadId: lead.id })
}
```

## Phase 4: Feature Parity & Migration (6-12 weeks)

### Build Equivalent Features:
1. Lead scoring & qualification
2. Automated follow-up sequences
3. Pipeline management
4. Email/SMS campaigns
5. Reporting & analytics

### Migration Tools:
```typescript
// /app/api/migration/sync-from-ghl/route.ts
export async function POST() {
  // Fetch all contacts from GHL
  const ghlContacts = await fetchAllGHLContacts()
  
  // Import to your database
  for (const contact of ghlContacts) {
    await upsertContact(contact)
  }
  
  // Sync custom fields, tags, etc.
}
```

## Phase 5: Gradual Cutover (3-6 months)

### Feature Flags for Transition:
```typescript
const features = {
  useInternalCRM: process.env.USE_INTERNAL_CRM === 'true',
  syncToGHL: process.env.SYNC_TO_GHL === 'true',
  showGHLForms: process.env.SHOW_GHL_FORMS === 'true',
}
```

### A/B Testing:
- Route 50% of traffic to your forms
- Route 50% to GHL forms
- Compare conversion rates

## Benefits of This Approach:

1. **Zero Downtime** - No disruption to lead capture
2. **Data Integrity** - All leads captured in both systems
3. **Gradual Validation** - Test your system with real data
4. **Easy Rollback** - Can revert to GHL if issues arise
5. **Learn from GHL** - See what works in their system

## Technical Considerations:

### 1. Webhook Security:
```typescript
function verifyGHLWebhook(request: Request): boolean {
  const signature = request.headers.get('X-GHL-Signature')
  const payload = await request.text()
  const expectedSig = crypto
    .createHmac('sha256', process.env.GHL_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex')
  return signature === expectedSig
}
```

### 2. Rate Limiting:
- GHL API: 120 requests/minute
- Implement queuing for bulk operations
- Use webhooks for real-time updates

### 3. Data Mapping:
Create a mapping layer between GHL fields and your schema:
```typescript
const fieldMapping = {
  ghl_field: 'your_field',
  'customFields.business_name': 'businessName',
  'tags': 'labels',
  // etc.
}
```

## Timeline Summary:

- **Weeks 1-2**: Parallel data capture
- **Weeks 3-4**: GHL webhook integration  
- **Weeks 5-6**: Dual form submission
- **Months 2-3**: Feature development
- **Months 4-6**: Migration & cutover

This approach ensures business continuity while building your proprietary system!