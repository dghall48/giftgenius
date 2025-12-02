const https = require('https');

async function generateGiftRecommendationsWithGemini(recipientData) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const prompt = `You are GiftGenius, an expert AI gift recommendation assistant.

**Mission:** Generate 6 unique, creative, and highly personalized gift recommendations.

**Recipient Profile:**
- Name: ${recipientData.firstName} ${recipientData.lastName || ''}
- Age: ${recipientData.age || 'Not specified'}
- Gender: ${recipientData.gender?.join(', ') || 'Not specified'}
- Relationship: ${recipientData.relationship || 'Not specified'}
- Interests & Hobbies: ${recipientData.interests || 'Various interests'}
- Occasion: ${recipientData.occasion}
- Budget Range: $${recipientData.minBudget || 0} - $${recipientData.maxBudget || 100}

**Requirements:**
1. Each gift MUST be within the specified budget range
2. Match their specific interests and hobbies
3. Be appropriate for the occasion
4. Be age-appropriate
5. Include diverse categories (avoid all tech or all books)
6. Provide SPECIFIC product names that exist on Amazon
7. Include realistic Amazon ASINs (10-character codes like B08N5WRWNW)

**Output Format:**
Return ONLY a valid JSON array (no markdown, no code blocks):

[
  {
    "name": "Specific Product Name from Amazon",
    "description": "2-3 sentences explaining what this is and why it's special.",
    "price": 49.99,
    "category": "Electronics",
    "asin": "B08N5WRWNW",
    "reason": "Why this matches their interests perfectly."
  }
]

Return ONLY the JSON array, nothing else.`;

  const requestBody = JSON.stringify({
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: {
      temperature: 0.9,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 2048,
    }
  });

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    port: 443,
    path: `/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (response.error) {
            reject(new Error(`Gemini API Error: ${response.error.message}`));
            return;
          }

          if (!response.candidates || !response.candidates[0]) {
            reject(new Error('No response from Gemini'));
            return;
          }

          let text = response.candidates[0].content.parts[0].text;
          
          // Clean up response - remove markdown code blocks if present
          text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          
          // Parse JSON
          const recommendations = JSON.parse(text);
          
          // Validate
          if (!Array.isArray(recommendations) || recommendations.length === 0) {
            reject(new Error('Invalid recommendations format'));
            return;
          }
          
          resolve(recommendations);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(requestBody);
    req.end();
  });
}

function getFallbackRecommendations(recipientData) {
  const budget = parseInt(recipientData.maxBudget) || 100;
  
  return [
    {
      name: "Personalized Gift Box",
      description: `A curated gift box tailored to ${recipientData.firstName}'s interests. Includes a selection of items that match their hobbies and preferences.`,
      price: Math.min(budget * 0.8, 80),
      category: "Curated",
      asin: "B07XAMPLE1",
      reason: "A personalized approach that shows thoughtfulness and care."
    },
    {
      name: "Amazon Gift Card",
      description: "A flexible gift card allowing them to choose exactly what they want from millions of products.",
      price: Math.min(budget * 0.6, 50),
      category: "Gift Cards",
      asin: "B07XAMPLE2",
      reason: "Gives them the freedom to pick something they truly want."
    },
    {
      name: "Premium Experience Voucher",
      description: "A memorable experience voucher for activities they enjoy. Could be dining, entertainment, or hobbies.",
      price: Math.min(budget * 0.9, 75),
      category: "Experiences",
      asin: "B07XAMPLE3",
      reason: "Creates lasting memories beyond material gifts."
    }
  ];
}

module.exports = {
  generateGiftRecommendationsWithGemini,
  getFallbackRecommendations
};