// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/shared/Navbar';
import LoadingSpinner from './components/shared/LoadingSpinner';

// Pages
import LandingPage            from './pages/LandingPage';
import CustomerRegisterPage   from './pages/customer/RegisterPage';
import CustomerLoginPage      from './pages/customer/LoginPage';
import CustomerDashboard      from './pages/customer/DashboardPage';
import RestaurantRegisterPage from './pages/restaurant/RegisterPage';
import RestaurantLoginPage    from './pages/restaurant/LoginPage';
import RestaurantDashboard    from './pages/restaurant/DashboardPage';

import './styles/globals.css';

// ── Route guards ────────────────────────────────────────────────
function RequireCustomer({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user || user.role !== 'customer') return <Navigate to="/login" replace />;
  return children;
}

function RequireRestaurant({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user || user.role !== 'restaurant') return <Navigate to="/restaurant/login" replace />;
  return children;
}

function RedirectIfLoggedIn({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (user) {
    return <Navigate to={user.role === 'restaurant' ? '/restaurant/dashboard' : '/dashboard'} replace />;
  }
  return children;
}

// ── App shell ────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />

        {/* Customer auth */}
        <Route path="/register" element={
          <RedirectIfLoggedIn><CustomerRegisterPage /></RedirectIfLoggedIn>
        } />
        <Route path="/login" element={
          <RedirectIfLoggedIn><CustomerLoginPage /></RedirectIfLoggedIn>
        } />

        {/* Customer protected */}
        <Route path="/dashboard" element={
          <RequireCustomer><CustomerDashboard /></RequireCustomer>
        } />

        {/* Restaurant auth */}
        <Route path="/restaurant/register" element={
          <RedirectIfLoggedIn><RestaurantRegisterPage /></RedirectIfLoggedIn>
        } />
        <Route path="/restaurant/login" element={
          <RedirectIfLoggedIn><RestaurantLoginPage /></RedirectIfLoggedIn>
        } />

        {/* Restaurant protected */}
        <Route path="/restaurant/dashboard" element={
          <RequireRestaurant><RestaurantDashboard /></RequireRestaurant>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
