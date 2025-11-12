import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  const signup = (userData) => {
    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if email already exists
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('An account with this email already exists');
    }

    // Create new user object
    const newUser = {
      id: Date.now().toString(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password, // In production, this should be hashed!
      createdAt: new Date().toISOString(),
    };

    // Save to users array
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Set as current user (without password in state)
    const { password, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);

    return userWithoutPassword;
  };

  const login = (email, password) => {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Find user with matching email and password
    const user = users.find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Set as current user (without password in state)
    const { password: _, ...userWithoutPassword } = user;
    setUser(userWithoutPassword);

    return userWithoutPassword;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = (updatedData) => {
    // Update user in state
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);

    // Update in localStorage users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updatedData };
      localStorage.setItem('users', JSON.stringify(users));
    }

    return updatedUser;
  };

  const value = {
    user,
    isLoading,
    signup,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};