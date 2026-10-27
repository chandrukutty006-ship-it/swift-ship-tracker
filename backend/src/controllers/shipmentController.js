const crypto = require('crypto');
const db = require('../db/database');
const { calculateEta } = require('../services/etaCalculator');
const { sendNotification } = require('../services/notificationService');
const { logAudit } = require('../services/auditService');
const socketService = require('../services/socketService');

/**
 * Generates unique tracking ID in format SST-XXXXXXXX
 */
function generateTrackingId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  for (let i = 0; i < 8; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SST-${randomPart}`;
}

/**
 * Generates realistic intermediate waypoints along a curve between origin and destination
 */
function generateRouteWaypoints(origin, destination, count = 5) {
  const waypoints = [
    { lat: origin.lat, lng: origin.lng, name: origin.city, reached: 1 }
  ];

  // If long distance, generate intermediate sea/transit points with slight curvature
  for (let i = 1; i <= count; i++) {
    const fraction = i / (count + 1);
    // Slight curved offset to simulate maritime shipping lane
    const offset = Math.sin(fraction * Math.PI) * 2.5;
    const lat = origin.lat + (destination.lat - origin.lat) * fraction + offset;
    const lng = origin.lng + (destination.lng - origin.lng) * fraction;

    waypoints.push({
      lat: Number(lat.toFixed(4)),
      lng: Number(lng.toFixed(4)),
      name: `Waystation Point ${i} (${Math.round(fraction * 100)}%)`,
      reached: 0
    });
  }

  waypoints.push({
    lat: destination.lat,
    lng: destination.lng,
    name: destination.city,
    reached: 0
  });

  return waypoints;
}

// 1. Get all shipments with filtering, search, sorting, and pagination
exports.getAllShipments = (req, res, next) => {
  try {
    const {
      search = '',
      status = '',
      cargoType = '',
      sortBy = 'created_at',
      sortOrder = 'DESC',
      page = 1,
      limit = 20,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const offset = (pageNum - 1) * limitNum;

    const validSortFields = ['created_at', 'updated_at', 'tracking_id', 'status', 'estimated_delivery', 'weight_kg'];
    const safeSortBy = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    let whereClauses = [];
    let params = [];

    if (search.trim()) {
      whereClauses.push(`(
        s.tracking_id LIKE ? OR 
        s.sender_name LIKE ? OR 
        s.receiver_name LIKE ? OR 
        s.origin_city LIKE ? OR 
        s.destination_city LIKE ? OR 
        s.vessel_name LIKE ?
      )`);
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term, term, term);
    }

    if (status) {
      whereClauses.push('s.status = ?');
      params.push(status);
    }

    if (cargoType) {
      whereClauses.push('s.cargo_type = ?');
      params.push(cargoType);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const countRow = db.get(`SELECT COUNT(*) as total FROM shipments s ${whereSql}`, params);
    const total = countRow ? countRow.total : 0;

    const querySql = `
      SELECT s.*, u.email as customer_email, u.name as customer_name, v.name as vessel_name, v.type as vessel_type
      FROM shipments s
      LEFT JOIN users u ON s.user_id = u.id
      LEFT JOIN vessels v ON s.vessel_id = v.id
      ${whereSql}
      ORDER BY s.${safeSortBy} ${safeSortOrder}
      LIMIT ? OFFSET ?
    `;

    const shipments = db.query(querySql, [...params, limitNum, offset]);

    res.json({
      success: true,
      shipments,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
};

// 2. Public Tracking endpoint: look up by tracking ID
exports.getByTrackingId = (req, res, next) => {
  try {
    const trackingId = req.params.trackingId.trim().toUpperCase();

    const shipment = db.get(
      `SELECT s.*, u.name as customer_name, u.email as customer_email, v.name as vessel_name, v.type as vessel_type, v.flag as vessel_flag, v.registration_number as vessel_reg
       FROM shipments s
       LEFT JOIN users u ON s.user_id = u.id
       LEFT JOIN vessels v ON s.vessel_id = v.id
       WHERE UPPER(s.tracking_id) = ?`,
      [trackingId]
    );

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: `No shipment found matching tracking ID: ${trackingId}`,
      });
    }

    // Fetch timeline events in ascending order
    const events = db.query(
      `SELECT * FROM shipment_events WHERE shipment_id = ? ORDER BY timestamp ASC, id ASC`,
      [shipment.id]
    );

    // Compute live ETA
    const etaData = calculateEta(
      shipment.current_lat,
      shipment.current_lng,
      shipment.destination_lat,
      shipment.destination_lng,
      shipment.vessel_type || 'Container Ship',
      shipment.estimated_delivery
    );

    let waypoints = [];
    if (shipment.waypoints_json) {
      try {
        waypoints = JSON.parse(shipment.waypoints_json);
      } catch (e) {
        waypoints = [];
      }
    }

    res.json({
      success: true,
      shipment: {
        ...shipment,
        waypoints,
        events,
        etaData,
      },
    });
  } catch (err) {
    next(err);
  }
};

// 3. Customer: Get my shipments
exports.getMyShipments = (req, res, next) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;

    const shipments = db.query(
      `SELECT s.*, v.name as vessel_name, v.type as vessel_type
       FROM shipments s
       LEFT JOIN vessels v ON s.vessel_id = v.id
       WHERE s.user_id = ? OR LOWER(s.receiver_name) LIKE ?
       ORDER BY s.created_at DESC`,
      [userId, `%${userEmail}%`]
    );

    res.json({
      success: true,
      shipments,
    });
  } catch (err) {
    next(err);
  }
};

// 4. Admin: Create new shipment
exports.createShipment = (req, res, next) => {
  try {
    const {
      sender_name,
      sender_address,
      sender_phone,
      receiver_name,
      receiver_address,
      receiver_phone,
      origin_city,
      origin_country,
      origin_lat,
      origin_lng,
      destination_city,
      destination_country,
      destination_lat,
      destination_lng,
      cargo_type = 'General Cargo',
      weight_kg,
      volume_cbm = 0,
      vessel_id = null,
      estimated_delivery,
      user_id = null,
    } = req.body;

    if (!sender_name || !receiver_name || !origin_city || !destination_city || !weight_kg || !estimated_delivery) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required shipment fields.',
      });
    }

    // Auto-generate unique tracking ID
    let trackingId = generateTrackingId();
    while (db.get('SELECT id FROM shipments WHERE tracking_id = ?', [trackingId])) {
      trackingId = generateTrackingId();
    }

    const oLat = parseFloat(origin_lat) || 13.0827; // Default Chennai
    const oLng = parseFloat(origin_lng) || 80.2707;
    const dLat = parseFloat(destination_lat) || 1.3521; // Default Singapore
    const dLng = parseFloat(destination_lng) || 103.8198;

    // Generate waypoints along realistic path
    const waypoints = generateRouteWaypoints(
      { lat: oLat, lng: oLng, city: origin_city },
      { lat: dLat, lng: dLng, city: destination_city },
      5
    );

    // Get vessel name if assigned
    let vesselName = null;
    if (vessel_id) {
      const v = db.get('SELECT name FROM vessels WHERE id = ?', [vessel_id]);
      if (v) vesselName = v.name;
    }

    const insertResult = db.run(
      `INSERT INTO shipments (
        tracking_id, user_id, sender_name, sender_address, sender_phone,
        receiver_name, receiver_address, receiver_phone,
        origin_city, origin_country, origin_lat, origin_lng,
        destination_city, destination_country, destination_lat, destination_lng,
        current_lat, current_lng, current_location_name,
        cargo_type, weight_kg, volume_cbm, vessel_id, vessel_name,
        status, estimated_delivery, progress_percent, waypoints_json,
        current_waypoint_index, is_delayed, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?, ?,
        'ORDER_PLACED', ?, 0, ?,
        0, 0, datetime('now'), datetime('now')
      )`,
      [
        trackingId,
        user_id || null,
        sender_name.trim(),
        sender_address || '',
        sender_phone || '',
        receiver_name.trim(),
        receiver_address || '',
        receiver_phone || '',
        origin_city.trim(),
        origin_country || '',
        oLat,
        oLng,
        destination_city.trim(),
        destination_country || '',
        dLat,
        dLng,
        oLat,
        oLng,
        `${origin_city} Port / Origin Hub`,
        cargo_type,
        parseFloat(weight_kg),
        parseFloat(volume_cbm) || 0,
        vessel_id || null,
        vesselName,
        estimated_delivery,
        JSON.stringify(waypoints),
      ]
    );

    const shipmentId = insertResult.lastInsertRowid;

    // Record initial timeline event
    db.run(
      `INSERT INTO shipment_events (shipment_id, status, title, description, location, latitude, longitude, timestamp)
       VALUES (?, 'ORDER_PLACED', 'Shipment Order Created', 'Consignment booked in Swift Ship system and ready for containerization.', ?, ?, ?, datetime('now'))`,
      [shipmentId, origin_city, oLat, oLng]
    );

    // Send notification and simulated email
    sendNotification({
      userId: user_id,
      shipmentId,
      title: 'Shipment Order Booked',
      message: `Your consignment from ${origin_city} to ${destination_city} has been confirmed. Tracking ID: ${trackingId}`,
      type: 'STATUS_UPDATE',
      trackingId,
      recipientEmail: req.user ? req.user.email : null,
      recipientName: receiver_name,
    });

    logAudit({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'CREATE_SHIPMENT',
      entityType: 'SHIPMENT',
      entityId: trackingId,
      details: { trackingId, origin_city, destination_city, cargo_type, weight_kg },
      ipAddress: req.ip,
    });

    const newShipment = db.get('SELECT * FROM shipments WHERE id = ?', [shipmentId]);

    res.status(201).json({
      success: true,
      message: 'Shipment created successfully.',
      shipment: newShipment,
    });
  } catch (err) {
    next(err);
  }
};

// 5. Admin: Update shipment details
exports.updateShipment = (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      sender_name,
      sender_address,
      sender_phone,
      receiver_name,
      receiver_address,
      receiver_phone,
      cargo_type,
      weight_kg,
      volume_cbm,
      vessel_id,
      estimated_delivery,
    } = req.body;

    const existing = db.get('SELECT * FROM shipments WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    let vesselName = existing.vessel_name;
    if (vessel_id && vessel_id !== existing.vessel_id) {
      const v = db.get('SELECT name FROM vessels WHERE id = ?', [vessel_id]);
      if (v) vesselName = v.name;
    }

    db.run(
      `UPDATE shipments
       SET sender_name = ?, sender_address = ?, sender_phone = ?,
           receiver_name = ?, receiver_address = ?, receiver_phone = ?,
           cargo_type = ?, weight_kg = ?, volume_cbm = ?,
           vessel_id = ?, vessel_name = ?, estimated_delivery = ?,
           updated_at = datetime('now')
       WHERE id = ?`,
      [
        sender_name !== undefined ? sender_name : existing.sender_name,
        sender_address !== undefined ? sender_address : existing.sender_address,
        sender_phone !== undefined ? sender_phone : existing.sender_phone,
        receiver_name !== undefined ? receiver_name : existing.receiver_name,
        receiver_address !== undefined ? receiver_address : existing.receiver_address,
        receiver_phone !== undefined ? receiver_phone : existing.receiver_phone,
        cargo_type !== undefined ? cargo_type : existing.cargo_type,
        weight_kg !== undefined ? parseFloat(weight_kg) : existing.weight_kg,
        volume_cbm !== undefined ? parseFloat(volume_cbm) : existing.volume_cbm,
        vessel_id !== undefined ? vessel_id : existing.vessel_id,
        vesselName,
        estimated_delivery !== undefined ? estimated_delivery : existing.estimated_delivery,
        id,
      ]
    );

    logAudit({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'UPDATE_SHIPMENT',
      entityType: 'SHIPMENT',
      entityId: existing.tracking_id,
      details: { id, changes: req.body },
      ipAddress: req.ip,
    });

    const updated = db.get('SELECT * FROM shipments WHERE id = ?', [id]);
    res.json({
      success: true,
      message: 'Shipment updated successfully.',
      shipment: updated,
    });
  } catch (err) {
    next(err);
  }
};

// 6. Admin: Update shipment status & add timeline event
exports.updateStatus = (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, title, description, location, latitude, longitude, delay_reason } = req.body;

    const shipment = db.get('SELECT * FROM shipments WHERE id = ?', [id]);
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    const eventLocation = location || shipment.current_location_name || shipment.origin_city;
    const eventLat = latitude !== undefined ? parseFloat(latitude) : shipment.current_lat;
    const eventLng = longitude !== undefined ? parseFloat(longitude) : shipment.current_lng;
    const eventTitle = title || `Status updated to ${status.replace('_', ' ')}`;

    // Calculate progress percentage according to status
    let progress = shipment.progress_percent;
    let actualDelivery = shipment.actual_delivery;

    switch (status) {
      case 'ORDER_PLACED':
        progress = 5;
        break;
      case 'PICKED_UP':
        progress = 15;
        break;
      case 'IN_TRANSIT':
        progress = Math.max(25, progress);
        break;
      case 'AT_PORT':
        progress = 65;
        break;
      case 'CUSTOMS_CLEARANCE':
        progress = 80;
        break;
      case 'OUT_FOR_DELIVERY':
        progress = 90;
        break;
      case 'DELIVERED':
        progress = 100;
        actualDelivery = new Date().toISOString();
        break;
      default:
        break;
    }

    const isDelayed = status === 'DELAYED' ? 1 : shipment.is_delayed;

    db.run(
      `UPDATE shipments
       SET status = ?,
           current_location_name = ?,
           current_lat = ?,
           current_lng = ?,
           progress_percent = ?,
           actual_delivery = ?,
           is_delayed = ?,
           delay_reason = ?,
           updated_at = datetime('now')
       WHERE id = ?`,
      [
        status,
        eventLocation,
        eventLat,
        eventLng,
        progress,
        actualDelivery,
        isDelayed,
        delay_reason || shipment.delay_reason,
        id,
      ]
    );

    // Insert timeline event
    db.run(
      `INSERT INTO shipment_events (shipment_id, status, title, description, location, latitude, longitude, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [id, status, eventTitle, description || '', eventLocation, eventLat, eventLng]
    );

    // Send notifications
    const notifType = status === 'DELIVERED' ? 'DELIVERY' : status === 'DELAYED' ? 'DELAY_ALERT' : 'STATUS_UPDATE';
    sendNotification({
      userId: shipment.user_id,
      shipmentId: shipment.id,
      title: eventTitle,
      message: description || `Consignment ${shipment.tracking_id} is now ${status.replace('_', ' ')} at ${eventLocation}.`,
      type: notifType,
      trackingId: shipment.tracking_id,
      recipientEmail: null,
      recipientName: shipment.receiver_name,
    });

    // Broadcast over Socket.IO
    socketService.broadcastStatusUpdate(shipment.tracking_id, {
      status,
      title: eventTitle,
      location: eventLocation,
      progressPercent: progress,
      currentLat: eventLat,
      currentLng: eventLng,
    });

    logAudit({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'UPDATE_STATUS',
      entityType: 'SHIPMENT',
      entityId: shipment.tracking_id,
      details: { oldStatus: shipment.status, newStatus: status, location: eventLocation },
      ipAddress: req.ip,
    });

    const updatedShipment = db.get('SELECT * FROM shipments WHERE id = ?', [id]);
    res.json({
      success: true,
      message: `Status updated to ${status}`,
      shipment: updatedShipment,
    });
  } catch (err) {
    next(err);
  }
};

