import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// AuthContext.js
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const stored = localStorage.getItem('isAuthenticated');
    return stored === 'true';
  });
 const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(true); // Add this

  useEffect(() => {
    fetch('http://localhost:5000/auth/me', {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then(data => {
        if (data && data._id) {
          setIsAuthenticated(true);
          setUser(data);
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('user', JSON.stringify(data));
        } else {
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('user');
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = () => {
    window.location.href = 'http://localhost:5000/auth/github';
  };

  const logout = () => {
    fetch('http://localhost:5000/auth/logout', {
      method: 'GET',
      credentials: 'include',
    }).finally(() => {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('user');
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
