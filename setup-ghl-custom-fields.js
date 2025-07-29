#!/usr/bin/env node

/**
 * Setup script to create TrueFlow custom fields in GoHighLevel
 * Run this once when setting up a new GHL location
 */

const https = require('https')
const readline = require('readline')

const GHL_API_BASE = 'services.leadconnectorhq.com'
const GHL_API_VERSION = '2021-07-28'

// TrueFlow custom field definitions
const CUSTOM_FIELDS = [
  {
    name: 'TrueFlow Form Type',
    dataType: 'TEXT',
    placeholder: 'assessment or get-started'
  },
  {
    name: 'TrueFlow Submission Date',
    dataType: 'TEXT', // Using TEXT since DATE might have format issues
    placeholder: 'ISO 8601 date string'
  },
  {
    name: 'TrueFlow Lead Score',
    dataType: 'NUMERICAL',
    placeholder: '0-100'
  },
  {
    name: 'TrueFlow Qualification Status',
    dataType: 'TEXT',
    placeholder: 'hot, warm, or cold'
  },
  {
    name: 'TrueFlow Business Type',
    dataType: 'TEXT',
    placeholder: 'Business category'
  },
  {
    name: 'TrueFlow Content Goals',
    dataType: 'LARGE_TEXT',
    placeholder: 'Content creation goals'
  },
  {
    name: 'TrueFlow Monthly Leads',
    dataType: 'TEXT',
    placeholder: 'Expected monthly leads'
  },
  {
    name: 'TrueFlow Team Size',
    dataType: 'TEXT',
    placeholder: 'Team size range'
  },
  {
    name: 'TrueFlow Current Tools',
    dataType: 'LARGE_TEXT',
    placeholder: 'Tools currently in use'
  },
  {
    name: 'TrueFlow Biggest Challenge',
    dataType: 'LARGE_TEXT',
    placeholder: 'Primary business challenge'
  },
  {
    name: 'TrueFlow Selected Plan',
    dataType: 'TEXT',
    placeholder: 'Pricing plan selected'
  },
  {
    name: 'TrueFlow Assessment Score',
    dataType: 'NUMERICAL',
    placeholder: 'Assessment quiz score'
  },
  {
    name: 'TrueFlow Recommended Plan',
    dataType: 'TEXT',
    placeholder: 'AI-recommended plan'
  },
  {
    name: 'TrueFlow Assessment Answers',
    dataType: 'LARGE_TEXT',
    placeholder: 'JSON of all answers'
  },
  {
    name: 'TrueFlow Budget Range',
    dataType: 'TEXT',
    placeholder: 'Budget range'
  },
  {
    name: 'TrueFlow Timeline',
    dataType: 'TEXT',
    placeholder: 'Implementation timeline'
  },
  {
    name: 'TrueFlow Decision Maker',
    dataType: 'TEXT',
    placeholder: 'Is decision maker'
  }
]

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise(resolve => rl.question(prompt, resolve))
}

async function fetchExistingFields(accessToken, locationId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: GHL_API_BASE,
      path: `/locations/${locationId}/customFields?model=contact`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Version': GHL_API_VERSION,
        'Accept': 'application/json'
      }
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const result = JSON.parse(data)
            resolve(result.customFields || [])
          } catch (e) {
            reject(new Error('Failed to parse response'))
          }
        } else {
          reject(new Error(`API error: ${res.statusCode} - ${data}`))
        }
      })
    })

    req.on('error', reject)
    req.end()
  })
}

async function createCustomField(accessToken, locationId, field) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      name: field.name,
      dataType: field.dataType,
      placeholder: field.placeholder,
      model: 'contact'
    })

    const options = {
      hostname: GHL_API_BASE,
      path: `/locations/${locationId}/customFields`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Version': GHL_API_VERSION,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        if (res.statusCode === 201 || res.statusCode === 200) {
          try {
            const result = JSON.parse(data)
            resolve(result.customField)
          } catch (e) {
            resolve({ success: true })
          }
        } else {
          console.error(`Failed to create ${field.name}: ${res.statusCode} - ${data}`)
          resolve(null)
        }
      })
    })

    req.on('error', (e) => {
      console.error(`Error creating ${field.name}:`, e.message)
      resolve(null)
    })

    req.write(payload)
    req.end()
  })
}

async function main() {
  console.log('\n🚀 TrueFlow GoHighLevel Custom Fields Setup\n')
  console.log('This script will create all necessary custom fields for TrueFlow in your GHL location.\n')

  try {
    // Get credentials
    const accessToken = await question('Enter your GHL Access Token: ')
    const locationId = await question('Enter your GHL Location ID: ')

    if (!accessToken || !locationId) {
      console.error('\n❌ Access token and location ID are required')
      process.exit(1)
    }

    console.log('\n📋 Fetching existing custom fields...')
    
    let existingFields
    try {
      existingFields = await fetchExistingFields(accessToken, locationId)
      console.log(`✅ Found ${existingFields.length} existing custom fields`)
    } catch (error) {
      console.error('❌ Failed to fetch existing fields:', error.message)
      const proceed = await question('\nDo you want to continue anyway? (yes/no): ')
      if (proceed.toLowerCase() !== 'yes') {
        process.exit(1)
      }
      existingFields = []
    }

    // Check which fields need to be created
    const existingNames = new Set(existingFields.map(f => f.name))
    const fieldsToCreate = CUSTOM_FIELDS.filter(f => !existingNames.has(f.name))

    if (fieldsToCreate.length === 0) {
      console.log('\n✅ All TrueFlow custom fields already exist!')
      console.log('\nExisting TrueFlow fields:')
      existingFields
        .filter(f => f.name.startsWith('TrueFlow'))
        .forEach(f => console.log(`  - ${f.name} (${f.dataType})`))
      
      rl.close()
      return
    }

    console.log(`\n📝 Need to create ${fieldsToCreate.length} fields:`)
    fieldsToCreate.forEach(f => console.log(`  - ${f.name} (${f.dataType})`))

    const confirm = await question('\nProceed with creation? (yes/no): ')
    if (confirm.toLowerCase() !== 'yes') {
      console.log('\n❌ Setup cancelled')
      rl.close()
      return
    }

    console.log('\n🔧 Creating custom fields...\n')

    let created = 0
    let failed = 0

    for (const field of fieldsToCreate) {
      process.stdout.write(`Creating "${field.name}"... `)
      const result = await createCustomField(accessToken, locationId, field)
      
      if (result) {
        console.log('✅')
        created++
        if (result.id) {
          console.log(`  ID: ${result.id}`)
          console.log(`  Key: ${result.fieldKey}`)
        }
      } else {
        console.log('❌')
        failed++
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    console.log('\n📊 Setup Summary:')
    console.log(`  ✅ Created: ${created} fields`)
    console.log(`  ❌ Failed: ${failed} fields`)
    console.log(`  📁 Total: ${existingFields.length + created} fields in location`)

    if (created > 0) {
      console.log('\n🎉 Setup completed successfully!')
      console.log('\nNext steps:')
      console.log('1. Update your .env.local file with:')
      console.log(`   GHL_ACCESS_TOKEN=${accessToken}`)
      console.log(`   GHL_LOCATION_ID=${locationId}`)
      console.log('2. Restart your landing page server')
      console.log('3. Test form submissions to verify custom fields are populated')
    }

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message)
  } finally {
    rl.close()
  }
}

// Run the setup
main().catch(console.error)