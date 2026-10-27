const db = require('../db/database');
const socketService = require('./socketService');
const { calculateEta } = require('./etaCalculator');

class GpsSimulator {
  constructor() {
    this.intervalId = null;
    this.isRunning = true;
    this.speedMultiplier = 1.0;
    this.baseIntervalMs = 3000; // 3 seconds per tick
  }

  init() {
    try {
      const config = db.get('SELECT * FROM simulator_config WHERE id = 1');
      if (config) {
        this.isRunning = Boolean(config.is_running);
        this.speedMultiplier = config.speed_multiplier || 1.0;
      } else {
        db.run('INSERT INTO simulator_config (id, is_running, interval_seconds, speed_multiplier) VALUES (1, 1, 3, 1.0)');
      }
    } catch (err) {
      console.error('Error loading simulator config:', err);
    }

    if (this.isRunning) {
      this.start();
    }
  }

  start() {
    this.stop();
    this.isRunning = true;
    const intervalMs = Math.max(800, Math.round(this.baseIntervalMs / this.speedMultiplier));
    this.intervalId = setInterval(() => this.tick(), intervalMs);
    this.saveConfig();
    socketService.broadcastSimulatorStatus(this.getStatus());
    console.log(`[GPS Simulator] Started. Ticking every ${intervalMs}ms (Speed: ${this.speedMultiplier}x)`);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    this.saveConfig();
    socketService.broadcastSimulatorStatus(this.getStatus());
    console.log('[GPS Simulator] Paused.');
  }

  setSpeed(multiplier) {
    this.speedMultiplier = Math.max(0.5, Math.min(10.0, Number(multiplier) || 1.0));
    if (this.isRunning) {
      this.start(); // restart with new interval
    } else {
      this.saveConfig();
      socketService.broadcastSimulatorStatus(this.getStatus());
    }
  }

  saveConfig() {
    try {
      db.run(
        `UPDATE simulator_config SET is_running = ?, speed_multiplier = ?, last_tick = datetime('now') WHERE id = 1`,
        [this.isRunning ? 1 : 0, this.speedMultiplier]
      );
    } catch (e) {
      // Ignored
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      speedMultiplier: this.speedMultiplier,
      intervalMs: Math.round(this.baseIntervalMs / this.speedMultiplier),
    };
  }

  /**
   * Main simulation step: updates positions of active shipments
   */
  tick() {
    try {
      const activeShipments = db.query(
        `SELECT s.*, v.type as vessel_type
         FROM shipments s
         LEFT JOIN vessels v ON s.vessel_id = v.id
         WHERE s.status IN ('IN_TRANSIT', 'OUT_FOR_DELIVERY')`
      );

      if (!activeShipments || activeShipments.length === 0) return;

      for (const shipment of activeShipments) {
        this.advanceShipment(shipment);
      }
    } catch (err) {
      console.error('GPS simulation tick error:', err);
    }
  }

  /**
   * Advances a single shipment along its waypoints
   */
  advanceShipment(shipment) {
    try {
      let waypoints = [];
      if (shipment.waypoints_json) {
        try {
          waypoints = JSON.parse(shipment.waypoints_json);
        } catch (e) {
          waypoints = [];
        }
      }

      if (waypoints.length < 2) return;

      // Increment progress (e.g. 1.2% per tick * speedMultiplier)
      const stepIncrement = 0.8 * this.speedMultiplier;
      let newProgress = (shipment.progress_percent || 0) + stepIncrement;

      if (newProgress >= 100) {
        newProgress = 100;
      }

      // Calculate position along multi-segment polyline based on newProgress
      const position = this.interpolateAlongWaypoints(waypoints, newProgress);

      // Recalculate dynamic ETA & delay status
      const etaData = calculateEta(
        position.lat,
        position.lng,
        shipment.destination_lat,
        shipment.destination_lng,
        shipment.vessel_type || 'Container Ship',
        shipment.estimated_delivery
      );

      // Update shipment in DB
      db.run(
        `UPDATE shipments
         SET current_lat = ?,
             current_lng = ?,
             current_location_name = ?,
             progress_percent = ?,
             is_delayed = ?,
             updated_at = datetime('now')
         WHERE id = ?`,
        [
          position.lat,
          position.lng,
          position.locationName || shipment.current_location_name,
          Math.min(100, Math.round(newProgress * 10) / 10),
          etaData.isDelayed,
          shipment.id,
        ]
      );

      // Also update vessel position if linked
      if (shipment.vessel_id) {
        db.run(
          `UPDATE vessels SET current_lat = ?, current_lng = ? WHERE id = ?`,
          [position.lat, position.lng, shipment.vessel_id]
        );
      }

      // Broadcast real-time location update over Socket.IO
      socketService.broadcastLocationUpdate(shipment.tracking_id, {
        currentLat: position.lat,
        currentLng: position.lng,
        currentLocationName: position.locationName || shipment.current_location_name,
        progressPercent: Math.min(100, Math.round(newProgress * 10) / 10),
        eta: etaData.calculatedEta,
        remainingKm: etaData.distanceRemainingKm,
        isDelayed: Boolean(etaData.isDelayed),
      });

      // If reached 100%, loop or transition
      if (newProgress >= 100 && shipment.status === 'OUT_FOR_DELIVERY') {
        // Can mark delivered
        // But for continuous viva demo, keep in transit or loop gently
      }
    } catch (err) {
      console.error(`Error advancing shipment ${shipment.tracking_id}:`, err);
    }
  }

  /**
   * Linear interpolation between waypoints given a 0-100 progress percent
   */
  interpolateAlongWaypoints(waypoints, progressPercent) {
    if (progressPercent <= 0) {
      return {
        lat: waypoints[0].lat,
        lng: waypoints[0].lng,
        locationName: waypoints[0].name,
      };
    }
    if (progressPercent >= 100) {
      const last = waypoints[waypoints.length - 1];
      return {
        lat: last.lat,
        lng: last.lng,
        locationName: last.name,
      };
    }

    // Calculate total segments and fractional position
    const totalSegments = waypoints.length - 1;
    const globalFraction = progressPercent / 100;
    const scaledIndex = globalFraction * totalSegments;
    const segmentIndex = Math.min(Math.floor(scaledIndex), totalSegments - 1);
    const localFraction = scaledIndex - segmentIndex;

    const p1 = waypoints[segmentIndex];
    const p2 = waypoints[segmentIndex + 1];

    const lat = p1.lat + (p2.lat - p1.lat) * localFraction;
    const lng = p1.lng + (p2.lng - p1.lng) * localFraction;

    let locationName = p1.name;
    if (localFraction > 0.6) {
      locationName = `Approaching ${p2.name}`;
    } else if (localFraction > 0.1) {
      locationName = `En route from ${p1.name} to ${p2.name}`;
    }

    return {
      lat: Number(lat.toFixed(5)),
      lng: Number(lng.toFixed(5)),
      locationName,
    };
  }

  /**
   * Resets active shipments progress to 5% for presentation restart
   */
  resetActiveShipments() {
    const active = db.query("SELECT id, origin_lat, origin_lng, origin_city FROM shipments WHERE status IN ('IN_TRANSIT', 'OUT_FOR_DELIVERY')");
    for (const s of active) {
      db.run(
        "UPDATE shipments SET progress_percent = 5, current_lat = origin_lat, current_lng = origin_lng, current_location_name = origin_city WHERE id = ?",
        [s.id]
      );
    }
    return true;
  }
}

const simulatorInstance = new GpsSimulator();

module.exports = simulatorInstance;
