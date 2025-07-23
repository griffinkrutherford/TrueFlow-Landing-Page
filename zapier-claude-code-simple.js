// Zapier Code by Zapier - JavaScript Code
// Copy this code into your Zapier "Code by Zapier" action

// Input configuration from previous Zapier steps
const prompt = inputData.prompt || "Write a Python function to calculate fibonacci numbers";
const anthropicApiKey = inputData.anthropicApiKey; // Store in Zapier Storage
const maxTokens = parseInt(inputData.maxTokens) || 4000;
const temperature = parseFloat(inputData.temperature) || 0.7;

// Since Zapier doesn't support npm packages, we'll use fetch API
async function callClaudeAPI(prompt, apiKey) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: maxTokens,
        temperature: temperature,
        messages: [{
          role: 'user',
          content: prompt
        }],
        system: `You are Claude Code, an expert AI coding assistant. 
        Follow these guidelines:
        - Write clean, well-documented code
        - Include error handling
        - Follow best practices for the language
        - Explain your code clearly
        - If asked to modify files, provide clear instructions`
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API Error ${response.status}: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    // Calculate approximate cost
    const inputTokens = data.usage?.input_tokens || 0;
    const outputTokens = data.usage?.output_tokens || 0;
    const cost = (inputTokens * 0.015 + outputTokens * 0.075) / 1000; // Per 1K tokens

    return {
      success: true,
      response: data.content[0].text,
      usage: {
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens
      },
      cost: cost.toFixed(4),
      model: data.model,
      messageId: data.id
    };

  } catch (error) {
    return {
      success: false,
      error: error.message,
      prompt: prompt
    };
  }
}

// For code-specific tasks, enhance the prompt
function enhanceCodePrompt(originalPrompt) {
  const codeKeywords = ['function', 'code', 'script', 'program', 'class', 'method', 'api', 'debug', 'fix', 'optimize'];
  const isCodeRelated = codeKeywords.some(keyword => 
    originalPrompt.toLowerCase().includes(keyword)
  );

  if (isCodeRelated) {
    return `${originalPrompt}

Please provide:
1. Complete, working code
2. Brief explanation of the approach
3. Any important usage notes or requirements`;
  }

  return originalPrompt;
}

// Main execution
const enhancedPrompt = enhanceCodePrompt(prompt);
const result = await callClaudeAPI(enhancedPrompt, anthropicApiKey);

// For multi-step workflows, you can store the messageId
if (result.success && inputData.storeContext) {
  // Store in Zapier Storage for continuation
  await fetch('https://store.zapier.com/api/records', {
    method: 'POST',
    headers: {
      'X-Secret': inputData.zapierStoreSecret
    },
    body: JSON.stringify({
      key: `claude_context_${result.messageId}`,
      value: {
        messageId: result.messageId,
        prompt: enhancedPrompt,
        response: result.response,
        timestamp: new Date().toISOString()
      }
    })
  });
}

// Return output for next Zapier steps
output = result;