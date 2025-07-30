#!/usr/bin/env node

/**
 * Debug GHL field mapping with proper env loading
 */

require('dotenv').config({ path: '.env.local' })

// Now load our TypeScript module
require('tsx/cjs')
require('../lib/ghl/debug-field-mapping.ts')