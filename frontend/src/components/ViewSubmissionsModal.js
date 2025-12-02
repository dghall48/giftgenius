import React, { useState, useEffect } from "react";
import { X, User, Calendar } from "lucide-react";

export default function ViewSubmissionsModal({ isOpen, onClose }) {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSubmissions();
    }
  }, [isOpen]);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5001/api/recipient-forms");
      const data = await response.json();
      setSubmissions(data.submissions || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-t-2xl sticky top-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Form Submissions</h2>
              <p className="text-green-100 text-sm">
                {submissions.length}{" "}
                {submissions.length === 1 ? "submission" : "submissions"}{" "}
                received
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading submissions...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12">
              <User className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600">No form submissions yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div
                  key={submission.token}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {submission.firstName} {submission.lastName}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <Calendar size={14} />
                        {new Date(submission.submittedAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                    {submission.age && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        Age {submission.age}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {submission.interests && (
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">
                          Interests
                        </label>
                        <p className="text-sm text-gray-700 mt-1">
                          {submission.interests}
                        </p>
                      </div>
                    )}

                    {submission.hobbies && (
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">
                          Hobbies
                        </label>
                        <p className="text-sm text-gray-700 mt-1">
                          {submission.hobbies}
                        </p>
                      </div>
                    )}

                    {submission.favoriteColors && (
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">
                          Favorite Colors
                        </label>
                        <p className="text-sm text-gray-700 mt-1">
                          {submission.favoriteColors}
                        </p>
                      </div>
                    )}

                    {submission.clothing && (
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">
                          Sizes
                        </label>
                        <p className="text-sm text-gray-700 mt-1">
                          {submission.clothing.shirtSize &&
                            `Shirt: ${submission.clothing.shirtSize}`}
                          {submission.clothing.shoeSize &&
                            ` • Shoe: ${submission.clothing.shoeSize}`}
                          {submission.clothing.preferredStyle &&
                            ` • Style: ${submission.clothing.preferredStyle}`}
                        </p>
                      </div>
                    )}

                    {submission.wishlist && (
                      <div className="md:col-span-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase">
                          Wishlist
                        </label>
                        <p className="text-sm text-gray-700 mt-1">
                          {submission.wishlist}
                        </p>
                      </div>
                    )}

                    {submission.dislikes && (
                      <div className="md:col-span-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase">
                          Dislikes / Allergies
                        </label>
                        <p className="text-sm text-gray-700 mt-1">
                          {submission.dislikes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                    Sent by: {submission.tokenData?.senderName} • To:{" "}
                    {submission.tokenData?.recipientEmail}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
