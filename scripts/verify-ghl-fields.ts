#!/usr/bin/env node

/**
 * GHL Field Verification Script
 * Fetches contacts from GHL and displays all custom field values
 */

import * as dotenv from 'dotenv';
import axios from 'axios';
import colors from 'colors';

// Load environment variables
dotenv.config({ path: '.env.local' });

const GHL_API_BASE = 'https://services.leadconnectorhq.com';
const GHL_API_VERSION = '2021-07-28';

interface CustomField {
  id: string;
  fieldKey?: string;
  name?: string;
  value: any;
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  customFields: CustomField[];
  dateAdded: string;
  tags?: string[];
}

class GHLFieldVerifier {
  private ghlToken: string;
  private locationId: string;

  constructor() {
    this.ghlToken = process.env.GHL_ACCESS_TOKEN || '';
    this.locationId = process.env.GHL_LOCATION_ID || '';

    if (!this.ghlToken || !this.locationId) {
      console.error(colors.red('❌ Missing GHL_ACCESS_TOKEN or GHL_LOCATION_ID in .env.local'));
      process.exit(1);
    }
  }

  /**
   * Fetch all custom field definitions
   */
  async fetchCustomFieldDefinitions(): Promise<Map<string, string>> {
    console.log(colors.cyan('📋 Fetching custom field definitions...'));

    try {
      const response = await axios.get(
        `${GHL_API_BASE}/locations/${this.locationId}/customFields?model=contact`,
        {
          headers: {
            'Authorization': `Bearer ${this.ghlToken}`,
            'Version': GHL_API_VERSION
          }
        }
      );

      const fieldMap = new Map<string, string>();
      const fields = response.data.customFields || [];

      fields.forEach((field: any) => {
        fieldMap.set(field.id, field.name);
        console.log(colors.gray(`   ${field.name} (${field.id}) - ${field.dataType}`));
      });

      console.log(colors.green(`✅ Found ${fields.length} custom field definitions\n`));
      return fieldMap;
    } catch (error: any) {
      console.error(colors.red('❌ Failed to fetch field definitions:'), error.message);
      return new Map();
    }
  }

  /**
   * Fetch contact by email or ID
   */
  async fetchContact(identifier: string): Promise<Contact | null> {
    console.log(colors.cyan(`🔍 Searching for contact: ${identifier}`));

    try {
      // First try as contact ID
      if (identifier.length > 10 && !identifier.includes('@')) {
        try {
          const response = await axios.get(
            `${GHL_API_BASE}/contacts/${identifier}`,
            {
              headers: {
                'Authorization': `Bearer ${this.ghlToken}`,
                'Version': GHL_API_VERSION
              }
            }
          );

          if (response.data.contact) {
            return response.data.contact;
          }
        } catch (e) {
          // Not a valid ID, try email search
        }
      }

      // Search by email
      const searchResponse = await axios.get(
        `${GHL_API_BASE}/contacts/`,
        {
          params: {
            locationId: this.locationId,
            email: identifier,
            limit: 1
          },
          headers: {
            'Authorization': `Bearer ${this.ghlToken}`,
            'Version': GHL_API_VERSION
          }
        }
      );

      const contacts = searchResponse.data.contacts || [];
      if (contacts.length > 0) {
        return contacts[0];
      }

      console.error(colors.red('❌ Contact not found'));
      return null;
    } catch (error: any) {
      console.error(colors.red('❌ Error fetching contact:'), error.message);
      return null;
    }
  }

  /**
   * Fetch recent contacts
   */
  async fetchRecentContacts(limit: number = 10): Promise<Contact[]> {
    console.log(colors.cyan(`📅 Fetching ${limit} most recent contacts...`));

    try {
      const response = await axios.get(
        `${GHL_API_BASE}/contacts/`,
        {
          params: {
            locationId: this.locationId,
            limit,
            sortBy: 'date_added',
            order: 'desc'
          },
          headers: {
            'Authorization': `Bearer ${this.ghlToken}`,
            'Version': GHL_API_VERSION
          }
        }
      );

      return response.data.contacts || [];
    } catch (error: any) {
      console.error(colors.red('❌ Error fetching contacts:'), error.message);
      return [];
    }
  }

  /**
   * Display contact with custom fields
   */
  displayContact(contact: Contact, fieldDefinitions: Map<string, string>): void {
    console.log(colors.green(`\n✅ Contact Found:`));
    console.log(colors.white(`   Name: ${contact.firstName} ${contact.lastName}`));
    console.log(colors.white(`   Email: ${contact.email}`));
    console.log(colors.white(`   ID: ${contact.id}`));
    console.log(colors.white(`   Added: ${new Date(contact.dateAdded).toLocaleString()}`));

    if (contact.tags && contact.tags.length > 0) {
      console.log(colors.white(`   Tags: ${contact.tags.join(', ')}`));
    }

    console.log(colors.cyan('\n📊 Custom Fields:'));

    if (!contact.customFields || contact.customFields.length === 0) {
      console.log(colors.yellow('   No custom fields found'));
      return;
    }

    // Group fields by category
    const trueflowFields: CustomField[] = [];
    const assessmentFields: CustomField[] = [];
    const otherFields: CustomField[] = [];

    contact.customFields.forEach(field => {
      const fieldName = fieldDefinitions.get(field.id) || field.name || field.fieldKey || 'Unknown Field';
      
      if (fieldName.toLowerCase().includes('assessment') || 
          fieldName.toLowerCase().includes('score') ||
          fieldName.toLowerCase().includes('readiness')) {
        assessmentFields.push({ ...field, name: fieldName });
      } else if (fieldName.toLowerCase().includes('business') ||
                 fieldName.toLowerCase().includes('content') ||
                 fieldName.toLowerCase().includes('goals') ||
                 fieldName.toLowerCase().includes('integration') ||
                 fieldName.toLowerCase().includes('lead') ||
                 fieldName.toLowerCase().includes('plan')) {
        trueflowFields.push({ ...field, name: fieldName });
      } else {
        otherFields.push({ ...field, name: fieldName });
      }
    });

    // Display TrueFlow fields
    if (trueflowFields.length > 0) {
      console.log(colors.yellow('\n   🚀 TrueFlow Fields:'));
      trueflowFields.forEach(field => {
        this.displayField(field);
      });
    }

    // Display Assessment fields
    if (assessmentFields.length > 0) {
      console.log(colors.yellow('\n   📊 Assessment Fields:'));
      assessmentFields.forEach(field => {
        this.displayField(field);
      });
    }

    // Display other fields
    if (otherFields.length > 0) {
      console.log(colors.yellow('\n   📌 Other Fields:'));
      otherFields.forEach(field => {
        this.displayField(field);
      });
    }
  }

