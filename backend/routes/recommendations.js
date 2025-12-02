import express from "express";
import { generateGiftRecommendations } from "../services/geminiService.js";

const router = express.Router();

// POST endpoint for gift recommendations
router.post("/api/recommendations", async (req, res) => {
  try {
    const recipientData = req.body;

    // Validate that we have at least a first name
    if (!recipientData.firstName) {
      return res.status(400).json({ error: "Recipient name is required" });
    }

    console.log("Generating recommendations for:", recipientData.firstName);

    // Generate recommendations using Gemini
    const recommendations = await generateGiftRecommendations(recipientData);

    console.log(
      `Successfully generated ${recommendations.length} recommendations`
    );

    // Return the recommendations
    res.json({
      recommendations,
      model: "gemini-1.5-flash",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    res.status(500).json({
      error: "Failed to generate recommendations",
      details: error.message,
    });
  }
});

export default router;
