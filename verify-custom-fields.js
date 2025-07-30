/**
 * Verify custom fields are being sent and received
 */

const GHL_ACCESS_TOKEN = 'pit-8f017e02-dd2d-4360-81d3-89f18aec470c';
const GHL_LOCATION_ID = 'GVFoSfHpPaXzRXCJbym0';
const GHL_API_BASE = 'https://services.leadconnectorhq.com';

async function verifyCustomFields() {
  console.log('🔍 Verifying Custom Fields on Latest Test Contact\n');
  
  try {
    // Search for the test contact
    const searchResponse = await fetch(
      `${GHL_API_BASE}/contacts/?locationId=${GHL_LOCATION_ID}&limit=1&query=COMPLETE%20FIELDS%20TEST`,
      {
        headers: {
          'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
          'Version': '2021-07-28',
          'Accept': 'application/json'
        }
      }
    );
    
    if (!searchResponse.ok) {
      console.error('Failed to search contacts:', searchResponse.status);
      return;
    }
    
    const searchData = await searchResponse.json();
    const contact = searchData.contacts?.[0];
    
    if (!contact) {
      console.log('❌ Contact not found');
      return;
    }
    
    console.log('✅ Found contact:', contact.firstName, contact.lastName);
    console.log('Contact ID:', contact.id);
    console.log('\n📋 CUSTOM FIELDS ON THIS CONTACT:');
    console.log('=====================================');
    
    if (contact.customField && Object.keys(contact.customField).length > 0) {
      console.log('\nUsing customField object:');
      Object.entries(contact.customField).forEach(([key, value]) => {
        if (key.includes('trueflow') || key.includes('TrueFlow')) {
          console.log(`✓ ${key}: ${value}`);
        }
      });
    }
    
    if (contact.customFields && Array.isArray(contact.customFields)) {
      console.log('\nUsing customFields array:');
      
      // Get all custom field definitions
      const fieldsResponse = await fetch(
        `${GHL_API_BASE}/locations/${GHL_LOCATION_ID}/customFields?model=contact`,
        {
          headers: {
            'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
            'Version': '2021-07-28',
            'Accept': 'application/json'
          }
        }
      );
      
      const fieldsData = await fieldsResponse.json();
      const fieldMap = new Map();
      fieldsData.customFields?.forEach(f => fieldMap.set(f.id, f));
      
      contact.customFields.forEach(cf => {
        const fieldDef = fieldMap.get(cf.id);
        if (fieldDef && fieldDef.fieldKey?.includes('trueflow')) {
          console.log(`✓ ${fieldDef.name}: ${cf.value || cf.field_value || 'No value'}`);
        }
      });
    }
    
    // Try to get full contact details
    console.log('\n📞 Getting full contact details...');
    const detailResponse = await fetch(
      `${GHL_API_BASE}/contacts/${contact.id}`,
      {
        headers: {
          'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
          'Version': '2021-07-28',
          'Accept': 'application/json'
        }
      }
    );
    
    if (detailResponse.ok) {
      const detailData = await detailResponse.json();
      console.log('\nRaw contact data keys:', Object.keys(detailData.contact || detailData));
      
      // Check different possible locations for custom fields
      const possibleCustomFields = [
        detailData.contact?.customField,
        detailData.contact?.customFields,
        detailData.customField,
        detailData.customFields
      ];
      
      possibleCustomFields.forEach((fields, index) => {
        if (fields) {
          console.log(`\nFound custom fields at location ${index + 1}:`, 
            Array.isArray(fields) ? `Array with ${fields.length} items` : `Object with ${Object.keys(fields).length} keys`
          );
        }
      });
    }
    
    console.log('\n💡 TROUBLESHOOTING TIPS:');
    console.log('1. In GHL, go to Settings → Custom Fields → Contact');
    console.log('2. Make sure all TrueFlow fields are "Active"');
    console.log('3. Check if fields need to be added to the contact view layout');
    console.log('4. Some GHL accounts have a "Manage Custom Fields" or "Field Manager" option');
    console.log('5. Fields might be under a specific folder or category');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run verification
verifyCustomFields();