import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  Ship, 
  Radar, 
  ShieldCheck, 
  Clock, 
  QrCode, 
  FileText, 
  ArrowRight, 
  Activity, 
  Globe2, 
  CheckCircle2, 
  Zap, 
  Sparkles,
  Layers,
  ChevronRight,
  TrendingUp,
  Mail,
  Send
} from 'lucide-react';
import GlobalFleetMap from '../components/GlobalFleetMap';
import { DEMO_TRACKING_IDS } from '../utils/constants';

export default function LandingPage() {
  const [trackingInput, setTrackingInput] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (trackingInput.trim()) {
      navigate(`/track?id=${trackingInput.trim().toUpperCase()}`);
    }
  };

  const handleDemoClick = (id) => {
    navigate(`/track?id=${id}`);
  };

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Ambient Gradient Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-600/15 via-sky-500/15 to-transparent blur-3xl pointer-events-none rounded-full -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold shadow-sm animate-in fade-in slide-in-from-top-3 duration-500">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Next-Gen Maritime Telemetry System</span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="text-brand-600 dark:text-brand-400 font-mono">Live Simulation Active</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Precision Cargo Tracking & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-sky-500 to-teal-400">
              Live Marine Vessel Telemetry
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Monitor international consignments in real time with OpenStreetMap navigation, automated GPS route simulation, intelligent ETA forecasting, and verified digital bills of lading.
          </p>

          {/* Quick Tracking Search Box */}
          <div className="max-w-2xl mx-auto pt-4">
            <form
              onSubmit={handleSearch}
              className="relative flex items-center shadow-xl rounded-2xl bg-white dark:bg-navy-900 p-2 border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-brand-500 transition-all"
            >
              <div className="pl-3 pr-2 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                required
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="Enter Consignment Tracking ID (e.g. SST-CHNSIN01)"
                className="w-full bg-transparent px-2 py-2.5 text-sm sm:text-base font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none uppercase"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-brand-500/20 transition-all flex-shrink-0"
              >
                Track Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Tracking Chips */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Demo Pointers:</span>
              {DEMO_TRACKING_IDS.slice(0, 4).map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => handleDemoClick(d.id)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-navy-850 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-medium border border-slate-200 dark:border-slate-800 transition-colors flex items-center gap-1"
                >
                  <span>{d.id}</span>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">({d.route})</span>
                </button>
              ))}
            </div>

            <div className="mt-4">
              <Link
                to="/guide"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900/60 transition-colors border border-brand-200 dark:border-brand-800/80"
              >
                <span>📖 Looking for help? Read the Full User & Feature Guide</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-white dark:bg-navy-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-sm text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white block font-mono">
                20+
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Global Trade Lanes
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-navy-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-sm text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-sky-500 block font-mono">
                100%
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Open Telemetry
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-navy-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-sm text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-500 block font-mono">
                &lt; 3s
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Socket.IO Latency
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-navy-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-sm text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-brand-600 dark:text-brand-400 block font-mono">
                Zero
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                API Key Friction
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Global Radar Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-500 uppercase tracking-widest mb-1">
              <Radar className="w-4 h-4 animate-spin text-emerald-400" />
              Real-Time Global Vessel Radar
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Live Fleet Movement on OpenStreetMap
            </h2>
          </div>
          <Link
            to="/radar"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Launch Full Screen Global Radar
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <GlobalFleetMap height="500px" />
      </section>

      {/* 3. Core Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Enterprise Architecture
          </span>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
            Engineered for Modern Multimodal Freight
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
            Built from scratch to fulfill final year project standards with end-to-end reliability, clean schema separation, and interactive presentation features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Background GPS Route Simulator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Autonomous background engine interpolates vessel coordinates along maritime waypoints every few seconds. Demonstrates live moving ships without needing physical hardware.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Haversine Dynamic ETA Engine
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Mathematical great-circle distance formulas compute remaining nautical miles and dynamically flag delays against estimated arrival targets.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Instant QR Scanning & PDF Receipts
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Auto-generates printable QR codes linking to public tracking and generates client-side multimodal bills of lading using jsPDF.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Ship className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Fleet & Carrier Management
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Track multi-carrier fleets including ultra-large container ships, bulk ore carriers, air cargo freighters, and heavy haulers with IMO registration.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              In-App Alerts & Email Logs
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Real-time notification bell with audio pings alongside a simulated transactional email dispatcher complete with full responsive HTML previews.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Role-Based Access & Audit Trail
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Secure JWT authentication, bcrypt passwords, customer dashboards, and an immutable administrative activity log for presentation inspection.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Interactive "How It Works" Flow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white border border-slate-800 relative overflow-hidden">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
              Operational Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-1 text-white">
              From Port Induction to Final Delivery
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-sm border border-sky-500/30">
                01
              </div>
              <h4 className="font-bold text-sm text-white">Consignment Booking</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Admin logs cargo specs, sender and receiver details; system generates unique SST-XXXXXXXX ID.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-sm border border-sky-500/30">
                02
              </div>
              <h4 className="font-bold text-sm text-white">Vessel Allocation & Polyline</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Vessel is assigned and mathematical navigation waypoints are synthesized between ports.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-sm border border-sky-500/30">
                03
              </div>
              <h4 className="font-bold text-sm text-white">Live Telemetry Pings</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Simulator advances cargo across oceans while Socket.IO pushes live location updates to open maps.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/30">
                04
              </div>
              <h4 className="font-bold text-sm text-white">Customs & Delivery</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Checkpoints log timeline milestones, notifying client via in-app bell and simulated dispatch email.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Contact & Support Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Have questions for project presentation or evaluation?
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Swift Ship Tracker is designed with modular controllers and clean SQL queries so every architectural question can be explained in seconds.
          </p>

          {contactSubmitted ? (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold text-xs inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Thank you! Message received in simulation sandbox.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setContactSubmitted(true);
              }}
              className="max-w-md mx-auto flex items-center gap-2 pt-2"
            >
              <input
                type="email"
                required
                placeholder="Enter email for viva walkthrough notes..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Submit
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}
