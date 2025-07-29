'use client'

import { useState } from 'react'
import Navigation from '../components/Navigation'

export default function TestGHLPage() {
  const [selectedScenario, setSelectedScenario] = useState('assessment')
  const [customData, setCustomData] = useState('')
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const scenarios = [
    { value: 'assessment', label: 'Assessment Form (Complete)' },
    { value: 'simple', label: 'Simple Get Started Form' },
    { value: 'minimal', label: 'Minimal Data' },
    { value: 'broken', label: 'Broken Data (Test Error Handling)' },
    { value: 'custom', label: 'Custom JSON' }
  ]

  const defaultCustomData = {
    firstName: "Custom",
    lastName: "Test",
    email: "custom@example.com",
    phone: "1234567890",
    businessName: "Custom Business",
    businessType: "SaaS",
    contentGoals: ["blog"],
    pricingPlan: "growth",
    timestamp: new Date().toISOString(),
    source: "test"
  }

  const testScenario = async () => {
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const res = await fetch(`/api/test-ghl?scenario=${selectedScenario}`)
      const data = await res.json()
      setResponse(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const testCustomData = async () => {
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const dataToSend = customData || JSON.stringify(defaultCustomData, null, 2)
      const parsedData = JSON.parse(dataToSend)
      
      const res = await fetch('/api/test-ghl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedData)
      })
      
      const data = await res.json()
      setResponse(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">GHL API Test Tool</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Test Controls */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-semibold mb-6">Test Scenarios</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Scenario</label>
                  <select
                    value={selectedScenario}
                    onChange={(e) => setSelectedScenario(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
                  >
                    {scenarios.map(scenario => (
                      <option key={scenario.value} value={scenario.value} className="bg-black">
                        {scenario.label}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedScenario !== 'custom' ? (
                  <button
                    onClick={testScenario}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {loading ? 'Testing...' : 'Run Test'}
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Custom JSON Data</label>
                      <textarea
                        value={customData}
                        onChange={(e) => setCustomData(e.target.value)}
                        placeholder={JSON.stringify(defaultCustomData, null, 2)}
                        className="w-full h-64 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/40 font-mono text-sm"
                      />
                    </div>
                    <button
                      onClick={testCustomData}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {loading ? 'Testing...' : 'Test Custom Data'}
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-400">{error}</p>
                </div>
              )}
            </div>

            {/* Response Display */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-semibold mb-6">API Response</h2>
              
              {response ? (
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="text-lg font-medium mb-2 text-blue-400">Test Info</h3>
                    <pre className="text-sm text-white/80 overflow-x-auto">
                      {JSON.stringify(response.test, null, 2)}
                    </pre>
                  </div>
                  
                  <div className={`rounded-lg p-4 border ${
                    response.apiResponse?.status === 200 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-red-500/10 border-red-500/30'
                  }`}>
                    <h3 className="text-lg font-medium mb-2">
                      Status: {response.apiResponse?.status} {response.apiResponse?.statusText}
                    </h3>
                    <pre className="text-sm text-white/80 overflow-x-auto">
                      {JSON.stringify(response.apiResponse?.result || response.error, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <p className="text-white/50">Run a test to see the response</p>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold mb-4">Quick Test Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">GET Requests (Direct URLs)</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="/api/test-ghl?scenario=assessment" target="_blank" className="text-blue-400 hover:text-blue-300">
                      /api/test-ghl?scenario=assessment
                    </a>
                  </li>
                  <li>
                    <a href="/api/test-ghl?scenario=simple" target="_blank" className="text-blue-400 hover:text-blue-300">
                      /api/test-ghl?scenario=simple
                    </a>
                  </li>
                  <li>
                    <a href="/api/test-ghl?scenario=minimal" target="_blank" className="text-blue-400 hover:text-blue-300">
                      /api/test-ghl?scenario=minimal
                    </a>
                  </li>
                  <li>
                    <a href="/api/test-ghl?scenario=broken" target="_blank" className="text-blue-400 hover:text-blue-300">
                      /api/test-ghl?scenario=broken
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">cURL Examples</h3>
                <pre className="text-xs bg-white/5 p-3 rounded overflow-x-auto">
{`# Test assessment scenario
curl http://localhost:3001/api/test-ghl?scenario=assessment

# Test with custom data
curl -X POST http://localhost:3001/api/test-ghl \\
  -H "Content-Type: application/json" \\
  -d '{"firstName":"Test","email":"test@example.com"}'`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}