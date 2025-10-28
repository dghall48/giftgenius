const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "GiftGenius API is running" });
});

// AI gift recommendation endpoint
app.post("/api/recommendations", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      age,
      gender,
      relationship,
      occasion,
      minBudget,
      maxBudget,
      interests,
    } = req.body;

    console.log("Received recommendation request:", req.body);

    // Validate required fields
    if (!occasion || !interests) {
      return res.status(400).json({
        error:
          "Missing required fields. Please provide at least occasion and interests.",
      });
    }

    // Create the prompt for OpenAI
    const prompt = `You are a gift recommendation expert. Based on the following information about a gift recipient, suggest 6 specific, real, purchasable products from Amazon.

Recipient Information:
- Name: ${firstName} ${lastName}
- Age: ${age || "Not specified"}
- Gender: ${gender?.join(", ") || "Not specified"}
- Relationship: ${relationship || "Not specified"}
- Occasion: ${occasion}
- Budget: $${minBudget || "0"} - $${maxBudget || "100"}
- Interests & Hobbies: ${interests}

IMPORTANT: Suggest REAL products that actually exist on Amazon. Include the Amazon ASIN (product ID) for each item.

For each gift suggestion, provide:
1. The exact product name as listed on Amazon
2. A detailed description (2-3 sentences)
3. The approximate current price (be realistic based on actual Amazon prices)
4. A category (e.g., Electronics, Books, Home & Garden, Fashion, Sports, Food & Drink, etc.)
5. The Amazon ASIN (10-character product ID like B08N5WRWNW)
6. Why this gift is perfect for them based on their interests

Return your response as a JSON array of 6 gift objects with this exact structure:
[
  {
    "name": "Exact product name from Amazon",
    "description": "Detailed description",
    "price": 99.99,
    "category": "Category name",
    "asin": "B08N5WRWNW",
    "reason": "Why this is perfect for them"
  }
]

Important: 
- Only suggest real products with valid ASINs
- Make sure all prices are within the specified budget range ($${
      minBudget || "0"
    } - $${maxBudget || "100"})
- Verify the ASINs are correct (10 characters, letters and numbers)
- Vary the price points across the 6 suggestions
- Consider the occasion when suggesting gifts
- Return ONLY the JSON array, no additional text`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful gift recommendation assistant. Always respond with valid JSON arrays only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8, // Higher temperature for more creative suggestions
      max_tokens: 2000,
    });

    // Extract the response
    const aiResponse = completion.choices[0].message.content;
    console.log("Raw AI Response:", aiResponse);

    // Parse the JSON response
    let recommendations;
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = aiResponse
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      recommendations = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      console.error("AI Response was:", aiResponse);
      return res.status(500).json({
        error: "Failed to parse AI recommendations",
        details: "The AI returned an invalid format",
      });
    }

    // Add unique IDs, ratings, and construct image/link URLs to each recommendation
    const enrichedRecommendations = recommendations.map((gift, index) => {
      // Construct Amazon image URL from ASIN
      const imageUrl = gift.asin
        ? `https://images-na.ssl-images-amazon.com/images/I/${gift.asin}._AC_SL1500_.jpg`
        : null;

      // Construct Amazon product link from ASIN
      const productLink = gift.asin
        ? `https://www.amazon.com/dp/${gift.asin}`
        : `https://www.amazon.com/s?k=${encodeURIComponent(gift.name)}`;

      return {
        id: index + 1,
        ...gift,
        rating: (4.5 + Math.random() * 0.5).toFixed(1), // Random rating between 4.5-5.0
        image: getEmojiForCategory(gift.category), // Keep emoji as fallback
        imageUrl: imageUrl, // Add actual product image URL
        link: productLink, // Real Amazon link
      };
    });

    // Return the recommendations
    res.json({
      success: true,
      count: enrichedRecommendations.length,
      recommendations: enrichedRecommendations,
    });
  } catch (error) {
    console.error("Error generating recommendations:", error);

    if (error.code === "insufficient_quota") {
      return res.status(402).json({
        error: "OpenAI API quota exceeded. Please check your billing settings.",
      });
    }

    res.status(500).json({
      error: "Failed to generate recommendations",
      details: error.message,
    });
  }
});

// Helper function to assign emojis based on category
function getEmojiForCategory(category) {
  const categoryEmojis = {
    Electronics: "🎧",
    Technology: "💻",
    Books: "📚",
    Reading: "📖",
    "Home & Garden": "🏡",
    Home: "🏠",
    Fashion: "👔",
    Clothing: "👕",
    Sports: "⚽",
    Fitness: "💪",
    "Food & Drink": "🍷",
    Food: "🍰",
    Kitchen: "🍳",
    Travel: "✈️",
    Art: "🎨",
    Music: "🎵",
    Gaming: "🎮",
    Toys: "🧸",
    Beauty: "💄",
    Jewelry: "💎",
    Outdoor: "🏕️",
    Pet: "🐾",
    Office: "📎",
    Stationery: "✏️",
  };

  // Check for partial matches
  for (const [key, emoji] of Object.entries(categoryEmojis)) {
    if (category.toLowerCase().includes(key.toLowerCase())) {
      return emoji;
    }
  }

  // Default emoji
  return "🎁";
}

// Save recipient endpoint (placeholder)
app.post("/api/recipients", (req, res) => {
  console.log("Save recipient request:", req.body);
  res.json({
    success: true,
    message: "Recipient saved successfully",
    id: Date.now(),
  });
});

// Get recipients endpoint (placeholder)
app.get("/api/recipients", (req, res) => {
  res.json({
    success: true,
    recipients: [],
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(
    `🤖 OpenAI integration: ${
      process.env.OPENAI_API_KEY ? "Configured ✅" : "NOT configured ❌"
    }`
  );
});
