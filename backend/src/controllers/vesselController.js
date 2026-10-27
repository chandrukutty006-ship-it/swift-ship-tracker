const db = require('../db/database');
const { logAudit } = require('../services/auditService');

exports.getVessels = (req, res, next) => {
  try {
    const vessels = db.query(`
      SELECT v.*, COUNT(s.id) as active_shipment_count
      FROM vessels v
      LEFT JOIN shipments s ON s.vessel_id = v.id AND s.status IN ('IN_TRANSIT', 'OUT_FOR_DELIVERY', 'PICKED_UP', 'AT_PORT')
      GROUP BY v.id
      ORDER BY v.name ASC
    `);

    res.json({
      success: true,
      vessels,
    });
  } catch (err) {
    next(err);
  }
};

exports.createVessel = (req, res, next) => {
  try {
    const { name, type = 'Container Ship', registration_number, capacity, flag = 'Panama', status = 'ACTIVE' } = req.body;

    if (!name || !registration_number || !capacity) {
      return res.status(400).json({ success: false, message: 'Name, registration number, and capacity are required.' });
    }

    const existing = db.get('SELECT id FROM vessels WHERE registration_number = ?', [registration_number.trim()]);
    if (existing) {
      return res.status(400).json({ success: false, message: 'A vessel with this registration/IMO number already exists.' });
    }

    const result = db.run(
      `INSERT INTO vessels (name, type, registration_number, capacity, flag, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
      [name.trim(), type, registration_number.trim(), capacity.trim(), flag, status]
    );

    const newVessel = db.get('SELECT * FROM vessels WHERE id = ?', [result.lastInsertRowid]);

    logAudit({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'CREATE_VESSEL',
      entityType: 'VESSEL',
      entityId: registration_number,
      details: { name, type, capacity },
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: 'Vessel added to fleet successfully.',
      vessel: newVessel,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateVessel = (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, type, capacity, flag, status } = req.body;

    const vessel = db.get('SELECT * FROM vessels WHERE id = ?', [id]);
    if (!vessel) {
      return res.status(404).json({ success: false, message: 'Vessel not found.' });
    }

    db.run(
      `UPDATE vessels
       SET name = ?, type = ?, capacity = ?, flag = ?, status = ?
       WHERE id = ?`,
      [
        name ? name.trim() : vessel.name,
        type || vessel.type,
        capacity ? capacity.trim() : vessel.capacity,
        flag || vessel.flag,
        status || vessel.status,
        id,
      ]
    );

    logAudit({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'UPDATE_VESSEL',
      entityType: 'VESSEL',
      entityId: vessel.registration_number,
      details: req.body,
      ipAddress: req.ip,
    });

    const updated = db.get('SELECT * FROM vessels WHERE id = ?', [id]);
    res.json({
      success: true,
      message: 'Vessel updated successfully.',
      vessel: updated,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteVessel = (req, res, next) => {
  try {
    const { id } = req.params;
    const vessel = db.get('SELECT * FROM vessels WHERE id = ?', [id]);
    if (!vessel) {
      return res.status(404).json({ success: false, message: 'Vessel not found.' });
    }

    // Set vessel_id to NULL on any linked shipments
    db.run('UPDATE shipments SET vessel_id = NULL WHERE vessel_id = ?', [id]);
    db.run('DELETE FROM vessels WHERE id = ?', [id]);

    logAudit({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'DELETE_VESSEL',
      entityType: 'VESSEL',
      entityId: vessel.registration_number,
      details: { id, name: vessel.name },
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      message: 'Vessel removed from fleet.',
    });
  } catch (err) {
    next(err);
  }
};
