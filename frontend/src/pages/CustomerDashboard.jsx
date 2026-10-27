import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Navigation, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  QrCode, 
  Search, 
  Ship, 
  ExternalLink,
  Download,
  Clock,
  Compass
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import ShipmentQRCodeModal from '../components/ShipmentQRCodeModal';
import ReceiptModal from '../components/ReceiptModal';
import { formatDate, formatWeight } from '../utils/formatters';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [selectedQrShipment, setSelectedQrShipment] = useState(null);
  const [selectedReceiptShipment, setSelectedReceiptShipment] = useState(null);

  const navigate = useNavigate();

  const fetchMyShipments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/shipments/my-shipments');
      if (res.data.success) {
        setShipments(res.data.shipments || []);
      }
    } catch (err) {
      console.error('Failed to load my shipments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyShipments();
  }, []);

  // Filtered shipments
  const filtered = shipments.filter((s) => {
    if (statusFilter && s.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchId = s.tracking_id.toLowerCase().includes(term);
      const matchOrigin = s.origin_city.toLowerCase().includes(term);
      const matchDest = s.destination_city.toLowerCase().includes(term);
      const matchCargo = s.cargo_type.toLowerCase().includes(term);
      if (!matchId && !matchOrigin && !matchDest && !matchCargo) return false;
    }
    return true;
  });

  // Metric summaries
  const totalCount = shipments.length;
  const inTransitCount = shipments.filter((s) => s.status === 'IN_TRANSIT' || s.status === 'OUT_FOR_DELIVERY').length;
  const deliveredCount = shipments.filter((s) => s.status === 'DELIVERED').length;
  const delayedCount = shipments.filter((s) => s.is_delayed || s.status === 'DELAYED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-900 via-navy-900 to-slate-900 text-white shadow-xl">
        <div className="space-y-1">
          <span className="text-xs uppercase font-bold tracking-widest text-sky-400">
            Customer Consignment Ledger
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs text-slate-300">
            {user?.company ? `${user.company} • ` : ''}Active consignment telemetry & automated bills of lading.
          </p>
        </div>
        <Link
          to="/track"
          className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow transition-all self-start sm:self-auto"
        >
          <Search className="w-4 h-4" />
          Track Any Shipment
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            My Consignments
          </span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            {totalCount}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Total registered orders</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-500">
            In Transit
          </span>
          <div className="text-2xl font-extrabold text-sky-500 font-mono">
            {inTransitCount}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Currently navigating</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">
            Delivered
          </span>
          <div className="text-2xl font-extrabold text-emerald-500 font-mono">
            {deliveredCount}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Completed shipments</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
            Delayed Notices
          </span>
          <div className="text-2xl font-extrabold text-amber-500 font-mono">
            {delayedCount}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Under weather / queue hold</span>
        </div>
      </div>

      {/* Shipments Table Container */}
      <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        
        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ID, city, cargo..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-brand-500 w-full sm:w-auto"
            >
              <option value="">All Statuses</option>
              <option value="ORDER_PLACED">Order Placed</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="AT_PORT">At Port</option>
              <option value="CUSTOMS_CLEARANCE">Customs</option>
              <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
              <option value="DELIVERED">Delivered</option>
              <option value="DELAYED">Delayed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-xs text-slate-400">Loading your shipments...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Package className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">No shipments found</p>
              <p className="text-xs text-slate-400">Try adjusting your search criteria or contact support.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="py-3 px-3">Tracking ID</th>
                  <th className="py-3 px-3">Route (Origin → Destination)</th>
                  <th className="py-3 px-3">Cargo Spec</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Voyage Progress</th>
                  <th className="py-3 px-3">Estimated Arrival</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-navy-850/60 transition-colors">
                    
                    {/* ID */}
                    <td className="py-3.5 px-3">
                      <Link
                        to={`/track?id=${s.tracking_id}`}
                        className="font-mono font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                      >
                        {s.tracking_id}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {s.vessel_name || 'Standard Carrier'}
                      </span>
                    </td>

                    {/* Route */}
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {s.origin_city} → {s.destination_city}
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5 truncate max-w-[200px]">
                        At: {s.current_location_name}
                      </span>
                    </td>

                    {/* Cargo */}
                    <td className="py-3.5 px-3">
                      <span className="font-medium text-slate-800 dark:text-slate-200 block">{s.cargo_type}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{formatWeight(s.weight_kg)}</span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      <StatusBadge status={s.status} size="sm" />
                    </td>

                    {/* Progress */}
                    <td className="py-3.5 px-3 min-w-[130px]">
                      <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 mb-1">
                        <span>{s.progress_percent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-navy-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-brand-500 h-full rounded-full"
                          style={{ width: `${s.progress_percent}%` }}
                        />
                      </div>
                    </td>

                    {/* Arrival */}
                    <td className="py-3.5 px-3 font-medium">
                      <span className="block">{formatDate(s.estimated_delivery)}</span>
                      {s.is_delayed ? (
                        <span className="text-[10px] text-rose-500 font-semibold block">Delayed</span>
                      ) : (
                        <span className="text-[10px] text-emerald-500 font-semibold block">On Schedule</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedQrShipment(s)}
                          title="View QR Code"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-navy-800"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedReceiptShipment(s)}
                          title="Download Receipt PDF"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-navy-800"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => navigate(`/track?id=${s.tracking_id}`)}
                          className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 hover:bg-brand-100 font-semibold text-xs flex items-center gap-1"
                          title="Open Live Map"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* QR Modal */}
      {selectedQrShipment && (
        <ShipmentQRCodeModal
          shipment={selectedQrShipment}
          onClose={() => setSelectedQrShipment(null)}
        />
      )}

      {/* Receipt Modal */}
      {selectedReceiptShipment && (
        <ReceiptModal
          shipment={selectedReceiptShipment}
          onClose={() => setSelectedReceiptShipment(null)}
        />
      )}
    </div>
  );
}
