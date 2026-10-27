const db = require('../db/database');

/**
 * Records an administrative or system action into the audit trail
 */
function logAudit({
  userId = null,
  userEmail = 'SYSTEM',
  action,
  entityType,
  entityId = null,
  details = null,
  ipAddress = '127.0.0.1',
}) {
  try {
    const detailsStr = typeof details === 'object' ? JSON.stringify(details) : String(details || '');

    db.run(
      `INSERT INTO audit_logs (user_id, user_email, action, entity_type, entity_id, details, ip_address, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [userId, userEmail, action, entityType, String(entityId || ''), detailsStr, ipAddress]
    );
  } catch (err) {
    console.error('Audit logging error:', err);
  }
}

module.exports = {
  logAudit,
};
