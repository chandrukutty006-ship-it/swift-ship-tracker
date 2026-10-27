const db = require('../db/database');

exports.getDashboardStats = (req, res, next) => {
  try {
    // 1. Metric Counts
    const totalRow = db.get('SELECT COUNT(*) as count, COALESCE(SUM(weight_kg), 0) as total_weight FROM shipments');
    const inTransitRow = db.get("SELECT COUNT(*) as count FROM shipments WHERE status IN ('IN_TRANSIT', 'OUT_FOR_DELIVERY')");
    const deliveredRow = db.get("SELECT COUNT(*) as count FROM shipments WHERE status = 'DELIVERED'");
    const delayedRow = db.get("SELECT COUNT(*) as count FROM shipments WHERE is_delayed = 1 OR status = 'DELAYED'");
    const vesselCountRow = db.get("SELECT COUNT(*) as count FROM vessels WHERE status = 'ACTIVE'");

    // 2. Status Distribution for Pie Chart
    const statusCounts = db.query(`
      SELECT status, COUNT(*) as count 
      FROM shipments 
      GROUP BY status
    `);

    // 3. Cargo Type Distribution for Bar/Pie Chart
    const cargoDistribution = db.query(`
      SELECT cargo_type, COUNT(*) as count, ROUND(SUM(weight_kg)/1000, 1) as weight_tons
      FROM shipments
      GROUP BY cargo_type
      ORDER BY count DESC
    `);

    // 4. Monthly Trend (last 6 months shipments created)
    const monthlyTrend = db.query(`
      SELECT strftime('%Y-%m', created_at) as month, COUNT(*) as total_shipments,
             SUM(CASE WHEN status = 'DELIVERED' THEN 1 ELSE 0 END) as delivered
      FROM shipments
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY month ASC
      LIMIT 6
    `);

    // 5. Recent Activity Feed (latest 8 shipment events across the system)
    const recentEvents = db.query(`
      SELECT e.*, s.tracking_id, s.origin_city, s.destination_city
      FROM shipment_events e
      JOIN shipments s ON e.shipment_id = s.id
      ORDER BY e.timestamp DESC, e.id DESC
      LIMIT 8
    `);

    res.json({
      success: true,
      metrics: {
        totalShipments: totalRow ? totalRow.count : 0,
        totalWeightTons: totalRow ? Math.round((totalRow.total_weight / 1000) * 10) / 10 : 0,
        inTransit: inTransitRow ? inTransitRow.count : 0,
        delivered: deliveredRow ? deliveredRow.count : 0,
        delayed: delayedRow ? delayedRow.count : 0,
        activeVessels: vesselCountRow ? vesselCountRow.count : 0,
      },
      statusCounts,
      cargoDistribution,
      monthlyTrend,
      recentEvents,
    });
  } catch (err) {
    next(err);
  }
};
