import React from 'react';
import { Radar, Ship, Globe2, Activity } from 'lucide-react';
import GlobalFleetMap from '../components/GlobalFleetMap';
import SimulatorControls from '../components/SimulatorControls';

export default function AdminLiveRadarPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-500 uppercase tracking-widest mb-1">
            <Radar className="w-4 h-4 animate-spin text-emerald-400" />
            Global Marine Telemetry Network
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Live Vessel & Cargo Radar
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time positions streamed via Socket.IO directly from active container ships and freight haulers.
          </p>
        </div>
      </div>

      {/* Simulator Controller */}
      <SimulatorControls />

      {/* Full Map Canvas */}
      <GlobalFleetMap height="650px" />
    </div>
  );
}
