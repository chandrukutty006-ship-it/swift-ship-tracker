import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Navigation, 
  CheckCircle2, 
  AlertTriangle, 
  Anchor, 
  Scale, 
  Plus, 
  FileSpreadsheet, 
  Radar, 
  Clock, 
  ExternalLink,
  Mail,
  Shield,
  Activity,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip as RechartsTooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import api from '../services/api';
import SimulatorControls from '../components/SimulatorControls';
import ShipmentModal from '../components/ShipmentModal';
import VesselModal from '../components/VesselModal';
import StatusBadge from '../components/StatusBadge';
import { formatDate } from '../utils/formatters';

const STATUS_COLORS = {
  ORDER_PLACED: '#3b82f6',
  PICKED_UP: '#6366f1',
  IN_TRANSIT: '#0284c7',
  AT_PORT: '#06b6d4',
  CUSTOMS_CLEARANCE: '#f59e0b',
  OUT_FOR_DELIVERY: '#a855f7',
  DELIVERED: '#10b981',
  DELAYED: '#ef4444',
  CANCELLED: '#64748b',
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [vessels, setVessels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showShipmentModal, setShowShipmentModal] = useState(false);
  const [showVesselModal, setShowVesselModal] = useState(false);

  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, vesselsRes] = await Promise.all([
        api.get('/stats/dashboard'),
        api.get('/vessels'),
      ]);

      if (statsRes.data.success) {
        setData(statsRes.data);
      }
      if (vesselsRes.data.success) {
        setVessels(vesselsRes.data.vessels || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleExportCsv = () => {
    window.open('/api/reports/export-csv', '_blank');
  };

  const statusPieData = data?.statusCounts
    ? data.statusCounts.map((item) => ({
        name: item.status.replace(/_/g, ' '),
        rawStatus: item.status,
        value: item.count,
        color: STATUS_COLORS[item.status] || '#0284c7',
      }))
    : [];

  const cargoBarData = data?.cargoDistribution
    ? data.cargoDistribution.slice(0, 6).map((c) => ({
        name: c.cargo_type,
        count: c.count,
        weightTons: c.weight_tons,
      }))
    : [];

  const monthlyBarData = data?.monthlyTrend
    ? data.monthlyTrend.map((m) => ({
        month: m.month,
        Total: m.total_shipments,
        Delivered: m.delivered || 0,
      }))
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-sky-500">
            Operations Command Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Admin Telemetry Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time global cargo monitoring, active simulation controls, and fleet dispatch.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={fetchDashboardData}
            title="Refresh Metrics"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 hover:bg-slate-50 dark:hover:bg-navy-850 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            Export CSV
          </button>

          <button
            type="button"
            onClick={() => setShowVesselModal(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 hover:bg-slate-50 dark:hover:bg-navy-850 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Anchor className="w-4 h-4 text-sky-500" />
            Add Vessel
          </button>

          <button
            type="button"
            onClick={() => setShowShipmentModal(true)}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-brand-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Consignment
          </button>
        </div>
      </div>

      {/* Simulator Controller Bar */}
      <SimulatorControls />

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Total Shipments */}
        <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">Total Orders</span>
            <Package className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            {data?.metrics?.totalShipments || 0}
          </div>
          <span className="text-[10px] text-slate-400">In database</span>
        </div>

        {/* In Transit */}
        <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider text-sky-500">In Transit</span>
            <Navigation className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-extrabold text-sky-500 font-mono">
            {data?.metrics?.inTransit || 0}
          </div>
          <span className="text-[10px] text-slate-400">Active telemetry</span>
        </div>

        {/* Delivered */}
        <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-500">Delivered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-500 font-mono">
            {data?.metrics?.delivered || 0}
          </div>
          <span className="text-[10px] text-slate-400">Fulfilled orders</span>
        </div>

        {/* Delayed */}
        <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-500">Delayed</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-rose-500 font-mono">
            {data?.metrics?.delayed || 0}
          </div>
          <span className="text-[10px] text-slate-400">Requires review</span>
        </div>

        {/* Active Vessels */}
        <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-500">Fleet Assets</span>
            <Anchor className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            {data?.metrics?.activeVessels || 0}
          </div>
          <span className="text-[10px] text-slate-400">Active carriers</span>
        </div>

        {/* Cargo Volume */}
        <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500">Total Cargo</span>
            <Scale className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            {data?.metrics?.totalWeightTons || 0}T
          </div>
          <span className="text-[10px] text-slate-400">Gross tonnage</span>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Status Distribution Pie Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Status Breakdown
              </h3>
              <p className="text-[11px] text-slate-400">Current consignment state distribution</p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-navy-800 text-[10px] font-mono text-slate-500">
              Live Aggregate
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Mini Legend */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[11px]">
            {statusPieData.map((item) => (
              <div key={item.rawStatus} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 dark:text-slate-400">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cargo Type Breakdown Bar Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Cargo Classification Volume
              </h3>
              <p className="text-[11px] text-slate-400">Total shipments per cargo commodity</p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-navy-800 text-[10px] font-mono text-slate-500">
              By Category
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cargoBarData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#0284c7" radius={[6, 6, 0, 0]} name="Shipments" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-center text-[11px] text-slate-400">
            Top Commodities: Electronics, Heavy Machinery, Chemicals, Perishables
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Recent System Milestone Checkpoints
            </h3>
          </div>
          <Link
            to="/admin/shipments"
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Manage All Shipments →
          </Link>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
          {data?.recentEvents && data.recentEvents.length > 0 ? (
            data.recentEvents.map((ev) => (
              <div key={ev.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <StatusBadge status={ev.status} size="sm" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/track?id=${ev.tracking_id}`}
                        className="font-mono font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                      >
                        {ev.tracking_id}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {ev.title}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-[11px]">
                      {ev.description || `Milestone logged at ${ev.location}`}
                    </p>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-400 font-mono">
                  <span>{formatDate(ev.timestamp)}</span>
                  <span className="block text-slate-500 font-sans">{ev.location}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-xs text-slate-400">
              No recent events logged.
            </div>
          )}
        </div>
      </div>

      {/* Creation Modals */}
      {showShipmentModal && (
        <ShipmentModal
          vessels={vessels}
          onClose={() => setShowShipmentModal(false)}
          onSuccess={() => {
            setShowShipmentModal(false);
            fetchDashboardData();
          }}
        />
      )}

      {showVesselModal && (
        <VesselModal
          onClose={() => setShowVesselModal(false)}
          onSuccess={() => {
            setShowVesselModal(false);
            fetchDashboardData();
          }}
        />
      )}
    </div>
  );
}
