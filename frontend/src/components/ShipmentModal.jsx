import React, { useState, useEffect } from 'react';
import { X, Package, Ship, MapPin, Calendar, Check, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { CARGO_TYPES } from '../utils/constants';

const CITY_PRESETS = [
  { city: 'Chennai', country: 'India', lat: 13.0827, lng: 80.2707 },
  { city: 'Mumbai', country: 'India', lat: 18.9500, lng: 72.8200 },
  { city: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { city: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lng: 55.2708 },
  { city: 'Colombo', country: 'Sri Lanka', lat: 6.9400, lng: 79.8600 },
  { city: 'Rotterdam', country: 'Netherlands', lat: 51.9500, lng: 4.1400 },
  { city: 'Shanghai', country: 'China', lat: 31.2304, lng: 121.4737 },
  { city: 'Los Angeles', country: 'United States', lat: 33.7400, lng: -118.2600 },
  { city: 'New York', country: 'United States', lat: 40.7128, lng: -74.0060 },
  { city: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
  { city: 'Hamburg', country: 'Germany', lat: 53.5511, lng: 9.9937 },
  { city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
  { city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
];

export default function ShipmentModal({ shipment, vessels = [], onClose, onSuccess }) {
  const isEdit = Boolean(shipment);

  const [formData, setFormData] = useState({
    sender_name: shipment?.sender_name || '',
    sender_address: shipment?.sender_address || '',
    sender_phone: shipment?.sender_phone || '',
    receiver_name: shipment?.receiver_name || '',
    receiver_address: shipment?.receiver_address || '',
    receiver_phone: shipment?.receiver_phone || '',
    origin_city: shipment?.origin_city || 'Chennai',
    origin_country: shipment?.origin_country || 'India',
    origin_lat: shipment?.origin_lat || 13.0827,
    origin_lng: shipment?.origin_lng || 80.2707,
    destination_city: shipment?.destination_city || 'Singapore',
    destination_country: shipment?.destination_country || 'Singapore',
    destination_lat: shipment?.destination_lat || 1.3521,
    destination_lng: shipment?.destination_lng || 103.8198,
    cargo_type: shipment?.cargo_type || 'General Cargo',
    weight_kg: shipment?.weight_kg || 15000,
    volume_cbm: shipment?.volume_cbm || 50,
    vessel_id: shipment?.vessel_id || (vessels[0]?.id || ''),
    estimated_delivery: shipment?.estimated_delivery
      ? new Date(shipment.estimated_delivery).toISOString().slice(0, 16)
      : new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOriginPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      origin_city: preset.city,
      origin_country: preset.country,
      origin_lat: preset.lat,
      origin_lng: preset.lng,
    }));
  };

  const handleDestinationPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      destination_city: preset.city,
      destination_country: preset.country,
      destination_lat: preset.lat,
      destination_lng: preset.lng,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.sender_name || !formData.receiver_name || !formData.origin_city || !formData.destination_city) {
      setError('Please complete all required fields.');
      return;
    }

    try {
      setLoading(true);
      if (isEdit) {
        await api.put(`/shipments/${shipment.id}`, formData);
      } else {
        await api.post('/shipments', formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving shipment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-navy-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-navy-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {isEdit ? `Edit Consignment: ${shipment.tracking_id}` : 'Create New Consignment'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isEdit ? 'Update consignment properties and assigned carrier' : 'Auto-generates unique tracking ID and route waypoint curve'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 dark:text-slate-300">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section: Sender & Receiver */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-navy-950/40 space-y-3">
              <span className="font-bold text-[11px] text-brand-600 dark:text-brand-400 uppercase tracking-wider block">
                Sender / Shipper Information
              </span>
              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">Company / Sender Name *</label>
                <input
                  type="text"
                  required
                  value={formData.sender_name}
                  onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
                  placeholder="e.g. Tata Steel Global"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">Terminal / Pickup Address</label>
                <input
                  type="text"
                  value={formData.sender_address}
                  onChange={(e) => setFormData({ ...formData, sender_address: e.target.value })}
                  placeholder="e.g. Harbor Quay 4, Chennai Port"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={formData.sender_phone}
                  onChange={(e) => setFormData({ ...formData, sender_phone: e.target.value })}
                  placeholder="+91 44 2855 0100"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-navy-950/40 space-y-3">
              <span className="font-bold text-[11px] text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                Receiver / Consignee Information
              </span>
              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">Receiver Name / Company *</label>
                <input
                  type="text"
                  required
                  value={formData.receiver_name}
                  onChange={(e) => setFormData({ ...formData, receiver_name: e.target.value })}
                  placeholder="e.g. Pacific Logistics Pte"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">Delivery Address</label>
                <input
                  type="text"
                  value={formData.receiver_address}
                  onChange={(e) => setFormData({ ...formData, receiver_address: e.target.value })}
                  placeholder="e.g. Jurong Port Road, Singapore"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={formData.receiver_phone}
                  onChange={(e) => setFormData({ ...formData, receiver_phone: e.target.value })}
                  placeholder="+65 6265 1234"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section: Route Origin & Destination */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
            <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400 block">
              Origin & Destination Route Coordinates
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Origin */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    Origin City & Country *
                  </label>
                  <select
                    onChange={(e) => {
                      const found = CITY_PRESETS.find((c) => c.city === e.target.value);
                      if (found) handleOriginPreset(found);
                    }}
                    className="text-[10px] bg-slate-100 dark:bg-navy-800 rounded px-1.5 py-0.5 border border-slate-300 dark:border-slate-700"
                  >
                    <option value="">Quick Presets...</option>
                    {CITY_PRESETS.map((c) => (
                      <option key={c.city} value={c.city}>{c.city}, {c.country}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={formData.origin_city}
                    onChange={(e) => setFormData({ ...formData, origin_city: e.target.value })}
                    placeholder="City"
                    className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-xs"
                  />
                  <input
                    type="text"
                    value={formData.origin_country}
                    onChange={(e) => setFormData({ ...formData, origin_country: e.target.value })}
                    placeholder="Country"
                    className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <input
                    type="number"
                    step="any"
                    value={formData.origin_lat}
                    onChange={(e) => setFormData({ ...formData, origin_lat: e.target.value })}
                    placeholder="Origin Lat"
                    className="px-2 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900"
                  />
                  <input
                    type="number"
                    step="any"
                    value={formData.origin_lng}
                    onChange={(e) => setFormData({ ...formData, origin_lng: e.target.value })}
                    placeholder="Origin Lng"
                    className="px-2 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900"
                  />
                </div>
              </div>

              {/* Destination */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    Destination City & Country *
                  </label>
                  <select
                    onChange={(e) => {
                      const found = CITY_PRESETS.find((c) => c.city === e.target.value);
                      if (found) handleDestinationPreset(found);
                    }}
                    className="text-[10px] bg-slate-100 dark:bg-navy-800 rounded px-1.5 py-0.5 border border-slate-300 dark:border-slate-700"
                  >
                    <option value="">Quick Presets...</option>
                    {CITY_PRESETS.map((c) => (
                      <option key={c.city} value={c.city}>{c.city}, {c.country}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={formData.destination_city}
                    onChange={(e) => setFormData({ ...formData, destination_city: e.target.value })}
                    placeholder="City"
                    className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-xs"
                  />
                  <input
                    type="text"
                    value={formData.destination_country}
                    onChange={(e) => setFormData({ ...formData, destination_country: e.target.value })}
                    placeholder="Country"
                    className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <input
                    type="number"
                    step="any"
                    value={formData.destination_lat}
                    onChange={(e) => setFormData({ ...formData, destination_lat: e.target.value })}
                    placeholder="Dest Lat"
                    className="px-2 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900"
                  />
                  <input
                    type="number"
                    step="any"
                    value={formData.destination_lng}
                    onChange={(e) => setFormData({ ...formData, destination_lng: e.target.value })}
                    placeholder="Dest Lng"
                    className="px-2 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Cargo & Vessel */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">Cargo Type</label>
              <select
                value={formData.cargo_type}
                onChange={(e) => setFormData({ ...formData, cargo_type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white text-xs"
              >
                {CARGO_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">Gross Weight (kg) *</label>
              <input
                type="number"
                required
                min="1"
                value={formData.weight_kg}
                onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">Volume (CBM)</label>
              <input
                type="number"
                min="0"
                value={formData.volume_cbm}
                onChange={(e) => setFormData({ ...formData, volume_cbm: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          {/* Carrier Vessel & ETA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">Assigned Carrier / Vessel</label>
              <select
                value={formData.vessel_id}
                onChange={(e) => setFormData({ ...formData, vessel_id: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white text-xs"
              >
                <option value="">No Vessel Assigned</option>
                {vessels.map((v) => (
                  <option key={v.id} value={v.id}>{v.name} ({v.type} - {v.capacity})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">Estimated Delivery Date *</label>
              <input
                type="datetime-local"
                required
                value={formData.estimated_delivery}
                onChange={(e) => setFormData({ ...formData, estimated_delivery: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          {/* Footer Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              {loading ? 'Processing...' : isEdit ? 'Save Changes' : 'Create & Register Consignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
