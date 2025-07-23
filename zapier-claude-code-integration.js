// Zapier Code by Zapier - Run JavaScript
// This code integrates Claude Code SDK within Zapier

// Since Zapier doesn't support direct npm imports, we'll use the CLI approach
// via child_process execution or HTTP API calls

// Option 1: Using exec to run Claude Code CLI (if available on Zapier's environment)
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Main function for Zapier
const runClaudeCode = async (inputData) => {
  // Get the prompt from previous Zapier steps
  const prompt = inputData.prompt || "Write a function to calculate fibonacci numbers";
  const maxTurns = inputData.maxTurns || 3;
  const outputFormat = 'json';
  
  try {
    // Option 1: Direct CLI execution (if Claude Code is installed)
    const command = `claude -p "${prompt.replace(/"/g, '\\"')}" --output-format ${outputFormat} --max-turns ${maxTurns}`;
    
    const { stdout, stderr } = await execPromise(command, {
      env: {
        ...process.env,
        ANTHROPIC_API_KEY: inputData.anthropicApiKey // Pass from Zapier storage
      }
    });
    
    if (stderr) {
      console.error('Claude Code stderr:', stderr);
    }
    
    // Parse the JSON output
    const result = JSON.parse(stdout);
    
    return {
      success: true,
      response: result.result,
      cost: result.total_cost_usd,
      sessionId: result.session_id,
      duration: result.duration_ms,
      numTurns: result.num_turns
    };
    
  } catch (error) {
    // If CLI approach fails, use HTTP approach
    console.log('CLI approach failed, trying HTTP approach...');
    
    // Option 2: HTTP Request to Anthropic API directly
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': inputData.anthropicApiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-opus-20240229',
          max_tokens: 4000,
          messages: [{
            role: 'user',
            content: prompt
          }],
          system: "You are Claude Code, an AI coding assistant. Help the user with their programming tasks."
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`API Error: ${data.error?.message || 'Unknown error'}`);
      }
      
      return {
        success: true,
        response: data.content[0].text,
        cost: calculateCost(data.usage),
        sessionId: data.id,
        usage: data.usage
      };
      
    } catch (apiError) {
      return {
        success: false,
        error: apiError.message,
        details: 'Failed to execute Claude Code via CLI and API'
      };
    }
  }
};

// Helper function to calculate cost based on usage
const calculateCost = (usage) => {
  if (!usage) return 0;
  
  // Claude 3 Opus pricing (as of 2024)
  const inputCostPer1M = 15.00;
  const outputCostPer1M = 75.00;
  
  const inputCost = (usage.input_tokens / 1000000) * inputCostPer1M;
  const outputCost = (usage.output_tokens / 1000000) * outputCostPer1M;
  
  return inputCost + outputCost;
};

// Option 3: Using subprocess approach with streaming
const runClaudeCodeStream = async (inputData) => {
  const { spawn } = require('child_process');
  
  return new Promise((resolve, reject) => {
    const messages = [];
    const claude = spawn('claude', [
      '-p',
      inputData.prompt,
      '--output-format', 'stream-json',
      '--max-turns', String(inputData.maxTurns || 3)
    ], {
      env: {
        ...process.env,
        ANTHROPIC_API_KEY: inputData.anthropicApiKey
      }
    });
    
    let buffer = '';
    
    claude.stdout.on('data', (data) => {
      buffer += data.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        if (line.trim()) {
          try {
            const message = JSON.parse(line);
            messages.push(message);
          } catch (e) {
            console.error('Failed to parse message:', line);
          }
        }
      }
    });
    
    claude.stderr.on('data', (data) => {
      console.error('Claude Code stderr:', data.toString());
    });
    
    claude.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Claude Code exited with code ${code}`));
        return;
      }
      
      // Find the result message
      const result = messages.find(m => m.type === 'result');
      
      resolve({
        success: true,
        response: result?.result || '',
        cost: result?.total_cost_usd || 0,
        sessionId: result?.session_id || '',
        messages: messages,
        numTurns: result?.num_turns || 0
      });
    });
    
    claude.on('error', (err) => {
      reject(err);
    });
  });
};

// Main execution for Zapier
output = await runClaudeCode(inputData);

// Alternative: Use streaming approach
// output = await runClaudeCodeStream(inputData);

// Return the output for next Zapier steps
return output;