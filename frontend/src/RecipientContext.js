import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const RecipientContext = createContext(null);

export const useRecipients = () => {
  const context = useContext(RecipientContext);
  if (!context) {
    throw new Error('useRecipients must be used within a RecipientProvider');
  }
  return context;
};

export const RecipientProvider = ({ children }) => {
  const { user } = useAuth();
  const [recipients, setRecipients] = useState([]);

  // Load recipients from localStorage when user changes
  useEffect(() => {
    if (user) {
      const userRecipients = localStorage.getItem(`recipients_${user.id}`);
      if (userRecipients) {
        setRecipients(JSON.parse(userRecipients));
      } else {
        setRecipients([]);
      }
    } else {
      setRecipients([]);
    }
  }, [user]);

  // Save recipients to localStorage whenever they change
  useEffect(() => {
    if (user && recipients.length >= 0) {
      localStorage.setItem(`recipients_${user.id}`, JSON.stringify(recipients));
    }
  }, [recipients, user]);

  const addRecipient = (recipientData) => {
    if (!user) {
      throw new Error('Must be logged in to add recipients');
    }

    // Create new recipient object with ID and timestamp
    const newRecipient = {
      id: Date.now().toString(),
      userId: user.id,
      ...recipientData,
      createdAt: new Date().toISOString(),
      lastGift: null,
      lastOccasion: null,
    };

    // Add to recipients array
    setRecipients(prev => [...prev, newRecipient]);

    return newRecipient;
  };

  const updateRecipient = (recipientId, updatedData) => {
    setRecipients(prev =>
      prev.map(recipient =>
        recipient.id === recipientId
          ? { ...recipient, ...updatedData, updatedAt: new Date().toISOString() }
          : recipient
      )
    );
  };

  const deleteRecipient = (recipientId) => {
    setRecipients(prev => prev.filter(recipient => recipient.id !== recipientId));
  };

  const getRecipientById = (recipientId) => {
    return recipients.find(recipient => recipient.id === recipientId);
  };

  const value = {
    recipients,
    addRecipient,
    updateRecipient,
    deleteRecipient,
    getRecipientById,
  };

  return (
    <RecipientContext.Provider value={value}>
      {children}
    </RecipientContext.Provider>
  );
};