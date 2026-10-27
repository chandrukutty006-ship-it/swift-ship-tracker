const db = require('../db/database');

exports.exportShipmentsCsv = (req, res, next) => {
  try {
    const { status = '', cargoType = '' } = req.query;

    let whereClauses = [];
    let params = [];

    if (status) {
      whereClauses.push('status = ?');
      params.push(status);
    }
    if (cargoType) {
      whereClauses.push('cargo_type = ?');
      params.push(cargoType);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const shipments = db.query(`SELECT * FROM shipments ${whereSql} ORDER BY created_at DESC`, params);

    // Escape CSV fields
    const escapeCsv = (str) => {
      if (str === null || str === undefined) return '""';
      const clean = String(str).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const headers = [
      'Tracking ID',
      'Status',
      'Sender Name',
      'Sender City/Address',
      'Receiver Name',
      'Receiver City/Address',
      'Origin City',
      'Origin Country',
      'Destination City',
      'Destination Country',
      'Current Location',
      'Cargo Type',
      'Weight (kg)',
      'Volume (cbm)',
      'Vessel Name',
      'Progress (%)',
      'Is Delayed',
      'Delay Reason',
      'Estimated Delivery',
      'Created At',
    ];

    const rows = shipments.map((s) => [
      escapeCsv(s.tracking_id),
      escapeCsv(s.status),
      escapeCsv(s.sender_name),
      escapeCsv(s.sender_address),
      escapeCsv(s.receiver_name),
      escapeCsv(s.receiver_address),
      escapeCsv(s.origin_city),
      escapeCsv(s.origin_country),
      escapeCsv(s.destination_city),
      escapeCsv(s.destination_country),
      escapeCsv(s.current_location_name),
      escapeCsv(s.cargo_type),
      s.weight_kg,
      s.volume_cbm,
      escapeCsv(s.vessel_name || 'Unassigned'),
      s.progress_percent,
      s.is_delayed ? 'YES' : 'NO',
      escapeCsv(s.delay_reason || ''),
      escapeCsv(s.estimated_delivery),
      escapeCsv(s.created_at),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    const filename = `SwiftShip_Report_${new Date().toISOString().slice(0, 10)}.csv`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csvContent);
  } catch (err) {
    next(err);
  }
};
