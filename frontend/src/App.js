import React, { useState } from "react";
import { Home, Users, Calendar, Activity } from "lucide-react";
import HomePage from "./pages/HomePage";
import RecipientProfilesPage from "./pages/RecipientProfilesPage";
import OccasionCalendarPage from "./pages/OccasionCalendarPage";
import RecentActivityPage from "./pages/RecentActivityPage";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";
import AccountSettingsPage from "./pages/AccountSettingsPage";
import HelpSupportPage from "./pages/HelpSupportPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import GiftRecommendationsPage from "./pages/GiftRecommendationsPage";

export default function GiftGeniusApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthPage, setShowAuthPage] = useState("login"); // 'login' or 'signup'
  const [selectedNav, setSelectedNav] = useState("home");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showGiftRecommendations, setShowGiftRecommendations] = useState(false);
  const [recipientSearchData, setRecipientSearchData] = useState(null);

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "recipients", label: "Recipient Profiles", icon: Users },
    { id: "calendar", label: "Occasion Calendar", icon: Calendar },
    { id: "activity", label: "Recent Activity", icon: Activity },
  ];

  // Handle login
  const handleLogin = () => {
    setIsAuthenticated(true);
    setSelectedNav("home");
  };

  // Handle signup
  const handleSignup = () => {
    setIsAuthenticated(true);
    setSelectedNav("home");
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowAuthPage("login");
    setSelectedNav("home");
    setShowUserMenu(false);
  };

  // Render the current page based on selectedNav
  const renderPage = () => {
    // If showing gift recommendations, render that page
    if (showGiftRecommendations) {
      return (
        <GiftRecommendationsPage
          recipientData={recipientSearchData}
          onBack={() => setShowGiftRecommendations(false)}
        />
      );
    }

    switch (selectedNav) {
      case "home":
        return (
          <HomePage
            onSearchGifts={(data) => {
              setRecipientSearchData(data);
              setShowGiftRecommendations(true);
            }}
          />
        );
      case "recipients":
        return <RecipientProfilesPage />;
      case "calendar":
        return <OccasionCalendarPage />;
      case "activity":
        return <RecentActivityPage />;
      case "profile-settings":
        return <ProfileSettingsPage />;
      case "account-settings":
        return <AccountSettingsPage />;
      case "help-support":
        return <HelpSupportPage />;
      default:
        return (
          <HomePage
            onSearchGifts={(data) => {
              setRecipientSearchData(data);
              setShowGiftRecommendations(true);
            }}
          />
        );
    }
  };

  // If not authenticated, show login or signup page
  if (!isAuthenticated) {
    if (showAuthPage === "login") {
      return (
        <LoginPage
          onLogin={handleLogin}
          onSwitchToSignup={() => setShowAuthPage("signup")}
        />
      );
    } else {
      return (
        <SignupPage
          onSignup={handleSignup}
          onSwitchToLogin={() => setShowAuthPage("login")}
        />
      );
    }
  }

  // Main authenticated app
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            GiftGenius
          </h1>
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 hover:bg-gray-50 rounded-xl px-3 py-2 transition-colors"
            >
              <div className="text-right">
                <p className="text-sm text-gray-500">Welcome,</p>
                <p className="text-sm font-semibold text-gray-900">Jane Doe</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                JD
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">
                    Jane Doe
                  </p>
                  <p className="text-xs text-gray-500">jane.doe@example.com</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedNav("profile-settings");
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Profile Settings
                </button>
                <button
                  onClick={() => {
                    setSelectedNav("account-settings");
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Account Settings
                </button>
                <button
                  onClick={() => {
                    setSelectedNav("help-support");
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Help & Support
                </button>
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 p-6">
          <nav className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Discover
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedNav(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    selectedNav === item.id
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-200"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto max-w-6xl">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
