const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "GiftGenius API is running" });
});

// Future AI gift recommendation endpoint (placeholder)
app.post("/api/recommendations", async (req, res) => {
  try {
    const { recipientName, gender, occasion, interests } = req.body;

    // TODO: Integrate AI here later
    // For now, return mock data
    res.json({
      recommendations: [
        {
          id: 1,
          name: "Gift Idea 1",
          price: 29.99,
          description: "Coming soon...",
        },
        {
          id: 2,
          name: "Gift Idea 2",
          price: 49.99,
          description: "Coming soon...",
        },
        {
          id: 3,
          name: "Gift Idea 3",
          price: 39.99,
          description: "Coming soon...",
        },
      ],
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get recommendations" });
  }
});

// Future endpoints (placeholders)
app.post("/api/recipients", (req, res) => {
  res.json({ message: "Recipient saved", id: Date.now() });
});

app.get("/api/recipients", (req, res) => {
  res.json({ recipients: [] });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
