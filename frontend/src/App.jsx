import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CodeGeneration from './components/CodeGeneration';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HeroSection />} />
                <Route
                  path="/generate"
                  element={
                    <PrivateRoute>
                      <CodeGeneration />
                    </PrivateRoute>
                  }
                />
                {/* Add any other routes */}
              </Routes>
            </main>
       
          </div>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
