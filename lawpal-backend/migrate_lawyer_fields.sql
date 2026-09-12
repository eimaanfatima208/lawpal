-- LawPal lawyer profile columns (run against existing `lawpal` database)
USE lawpal;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS serial_no_hc VARCHAR(32) NULL UNIQUE AFTER role,
  ADD COLUMN IF NOT EXISTS father_name VARCHAR(255) NULL AFTER serial_no_hc,
  ADD COLUMN IF NOT EXISTS lc_enr_date DATE NULL AFTER father_name,
  ADD COLUMN IF NOT EXISTS hc_enr_date DATE NULL AFTER lc_enr_date,
  ADD COLUMN IF NOT EXISTS specialty VARCHAR(120) NULL AFTER hc_enr_date,
  ADD COLUMN IF NOT EXISTS education VARCHAR(255) NULL AFTER specialty,
  ADD COLUMN IF NOT EXISTS city VARCHAR(100) NULL AFTER education,
  ADD COLUMN IF NOT EXISTS gender ENUM('male', 'female', 'other') NULL AFTER city;

-- MySQL versions without IF NOT EXISTS on ADD COLUMN — safe re-run helper:
-- Ignore duplicate column errors if already applied.
