import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const OccasionContext = createContext(null);

export const useOccasions = () => {
  const context = useContext(OccasionContext);
  if (!context) {
    throw new Error('useOccasions must be used within an OccasionProvider');
  }
  return context;
};

export const OccasionProvider = ({ children }) => {
  const { user } = useAuth();
  const [occasions, setOccasions] = useState([]);

  // Load occasions from localStorage when user changes
  useEffect(() => {
    if (user) {
      const userOccasions = localStorage.getItem(`occasions_${user.id}`);
      if (userOccasions) {
        setOccasions(JSON.parse(userOccasions));
      } else {
        setOccasions([]);
      }
    } else {
      setOccasions([]);
    }
  }, [user]);

  // Save occasions to localStorage whenever they change
  useEffect(() => {
    if (user && occasions.length >= 0) {
      localStorage.setItem(`occasions_${user.id}`, JSON.stringify(occasions));
    }
  }, [occasions, user]);

  const addOccasion = (occasionData) => {
    if (!user) {
      throw new Error('Must be logged in to add occasions');
    }

    // Create new occasion object with ID and timestamp
    const newOccasion = {
      id: Date.now().toString(),
      userId: user.id,
      ...occasionData,
      createdAt: new Date().toISOString(),
    };

    // Add to occasions array
    setOccasions(prev => [...prev, newOccasion]);

    return newOccasion;
  };

  const updateOccasion = (occasionId, updatedData) => {
    setOccasions(prev =>
      prev.map(occasion =>
        occasion.id === occasionId
          ? { ...occasion, ...updatedData, updatedAt: new Date().toISOString() }
          : occasion
      )
    );
  };

  const deleteOccasion = (occasionId) => {
    setOccasions(prev => prev.filter(occasion => occasion.id !== occasionId));
  };

  const getOccasionById = (occasionId) => {
    return occasions.find(occasion => occasion.id === occasionId);
  };

  const getUpcomingOccasions = (daysAhead = 90) => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + daysAhead);

    return occasions
      .filter(occasion => {
        const occasionDate = new Date(occasion.date);
        return occasionDate >= today && occasionDate <= futureDate;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getOccasionsForDate = (dateString) => {
    return occasions.filter(occasion => occasion.date === dateString);
  };

  const value = {
    occasions,
    addOccasion,
    updateOccasion,
    deleteOccasion,
    getOccasionById,
    getUpcomingOccasions,
    getOccasionsForDate,
  };

  return (
    <OccasionContext.Provider value={value}>
      {children}
    </OccasionContext.Provider>
  );
};