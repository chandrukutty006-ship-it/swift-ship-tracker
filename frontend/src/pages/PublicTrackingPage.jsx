import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Ship, 
  Clock, 
  FileText, 
  QrCode, 
  Share2, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  Compass, 
  Navigation,
  ArrowRight,
  Package,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../services/api';
import LiveMap from '../components/LiveMap';
import StatusBadge from '../components/StatusBadge';
import StatusTimeline from '../components/StatusTimeline';
import ShipmentQRCodeModal from '../components/ShipmentQRCodeModal';
import ReceiptModal from '../components/ReceiptModal';
import { formatDate, formatWeight, formatDistance } from '../utils/formatters';
import { DEMO_TRACKING_IDS } from '../utils/constants';

export default function PublicTrackingPage() {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const navigate = useNavigate();

  const queryId = searchParams.get('id') || params.trackingId || 'SST-CHNSIN01';
  const [searchInput, setSearchInput] = useState(queryId);
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Modals
  const [showQrModal, setShowQrModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const fetchShipment = async (trackingId) => {
    if (!trackingId) return;
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/shipments/track/${trackingId.trim().toUpperCase()}`);
      if (res.data.success) {
        setShipment(res.data.shipment);
        if (res.data.shipment.status === 'DELIVERED') {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (err) {
      setShipment(null);
      setError(err.response?.data?.message || `Consignment ${trackingId} not found.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipment(queryId);
    setSearchInput(queryId);
  }, [queryId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/track?id=${searchInput.trim().toUpperCase()}`);
    }
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Search Header Bar */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter Consignment Tracking ID (e.g. SST-CHNSIN01)"
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white font-mono font-medium text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 uppercase"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Search className="w-4 h-4" />
            Track Consignment
          </button>
        </form>

        {/* Quick Demo ID chips */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <span className="text-slate-400 font-medium">Quick Examples:</span>
          {DEMO_TRACKING_IDS.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => navigate(`/track?id=${d.id}`)}
              className={`px-2 py-0.5 rounded font-mono text-[11px] transition-colors ${
                shipment?.tracking_id === d.id
                  ? 'bg-brand-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-navy-700'
              }`}
            >
              {d.id}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="relative flex items-center justify-center w-12 h-12 mx-auto rounded-2xl bg-brand-600 text-white animate-bounce shadow-lg">
            <Ship className="w-6 h-6" />
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Fetching Live Telemetry Stream...
          </p>
        </div>
      ) : error ? (
        <div className="p-8 text-center rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <AlertTriangle className="w-10 h-10 mx-auto text-amber-500" />
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Shipment Not Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">{error}</p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigate('/track?id=SST-CHNSIN01')}
              className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold"
            >
              Load Demo Shipment (SST-CHNSIN01)
            </button>
          </div>
        </div>
      ) : shipment ? (
        <>
          {/* Main Shipment Header Box */}
          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {shipment.tracking_id}
                  </span>
                  <StatusBadge status={shipment.status} size="lg" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                  <span>Registered in Swift Network: {formatDate(shipment.created_at)}</span>
                  <span>•</span>
                  <span>Last Ping: {formatDate(shipment.updated_at)}</span>
                </p>
              </div>

              {/* Action Buttons: QR, PDF, Share */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <QrCode className="w-4 h-4 text-brand-500" />
                  QR Code
                </button>

                <button
                  type="button"
                  onClick={() => setShowReceiptModal(true)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-4 h-4 text-brand-500" />
                  Receipt / PDF
                </button>

                <button
                  type="button"
                  onClick={handleShareLink}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      Link Copied
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      Share
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Route & Cargo Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs">
              
              {/* Origin */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950/50 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Origin Hub
                </span>
                <span className="font-bold text-slate-900 dark:text-white text-sm block">
                  {shipment.origin_city}, {shipment.origin_country}
                </span>
                <span className="text-slate-500 dark:text-slate-400 truncate block mt-0.5">
                  {shipment.sender_name}
                </span>
              </div>

              {/* Destination */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950/50 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Destination Port
                </span>
                <span className="font-bold text-slate-900 dark:text-white text-sm block">
                  {shipment.destination_city}, {shipment.destination_country}
                </span>
                <span className="text-slate-500 dark:text-slate-400 truncate block mt-0.5">
                  {shipment.receiver_name}
                </span>
              </div>

              {/* Carrier Vessel */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950/50 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Allocated Carrier
                </span>
                <span className="font-bold text-slate-900 dark:text-white text-sm block truncate">
                  {shipment.vessel_name || 'Standard Freight'}
                </span>
                <span className="text-sky-600 dark:text-sky-400 font-medium block mt-0.5">
                  {shipment.vessel_type || 'Marine Container Vessel'}
                </span>
              </div>

              {/* Cargo Specs */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950/50 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Cargo Specification
                </span>
                <span className="font-bold text-slate-900 dark:text-white text-sm block">
                  {shipment.cargo_type}
                </span>
                <span className="text-slate-500 dark:text-slate-400 block mt-0.5">
                  {formatWeight(shipment.weight_kg)} {shipment.volume_cbm ? `• ${shipment.volume_cbm} CBM` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Live OpenStreetMap Interactive Tracker */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Navigation className="w-5 h-5 text-sky-500" />
                Live Map Telemetry
              </h3>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Socket.IO Live Link Active</span>
              </div>
            </div>

            <LiveMap shipment={shipment} height="520px" />
          </div>

          {/* Telemetry HUD & ETA Calculations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Dynamic ETA */}
            <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Dynamic ETA Calculation
                </span>
                <Clock className="w-4 h-4 text-sky-500" />
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {formatDate(shipment.etaData?.calculatedEta || shipment.estimated_delivery)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Estimated based on great-circle sea miles, average speed ({shipment.etaData?.averageSpeedKmH || 37} km/h), and port queue buffers.
              </p>
              {shipment.is_delayed ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 pt-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Estimated delivery delayed (+{shipment.etaData?.delayHours || 24}h)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Voyage running on schedule
                </span>
              )}
            </div>

            {/* Distance Remaining */}
            <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Distance Remaining
                </span>
                <Compass className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {formatDistance(shipment.etaData?.distanceRemainingKm || 0)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Direct nautical distance remaining to {shipment.destination_city} berth.
              </p>
              <div className="pt-2">
                <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1">
                  <span>Voyage Progress</span>
                  <span className="text-sky-500">{shipment.progress_percent}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-navy-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-brand-600 to-sky-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${shipment.progress_percent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Current Waypoint Checkpoint */}
            <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Current Sector
                </span>
                <MapPin className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white truncate">
                {shipment.current_location_name}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Active telemetry coordinate:
              </p>
              <div className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 bg-slate-100 dark:bg-navy-950 p-2 rounded-lg inline-block">
                {shipment.current_lat?.toFixed(4)}° N, {shipment.current_lng?.toFixed(4)}° E
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-brand-500" />
              Consignment Status Timeline
            </h3>

            <StatusTimeline
              status={shipment.status}
              events={shipment.events || []}
              isDelayed={Boolean(shipment.is_delayed)}
              delayReason={shipment.delay_reason}
            />
          </div>

          {/* Modals */}
          {showQrModal && (
            <ShipmentQRCodeModal
              shipment={shipment}
              onClose={() => setShowQrModal(false)}
            />
          )}

          {showReceiptModal && (
            <ReceiptModal
              shipment={shipment}
              onClose={() => setShowReceiptModal(false)}
            />
          )}
        </>
      ) : null}
    </div>
  );
}
