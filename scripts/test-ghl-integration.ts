#!/usr/bin/env node

/**
 * GHL Integration Test Suite
 * Tests end-to-end integration with GoHighLevel
 */

import * as dotenv from 'dotenv';
import axios from 'axios';
import colors from 'colors';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Load environment variables
dotenv.config({ path: '.env.local' });

const baseUrl = process.argv[2] || 'http://localhost:3001';
const verbose = process.argv.includes('--verbose') || process.argv.includes('-v');

interface TestContact {
  firstName: string;
  lastName: string;
  email: string;
  businessName: string;
  formType: 'get-started' | 'assessment';
  expectedFields: Record<string, any>;
}

// Test contacts with different data combinations
const testContacts: TestContact[] = [
  {
    firstName: 'Integration',
    lastName: 'TestAgency',
    email: `int-agency-${Date.now()}@example.com`,
    businessName: 'Agency Test Co',
    formType: 'get-started',
    expectedFields: {
      businessType: 'agency',
      contentGoals: ['newsletters', 'blogs', 'social'],
      integrations: ['gohighlevel', 'mailchimp'],
      selectedPlan: 'complete-system',
      leadScore: 75, // Expected high score for agency
      leadQuality: 'hot'
    }
  },
  {
    firstName: 'Integration', 
    lastName: 'TestCreator',
    email: `int-creator-${Date.now()}@example.com`,
    businessName: 'Creator Studio',
    formType: 'get-started',
    expectedFields: {
      businessType: 'creator',
      contentGoals: ['social', 'courses'],
      integrations: [],
      selectedPlan: 'content-engine',
      leadScore: 50,
      leadQuality: 'warm'
    }
  },
  {
    firstName: 'Assessment',
    lastName: 'HighReady',
    email: `int-assess-high-${Date.now()}@example.com`,
    businessName: 'Advanced Corp',
    formType: 'assessment',
    expectedFields: {
      assessmentScore: 90,
      readinessLevel: 'Advanced',
      recommendation: 'complete-system',
      leadScore: 90,
      leadQuality: 'hot'
    }
  },
  {
    firstName: 'Assessment',
    lastName: 'LowReady',
    email: `int-assess-low-${Date.now()}@example.com`,
    businessName: 'Beginner LLC',
    formType: 'assessment',
    expectedFields: {
      assessmentScore: 30,
      readinessLevel: 'Beginner',
      recommendation: 'content-engine',
      leadScore: 30,
      leadQuality: 'cold'
    }
  }
];

class GHLIntegrationTester {
  private ghlToken: string;
  private locationId: string;
  private createdContacts: string[] = [];

  constructor() {
    this.ghlToken = process.env.GHL_ACCESS_TOKEN || '';
    this.locationId = process.env.GHL_LOCATION_ID || '';

    if (!this.ghlToken || !this.locationId) {
      console.error(colors.red('❌ Missing GHL_ACCESS_TOKEN or GHL_LOCATION_ID in .env.local'));
      process.exit(1);
    }
  }

  /**
   * Run setup script to ensure custom fields exist
   */
  async runSetupScript(): Promise<void> {
    console.log(colors.cyan('\n🔧 Running setup script to ensure custom fields exist...'));
    
    try {
      const { stdout, stderr } = await execAsync('node setup-ghl-custom-fields.js', {
        cwd: process.cwd()
      });
      
      if (stderr) {
        console.error(colors.red('Setup script error:'), stderr);
      }
      
      console.log(colors.green('✅ Setup script completed'));
      
      if (verbose) {
        console.log(colors.gray('Setup output:'));
        console.log(stdout);
      }
    } catch (error) {
      console.error(colors.red('❌ Failed to run setup script:'), error);
      throw error;
    }
  }

  /**
   * Submit a test contact
   */
  async submitContact(contact: TestContact): Promise<string | null> {
    console.log(colors.blue(`\n📤 Submitting ${contact.formType} form for ${contact.email}`));

    const data = {
      ...contact,
      phone: '555-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
      timestamp: new Date().toISOString()
    };

    // Add form-specific data
    if (contact.formType === 'get-started') {
      Object.assign(data, {
        businessType: contact.expectedFields.businessType,
        contentGoals: contact.expectedFields.contentGoals,
        integrations: contact.expectedFields.integrations,
        selectedPlan: contact.expectedFields.selectedPlan,
        currentTools: ['WordPress', 'Mailchimp'],
        biggestChallenge: 'Test challenge for integration testing'
      });
    } else {
      Object.assign(data, {
        score: contact.expectedFields.assessmentScore,
        scorePercentage: contact.expectedFields.assessmentScore,
        recommendation: contact.expectedFields.recommendation,
        readinessLevel: contact.expectedFields.readinessLevel,
        answers: {
          currentContent: 'mixed',
          contentVolume: 'moderate',
          crmUsage: 'basic-crm',
          leadResponse: 'hours',
          timeSpent: 'moderate',
          budget: 'moderate'
        }
      });
    }

    try {
      const response = await axios.post(`${baseUrl}/api/ghl/create-lead`, data);
      
      if (response.data.success && response.data.ghlContactId) {
        const contactId = response.data.ghlContactId;
        console.log(colors.green(`✅ Contact created: ${contactId}`));
        this.createdContacts.push(contactId);
        return contactId;
      } else {
        console.error(colors.red(`❌ Failed to create contact: ${response.data.error}`));
        return null;
      }
    } catch (error: any) {
      console.error(colors.red(`❌ Error submitting contact: ${error.message}`));
      return null;
    }
  }

