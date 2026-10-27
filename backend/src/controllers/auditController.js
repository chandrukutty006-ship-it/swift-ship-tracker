const db = require('../db/database');

exports.getAuditLogs = (req, res, next) => {
  try {
    const { action = '', limit = 50 } = req.query;
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));

    let query = 'SELECT * FROM audit_logs';
    const params = [];

    if (action) {
      query += ' WHERE action = ?';
      params.push(action);
    }

    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(limitNum);

    const logs = db.query(query, params);

    res.json({
      success: true,
      logs,
    });
  } catch (err) {
    next(err);
  }
};
