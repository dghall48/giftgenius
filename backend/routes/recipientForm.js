const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

// In-memory storage (use database in production)
const formTokens = new Map();
const formSubmissions = new Map();

// Send form email
router.post("/api/send-form-email", async (req, res) => {
  try {
    const {
      recipientEmail,
      recipientName,
      senderName,
      message,
      formLink,
      token,
    } = req.body;

    console.log("📧 Sending form email to:", recipientEmail);

    // Store token
    formTokens.set(token, {
      recipientEmail,
      recipientName,
      senderName,
      createdAt: new Date(),
    });

    // Configure email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: `🎁 ${senderName} wants to find you the perfect gift!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(to right, #9333ea, #ec4899); color: white; padding: 30px; text-align: center; border-radius: 10px;">
            <h1 style="margin: 0;">🎁 GiftGenius</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">AI-Powered Gift Recommendations</p>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; margin-top: 20px; border-radius: 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Hi ${recipientName}!</h2>
            <p style="color: #4b5563; line-height: 1.6;">
              ${senderName} wants to find you the perfect gift and needs your help!
            </p>
            
            ${
              message
                ? `
              <div style="background: white; padding: 15px; border-left: 4px solid #9333ea; margin: 20px 0;">
                <p style="color: #6b7280; font-style: italic; margin: 0;">
                  "${message}"
                </p>
              </div>
            `
                : ""
            }
            
            <p style="color: #4b5563; line-height: 1.6;">
              Please take a moment to fill out this quick form and share your preferences:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${formLink}" 
                 style="display: inline-block; padding: 15px 30px; background: linear-gradient(to right, #9333ea, #ec4899); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Fill Out Preference Form
              </a>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                <strong style="color: #1f2937;">What you'll share:</strong>
              </p>
              <ul style="color: #6b7280; font-size: 14px; margin: 0; padding-left: 20px;">
                <li>Your interests and hobbies</li>
                <li>Favorite colors and styles</li>
                <li>Size preferences</li>
                <li>Wishlist items</li>
              </ul>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
            <p style="margin: 0;">Sent via GiftGenius - Making gift-giving personal</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully to:", recipientEmail);

    res.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("❌ Email error:", error);
    res.status(500).json({
      error: "Failed to send email",
      details: error.message,
    });
  }
});

// Receive form submission
router.post("/api/recipient-form", async (req, res) => {
  try {
    const { token, ...formData } = req.body;

    console.log("📝 Received form submission for token:", token);

    // Verify token
    const tokenData = formTokens.get(token);
    if (!tokenData) {
      return res.status(400).json({
        error: "Invalid or expired form link",
      });
    }

    // Store submission
    const submissionData = {
      ...formData,
      submittedAt: new Date(),
      tokenData,
    };

    formSubmissions.set(token, submissionData);

    console.log("✅ Form data saved for:", formData.firstName);

    // Return the submission data so frontend can create a recipient
    res.json({
      success: true,
      message: "Your preferences have been saved!",
      submission: submissionData,
    });
  } catch (error) {
    console.error("❌ Form submission error:", error);
    res.status(500).json({
      error: "Failed to save preferences",
      details: error.message,
    });
  }
});

// Get all form submissions (for testing/admin)
router.get("/api/recipient-forms", (req, res) => {
  try {
    const submissions = [];

    // Convert Map to array
    formSubmissions.forEach((submission, token) => {
      submissions.push({
        token,
        ...submission,
      });
    });

    console.log(`📋 Retrieved ${submissions.length} form submissions`);

    res.json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    console.error("❌ Error retrieving submissions:", error);
    res.status(500).json({
      error: "Failed to retrieve submissions",
    });
  }
});

module.exports = router;
