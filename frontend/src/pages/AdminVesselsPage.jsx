import React, { useState, useEffect } from 'react';
import { Anchor, Plus, Edit2, Trash2, Ship, MapPin, Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import VesselModal from '../components/VesselModal';
import { formatDate } from '../utils/formatters';

export default function AdminVesselsPage() {
  const [vessels, setVessels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVessel, setEditingVessel] = useState(null);

  const fetchVessels = async () => {
    try {
      setLoading(true);
      const res = await api.get('/vessels');
      if (res.data.success) {
        setVessels(res.data.vessels || []);
      }
    } catch (err) {
      console.error('Failed to load vessels:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVessels();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to decommission vessel "${name}"?`)) {
      return;
    }
    try {
      await api.delete(`/vessels/${id}`);
      fetchVessels();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete vessel.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-sky-500">
            Fleet Asset Management
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Vessels & Multimodal Carriers
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Register container vessels, bulk freighters, and cargo airframes in the tracking grid.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-brand-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Commission Carrier
        </button>
      </div>

      {/* Fleet Table */}
      <div className="rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center text-xs text-slate-400">Loading fleet registry...</div>
          ) : vessels.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <Anchor className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">No vessels commissioned yet</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-navy-950/60 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="py-3 px-4">Carrier / Vessel Name</th>
                  <th className="py-3 px-4">Asset Type</th>
                  <th className="py-3 px-4">Registration / IMO</th>
                  <th className="py-3 px-4">Payload Capacity</th>
                  <th className="py-3 px-4">Flag State</th>
                  <th className="py-3 px-4">Active Shipments</th>
                  <th className="py-3 px-4">Operational Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {vessels.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-navy-850/60 transition-colors">
                    
                    {/* Vessel Name */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0">
                          <Ship className="w-4 h-4" />
                        </div>
                        <span>{v.name}</span>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {v.type}
                    </td>

                    {/* Reg */}
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                      {v.registration_number}
                    </td>

                    {/* Capacity */}
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {v.capacity}
                    </td>

                    {/* Flag */}
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {v.flag}
                    </td>

                    {/* Active Shipment Count */}
                    <td className="py-3 px-4 font-semibold">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-navy-800 font-mono text-[11px] text-sky-600 dark:text-sky-400">
                        {v.active_shipment_count || 0} active
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          v.status === 'ACTIVE'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                            : v.status === 'IN_PORT'
                            ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${v.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-sky-500'}`} />
                        {v.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingVessel(v)}
                          title="Edit Vessel"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(v.id, v.name)}
                          title="Decommission Vessel"
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
      </div>

      {showModal && (
        <VesselModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchVessels();
          }}
        />
      )}

      {editingVessel && (
        <VesselModal
          vessel={editingVessel}
          onClose={() => setEditingVessel(null)}
          onSuccess={() => {
            setEditingVessel(null);
            fetchVessels();
          }}
        />
      )}
    </div>
  );
}
