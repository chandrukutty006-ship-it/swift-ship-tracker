import React from 'react';
import { Ship, Radio, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-navy-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Ship className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-slate-900 dark:text-white tracking-tight">
                SWIFT SHIP TRACKER
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Full-Stack Multimodal Cargo & Vessel Telemetry System with live OpenStreetMap GPS simulation and ETA estimation.
            </p>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>GPS Telemetry Simulator: Online</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider text-[11px]">
              System Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/track" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Public Shipment Lookup
                </Link>
              </li>
              <li>
                <Link to="/radar" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Live Global Fleet Radar
                </Link>
              </li>
              <li>
                <Link to="/guide" className="hover:text-brand-600 dark:hover:text-brand-400 font-semibold text-brand-600 dark:text-brand-400 transition-colors flex items-center gap-1">
                  <span>📖 Full User Guide & Manual</span>
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Client & Admin Portal
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Create Shipper Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Demonstration Shipments */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider text-[11px]">
              Sample Consignments
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/track?id=SST-CHNSIN01" className="hover:text-brand-600 dark:hover:text-brand-400 font-mono transition-colors">
                  SST-CHNSIN01 (Chennai → SIN)
                </Link>
              </li>
              <li>
                <Link to="/track?id=SST-BOMDXB02" className="hover:text-brand-600 dark:hover:text-brand-400 font-mono transition-colors">
                  SST-BOMDXB02 (Mumbai → DXB)
                </Link>
              </li>
              <li>
                <Link to="/track?id=SST-CMBRTM03" className="hover:text-brand-600 dark:hover:text-brand-400 font-mono transition-colors">
                  SST-CMBRTM03 (Colombo → RTM)
                </Link>
              </li>
              <li>
                <Link to="/track?id=SST-NYCLON05" className="hover:text-brand-600 dark:hover:text-brand-400 font-mono transition-colors">
                  SST-NYCLON05 (New York → LON)
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech Stack & Academic Info */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider text-[11px]">
              Academic Architecture
            </h4>
            <div className="flex flex-wrap gap-1.5 mb-3">
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-850 text-slate-700 dark:text-slate-300 text-[10px] font-mono">React 18</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-850 text-slate-700 dark:text-slate-300 text-[10px] font-mono">Leaflet OSM</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-850 text-slate-700 dark:text-slate-300 text-[10px] font-mono">Node / Express</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-850 text-slate-700 dark:text-slate-300 text-[10px] font-mono">SQLite (sql.js)</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-850 text-slate-700 dark:text-slate-300 text-[10px] font-mono">Socket.IO</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-850 text-slate-700 dark:text-slate-300 text-[10px] font-mono">Tailwind CSS</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Engineered as a Final Year Project demonstrating zero-friction deployment, live WebSocket telemetry, and role-based security.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800/80 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Swift Ship Tracker. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <span>Designed with precision for modern maritime logistics</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
