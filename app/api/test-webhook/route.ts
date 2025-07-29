import { NextRequest, NextResponse } from 'next/server'

// Test webhook sender - simulates GHL sending webhooks
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type') || 'contact.created'
  const delay = parseInt(searchParams.get('delay') || '0')
  
  // Wait if delay specified
  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, delay))
  }
  
  // Simulate different webhook payloads
  const webhookPayloads: Record<string, any> = {
    'contact.created': {
      type: 'contact.created',
      eventId: `evt_${Date.now()}`,
      contact: {
        id: `con_${Math.random().toString(36).substr(2, 9)}`,
        locationId: 'loc_123456',
        firstName: 'John',
        lastName: 'Doe',
        email: `john.doe${Date.now()}@example.com`,
        phone: '+1234567890',
        dateAdded: new Date().toISOString(),
        tags: ['new-lead', 'web-form'],
        source: 'TrueFlow Landing Page',
        customFields: [
          { id: 'field1', value: 'Test Value' }
        ]
      },
      timestamp: new Date().toISOString()
    },
    'contact.updated': {
      type: 'contact.updated',
      eventId: `evt_${Date.now()}`,
      contact: {
        id: 'con_existing123',
        locationId: 'loc_123456',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+0987654321',
        dateUpdated: new Date().toISOString(),
        tags: ['updated', 'customer'],
        customFields: [
          { id: 'field1', value: 'Updated Value' }
        ]
      },
      changedFields: ['tags', 'customFields'],
      timestamp: new Date().toISOString()
    },
    'opportunity.created': {
      type: 'opportunity.created',
      eventId: `evt_${Date.now()}`,
      opportunity: {
        id: `opp_${Math.random().toString(36).substr(2, 9)}`,
        locationId: 'loc_123456',
        contactId: 'con_123456',
        name: 'New Sales Opportunity',
        pipelineId: 'pipe_sales',
        pipelineStageId: 'stage_new',
        status: 'open',
        monetaryValue: 2500,
        currency: 'USD',
        source: 'Website',
        dateAdded: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    },
    'appointment.scheduled': {
      type: 'appointment.scheduled',
      eventId: `evt_${Date.now()}`,
      appointment: {
        id: `apt_${Math.random().toString(36).substr(2, 9)}`,
        locationId: 'loc_123456',
        contactId: 'con_123456',
        calendarId: 'cal_123456',
        title: 'Discovery Call',
        startTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        endTime: new Date(Date.now() + 90000000).toISOString(), // Tomorrow + 1hr
        status: 'confirmed',
        appointmentStatus: 'scheduled'
      },
      timestamp: new Date().toISOString()
    },
    'test.ping': {
      type: 'test.ping',
      eventId: `evt_${Date.now()}`,
      message: 'This is a test webhook from GoHighLevel',
      timestamp: new Date().toISOString()
    }
  }
  
  const payload = webhookPayloads[type] || webhookPayloads['test.ping']
  
  try {
    // Send webhook to our endpoint
    const webhookUrl = `${request.nextUrl.origin}/api/webhooks/ghl`
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-GHL-Signature': 'test-signature-123',
        'X-Webhook-Source': 'gohighlevel',
        'X-Event-Type': type,
        'X-Event-Id': payload.eventId
      },
      body: JSON.stringify(payload)
    })
    
    const result = await response.json()
    
    return NextResponse.json({
      test: {
        type,
        webhookUrl,
        timestamp: new Date().toISOString()
      },
      webhookPayload: payload,
      webhookResponse: {
        status: response.status,
        statusText: response.statusText,
        result
      }
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to send test webhook',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST endpoint for custom webhook payloads
export async function POST(request: NextRequest) {
  try {
    const customPayload = await request.json()
    const webhookUrl = `${request.nextUrl.origin}/api/webhooks/ghl`
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-GHL-Signature': 'custom-test-signature',
        'X-Webhook-Source': 'gohighlevel-test',
        'X-Custom-Test': 'true'
      },
      body: JSON.stringify(customPayload)
    })
    
    const result = await response.json()
    
    return NextResponse.json({
      test: {
        method: 'POST',
        webhookUrl,
        timestamp: new Date().toISOString()
      },
      webhookPayload: customPayload,
      webhookResponse: {
        status: response.status,
        statusText: response.statusText,
        result
      }
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to send custom webhook',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}