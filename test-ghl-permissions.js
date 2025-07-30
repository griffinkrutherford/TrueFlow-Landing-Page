/**
 * Test GoHighLevel API permissions directly
 */

const GHL_ACCESS_TOKEN = 'pit-8f017e02-dd2d-4360-81d3-89f18aec470c';
const GHL_LOCATION_ID = 'GVFoSfHpPaXzRXCJbym0';
const GHL_API_BASE = 'https://services.leadconnectorhq.com';

async function testPermissions() {
  console.log('🔍 Testing GoHighLevel API Permissions\n');
  
  // Test 1: Can we read custom fields?
  console.log('1️⃣ Testing READ custom fields permission...');
  try {
    const readResponse = await fetch(
      `${GHL_API_BASE}/locations/${GHL_LOCATION_ID}/customFields?model=contact`,
      {
        headers: {
          'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
          'Version': '2021-07-28',
          'Accept': 'application/json'
        }
      }
    );
    
    if (readResponse.ok) {
      const data = await readResponse.json();
      console.log('✅ READ permission: SUCCESS');
      console.log(`   Found ${data.customFields?.length || 0} existing custom fields`);
      
      // Show existing TrueFlow fields if any
      const trueflowFields = data.customFields?.filter(f => f.fieldKey?.startsWith('trueflow_')) || [];
      if (trueflowFields.length > 0) {
        console.log('   Existing TrueFlow fields:');
        trueflowFields.forEach(field => {
          console.log(`   - ${field.fieldKey}: ${field.name} (${field.dataType})`);
        });
      }
    } else {
      const error = await readResponse.text();
      console.log('❌ READ permission: FAILED');
      console.log(`   Status: ${readResponse.status}`);
      console.log(`   Error: ${error}`);
    }
  } catch (error) {
    console.log('❌ READ test failed:', error.message);
  }
  
  // Test 2: Can we create custom fields?
  console.log('\n2️⃣ Testing WRITE custom fields permission...');
  try {
    const testField = {
      name: 'Test Field Delete Me',
      fieldKey: 'test_field_delete_me',
      dataType: 'TEXT',
      model: 'contact',
      position: 0
    };
    
    const writeResponse = await fetch(
      `${GHL_API_BASE}/locations/${GHL_LOCATION_ID}/customFields`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
          'Version': '2021-07-28',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(testField)
      }
    );
    
    if (writeResponse.ok) {
      const data = await writeResponse.json();
      console.log('✅ WRITE permission: SUCCESS');
      console.log(`   Created test field with ID: ${data.customField?.id || data.id}`);
      console.log('   (You can delete the "Test Field Delete Me" field from GHL)');
    } else {
      const error = await writeResponse.text();
      console.log('❌ WRITE permission: FAILED');
      console.log(`   Status: ${writeResponse.status}`);
      console.log(`   Error: ${error}`);
    }
  } catch (error) {
    console.log('❌ WRITE test failed:', error.message);
  }
  
  // Test 3: Can we create/update contacts?
  console.log('\n3️⃣ Testing contact creation permission...');
  try {
    const testContact = {
      firstName: 'Permission',
      lastName: 'Test',
      email: 'permission-test@example.com',
      locationId: GHL_LOCATION_ID,
      tags: ['test-permission']
    };
    
    const contactResponse = await fetch(
      `${GHL_API_BASE}/contacts/upsert`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
          'Version': '2021-07-28',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(testContact)
      }
    );
    
    if (contactResponse.ok) {
      const data = await contactResponse.json();
      console.log('✅ Contact creation: SUCCESS');
      console.log(`   Created contact with ID: ${data.contact?.id || data.id}`);
    } else {
      const error = await contactResponse.text();
      console.log('❌ Contact creation: FAILED');
      console.log(`   Status: ${contactResponse.status}`);
      console.log(`   Error: ${error}`);
    }
  } catch (error) {
    console.log('❌ Contact test failed:', error.message);
  }
  
  console.log('\n📊 Summary:');
  console.log('If custom field permissions are still failing:');
  console.log('1. The token might need to be regenerated (not just updated)');
  console.log('2. Try creating fields manually in GHL as a workaround');
  console.log('3. Check if this is a sub-account token vs agency token issue');
}

// Run the test
testPermissions().catch(console.error);