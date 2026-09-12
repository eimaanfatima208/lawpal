/**
 * Add lawyer profile columns to users table (idempotent).
 * Usage: node lawpal-backend/migrate_lawyer_fields.js
 */
const path = require('path');
const mysql = require(path.join(__dirname, '..', 'lawpal-chat-backend', 'node_modules', 'mysql2/promise'));

async function columnExists(conn, table, column) {
  const [rows] = await conn.query(
    `SELECT 1 FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ? LIMIT 1`,
    [table, column]
  );
  return rows.length > 0;
}

async function addColumn(conn, ddl) {
  try {
    await conn.query(ddl);
    console.log('OK:', ddl.slice(0, 80) + '...');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('Skip (exists):', ddl.slice(0, 60));
    } else {
      throw err;
    }
  }
}

async function main() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lawpal',
  });

  const cols = [
    ['serial_no_hc', "ALTER TABLE users ADD COLUMN serial_no_hc VARCHAR(32) NULL UNIQUE AFTER role"],
    ['father_name', "ALTER TABLE users ADD COLUMN father_name VARCHAR(255) NULL AFTER serial_no_hc"],
    ['lc_enr_date', "ALTER TABLE users ADD COLUMN lc_enr_date DATE NULL AFTER father_name"],
    ['hc_enr_date', "ALTER TABLE users ADD COLUMN hc_enr_date DATE NULL AFTER lc_enr_date"],
    ['specialty', "ALTER TABLE users ADD COLUMN specialty VARCHAR(120) NULL AFTER hc_enr_date"],
    ['education', "ALTER TABLE users ADD COLUMN education VARCHAR(255) NULL AFTER specialty"],
    ['city', "ALTER TABLE users ADD COLUMN city VARCHAR(100) NULL AFTER education"],
    ['gender', "ALTER TABLE users ADD COLUMN gender ENUM('male','female','other') NULL AFTER city"],
  ];

  for (const [name, ddl] of cols) {
    if (await columnExists(conn, 'users', name)) {
      console.log('Skip (exists):', name);
    } else {
      await addColumn(conn, ddl);
    }
  }

  await conn.end();
  console.log('Lawyer fields migration done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
