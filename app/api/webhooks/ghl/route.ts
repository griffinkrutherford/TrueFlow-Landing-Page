import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Store webhook events in memory for testing (in production, use a database)
const webhookEvents: any[] = []
const MAX_EVENTS = 100

// GHL Webhook endpoint
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Get raw body for signature verification
    const rawBody = await request.text()
    const headers = Object.fromEntries(request.headers.entries())
    
    // Log webhook receipt
    console.log('[Webhook] Received GHL webhook')
    console.log('[Webhook] Headers:', JSON.stringify(headers, null, 2))
    
    // Parse body
    let body: any
    try {
      body = JSON.parse(rawBody)
    } catch (e) {
      console.error('[Webhook] Failed to parse body:', e)
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }
    
    console.log('[Webhook] Body:', JSON.stringify(body, null, 2))
    
    // Verify webhook signature if secret is configured
    const webhookSecret = process.env.GHL_WEBHOOK_SECRET
    if (webhookSecret && webhookSecret !== 'your_webhook_secret_here') {
      const signature = headers['x-ghl-signature'] || headers['x-webhook-signature']
      
      if (!signature) {
        console.warn('[Webhook] No signature provided')
      } else {
        const expectedSignature = crypto
          .createHmac('sha256', webhookSecret)
          .update(rawBody)
          .digest('hex')
        
        if (signature !== expectedSignature) {
          console.error('[Webhook] Invalid signature')
          return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
        }
        console.log('[Webhook] Signature verified')
      }
    }
    
    // Store event for testing
    const event = {
      id: `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      headers: headers,
      body: body,
      type: body.type || body.event || 'unknown',
      source: 'ghl',
      processingTime: Date.now() - startTime
    }
    
    webhookEvents.unshift(event)
    if (webhookEvents.length > MAX_EVENTS) {
      webhookEvents.length = MAX_EVENTS
    }
    
    // Handle different webhook types
    const eventType = body.type || body.event
    console.log(`[Webhook] Processing event type: ${eventType}`)
    
    switch (eventType) {
      case 'contact.created':
      case 'ContactCreate':
        console.log('[Webhook] New contact created:', body.contact?.id || body.id)
        break
        
      case 'contact.updated':
      case 'ContactUpdate':
        console.log('[Webhook] Contact updated:', body.contact?.id || body.id)
        break
        
      case 'opportunity.created':
      case 'OpportunityCreate':
        console.log('[Webhook] New opportunity created:', body.opportunity?.id || body.id)
        break
        
      case 'opportunity.updated':
      case 'OpportunityUpdate':
        console.log('[Webhook] Opportunity updated:', body.opportunity?.id || body.id)
        break
        
      default:
        console.log('[Webhook] Unhandled event type:', eventType)
    }
    
    // Return success
    return NextResponse.json({
      success: true,
      message: 'Webhook processed',
      eventId: event.id,
      processingTime: `${Date.now() - startTime}ms`
    })
    
  } catch (error) {
    console.error('[Webhook] Error processing webhook:', error)
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET endpoint to retrieve webhook events for testing
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const eventId = searchParams.get('id')
  const limit = parseInt(searchParams.get('limit') || '20')
  const type = searchParams.get('type')
  
  // Return specific event
  if (eventId) {
    const event = webhookEvents.find(e => e.id === eventId)
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    return NextResponse.json(event)
  }
  
  // Filter by type if specified
  let events = webhookEvents
  if (type) {
    events = events.filter(e => e.type === type)
  }
  
  // Return list of events
  return NextResponse.json({
    events: events.slice(0, limit),
    total: events.length,
    types: Array.from(new Set(webhookEvents.map(e => e.type))),
    oldestEvent: webhookEvents[webhookEvents.length - 1]?.timestamp,
    newestEvent: webhookEvents[0]?.timestamp
  })
}

// DELETE endpoint to clear webhook events (for testing)
export async function DELETE() {
  const count = webhookEvents.length
  webhookEvents.length = 0
  
  return NextResponse.json({
    success: true,
    message: `Cleared ${count} webhook events`
  })
}