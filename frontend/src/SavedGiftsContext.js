import React, { createContext, useContext, useState, useEffect } from "react";

const SavedGiftsContext = createContext();

export function SavedGiftsProvider({ children }) {
  const [savedGifts, setSavedGifts] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("giftgenius_saved_gifts");
    if (saved) {
      try {
        setSavedGifts(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading saved gifts:", error);
      }
    }
  }, []);

  // Save to localStorage whenever savedGifts changes
  useEffect(() => {
    localStorage.setItem("giftgenius_saved_gifts", JSON.stringify(savedGifts));
  }, [savedGifts]);

  const saveGift = (gift, recipientInfo) => {
    const savedGift = {
      ...gift,
      savedAt: new Date().toISOString(),
      recipientInfo: recipientInfo || null,
      savedId: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    setSavedGifts((prev) => [savedGift, ...prev]);
  };

  const unsaveGift = (savedId) => {
    setSavedGifts((prev) => prev.filter((gift) => gift.savedId !== savedId));
  };

  const isGiftSaved = (giftId) => {
    return savedGifts.some((gift) => gift.id === giftId);
  };

  const clearAllSavedGifts = () => {
    setSavedGifts([]);
  };

  return (
    <SavedGiftsContext.Provider
      value={{
        savedGifts,
        saveGift,
        unsaveGift,
        isGiftSaved,
        clearAllSavedGifts,
      }}
    >
      {children}
    </SavedGiftsContext.Provider>
  );
}

export function useSavedGifts() {
  const context = useContext(SavedGiftsContext);
  if (!context) {
    throw new Error("useSavedGifts must be used within a SavedGiftsProvider");
  }
  return context;
}
