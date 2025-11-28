import React, { useState, useEffect } from "react";
import { Users, Calendar, Loader } from "lucide-react";
import { useRecipients } from "../RecipientContext";
import { useActivity } from "../ActivityContext";

export default function HomePage({ onSearchGifts, prefilledRecipient }) {
  const { addRecipient } = useRecipients();
  const { logActivity } = useActivity();
  const [selectedOccasion, setSelectedOccasion] = useState(null);
  const [selectedGender, setSelectedGender] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [relationship, setRelationship] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [interests, setInterests] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  // Pre-fill form when prefilledRecipient is provided
  useEffect(() => {
    if (prefilledRecipient) {
      setFirstName(prefilledRecipient.firstName || "");
      setLastName(prefilledRecipient.lastName || "");
      setAge(prefilledRecipient.age || "");
      setRelationship(prefilledRecipient.relationship || "");
      setSelectedGender(prefilledRecipient.gender || []);
      setInterests(prefilledRecipient.interests || "");

      // Scroll to top of page
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [prefilledRecipient]);

  const occasions = [
    { id: "christmas", icon: "🎄", label: "Christmas" },
    { id: "birthday", icon: "🎂", label: "Birthday" },
    { id: "wedding", icon: "💝", label: "Wedding" },
    { id: "valentines", icon: "💕", label: "Valentine's Day" },
    { id: "easter", icon: "🐰", label: "Easter" },
    { id: "hanukkah", icon: "🕎", label: "Hanukkah" },
    { id: "anniversary", icon: "💐", label: "Anniversary" },
    { id: "graduation", icon: "🎓", label: "Graduation" },
    { id: "housewarming", icon: "🏠", label: "Housewarming" },
    { id: "retirement", icon: "🎉", label: "Retirement" },
    { id: "other", icon: "🎁", label: "Other" },
  ];

  const genderOptions = ["Male", "Female", "Other"];

  const toggleGender = (gender) => {
    setSelectedGender((prev) =>
      prev.includes(gender)
        ? prev.filter((g) => g !== gender)
        : [...prev, gender]
    );
  };

  const handleFindGifts = async () => {
    setIsLoading(true);

    // Animated loading messages
    const messages = [
      "Analyzing recipient preferences...",
      "Searching for perfect gifts...",
      "Comparing prices and reviews...",
      "Personalizing recommendations...",
      "Almost there...",
    ];

    let messageIndex = 0;
    setLoadingMessage(messages[0]);

    // Change message every 2 seconds
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      setLoadingMessage(messages[messageIndex]);
    }, 2000);

    // Collect all the form data
    const searchData = {
      firstName,
      lastName,
      age,
      relationship,
      gender: selectedGender,
      occasion:
        occasions.find((occ) => occ.id === selectedOccasion)?.label ||
        "Special Occasion",
      minBudget: minBudget || "0",
      maxBudget: maxBudget || "100",
      interests: interests || "Various interests",
    };

    // Log activity
    logActivity({
      type: "gift_search",
      title: "Searched for gift ideas",
      description: `Found gifts for ${firstName || "Recipient"} ${
        lastName || ""
      } - ${searchData.occasion}`,
    });

    try {
      // Call your backend API
      const response = await fetch(
        "http://localhost:5001/api/recommendations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(searchData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get recommendations");
      }

      const data = await response.json();
      console.log("Received recommendations:", data);

      // Clear interval
      clearInterval(messageInterval);
      setIsLoading(false);

      // Pass the data to the recommendations page
      if (onSearchGifts) {
        onSearchGifts({
          ...searchData,
          name: `${firstName} ${lastName}`.trim() || "Recipient",
          recommendations: data.recommendations,
        });
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      clearInterval(messageInterval);
      setIsLoading(false);
      alert("Failed to get gift recommendations. Please try again.");
    }
  };

  const handleSaveRecipient = () => {
    // Validate required fields
    if (!firstName) {
      alert("Please enter a first name");
      return;
    }

    try {
      // Create recipient data object
      const recipientData = {
        firstName,
        lastName,
        age: age || null,
        relationship: relationship || "Unknown",
        gender: selectedGender.length > 0 ? selectedGender : ["Other"],
        interests: interests || "No interests specified",
      };

      // Save using RecipientContext
      addRecipient(recipientData);

      // Log activity
      logActivity({
        type: "recipient_added",
        title: "Added new recipient",
        description: `${firstName} ${lastName || ""} - ${
          recipientData.relationship
        }`,
      });

      // Show success message
      alert(
        `${firstName} ${lastName || ""} has been saved to your recipients!`
      );
    } catch (error) {
      console.error("Error saving recipient:", error);
      alert("Failed to save recipient. Please try again.");
    }
  };

  return (
    <>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="flex flex-col items-center">
              {/* Animated loader */}
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
                <div
                  className="absolute inset-2 border-4 border-transparent border-t-pink-600 rounded-full animate-spin"
                  style={{
                    animationDirection: "reverse",
                    animationDuration: "1s",
                  }}
                ></div>
                <Loader
                  className="absolute inset-0 m-auto text-purple-600 animate-pulse"
                  size={32}
                />
              </div>

              {/* Loading message */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Finding Perfect Gifts
              </h3>
              <p className="text-gray-600 text-center mb-4">{loadingMessage}</p>

              {/* Progress dots */}
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pre-filled indicator banner */}
      {prefilledRecipient && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-lg p-4 mb-6 text-white flex items-center gap-3">
          <svg
            className="w-6 h-6 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <p className="font-semibold">
              Form pre-filled with {prefilledRecipient.firstName}'s information
            </p>
            <p className="text-sm text-blue-100">
              Adjust details and select an occasion, then click "Find Perfect
              Gifts"
            </p>
          </div>
        </div>
      )}

      {/* Who are you shopping for? Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
            <Users size={20} className="text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Who are you shopping for?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter first name"
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter last name"
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Age
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Age"
              min="0"
              max="120"
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Relationship
            </label>
            <input
              type="text"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="e.g., Friend, Family, Colleague"
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Gender
            </label>
            <div className="flex gap-2">
              {genderOptions.map((gender) => (
                <button
                  key={gender}
                  type="button"
                  onClick={() => toggleGender(gender)}
                  disabled={isLoading}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                    selectedGender.includes(gender)
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save Recipient Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleSaveRecipient}
            disabled={isLoading}
            className="group px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
            <span>Save Recipient Profile</span>
          </button>
        </div>
      </section>

      {/* What's the occasion? Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
            <Calendar size={20} className="text-pink-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            What's the occasion?
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {occasions.map((occasion) => (
            <button
              key={occasion.id}
              type="button"
              onClick={() => setSelectedOccasion(occasion.id)}
              disabled={isLoading}
              className={`group relative p-4 rounded-xl border-2 transition-all duration-300 ${
                selectedOccasion === occasion.id
                  ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg shadow-purple-100"
                  : "border-gray-200 hover:border-purple-300 hover:shadow-md bg-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform">
                {occasion.icon}
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {occasion.label}
              </p>
              {selectedOccasion === occasion.id && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Budget Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            What's your budget?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Minimum ($)
            </label>
            <input
              type="number"
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value)}
              placeholder="0"
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Maximum ($)
            </label>
            <input
              type="number"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              placeholder="100"
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </section>

      {/* Interests & Hobbies Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Interests & Hobbies
          </h2>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            What are they passionate about?
          </label>
          <textarea
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="e.g., Reading, Gaming, Cooking, Fitness, Travel, Photography..."
            rows={4}
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-2">
            Tell us about their hobbies, interests, or things they love to help
            us find the perfect gift!
          </p>
        </div>
      </section>

      {/* Find Perfect Gifts Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleFindGifts}
          disabled={isLoading}
          className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Searching...</span>
            </>
          ) : (
            <>
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span>Find Perfect Gifts</span>
              <svg
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </>
          )}
        </button>
      </div>
    </>
  );
}