// 7. Admin: Manual location update
exports.addLocationUpdate = (req, res, next) => {
  try {
    const { id } = req.params;
    const { latitude, longitude, location_name, note } = req.body;

    const shipment = db.get('SELECT * FROM shipments WHERE id = ?', [id]);
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const locName = location_name || 'En Route Waypoint';

    db.run(
      `UPDATE shipments
       SET current_lat = ?, current_lng = ?, current_location_name = ?, updated_at = datetime('now')
       WHERE id = ?`,
      [lat, lng, locName, id]
    );

    db.run(
      `INSERT INTO shipment_events (shipment_id, status, title, description, location, latitude, longitude, timestamp)
       VALUES (?, ?, 'Location Check-in', ?, ?, ?, ?, datetime('now'))`,
      [id, shipment.status, note || 'Manual GPS telemetry coordinate recorded.', locName, lat, lng]
    );

    socketService.broadcastLocationUpdate(shipment.tracking_id, {
      currentLat: lat,
      currentLng: lng,
      currentLocationName: locName,
      progressPercent: shipment.progress_percent,
    });

    logAudit({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'UPDATE_LOCATION',
      entityType: 'SHIPMENT',
      entityId: shipment.tracking_id,
      details: { lat, lng, locationName: locName, note },
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      message: 'Location updated successfully.',
    });
  } catch (err) {
    next(err);
  }
};

// 8. Admin: Delete shipment
exports.deleteShipment = (req, res, next) => {
  try {
    const { id } = req.params;
    const shipment = db.get('SELECT * FROM shipments WHERE id = ?', [id]);
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    db.run('DELETE FROM shipments WHERE id = ?', [id]);

    logAudit({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'DELETE_SHIPMENT',
      entityType: 'SHIPMENT',
      entityId: shipment.tracking_id,
      details: { id, trackingId: shipment.tracking_id },
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      message: `Shipment ${shipment.tracking_id} deleted successfully.`,
    });
  } catch (err) {
    next(err);
  }
};
