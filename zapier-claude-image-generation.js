// Zapier Code by Zapier - JavaScript
// This example shows how to use Claude to generate image creation prompts
// and then pass them to an image generation service

// Get input from previous Zapier steps
const articleTitle = inputData.title || "Understanding Spinal Health";
const authorName = inputData.author || "Dr. Jane Smith";
const anthropicApiKey = inputData.anthropicApiKey;

// Template for the blog hero image prompt
const imagePromptTemplate = `Create a clean, professional blog-hero image for a chiropractic article.

✦ Canvas & size  
• 1600 × 900 px (16:9), PNG, 300 dpi.  
• Full-bleed background in deep navy #0D274D.

✦ Layout  
• Left 60%: headline text '${articleTitle}' set in a modern serif (e.g., Playfair Display/Georgia), bold, line-wrapped, pure white #FFFFFF, left-aligned.  
• Thin horizontal divider 2 px, light blue #59A1FF, spanning full width, placed 40 px below headline block.  
• By-line under divider: '${authorName} | Chiropractor in Wheat Ridge, Colorado' in a clean sans-serif (Open Sans), regular weight, white.

✦ Illustration (right 35%)  
• Minimalist outline of the human upper torso viewed from the back.  
• Spine drawn as stacked rounded rectangles; ribs indicated with short radiating lines.  
• Stroke color #59A1FF, stroke width ≈ 4 px.  
• Illustration vertically centered; allow some negative space around it.

✦ Style & mood  
Trusted, medical, approachable, no clutter, flat design, high contrast.`;

// Function to call Claude API for content generation
async function generateWithClaude(prompt) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 2000,
        temperature: 0.3, // Lower temperature for more consistent output
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Claude API Error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return {
      success: true,
      content: data.content[0].text,
      usage: data.usage
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Generate different content based on input type
let result;

if (inputData.generateImagePrompt) {
  // Generate an image creation prompt
  result = await generateWithClaude(imagePromptTemplate);
  
} else if (inputData.generateArticle) {
  // Generate article content
  const articlePrompt = `Write a professional blog article about "${articleTitle}" for a chiropractic practice.
  
  Requirements:
  - 800-1000 words
  - SEO-optimized
  - Include practical tips
  - Professional but approachable tone
  - Include a compelling introduction and conclusion
  - Format with proper headings using markdown`;
  
  result = await generateWithClaude(articlePrompt);
  
} else if (inputData.generateSocialPost) {
  // Generate social media content
  const socialPrompt = `Create social media posts promoting the article "${articleTitle}" by ${authorName}.
  
  Generate:
  1. Facebook post (200-300 characters)
  2. Instagram caption with relevant hashtags
  3. LinkedIn post (professional tone)
  4. Twitter/X thread (3-5 tweets)
  
  Include a call-to-action to read the full article.`;
  
  result = await generateWithClaude(socialPrompt);
  
} else {
  // Default: Generate meta description
  const metaPrompt = `Write an SEO-optimized meta description for the article "${articleTitle}" by ${authorName}.
  Maximum 160 characters. Include relevant keywords for chiropractic care.`;
  
  result = await generateWithClaude(metaPrompt);
}

// Prepare output for next Zapier steps
output = {
  ...result,
  articleTitle: articleTitle,
  authorName: authorName,
  timestamp: new Date().toISOString(),
  
  // Add specific fields based on what was generated
  imagePrompt: inputData.generateImagePrompt ? result.content : null,
  articleContent: inputData.generateArticle ? result.content : null,  
  socialPosts: inputData.generateSocialPost ? result.content : null,
  metaDescription: (!inputData.generateImagePrompt && !inputData.generateArticle && !inputData.generateSocialPost) ? result.content : null
};