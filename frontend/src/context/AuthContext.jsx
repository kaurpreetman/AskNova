import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');

  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Check login status on mount
  useEffect(() => {
    fetch('http://localhost:5000/auth/me', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setIsAuthenticated(true);
          setUser(data.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
        setUser(null);
      });
  }, []);

  const login = () => {
    // Redirect to backend GitHub OAuth login route
    window.location.href = 'http://localhost:5000/auth/github';
  };

  const logout = () => {
    fetch('http://localhost:5000/auth/logout', {
      method: 'GET',
      credentials: 'include',
    })
      .then(() => {
        setIsAuthenticated(false);
        setUser(null);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setUser(null);
      });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
