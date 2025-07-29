#!/usr/bin/env node

/**
 * GoHighLevel Discovery Script
 * This script helps you discover existing tags, pipelines, and custom fields in your GHL account
 * 
 * Usage: GHL_ACCESS_TOKEN=your_token GHL_LOCATION_ID=your_location node scripts/ghl-discover.js
 */

const GHL_API_BASE = 'https://services.leadconnectorhq.com'
const GHL_API_VERSION = '2021-07-28'

// Check for required environment variables
if (!process.env.GHL_ACCESS_TOKEN || !process.env.GHL_LOCATION_ID) {
  console.error('❌ Missing required environment variables:')
  console.error('   GHL_ACCESS_TOKEN and GHL_LOCATION_ID must be set')
  console.error('\nUsage:')
  console.error('GHL_ACCESS_TOKEN=your_token GHL_LOCATION_ID=your_location node scripts/ghl-discover.js')
  process.exit(1)
}

const headers = {
  'Authorization': `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
  'Accept': 'application/json',
  'Version': GHL_API_VERSION
}

async function discoverTags() {
  console.log('\n📌 DISCOVERING TAGS...')
  console.log('=' .repeat(50))
  
  try {
    const response = await fetch(`${GHL_API_BASE}/locations/${process.env.GHL_LOCATION_ID}/tags`, {
      method: 'GET',
      headers
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tags: ${response.status}`)
    }
    
    const data = await response.json()
    const tags = data.tags || []
    
    console.log(`Found ${tags.length} tags:\n`)
    tags.forEach((tag, index) => {
      console.log(`${index + 1}. "${tag.name}" (ID: ${tag.id})`)
    })
    
    // Show which tags might be from TrueFlow
    const trueflowTags = tags.filter(tag => 
      tag.name.toLowerCase().includes('trueflow') ||
      tag.name.toLowerCase().includes('web-lead') ||
      tag.name.toLowerCase().includes('assessment') ||
      tag.name.toLowerCase().includes('score-') ||
      tag.name.toLowerCase().includes('plan-')
    )
    
    if (trueflowTags.length > 0) {
      console.log('\n✨ Potential TrueFlow-related tags:')
      trueflowTags.forEach(tag => {
        console.log(`   - "${tag.name}"`)
      })
    }
    
    return tags
  } catch (error) {
    console.error('❌ Error fetching tags:', error.message)
    return []
  }
}

async function discoverPipelines() {
  console.log('\n📊 DISCOVERING PIPELINES & STAGES...')
  console.log('=' .repeat(50))
  
  try {
    const response = await fetch(`${GHL_API_BASE}/opportunities/pipelines`, {
      method: 'GET',
      headers
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch pipelines: ${response.status}`)
    }
    
    const data = await response.json()
    const pipelines = data.pipelines || []
    
    console.log(`Found ${pipelines.length} pipelines:\n`)
    
    pipelines.forEach((pipeline, pIndex) => {
      console.log(`${pIndex + 1}. Pipeline: "${pipeline.name}" (ID: ${pipeline.id})`)
      
      if (pipeline.stages && pipeline.stages.length > 0) {
        console.log('   Stages:')
        pipeline.stages.forEach((stage, sIndex) => {
          console.log(`   ${sIndex + 1}. "${stage.name}" (ID: ${stage.id})`)
        })
      }
      console.log('')
    })
    
    return pipelines
  } catch (error) {
    console.error('❌ Error fetching pipelines:', error.message)
    return []
  }
}

async function discoverCustomFields() {
  console.log('\n🔧 DISCOVERING CUSTOM FIELDS...')
  console.log('=' .repeat(50))
  
  try {
    const response = await fetch(`${GHL_API_BASE}/locations/${process.env.GHL_LOCATION_ID}/customFields`, {
      method: 'GET',
      headers
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch custom fields: ${response.status}`)
    }
    
    const data = await response.json()
    const customFields = data.customFields || []
    
    console.log(`Found ${customFields.length} custom fields:\n`)
    
    customFields.forEach((field, index) => {
      console.log(`${index + 1}. "${field.name}" (Key: ${field.fieldKey}, Type: ${field.dataType})`)
    })
    
    // Show which fields might be for TrueFlow
    const trueflowFields = customFields.filter(field => 
      field.fieldKey.includes('assessment') ||
      field.fieldKey.includes('business_type') ||
      field.fieldKey.includes('content_goals') ||
      field.fieldKey.includes('monthly_leads') ||
      field.fieldKey.includes('team_size') ||
      field.fieldKey.includes('plan') ||
      field.fieldKey.includes('score')
    )
    
    if (trueflowFields.length > 0) {
      console.log('\n✨ Potential TrueFlow-related custom fields:')
      trueflowFields.forEach(field => {
        console.log(`   - "${field.name}" (${field.fieldKey})`)
      })
    }
    
    return customFields
  } catch (error) {
    console.error('❌ Error fetching custom fields:', error.message)
    return []
  }
}

