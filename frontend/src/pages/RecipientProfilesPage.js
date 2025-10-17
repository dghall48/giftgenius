import React, { useState } from "react";
import { Users } from "lucide-react";

export default function RecipientProfilesPage() {
  const [expandedRecipient, setExpandedRecipient] = useState(null);

  // Mock recipient data - this will come from your backend later
  const savedRecipients = [
    {
      id: 1,
      firstName: "John",
      lastName: "Smith",
      relationship: "Brother",
      gender: ["Male"],
      interests: "Gaming, Technology, Coffee, Hiking",
      lastGift: "Wireless Headphones",
      lastOccasion: "Birthday",
      initials: "JS",
    },
    {
      id: 2,
      firstName: "Sarah",
      lastName: "Johnson",
      relationship: "Best Friend",
      gender: ["Female"],
      interests: "Reading, Yoga, Cooking, Travel",
      lastGift: "Cookbook Set",
      lastOccasion: "Christmas",
      initials: "SJ",
    },
    {
      id: 3,
      firstName: "Mom",
      lastName: "",
      relationship: "Mother",
      gender: ["Female"],
      interests: "Gardening, Wine tasting, Art",
      lastGift: "Garden Tool Set",
      lastOccasion: "Mother's Day",
      initials: "M",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Recipient Profiles
        </h1>
        <p className="text-gray-600">
          Manage your saved recipients and their preferences
        </p>
      </div>

      {/* Add New Recipient Button */}
      <button className="mb-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <span>Add New Recipient</span>
      </button>

      {/* Recipients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {savedRecipients.map((recipient) => (
          <div
            key={recipient.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
          >
            {/* Card Header - Always Visible */}
            <button
              onClick={() =>
                setExpandedRecipient(
                  expandedRecipient === recipient.id ? null : recipient.id
                )
              }
              className="w-full p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors"
            >
              {/* Avatar */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {recipient.initials}
              </div>

              {/* Info */}
              <div className="flex-1 text-left">
                <h3 className="text-lg font-bold text-gray-900">
                  {recipient.firstName} {recipient.lastName}
                </h3>
                <p className="text-sm text-gray-600">
                  {recipient.relationship}
                </p>
              </div>

              {/* Expand Icon */}
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  expandedRecipient === recipient.id ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Expanded Details */}
            {expandedRecipient === recipient.id && (
              <div className="px-6 pb-6 border-t border-gray-100 pt-4 space-y-4">
                {/* Gender */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Gender
                  </label>
                  <div className="flex gap-2">
                    {recipient.gender.map((g) => (
                      <span
                        key={g}
                        className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-lg text-sm font-medium"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Interests & Hobbies
                  </label>
                  <p className="text-sm text-gray-700">{recipient.interests}</p>
                </div>

                {/* Last Gift */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Last Gift
                    </label>
                    <p className="text-sm text-gray-700">
                      {recipient.lastGift}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Occasion
                    </label>
                    <p className="text-sm text-gray-700">
                      {recipient.lastOccasion}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:shadow-md transition-all">
                    Find Gifts
                  </button>
                  <button className="px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button className="px-4 py-2 border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-all">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State - Show when no recipients */}
      {savedRecipients.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
            <Users size={32} className="text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No recipients yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start by adding your first recipient profile
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200">
            Add Your First Recipient
          </button>
        </div>
      )}
    </div>
  );
}
