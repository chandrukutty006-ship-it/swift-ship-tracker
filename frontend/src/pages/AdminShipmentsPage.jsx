import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Search, 
  Plus, 
  FileSpreadsheet, 
  Filter, 
  Navigation, 
  Clock, 
  MapPin, 
  Edit2, 
  Trash2, 
  QrCode, 
  FileText, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  MoreVertical
} from 'lucide-react';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import ShipmentModal from '../components/ShipmentModal';
import UpdateStatusModal from '../components/UpdateStatusModal';
import AddLocationModal from '../components/AddLocationModal';
import ShipmentQRCodeModal from '../components/ShipmentQRCodeModal';
import ReceiptModal from '../components/ReceiptModal';
import { formatDate, formatWeight } from '../utils/formatters';
import { SHIPMENT_STATUSES, CARGO_TYPES } from '../utils/constants';

export default function AdminShipmentsPage() {
  const [shipments, setShipments] = useState([]);
  const [vessels, setVessels] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 15, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [cargoType, setCargoType] = useState('');
  const [page, setPage] = useState(1);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editShipment, setEditShipment] = useState(null);
  const [statusModalShipment, setStatusModalShipment] = useState(null);
  const [locationModalShipment, setLocationModalShipment] = useState(null);
  const [qrModalShipment, setQrModalShipment] = useState(null);
  const [receiptModalShipment, setReceiptModalShipment] = useState(null);

  const navigate = useNavigate();

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 15,
        search,
        status,
        cargoType,
      });

      const res = await api.get(`/shipments?${params.toString()}`);
      if (res.data.success) {
        setShipments(res.data.shipments || []);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Failed to load shipments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVessels = async () => {
    try {
      const res = await api.get('/vessels');
      if (res.data.success) {
        setVessels(res.data.vessels || []);
      }
    } catch (e) {
      // Ignored
    }
  };

  useEffect(() => {
    fetchVessels();
  }, []);

  useEffect(() => {
    fetchShipments();
  }, [page, status, cargoType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchShipments();
  };

  const handleDelete = async (id, trackingId) => {
    if (!window.confirm(`Are you sure you want to delete shipment ${trackingId}? This will remove all associated events.`)) {
      return;
    }
    try {
      await api.delete(`/shipments/${id}`);
      fetchShipments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete shipment.');
    }
  };

  const handleExportCsv = () => {
    const params = new URLSearchParams({ status, cargoType });
    window.open(`/api/reports/export-csv?${params.toString()}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-brand-600 dark:text-brand-400">
            Logistics Management
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Consignment Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage cargo routes, update checkpoint status, record GPS fixes, and export manifests.
          </p>
        </div>

        <div className="flex items-center gap-2">
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
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-brand-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Consignment
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, Shipper, Receiver, or Port..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="">All Statuses</option>
              {SHIPMENT_STATUSES.map((st) => (
                <option key={st.value} value={st.value}>{st.label}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={cargoType}
              onChange={(e) => {
                setCargoType(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="">All Cargo Commodities</option>
              {CARGO_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </form>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center text-xs text-slate-400">Loading consignments...</div>
          ) : shipments.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <Package className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">No consignments matched your filters</p>
              <p className="text-xs text-slate-400">Try clearing filters or search terms.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-navy-950/60 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="py-3 px-4">Tracking Number</th>
                  <th className="py-3 px-4">Voyage Corridor</th>
                  <th className="py-3 px-4">Carrier Vessel</th>
                  <th className="py-3 px-4">Cargo / Weight</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Progress</th>
                  <th className="py-3 px-4">ETA</th>
                  <th className="py-3 px-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {shipments.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-navy-850/60 transition-colors">
                    
                    {/* Tracking ID */}
                    <td className="py-3 px-4 font-mono font-bold text-brand-600 dark:text-brand-400">
                      <Link to={`/track?id=${s.tracking_id}`} className="hover:underline flex items-center gap-1">
                        {s.tracking_id}
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </Link>
                      <span className="text-[10px] font-sans text-slate-400 block font-normal">
                        Shipper: {s.sender_name}
                      </span>
                    </td>

                    {/* Corridor */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {s.origin_city} → {s.destination_city}
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate max-w-[180px]">
                        At: {s.current_location_name}
                      </span>
                    </td>

                    {/* Vessel */}
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-900 dark:text-white block">
                        {s.vessel_name || 'Unassigned'}
                      </span>
                      <span className="text-[10px] text-sky-600 dark:text-sky-400">
                        {s.vessel_type || 'Marine Vessel'}
                      </span>
                    </td>

                    {/* Cargo */}
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-800 dark:text-slate-200 block">
                        {s.cargo_type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {formatWeight(s.weight_kg)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <StatusBadge status={s.status} size="sm" />
                    </td>

                    {/* Progress */}
                    <td className="py-3 px-4 min-w-[100px]">
                      <div className="text-[10px] font-semibold text-slate-400 mb-1">
                        {s.progress_percent}%
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-navy-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-brand-500 h-full rounded-full"
                          style={{ width: `${s.progress_percent}%` }}
                        />
                      </div>
                    </td>

                    {/* ETA */}
                    <td className="py-3 px-4 text-[11px]">
                      <span className="block">{formatDate(s.estimated_delivery)}</span>
                      {s.is_delayed ? (
                        <span className="text-[10px] text-rose-500 font-semibold block">Delayed</span>
                      ) : null}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Quick Status Update */}
                        <button
                          type="button"
                          onClick={() => setStatusModalShipment(s)}
                          title="Update Status / Milestone"
                          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-sky-600 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                        >
                          <Clock className="w-4 h-4" />
                        </button>

                        {/* Quick GPS Add */}
                        <button
                          type="button"
                          onClick={() => setLocationModalShipment(s)}
                          title="Record GPS Coordinate"
                          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                        >
                          <MapPin className="w-4 h-4" />
                        </button>

                        {/* QR Code */}
                        <button
                          type="button"
                          onClick={() => setQrModalShipment(s)}
                          title="View QR Code"
                          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>

                        {/* PDF Receipt */}
                        <button
                          type="button"
                          onClick={() => setReceiptModalShipment(s)}
                          title="Receipt / Bill of Lading"
                          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        {/* Edit Details */}
                        <button
                          type="button"
                          onClick={() => setEditShipment(s)}
                          title="Edit Consignment"
                          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDelete(s.id, s.tracking_id)}
                          title="Delete Consignment"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Bar */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            <div>
              Showing page <span className="font-semibold text-slate-900 dark:text-white">{pagination.page}</span> of{' '}
              <span className="font-semibold text-slate-900 dark:text-white">{pagination.totalPages}</span> ({pagination.total} consignments)
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => setPage(pagination.page - 1)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-navy-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPage(pagination.page + 1)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-navy-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <ShipmentModal
          vessels={vessels}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchShipments();
          }}
        />
      )}

      {editShipment && (
        <ShipmentModal
          shipment={editShipment}
          vessels={vessels}
          onClose={() => setEditShipment(null)}
          onSuccess={() => {
            setEditShipment(null);
            fetchShipments();
          }}
        />
      )}

      {statusModalShipment && (
        <UpdateStatusModal
          shipment={statusModalShipment}
          onClose={() => setStatusModalShipment(null)}
          onSuccess={() => {
            setStatusModalShipment(null);
            fetchShipments();
          }}
        />
      )}

      {locationModalShipment && (
        <AddLocationModal
          shipment={locationModalShipment}
          onClose={() => setLocationModalShipment(null)}
          onSuccess={() => {
            setLocationModalShipment(null);
            fetchShipments();
          }}
        />
      )}

      {qrModalShipment && (
        <ShipmentQRCodeModal
          shipment={qrModalShipment}
          onClose={() => setQrModalShipment(null)}
        />
      )}

      {receiptModalShipment && (
        <ReceiptModal
          shipment={receiptModalShipment}
          onClose={() => setReceiptModalShipment(null)}
        />
      )}
    </div>
  );
}
