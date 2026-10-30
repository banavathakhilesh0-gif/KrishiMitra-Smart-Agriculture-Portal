import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { CropAdvisorPage } from './pages/CropAdvisorPage';
import { DiseaseDetectionPage } from './pages/DiseaseDetectionPage';
import { WeatherPage } from './pages/WeatherPage';
import { MarketPricesPage } from './pages/MarketPricesPage';
import { FertilizerAdvisorPage } from './pages/FertilizerAdvisorPage';
import { SchemesPage } from './pages/SchemesPage';
import { ExpertSupportPage } from './pages/ExpertSupportPage';
import { AdminPage } from './pages/AdminPage';
import { User, FarmerProfile, SoilDetail, WeatherData, MandiPrice } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [recentSoil, setRecentSoil] = useState<SoilDetail | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [mandiPrices, setMandiPrices] = useState<MandiPrice[]>([]);

  // Load initial session, weather, and prices
  useEffect(() => {
    // 1. Initial user session
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
          setProfile(data.profile);
          setRecentSoil(data.recentSoil);
        }
      })
      .catch((err) => console.warn('Session load warning', err));

    // 2. Initial weather
    fetch('/api/weather?location=Ludhiana, Punjab')
      .then((res) => res.json())
      .then((data) => setWeather(data))
      .catch((err) => console.warn('Weather load warning', err));

    // 3. Initial mandi prices
    fetch('/api/market-prices')
      .then((res) => res.json())
      .then((data) => setMandiPrices(data))
      .catch((err) => console.warn('Prices load warning', err));
  }, []);

  const handleLoginSuccess = (user: User, prof?: FarmerProfile, soil?: SoilDetail) => {
    setCurrentUser(user);
    if (prof) setProfile(prof);
    if (soil) setRecentSoil(soil);
    setIsAuthOpen(false);
    if (user.role === 'admin') {
      setCurrentPage('admin');
    } else {
      setCurrentPage('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setProfile(null);
    setRecentSoil(null);
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf5] text-[#1c2e20]">
      {/* Top Navigation */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={setCurrentPage}
            mandiPrices={mandiPrices}
          />
        )}

        {currentPage === 'dashboard' && (
          <DashboardPage
            user={currentUser || {
              id: 'user_farmer_1',
              email: 'ramesh@krishimitra.org',
              name: 'Ramesh Kumar Patel',
              role: 'farmer',
              phone: '+91 98765 43210',
              state: 'Punjab',
              district: 'Ludhiana',
            }}
            profile={profile || {
              id: 'fp_1',
              user_id: 'user_farmer_1',
              land_size_acres: 8.5,
              soil_type: 'Alluvial Loam',
              irrigation_source: 'Tube-well & Canal',
              primary_crops: 'Wheat, Basmati Rice, Mustard',
              experience_years: 18,
              cattle_count: 5,
              kisan_credit_card: 1,
            }}
            soil={recentSoil}
            weather={weather}
            mandiPrices={mandiPrices}
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === 'crop-advisor' && <CropAdvisorPage />}

        {currentPage === 'disease-detection' && <DiseaseDetectionPage />}

        {currentPage === 'weather' && <WeatherPage />}

        {currentPage === 'market-prices' && (
          <MarketPricesPage isAdmin={currentUser?.role === 'admin'} />
        )}

        {currentPage === 'fertilizer-advisor' && <FertilizerAdvisorPage />}

        {currentPage === 'government-schemes' && <SchemesPage />}

        {currentPage === 'expert-support' && (
          <ExpertSupportPage currentUser={currentUser} />
        )}

        {currentPage === 'admin' && (
          <AdminPage currentUser={currentUser} />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={setCurrentPage} />

      {/* Authentication & Registration Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
