import React from "react";
import { Heart, ExternalLink, Trash2, Gift } from "lucide-react";
import { useSavedGifts } from "../SavedGiftsContext";

export default function SavedGiftsPage() {
  const { savedGifts, unsaveGift, clearAllSavedGifts } = useSavedGifts();

  const handleRemove = (savedId) => {
    if (window.confirm("Remove this gift from your saved list?")) {
      unsaveGift(savedId);
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all saved gifts?")) {
      clearAllSavedGifts();
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Saved Gifts
            </h1>
            <p className="text-gray-600">Your favorite gift ideas</p>
          </div>
          {savedGifts.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <Trash2 size={18} />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      {savedGifts.length > 0 && (
        <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl shadow-lg p-6 mb-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Heart size={32} fill="currentColor" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">{savedGifts.length}</h2>
              <p className="text-red-100">
                {savedGifts.length === 1 ? "Saved Gift" : "Saved Gifts"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Saved Gifts Grid */}
      {savedGifts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedGifts.map((gift) => (
            <div
              key={gift.savedId}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 p-8 flex items-center justify-center">
                {gift.imageUrl ? (
                  <img
                    src={gift.imageUrl}
                    alt={gift.name}
                    className="w-full h-48 object-contain"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "block";
                    }}
                  />
                ) : null}
                <div
                  className="text-7xl"
                  style={{ display: gift.imageUrl ? "none" : "block" }}
                >
                  {gift.image}
                </div>
                <button
                  onClick={() => handleRemove(gift.savedId)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all"
                >
                  <Heart size={20} fill="currentColor" />
                </button>
              </div>

              <div className="p-5">
                {gift.recipientInfo && (
                  <div className="mb-3 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full inline-block">
                    For: {gift.recipientInfo.name}
                  </div>
                )}

                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full mb-3">
                  {gift.category}
                </span>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {gift.name}
                </h3>

                <p className="text-sm text-gray-600 mb-3">{gift.description}</p>

                {gift.reason && (
                  <div className="flex items-start gap-2 mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                      <span className="text-white text-xs font-bold">AI</span>
                    </div>
                    <p className="text-xs text-blue-900 font-medium">
                      {gift.reason}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-gray-900">
                    ${gift.price}
                  </span>
                  {gift.rating && (
                    <span className="text-sm text-gray-500">
                      ⭐ {gift.rating}
                    </span>
                  )}
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  Saved: {new Date(gift.savedAt).toLocaleDateString()}
                </div>

                <div className="flex gap-2">
                  <a
                    href={gift.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span>View on Amazon</span>
                    <ExternalLink size={16} />
                  </a>
                  <button
                    onClick={() => handleRemove(gift.savedId)}
                    className="px-4 py-3 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center">
            <Gift size={32} className="text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No saved gifts yet
          </h3>
          <p className="text-gray-600 mb-6">
            When you find gifts you love, click the heart icon to save them here
          </p>
        </div>
      )}
    </div>
  );
}
