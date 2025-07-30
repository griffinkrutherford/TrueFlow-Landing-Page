/**
 * Debug script to check which custom fields exist and their IDs
 */

const GHL_ACCESS_TOKEN = 'pit-8f017e02-dd2d-4360-81d3-89f18aec470c';
const GHL_LOCATION_ID = 'GVFoSfHpPaXzRXCJbym0';
const GHL_API_BASE = 'https://services.leadconnectorhq.com';

async function checkCustomFields() {
  console.log('🔍 Checking GoHighLevel Custom Fields\n');
  
  try {
    const response = await fetch(
      `${GHL_API_BASE}/locations/${GHL_LOCATION_ID}/customFields?model=contact`,
      {
        headers: {
          'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
          'Version': '2021-07-28',
          'Accept': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      console.error('Failed to fetch custom fields:', response.status);
      return;
    }
    
    const data = await response.json();
    const trueflowFields = data.customFields?.filter(f => 
      f.fieldKey?.includes('trueflow') || 
      f.name?.toLowerCase().includes('trueflow')
    ) || [];
    
    console.log(`Found ${trueflowFields.length} TrueFlow custom fields:\n`);
    
    // Group by field type
    console.log('📋 GET STARTED FORM FIELDS:');
    console.log('===========================');
    
    const getStartedFields = [
      'trueflow_business_name',
      'trueflow_business_type', 
      'trueflow_content_goals',
      'trueflow_integrations',
      'trueflow_selected_plan',
      'trueflow_lead_score',
      'trueflow_lead_quality',
      'trueflow_submission_date'
    ];
    
    getStartedFields.forEach(fieldKey => {
      const field = trueflowFields.find(f => 
        f.fieldKey === fieldKey || 
        f.fieldKey === `contact.${fieldKey}`
      );
      
      if (field) {
        console.log(`✅ ${fieldKey}:`);
        console.log(`   Name: ${field.name}`);
        console.log(`   ID: ${field.id}`);
        console.log(`   Type: ${field.dataType}`);
        console.log(`   Key: ${field.fieldKey}`);
      } else {
        console.log(`❌ ${fieldKey}: NOT FOUND`);
      }
    });
    
    console.log('\n📋 ASSESSMENT FORM FIELDS:');
    console.log('========================');
    
    const assessmentFields = [
      'trueflow_assessment_score',
      'trueflow_readiness_level',
      'trueflow_recommended_plan',
      'trueflow_current_content',
      'trueflow_content_volume',
      'trueflow_crm_usage',
      'trueflow_lead_response',
      'trueflow_time_spent',
      'trueflow_budget'
    ];
    
    assessmentFields.forEach(fieldKey => {
      const field = trueflowFields.find(f => 
        f.fieldKey === fieldKey || 
        f.fieldKey === `contact.${fieldKey}`
      );
      
      if (field) {
        console.log(`✅ ${fieldKey}:`);
        console.log(`   Name: ${field.name}`);
        console.log(`   ID: ${field.id}`);
        console.log(`   Type: ${field.dataType}`);
      } else {
        console.log(`❌ ${fieldKey}: NOT FOUND`);
      }
    });
    
    // Check a recent contact to see what fields are populated
    console.log('\n🔍 Checking a recent test contact...');
    
    // Get contacts
    const contactsResponse = await fetch(
      `${GHL_API_BASE}/contacts/?locationId=${GHL_LOCATION_ID}&limit=5&query=DUMMY`,
      {
        headers: {
          'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
          'Version': '2021-07-28',
          'Accept': 'application/json'
        }
      }
    );
    
    if (contactsResponse.ok) {
      const contactsData = await contactsResponse.json();
      const testContact = contactsData.contacts?.[0];
      
      if (testContact) {
        console.log(`\nFound test contact: ${testContact.firstName} ${testContact.lastName}`);
        console.log('Custom fields on this contact:');
        
        if (testContact.customFields && testContact.customFields.length > 0) {
          testContact.customFields.forEach(cf => {
            const fieldDef = data.customFields?.find(f => f.id === cf.id);
            if (fieldDef?.fieldKey?.includes('trueflow')) {
              console.log(`- ${fieldDef.name}: ${cf.value}`);
            }
          });
        } else {
          console.log('❌ No custom fields found on contact!');
          console.log('Raw contact data:', JSON.stringify(testContact, null, 2));
        }
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the check
checkCustomFields();