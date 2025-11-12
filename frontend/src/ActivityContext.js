import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ActivityContext = createContext(null);

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};

export const ActivityProvider = ({ children }) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);

  // Load activities from localStorage when user changes
  useEffect(() => {
    if (user) {
      const userActivities = localStorage.getItem(`activities_${user.id}`);
      if (userActivities) {
        setActivities(JSON.parse(userActivities));
      } else {
        setActivities([]);
      }
    } else {
      setActivities([]);
    }
  }, [user]);

  // Save activities to localStorage whenever they change
  useEffect(() => {
    if (user && activities.length >= 0) {
      localStorage.setItem(`activities_${user.id}`, JSON.stringify(activities));
    }
  }, [activities, user]);

  const logActivity = (activityData) => {
    if (!user) {
      return; // Silently fail if not logged in
    }

    // Create new activity object
    const newActivity = {
      id: Date.now().toString(),
      userId: user.id,
      timestamp: new Date().toISOString(),
      date: new Date(),
      ...activityData,
    };

    // Add to activities array (most recent first)
    setActivities(prev => [newActivity, ...prev]);

    return newActivity;
  };

  const deleteActivity = (activityId) => {
    setActivities(prev => prev.filter(activity => activity.id !== activityId));
  };

  const clearAllActivities = () => {
    if (window.confirm('Are you sure you want to clear all activity history?')) {
      setActivities([]);
    }
  };

  const getActivitiesByType = (type) => {
    return activities.filter(activity => activity.type === type);
  };

  const getRecentActivities = (count = 10) => {
    return activities.slice(0, count);
  };

  const value = {
    activities,
    logActivity,
    deleteActivity,
    clearAllActivities,
    getActivitiesByType,
    getRecentActivities,
  };

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
};