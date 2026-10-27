import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import PublicTrackingPage from './pages/PublicTrackingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminShipmentsPage from './pages/AdminShipmentsPage';
import AdminVesselsPage from './pages/AdminVesselsPage';
import AdminLiveRadarPage from './pages/AdminLiveRadarPage';
import AdminAuditLogPage from './pages/AdminAuditLogPage';
import AdminEmailsPage from './pages/AdminEmailsPage';
import UserGuidePage from './pages/UserGuidePage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/track" element={<PublicTrackingPage />} />
                <Route path="/track/:trackingId" element={<PublicTrackingPage />} />
                <Route path="/radar" element={<AdminLiveRadarPage />} />
                <Route path="/guide" element={<UserGuidePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Authenticated User Routes */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Customer Routes */}
                <Route
                  path="/customer/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/shipments"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminShipmentsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/vessels"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminVesselsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/radar"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminLiveRadarPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/audit"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminAuditLogPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/emails"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminEmailsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
