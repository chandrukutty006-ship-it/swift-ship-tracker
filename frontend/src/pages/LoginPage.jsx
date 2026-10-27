import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Ship, Lock, Mail, ArrowRight, Eye, EyeOff, Shield, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');

    try {
      setLoading(true);
      const res = await login(email, password);
      if (res.user?.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate(location.state?.from?.pathname || '/customer/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setLoading(true);
    login(demoEmail, demoPassword)
      .then((res) => {
        if (res.user?.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/customer/dashboard');
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Login failed.');
        setLoading(false);
      });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Left Maritime Showcase Panel */}
        <div className="p-8 sm:p-12 bg-gradient-to-br from-slate-900 via-navy-950 to-brand-950 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-400 text-xs font-semibold backdrop-blur-sm">
              <Ship className="w-4 h-4" />
              Swift Ship Authentication
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Real-Time Marine Fleet Telemetry
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Access the administrative control center or customer cargo ledger with JWT encrypted authentication.
            </p>
          </div>

          {/* Demo Quick Logins Box */}
          <div className="relative z-10 pt-8 space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 block">
              1-Click Presentation Access
            </span>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin@swift.com', 'Admin@123')}
              className="w-full p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-left text-xs transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="font-bold text-white block">Login as Administrator</span>
                  <span className="text-[10px] text-slate-300 font-mono">admin@swift.com</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('customer1@swift.com', 'Customer@123')}
              className="w-full p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-left text-xs transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-sky-400" />
                <div>
                  <span className="font-bold text-white block">Login as Customer 1</span>
                  <span className="text-[10px] text-slate-300 font-mono">customer1@swift.com</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('customer2@swift.com', 'Customer@123')}
              className="w-full p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-left text-xs transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-teal-400" />
                <div>
                  <span className="font-bold text-white block">Login as Customer 2</span>
                  <span className="text-[10px] text-slate-300 font-mono">customer2@swift.com</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Sign In to Your Account
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter credentials or click any quick access role on the left.
            </p>
          </div>

          {error && (
            <div className="p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              Register as Customer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
