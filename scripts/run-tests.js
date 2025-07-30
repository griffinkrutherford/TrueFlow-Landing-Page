#!/usr/bin/env node

/**
 * Interactive Test Runner for Custom Fields
 */

const { exec } = require('child_process');
const colors = require('colors');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(colors.cyan.bold('\n🧪 TrueFlow Custom Fields Test Runner'));
console.log(colors.gray('===================================\n'));

const testOptions = [
  {
    name: '📝 API Tests - Test form submissions and field population',
    command: 'npm run test:fields',
    description: 'Tests API endpoints with various data combinations'
  },
  {
    name: '📝 API Tests (Verbose) - Detailed output',
    command: 'npm run test:fields:verbose',
    description: 'Same as above but with detailed request/response data'
  },
  {
    name: '🔗 Integration Tests - Full GHL integration',
    command: 'npm run test:integration',
    description: 'Submits data and verifies it in GoHighLevel'
  },
  {
    name: '🔗 Integration Tests (Verbose) - Detailed output',
    command: 'npm run test:integration:verbose',
    description: 'Same as above but with detailed debugging info'
  },
  {
    name: '🔍 Verify Fields - Check recent contacts',
    command: 'npm run verify:fields',
    description: 'Shows recent contacts and their custom fields'
  },
  {
    name: '🚀 Run All Tests - Complete test suite',
    command: 'npm run test:all',
    description: 'Runs all tests in sequence'
  },
  {
    name: '🔧 Setup Custom Fields - Ensure fields exist in GHL',
    command: 'node setup-ghl-custom-fields.js',
    description: 'Creates/updates custom fields in GoHighLevel'
  },
  {
    name: '✅ Validate Environment - Check .env.local',
    command: 'npm run validate:env',
    description: 'Ensures environment variables are properly set'
  }
];

function showMenu() {
  console.log(colors.yellow('Select a test to run:\n'));
  
  testOptions.forEach((option, index) => {
    console.log(colors.blue(`${index + 1}. ${option.name}`));
    console.log(colors.gray(`   ${option.description}\n`));
  });
  
  console.log(colors.red('0. Exit\n'));
}

function runCommand(command, description) {
  console.log(colors.cyan(`\n🚀 Running: ${description}`));
  console.log(colors.gray(`Command: ${command}\n`));
  
  const child = exec(command, { maxBuffer: 1024 * 1024 * 10 }); // 10MB buffer
  
  child.stdout.on('data', (data) => {
    process.stdout.write(data);
  });
  
  child.stderr.on('data', (data) => {
    process.stderr.write(colors.red(data));
  });
  
  child.on('close', (code) => {
    if (code === 0) {
      console.log(colors.green('\n✅ Test completed successfully!'));
    } else {
      console.log(colors.red(`\n❌ Test failed with exit code ${code}`));
    }
    
    console.log(colors.cyan('\nPress Enter to continue...'));
    rl.once('line', () => {
      showMenuAndPrompt();
    });
  });
}

function showMenuAndPrompt() {
  console.clear();
  showMenu();
  
  rl.question(colors.cyan('Enter your choice (0-' + testOptions.length + '): '), (answer) => {
    const choice = parseInt(answer);
    
    if (choice === 0) {
      console.log(colors.yellow('\n👋 Goodbye!'));
      rl.close();
      process.exit(0);
    } else if (choice >= 1 && choice <= testOptions.length) {
      const option = testOptions[choice - 1];
      runCommand(option.command, option.name);
    } else {
      console.log(colors.red('\nInvalid choice. Please try again.\n'));
      setTimeout(showMenuAndPrompt, 1500);
    }
  });
}

// Check if server is running
console.log(colors.gray('Checking if landing page is running...'));
exec('curl -s -o /dev/null -w "%{http_code}" http://localhost:3001', (error, stdout) => {
  if (stdout === '200') {
    console.log(colors.green('✅ Landing page is running on port 3001\n'));
  } else {
    console.log(colors.yellow('⚠️  Landing page is not running on port 3001'));
    console.log(colors.gray('   Start it with: npm run dev\n'));
  }
  
  setTimeout(showMenuAndPrompt, 1000);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log(colors.yellow('\n\n👋 Test runner stopped'));
  rl.close();
  process.exit(0);
});