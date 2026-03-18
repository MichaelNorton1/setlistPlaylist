import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApi } from '../composables/useApi.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const { api } = useApi();
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("access_token");

    
    if (token) {
      setAccessToken(token);
      sessionStorage.setItem("accessToken", token);
      setIsAuthenticated(true);
      window.history.replaceState({}, document.title, "/");
    } else {
      const storedToken = sessionStorage.getItem("accessToken");
      if (storedToken) {
        setAccessToken(storedToken);
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleSpotifyLogin = () => {
    window.location.href = api.getLoginUrl();
  };

  const logout = () => {
    setAccessToken(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem("accessToken");
  };

  const value = {
    accessToken,
    isAuthenticated,
    handleSpotifyLogin,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
