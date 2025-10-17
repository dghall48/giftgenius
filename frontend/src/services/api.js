const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const api = {
  // Health check
  checkHealth: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },

  // Get gift recommendations (AI integration point)
  getRecommendations: async (recipientData) => {
    const response = await fetch(`${API_BASE_URL}/recommendations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipientData),
    });
    return response.json();
  },

  // Save recipient profile
  saveRecipient: async (recipientData) => {
    const response = await fetch(`${API_BASE_URL}/recipients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipientData),
    });
    return response.json();
  },

  // Get all recipients
  getRecipients: async () => {
    const response = await fetch(`${API_BASE_URL}/recipients`);
    return response.json();
  },
};
