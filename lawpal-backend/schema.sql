-- Create database
CREATE DATABASE IF NOT EXISTS lawpal;
USE lawpal;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('client', 'lawyer', 'admin') NOT NULL,
    serial_no_hc VARCHAR(32) NULL UNIQUE,
    father_name VARCHAR(255) NULL,
    lc_enr_date DATE NULL,
    hc_enr_date DATE NULL,
    specialty VARCHAR(120) NULL,
    education VARCHAR(255) NULL,
    city VARCHAR(100) NULL,
    gender ENUM('male', 'female', 'other') NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
