import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Ship, 
  Radar, 
  Search, 
  LayoutDashboard, 
  Package, 
  Anchor, 
  FileText, 
  Mail, 
  Shield, 
  User, 
  LogOut, 
  Menu, 
  X,
  Compass,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DarkModeToggle from './DarkModeToggle';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, isCustomer, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-navy-950/90 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-sky-400 text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Ship className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-400"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                SWIFT <span className="text-brand-600 dark:text-brand-400">SHIP</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 dark:text-slate-500 -mt-1">
                Telemetry & Logistics
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/track"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/track')
                  ? 'bg-brand-50 dark:bg-brand-950/70 text-brand-600 dark:text-brand-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-navy-900'
              }`}
            >
              <Search className="w-4 h-4" />
              Track Shipment
            </Link>

            <Link
              to="/radar"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/radar')
                  ? 'bg-brand-50 dark:bg-brand-950/70 text-brand-600 dark:text-brand-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-navy-900'
              }`}
            >
              <Radar className="w-4 h-4 text-emerald-500 animate-pulse" />
              Global Radar
            </Link>

            <Link
              to="/guide"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/guide')
                  ? 'bg-brand-50 dark:bg-brand-950/70 text-brand-600 dark:text-brand-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-navy-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-brand-500" />
              User Guide
            </Link>

            {/* Admin Links */}
            {isAdmin && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/admin/dashboard')
                      ? 'bg-brand-50 dark:bg-brand-950/70 text-brand-600 dark:text-brand-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-navy-900'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin
                </Link>

                <Link
                  to="/admin/shipments"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/admin/shipments')
                      ? 'bg-brand-50 dark:bg-brand-950/70 text-brand-600 dark:text-brand-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-navy-900'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  Shipments
                </Link>

                <Link
                  to="/admin/vessels"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/admin/vessels')
                      ? 'bg-brand-50 dark:bg-brand-950/70 text-brand-600 dark:text-brand-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-navy-900'
                  }`}
                >
                  <Anchor className="w-4 h-4" />
                  Fleet
                </Link>

                <Link
                  to="/admin/emails"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/admin/emails')
                      ? 'bg-brand-50 dark:bg-brand-950/70 text-brand-600 dark:text-brand-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-navy-900'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  Email Logs
                </Link>
              </>
            )}

            {/* Customer Links */}
            {isCustomer && (
              <Link
                to="/customer/dashboard"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/customer/dashboard')
                    ? 'bg-brand-50 dark:bg-brand-950/70 text-brand-600 dark:text-brand-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-navy-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                My Shipments
              </Link>
            )}
          </div>

          {/* Right Action Icons: Notification, DarkMode, User Profile / Auth */}
          <div className="flex items-center gap-2">
            <NotificationBell />
            <DarkModeToggle />

            {isAuthenticated ? (
              <div className="relative ml-1">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-900 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold shadow">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                      {user?.name}
                    </span>
                    <span className="text-[10px] text-brand-600 dark:text-brand-400 font-bold uppercase tracking-wider">
                      {user?.role}
                    </span>
                  </div>
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white dark:bg-navy-900 shadow-xl border border-slate-200 dark:border-slate-800 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Signed in as</p>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-navy-850"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      My Profile
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin/audit"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-navy-850"
                      >
                        <Shield className="w-4 h-4 text-slate-400" />
                        Audit Trail
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-t border-slate-100 dark:border-slate-800 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 ml-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm shadow-brand-500/20 transition-all hover:shadow"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 px-4 pt-2 pb-4 space-y-1">
          <Link
            to="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-900"
          >
            <Search className="w-4 h-4 text-brand-500" />
            Track Shipment
          </Link>
          <Link
            to="/radar"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-900"
          >
            <Radar className="w-4 h-4 text-emerald-500" />
            Global Fleet Radar
          </Link>
          <Link
            to="/guide"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-900"
          >
            <BookOpen className="w-4 h-4 text-brand-500" />
            User Guide & Docs
          </Link>

          {isAdmin && (
            <>
              <div className="pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Admin Center
              </div>
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-900"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard Overview
              </Link>
              <Link
                to="/admin/shipments"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-900"
              >
                <Package className="w-4 h-4" />
                Manage Shipments
              </Link>
              <Link
                to="/admin/vessels"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-900"
              >
                <Anchor className="w-4 h-4" />
                Vessel Fleet
              </Link>
              <Link
                to="/admin/emails"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-900"
              >
                <Mail className="w-4 h-4" />
                Email Logs
              </Link>
              <Link
                to="/admin/audit"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-900"
              >
                <Shield className="w-4 h-4" />
                Audit Trail
              </Link>
            </>
          )}

          {isCustomer && (
            <Link
              to="/customer/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-900"
            >
              <LayoutDashboard className="w-4 h-4" />
              Customer Dashboard
            </Link>
          )}

          {!isAuthenticated && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2 text-center text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2 text-center text-xs font-semibold rounded-lg bg-brand-600 text-white"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
