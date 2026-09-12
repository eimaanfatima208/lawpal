-- LawPal Chat Schema
-- Run this after the main schema.sql to add chat and appointments tables
-- Citizen = client in our users table

USE lawpal;

-- Appointments table: links citizens (clients) with lawyers
-- UNIQUE (citizen_id, date, time) = one appointment per citizen per date+time (no double-booking)
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    citizen_id INT NOT NULL,
    lawyer_id INT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status ENUM('pending', 'accepted', 'rejected', 'cancelled') NOT NULL DEFAULT 'pending',
    notes VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (citizen_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lawyer_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_citizen_datetime (citizen_id, date, time),
    INDEX idx_citizen (citizen_id),
    INDEX idx_lawyer (lawyer_id),
    INDEX idx_status (status),
    INDEX idx_lawyer_date (lawyer_id, date)
);

-- Safe upgrades for existing databases
-- ALTER TABLE appointments ADD COLUMN status ENUM('pending','accepted','rejected','cancelled') NOT NULL DEFAULT 'pending';
-- ALTER TABLE appointments ADD COLUMN notes VARCHAR(500) NULL;
-- ALTER TABLE appointments ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Chat table: stores all messages between two users
-- appointment_id is optional - links chat to an appointment when available
CREATE TABLE IF NOT EXISTS chat (
    chat_id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    appointment_id INT NULL,
    sender_role ENUM('client', 'lawyer', 'admin') NOT NULL,
    message TEXT NULL,
    document_url VARCHAR(500) NULL,
    document_name VARCHAR(255) NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE SET NULL,
    INDEX idx_sender (sender_id),
    INDEX idx_receiver (receiver_id),
    INDEX idx_appointment (appointment_id),
    INDEX idx_timestamp (timestamp)
);
