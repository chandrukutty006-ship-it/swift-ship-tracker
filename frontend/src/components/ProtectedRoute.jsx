import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Ship } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-600 text-white animate-bounce shadow-lg">
          <Ship className="w-6 h-6" />
        </div>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
          Verifying Telemetry Credentials...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
