const express = require('express');
const router = express.Router();
const pool = require('../db');
const upload = require('../middleware/upload');
const path = require('path');

function toMySQLTime(slot) {
  if (!slot) return null;
  const m = String(slot).match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return slot;
  let h = parseInt(m[1], 10);
  const min = m[2].padStart(2, '0');
  if (m[3].toUpperCase() === 'PM' && h !== 12) h += 12;
  if (m[3].toUpperCase() === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${min}:00`;
}

// GET /api/lawyers - always return full_name for display (use name from email if full_name empty)
router.get('/lawyers', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id,
        COALESCE(NULLIF(TRIM(full_name), ''), SUBSTRING_INDEX(email, '@', 1)) AS full_name,
        email, role,
        serial_no_hc, father_name, lc_enr_date, hc_enr_date,
        specialty, education, city, gender
       FROM users WHERE role = 'lawyer'
       ORDER BY full_name ASC`
    );
    res.json({ success: true, lawyers: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/lawyers/women - female lawyers by gender or MS. title
router.get('/lawyers/women', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id,
        COALESCE(NULLIF(TRIM(full_name), ''), SUBSTRING_INDEX(email, '@', 1)) AS full_name,
        email, role,
        serial_no_hc, father_name, lc_enr_date, hc_enr_date,
        specialty, education, city, gender
       FROM users 
       WHERE role = 'lawyer' 
       AND (
         gender = 'female'
         OR full_name LIKE 'MS.%'
         OR full_name LIKE 'Ms.%'
         OR full_name LIKE 'MISS %'
         OR full_name LIKE 'Miss %'
         OR full_name LIKE '%Aisha%'
         OR full_name LIKE '%Fatima%'
         OR full_name LIKE '%Nadia%'
         OR full_name LIKE '%Hina%'
         OR full_name LIKE '%Mehwish%'
         OR full_name LIKE '%Sonia%'
         OR full_name LIKE '%Asma%'
         OR full_name LIKE '%Rameel%'
         OR full_name LIKE '%Noor%'
       )
       ORDER BY full_name ASC`
    );
    res.json({ success: true, lawyers: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Normalize date to YYYY-MM-DD for MySQL DATE
function toMySQLDate(dateStr) {
  if (!dateStr) return null;
  const s = String(dateStr).trim();
  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  // ISO or with time: take first 10 chars
  if (s.indexOf('T') !== -1) return s.split('T')[0];
  if (s.length >= 10) return s.substring(0, 10);
  return s;
}

function formatAppointmentTime(t) {
  if (t && typeof t === 'object' && t.constructor && t.constructor.name === 'Time') {
    const h = t.getHours();
    const m = t.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
  }
  if (!t) return t;
  const s = String(t);
  // Already 12h
  if (/AM|PM/i.test(s)) return s.trim();
  // HH:MM:SS or HH:MM
  const parts = s.split(':');
  if (parts.length >= 2) {
    const h = parseInt(parts[0], 10);
    if (!isNaN(h)) {
      const m = String(parts[1]).padStart(2, '0').slice(0, 2);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      return `${String(h12).padStart(2, '0')}:${m} ${ampm}`;
    }
  }
  return s.slice(0, 8);
}

function formatDateOnly(d) {
  if (!d) return d;
  if (d instanceof Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  const s = String(d);
  if (s.includes('T')) return s.split('T')[0];
  return s.slice(0, 10);
}

function mapAppointmentRow(r) {
  return {
    appointment_id: r.appointment_id,
    citizen_id: r.citizen_id,
    lawyer_id: r.lawyer_id,
    date: formatDateOnly(r.date),
    time: formatAppointmentTime(r.time),
    status: r.status || 'pending',
    notes: r.notes || '',
    client_name: r.client_name || 'Client',
    lawyer_name: r.lawyer_name || 'Lawyer',
    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

// POST /api/appointments
router.post('/appointments', async (req, res) => {
  try {
    const body = req.body || {};
    const citizenId = body.citizenId ?? body.citizen_id;
    const lawyerId = body.lawyerId ?? body.lawyer_id;
    const date = body.date ?? body.appointment_date;
    const time = body.time ?? body.appointment_time;
    const notes = body.notes;
    if (citizenId == null || lawyerId == null || !date || !time) {
      return res.status(400).json({ success: false, message: 'Missing required fields (citizen, lawyer, date, time)' });
    }
    const cid = parseInt(citizenId, 10);
    const lid = parseInt(lawyerId, 10);
    if (isNaN(cid) || isNaN(lid)) {
      return res.status(400).json({ success: false, message: 'Invalid user or lawyer id' });
    }
    if (cid === lid) {
      return res.status(400).json({ success: false, message: 'You cannot book an appointment with yourself.' });
    }

    const [citizenRows] = await pool.query(
      `SELECT id, role FROM users WHERE id = ? LIMIT 1`,
      [cid]
    );
    if (!citizenRows.length) {
      return res.status(400).json({
        success: false,
        message: 'Your account was not found. Please log out and log in again as a Client.',
      });
    }
    if (citizenRows[0].role !== 'client') {
      return res.status(400).json({
        success: false,
        message: 'Only client accounts can book lawyers. Log in with role Client.',
      });
    }

    const [lawyerRows] = await pool.query(
      `SELECT id, role FROM users WHERE id = ? AND role = 'lawyer' LIMIT 1`,
      [lid]
    );
    if (!lawyerRows.length) {
      return res.status(400).json({ success: false, message: 'Selected lawyer was not found.' });
    }

    const mysqlDate = toMySQLDate(date);
    const mysqlTime = toMySQLTime(time);
    if (!mysqlDate) {
      return res.status(400).json({ success: false, message: 'Invalid date format. Use YYYY-MM-DD.' });
    }
    if (!mysqlTime || !/^\d{2}:\d{2}:\d{2}$/.test(mysqlTime)) {
      return res.status(400).json({ success: false, message: 'Invalid time format.' });
    }

    const noteText = notes ? String(notes).trim().slice(0, 500) : null;

    // Active appointments only (pending + accepted) block the slot
    const [citizenConflict] = await pool.query(
      `SELECT appointment_id FROM appointments 
       WHERE citizen_id = ? AND date = ? AND TIME_FORMAT(time, '%H:%i:%s') = ?
         AND status IN ('pending', 'accepted')`,
      [cid, mysqlDate, mysqlTime]
    );
    if (citizenConflict.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You already have an appointment at this date and time. Please choose a different slot.'
      });
    }

    const [existing] = await pool.query(
      `SELECT appointment_id FROM appointments 
       WHERE lawyer_id = ? AND date = ? AND TIME_FORMAT(time, '%H:%i:%s') = ?
         AND status IN ('pending', 'accepted')`,
      [lid, mysqlDate, mysqlTime]
    );
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked by another user. Please choose a different time.'
      });
    }

    const [result] = await pool.query(
      `INSERT INTO appointments (citizen_id, lawyer_id, date, time, status, notes)
       VALUES (?, ?, ?, ?, 'pending', ?)`,
      [cid, lid, mysqlDate, mysqlTime, noteText]
    );
    if (result && result.affectedRows !== 1) {
      return res.status(500).json({ success: false, message: 'Appointment could not be saved.' });
    }
    res.json({
      success: true,
      message: 'Appointment request sent',
      appointment_id: result.insertId,
      status: 'pending',
    });
  } catch (err) {
    console.error('Appointment insert error:', err.message);
    let msg = err.message;
    if (err.code === 'ER_NO_SUCH_TABLE') {
      msg = 'Appointments table missing. Run lawpal-backend/chat_schema.sql in MySQL (e.g. phpMyAdmin).';
    } else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      msg = 'User or lawyer not found in database. Ensure you are logged in and the lawyer exists.';
    } else if (err.code === 'ER_DUP_ENTRY') {
      msg = 'You already have an appointment at this date and time. Please choose a different slot.';
    }
    res.status(400).json({ success: false, message: msg });
  }
});

// GET /api/appointments/availability - must be before /:userId
router.get('/appointments/availability', async (req, res) => {
  try {
    const { lawyerId, date } = req.query;
    if (!lawyerId || !date) {
      return res.status(400).json({ success: false, message: 'Missing lawyerId or date' });
    }
    const mysqlDate = toMySQLDate(date);
    const [rows] = await pool.query(
      `SELECT a.appointment_id, a.date, a.time, a.citizen_id, a.lawyer_id, a.status
       FROM appointments a
       WHERE a.lawyer_id = ? AND a.date = ?
         AND a.status IN ('pending', 'accepted')
       ORDER BY a.time ASC`,
      [lawyerId, mysqlDate]
    );
    res.json({ success: true, appointments: rows.map(mapAppointmentRow) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/appointments/stats/:lawyerId - counts for lawyer dashboard
router.get('/appointments/stats/:lawyerId', async (req, res) => {
  try {
    const lawyerId = parseInt(req.params.lawyerId, 10);
    if (isNaN(lawyerId)) {
      return res.status(400).json({ success: false, message: 'Invalid lawyer id' });
    }
    const [rows] = await pool.query(
      `SELECT
         SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
         SUM(CASE WHEN status = 'accepted' AND date >= CURDATE() THEN 1 ELSE 0 END) AS upcoming,
         SUM(CASE WHEN status = 'accepted' AND date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) AS next7
       FROM appointments
       WHERE lawyer_id = ?`,
      [lawyerId]
    );
    const s = rows[0] || {};
    res.json({
      success: true,
      stats: {
        pending: Number(s.pending) || 0,
        upcoming: Number(s.upcoming) || 0,
        next7: Number(s.next7) || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/appointments/:userId
router.get('/appointments/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user id' });
    }
    const { status, role } = req.query;
    let sql = `
      SELECT a.appointment_id, a.date, a.time, a.citizen_id, a.lawyer_id,
        a.status, a.notes, a.created_at, a.updated_at,
        COALESCE(NULLIF(TRIM(c.full_name), ''), SUBSTRING_INDEX(c.email, '@', 1), 'Client') AS client_name,
        COALESCE(NULLIF(TRIM(l.full_name), ''), SUBSTRING_INDEX(l.email, '@', 1), 'Lawyer') AS lawyer_name
      FROM appointments a
      LEFT JOIN users c ON c.id = a.citizen_id
      LEFT JOIN users l ON l.id = a.lawyer_id
      WHERE (a.citizen_id = ? OR a.lawyer_id = ?)
    `;
    const params = [userId, userId];
    if (role === 'lawyer') {
      sql = sql.replace('WHERE (a.citizen_id = ? OR a.lawyer_id = ?)', 'WHERE a.lawyer_id = ?');
      params.length = 0;
      params.push(userId);
    } else if (role === 'client') {
      sql = sql.replace('WHERE (a.citizen_id = ? OR a.lawyer_id = ?)', 'WHERE a.citizen_id = ?');
      params.length = 0;
      params.push(userId);
    }
    if (status) {
      const statuses = String(status).split(',').map((s) => s.trim()).filter(Boolean);
      if (statuses.length === 1) {
        sql += ' AND a.status = ?';
        params.push(statuses[0]);
      } else if (statuses.length > 1) {
        sql += ` AND a.status IN (${statuses.map(() => '?').join(',')})`;
        params.push(...statuses);
      }
    }
    sql += ' ORDER BY a.date ASC, a.time ASC';
    const [rows] = await pool.query(sql, params);
    res.json({ success: true, appointments: rows.map(mapAppointmentRow) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/appointments/:id/status - lawyer accept/reject or cancel
router.patch('/appointments/:id/status', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { userId, status } = req.body;
    const allowed = ['pending', 'accepted', 'rejected', 'cancelled'];
    if (!userId || !status || !allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'userId and valid status required' });
    }
    const uid = parseInt(userId, 10);
    if (isNaN(id) || isNaN(uid)) {
      return res.status(400).json({ success: false, message: 'Invalid id' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM appointments WHERE appointment_id = ?',
      [id]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    const apt = rows[0];
    const isLawyer = Number(apt.lawyer_id) === uid;
    const isClient = Number(apt.citizen_id) === uid;
    if (!isLawyer && !isClient) {
      return res.status(403).json({ success: false, message: 'Not allowed' });
    }

    // Clients can only cancel; lawyers can accept/reject/cancel
    if (isClient && !isLawyer && status !== 'cancelled') {
      return res.status(403).json({ success: false, message: 'Clients can only cancel appointments' });
    }
    if (isLawyer && (status === 'accepted' || status === 'rejected') && apt.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Only pending requests can be accepted or rejected' });
    }

    if (status === 'accepted') {
      const [conflict] = await pool.query(
        `SELECT appointment_id FROM appointments
         WHERE lawyer_id = ? AND date = ? AND TIME_FORMAT(time, '%H:%i:%s') = TIME_FORMAT(?, '%H:%i:%s')
           AND status = 'accepted' AND appointment_id <> ?`,
        [apt.lawyer_id, apt.date, apt.time, id]
      );
      if (conflict.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'You already have an accepted appointment in this slot.',
        });
      }
    }

    await pool.query(
      'UPDATE appointments SET status = ? WHERE appointment_id = ?',
      [status, id]
    );
    res.json({ success: true, message: `Appointment ${status}`, status });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/appointments/:id
router.delete('/appointments/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: 'userId required' });
    // Soft-cancel when status column exists; fall back to delete
    const [r] = await pool.query(
      `UPDATE appointments SET status = 'cancelled'
       WHERE appointment_id = ? AND (citizen_id = ? OR lawyer_id = ?)
         AND status IN ('pending', 'accepted')`,
      [id, userId, userId]
    );
    if (r.affectedRows === 0) {
      const [del] = await pool.query(
        'DELETE FROM appointments WHERE appointment_id = ? AND (citizen_id = ? OR lawyer_id = ?)',
        [id, userId, userId]
      );
      if (del.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }
    }
    res.json({ success: true, message: 'Cancelled' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/sendMessage
router.post('/sendMessage', async (req, res) => {
  try {
    const { senderId, receiverId, senderRole, message, appointmentId } = req.body;
    if (!senderId || !receiverId || !senderRole || !message) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }
    const [r] = await pool.query(
      'INSERT INTO chat (sender_id, receiver_id, appointment_id, sender_role, message) VALUES (?, ?, ?, ?, ?)',
      [senderId, receiverId, appointmentId || null, senderRole, message]
    );
    res.json({ success: true, chatId: r.insertId, message: 'Message sent' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/uploadDocument - single file field named 'file'
router.post('/uploadDocument', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file' });
    const { senderId, receiverId, senderRole, appointmentId } = req.body;
    if (!senderId || !receiverId || !senderRole) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }
    const docUrl = '/uploads/' + req.file.filename;
    await pool.query(
      'INSERT INTO chat (sender_id, receiver_id, appointment_id, sender_role, document_url, document_name) VALUES (?, ?, ?, ?, ?, ?)',
      [senderId, receiverId, appointmentId || null, senderRole, docUrl, req.file.originalname]
    );
    res.json({
      success: true,
      documentUrl: docUrl,
      documentName: req.file.originalname,
      message: 'Document uploaded'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/getMessages/:userId
router.get('/getMessages/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const otherUserId = req.query.otherUserId ? parseInt(req.query.otherUserId, 10) : null;
    if (isNaN(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user id' });
    }
    let sql = `
      SELECT c.chat_id, c.sender_id, c.receiver_id, c.sender_role, c.message,
        c.document_url, c.document_name, c.timestamp,
        COALESCE(NULLIF(TRIM(u.full_name), ''), 'User') AS sender_name
      FROM chat c
      LEFT JOIN users u ON u.id = c.sender_id
      WHERE (c.sender_id = ? OR c.receiver_id = ?)
    `;
    const params = [userId, userId];
    if (otherUserId) {
      sql += ' AND ((c.sender_id = ? AND c.receiver_id = ?) OR (c.sender_id = ? AND c.receiver_id = ?))';
      params.push(userId, otherUserId, otherUserId, userId);
    }
    sql += ' ORDER BY c.timestamp ASC';
    const [rows] = await pool.query(sql, params);
    res.json({ success: true, messages: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/getChatHistory/:userId
router.get('/getChatHistory/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user id' });
    }
    const [rows] = await pool.query(
      `WITH last_msg AS (
        SELECT sender_id, receiver_id, message, document_name, timestamp,
          ROW_NUMBER() OVER (PARTITION BY
            CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END
            ORDER BY timestamp DESC) rn
        FROM chat
        WHERE sender_id = ? OR receiver_id = ?
      )
      SELECT
        CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END AS other_user_id,
        (SELECT COALESCE(NULLIF(TRIM(full_name), ''), 'User') FROM users WHERE id = (CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END)) AS other_user_name,
        (SELECT role FROM users WHERE id = (CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END)) AS other_user_role,
        message AS last_message, document_name, timestamp AS last_message_at
      FROM last_msg WHERE rn = 1`,
      [userId, userId, userId, userId, userId, userId]
    );
    res.json({ success: true, chats: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
