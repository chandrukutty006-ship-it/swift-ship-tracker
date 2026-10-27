import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { Ship, Navigation, ExternalLink, Layers, RefreshCw } from 'lucide-react';
import api from '../services/api';
import { socket, joinFleetRoom } from '../services/socket';
import StatusBadge from './StatusBadge';

function createFleetMarker(status) {
  const isDelayed = status === 'DELAYED';
  const color = isDelayed ? 'bg-amber-500 ring-amber-300' : 'bg-sky-500 ring-sky-300';

  return L.divIcon({
    className: 'custom-fleet-marker',
    html: `
      <div class="relative flex items-center justify-center w-8 h-8">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-50"></span>
        <div class="relative flex items-center justify-center w-8 h-8 rounded-full ${color} text-white shadow-lg ring-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.5 0 2.5 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
            <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/>
            <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

export default function GlobalFleetMap({ height = '560px' }) {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCargo, setSelectedCargo] = useState('ALL');
  const navigate = useNavigate();

  const fetchActiveShipments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/shipments?limit=50');
      if (res.data.success) {
        setShipments(res.data.shipments || []);
      }
    } catch (err) {
      console.error('Error loading fleet shipments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveShipments();
    joinFleetRoom();

    const handleLocationUpdate = (data) => {
      setShipments((prev) =>
        prev.map((s) => {
          if (s.tracking_id === data.trackingId) {
            return {
              ...s,
              current_lat: data.currentLat || s.current_lat,
              current_lng: data.currentLng || s.current_lng,
              current_location_name: data.currentLocationName || s.current_location_name,
              progress_percent: data.progressPercent !== undefined ? data.progressPercent : s.progress_percent,
              is_delayed: data.isDelayed !== undefined ? (data.isDelayed ? 1 : 0) : s.is_delayed,
            };
          }
          return s;
        })
      );
    };

    socket.on('shipment:location_update', handleLocationUpdate);

    return () => {
      socket.off('shipment:location_update', handleLocationUpdate);
    };
  }, []);

  const filteredShipments = shipments.filter((s) => {
    if (selectedCargo !== 'ALL' && s.cargo_type !== selectedCargo) return false;
    return true;
  });

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-900">
      {/* Top Filter Bar */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md p-2 rounded-xl border border-slate-700/80 shadow-lg text-xs text-white">
        <span className="font-semibold text-slate-300 flex items-center gap-1.5 pl-1">
          <Layers className="w-4 h-4 text-sky-400" />
          Filter:
        </span>
        <select
          value={selectedCargo}
          onChange={(e) => setSelectedCargo(e.target.value)}
          className="bg-slate-800 text-white rounded-lg px-2.5 py-1 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs"
        >
          <option value="ALL">All Cargo Types ({shipments.length})</option>
          <option value="Electronics">Electronics</option>
          <option value="Heavy Machinery">Heavy Machinery</option>
          <option value="Chemicals">Chemicals</option>
          <option value="Perishables">Perishables</option>
          <option value="Pharmaceuticals">Pharmaceuticals</option>
          <option value="Automotive Parts">Automotive Parts</option>
        </select>

        <button
          type="button"
          onClick={fetchActiveShipments}
          title="Refresh Fleet"
          className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Floating Active Vessel Counter */}
      <div className="absolute top-4 right-4 z-20 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/80 shadow-lg text-xs text-white flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="font-semibold">{filteredShipments.length} Vessels on Live Radar</span>
      </div>

      <div style={{ height }}>
        <MapContainer
          center={[20.0, 30.0]}
          zoom={2.5}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredShipments.map((s) => {
            const pos = [s.current_lat || s.origin_lat, s.current_lng || s.origin_lng];
            const routeLine = [
              [s.origin_lat, s.origin_lng],
              pos,
              [s.destination_lat, s.destination_lng],
            ];

            return (
              <React.Fragment key={s.id}>
                {/* Thin dashed route indicator */}
                <Polyline
                  positions={routeLine}
                  pathOptions={{
                    color: s.is_delayed ? '#f59e0b' : '#38bdf8',
                    weight: 2,
                    opacity: 0.4,
                    dashArray: '4, 6',
                  }}
                />

                <Marker position={pos} icon={createFleetMarker(s.status)}>
                  <Popup>
                    <div className="p-1 space-y-2 text-xs text-white min-w-[200px]">
                      <div className="flex items-center justify-between gap-2 border-b border-slate-700/80 pb-1.5">
                        <span className="font-mono font-bold text-sky-400 text-sm">{s.tracking_id}</span>
                        <StatusBadge status={s.status} size="sm" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Voyage Corridor</span>
                        <p className="font-semibold text-white">
                          {s.origin_city} → {s.destination_city}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Cargo</span>
                          <span>{s.cargo_type}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Progress</span>
                          <span className="font-bold text-sky-400">{s.progress_percent}%</span>
                        </div>
                      </div>
                      {s.vessel_name && (
                        <p className="text-[11px] text-slate-300">
                          Vessel: <span className="font-medium text-white">{s.vessel_name}</span>
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => navigate(`/track?id=${s.tracking_id}`)}
                        className="w-full mt-2 py-1.5 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow transition-colors"
                      >
                        Open Telemetry Map
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
