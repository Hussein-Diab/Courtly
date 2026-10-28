const pool = require('../config/db');

const findByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
};

const findById = async (id) => {
  const [rows] = await pool.query(
    'SELECT id, full_name, email, role, created_at FROM users WHERE id = ? AND is_active = TRUE',
    [id]
  );
  return rows[0] || null;
};

const create = async ({ fullName, email, passwordHash, role }) => {
  const [result] = await pool.query(
    'INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [fullName, email, passwordHash, role]
  );
  return result.insertId;
};

module.exports = { findByEmail, findById, create };