  /**
   * Fetch contact from GHL and verify fields
   */
  async verifyContact(contactId: string, expectedFields: Record<string, any>): Promise<boolean> {
    console.log(colors.blue(`\n🔍 Verifying contact ${contactId} in GHL...`));

    try {
      // Wait a bit for GHL to process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await axios.get(
        `https://services.leadconnectorhq.com/contacts/${contactId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.ghlToken}`,
            'Version': '2021-07-28'
          }
        }
      );

      const contact = response.data.contact;
      
      if (!contact) {
        console.error(colors.red('❌ Contact not found in GHL'));
        return false;
      }

      console.log(colors.green(`✅ Contact found: ${contact.firstName} ${contact.lastName}`));

      // Verify custom fields
      const customFields = contact.customFields || [];
      const fieldMap = new Map<string, any>();
      
      customFields.forEach((field: any) => {
        fieldMap.set(field.fieldKey || field.name, field.value);
      });

      let allFieldsCorrect = true;
      const results: string[] = [];

      // Check each expected field
      Object.entries(expectedFields).forEach(([fieldName, expectedValue]) => {
        const actualValue = fieldMap.get(fieldName);
        
        if (actualValue === undefined) {
          results.push(colors.red(`   ✗ ${fieldName}: NOT FOUND`));
          allFieldsCorrect = false;
        } else if (String(actualValue) !== String(expectedValue)) {
          results.push(colors.yellow(`   ⚠ ${fieldName}: "${actualValue}" (expected: "${expectedValue}")`));
          allFieldsCorrect = false;
        } else {
          results.push(colors.green(`   ✓ ${fieldName}: "${actualValue}"`));
        }
      });

      console.log(colors.cyan('\n📋 Custom Fields Verification:'));
      results.forEach(result => console.log(result));

      if (verbose) {
        console.log(colors.gray('\n🔍 All Custom Fields:'));
        customFields.forEach((field: any) => {
          console.log(colors.gray(`   ${field.name || field.fieldKey}: ${field.value}`));
        });
      }

      return allFieldsCorrect;
    } catch (error: any) {
      console.error(colors.red(`❌ Error fetching contact: ${error.message}`));
      return false;
    }
  }

  /**
   * Run all integration tests
   */
  async runTests(): Promise<void> {
    console.log(colors.cyan.bold('\n🧪 GHL Integration Test Suite'));
    console.log(colors.gray('============================'));

    // Step 1: Run setup
    await this.runSetupScript();
    
    // Wait for setup to complete
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Step 2: Submit all test contacts
    const submissionResults: Array<{ contact: TestContact; contactId: string | null }> = [];
    
    for (const contact of testContacts) {
      const contactId = await this.submitContact(contact);
      submissionResults.push({ contact, contactId });
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Step 3: Verify all contacts
    console.log(colors.cyan('\n\n📊 Verification Phase'));
    console.log(colors.gray('==================='));

    let passed = 0;
    let failed = 0;

    for (const { contact, contactId } of submissionResults) {
      if (contactId && !contactId.startsWith('demo-')) {
        const verified = await this.verifyContact(contactId, contact.expectedFields);
        if (verified) {
          passed++;
        } else {
          failed++;
        }
      } else {
        console.log(colors.yellow(`⚠️  Skipping verification for ${contact.email} (no real contact created)`));
      }
    }

    // Summary
    console.log(colors.cyan('\n\n📈 Integration Test Summary'));
    console.log(colors.gray('========================='));
    console.log(colors.green(`✅ Passed: ${passed}`));
    console.log(colors.red(`❌ Failed: ${failed}`));
    console.log(colors.blue(`📊 Total: ${passed + failed}`));
    console.log(colors.gray(`⏩ Skipped: ${submissionResults.length - passed - failed}`));

    // Cleanup instructions
    if (this.createdContacts.length > 0) {
      console.log(colors.yellow('\n\n🧹 Cleanup:'));
      console.log(colors.gray('The following test contacts were created:'));
      this.createdContacts.forEach(id => console.log(colors.gray(`   - ${id}`)));
      console.log(colors.gray('You may want to delete these from GHL after testing.'));
    }

    // Exit code
    process.exit(failed > 0 ? 1 : 0);
  }
}

// Run the tests
async function main() {
  const tester = new GHLIntegrationTester();
  
  try {
    await tester.runTests();
  } catch (error) {
    console.error(colors.red('\n❌ Test suite failed:'), error);
    process.exit(1);
  }
}

// Handle interruption
process.on('SIGINT', () => {
  console.log(colors.yellow('\n\n⚠️  Test interrupted'));
  process.exit(1);
});

// Run
main();