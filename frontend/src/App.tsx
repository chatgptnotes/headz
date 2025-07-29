import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import TryOnPage from './pages/TryOnPage';
import GalleryPage from './pages/GalleryPage';
import BookingPage from './pages/BookingPage';
import ProfilePage from './pages/ProfilePage';
import { autoSeedIfEmpty } from './utils/seedData';

function App() {
  useEffect(() => {
    // Auto-seed database with sample data if empty
    autoSeedIfEmpty().catch(console.error);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/try-on" element={<TryOnPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
