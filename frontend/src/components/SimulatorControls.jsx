import React, { useState, useEffect } from 'react';
import { Play, Pause, FastForward, RotateCcw, StepForward, Activity, Zap } from 'lucide-react';
import api from '../services/api';
import { socket } from '../services/socket';

export default function SimulatorControls({ className = '' }) {
  const [status, setStatus] = useState({
    isRunning: true,
    speedMultiplier: 1.0,
    intervalMs: 3000,
  });
  const [loading, setLoading] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');

  const fetchStatus = async () => {
    try {
      const res = await api.get('/simulator/status');
      if (res.data.success) {
        setStatus(res.data.status);
      }
    } catch (err) {
      console.error('Failed to load simulator status:', err);
    }
  };

  useEffect(() => {
    fetchStatus();

    const handleSimulatorUpdate = (newStatus) => {
      setStatus(newStatus);
    };

    socket.on('simulator:status_update', handleSimulatorUpdate);

    return () => {
      socket.off('simulator:status_update', handleSimulatorUpdate);
    };
  }, []);

  const flashMessage = (msg) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(''), 2500);
  };

  const handleToggle = async () => {
    try {
      setLoading(true);
      const res = await api.post('/simulator/toggle', { running: !status.isRunning });
      if (res.data.success) {
        setStatus(res.data.status);
        flashMessage(res.data.status.isRunning ? 'GPS Simulation Resumed' : 'GPS Simulation Paused');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSetSpeed = async (multiplier) => {
    try {
      setLoading(true);
      const res = await api.post('/simulator/speed', { speed: multiplier });
      if (res.data.success) {
        setStatus(res.data.status);
        flashMessage(`Speed set to ${multiplier}x`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStepOnce = async () => {
    try {
      setLoading(true);
      await api.post('/simulator/step');
      flashMessage('Stepped forward 1 simulation tick');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset all active shipments back to their origin ports to replay demo?')) {
      return;
    }
    try {
      setLoading(true);
      await api.post('/simulator/reset');
      flashMessage('Active shipments reset to origins for demo replay!');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 border border-slate-700/80 shadow-xl text-white ${className}`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-sky-950/80 border border-sky-800 text-sky-400">
            <Activity className={`w-5 h-5 ${status.isRunning ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">Live GPS Simulation Engine</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  status.isRunning
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}
              >
                {status.isRunning ? 'RUNNING' : 'PAUSED'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Interpolating coordinates every {status.intervalMs / 1000}s ({status.speedMultiplier}x)
              {notificationMsg && (
                <span className="ml-2 text-sky-400 font-semibold animate-in fade-in">
                  • {notificationMsg}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Play/Pause */}
          <button
            type="button"
            onClick={handleToggle}
            disabled={loading}
            className={`px-3 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all shadow ${
              status.isRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {status.isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                Pause Telemetry
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                Resume Simulation
              </>
            )}
          </button>

          {/* Speed Multipliers */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <span className="text-[10px] font-bold text-slate-400 px-2 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              Speed:
            </span>
            {[1.0, 2.0, 5.0, 10.0].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSetSpeed(s)}
                className={`px-2 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  status.speedMultiplier === s
                    ? 'bg-sky-500 text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Step Once */}
          <button
            type="button"
            onClick={handleStepOnce}
            title="Step 1 cycle forward"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1 transition-colors"
          >
            <StepForward className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Step 1x</span>
          </button>

          {/* Reset Active Shipments */}
          <button
            type="button"
            onClick={handleReset}
            title="Reset shipments to origin ports"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-400 border border-slate-700 text-xs font-medium flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Origins</span>
          </button>
        </div>
      </div>
    </div>
  );
}