async function generateRecommendations(tags, pipelines, customFields) {
  console.log('\n💡 RECOMMENDATIONS FOR TRUEFLOW INTEGRATION')
  console.log('=' .repeat(50))
  
  console.log('\n1. Environment Variables to Set:')
  
  // Find assessment pipeline
  const assessmentPipeline = pipelines.find(p => 
    p.name.toLowerCase().includes('assessment') ||
    p.name.toLowerCase().includes('evaluation')
  )
  
  if (assessmentPipeline) {
    console.log(`   GHL_ASSESSMENT_PIPELINE_ID=${assessmentPipeline.id}`)
    if (assessmentPipeline.stages && assessmentPipeline.stages.length > 0) {
      console.log(`   GHL_ASSESSMENT_STAGE_NEW=${assessmentPipeline.stages[0].id}`)
    }
  }
  
  // Find get started/sales pipeline
  const salesPipeline = pipelines.find(p => 
    p.name.toLowerCase().includes('sales') ||
    p.name.toLowerCase().includes('started') ||
    p.name.toLowerCase().includes('lead')
  ) || pipelines[0] // fallback to first pipeline
  
  if (salesPipeline) {
    console.log(`   GHL_GETSTARTED_PIPELINE_ID=${salesPipeline.id}`)
    if (salesPipeline.stages && salesPipeline.stages.length > 0) {
      console.log(`   GHL_GETSTARTED_STAGE_NEW=${salesPipeline.stages[0].id}`)
    }
  }
  
  console.log('\n2. Existing Tags to Reuse:')
  const relevantTags = tags.filter(tag => 
    tag.name.toLowerCase().includes('web') ||
    tag.name.toLowerCase().includes('lead') ||
    tag.name.toLowerCase().includes('assessment')
  )
  
  if (relevantTags.length > 0) {
    relevantTags.forEach(tag => {
      console.log(`   - "${tag.name}"`)
    })
  } else {
    console.log('   No existing relevant tags found. New tags will be created.')
  }
  
  console.log('\n3. Custom Fields Mapping:')
  if (customFields.length > 0) {
    console.log('   Add these to your CUSTOM_FIELD_MAPPING:')
    customFields.slice(0, 5).forEach(field => {
      console.log(`   ${field.fieldKey}: '${field.fieldKey}',`)
    })
  }
}

// Run discovery
async function runDiscovery() {
  console.log('🔍 GoHighLevel Account Discovery Tool')
  console.log('Location ID:', process.env.GHL_LOCATION_ID)
  
  const tags = await discoverTags()
  const pipelines = await discoverPipelines()
  const customFields = await discoverCustomFields()
  
  await generateRecommendations(tags, pipelines, customFields)
  
  console.log('\n✅ Discovery complete!')
  console.log('\nNext steps:')
  console.log('1. Add the recommended environment variables to Railway')
  console.log('2. Update your code to use existing tag names and pipeline IDs')
  console.log('3. Map your form fields to existing custom fields')
}

runDiscovery().catch(console.error)