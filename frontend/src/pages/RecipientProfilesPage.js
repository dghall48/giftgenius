import React, { useState } from "react";
import { Users, Mail } from "lucide-react";
import { useRecipients } from "../RecipientContext";
import { useActivity } from "../ActivityContext";
import { useAuth } from "../AuthContext";
import EmailFormModal from "../components/EmailFormModal";
import ViewSubmissionsModal from "../components/ViewSubmissionsModal";

export default function RecipientProfilesPage({
  onNavigateHome,
  onFindGiftsForRecipient,
}) {
  const { recipients, deleteRecipient } = useRecipients();
  const { logActivity } = useActivity();
  const { user } = useAuth();
  const [expandedRecipient, setExpandedRecipient] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);

  const handleDelete = (recipientId, recipientName) => {
    if (window.confirm(`Are you sure you want to delete ${recipientName}?`)) {
      deleteRecipient(recipientId);

      // Log activity
      logActivity({
        type: "recipient_deleted",
        title: "Deleted recipient",
        description: recipientName,
      });
    }
  };

  const handleAddNewRecipient = () => {
    // Navigate to home page to add new recipient
    if (onNavigateHome) {
      onNavigateHome();
    }
  };

  const handleFindGifts = (recipient) => {
    // Navigate to home page with pre-filled data
    if (onFindGiftsForRecipient) {
      onFindGiftsForRecipient(recipient);
    }
  };

  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName[0].toUpperCase() : "";
    const lastInitial = lastName ? lastName[0].toUpperCase() : "";
    return firstInitial + lastInitial || "?";
  };

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

      {/* Stats */}
      {recipients.length > 0 && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-6 mb-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Users size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-bold">{recipients.length}</h2>
              <p className="text-purple-100">
                {recipients.length === 1
                  ? "Recipient Saved"
                  : "Recipients Saved"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={handleAddNewRecipient}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
        >
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

        <button
          onClick={() => setShowEmailModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
        >
          <Mail size={20} />
          <span>Send Recipient Form</span>
        </button>

        <button
          onClick={() => setShowSubmissionsModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
        >
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span>View Submissions</span>
        </button>
      </div>

      {/* Recipients Grid */}
      {recipients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recipients.map((recipient) => (
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
                  {getInitials(recipient.firstName, recipient.lastName)}
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
                  {/* Age */}
                  {recipient.age && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Age
                      </label>
                      <p className="text-sm text-gray-700">
                        {recipient.age} years old
                      </p>
                    </div>
                  )}

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
                    <p className="text-sm text-gray-700">
                      {recipient.interests}
                    </p>
                  </div>

                  {/* Last Gift */}
                  {recipient.lastGift && (
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
                  )}

                  {/* Created Date */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Added On
                    </label>
                    <p className="text-sm text-gray-700">
                      {new Date(recipient.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleFindGifts(recipient)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:shadow-md transition-all"
                    >
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
                    <button
                      onClick={() =>
                        handleDelete(
                          recipient.id,
                          `${recipient.firstName} ${recipient.lastName}`
                        )
                      }
                      className="px-4 py-2 border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-all"
                    >
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
      ) : (
        /* Empty State - Show when no recipients */
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
            <Users size={32} className="text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No recipients yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start by adding your first recipient profile on the Home page
          </p>
          <button
            onClick={handleAddNewRecipient}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Go to Home Page
          </button>
        </div>
      )}

      {/* Email Form Modal */}
      <EmailFormModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        user={user}
      />

      {/* View Submissions Modal */}
      <ViewSubmissionsModal
        isOpen={showSubmissionsModal}
        onClose={() => setShowSubmissionsModal(false)}
      />
    </div>
  );
}
