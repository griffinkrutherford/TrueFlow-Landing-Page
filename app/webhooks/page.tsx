'use client'

import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import { 
  Webhook, 
  RefreshCw, 
  Trash2, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Copy,
  ExternalLink,
  Code
} from 'lucide-react'

interface WebhookEvent {
  id: string
  timestamp: string
  headers: Record<string, string>
  body: any
  type: string
  source: string
  processingTime: number
}

export default function WebhooksPage() {
  const [events, setEvents] = useState<WebhookEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<WebhookEvent | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [testLoading, setTestLoading] = useState(false)
  const [webhookUrl, setWebhookUrl] = useState('')

  // Generate webhook URL
  useEffect(() => {
    const baseUrl = window.location.origin
    setWebhookUrl(`${baseUrl}/api/webhooks/ghl`)
  }, [])

  // Fetch webhook events
  const fetchEvents = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/webhooks/ghl')
      const data = await response.json()
      setEvents(data.events || [])
    } catch (error) {
      console.error('Failed to fetch webhook events:', error)
    } finally {
      setLoading(false)
    }
  }

  // Auto-refresh
  useEffect(() => {
    fetchEvents()
    
    if (autoRefresh) {
      const interval = setInterval(fetchEvents, 2000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  // Clear all events
  const clearEvents = async () => {
    if (!confirm('Are you sure you want to clear all webhook events?')) return
    
    try {
      await fetch('/api/webhooks/ghl', { method: 'DELETE' })
      setEvents([])
      setSelectedEvent(null)
    } catch (error) {
      console.error('Failed to clear events:', error)
    }
  }

  // Copy webhook URL
  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl)
  }

  // Send test webhook
  const sendTestWebhook = async (type: string) => {
    setTestLoading(true)
    
    const testPayloads: Record<string, any> = {
      'contact.created': {
        type: 'contact.created',
        contact: {
          id: `test_contact_${Date.now()}`,
          firstName: 'Test',
          lastName: 'Contact',
          email: 'test@example.com',
          phone: '+1234567890',
          tags: ['test', 'webhook-test'],
          customFields: {
            source: 'webhook-test'
          }
        },
        locationId: 'test_location',
        timestamp: new Date().toISOString()
      },
      'opportunity.created': {
        type: 'opportunity.created',
        opportunity: {
          id: `test_opp_${Date.now()}`,
          name: 'Test Opportunity',
          contactId: 'test_contact_123',
          pipelineId: 'test_pipeline',
          pipelineStageId: 'test_stage',
          monetaryValue: 1000,
          status: 'open'
        },
        locationId: 'test_location',
        timestamp: new Date().toISOString()
      },
      'custom': {
        type: 'custom.event',
        data: {
          message: 'This is a custom test webhook',
          testId: Date.now(),
          nested: {
            value: 'test'
          }
        },
        timestamp: new Date().toISOString()
      }
    }
    
    try {
      const response = await fetch('/api/webhooks/ghl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Test-Webhook': 'true'
        },
        body: JSON.stringify(testPayloads[type] || testPayloads.custom)
      })
      
      if (response.ok) {
        // Refresh events after sending
        setTimeout(fetchEvents, 500)
      }
    } catch (error) {
      console.error('Failed to send test webhook:', error)
    } finally {
      setTestLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
              <Webhook className="h-10 w-10 text-blue-500" />
              GHL Webhook Testing
            </h1>
            <p className="text-white/70">Monitor and test GoHighLevel webhook events</p>
          </div>

          {/* Webhook URL Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
            <h2 className="text-xl font-semibold mb-4">Webhook URL</h2>
            <div className="flex items-center gap-4">
              <code className="flex-1 bg-black/50 px-4 py-3 rounded-lg text-sm font-mono text-blue-400">
                {webhookUrl}
              </code>
              <button
                onClick={copyWebhookUrl}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                title="Copy URL"
              >
                <Copy className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-white/50 mt-3">
              Configure this URL in your GoHighLevel webhook settings
            </p>
          </div>

          {/* Test Webhooks */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
            <h2 className="text-xl font-semibold mb-4">Send Test Webhook</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => sendTestWebhook('contact.created')}
                disabled={testLoading}
                className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Test Contact Created
              </button>
              <button
                onClick={() => sendTestWebhook('opportunity.created')}
                disabled={testLoading}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 px-6 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Test Opportunity Created
              </button>
              <button
                onClick={() => sendTestWebhook('custom')}
                disabled={testLoading}
                className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Test Custom Event
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <button
              onClick={fetchEvents}
              disabled={loading}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg transition-colors"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4"
              />
              <span>Auto-refresh every 2s</span>
            </label>
            
            <button
              onClick={clearEvents}
              className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 px-6 py-3 rounded-lg transition-colors ml-auto"
            >
              <Trash2 className="h-5 w-5" />
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Events List */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold mb-4">
                Webhook Events ({events.length})
              </h2>
              
              {events.length === 0 ? (
                <div className="text-center py-12 text-white/50">
                  <Webhook className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No webhook events yet</p>
                  <p className="text-sm mt-2">Send a test webhook or configure GHL to send webhooks to the URL above</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedEvent?.id === event.id
                          ? 'bg-white/20 border-white/40'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-blue-400">
                              {event.type}
                            </span>
                            <span className="text-xs bg-white/10 px-2 py-1 rounded">
                              {event.source}
                            </span>
                          </div>
                          <div className="text-sm text-white/60 flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white/50">
                            {event.processingTime}ms
                          </span>
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Event Details */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold mb-4">Event Details</h2>
              
              {selectedEvent ? (
                <div className="space-y-6">
                  {/* Headers */}
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-blue-400">Headers</h3>
                    <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm text-white/80">
                        {JSON.stringify(selectedEvent.headers, null, 2)}
                      </pre>
                    </div>
                  </div>
                  
                  {/* Body */}
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-blue-400">Body</h3>
                    <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm text-white/80">
                        {JSON.stringify(selectedEvent.body, null, 2)}
                      </pre>
                    </div>
                  </div>
                  
                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-white/60">Event ID:</span>
                      <p className="font-mono">{selectedEvent.id}</p>
                    </div>
                    <div>
                      <span className="text-white/60">Timestamp:</span>
                      <p>{new Date(selectedEvent.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-white/50">
                  <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select an event to view details</p>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-400" />
              How to Configure GHL Webhooks
            </h3>
            <ol className="space-y-2 text-sm text-white/80">
              <li>1. Log into your GoHighLevel account</li>
              <li>2. Navigate to Settings → Webhooks</li>
              <li>3. Click "Add Webhook"</li>
              <li>4. Paste the webhook URL shown above</li>
              <li>5. Select the events you want to receive</li>
              <li>6. Save and test the webhook</li>
            </ol>
            <div className="mt-4 flex gap-4">
              <a
                href="https://help.gohighlevel.com/support/solutions/articles/48001060587-webhooks"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                GHL Webhook Documentation
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}