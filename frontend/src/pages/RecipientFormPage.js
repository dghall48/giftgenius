import React, { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { useRecipients } from "../RecipientContext";

export default function RecipientFormPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addRecipient } = useRecipients();

  // Get token and sender from URL
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const senderName = params.get("sender");

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    interests: "",
    hobbies: "",
    favoriteColors: "",
    shirtSize: "",
    shoeSize: "",
    preferredStyle: "",
    wishlist: "",
    dislikes: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.interests.trim()) {
      alert("Please fill in at least your name and interests");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5001/api/recipient-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          ...formData,
          clothing: {
            shirtSize: formData.shirtSize,
            shoeSize: formData.shoeSize,
            preferredStyle: formData.preferredStyle,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      const result = await response.json();

      // Auto-create recipient profile from form data
      const newRecipient = {
        firstName: formData.firstName,
        lastName: formData.lastName || "",
        age: formData.age || "",
        gender: [], // Form doesn't collect gender, can be updated later
        relationship: "Friend", // Default relationship
        interests: formData.interests,
        notes: `
📋 Form Submission Data:
${formData.hobbies ? `🎯 Hobbies: ${formData.hobbies}\n` : ""}${
          formData.favoriteColors
            ? `🎨 Favorite Colors: ${formData.favoriteColors}\n`
            : ""
        }${formData.shirtSize ? `👕 Shirt Size: ${formData.shirtSize}\n` : ""}${
          formData.shoeSize ? `👟 Shoe Size: ${formData.shoeSize}\n` : ""
        }${
          formData.preferredStyle
            ? `✨ Style: ${formData.preferredStyle}\n`
            : ""
        }${formData.wishlist ? `🎁 Wishlist: ${formData.wishlist}\n` : ""}${
          formData.dislikes ? `❌ Dislikes/Allergies: ${formData.dislikes}` : ""
        }
        `.trim(),
      };

      // Add to recipients
      addRecipient(newRecipient);

      console.log("✅ Auto-created recipient profile:", newRecipient);

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={48} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Thank You! 🎉
          </h1>
          <p className="text-gray-600 mb-6">
            Your preferences have been saved and automatically added to{" "}
            {senderName}'s recipient list. They'll use this information to find
            you the perfect gift!
          </p>
          <div className="text-sm text-gray-500">
            You can close this page now.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-8 mb-8 text-white text-center">
          <h1 className="text-4xl font-bold mb-2">🎁 GiftGenius</h1>
          <p className="text-purple-100 text-lg">
            Help {senderName || "someone special"} find the perfect gift for
            you!
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-8"
        >
          {/* Section 1: Basic Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">
                1
              </span>
              Basic Information
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Interests */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">
                2
              </span>
              Interests & Hobbies
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Interests *
                </label>
                <textarea
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Reading, hiking, photography, cooking..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hobbies
                </label>
                <textarea
                  name="hobbies"
                  value={formData.hobbies}
                  onChange={handleChange}
                  placeholder="e.g., Playing guitar, gardening, video games..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Preferences */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">
                3
              </span>
              Style & Preferences
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Favorite Colors
                </label>
                <input
                  type="text"
                  name="favoriteColors"
                  value={formData.favoriteColors}
                  onChange={handleChange}
                  placeholder="e.g., Blue, Purple, Green"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Shirt Size
                  </label>
                  <select
                    name="shirtSize"
                    value={formData.shirtSize}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  >
                    <option value="">Select</option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Shoe Size
                  </label>
                  <input
                    type="text"
                    name="shoeSize"
                    value={formData.shoeSize}
                    onChange={handleChange}
                    placeholder="e.g., 9.5"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Style
                  </label>
                  <select
                    name="preferredStyle"
                    value={formData.preferredStyle}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  >
                    <option value="">Select</option>
                    <option value="Casual">Casual</option>
                    <option value="Formal">Formal</option>
                    <option value="Formal">Formal</option>
                    <option value="Athletic">Athletic</option>
                    <option value="Vintage">Vintage</option>
                    <option value="Modern">Modern</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Wishlist */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">
                4
              </span>
              Wishlist & Dislikes
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Wishlist Items
                </label>
                <textarea
                  name="wishlist"
                  value={formData.wishlist}
                  onChange={handleChange}
                  placeholder="Any specific items you've been wanting?"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Dislikes / Allergies
                </label>
                <textarea
                  name="dislikes"
                  value={formData.dislikes}
                  onChange={handleChange}
                  placeholder="Anything to avoid?"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send size={24} />
                  <span>Submit My Preferences</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
