import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Compass, Maximize2, Crosshair, Navigation, Anchor, Flag } from 'lucide-react';
import { socket, joinShipmentRoom, leaveShipmentRoom } from '../services/socket';
import { formatDistance } from '../utils/formatters';

// Custom Leaflet Icons using DivIcon with Tailwind & SVGs
function createPortIcon(isDestination = false) {
  const bg = isDestination ? 'bg-rose-600' : 'bg-emerald-600';
  const ring = isDestination ? 'ring-rose-200 dark:ring-rose-950' : 'ring-emerald-200 dark:ring-emerald-950';
  const iconSvg = isDestination
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"/><line x1="12" x2="12" y1="22" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>`;

  return L.divIcon({
    className: 'custom-port-marker',
    html: `
      <div class="flex items-center justify-center w-8 h-8 rounded-full ${bg} text-white shadow-lg ring-4 ${ring} transition-transform hover:scale-110">
        ${iconSvg}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
}

function createVesselIcon() {
  return L.divIcon({
    className: 'custom-vessel-marker',
    html: `
      <div class="relative flex items-center justify-center w-10 h-10">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-60"></span>
        <div class="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-brand-700 to-sky-500 text-white shadow-xl ring-4 ring-sky-300/40">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.5 0 2.5 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
            <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/>
            <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/>
            <path d="M12 10v4"/>
            <path d="M12 2v3"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -22],
  });
}

// Controller helper to center or fit bounds
function MapController({ center, bounds, autoFollow }) {
  const map = useMap();

  useEffect(() => {
    if (autoFollow && center) {
      map.panTo(center, { animate: true, duration: 1 });
    }
  }, [center, autoFollow, map]);

  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);

  return null;
}

export default function LiveMap({ shipment, height = '480px' }) {
  const [currentPos, setCurrentPos] = useState([
    shipment.current_lat || shipment.origin_lat,
    shipment.current_lng || shipment.origin_lng,
  ]);
  const [currentLocationName, setCurrentLocationName] = useState(
    shipment.current_location_name || shipment.origin_city
  );
  const [progress, setProgress] = useState(shipment.progress_percent || 0);
  const [autoFollow, setAutoFollow] = useState(false);
  const [mapBounds, setMapBounds] = useState(null);

  const originPos = [shipment.origin_lat, shipment.origin_lng];
  const destPos = [shipment.destination_lat, shipment.destination_lng];

  // Parse waypoints array
  let waypoints = [];
  if (shipment.waypoints && Array.isArray(shipment.waypoints)) {
    waypoints = shipment.waypoints;
  } else if (shipment.waypoints_json) {
    try {
      waypoints = JSON.parse(shipment.waypoints_json);
    } catch (e) {
      waypoints = [];
    }
  }

  // Construct full polyline route coordinates
  const polylineCoords =
    waypoints.length > 0
      ? waypoints.map((w) => [w.lat, w.lng])
      : [originPos, currentPos, destPos];

  // Initial bounds on mount
  useEffect(() => {
    if (polylineCoords.length > 0) {
      setMapBounds(polylineCoords);
    }
  }, [shipment.id]);

  // Real-time socket updates for this shipment
  useEffect(() => {
    const trackingId = shipment.tracking_id;
    if (!trackingId) return;

    joinShipmentRoom(trackingId);

    const handleLocationUpdate = (data) => {
      if (data.trackingId === trackingId) {
        if (data.currentLat && data.currentLng) {
          setCurrentPos([data.currentLat, data.currentLng]);
        }
        if (data.currentLocationName) {
          setCurrentLocationName(data.currentLocationName);
        }
        if (data.progressPercent !== undefined) {
          setProgress(data.progressPercent);
        }
      }
    };

    socket.on('shipment:location_update', handleLocationUpdate);

    return () => {
      leaveShipmentRoom(trackingId);
      socket.off('shipment:location_update', handleLocationUpdate);
    };
  }, [shipment.tracking_id]);

  const fitAllRoute = () => {
    setAutoFollow(false);
    setMapBounds([...polylineCoords]);
  };

  const centerOnVessel = () => {
    setAutoFollow(true);
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
      {/* Floating Map Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          type="button"
          onClick={centerOnVessel}
          title="Center on Moving Vessel"
          className={`p-2.5 rounded-xl shadow-lg transition-colors flex items-center justify-center ${
            autoFollow
              ? 'bg-sky-500 text-white'
              : 'bg-white/95 dark:bg-navy-900/95 text-slate-700 dark:text-slate-200 hover:text-sky-500'
          }`}
        >
          <Crosshair className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={fitAllRoute}
          title="Fit Whole Route"
          className="p-2.5 rounded-xl bg-white/95 dark:bg-navy-900/95 text-slate-700 dark:text-slate-200 hover:text-brand-500 shadow-lg transition-colors flex items-center justify-center"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Live Telemetry HUD Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md text-white rounded-xl p-3 border border-slate-700/60 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Current Position
              </span>
              <span className="font-semibold text-slate-100">{currentLocationName}</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Route Progress
              </span>
              <span className="font-semibold text-sky-400">{progress}%</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Telemetry Coordinates
              </span>
              <span className="font-mono text-slate-300">
                {currentPos[0]?.toFixed(3)}°, {currentPos[1]?.toFixed(3)}°
              </span>
            </div>
            {shipment.vessel_name && (
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Carrying Vessel
                </span>
                <span className="font-semibold text-slate-200">{shipment.vessel_name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ height }}>
        <MapContainer
          center={currentPos}
          zoom={4}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapController center={currentPos} bounds={mapBounds} autoFollow={autoFollow} />

          {/* Polyline Route Track */}
          <Polyline
            positions={polylineCoords}
            pathOptions={{
              color: '#0284c7',
              weight: 4,
              opacity: 0.85,
              dashArray: '8, 8',
              lineCap: 'round',
            }}
          />

          {/* Origin Marker */}
          <Marker position={originPos} icon={createPortIcon(false)}>
            <Popup>
              <div className="text-xs">
                <span className="font-bold text-emerald-400 block">ORIGIN HUB</span>
                <p className="font-semibold text-sm">{shipment.origin_city}, {shipment.origin_country}</p>
                <p className="text-slate-300 mt-1">Shipper: {shipment.sender_name}</p>
              </div>
            </Popup>
          </Marker>

          {/* Destination Marker */}
          <Marker position={destPos} icon={createPortIcon(true)}>
            <Popup>
              <div className="text-xs">
                <span className="font-bold text-rose-400 block">DESTINATION PORT</span>
                <p className="font-semibold text-sm">{shipment.destination_city}, {shipment.destination_country}</p>
                <p className="text-slate-300 mt-1">Consignee: {shipment.receiver_name}</p>
              </div>
            </Popup>
          </Marker>

          {/* Live Moving Marker */}
          <Marker position={currentPos} icon={createVesselIcon()}>
            <Popup>
              <div className="text-xs space-y-1">
                <span className="font-bold text-sky-400 flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5" /> LIVE TELEMETRY
                </span>
                <p className="font-bold text-white text-sm">{shipment.vessel_name || 'In-Transit Freight'}</p>
                <p className="text-slate-300">Status: <span className="font-semibold text-sky-300">{shipment.status.replace(/_/g, ' ')}</span></p>
                <p className="text-slate-300">Waypoint: {currentLocationName}</p>
                <p className="text-slate-300">Progress: <span className="font-bold text-white">{progress}%</span></p>
                <p className="text-slate-400 text-[10px] font-mono mt-1">
                  GPS: {currentPos[0]?.toFixed(4)}N, {currentPos[1]?.toFixed(4)}E
                </p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
