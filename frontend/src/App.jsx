import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';

import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import CodeGeneration from './components/CodeGeneration';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div className="p-6 text-center">Loading...</div>; // Or a spinner

  return isAuthenticated ? children : <Navigate to='/' replace/>;
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
              </Routes>
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
