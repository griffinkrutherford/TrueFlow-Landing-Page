/**
 * Find exact field names in GHL
 */

require('dotenv').config({ path: '.env.local' });

const GHL_API_BASE = 'https://services.leadconnectorhq.com';
const GHL_API_VERSION = '2021-07-28';

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

async function findExactFields() {
  console.log('🔍 Finding exact field names\n');

  try {
    const ghlFields = await fetchGHLFields();
    
    // Look for submission date fields
    console.log('📅 Date-related fields:');
    ghlFields.filter(f => f.name.toLowerCase().includes('date') || f.name.toLowerCase().includes('submission'))
      .forEach(f => {
        console.log(`- "${f.name}" (ID: ${f.id}, Type: ${f.dataType})`);
      });
    
    console.log('\n💰 Revenue/Budget fields:');
    ghlFields.filter(f => f.name.toLowerCase().includes('revenue') || f.name.toLowerCase().includes('budget'))
      .forEach(f => {
        console.log(`- "${f.name}" (ID: ${f.id}, Type: ${f.dataType})`);
        // Show character codes for debugging
        console.log(`  Character codes: ${Array.from(f.name).map(c => c.charCodeAt(0).toString(16)).join(' ')}`);
      });
    
    // Find the exact revenue field
    const revenueField = ghlFields.find(f => f.name.includes('Current revenue range'));
    if (revenueField) {
      console.log('\n✅ Found revenue field:');
      console.log(`Name: "${revenueField.name}"`);
      console.log(`ID: ${revenueField.id}`);
      console.log(`Type: ${revenueField.dataType}`);
      
      // Check for em dash vs regular dash
      if (revenueField.name.includes('—')) {
        console.log('⚠️  Uses em dash (—)');
      } else if (revenueField.name.includes('-')) {
        console.log('⚠️  Uses regular dash (-)');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

findExactFields();