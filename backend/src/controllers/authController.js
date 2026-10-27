const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const { JWT_SECRET } = require('../middleware/authMiddleware');
const { logAudit } = require('../services/auditService');

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, company } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = db.get('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = db.run(
      `INSERT INTO users (name, email, password_hash, role, phone, company, created_at)
       VALUES (?, ?, ?, 'CUSTOMER', ?, ?, datetime('now'))`,
      [name.trim(), normalizedEmail, passwordHash, phone || null, company || null]
    );

    const user = {
      id: result.lastInsertRowid,
      name: name.trim(),
      email: normalizedEmail,
      role: 'CUSTOMER',
      phone: phone || null,
      company: company || null,
    };

    const token = generateToken(user);

    logAudit({
      userId: user.id,
      userEmail: user.email,
      action: 'USER_REGISTER',
      entityType: 'USER',
      entityId: user.id,
      details: `User registered: ${user.email}`,
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = db.get('SELECT * FROM users WHERE email = ?', [normalizedEmail]);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      company: user.company,
      created_at: user.created_at,
    };

    const token = generateToken(safeUser);

    logAudit({
      userId: user.id,
      userEmail: user.email,
      action: 'USER_LOGIN',
      entityType: 'USER',
      entityId: user.id,
      details: `User logged in: ${user.email} (${user.role})`,
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
};

exports.getMe = (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, company, currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = db.get('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    let passwordHash = user.password_hash;
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Current password is required to change password.' });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password does not match.' });
      }
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(newPassword, salt);
    }

    db.run(
      `UPDATE users
       SET name = ?, phone = ?, company = ?, password_hash = ?
       WHERE id = ?`,
      [
        name ? name.trim() : user.name,
        phone !== undefined ? phone : user.phone,
        company !== undefined ? company : user.company,
        passwordHash,
        userId,
      ]
    );

    const updatedUser = db.get('SELECT id, name, email, role, phone, company, created_at FROM users WHERE id = ?', [userId]);

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};
