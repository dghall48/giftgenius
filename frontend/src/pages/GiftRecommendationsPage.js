import React, { useState } from "react";
import {
  Gift,
  ExternalLink,
  Heart,
  Share2,
  DollarSign,
  Star,
  ArrowLeft,
} from "lucide-react";
import { useSavedGifts } from "../SavedGiftsContext";

export default function GiftRecommendationsPage({ recipientData, onBack }) {
  const [savedGifts, setSavedGifts] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const { saveGift, unsaveGift, isGiftSaved } = useSavedGifts();

  // Use real recommendations from API or fallback to mock data
  const recommendations = recipientData?.recommendations || [
    {
      id: 1,
      name: "Wireless Noise-Canceling Headphones",
      description:
        "Premium over-ear headphones with active noise cancellation, perfect for music lovers and gamers.",
      price: 299.99,
      image: "🎧",
      link: "https://example.com/product1",
      rating: 4.8,
      category: "Electronics",
      reason: "Based on their interest in gaming and technology",
    },
    {
      id: 2,
      name: "Artisan Coffee Subscription Box",
      description:
        "Monthly delivery of specialty coffee beans from around the world, includes tasting notes.",
      price: 49.99,
      image: "☕",
      link: "https://example.com/product2",
      rating: 4.9,
      category: "Food & Beverage",
      reason: "Perfect for coffee enthusiasts",
    },
    {
      id: 3,
      name: "Portable Camping Hammock",
      description:
        "Lightweight, durable hammock with mosquito net. Easy setup for outdoor adventures.",
      price: 79.99,
      image: "🏕️",
      link: "https://example.com/product3",
      rating: 4.7,
      category: "Outdoor",
      reason: "Great for hiking enthusiasts",
    },
    {
      id: 4,
      name: "Smart Fitness Watch",
      description:
        "Track workouts, heart rate, and sleep patterns. GPS enabled with 7-day battery life.",
      price: 249.99,
      image: "⌚",
      link: "https://example.com/product4",
      rating: 4.6,
      category: "Fitness",
      reason: "Matches their fitness and health interests",
    },
    {
      id: 5,
      name: "Professional Chef Knife Set",
      description:
        "High-carbon stainless steel knives with ergonomic handles. Includes 8 essential pieces.",
      price: 159.99,
      image: "🔪",
      link: "https://example.com/product5",
      rating: 4.9,
      category: "Kitchen",
      reason: "Perfect for cooking enthusiasts",
    },
    {
      id: 6,
      name: "Vintage Leather Journal",
      description:
        "Handcrafted leather-bound journal with acid-free paper. Perfect for writers and artists.",
      price: 34.99,
      image: "📖",
      link: "https://example.com/product6",
      rating: 4.8,
      category: "Stationery",
      reason: "Great for creative hobbies",
    },
  ];

  const toggleSave = (gift) => {
    if (isGiftSaved(gift.id)) {
      unsaveGift(gift.id);
      setSavedGifts(savedGifts.filter((id) => id !== gift.id));
    } else {
      saveGift(gift, {
        name: recipientData?.name || "Unknown",
        occasion: recipientData?.occasion || "Special Occasion",
      });
      setSavedGifts([...savedGifts, gift.id]);
    }
  };

  const handleShare = (gift) => {
    alert("Sharing: " + gift.name);
  };

  const handleImageError = (giftId) => {
    setImageErrors((prev) => ({ ...prev, [giftId]: true }));
  };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Search</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gift Recommendations
        </h1>
        <p className="text-gray-600">
          AI-powered gift suggestions based on your search
        </p>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-6 mb-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl">
            🎁
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              Shopping for: {recipientData?.name || "Recipient"}
            </h2>
            <p className="text-purple-100">
              {recipientData?.occasion || "Special Occasion"} • Budget: $
              {recipientData?.minBudget || "0"} - $
              {recipientData?.maxBudget || "100"}
            </p>
          </div>
        </div>
        {recipientData?.interests && (
          <div className="flex flex-wrap gap-2">
            {recipientData.interests.split(",").map((interest, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm"
              >
                {interest.trim()}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Sort by:
            </label>
            <select className="px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all">
              <option>Best Match</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Highest Rated</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Category:
            </label>
            <select className="px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all">
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Food & Beverage</option>
              <option>Outdoor</option>
              <option>Fitness</option>
              <option>Kitchen</option>
              <option>Stationery</option>
            </select>
          </div>
          <div className="ml-auto text-sm text-gray-600">
            <strong>{recommendations.length}</strong> gifts found
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {recommendations.map((gift) => (
          <div
            key={gift.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
          >
            <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 p-8 flex items-center justify-center">
              {gift.imageUrl && !imageErrors[gift.id] ? (
                <img
                  src={gift.imageUrl}
                  alt={gift.name}
                  className="w-full h-48 object-contain transform group-hover:scale-110 transition-transform duration-300"
                  onError={() => handleImageError(gift.id)}
                />
              ) : (
                <div className="text-7xl transform group-hover:scale-110 transition-transform duration-300">
                  {gift.image}
                </div>
              )}
              <button
                onClick={() => toggleSave(gift)}
                className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
                  isGiftSaved(gift.id)
                    ? "bg-red-500 text-white"
                    : "bg-white/80 text-gray-600 hover:bg-white"
                }`}
              >
                <Heart
                  size={20}
                  fill={isGiftSaved(gift.id) ? "currentColor" : "none"}
                />
              </button>
            </div>
            <div className="p-5">
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full mb-3">
                {gift.category}
              </span>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {gift.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">{gift.description}</p>
              <div className="flex items-start gap-2 mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
                <p className="text-xs text-blue-900 font-medium">
                  {gift.reason}
                </p>
              </div>
              <div className="flex items-center gap-1 mb-4">
                <Star
                  size={16}
                  className="text-yellow-500"
                  fill="currentColor"
                />
                <span className="text-sm font-semibold text-gray-900">
                  {gift.rating}
                </span>
                <span className="text-sm text-gray-500">(500+ reviews)</span>
              </div>
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign size={20} className="text-green-600" />
                  <span className="text-2xl font-bold text-gray-900">
                    ${gift.price}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Price may vary - click to see current price
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href={gift.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>View Details</span>
                  <ExternalLink size={16} />
                </a>
                <button
                  onClick={() => handleShare(gift)}
                  className="px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {recommendations.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
            <Gift size={32} className="text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No gifts found
          </h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search criteria or budget range
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Try New Search
          </button>
        </div>
      )}

      {savedGifts.length > 0 && (
        <div className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-full shadow-lg flex items-center gap-3">
          <Heart size={20} fill="currentColor" />
          <span className="font-semibold">
            {savedGifts.length} gift{savedGifts.length !== 1 ? "s" : ""} saved
          </span>
          <button className="ml-2 px-4 py-2 bg-white text-purple-600 font-semibold rounded-full hover:bg-purple-50 transition-all">
            View Saved
          </button>
        </div>
      )}
    </div>
  );
}