  /**
   * Display a single field
   */
  private displayField(field: CustomField): void {
    const value = field.value || '(empty)';
    const displayValue = typeof value === 'object' ? JSON.stringify(value) : value;
    
    // Color code based on value type
    let valueColor = 'white';
    if (value === '(empty)' || value === '') {
      valueColor = 'gray';
    } else if (typeof value === 'number') {
      valueColor = 'cyan';
    } else if (value === 'true' || value === 'false') {
      valueColor = 'yellow';
    }

    console.log(`      ${colors.gray('•')} ${field.name}: ${colors[valueColor](displayValue)}`);
  }

  /**
   * Compare expected vs actual values
   */
  compareFields(contact: Contact, expectedFields: Record<string, any>, fieldDefinitions: Map<string, string>): void {
    console.log(colors.cyan('\n🔬 Field Comparison:'));

    const fieldMap = new Map<string, any>();
    contact.customFields.forEach(field => {
      const fieldName = fieldDefinitions.get(field.id) || field.name || field.fieldKey || field.id;
      fieldMap.set(fieldName.toLowerCase(), field.value);
    });

    Object.entries(expectedFields).forEach(([fieldName, expectedValue]) => {
      const actualValue = fieldMap.get(fieldName.toLowerCase());
      
      if (actualValue === undefined) {
        console.log(colors.red(`   ✗ ${fieldName}: NOT FOUND (expected: ${expectedValue})`));
      } else if (String(actualValue) === String(expectedValue)) {
        console.log(colors.green(`   ✓ ${fieldName}: ${actualValue}`));
      } else {
        console.log(colors.yellow(`   ⚠ ${fieldName}: ${actualValue} (expected: ${expectedValue})`));
      }
    });
  }

  /**
   * Run verification
   */
  async verify(identifier?: string): Promise<void> {
    console.log(colors.cyan.bold('\n🔍 GHL Field Verification Tool'));
    console.log(colors.gray('============================\n'));

    // Fetch field definitions
    const fieldDefinitions = await this.fetchCustomFieldDefinitions();

    if (identifier) {
      // Verify specific contact
      const contact = await this.fetchContact(identifier);
      if (contact) {
        this.displayContact(contact, fieldDefinitions);

        // If email matches test pattern, show expected values
        if (contact.email.includes('cf-') || contact.email.includes('assessment-')) {
          const expectedFields = this.getExpectedFields(contact.email);
          if (Object.keys(expectedFields).length > 0) {
            this.compareFields(contact, expectedFields, fieldDefinitions);
          }
        }
      }
    } else {
      // Show recent contacts
      const contacts = await this.fetchRecentContacts(5);
      
      if (contacts.length === 0) {
        console.log(colors.yellow('No recent contacts found'));
        return;
      }

      console.log(colors.cyan(`\n📋 Recent Contacts:`));
      contacts.forEach((contact, index) => {
        console.log(colors.gray(`\n${index + 1}. ${contact.firstName} ${contact.lastName} (${contact.email})`));
        console.log(colors.gray(`   Added: ${new Date(contact.dateAdded).toLocaleString()}`));
        console.log(colors.gray(`   Custom Fields: ${contact.customFields?.length || 0}`));
      });

      console.log(colors.cyan('\n💡 To verify a specific contact, run:'));
      console.log(colors.gray('   npm run verify:fields -- <email or contact_id>'));
    }
  }

  /**
   * Get expected fields based on email pattern (for test contacts)
   */
  private getExpectedFields(email: string): Record<string, any> {
    if (email.includes('cf-full')) {
      return {
        'Business Type': 'Marketing Agency',
        'Lead Score': '75',
        'Lead Quality': 'hot'
      };
    } else if (email.includes('assessment-high')) {
      return {
        'Assessment Score': '95',
        'Readiness Level': 'Advanced',
        'Lead Quality': 'hot'
      };
    } else if (email.includes('assessment-low')) {
      return {
        'Assessment Score': '25',
        'Readiness Level': 'Beginner',
        'Lead Quality': 'cold'
      };
    }
    return {};
  }
}

// Main execution
async function main() {
  const identifier = process.argv[2];
  const verifier = new GHLFieldVerifier();
  
  try {
    await verifier.verify(identifier);
  } catch (error) {
    console.error(colors.red('\n❌ Verification failed:'), error);
    process.exit(1);
  }
}

// Run
main();