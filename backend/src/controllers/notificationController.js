const db = require('../db/database');

exports.getNotifications = (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const notifications = db.query(
      `SELECT n.*, s.tracking_id
       FROM notifications n
       LEFT JOIN shipments s ON n.shipment_id = s.id
       WHERE n.user_id = ? OR n.user_id IS NULL
       ORDER BY n.created_at DESC
       LIMIT 30`,
      [userId]
    );

    const unreadCountRow = db.get(
      `SELECT COUNT(*) as count FROM notifications WHERE (user_id = ? OR user_id IS NULL) AND is_read = 0`,
      [userId]
    );

    res.json({
      success: true,
      notifications,
      unreadCount: unreadCountRow ? unreadCountRow.count : 0,
    });
  } catch (err) {
    next(err);
  }
};

exports.markAsRead = (req, res, next) => {
  try {
    const { id } = req.params;
    db.run('UPDATE notifications SET is_read = 1 WHERE id = ?', [id]);
    res.json({ success: true, message: 'Notification marked as read.' });
  } catch (err) {
    next(err);
  }
};

exports.markAllAsRead = (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    db.run('UPDATE notifications SET is_read = 1 WHERE user_id = ? OR user_id IS NULL', [userId]);
    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) {
    next(err);
  }
};
