/**
 * MySQL connection pool
 */
const mysql = require('mysql2/promise');
const config = require('./config');

const pool = mysql.createPool(config.db);

async function ensureAppointmentsSchema() {
  const alters = [
    `ALTER TABLE appointments ADD COLUMN status ENUM('pending','accepted','rejected','cancelled') NOT NULL DEFAULT 'pending'`,
    `ALTER TABLE appointments ADD COLUMN notes VARCHAR(500) NULL`,
    `ALTER TABLE appointments ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
  ];
  for (const sql of alters) {
    try {
      await pool.query(sql);
    } catch (err) {
      if (err.code !== 'ER_DUP_FIELDNAME' && err.code !== 'ER_NO_SUCH_TABLE') {
        console.warn('Appointments schema update skipped:', err.message);
      }
    }
  }
}

// Test connection on startup and ensure schemas exist
pool.getConnection()
  .then(async (conn) => {
    console.log('Database connected successfully');
    conn.release();
    await ensureAppointmentsSchema();
  })
  .catch(err => {
    console.error('Database connection failed:', err.message);
  });

module.exports = pool;
