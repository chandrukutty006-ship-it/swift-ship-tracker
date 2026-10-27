const db = require('../db/database');

exports.getEmailLogs = (req, res, next) => {
  try {
    const { limit = 50 } = req.query;
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));

    const emails = db.query(
      `SELECT id, to_email, to_name, subject, tracking_id, event_type, sent_at
       FROM email_logs
       ORDER BY sent_at DESC
       LIMIT ?`,
      [limitNum]
    );

    res.json({
      success: true,
      emails,
    });
  } catch (err) {
    next(err);
  }
};

exports.getEmailById = (req, res, next) => {
  try {
    const { id } = req.params;
    const email = db.get('SELECT * FROM email_logs WHERE id = ?', [id]);
    if (!email) {
      return res.status(404).json({ success: false, message: 'Email log not found.' });
    }

    res.json({
      success: true,
      email,
    });
  } catch (err) {
    next(err);
  }
};
