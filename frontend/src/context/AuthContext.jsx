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
        if (data) {

          setIsAuthenticated(true);
          setUser(data);
          console.log(data)
          console.log(data._id)
          localStorage.setItem('userId', data._id); // ✅ Store userId
        } else {
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem('userId'); // ❌ Remove if not logged in
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('userId'); // ❌ On error, clear it
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
        localStorage.removeItem('userId'); // ❌ Clear on logout
      })
      .catch(() => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('userId'); // ❌ Clear even on error
      });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
