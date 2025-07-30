/**
 * Analyze field mismatch between our mappings and actual GHL fields
 */

require('dotenv').config({ path: '.env.local' });

const GHL_API_BASE = 'https://services.leadconnectorhq.com';
const GHL_API_VERSION = '2021-07-28';

// Our expected field mappings
const ourFieldMappings = [
  { formField: 'businessName', ghlFieldName: 'Business Name' },
  { formField: 'businessType', ghlFieldName: 'Business Type' },
  { formField: 'contentGoals', ghlFieldName: 'What are your goals?' },
  { formField: 'integrations', ghlFieldName: 'Integration Preferences' },
  { formField: 'selectedPlan', ghlFieldName: 'Selected Plan' },
  { formField: 'leadScore', ghlFieldName: 'Lead Score' },
  { formField: 'leadQuality', ghlFieldName: 'Lead Quality' },
  { formField: 'submissionDate', ghlFieldName: 'Form Submission Date' },
  { formField: 'currentContent', ghlFieldName: 'Current Content Creation' },
  { formField: 'contentVolume', ghlFieldName: 'Content Volume' },
  { formField: 'crmUsage', ghlFieldName: 'CRM Usage' },
  { formField: 'leadResponse', ghlFieldName: 'Lead Response Time' },
  { formField: 'timeSpent', ghlFieldName: 'Time on Repetitive Tasks' },
  { formField: 'budget', ghlFieldName: 'Current revenue range? (We don\'t need exact numbers—just a ballpark.)' },
  { formField: 'assessmentScore', ghlFieldName: 'Assessment Score' },
  { formField: 'readinessLevel', ghlFieldName: 'Readiness Level' }
];

async function fetchGHLFields() {
  const response = await fetch(
    `${GHL_API_BASE}/locations/${process.env.GHL_LOCATION_ID}/customFields?model=contact`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
        'Version': GHL_API_VERSION,
        'Accept': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch fields: ${response.status}`);
  }

  const data = await response.json();
  return data.customFields || [];
}

async function analyzeFieldMismatch() {
  console.log('🔍 Analyzing Field Mismatch');
  console.log('===========================\n');

  try {
    // Fetch actual GHL fields
    const ghlFields = await fetchGHLFields();
    console.log(`Found ${ghlFields.length} custom fields in GoHighLevel\n`);

    // Create a map of actual field names (case-insensitive)
    const actualFieldNames = new Map();
    ghlFields.forEach(field => {
      actualFieldNames.set(field.name.toLowerCase(), field);
    });

    console.log('📋 Field Mapping Analysis:');
    console.log('-------------------------\n');

    let matchCount = 0;
    let mismatchCount = 0;

    ourFieldMappings.forEach(mapping => {
      const expectedName = mapping.ghlFieldName;
      const found = actualFieldNames.get(expectedName.toLowerCase());

      if (found) {
        console.log(`✅ MATCH: "${expectedName}"`);
        console.log(`   Form field: ${mapping.formField}`);
        console.log(`   GHL ID: ${found.id}`);
        console.log(`   Type: ${found.dataType}`);
        matchCount++;
      } else {
        console.log(`❌ MISMATCH: "${expectedName}"`);
        console.log(`   Form field: ${mapping.formField}`);
        console.log(`   Status: NOT FOUND in GHL`);
        
        // Try to find similar fields
        const similar = Array.from(actualFieldNames.values()).filter(field => 
          field.name.toLowerCase().includes(mapping.formField.toLowerCase()) ||
          field.name.toLowerCase().includes(expectedName.toLowerCase().split(' ')[0])
        );
        
        if (similar.length > 0) {
          console.log(`   💡 Similar fields found:`);
          similar.forEach(field => {
            console.log(`      - "${field.name}" (ID: ${field.id})`);
          });
        }
        mismatchCount++;
      }
      console.log('');
    });

    console.log('📊 Summary:');
    console.log(`- Matches: ${matchCount}`);
    console.log(`- Mismatches: ${mismatchCount}`);
    console.log(`- Total mappings: ${ourFieldMappings.length}`);
    console.log('');

    // Show all actual field names for reference
    console.log('📋 All Available GHL Fields:');
    console.log('---------------------------');
    ghlFields.forEach(field => {
      console.log(`- "${field.name}" (${field.dataType})`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

analyzeFieldMismatch();